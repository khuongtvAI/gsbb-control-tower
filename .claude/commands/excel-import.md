---
description: Import dữ liệu từ Excel vào bảng Supabase — bỏ qua dòng trùng dựa trên UNIQUE/PRIMARY KEY index của bảng
argument-hint: <đường_dẫn_file.xlsx> <tên_bảng> [tên_sheet] [dòng_header]
---

# Excel → Supabase Import (skip duplicates by index)

Khi được gọi, thực hiện pipeline sau. **Dữ liệu đã tồn tại trong bảng sẽ bị BỎ QUA, không ghi đè.**

## Đầu vào

`$ARGUMENTS` — format: `<file_path> <table_name> [sheet_name] [header_row]`

| Tham số | Bắt buộc | Mặc định |
|---|---|---|
| `file_path` | ✅ | — |
| `table_name` | ✅ | — |
| `sheet_name` | ❌ | Sheet đầu tiên |
| `header_row` | ❌ | Tự phát hiện (dòng đầu có ≥50% text) |

---

## Bước 1 — Đọc cấu trúc bảng và INDEX từ Supabase

Đọc `.env` để lấy `SUPABASE_ACCESS_TOKEN`, set vào `$env:SUPABASE_ACCESS_TOKEN`.

### 1a. Lấy danh sách cột và kiểu dữ liệu:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = '<table_name>' AND table_schema = 'public'
ORDER BY ordinal_position;
```

### 1b. Lấy tất cả UNIQUE và PRIMARY KEY constraints của bảng:

```sql
SELECT
  tc.constraint_name,
  tc.constraint_type,
  string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema   = kcu.table_schema
WHERE tc.table_name   = '<table_name>'
  AND tc.table_schema = 'public'
  AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
GROUP BY tc.constraint_name, tc.constraint_type
ORDER BY tc.constraint_type DESC;
```

**Phân tích kết quả:**
- Nếu có nhiều constraints → dùng cái **không phải `id`** (business key), ưu tiên UNIQUE trước PRIMARY KEY
- Lưu: `CONFLICT_COLS = ['col1', 'col2', ...]` — danh sách cột của constraint đó
- Lưu: `CONFLICT_CONSTRAINT = 'constraint_name'`

> Ví dụ: bảng `users` có `users_username_key (UNIQUE, username)` → dùng `ON CONFLICT (username)`  
> Ví dụ: bảng `quality_issue_tracking` có `quality_issue_ma_so_idx (UNIQUE, ma_so_ncr)` → dùng `ON CONFLICT (ma_so_ncr)`

---

## Bước 2 — Đọc file Excel

```js
const xlsx = require('xlsx');
const wb   = xlsx.readFile('<file_path>');
const ws   = wb.Sheets[sheet_name || wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws, { defval: null });
```

**Tự phát hiện header row**: quét dòng 0–9, lấy dòng đầu có ≥50% cell là chuỗi text (không phải số thuần). In ra số dòng dữ liệu đọc được.

---

## Bước 3 — Map cột Excel → cột bảng

Convert tên cột Excel sang snake_case không dấu:

```
Bỏ dấu: à á ả ã ạ ă ắ ặ → a | đ → d | è é ẻ → e | ò ó ỏ → o | ù ú ủ → u ...
lowercase → thay space/./,/(/)/[/]/+/* → _ → gộp __ → bỏ _ đầu/cuối
```

Tạo `EXCEL_TO_DB = { 'TênCộtExcel': 'ten_cot_db' }`.  
Bỏ qua cột tự sinh của Supabase: `id`, `created_at`, `updated_at`.  
In cảnh báo nếu có cột Excel không map được sang bảng.

---

## Bước 4 — Lấy số dòng hiện tại trong bảng (để báo cáo sau)

```sql
SELECT COUNT(*) AS count_before FROM public.<table_name>;
```

Lưu `COUNT_BEFORE`.

---

## Bước 5 — Tạo script generate_import.js

Tạo file `phase2/generate_<table_name>_import.js` với nội dung đầy đủ:

```js
const xlsx = require('xlsx');
const fs   = require('fs');
const path = require('path');

const wb   = xlsx.readFile(path.join(__dirname, '../<file_path>'));
const ws   = wb.Sheets['<sheet_name>'];
const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

// ── Hàm convert theo kiểu cột ─────────────────────────────
function esc(v) {
  if (v === null || v === '' || String(v).trim() === 'NULL') return 'NULL';
  return "'" + String(v).replace(/'/g, "''").trim() + "'";
}
function toInt(v) {
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseInt(v); return isNaN(n) ? 'NULL' : n;
}
function toNum(v) {
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseFloat(v); return isNaN(n) ? 'NULL' : n;
}
function toBool(v, def = null) {
  if (v === null || v === '' || String(v) === 'NULL')
    return def !== null ? String(def) : 'NULL';
  return (v == 1 || v === true || String(v).toLowerCase() === 'true') ? 'true' : 'false';
}
function toDate(v) {
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseFloat(v);
  if (!isNaN(n) && n > 25000 && n < 60000)
    return "'" + new Date((n - 25569) * 86400000).toISOString().split('T')[0] + "'";
  const d = new Date(v);
  return isNaN(d) ? 'NULL' : "'" + d.toISOString().split('T')[0] + "'";
}
function toTimestamp(v) {
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseFloat(v);
  if (!isNaN(n) && n > 25000 && n < 60000)
    return "'" + new Date((n - 25569) * 86400000).toISOString() + "'";
  const d = new Date(v);
  return isNaN(d) ? 'NULL' : "'" + d.toISOString() + "'";
}

// ── Mapping và config (điền từ schema bảng) ────────────────
const COLUMNS   = [/* cột bảng theo thứ tự, bỏ id/created_at/updated_at */];
const COL_TYPES = {/* 'column_name': 'data_type' từ information_schema */};
const EXCEL_MAP = {/* 'db_col': 'TênCộtTrongExcel' */};

