---
brief_type: report_writing
audience: CEO GSBB · BOD · PMO · Lead P&C · Owner 14 OC · Working Team
purpose: Tài liệu trình bày tổng thể đề án Control Tower & War Room cho GSBB, dễ đọc, không dùng từ chuyên ngành công nghệ, làm rõ "làm gì - khi nào - ai làm - hết bao nhiêu - được gì"
language: Tiếng Việt — business-friendly, không dùng tech term
length_target: 12-15 trang A4 (~5.000-6.000 từ)
output_format: Markdown file — lưu vào `docs/REPORT-Tổng_thể_GSBB.md` trong repo GSBB_PROJECTS để Claude Code đọc làm context (đồng thời paste lên Google Doc cho BOD)
---

# Brief — Viết Báo cáo Tổng thể "Xây dựng Phòng Điều hành Số GSBB"

## 0. Bối cảnh tóm tắt

Goldsun Food (GSF) — đơn vị anh em của GSBB — đã có kinh nghiệm vận hành hệ thống điều hành số tương tự (Dashboard 21 trang, War Room phân loại 224 nhà hàng, 5GATE quản lý 75 dự án CAPEX). Sau buổi trao đổi với CEO GSBB và team PMO (tham chiếu Đề án OC.GSP v2.0 mục 2.3), GSF bàn giao bộ khung dự án hoàn chỉnh để GSBB triển khai trong **90 ngày**.

Báo cáo này là tài liệu **trình bày đầy đủ** đề án, gửi CEO GSBB + BOD + toàn bộ team triển khai. Đối tượng đọc đa dạng (CEO · tài chính · kinh doanh · sản xuất · chất lượng · IT) → **phải dễ đọc**, không phụ thuộc kiến thức công nghệ.

## 1. Yêu cầu chung — Tone & Style

- **KHÔNG dùng từ tiếng Anh khi tiếng Việt có**: dùng "phòng điều hành" thay "dashboard", "dữ liệu thật" thay "production data", "tự động cập nhật" thay "cron job", "phân quyền truy cập" thay "RBAC"
- **KHÔNG dùng từ kỹ thuật**: API · schema · JSON · cron · webhook · CI/CD · Vercel · Supabase · GitHub · cloud · serverless · edge function · middleware (nếu bắt buộc dùng → giải thích NGAY tại chỗ bằng 1 câu tiếng Việt)
- **KHÔNG dùng tên file/code**: `.json` · `.py` · `serve.py` · `extract_campaign.py` (chỉ nói "chương trình tự động lấy dữ liệu hằng ngày")
- **Mỗi công thức/con số phải có ví dụ cụ thể**: vd "ROI dưới 1 tháng" → kèm phép tính
- **Tone neutral**: không bán hàng ("đột phá", "tối ưu hóa toàn diện"), không đe dọa ("phải bằng mọi giá")
- **Reference doc khác phải có giải thích**: lần đầu nêu "OC" → giải thích "Mô hình dự án mục tiêu liên chức năng"
- **Số liệu tài chính**: dùng "triệu/tỷ VNĐ", luôn ghi rõ đơn vị
- **CEO chỉ refer bằng "CEO"** — không nêu tên thật

## 2. Cấu trúc bắt buộc — 10 phần

### Phần 1 — Tóm tắt cho lãnh đạo (Executive Summary) — 1 trang

Trang đầu, CEO đọc 2 phút hiểu hết. Bao gồm:
- 1 câu mô tả đề án (≤ 30 từ)
- Vấn đề đang gặp (3-4 gạch đầu dòng)
- Giải pháp đề xuất (3-4 gạch đầu dòng)
- Đầu ra cụ thể sau 90 ngày
- Ngân sách + ROI (1 dòng)
- Đề nghị CEO quyết định gì

### Phần 2 — Vì sao cần làm bây giờ

