# templates/ — Excel Input Templates

Phase 1 workflow data thật: data owner xuất Excel từ hệ thống (Bravo/MES/QA…) → đặt vào `<domain>/inbox/<YYYY-MM-DD>.xlsx` → chạy `python3 CONTROL_TOWER/extract/refresh_all.py`.

## Cấu trúc

```
templates/
├── finance/
│   ├── inbox/        ← data owner đặt Excel mới vào đây hằng ngày
│   ├── archive/      ← refresh_all.py move file đã xử lý vào đây
│   └── TEMPLATE.xlsx ← format chuẩn (mẫu)
├── customer/
├── production/
├── quality/
├── campaign/
└── samples/          ← 3 file Excel mẫu từ GSF handover
```

## File mẫu (copy từ GS_AI/Data/ khi setup)

```bash
cp ~/Downloads/GS_AI/Data/GSBB_Biz\ Contrl\ Tower_Master_Action_Tracker_W19.xlsx templates/samples/
cp ~/Downloads/GS_AI/Data/20260516_Sale_DulieuKinhDoanhTinhDenT4.xlsx           templates/samples/
cp ~/Downloads/GS_AI/Data/20260506_QC_Du_Lieu_Loi_Thang11_2025.xlsx              templates/samples/
```

## TEMPLATE.xlsx — gồm gì

Mỗi TEMPLATE.xlsx có:
- Sheet "Hướng dẫn sử dụng" — chỉ dẫn data owner format chuẩn
- Sheet "DATA" — bảng nhập liệu với header lock
- Sheet "VALIDATION" — rule validate (data type · range · required)

> Team GSBB xây TEMPLATE.xlsx cho từng domain ở **tuần 2** sau khi schema chốt.