// ── Sinh INSERT rows ───────────────────────────────────────
const lines = rows.map(r => {
  const vals = COLUMNS.map(col => {
    const rawVal = r[EXCEL_MAP[col] ?? col] ?? null;
    const dtype  = COL_TYPES[col] || 'text';
    if (dtype.includes('int'))                        return toInt(rawVal);
    if (dtype.includes('numeric') || dtype.includes('decimal')) return toNum(rawVal);
    if (dtype.includes('bool'))
      return toBool(rawVal, col.startsWith('is_') ? false : null);
    if (dtype === 'date')                             return toDate(rawVal);
    if (dtype.includes('timestamp'))                  return toTimestamp(rawVal);
    return esc(rawVal);
  });
  return '  (' + vals.join(', ') + ')';
});

// ── ON CONFLICT DO NOTHING — bỏ qua dòng đã tồn tại ──────
// Dùng constraint name lấy từ bảng index
const sql = `-- Import ${rows.length} dòng vào <table_name>
-- Nguồn: <file_path> | ${new Date().toISOString()}
-- Chiến lược: ON CONFLICT DO NOTHING (bỏ qua dòng trùng index)
-- Index dùng để kiểm tra trùng: <CONFLICT_CONSTRAINT> (${/* CONFLICT_COLS */''})

INSERT INTO public.<table_name> (${COLUMNS.join(', ')})
VALUES
${lines.join(',\n')}
ON CONFLICT ON CONSTRAINT <CONFLICT_CONSTRAINT> DO NOTHING;
`;

fs.writeFileSync(path.join(__dirname, '<table_name>_import.sql'), sql, 'utf8');
console.log('Generated: ' + rows.length + ' rows → phase2/<table_name>_import.sql');
```

**Lưu ý quan trọng khi điền script:**
- `CONFLICT_CONSTRAINT` = tên constraint lấy từ Bước 1b (ví dụ: `users_username_key`)
- Nếu bảng **chỉ có PRIMARY KEY trên `id`** (không có UNIQUE constraint khác): dùng `ON CONFLICT DO NOTHING` (không chỉ định cột) — PostgreSQL sẽ bỏ qua lỗi unique trên mọi constraint
- Nếu bảng có **composite unique** (nhiều cột): `ON CONFLICT (col1, col2) DO NOTHING`

---

## Bước 6 — Chạy script và import

```bash
# Sinh file SQL
node phase2/generate_<table_name>_import.js

# Kiểm tra 5 dòng đầu của file SQL (dùng Read tool)

# Chạy import
$env:SUPABASE_ACCESS_TOKEN = "<token từ .env>"
npx supabase db query --linked --file "phase2/<table_name>_import.sql"
```

---

## Bước 7 — Đếm kết quả: inserted vs skipped

```sql
SELECT COUNT(*) AS count_after FROM public.<table_name>;
```

Tính:
```
rows_inserted = count_after - count_before
rows_skipped  = total_excel_rows - rows_inserted
```

---

## Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `constraint ... does not exist` | Tên constraint sai | Chạy lại query Bước 1b, copy đúng tên |
| `null value in column ... not-null` | Cột NOT NULL có NULL trong Excel | Thêm `?? <default>` trong script |
| `there is no unique or exclusion constraint` | Bảng không có UNIQUE index phù hợp | Dùng `ON CONFLICT DO NOTHING` không chỉ định cột cụ thể |
| `value too long for type varchar` | Data dài hơn khai báo | `ALTER TABLE ALTER COLUMN <col> TYPE TEXT` rồi import lại |
| Cột Excel không map được | Tên khác bảng | In warning, bỏ qua, tiếp tục |

---

## Báo cáo kết quả cuối

```
✅ Import hoàn thành
   Bảng         : public.<table_name>
   Nguồn        : <file_path> / sheet: <sheet_name>
   Index kiểm tra trùng: <CONFLICT_CONSTRAINT> (<CONFLICT_COLS>)
   Tổng dòng Excel : N
   Đã insert mới   : X  ← count_after - count_before
   Bỏ qua (trùng)  : Y  ← N - X
   File SQL         : phase2/<table_name>_import.sql
```