- Thực trạng GSBB hiện tại (dẫn lại từ Đề án OC.GSP v2.0): dữ liệu phân tán trên Excel · Word · Zalo · Email · ERP · CRM; báo cáo tổng hợp thủ công mất 1-2 ngày; ma trận trách nhiệm chưa số hoá; không có nguồn dữ liệu thống nhất
- 14 dự án OC (giải thích OC) đang chạy song song → khó nhìn toàn cảnh
- Chương trình GSP_NEXT_30 yêu cầu chuyển đổi cách làm, không chỉ thay logo
- Chỉ đạo CEO 20/04/2026: chuẩn hoá quản trị bằng dữ liệu, không trao đổi chung chung
- Bài học từ GSF: cùng quy mô và độ phức tạp, đã giải bài toán này bằng cách nào

### Phần 3 — Đề án gồm 2 phần (giải thích bằng hình)

**Phòng Điều hành (Control Tower)**:
- Là gì: 1 màn hình hiển thị 8 trang theo dõi tình hình vận hành công ty
- Ai mở: CEO mở sáng thứ 2 hằng tuần; CFO mở hằng ngày; trưởng phòng mở trang thuộc phòng mình
- Mục tiêu: nhìn 30 giây biết tình hình toàn công ty
- Liệt kê 8 trang: tóm tắt điều hành · tài chính · khách hàng · giao hàng đúng hạn · sản xuất · chất lượng · cung ứng · 14 dự án OC

**Phòng Họp Chiến lược (War Room)**:
- Là gì: 4 phòng họp ảo, mỗi phòng dành cho 1 loại quyết định chiến lược
- Khác Phòng Điều hành ở chỗ: Phòng Điều hành để **theo dõi**, Phòng Họp Chiến lược để **chốt quyết định**
- 4 phòng: danh mục 14 OC · danh mục khách hàng · cụm máy sản xuất · điểm nóng vấn đề

**Nguyên tắc cốt lõi**: 2 phòng dùng chung 1 nguồn dữ liệu duy nhất → không có chuyện "phòng nào số đó khác nhau". (Giải thích bằng hình tháp 4 lớp đơn giản: Nguồn dữ liệu thật → Lớp chuẩn hoá → Phòng Điều hành + Phòng Họp Chiến lược → Trợ lý AI hỗ trợ tóm tắt)

### Phần 4 — Chi tiết 8 trang Phòng Điều hành (bảng)

Mỗi trang 1 mục con, mỗi mục có:
- **Mục đích**: 1-2 câu
- **Ai dùng**: vai trò cụ thể
- **Tần suất**: hằng ngày / hằng tuần
- **Số liệu quan trọng nhất**: 3-5 chỉ số (giải thích từng chỉ số bằng tiếng Việt + ví dụ con số minh hoạ)
- **Đèn cảnh báo 3 màu**: ngưỡng đỏ/vàng/xanh là gì
- **Nguồn dữ liệu**: lấy từ đâu, ai cung cấp

Ví dụ Trang 2 (Tài chính):
- Mục đích: CFO và CEO theo dõi sức khoẻ tài chính
- Ai dùng: CFO hằng ngày, CEO sáng thứ 2
- Số liệu: Doanh thu tháng · Tỷ suất lợi nhuận gộp · EBITDA · Chi phí do chất lượng kém (COPQ) · Tiền mặt · Công nợ quá hạn
- Đèn cảnh báo: vd EBITDA > 25 tỷ = xanh · 18-25 tỷ = vàng · < 18 tỷ = đỏ
- Nguồn: hệ thống Bravo (giải thích: "phần mềm kế toán tài chính đang dùng")

→ **Lưu ý cho Chat**: tạo bảng tóm tắt 8 trang ở đầu phần này (1 trang A4), sau đó đi sâu từng trang

### Phần 5 — Chi tiết 4 Phòng Họp Chiến lược

Mỗi phòng 1 mục:
- **Mục đích**: quyết định gì
- **Đầu vào**: dùng số liệu từ trang nào của Phòng Điều hành
- **5 nhóm quyết định**: liệt kê + giải thích từng nhóm (tránh từ "bucket")
- **Cadence họp**: bao lâu/lần
- **Người chốt**: ai có quyền quyết

