---
description: Import dữ liệu từ file Excel vào bảng có sẵn trên Supabase
argument-hint: <đường_dẫn_file.xlsx> <tên_bảng> [tên_sheet] [dòng_header]
---

# Excel → Supabase Import Data

Bạn là trợ lý import dữ liệu. Khi được gọi, thực hiện pipeline sau để đọc Excel và INSERT toàn bộ dữ liệu vào bảng Supabase đã tồn tại.

## Đầu vào

`$ARGUMENTS` — phân tích theo format:

```
<file_path> <table_name> [sheet_name] [header_row]
```

| Tham số | Bắt buộc | Mặc định |
|---|---|---|
| `file_path` | ✅ | — |
| `table_name` | ✅ | — |
| `sheet_name` | ❌ | Sheet đầu tiên |
| `header_row` | ❌ | Tự phát hiện |

---

## Bước 1 — Đọc cấu trúc bảng từ Supabase

Trước khi đọc Excel, lấy danh sách cột và kiểu dữ liệu của bảng target:

```bash
$env:SUPABASE_ACCESS_TOKEN = "<từ .env>"
npx supabase db query --linked \
  "SELECT column_name, data_type, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_name = '<table_name>' AND table_schema = 'public'
   ORDER BY ordinal_position;"
```

Lưu mapping: `{ column_name → data_type }` để dùng khi convert dữ liệu.

---

## Bước 2 — Đọc file Excel

```js
const xlsx = require('xlsx');
const wb = xlsx.readFile('<file_path>');
const ws = wb.Sheets[sheet_name || wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws, { defval: null });
```

**Tự phát hiện header row**: nếu không chỉ định, quét dòng 1–10, lấy dòng đầu có ≥ 50% cell là text (không phải số thuần).

In ra: tổng số dòng, danh sách cột Excel đọc được.

---

## Bước 3 — Map cột Excel → cột bảng

So sánh tên cột Excel với tên cột bảng (sau khi convert sang snake_case không dấu):

### Quy tắc convert tên cột Excel sang snake_case:
```
Bỏ dấu tiếng Việt:
  à á ả ã ạ ă ắ ặ ằ ẵ ẳ â ấ ầ ẩ ẫ ậ → a / đ → d
  è é ẻ ẽ ẹ ê ế ề ể ễ ệ → e / ì í ỉ ĩ ị → i
  ò ó ỏ õ ọ ô ố ồ ổ ỗ ộ ơ ớ ờ ở ỡ ợ → o
  ù ú ủ ũ ụ ư ứ ừ ử ữ ự → u / ỳ ý ỷ ỹ ỵ → y

Chuẩn hóa:
  lowercase → thay space/./,/(/)/[/]/+/* bằng _ → xóa ký tự lạ
  → gộp __ liên tiếp → bỏ _ đầu/cuối
```

Tạo mapping `{ cột_excel → cột_bảng }`. Bỏ qua cột Excel không khớp cột nào trong bảng (báo cáo cho người dùng biết).  
Bỏ qua các cột tự sinh: `id`, `created_at`, `updated_at` — Supabase tự điền.

---

## Bước 4 — Viết script generate_import.js

Tạo file `phase2/generate_<table_name>_import.js`:

