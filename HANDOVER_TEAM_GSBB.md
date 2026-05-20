# Báo cáo Bàn giao — Triển khai GSBB Control Tower & Campaign War Room

> **Người gửi:** Lê Vũ Minh — BIM 2nd Lead, Goldsun Food (GSF)
> **Người nhận:** CEO GSBB · PMO · Lead P&C · Digital/IT Lead
> **Ngày:** 2026-05-17
> **Phiên bản:** v1.0 — Scaffolding hoàn chỉnh, sẵn sàng kick-off

---

## 1. Bối cảnh

GSBB đang triển khai chiến dịch tái cấu trúc với **14 OC** (Objective Charter) và chương trình **GSP_NEXT_30** chuyển đổi AI 90 ngày. Sau buổi trao đổi với CEO GSBB và team PMO (tham chiếu `De_an_OCGSP_v2.0.docx` mục 2.3), Goldsun Food (GSF) — đơn vị anh em đã có kinh nghiệm vận hành hệ thống tương tự — bàn giao bộ scaffolding hoàn chỉnh để team GSBB triển khai trong 90 ngày.

---

## 2. Đầu ra bàn giao

| Hạng mục | Mô tả | Trạng thái |
|---|---|---|
| **1. Bộ scaffolding folder** | Khung thư mục đầy đủ: `CORE_SCRIPTS · DATA_LAYER · CONTROL_TOWER · WAR_ROOM · CLAUDE_LAYER` + file cấu hình AI/Code | ✅ Hoàn thành |
| **2. 4 tài liệu master** | `README · IMPLEMENTATION_PLAN · DATA_REQUIREMENTS · HANDOVER (tài liệu này)` | ✅ Hoàn thành |
| **3. 6 file rule cho Claude Code** | `.claude/rules/*` — convention bắt buộc khi code | ✅ Hoàn thành |
| **4. Schema JSON 5 domain** | `DATA_LAYER/schemas/*.schema.json` — finance · customer · production · quality · campaign | ✅ Hoàn thành (cần CEO/CFO/PMO chốt fields) |
| **5. Sample data 5 domain** | JSON mẫu để dev có thể chạy ngay không cần data thật | ✅ Hoàn thành |
| **6. Template Excel cho data entry** | `templates/<domain>/inbox/` — chỉ dẫn format Excel cần nộp hàng ngày | ✅ Cơ bản (cần điều chỉnh theo Bravo/MES thật của GSBB) |
| **7. Code skeleton** | `serve.py · extract/refresh_all.py · index.html mẫu · query_tools.py` | ✅ Hoàn thành |
| **8. Phase 2 config sketch** | `phase2/vercel.json · supabase_schema.sql · github_actions_cron.yml` | ✅ Hoàn thành |

---

## 3. Việc team GSBB cần làm

### 3.1. Trong tuần 1 (1-7 ngày)

| # | Việc | Owner | Hạn |
|---|---|---|---|
| 1 | Tạo GitHub Organization GSBB · tạo repo `GSBB_PROJECTS` | Digital/IT Lead | D+2 |
| 2 | Unzip scaffolding vào repo · `git init` · first commit | Tech Lead | D+2 |
| 3 | Cài Claude Code CLI + ECC trên máy 3-5 dev | Digital/IT | D+3 |
| 4 | Họp chốt **bảng KPI + ngưỡng RAG** với CEO | PMO + CEO | D+5 |
| 5 | Họp chốt **data ownership** với từng phòng ban | Data Lead | D+7 |
| 6 | Điền cột "Người cung cấp" + "Trạng thái" vào `DATA_REQUIREMENTS.md` | Data Lead | D+7 |
| 7 | Phân công dev cho 4 trang Nhóm A | Tech Lead | D+7 |

### 3.2. Trong tuần 2-4 (Nhóm A — 4 trang ưu tiên)

| Trang | Owner dev | Owner data | Hạn |
|---|---|---|---|
| Trang 1: Executive Campaign Summary | [chờ phân công] | PMO | W4 |
| Trang 8: OC & IPAM Control Board | [chờ phân công] | PMO + 14 OC Owners | W4 |
| Trang 2: Finance & EBITDA Bridge | [chờ phân công] | CFO | W4 |
| Trang 3: Customer & Market Control | [chờ phân công] | Sales Lead | W4 |