Ví dụ Phòng Họp Danh mục 14 OC:
- Mục đích: phân loại 14 OC theo 5 nhóm quyết định trong tuần
- Đầu vào: trang 8 (OC & IPAM)
- 5 nhóm: **Tăng tốc** (đang tốt, đẩy nhanh) · **Hỗ trợ** (đang chậm, cần giúp) · **Theo dõi** (chưa rõ) · **Khởi động lại** (đang đỏ, đổi cách) · **Đóng** (không khả thi, dừng)
- Cadence: thứ 6 hằng tuần 60 phút
- Người chốt: CEO + PMO

### Phần 6 — Lộ trình triển khai 90 ngày (chia 5 giai đoạn rõ ràng)

**Mỗi giai đoạn 1 trang, format đồng nhất:**

```
GIAI ĐOẠN N — TÊN GIAI ĐOẠN (Ngày X - Y)

Mục tiêu:
[2-3 dòng]

Việc cụ thể phải làm:
- Việc 1 — ai làm — hạn ngày
- Việc 2 — ai làm — hạn ngày
- ...

Đầu ra cứng cuối giai đoạn:
- ✅ [đầu ra 1]
- ✅ [đầu ra 2]

Mốc kiểm tra CEO:
[ngày + nội dung]
```

5 giai đoạn:

| GĐ | Tên | Ngày | Mục tiêu chính |
|---|---|---|---|
| 0 | Khởi động | 1-7 | Chốt người · chốt số liệu cần theo dõi · chốt ngưỡng cảnh báo · setup máy |
| 1 | Xây 4 trang ưu tiên | 8-30 | Trang Tóm tắt · Trang Tài chính · Trang Khách hàng · Trang 14 OC chạy được tại máy nội bộ |
| 2 | Mở rộng + Phòng Họp Chiến lược | 31-60 | Thêm 4 trang còn lại + 4 Phòng Họp; CEO/PMO bắt đầu **dùng thật** hằng tuần |
| 3 | Đưa lên web nội bộ | 61-75 | Truy cập qua trình duyệt từ bất kỳ máy nào · phân quyền theo vai trò · tự động cập nhật mỗi sáng |
| 4 | Tích hợp Trợ lý AI + Hoàn thiện | 76-90 | AI tự viết tóm tắt cho CEO sáng thứ 2 · báo cáo ROI · bàn giao vận hành ổn định |

→ **Lưu ý cho Chat**: vẽ timeline ngang trên 1 trang A4 đầu phần này, sau đó chi tiết từng giai đoạn

### Phần 7 — Dữ liệu cần thiết và ai phải cung cấp

Phần CỰC QUAN TRỌNG vì dữ liệu không sạch = dự án thất bại.

**Cấu trúc:**
- Liệt kê 5 nhóm dữ liệu: Tài chính · Khách hàng · Sản xuất · Chất lượng · Dự án OC
- Mỗi nhóm bảng:

| Loại dữ liệu | Lấy từ đâu | Ai chịu trách nhiệm | Bao lâu cập nhật | Đã có chưa |
|---|---|---|---|---|
| Doanh thu, lợi nhuận | Phần mềm kế toán Bravo | Phòng Kế toán | Hằng ngày | ⚠️ Đang cập nhật thủ công |
| Top khách hàng | Excel Sales tháng | Trưởng phòng Kinh doanh | Hằng tuần | ✅ Có sẵn |
| ... | ... | ... | ... | ... |

- Cuối phần: **bảng phân công cung cấp dữ liệu** (matrix · ai pull về · khi nào)
- Cách lấy dữ liệu giai đoạn đầu: **xuất file Excel từ hệ thống → đặt vào thư mục chung → chương trình tự động đọc và cập nhật** (không cần kết nối trực tiếp ERP/MES — sẽ làm ở giai đoạn sau)

### Phần 8 — Trợ lý AI làm gì (vai trò của Claude)

