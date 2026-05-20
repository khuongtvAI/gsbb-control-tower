-- ============================================================
-- Bảng theo dõi Issue QC 2026
-- Sheet: "Total Quality Issue" — Bảng theo dõi issue QC 2026_Official V1.xlsx
-- Tên cột: dòng 3 (header row) → chuyển không dấu, thay khoảng trắng bằng _
-- Apply: paste vào Supabase SQL Editor → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS quality_issue_tracking (

  -- ── ĐỊNH DANH ──────────────────────────────────────────────
  id                    BIGSERIAL PRIMARY KEY,
  stt                   INTEGER,                        -- No       (STT)
  month                 SMALLINT,                       -- Month    (1–12)
  week                  VARCHAR(10),                    -- WEEK     (W1…W52)

  -- ── THÔNG TIN NCR / CAR ────────────────────────────────────
  ngay_phat_hanh        DATE,                           -- Ngày phát hành
  ma_so_ncr             VARCHAR(50) NOT NULL,           -- Mã số NCR / CAR / 8D / A3
  phan_loai             VARCHAR(20),                    -- Phân loại (NCR / CAR / 8D / A3)
  level_claim           VARCHAR(10),                    -- Level claim (A / B / C)
  bo_phan               VARCHAR(50),                    -- Bộ phận (IQC / PQC / OQC…)
  noi_phat_sinh         VARCHAR(100),                   -- Nơi phát sinh

  -- ── KHÁCH HÀNG / SẢN PHẨM ────────────────────────────────
  khach_hang_vender     VARCHAR(100),                   -- Khách Hàng / Vender (IQC)
  loai_khach_hang       VARCHAR(100),                   -- Loại Khách Hàng
  code_sp               VARCHAR(50),                    -- Code SP
  loai_san_pham         VARCHAR(100),                   -- Loại Sản phẩm (IQC / giấy / mực…)
  model                 VARCHAR(100),                   -- Model

  -- ── SỐ LƯỢNG & LỖI ───────────────────────────────────────
  so_luong_lot          INTEGER,                        -- Số lượng Lot
  so_luong_kiem_tra     INTEGER,                        -- Số lượng kiểm tra
  so_luong_ng           INTEGER,                        -- Số lượng NG
  ty_le_loi             NUMERIC(10,6),                  -- Tỷ lệ lỗi (%)
  ten_loi               TEXT,                           -- Tên lỗi
  lap_lai_loi_moi       VARCHAR(20),                    -- Lập lại / lỗi mới (lập lại tính 3 tháng)

  -- ── XỬ LÝ & CẢI TIẾN ────────────────────────────────────
  action_ngan_han       TEXT,                           -- Action ngắn hạn (Sorting / Stop line / DO?)
  nguyen_nhan           TEXT,                           -- Nguyên nhân
  action_cai_tien       TEXT,                           -- Action Cải tiến
  ban_chat              VARCHAR(100),                   -- Bản chất (Man / Material / System / Machine / Environment)

  -- ── THỜI HẠN ─────────────────────────────────────────────
  deadline_tra_loi      DATE,                           -- Deadline trả lời
  ngay_tra_loi_thuc_te  DATE,                           -- Ngày trả lời thực tế
  so_ngay_qua_han       INTEGER DEFAULT 0,              -- Số ngày quá hạn

  -- ── NHÀ MÁY & CHI PHÍ ───────────────────────────────────
  nha_may               VARCHAR(20),                    -- Nhà máy (1A / 1B / GS6)
  chi_phi_thiet_hai     BIGINT DEFAULT 0,               -- Chi phí thiệt hại (VNĐ)
  so_tien_boi_hoan      BIGINT DEFAULT 0,               -- Số tiền bồi hoàn (VNĐ)

  -- ── TRÁCH NHIỆM ──────────────────────────────────────────
  bphan_trach_nhiem     VARCHAR(100),                   -- Bộ phận trách nhiệm chính
  pic                   VARCHAR(200),                   -- PIC (người phụ trách)
  quan_ly_bo_phan       VARCHAR(200),                   -- Quản lý bộ phận

  -- ── TRẠNG THÁI ───────────────────────────────────────────
  tinh_trang            VARCHAR(50),                    -- Tình trạng (Hoàn thành / Đang xử lý…)
  sao_den               VARCHAR(10),                    -- Sao đen
  sao_vang              VARCHAR(10),                    -- Sao vàng
  theo_doi_ket_qua      TEXT,                           -- Theo dõi kết quả
  ly_do                 TEXT,                           -- Lý do
  ghi_chu               TEXT,                           -- Ghi chú

  -- ── AUDIT ────────────────────────────────────────────────
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ── INDEXES ──────────────────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS quality_issue_ma_so_idx
  ON quality_issue_tracking (ma_so_ncr);

CREATE INDEX IF NOT EXISTS quality_issue_month_idx
  ON quality_issue_tracking (month, week);

CREATE INDEX IF NOT EXISTS quality_issue_bo_phan_idx
  ON quality_issue_tracking (bo_phan);

CREATE INDEX IF NOT EXISTS quality_issue_tinh_trang_idx
  ON quality_issue_tracking (tinh_trang);

CREATE INDEX IF NOT EXISTS quality_issue_nha_may_idx
  ON quality_issue_tracking (nha_may);

CREATE INDEX IF NOT EXISTS quality_issue_phan_loai_idx
  ON quality_issue_tracking (phan_loai);

-- ── AUTO-UPDATE updated_at ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER quality_issue_updated_at
  BEFORE UPDATE ON quality_issue_tracking
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────
ALTER TABLE quality_issue_tracking ENABLE ROW LEVEL SECURITY;

-- CEO / PMO đọc tất cả
CREATE POLICY "admin_read_quality" ON quality_issue_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('ceo','pmo','cfo','tl1')
    )
  );

-- CEO / PMO được insert / update
CREATE POLICY "admin_write_quality" ON quality_issue_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('ceo','pmo')
    )
  );

-- ── COMMENT MÔ TẢ ────────────────────────────────────────────────────────
COMMENT ON TABLE quality_issue_tracking IS
  'Bảng theo dõi Issue QC 2026 — nguồn: Bảng theo dõi issue QC 2026_Official V1.xlsx / sheet Total Quality Issue';

COMMENT ON COLUMN quality_issue_tracking.ma_so_ncr       IS 'Mã số NCR / CAR / 8D / A3 — unique key nghiệp vụ';
COMMENT ON COLUMN quality_issue_tracking.ty_le_loi        IS 'Tỷ lệ lỗi = so_luong_ng / so_luong_kiem_tra';
COMMENT ON COLUMN quality_issue_tracking.so_ngay_qua_han  IS 'Âm = trả lời trước hạn, Dương = trễ hạn';
COMMENT ON COLUMN quality_issue_tracking.ban_chat         IS 'Man / Material / System / Machine / Environment';
