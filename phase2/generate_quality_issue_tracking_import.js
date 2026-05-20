const xlsx = require('xlsx');
const fs   = require('fs');
const path = require('path');

const wb   = xlsx.readFile(path.join(__dirname, 'quality_issue_tracking_schema.xlsx'));
const ws   = wb.Sheets['quality_issue_tracking'];
const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

console.log('Rows read:', rows.length);

function esc(v) {
  if (v === null || v === '' || String(v).trim() === 'NULL' || String(v).trim() === '') return 'NULL';
  return "'" + String(v).replace(/'/g, "''").trim() + "'";
}
function toInt(v) {
  if (v === null || v === '' || String(v).trim() === 'NULL') return 'NULL';
  const n = parseInt(v);
  return isNaN(n) ? 'NULL' : n;
}
function toNum(v) {
  if (v === null || v === '' || String(v).trim() === 'NULL') return 'NULL';
  const n = parseFloat(v);
  return isNaN(n) ? 'NULL' : n;
}
function toBigInt(v) {
  if (v === null || v === '' || String(v).trim() === 'NULL') return 'NULL';
  const n = parseInt(v);
  return isNaN(n) ? 0 : n;
}
function toDate(v) {
  if (v === null || v === '' || String(v).trim() === 'NULL' || String(v).trim() === '') return 'NULL';
  const n = parseFloat(v);
  if (!isNaN(n) && n > 25000 && n < 60000) {
    const d = new Date((n - 25569) * 86400000);
    return "'" + d.toISOString().split('T')[0] + "'";
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? 'NULL' : "'" + d.toISOString().split('T')[0] + "'";
}

const COLUMNS = [
  'stt','month','week','ngay_phat_hanh','ma_so_ncr','phan_loai','level_claim',
  'bo_phan','noi_phat_sinh','khach_hang_vender','loai_khach_hang','code_sp',
  'loai_san_pham','model','so_luong_lot','so_luong_kiem_tra','so_luong_ng',
  'ty_le_loi','ten_loi','lap_lai_loi_moi','action_ngan_han','nguyen_nhan',
  'action_cai_tien','ban_chat','deadline_tra_loi','ngay_tra_loi_thuc_te',
  'so_ngay_qua_han','nha_may','chi_phi_thiet_hai','so_tien_boi_hoan',
  'bphan_trach_nhiem','pic','quan_ly_bo_phan','tinh_trang','sao_den',
  'sao_vang','theo_doi_ket_qua','ly_do','ghi_chu'
];

const COL_TYPES = {
  stt: 'integer', month: 'smallint', week: 'character varying',
  ngay_phat_hanh: 'date', ma_so_ncr: 'character varying',
  phan_loai: 'character varying', level_claim: 'character varying',
  bo_phan: 'character varying', noi_phat_sinh: 'character varying',
  khach_hang_vender: 'character varying', loai_khach_hang: 'character varying',
  code_sp: 'character varying', loai_san_pham: 'character varying',
  model: 'character varying', so_luong_lot: 'integer',
  so_luong_kiem_tra: 'integer', so_luong_ng: 'integer',
  ty_le_loi: 'numeric', ten_loi: 'text',
  lap_lai_loi_moi: 'character varying', action_ngan_han: 'text',
  nguyen_nhan: 'text', action_cai_tien: 'text',
  ban_chat: 'character varying', deadline_tra_loi: 'date',
  ngay_tra_loi_thuc_te: 'date', so_ngay_qua_han: 'integer',
  nha_may: 'character varying', chi_phi_thiet_hai: 'bigint',
  so_tien_boi_hoan: 'bigint', bphan_trach_nhiem: 'character varying',
  pic: 'character varying', quan_ly_bo_phan: 'character varying',
  tinh_trang: 'character varying', sao_den: 'character varying',
  sao_vang: 'character varying', theo_doi_ket_qua: 'text',
  ly_do: 'text', ghi_chu: 'text'
};

// Skip rows where ma_so_ncr is null/empty
const validRows = rows.filter(r => r.ma_so_ncr && String(r.ma_so_ncr).trim() !== '');
console.log('Valid rows (ma_so_ncr not empty):', validRows.length);

const lines = validRows.map(r => {
  const vals = COLUMNS.map(col => {
    const v = r[col] !== undefined ? r[col] : null;
    const dtype = COL_TYPES[col];
    if (dtype === 'integer' || dtype === 'smallint') return toInt(v);
    if (dtype === 'bigint')  return toBigInt(v);
    if (dtype === 'numeric') return toNum(v);
    if (dtype === 'date')    return toDate(v);
    return esc(v);
  });
  return '  (' + vals.join(', ') + ')';
});

const sql = `-- Import ${validRows.length} dòng vào quality_issue_tracking
-- Nguồn: phase2/quality_issue_tracking_schema.xlsx | ${new Date().toISOString()}
-- Chiến lược: ON CONFLICT (ma_so_ncr) DO NOTHING (bỏ qua dòng trùng)
-- Index: quality_issue_ma_so_idx (ma_so_ncr)

INSERT INTO public.quality_issue_tracking (${COLUMNS.join(', ')})
VALUES
${lines.join(',\n')}
ON CONFLICT (ma_so_ncr) DO NOTHING;
`;

const outPath = path.join(__dirname, 'quality_issue_tracking_import.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Generated: ' + validRows.length + ' rows → phase2/quality_issue_tracking_import.sql');