Mục tiêu: làm rõ AI làm gì và **KHÔNG làm gì**.

**AI làm:**
- Sáng 7h hằng ngày: đọc toàn bộ dữ liệu → viết **3-5 dòng tóm tắt** cho CEO mở dashboard đọc trước khi vào việc
- Sáng thứ 2 hằng tuần: viết **báo cáo 1 trang** tổng kết tuần qua cho CEO
- Khi PMO yêu cầu: viết bản nháp **tóm tắt 1 OC** (status · rủi ro · 7 ngày tới làm gì)
- Hỗ trợ điền nháp các biểu mẫu xử lý vấn đề (BM01/BM02) — người vẫn phải review

**AI KHÔNG làm:**
- Không thay quyền quyết định của CEO/PMO/Owner
- Không gửi báo cáo ra ngoài công ty (zero data retention)
- Không tự sửa số liệu — chỉ đọc

Tham chiếu cụ thể đến lộ trình AI 90 ngày của GSBB (`20260514_Lo_trinh_90_ngay_chuyen_doi_AI_Goldsun_cap_in_GSP_NEXT_30.docx`) — gắn 7 use case AI ưu tiên với 5 use case mà đề án này phục vụ.

### Phần 9 — Ngân sách, ROI và rủi ro

**Ngân sách (bảng đơn giản 2 cột Năm 1 / Năm 2+):**

| Hạng mục | Năm 1 | Năm 2+ |
|---|---|---|
| Phần mềm AI (cho 3-5 người làm) | ~50 triệu VNĐ | tương tự |
| API trợ lý AI viết tóm tắt | ~15 triệu VNĐ | ~15 triệu VNĐ |
| Hạ tầng web nội bộ (giai đoạn 2) | ~5 triệu VNĐ | ~5 triệu VNĐ |
| **Tổng** | **~70 triệu VNĐ** | **~30 triệu VNĐ** |

**ROI cụ thể (phép tính):**
- Tiết kiệm thời gian báo cáo thủ công: 4 giờ × 50 người dùng × 50 tuần × 150.000 VNĐ/giờ = **~1,5 tỷ VNĐ/năm**
- Thời gian hoàn vốn: **dưới 1 tháng**
- Lợi ích định tính: tốc độ ra quyết định nhanh hơn · phát hiện vấn đề sớm hơn 1-2 tuần · giảm tranh cãi "số đúng số sai" giữa các phòng ban

**Bảng rủi ro và cách giảm thiểu** (5-7 rủi ro chính):

| Rủi ro | Mức độ | Cách giảm thiểu |
|---|---|---|
| Dữ liệu không sạch / không đủ | 🔴 Cao | Người phụ trách dữ liệu chốt cấu trúc trước · không xây giao diện nếu dữ liệu chưa rõ |
| CEO không dùng | 🔴 Cao | Demo sớm tuần 2-3 · điều chỉnh theo phản hồi CEO ngay · không xây xong mới demo |
| Owner 14 OC không cập nhật | 🟡 Trung | Nhịp họp tuần cố định · báo cấp cao hơn nếu trễ |
| Tích hợp Bravo/MES khó | 🟡 Trung | Giai đoạn 1 dùng Excel paste tay · không làm chậm giai đoạn 1 |
| Rò rỉ thông tin chiến lược | 🟡 Trung | Phòng Họp Chiến lược chỉ chạy nội bộ · phân quyền truy cập theo vai trò |
| Người làm nghỉ giữa chừng | 🟢 Thấp | Tài liệu hoá đầy đủ · 2-3 người cùng nắm |

### Phần 10 — Đề xuất quyết định trình CEO

Cuối tài liệu, gộp lại 6 đề xuất CEO cần phê duyệt:

