---
description: Đọc file Excel, tạo bảng PostgreSQL và import dữ liệu lên Supabase tự động
argument-hint: <đường_dẫn_file.xlsx> [tên_sheet] [số_dòng_header]
---

# Excel → Supabase Table

Bạn là trợ lý tự động hóa database. Khi được gọi với lệnh này, thực hiện **toàn bộ pipeline** sau:

## Đầu vào

`$ARGUMENTS` — phân tích theo format: `<file_path> [sheet_name] [header_row]`

- `file_path` (bắt buộc): đường dẫn file `.xlsx` hoặc `.xls`
- `sheet_name` (tuỳ chọn): tên sheet, mặc định lấy sheet đầu tiên
- `header_row` (tuỳ chọn): số dòng chứa tên cột (1-indexed), mặc định tự phát hiện

---

## Bước 1 — Đọc file Excel

Dùng Node.js với thư viện `xlsx` (đã cài sẵn):

```js
const xlsx = require('xlsx');
const wb = xlsx.readFile('<file_path>');
// Lấy sheet theo tên hoặc sheet đầu tiên
const ws = wb.Sheets[sheet_name || wb.SheetNames[0]];
```

**Tự phát hiện dòng header**: quét từ dòng 1 đến dòng 10, chọn dòng đầu tiên có ≥ 50% ô chứa chuỗi văn bản (không phải số thuần).

Đọc **toàn bộ** tên cột và **5 dòng mẫu** để xác định kiểu dữ liệu.

---

## Bước 2 — Chuyển tên cột sang snake_case không dấu

Áp dụng **tuần tự** các bước sau cho mỗi tên cột:

### 2a. Bỏ dấu tiếng Việt
```
à á ả ã ạ ă ắ ặ ằ ẵ ẳ â ấ ầ ẩ ẫ ậ → a
đ → d
è é ẻ ẽ ẹ ê ế ề ể ễ ệ → e
ì í ỉ ĩ ị → i
ò ó ỏ õ ọ ô ố ồ ổ ỗ ộ ơ ớ ờ ở ỡ ợ → o
ù ú ủ ũ ụ ư ứ ừ ử ữ ự → u
ỳ ý ỷ ỹ ỵ → y
(uppercase tương tự)
```

### 2b. Chuẩn hóa
- Chuyển về lowercase
- Thay khoảng trắng, `/`, `-`, `(`, `)`, `.`, `,` bằng `_`
- Xóa ký tự đặc biệt còn lại (giữ a-z, 0-9, _)
- Gộp nhiều `_` liên tiếp thành một
- Bỏ `_` ở đầu và cuối
- Nếu tên bắt đầu bằng số → thêm tiền tố `col_`

**Ví dụ**: `Ngày phát hành` → `ngay_phat_hanh`, `Tỷ lệ lỗi (%)` → `ty_le_loi`

---

## Bước 3 — Xác định kiểu dữ liệu PostgreSQL

Phân tích các giá trị mẫu (bỏ qua NULL/rỗng):

| Điều kiện mẫu | Kiểu PostgreSQL |
|---|---|
| Tất cả là `0`/`1` hoặc `true`/`false` | `BOOLEAN` |
| Số nguyên, max ≤ 32767 | `SMALLINT` |
| Số nguyên > 32767 | `INTEGER` hoặc `BIGINT` |
| Có dấu thập phân | `NUMERIC(15,4)` |
| Excel serial date (số 30000–50000) | `DATE` |
| Chuỗi dạng `YYYY-MM-DD` hoặc `DD/MM/YYYY` | `DATE` |
| Chuỗi dạng timestamp | `TIMESTAMPTZ` |
| UUID pattern | `UUID` |
| Chuỗi ngắn ≤ 50 chars, ít unique | `VARCHAR(100)` |
| Chuỗi dài > 100 chars | `TEXT` |
| Mặc định | `TEXT` |

Cột có tên chứa `date`/`ngay`/`deadline` → ưu tiên `DATE`/`TIMESTAMPTZ`  
Cột có tên chứa `is_`/`is`/`active`/`flag` → ưu tiên `BOOLEAN`  
Cột có tên chứa `price`/`cost`/`amount`/`phi`/`tien` → ưu tiên `BIGINT` hoặc `NUMERIC`  
Cột có tên là `id` dạng UUID → `UUID`

---

## Bước 4 — Sinh file SQL

Tạo file tại `phase2/<table_name>.sql` với cấu trúc:

```sql
-- Nguồn: <file_path> / sheet: <sheet_name>
-- Tên cột gốc → snake_case không dấu

CREATE TABLE IF NOT EXISTS public.<table_name> (
  id          BIGSERIAL PRIMARY KEY,
  -- ... các cột từ Excel ...
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes trên các cột thường dùng lọc (boolean, integer, varchar ngắn)
-- Trigger auto-update updated_at
-- RLS enable + policy admin đọc/ghi
-- COMMENT mô tả nguồn dữ liệu
```

**Quy tắc đặt tên bảng**: lấy tên file (bỏ đuôi), bỏ dấu, snake_case, bỏ các từ thừa như `bang_`, `template_`, `official_`, `v1_`, `v2_` ở cuối.

---

## Bước 5 — Chạy lên Supabase

Đọc credentials từ `.env`:
```
SUPABASE_ACCESS_TOKEN=...
SUPABASE_PROJECT_REF=...
```

Nếu chưa link: `npx supabase link --project-ref <ref> --password <pass>`

Chạy SQL:
```bash
$env:SUPABASE_ACCESS_TOKEN = "<token>"
npx supabase db query --linked --file "phase2/<table_name>.sql"
```

Sau khi tạo bảng thành công → **hỏi người dùng**: "Bạn có muốn import dữ liệu từ Excel vào bảng luôn không?"

---

## Bước 6 — Import dữ liệu (nếu đồng ý)

1. Tạo file `phase2/generate_<table_name>_import.js`:
   - Đọc Excel, bỏ dòng header
   - Convert từng giá trị theo kiểu cột (date serial, boolean, NULL)
   - Escape SQL string: `replace(/'/g, "''")`
   - Sinh INSERT ... ON CONFLICT (cột unique đầu tiên) DO UPDATE
   
2. Chạy `node phase2/generate_<table_name>_import.js` → sinh `phase2/<table_name>_import.sql`

3. Chạy import:
```bash
npx supabase db query --linked --file "phase2/<table_name>_import.sql"
```

4. Xác nhận bằng `SELECT COUNT(*) FROM <table_name>;`

---

## Xử lý lỗi thường gặp

| Lỗi | Xử lý |
|---|---|
| `null value in column ... not-null` | Cột boolean/not-null → thêm `DEFAULT` phù hợp |
| `duplicate key ... unique constraint` | Bỏ UNIQUE constraint trên cột bị trùng: `ALTER TABLE DROP CONSTRAINT` |
| `hostname resolving error` | Dùng `--linked` thay vì `--db-url` |
| `Access token not provided` | Set `$env:SUPABASE_ACCESS_TOKEN` từ `.env` trước khi chạy |
| Sheet không tìm thấy | In ra danh sách sheets, hỏi người dùng chọn |

---

## Báo cáo kết quả

Sau khi hoàn thành, in bảng tóm tắt:
```
✅ Bảng: <table_name>
   File SQL: phase2/<table_name>.sql
   Số cột: X (+ id, created_at, updated_at)
   Dòng import: N
   Supabase: https://supabase.com/dashboard/project/<ref>/editor
```