**Quy trình mỗi trang** (xem `IMPLEMENTATION_PLAN.md` mục 2.2):
1. Lock schema JSON
2. Viết extract script
3. Sample data
4. Build HTML page
5. Test local
6. Demo CEO/PMO → feedback → iterate

### 3.3. Trong tuần 5-12 (Mở rộng + Phase 2)

Theo `IMPLEMENTATION_PLAN.md` mục 2.1:
- **W5-8:** Nhóm B (OTIP · Quality) + War Room Campaign + Customer
- **W9-12:** Nhóm C (Plant · Supply) + War Room còn lại + Claude Layer + Deploy Vercel

---

## 4. Ngân sách đề xuất

Theo tham chiếu từ `De_an_OCGSP_v2.0.docx` của GSBB và experience GSF:

| Hạng mục | Năm 1 | Năm 2+ |
|---|---|---|
| Claude Code Pro · 3-5 dev | ~50 triệu | tương tự |
| Anthropic API (insights) | ~15 triệu | ~15 triệu |
| Vercel · Supabase · Domain | ~5 triệu | ~5 triệu |
| Tổng | **~70 triệu VNĐ** | **~30 triệu VNĐ** |

**ROI ước tính** (theo đề án OC.GSP): tiết kiệm thời gian báo cáo thủ công ~1,5 tỷ VNĐ/năm → **hoàn vốn dưới 1 tháng**.

---

## 5. Rủi ro chính và cách giảm thiểu

| Rủi ro | Mức độ | Cách giảm thiểu |
|---|---|---|
| Data không sạch · không đủ | 🔴 Cao | Data Lead làm gate · không build UI nếu schema chưa lock |
| CEO không dùng dashboard | 🔴 Cao | Demo sớm tuần 2-3 · iterate theo feedback ngay |
| Owner 14 OC không cập nhật IPAM | 🟡 Trung | Nhịp họp tuần cố định · escalate qua PMO nếu trễ |
| Tích hợp Bravo/MES khó | 🟡 Trung | Phase 1 paste Excel tay · không block Phase 1 |
| Rò rỉ dữ liệu chiến lược (War Room) | 🟡 Trung | War Room private/local Phase 2 · Supabase RLS · Claude zero-retention |
| Dev nghỉ giữa chừng | 🟢 Thấp | CLAUDE.md + lessons-learned.md đầy đủ · session-save mỗi ngày |

---

## 6. Khuyến nghị từ kinh nghiệm GSF

### 6.1. Đúng

- **Bắt đầu nhỏ — demo sớm.** GSF mất 6 tháng vì cố build full trước demo. GSBB nên demo tuần 2 với 1 trang đẹp 80% hơn là 8 trang xấu 50%.
- **Schema lock sớm.** Mọi cuộc tranh cãi về cột nào đúng/sai phải xong ở W1-W2 (cấp CEO chốt). Đừng để đến W6 mới phát hiện schema sai → phải làm lại.
- **CLAUDE.md là tài liệu sống.** Mỗi feature mới → cập nhật CLAUDE.md tương ứng. Đừng để Claude Code "tự đoán" code structure.
- **Nhịp họp tuần cố định.** Sáng thứ 2 review Control Tower 30 phút. Thứ 6 War Room 60 phút. Không có nhịp → dashboard chết.
- **War Room ≠ Dashboard thứ 2.** War Room là nơi **chốt quyết định**, không phải nơi nhìn số liệu. Mỗi room phải dẫn đến 1 hành động cụ thể.

### 6.2. Tránh