1. ✅ Chấp thuận đề án Phòng Điều hành & Phòng Họp Chiến lược (90 ngày)
2. ✅ Phân công 4 vai trò chính: Trưởng dự án AI PMO · Trưởng kỹ thuật · Trưởng dữ liệu · 14 Owner OC
3. ✅ Cấp ngân sách ~70 triệu VNĐ cho Năm 1
4. ✅ Chốt nhịp họp: sáng thứ 2 30 phút review Phòng Điều hành · thứ 6 60 phút Phòng Họp Chiến lược
5. ✅ Phê duyệt lộ trình 90 ngày
6. ✅ Chỉ định buổi họp tuần 1 để chốt bộ số liệu cần theo dõi và ngưỡng cảnh báo

### Phụ lục — Bảng thuật ngữ (cuối tài liệu)

Liệt kê + giải thích mọi thuật ngữ chuyên ngành/viết tắt xuất hiện trong báo cáo:

- **OC** — Mô hình dự án mục tiêu liên chức năng (Objective Charter)
- **IPAM** — Cơ chế họp giải quyết vấn đề có người phụ trách rõ ràng (Issue · Problem · Action · Mitigation)
- **PMO** — Văn phòng quản trị dự án
- **P&C** — Khối kế hoạch và kiểm soát
- **BD** — Kinh doanh phát triển khách hàng mới
- **EBITDA** — Lợi nhuận trước thuế · lãi vay · khấu hao
- **COPQ** — Chi phí do chất lượng kém (sản phẩm lỗi · phải làm lại · bồi thường)
- **OEE** — Hiệu suất tổng thể thiết bị
- **OTIP** — Giao hàng đúng hạn, đủ lượng
- **NCR/CAR/8D** — Quy trình xử lý lỗi chất lượng theo chuẩn quốc tế
- **FPY** — Tỷ lệ đạt lần đầu
- **Bravo** — Phần mềm kế toán tài chính đang dùng tại GSBB
- **MES/Xunyue** — Hệ thống quản lý sản xuất tại nhà máy
- **CRM** — Phần mềm quản lý khách hàng
- **Đèn cảnh báo 3 màu (RAG)** — Đỏ (cần xử lý gấp) · Vàng (cần chú ý) · Xanh (đang tốt)
- **Trợ lý AI** — Trong đề án này dùng Claude (sản phẩm của Anthropic) — AI đọc dữ liệu nội bộ và viết tóm tắt
- **Phòng Điều hành (Control Tower)** — Hệ thống 8 trang theo dõi vận hành
- **Phòng Họp Chiến lược (War Room)** — Hệ thống 4 phòng họp chốt quyết định chiến lược
- **GSP_NEXT_30** — Chương trình khởi động chuyển đổi GSBB 2026 (xem tài liệu cùng tên)

## 3. Quy tắc trình bày

- **Trang bìa**: tên đề án + đơn vị GSBB + ngày + người soạn + "Tài liệu nội bộ — Không phát hành ra ngoài"
- **Mục lục**: bắt buộc, đánh số trang
- **Header trang**: "GSBB · Đề án Phòng Điều hành Số · 2026"
- **Footer trang**: "Trang X/Y · Tài liệu nội bộ"
- **Bảng**: bo border đơn giản, header tô xám nhẹ
- **Hình minh hoạ**: 3 hình bắt buộc — (1) Tháp 4 lớp kiến trúc phần 3 · (2) Timeline 5 giai đoạn ngang phần 6 · (3) Sơ đồ luồng dữ liệu phần 7
- **Trích dẫn tài liệu khác**: in nghiêng + tên file đầy đủ trong ngoặc

## 4. Tài liệu nguồn Chat phải đọc trước khi viết

Để Chat hiểu đầy đủ context, đọc lần lượt (đã có trong `/Users/minhlee/Downloads/GS_AI/`):

