const xlsx = require('xlsx');
const path = require('path');

// Dữ liệu cột từ bảng quality_issue_tracking
const columns = [
  { stt: 1,  ten_cot: 'id',                   kieu_du_lieu: 'bigint',                    bat_buoc: 'Có (auto)',   mac_dinh: 'auto-increment',  mo_ta: 'Khóa chính tự tăng' },
  { stt: 2,  ten_cot: 'stt',                  kieu_du_lieu: 'integer',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Số thứ tự' },
  { stt: 3,  ten_cot: 'month',                kieu_du_lieu: 'smallint',                  bat_buoc: '',            mac_dinh: '',                mo_ta: 'Tháng (1–12)' },
  { stt: 4,  ten_cot: 'week',                 kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Tuần (W1…W52)' },
  { stt: 5,  ten_cot: 'ngay_phat_hanh',       kieu_du_lieu: 'date',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Ngày phát hành NCR/CAR' },
  { stt: 6,  ten_cot: 'ma_so_ncr',            kieu_du_lieu: 'varchar',                   bat_buoc: 'Có (UNIQUE)', mac_dinh: '',                mo_ta: 'Mã số NCR / CAR / 8D / A3 — khóa nghiệp vụ' },
  { stt: 7,  ten_cot: 'phan_loai',            kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Phân loại: NCR / CAR / 8D / A3' },
  { stt: 8,  ten_cot: 'level_claim',          kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Level claim: A / B / C' },
  { stt: 9,  ten_cot: 'bo_phan',              kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Bộ phận: IQC / PQC / OQC...' },
  { stt: 10, ten_cot: 'noi_phat_sinh',        kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Nơi phát sinh issue' },
  { stt: 11, ten_cot: 'khach_hang_vender',    kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Khách hàng / Vender (IQC)' },
  { stt: 12, ten_cot: 'loai_khach_hang',      kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Loại khách hàng' },
  { stt: 13, ten_cot: 'code_sp',              kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Code sản phẩm' },
  { stt: 14, ten_cot: 'loai_san_pham',        kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Loại sản phẩm (IQC / giấy / mực...)' },
  { stt: 15, ten_cot: 'model',                kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Model sản phẩm' },
  { stt: 16, ten_cot: 'so_luong_lot',         kieu_du_lieu: 'integer',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Số lượng Lot' },
  { stt: 17, ten_cot: 'so_luong_kiem_tra',    kieu_du_lieu: 'integer',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Số lượng kiểm tra' },
  { stt: 18, ten_cot: 'so_luong_ng',          kieu_du_lieu: 'integer',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Số lượng NG (Not Good)' },
  { stt: 19, ten_cot: 'ty_le_loi',            kieu_du_lieu: 'numeric',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Tỷ lệ lỗi = so_luong_ng / so_luong_kiem_tra' },
  { stt: 20, ten_cot: 'ten_loi',              kieu_du_lieu: 'text',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Tên lỗi chi tiết' },
  { stt: 21, ten_cot: 'lap_lai_loi_moi',      kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Lập lại / lỗi mới (tính trong 3 tháng)' },
  { stt: 22, ten_cot: 'action_ngan_han',      kieu_du_lieu: 'text',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Action ngắn hạn: Sorting / Stop line / DO?' },
  { stt: 23, ten_cot: 'nguyen_nhan',          kieu_du_lieu: 'text',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Nguyên nhân' },
  { stt: 24, ten_cot: 'action_cai_tien',      kieu_du_lieu: 'text',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Action cải tiến dài hạn' },
  { stt: 25, ten_cot: 'ban_chat',             kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Bản chất: Man / Material / System / Machine / Environment' },
  { stt: 26, ten_cot: 'deadline_tra_loi',     kieu_du_lieu: 'date',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Deadline trả lời' },
  { stt: 27, ten_cot: 'ngay_tra_loi_thuc_te', kieu_du_lieu: 'date',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Ngày trả lời thực tế' },
  { stt: 28, ten_cot: 'so_ngay_qua_han',      kieu_du_lieu: 'integer',                   bat_buoc: '',            mac_dinh: '0',               mo_ta: 'Số ngày quá hạn (âm = trả sớm, dương = trễ)' },
  { stt: 29, ten_cot: 'nha_may',              kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Nhà máy: 1A / 1B / GS6' },
  { stt: 30, ten_cot: 'chi_phi_thiet_hai',    kieu_du_lieu: 'bigint',                    bat_buoc: '',            mac_dinh: '0',               mo_ta: 'Chi phí thiệt hại (VNĐ)' },
  { stt: 31, ten_cot: 'so_tien_boi_hoan',     kieu_du_lieu: 'bigint',                    bat_buoc: '',            mac_dinh: '0',               mo_ta: 'Số tiền bồi hoàn (VNĐ)' },
  { stt: 32, ten_cot: 'bphan_trach_nhiem',    kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Bộ phận trách nhiệm chính' },
  { stt: 33, ten_cot: 'pic',                  kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'PIC — người phụ trách' },
  { stt: 34, ten_cot: 'quan_ly_bo_phan',      kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Quản lý bộ phận' },
  { stt: 35, ten_cot: 'tinh_trang',           kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Tình trạng: Hoàn thành / Đang xử lý...' },
  { stt: 36, ten_cot: 'sao_den',              kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Sao đen' },
  { stt: 37, ten_cot: 'sao_vang',             kieu_du_lieu: 'varchar',                   bat_buoc: '',            mac_dinh: '',                mo_ta: 'Sao vàng' },
  { stt: 38, ten_cot: 'theo_doi_ket_qua',     kieu_du_lieu: 'text',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Theo dõi kết quả' },
  { stt: 39, ten_cot: 'ly_do',                kieu_du_lieu: 'text',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Lý do' },
  { stt: 40, ten_cot: 'ghi_chu',              kieu_du_lieu: 'text',                      bat_buoc: '',            mac_dinh: '',                mo_ta: 'Ghi chú' },
  { stt: 41, ten_cot: 'created_at',           kieu_du_lieu: 'timestamp with time zone',  bat_buoc: '',            mac_dinh: 'now()',            mo_ta: 'Thời điểm tạo bản ghi' },
  { stt: 42, ten_cot: 'updated_at',           kieu_du_lieu: 'timestamp with time zone',  bat_buoc: '',            mac_dinh: 'now()',            mo_ta: 'Thời điểm cập nhật lần cuối' },
];

// Tạo workbook
const wb = xlsx.utils.book_new();

// Sheet 1: Danh sách cột
const ws_cols = xlsx.utils.json_to_sheet(columns, {
  header: ['stt', 'ten_cot', 'kieu_du_lieu', 'bat_buoc', 'mac_dinh', 'mo_ta']
});

// Header tiếng Việt
ws_cols['A1'] = { v: 'STT',           t: 's' };
ws_cols['B1'] = { v: 'Tên Cột',       t: 's' };
ws_cols['C1'] = { v: 'Kiểu Dữ Liệu', t: 's' };
ws_cols['D1'] = { v: 'Bắt Buộc',     t: 's' };
ws_cols['E1'] = { v: 'Mặc Định',     t: 's' };
ws_cols['F1'] = { v: 'Mô Tả',        t: 's' };

// Độ rộng cột
ws_cols['!cols'] = [
  { wch: 5 },   // STT
  { wch: 25 },  // Tên cột
  { wch: 20 },  // Kiểu
  { wch: 14 },  // Bắt buộc
  { wch: 16 },  // Mặc định
  { wch: 55 },  // Mô tả
];

xlsx.utils.book_append_sheet(wb, ws_cols, 'Cấu Trúc Bảng');

// Sheet 2: Template import (dòng header để người dùng điền data)
const template_headers = columns
  .filter(c => !['id','created_at','updated_at'].includes(c.ten_cot))
  .map(c => c.ten_cot);

const ws_template = xlsx.utils.aoa_to_sheet([template_headers]);
ws_template['!cols'] = template_headers.map(() => ({ wch: 20 }));
xlsx.utils.book_append_sheet(wb, ws_template, 'Template Import');

// Xuất file
const outPath = path.join(__dirname, 'quality_issue_tracking_schema.xlsx');
xlsx.writeFile(wb, outPath);
console.log('Đã xuất: ' + outPath);
console.log('Sheets: Cấu Trúc Bảng (' + columns.length + ' cột) | Template Import (' + template_headers.length + ' cột)');