```js
const xlsx = require('xlsx');
const fs   = require('fs');
const path = require('path');

const wb   = xlsx.readFile(path.join(__dirname, '../<file_path>'));
const ws   = wb.Sheets['<sheet_name>'];
const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

// ── Hàm convert theo kiểu cột ─────────────────────────────
function esc(v) {           // VARCHAR / TEXT
  if (v === null || v === '' || String(v).trim() === 'NULL') return 'NULL';
  return "'" + String(v).replace(/'/g, "''").trim() + "'";
}
function toInt(v) {         // INTEGER / BIGINT / SMALLINT
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseInt(v); return isNaN(n) ? 'NULL' : n;
}
function toNum(v) {         // NUMERIC / DECIMAL
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseFloat(v); return isNaN(n) ? 'NULL' : n;
}
function toBool(v, def = null) {   // BOOLEAN
  if (v === null || v === '' || String(v) === 'NULL')
    return def !== null ? String(def) : 'NULL';
  return (v == 1 || v === true || String(v).toLowerCase() === 'true') ? 'true' : 'false';
}
function toDate(v) {        // DATE — xử lý cả Excel serial và chuỗi
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseFloat(v);
  if (!isNaN(n) && n > 25000 && n < 60000) {
    // Excel serial date → ISO
    return "'" + new Date((n - 25569) * 86400000).toISOString().split('T')[0] + "'";
  }
  // Thử parse chuỗi ngày
  const d = new Date(v);
  return isNaN(d) ? 'NULL' : "'" + d.toISOString() + "'";
}
function toTimestamp(v) {   // TIMESTAMPTZ
  if (v === null || v === '' || String(v) === 'NULL') return 'NULL';
  const n = parseFloat(v);
  if (!isNaN(n) && n > 25000 && n < 60000)
    return "'" + new Date((n - 25569) * 86400000).toISOString() + "'";
  const d = new Date(v);
  return isNaN(d) ? 'NULL' : "'" + d.toISOString() + "'";
}

// ── Column mapping Excel → DB ──────────────────────────────
// <MAPPING_PLACEHOLDER> — được thay bằng mapping thực tế khi generate

const COLUMNS = [/* <danh_sách_cột_bảng_theo_thứ_tự> */];
const COL_TYPES = {/* <column_name: data_type> */};

// ── Sinh INSERT rows ───────────────────────────────────────
const lines = rows.map(r => {
  const vals = COLUMNS.map(col => {
    const rawVal = r[/* tên cột Excel tương ứng */col] ?? null;
    const dtype  = COL_TYPES[col] || 'text';
    if (dtype.includes('int'))       return toInt(rawVal);
    if (dtype.includes('numeric') || dtype.includes('decimal')) return toNum(rawVal);
    if (dtype.includes('bool'))      return toBool(rawVal, col.includes('active') ? true : false);
    if (dtype === 'date')            return toDate(rawVal);
    if (dtype.includes('timestamp')) return toTimestamp(rawVal);
    return esc(rawVal);
  });
  return '  (' + vals.join(', ') + ')';
});

const sql = `-- Import ${rows.length} dòng vào <table_name>
-- Nguồn: <file_path> / ${new Date().toISOString()}

INSERT INTO public.<table_name> (${COLUMNS.join(', ')})
VALUES
${lines.join(',\n')}
ON CONFLICT (<conflict_column>) DO UPDATE SET
  <update_set_clause>
  updated_at = now();
`;

fs.writeFileSync(path.join(__dirname, '<table_name>_import.sql'), sql, 'utf8');
console.log('Done: ' + rows.length + ' rows → phase2/<table_name>_import.sql');
```

**Điền vào script**:
- `COLUMNS`: danh sách cột bảng (bỏ `id`, `created_at`, `updated_at`)
- `COL_TYPES`: map từ kết quả `information_schema.columns`
- `conflict_column`: cột có `UNIQUE` constraint (thường là `username`, `ma_so_ncr`, `email`…)
- `update_set_clause`: các cột cần update khi duplicate (trừ `created_at`)

---

## Bước 5 — Chạy script và import

```bash
# 1. Sinh file SQL
node phase2/generate_<table_name>_import.js

# 2. Kiểm tra nhanh file SQL (10 dòng đầu)
# Đọc phase2/<table_name>_import.sql để verify

# 3. Chạy import lên Supabase
$env:SUPABASE_ACCESS_TOKEN = "<token>"
npx supabase db query --linked --file "phase2/<table_name>_import.sql"
```

---

## Bước 6 — Xác nhận kết quả

```sql
SELECT COUNT(*) as tong_dong FROM public.<table_name>;
```

Nếu có cột boolean `is_active`:
```sql
SELECT
  COUNT(*) as tong,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as hoat_dong,
  SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as da_khoa
FROM public.<table_name>;
```

---

## Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `null value in column ... not-null` | Cột NOT NULL có giá trị NULL trong Excel | Thêm `?? <default>` cho cột đó trong script |
| `duplicate key value violates unique constraint` | Có dòng trùng key | `ALTER TABLE DROP CONSTRAINT <tên_constraint>` hoặc đổi sang `ON CONFLICT DO NOTHING` |
| `invalid input syntax for type date` | Chuỗi ngày sai format | Kiểm tra lại `toDate()`, thêm format DD/MM/YYYY |
| `value too long for type character varying` | Dữ liệu dài hơn khai báo | `ALTER TABLE ALTER COLUMN <col> TYPE TEXT` |
| Cột Excel không map được | Tên cột Excel khác bảng | In warning, bỏ qua cột đó, tiếp tục import |

---

## Báo cáo kết quả

```
✅ Import hoàn thành
   Bảng    : public.<table_name>
   Nguồn   : <file_path>
   Đã import: N dòng
   Bỏ qua  : X cột Excel không khớp (liệt kê tên)
   File SQL : phase2/<table_name>_import.sql
```