1. **`README.md`** trong `GSBB_BUILD/` — overview scaffolding
2. **`HANDOVER_TEAM_GSBB.md`** — báo cáo bàn giao đã làm
3. **`IMPLEMENTATION_PLAN.md`** — plan 90 ngày chi tiết
4. **`DATA_REQUIREMENTS.md`** — data inventory
5. **`GSBB_Control_Tower_Setup_Guide.md`** (file gốc) — tech reference
6. **`GSBB_Control_Tower_Claude_Project_Proposal.docx`** — đề án V1 gốc
7. **`20260420_PMO_Phân-tích_KPI-đề-xuất-Control-tower.docx`** — bộ KPI đề xuất
8. **`20260420_PMO_ke-hoach_gsbb-project-structure-v2-3col.docx`** — cấu trúc dự án v2
9. **`De_an_OCGSP_v2.0.docx`** — tờ trình OC.GSP (ngân sách + ROI tham chiếu)
10. **`20260514_Lo_trinh_90_ngay_chuyen_doi_AI_Goldsun_cap_in_GSP_NEXT_30.docx`** — lộ trình AI 90 ngày
11. **`20260420_CHỈ ĐẠO ĐIỀU HÀNH CỦA CEO.docx`** — chỉ đạo CEO gốc
12. **`Workflow_Quan_tri_OC_PnC_GSBB_FoodLayout_v2_1.docx`** — workflow P&C
13. **`GSBB_14OC_Master_Reference.html`** + **`GSBB_14OC_owner_remapping.html`** — danh sách 14 OC
14. 3 file Excel mẫu trong `Data/` — hiểu format dữ liệu thực tế

## 5. Output Format — Lưu file `.md` + paste Google Doc

**Đầu ra song song 2 nơi:**

1. **File trong repo:** `docs/REPORT-Tổng_thể_GSBB.md` — Claude Code GSBB đọc làm context khi build feature (vd "trang X có yêu cầu gì", "rủi ro nào đã liệt kê"). Frontmatter bắt buộc:

```yaml
---
title: Báo cáo Tổng thể — Phòng Điều hành Số GSBB
audience: CEO · BOD · PMO · Lead P&C · Owner 14 OC · Working Team
status: draft / approved / live
version: v1.0
date: 2026-05-XX
related_docs:
  - HANDOVER_TEAM_GSBB.md
  - IMPLEMENTATION_PLAN.md
  - DATA_REQUIREMENTS.md
---
```

2. **Google Doc:** PMO copy toàn bộ phần body (sau frontmatter) → paste replace vào Google Doc trống → gửi BOD.

**Section 1 — Tóm tắt thay đổi (changelog ở đầu file md, không paste lên Doc)**

```
- v1.0 (YYYY-MM-DD): Bản trình bày trọn vẹn đầu tiên, viết cho mọi đối tượng (BOD + Working Team), không yêu cầu kiến thức kỹ thuật
- Nguồn: HANDOVER + PLAN + 13 tài liệu source mục 4
```

**Section 2 — Nội dung báo cáo đầy đủ** (paste vào Google Doc)

[Toàn bộ báo cáo theo cấu trúc 10 phần + phụ lục bảng thuật ngữ]

## 6. Self-check trước khi gửi (Chat tự kiểm)

- [ ] Toàn bộ tài liệu không còn từ tech (API · schema · cron · webhook · JSON · serve.py · Vercel · Supabase) chưa giải thích
- [ ] Mọi mã/từ viết tắt xuất hiện lần đầu đã có giải thích tại chỗ
- [ ] 3 hình minh hoạ đã mô tả bằng text rõ ràng (Chat không vẽ được hình, ghi mô tả "Hình 1: [mô tả]" để designer làm sau)
- [ ] Phần 6 (lộ trình 5 giai đoạn) format đồng nhất giữa các giai đoạn
- [ ] Phần 7 (dữ liệu) có bảng phân công đầy đủ 5 nhóm
- [ ] Mỗi công thức tài chính có ví dụ tính cụ thể
- [ ] CEO chỉ refer "CEO", không nêu tên thật
- [ ] Có phụ lục bảng thuật ngữ đầy đủ
- [ ] Trang bìa + mục lục + header/footer chỉ định rõ
- [ ] Độ dài 12-15 trang A4

---

*Brief soạn ngày 2026-05-17 · Lê Vũ Minh (GSF) · Tài liệu nội bộ*
