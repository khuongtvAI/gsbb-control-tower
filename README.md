# GSBB Control Tower & War Room — Scaffolding Workspace

> **Đối tượng đọc:** Team GSBB (PMO · P&C Lead · Digital/IT · Data Analyst · Owner 14 OC)
> **Soạn bởi:** Lê Vũ Minh (GSF) — kế thừa từ `GSBB_Control_Tower_Setup_Guide.md` (12/04/2026)
> **Trạng thái:** Phiên bản scaffolding — chưa build code thật, mới có khung folder + plan + sample data
> **Ngày:** 2026-05-17

---

## 1. Tài liệu này có gì?

Folder `GSBB_BUILD/` là bộ khung dự án (scaffolding) đầy đủ để team GSBB **bắt đầu build trong vòng 1 ngày**. Bao gồm:

| Nhóm | Nội dung |
|---|---|
| **Tài liệu master (đọc trước)** | [[README]] · [[IMPLEMENTATION_PLAN]] · [[DATA_REQUIREMENTS]] · [[HANDOVER_TEAM_GSBB]] |
| **Khung folder dự án** | [[CORE_SCRIPTS/CLAUDE\|CORE_SCRIPTS]] · [[DATA_LAYER/CLAUDE\|DATA_LAYER]] · [[CONTROL_TOWER/CLAUDE\|CONTROL_TOWER]] · [[WAR_ROOM/CLAUDE\|WAR_ROOM]] · [[CLAUDE_LAYER/CLAUDE\|CLAUDE_LAYER]] |
| **File cấu hình AI/Code** | `CLAUDE.md` (root + per-project) · `.claude/rules/*` · `.claude/settings.json` |
| **Sample data + Schema** | `DATA_LAYER/schemas/*.json` · `DATA_LAYER/<domain>/*_sample.json` |
| **Template input** | `templates/` (Excel template chuẩn cho data entry) |
| **Phase 2 sketch** | `phase2/` (Vercel · Supabase · GitHub Actions config mẫu) |

---

## 2. Đọc theo thứ tự nào

```
1. README.md (5 phút)              ← bạn đang đọc
2. HANDOVER_TEAM_GSBB.md (15 phút) ← báo cáo chính thức cho team GSBB
3. IMPLEMENTATION_PLAN.md (30 phút) ← plan 12 tuần chi tiết
4. DATA_REQUIREMENTS.md (20 phút)  ← data nào cần, ai cung cấp, schema lock
5. CLAUDE.md (10 phút)             ← bắt đầu code với Claude Code
```

→ Xem [[GSBB-Index]] để điều hướng nhanh toàn bộ vault.
→ Xem [[lessons-learned]] để đọc bài học từ GSF trước khi bắt đầu.

---

## 3. Quick start (Phase 1 — local dev)

```bash
# Sau khi team GSBB tạo repo riêng và unzip scaffolding
cd GSBB_PROJECTS

# Cài Python 3.11+
pyenv install 3.11.9 && pyenv local 3.11.9

# Cài dependencies root
pip install -r requirements.txt

# Cài Claude Code CLI
npm install -g @anthropic-ai/claude-code
claude  # login lần đầu

# Chạy Control Tower local với sample data
cd CONTROL_TOWER && python3 serve.py 8080
# Mở: http://localhost:8080

# Chạy War Room local
cd ../WAR_ROOM && python3 serve.py 8090
# Mở: http://localhost:8090
```

---

## 4. Kiến trúc 2 lớp dùng chung 1 nguồn sự thật

```
┌─────────────────────────────────────────────────────────┐
│                 GSBB_PROJECTS (monorepo)                 │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ CONTROL_TOWER│  │  WAR_ROOM    │  │  CORE_SCRIPTS │  │
│  │  (8 pages)   │  │  (4 rooms)   │  │  (shared)     │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         └────────┬────────┘                   │          │
│                  ▼                            │          │
│         ┌────────────────┐                    │          │
│         │   DATA_LAYER   │◄───────────────────┘          │
│         │  (JSON files)  │                               │
│         └────────┬───────┘                               │
│                  ▼                                       │
│         ┌────────────────┐                               │
│         │  CLAUDE_LAYER  │  ← Claude API/MCP queries     │
│         └────────────────┘                               │
└─────────────────────────────────────────────────────────┘
```

**Nguyên tắc cốt lõi:**
- Control Tower + War Room dùng **chung** `DATA_LAYER/` — không nhân đôi số liệu
- Control Tower = **theo dõi tình hình** → War Room = **chốt quyết định chiến lược**
- Claude/Kayson chỉ **đọc** data, không thay quyền quyết định của con người

---

## 5. Liên hệ

| Vai trò | Người chịu trách nhiệm |
|---|---|
| Project Sponsor | CEO GSBB |
| AI PMO Lead | Lead P&C GSBB |
| Cố vấn kỹ thuật | Lê Vũ Minh (GSF) — `minhvu.lee@outlook.com` |
| Owner Build | (chờ phân công) |

---

## 6. Phụ lục — Bảng thuật ngữ

- **GSBB** — Goldsun Bao Bì (Goldsun Packaging)
- **GSF** — Goldsun Food (đơn vị anh em, đã build hệ thống tương tự — tham chiếu)
- **OC** — Objective Charter — Mô hình dự án mục tiêu liên chức năng (14 OC đang chạy tại GSBB)
- **IPAM** — Issue · Problem · Action · Mitigation — cơ chế họp giải quyết vấn đề có owner rõ ràng
- **PMO** — Project Management Office — văn phòng quản trị dự án
- **P&C** — Planning & Control — khối kế hoạch và kiểm soát
- **BD** — Business Development
- **MES** — Manufacturing Execution System (hệ thống điều hành sản xuất)
- **Bravo** — ERP đang dùng tại GSBB
- **Xunyue** — Hệ thống MES chuyên biệt
- **OEE** — Overall Equipment Effectiveness (hiệu suất tổng thể thiết bị)
- **OTIP** — On-Time In-Full Performance (giao đúng hạn, đủ lượng)
- **COPQ** — Cost of Poor Quality (chi phí do chất lượng kém)
- **NCR** — Non-Conformance Report (báo cáo không phù hợp)
- **CAR** — Corrective Action Request (yêu cầu hành động khắc phục)
- **CAPA** — Corrective And Preventive Action
- **8D** — 8 Disciplines (phương pháp giải quyết vấn đề chất lượng)
- **FPY** — First Pass Yield (tỷ lệ đạt lần đầu)
- **RAG** — Red · Amber · Green (đèn 3 màu cảnh báo)
- **Control Tower** — Dashboard điều hành vận hành (8 trang)
- **War Room** — Phòng họp chiến lược chốt quyết định (4 rooms)
- **Claude Code** — Công cụ AI lập trình của Anthropic
- **ECC** — Everything Claude Code (plugin mở rộng cho Claude Code)
- **MCP** — Model Context Protocol (giao thức kết nối AI với data source)
- **Vercel** — Nền tảng deploy web (Phase 2)
- **Supabase** — Database + Auth backend (Phase 2)

---

*Tài liệu nội bộ GSBB · Không phát hành ra ngoài*