- ❌ **Đừng nhân đôi data.** Control Tower và War Room dùng chung `DATA_LAYER/`. Không build 2 hệ thống extract riêng.
- ❌ **Đừng để Claude/Kayson thay quyền quyết định.** AI chỉ generate insight + draft. Người quyết phải là CEO/PMO/Owner.
- ❌ **Đừng public War Room.** Dữ liệu chiến lược nhạy cảm — private/local hoặc VPN-only.
- ❌ **Đừng push Bravo/MES integration vào Phase 1.** Tốn 3-4 tuần · không quyết định được Phase 1 có thành công hay không. Để Phase 2.
- ❌ **Đừng có > 10 KPI/trang.** CEO chỉ nhớ 5-7 con số/trang. Quá nhiều = không ai nhìn.

---

## 7. Mốc kiểm tra của CEO GSBB

Theo gợi ý từ `De_an_OCGSP_v2.0.docx` mục 4.1:

| Mốc | Ngày | Nội dung |
|---|---|---|
| Sprint 1 review | W1 | Repo + Claude Code chạy được + schema KPI chốt |
| Beta đầu tiên | W3 | Trang 1 + Trang 8 chạy local với dữ liệu thật |
| Nhóm A hoàn chỉnh | W4-5 | 4 trang Nhóm A dùng được hằng ngày |
| Mid-review | W8 | Toàn bộ Nhóm B + 2 War Room · feedback từ Owner |
| Phase 1 close | W12 | 8 trang + 4 War Room hoàn chỉnh · sẵn sàng deploy Phase 2 |
| Phase 2 live | W12-13 | `control-tower.gsbb.vn` live · auth · auto refresh |

---

## 8. Tài liệu kèm theo

Tất cả nằm trong thư mục `GSBB_BUILD/` được handover:

- `README.md` — overview + quick start (5 phút đọc)
- `IMPLEMENTATION_PLAN.md` — plan 90 ngày chi tiết (30 phút)
- `DATA_REQUIREMENTS.md` — data inventory + gap analysis (20 phút)
- `CLAUDE.md` — root project context cho Claude Code
- `.claude/rules/*.md` — 6 rule files (working · git · python · security · data-pipeline · gsbb-domain)
- `DATA_LAYER/schemas/*.schema.json` — 5 schema chuẩn JSON
- `DATA_LAYER/<domain>/*_sample.json` — sample data 5 domain
- `CONTROL_TOWER/` · `WAR_ROOM/` · `CLAUDE_LAYER/` — code skeleton sẵn để dev mở rộng
- `phase2/` — config Vercel · Supabase · GitHub Actions sketch

Ngoài ra, tham chiếu kỹ thuật chi tiết: `GSBB_Control_Tower_Setup_Guide.md` (đã có sẵn từ trước, 996 dòng).

---

## 9. Hỗ trợ tiếp theo từ GSF

| Hỗ trợ | Cam kết |
|---|---|
| Review architecture mỗi 2 tuần | 1 buổi 60 phút |
| Review code Phase 2 trước deploy | 1 buổi 90 phút |
| Pair-programming khi cần (đặc biệt CLAUDE_LAYER) | On-demand, max 4 buổi |
| Chia sẻ schema thực tế từ GSF DASHBOARD + WAR_ROOM | Đã share qua repo private nếu cần |

**Liên hệ:** Lê Vũ Minh — `minhvu.lee@outlook.com` · Telegram/Zalo trực tiếp

---

## 10. Đề xuất quyết định trình CEO GSBB

Kính đề nghị CEO GSBB phê duyệt:

1. **Chấp thuận** bộ scaffolding GSF bàn giao làm khởi điểm cho dự án
2. **Phân công** owner cho 4 vai trò: AI PMO Lead · Tech Lead · Data Lead · 14 OC Owners
3. **Cấp ngân sách** ~70 triệu VNĐ cho Năm 1 (Claude Code · API · hạ tầng cloud)
4. **Chốt nhịp họp:** Sáng thứ 2 30 phút review Control Tower · Thứ 6 60 phút War Room
5. **Phê duyệt timeline 90 ngày** theo `IMPLEMENTATION_PLAN.md`
6. **Chỉ định buổi họp tuần 1** để chốt KPI + ngưỡng RAG (CEO + CFO + PMO)

---

*Goldsun Bao Bì · Tài liệu nội bộ · Không phát hành ra ngoài*
*Soạn bởi: Lê Vũ Minh (GSF) · Ngày 2026-05-17*
