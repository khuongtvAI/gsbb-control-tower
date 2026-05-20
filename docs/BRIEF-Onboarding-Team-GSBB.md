---
title: Onboarding Team GSBB — Hướng dẫn 30 ngày đầu sau bàn giao
audience: PMO Lead · Tech Lead · Data Lead · Dev (2-3 người) · 14 OC Owner
purpose: Khi nhận folder GSBB_BUILD/ từ GSF — biết chính xác làm gì từng bước, dùng Chat hay Code, đọc folder nào, lấy dữ liệu từ đâu
version: v1.0
date: 2026-05-17
status: draft (chờ team GSBB nhận bàn giao và review)
related_docs:
  - README.md
  - HANDOVER_TEAM_GSBB.md
  - IMPLEMENTATION_PLAN.md
  - DATA_REQUIREMENTS.md
  - lessons-learned.md
---

# Onboarding Team GSBB — 30 Ngày Đầu Sau Bàn Giao

> **Đọc cho ai:** Team GSBB vừa nhận folder `GSBB_BUILD/` từ GSF — chưa biết bắt đầu từ đâu.
> **Đọc khi nào:** Ngày đầu sau khi nhận bàn giao.
> **Đọc bao lâu:** 25 phút để đọc hết, sau đó dùng như runbook tra cứu hàng ngày.

---

## 1. Tóm tắt 1 trang — Cần biết ngay

### Bạn vừa nhận gì
Một folder `GSBB_BUILD/` (60 file) chứa **khung dự án hoàn chỉnh** + 4 tài liệu master + 5 skills + sample data + code chạy được ngay. Team GSF (Goldsun Food) đã build và verify mọi thứ chạy được trước khi bàn giao.

### Việc đầu tiên cần làm (Day 1-2)
1. Tạo repo riêng `GSBB_PROJECTS` trên GitHub Organization GSBB
2. Unzip folder này vào repo mới · first commit
3. Cài Claude Code CLI trên máy 3-5 dev
4. Mở `lessons-learned.md` đọc 12 bài học seed từ GSF (15 phút) — TRƯỚC khi code gì

### Tổng quan công cụ team sẽ dùng

| Vai trò | Công cụ chính | Mục đích |
|---|---|---|
| PMO Lead · OC Owner · BOD | **Claude Chat** (web/app) | Viết báo cáo · biên bản · brief · soạn JD/SOP |
| Tech Lead · Dev | **Claude Code** (CLI) | Build dashboard · sửa code · deploy |
| Data Lead | **Excel + Claude Code** | Pull dữ liệu từ Bravo/MES/Sheets → đưa vào hệ thống |

### Mốc 30 ngày
- **Tuần 1:** Chốt người · chốt số liệu · chốt ngưỡng cảnh báo
- **Tuần 2:** Build trang 1 (Tóm tắt CEO) + trang 8 (14 OC) bằng sample data
- **Tuần 3:** Demo CEO bản beta — iterate theo phản hồi
- **Tuần 4:** Trang 2 (Tài chính) + trang 3 (Khách hàng) bằng dữ liệu thật paste Excel

---

## 2. Bạn vừa nhận gì — Folder Map

```
GSBB_BUILD/                              ← Folder bàn giao
│
├── 📋 TÀI LIỆU MASTER (đọc trước khi làm bất cứ gì khác)
│   ├── README.md                        ← Overview 5 phút
│   ├── HANDOVER_TEAM_GSBB.md            ← Báo cáo bàn giao GSF → GSBB (15 phút)
│   ├── IMPLEMENTATION_PLAN.md           ← Plan 90 ngày chi tiết (30 phút)
│   ├── DATA_REQUIREMENTS.md             ← Data inventory + gap analysis (20 phút)
│   ├── lessons-learned.md               ← 12 bài học seed từ GSF (15 phút) ⭐ QUAN TRỌNG
│   ├── CLAUDE.md                        ← Context cho Claude Code session
│   └── DO_NOT_COMMIT.md                 ← Lưu ý handover (sau khi chuyển vào repo mới, xoá file này)
│
├── ⚙️ CẤU HÌNH AI/CODE
│   └── .claude/
│       ├── settings.json                ← Permissions cho Claude Code
│       ├── rules/                       ← 6 rule files (Claude Code đọc đầu session)
│       │   ├── working-rules.md
│       │   ├── git-conventions.md
│       │   ├── python.md
│       │   ├── security.md
│       │   ├── data-pipeline.md
│       │   └── gsbb-domain.md           ← Domain knowledge: 14 OC · 8 trang · 4 War Room
│       └── skills/                      ← 5 skills GSBB
│           ├── gsbb-doc-format/         ← Format chuẩn cho SOP/JD/QĐ/Brief
│           ├── gsbb-vietnamese-writing/ ← Quy tắc viết tiếng Việt business
│           ├── gsbb-oc-weekly-review/   ← Audit 14 OC sáng thứ 2
│           ├── gsbb-ipam-facilitation/  ← Chuẩn bị IPAM session
│           └── gsbb-ceo-weekly-brief/   ← CEO Weekly Brief 1 trang
│
├── 📦 CODE — 5 PROJECT
│   ├── CORE_SCRIPTS/                    ← Module Python dùng chung
│   │   ├── CLAUDE.md
│   │   └── scripts/schema_validator.py
│   │
│   ├── DATA_LAYER/                      ← ⭐ NGUỒN SỰ THẬT — JSON files
│   │   ├── CLAUDE.md
│   │   ├── schemas/                     ← 5 schema chuẩn JSON
│   │   │   ├── finance.schema.json
│   │   │   ├── customer.schema.json
│   │   │   ├── production.schema.json
│   │   │   ├── quality.schema.json
│   │   │   └── campaign.schema.json
│   │   ├── finance/finance_data_sample.json
│   │   ├── customer/customer_data_sample.json
│   │   ├── production/production_data_sample.json
│   │   ├── quality/quality_data_sample.json
│   │   └── campaign/
│   │       ├── oc_status_data_sample.json  (14 OC mẫu)
│   │       └── ipam_log_sample.json
│   │
│   ├── CONTROL_TOWER/                   ← 8 trang Phòng Điều hành
│   │   ├── CLAUDE.md
│   │   ├── serve.py                     ← Chạy local: python3 serve.py 8080
│   │   ├── app/                         ← HTML pages
│   │   │   ├── index.html               ← Trang 1: Executive Summary
│   │   │   ├── (chờ build): finance.html · customer.html · ...
│   │   │   └── assets/{app.js, style.css}
│   │   ├── extract/                     ← Script đọc Excel → JSON
│   │   │   ├── refresh_all.py
│   │   │   └── extract_campaign.py      ← Mẫu (chờ build 4 cái nữa)
│   │   └── requirements.txt
│   │
│   ├── WAR_ROOM/                        ← 4 Phòng Họp Chiến lược
│   │   ├── CLAUDE.md
│   │   ├── serve.py                     ← Chạy local: python3 serve.py 8090
│   │   ├── app/index.html
│   │   ├── classify/classify_campaign.py
│   │   └── requirements.txt
│   │
│   └── CLAUDE_LAYER/                    ← Trợ lý AI integration
│       ├── CLAUDE.md
│       ├── query_tools.py               ← 8 functions để AI query data
│       └── prompts/
│           ├── daily_insights.md
│           └── ceo_weekly_review.md
│
├── 📊 TEMPLATES & DATA
│   ├── templates/                       ← Excel templates cho data entry
│   │   └── README.md
│   └── (chờ data thật)
│
├── 🚀 PHASE 2 (Web Deployment)
│   └── phase2/
│       ├── README.md
│       ├── vercel.json                  ← Security headers · cache
│       ├── supabase_schema.sql          ← Auth + RBAC + audit log
│       └── github_actions_cron.yml      ← Auto refresh hằng ngày
│
├── 📝 BRIEFS & REPORTS
│   └── docs/
│       ├── BRIEF-Báo_cáo_Tổng_thể_GSBB.md   ← Brief cho Chat viết Report tổng thể
│       ├── BRIEF-Onboarding-Team-GSBB.md     ← File bạn đang đọc
│       └── REPORT-Tổng_thể_GSBB.md           ← (Chat sẽ output vào đây)
│
└── 📦 ROOT CONFIG
    ├── requirements.txt                 ← Python deps
    ├── .gitignore                       ← (workspace-only, xoá khi handover)
    └── (sẽ thêm).github/workflows/      ← CI/CD (giai đoạn 2)
```

---

## 3. Đọc tài liệu theo thứ tự nào

### Cho PMO Lead / Lead P&C (60 phút)
1. Đọc bài này (`BRIEF-Onboarding-Team-GSBB.md`) — 25 phút
2. `HANDOVER_TEAM_GSBB.md` — 15 phút
3. `IMPLEMENTATION_PLAN.md` mục 1-3 + 5 — 20 phút

### Cho Tech Lead / Dev (90 phút)
1. Đọc bài này — 25 phút
2. `README.md` — 5 phút
3. `CLAUDE.md` (root) + 6 file trong `.claude/rules/` — 15 phút
4. `lessons-learned.md` 12 LL seed — 15 phút ⭐ **BẮT BUỘC**
5. `IMPLEMENTATION_PLAN.md` đầy đủ — 30 phút

### Cho Data Lead (60 phút)
1. Đọc bài này — 25 phút
2. `DATA_REQUIREMENTS.md` đầy đủ — 25 phút
3. Mở 5 schema JSON trong `DATA_LAYER/schemas/` xem cấu trúc — 10 phút

### Cho 14 OC Owner (15 phút)
1. Đọc bài này: chỉ Section 1, 4, 9 — 15 phút
2. (Sau khi PMO chốt) — đọc skill `gsbb-ipam-facilitation` để biết cách báo IPAM hàng tuần

---

## 4. Phân công vai trò — Ai dùng công cụ gì

### Bảng phân công

| Vai trò | Claude Chat | Claude Code | Chi phí/tháng | Cài đặt |
|---|---|---|---|---|
| **CEO / BOD** | Không bắt buộc (xem dashboard qua trình duyệt) | Không | — | — |
| **PMO Lead / P&C Lead** | ✅ Chính (viết brief · biên bản · báo cáo) | ⚠️ Optional (đọc lessons-learned) | ~$20 | Claude Pro web/app |
| **Tech Lead** | ⚠️ Optional | ✅ Chính (build · deploy · review) | ~$20-100 | Claude Code CLI + Pro/Team |
| **Dev (2-3 người)** | ⚠️ Optional | ✅ Chính | ~$20-100/người | Claude Code CLI + Pro/Team |
| **Data Lead** | ✅ Chính (viết brief data spec) | ⚠️ Optional (chạy script extract) | ~$20 | Claude Pro |
| **14 OC Owner** | ✅ Chính (soạn status update · IPAM) | Không | ~$20 (hoặc miễn phí) | Claude Pro hoặc free tier |
| **Thư ký họp** | ✅ Chính (biên bản · meeting notes) | Không | ~$20 | Claude Pro |

### Tổng ngân sách công cụ năm 1 (ước tính)

- 1 PMO + 1 Data Lead + 1 Thư ký + 14 OC Owner = 17 người × $20/mo × 12 = **~95 triệu VNĐ/năm**
- 1 Tech Lead + 2 Dev = 3 người × $20-100/mo × 12 = **15-90 triệu VNĐ/năm**
- API Trợ lý AI (Anthropic) cho dashboard insights = ~15 triệu/năm
- Hạ tầng (Vercel · Supabase · domain) = ~5 triệu/năm
- **Tổng:** ~130-200 triệu VNĐ/năm (Năm 1)

> Có thể tiết kiệm: 14 OC Owner dùng Claude free (giới hạn message) → tổng còn ~50-100 triệu.

---

## 5. Quyết định Chat vs Code — Decision Tree

### Luật chung

```
Câu hỏi 1: Output là gì?
  ├── Văn bản (Word/Doc/Email/Memo)        → Claude Chat
  ├── Code (Python/HTML/SQL)               → Claude Code
  └── Cấu trúc (Excel template/Form)       → Claude Code (Sheets API)

Câu hỏi 2: Cần đọc file trong repo không?
  ├── Không (viết mới hoàn toàn)            → Claude Chat
  ├── Có (1-2 file ngắn)                    → Có thể Chat (paste vào)
  └── Có (nhiều file/cần điều hướng repo)   → Claude Code

Câu hỏi 3: Output có cần deploy/commit không?
  ├── Không (chỉ đọc/copy)                  → Chat OK
  └── Có (push lên GitHub/Vercel)           → Claude Code
```

### Bảng cụ thể — 30 task thường gặp

| # | Task | Chat | Code |
|---|---|:---:|:---:|
| 1 | Viết báo cáo tổng thể đề án | ✅ | |
| 2 | Soạn đề án trình CEO | ✅ | |
| 3 | Soạn JD cho 14 OC Owner | ✅ | |
| 4 | Soạn SOP nhịp họp tuần | ✅ | |
| 5 | Viết biên bản họp (từ ghi âm) | ✅ | |
| 6 | Soạn CEO Weekly Brief | ✅ | |
| 7 | Brainstorm KPI với CEO/CFO | ✅ | |
| 8 | Diễn giải dashboard cho non-tech | ✅ | |
| 9 | Soạn email/Telegram thông báo | ✅ | |
| 10 | Trả lời câu hỏi đơn giản | ✅ | |
| 11 | Build trang Tóm tắt CEO (HTML) | | ✅ |
| 12 | Build trang Tài chính (HTML) | | ✅ |
| 13 | Build 4 Phòng Họp Chiến lược | | ✅ |
| 14 | Viết extract script đọc Excel | | ✅ |
| 15 | Viết rule engine phân loại 14 OC | | ✅ |
| 16 | Setup tự động chạy hằng ngày | | ✅ |
| 17 | Build Trợ lý AI integration | | ✅ |
| 18 | Deploy lên Vercel | | ✅ |
| 19 | Setup phân quyền Supabase | | ✅ |
| 20 | Sửa bug khi dashboard sai số | | ✅ |
| 21 | Thêm KPI mới vào schema | | ✅ |
| 22 | Audit security/performance | | ✅ |
| 23 | Cập nhật tài liệu kỹ thuật (CLAUDE.md) | | ✅ |
| 24 | Refactor code | | ✅ |
| 25 | Migration database | | ✅ |
| 26 | Viết test cho extract script | | ✅ |
| 27 | Soạn email gửi đối tác | ✅ | |
| 28 | Tạo Excel template chuẩn cho data entry | | ✅ |
| 29 | Generate sample data | | ✅ |
| 30 | Review code trước merge | | ✅ |

### Trường hợp dùng cả hai (hybrid)

- **Tạo doc lớn structured (Org Chart · Process Map):** Chat viết narrative · Code build structure
- **Update Google Doc đã tồn tại:** Chat viết content mới · Code chạy Docs API để insert giữ format
- **Cập nhật dashboard có narrative:** Code lấy số liệu · Chat viết tóm tắt insight

---

## 6. Folder-by-Folder — Ai làm gì với folder nào

### `📋 README.md · HANDOVER · IMPLEMENTATION_PLAN · DATA_REQUIREMENTS`
**Ai đọc:** Tất cả (theo Section 3)
**Khi đọc:** Ngày 1-2
**Có sửa không:** Chỉ PMO Lead update (vd điền tên người vào IMPLEMENTATION_PLAN)
**Công cụ:** Đọc bằng mắt · sửa bằng Claude Chat (paste vào) hoặc text editor

---

### `📋 lessons-learned.md`
**Ai đọc:** Tech Lead + Dev (BẮT BUỘC trước khi code) · PMO (nên đọc)
**Ai sửa:** Bất kỳ ai phát hiện bài học mới — ghi vào Section 2 (LL-013+)
**Công cụ Code đọc:** Claude Code TỰ ĐỘNG load file này đầu mỗi session
**Cadence:** Update khi có correction · review cuối tuần

---

### `⚙️ .claude/rules/`
**Ai đọc:** Claude Code (auto) · Dev (1 lần đầu)
**Ai sửa:** Tech Lead khi convention thay đổi
**Mục đích:** Đảm bảo Claude Code tuân convention dự án (không thêm `Co-Authored-By` · không commit `.env` · v.v.)

---

### `⚙️ .claude/skills/`
**Ai dùng:** Claude Code TỰ ĐỘNG match khi user nói câu kích hoạt
**Khi nào trigger:**
- "review 14 OC tuần này" → `gsbb-oc-weekly-review`
- "soạn brief cho CEO" → `gsbb-ceo-weekly-brief`
- "tạo SOP mới" → `gsbb-doc-format`
- "soạn IPAM agenda" → `gsbb-ipam-facilitation`
- "viết doc gửi team" → `gsbb-vietnamese-writing`

**Cách dùng manual:**
```
Trong Claude Code:
/skill gsbb-ceo-weekly-brief
```

**Mở rộng:** Khi team phát hiện pattern lặp lại > 3 lần → tạo skill mới theo template.

---

### `📦 CORE_SCRIPTS/`
**Ai dùng:** Dev (import module dùng chung)
**Mục đích:** Tránh duplicate code giữa Control Tower và War Room
**Module có sẵn:**
- `schema_validator.py` — validate JSON output (đã chạy được, 5/5 schema PASS)

**Module chờ build (Phase 2):**
- `bravo_client.py` — kết nối Bravo ERP
- `mes_client.py` — kết nối MES
- `sheets_client.py` — Google Sheets API
- `ai_insights.py` — Anthropic API wrapper
- `telegram_notify.py` — gửi alert qua Telegram

---

### `📦 DATA_LAYER/` ⭐ QUAN TRỌNG NHẤT
**Ai đọc/sửa:** Dev (qua script · KHÔNG sửa tay)
**Mục đích:** Nguồn sự thật duy nhất — Control Tower + War Room đều đọc từ đây
**5 domain:** finance · customer · production · quality · campaign
**16 JSON files** (xem `DATA_REQUIREMENTS.md`)

**Quy tắc cứng:**
- ❗ Không sửa file `.json` thủ công — luôn qua extract script
- ❗ Mọi schema change phải có migration
- ❗ File `.json` được commit vào git (audit trail)

**Sample data hiện có:**
- `finance_data_sample.json` · `customer_data_sample.json` · `production_data_sample.json` · `quality_data_sample.json` · `oc_status_data_sample.json` · `ipam_log_sample.json`

→ Dev có thể chạy dashboard ngay không cần data thật.

---

### `📦 CONTROL_TOWER/`
**Ai dùng:** Dev build · PMO/CEO/CFO/Owner xem qua trình duyệt
**Cách chạy local:**
```bash
cd CONTROL_TOWER && python3 serve.py 8080
# Mở: http://localhost:8080
```
**8 trang cần build** (xem `gsbb-domain.md` rule):
| # | File | Trạng thái |
|---|---|---|
| 1 | `app/index.html` | ✅ Có mẫu (sample data) |
| 2 | `app/finance.html` | ⏳ Chờ build (W3) |
| 3 | `app/customer.html` | ⏳ Chờ build (W4) |
| 4 | `app/otip.html` | ⏳ Chờ build (W5) |
| 5 | `app/plant.html` | ⏳ Chờ build (W7-8) |
| 6 | `app/quality.html` | ⏳ Chờ build (W6) |
| 7 | `app/supply.html` | ⏳ Chờ build (W9-10) |
| 8 | `app/oc-ipam.html` | ⏳ Chờ build (W3) |

---

### `📦 WAR_ROOM/`
**Ai dùng:** Dev build · CEO/PMO xem khi họp
**Cách chạy local:**
```bash
cd WAR_ROOM && python3 serve.py 8090
# Mở: http://localhost:8090
```
**4 rooms cần build:**
- `app/campaign-portfolio.html` (14 OC) — ⏳ chờ build
- `app/customer-portfolio.html` — ⏳ chờ build
- `app/plant-family.html` — ⏳ chờ build
- `app/issue-loss.html` — ⏳ chờ build

**Classifier có sẵn:** `classify/classify_campaign.py` (đã chạy được, phân 14 OC vào 5 nhóm)

---

### `📦 CLAUDE_LAYER/`
**Ai dùng:** Tech Lead build · PMO consume output
**Mục đích:** Tích hợp Trợ lý AI (Claude API) để auto-generate insights
**Chờ build (Phase 2):**
- `generate_insights.py` — gọi Anthropic API, output `DATA_LAYER/ai_insights.json`
- 2 prompts có sẵn: `daily_insights.md` · `ceo_weekly_review.md`

---

### `📊 templates/`
**Ai dùng:** Data Lead + data owners (CFO · Sales Lead · SX Lead · QA Lead · PMO)
**Mục đích:** Data owners đặt file Excel hằng ngày vào `<domain>/inbox/` → script extract đọc tự động
**Setup tuần 2:**
```bash
# Copy 3 file Excel mẫu từ handover
cp /Users/minhlee/Downloads/GS_AI/Data/*.xlsx GSBB_PROJECTS/templates/samples/
```

---

### `🚀 phase2/`
**Ai dùng:** Tech Lead (sau W12)
**Khi nào active:** Sau khi Phase 1 chạy local ổn định
**3 file sẵn:**
- `vercel.json` → copy vào `CONTROL_TOWER/vercel.json` khi deploy
- `supabase_schema.sql` → paste vào Supabase SQL editor
- `github_actions_cron.yml` → đặt vào `.github/workflows/refresh-control-tower.yml`

---

### `📝 docs/`
**Mục đích:** Briefs (Chat input) + Reports (Chat/Code output)
**Files hiện có:**
- `BRIEF-Báo_cáo_Tổng_thể_GSBB.md` — brief để Chat viết Report tổng thể cho BOD
- `BRIEF-Onboarding-Team-GSBB.md` — file bạn đang đọc
- (sẽ tạo) `REPORT-Tổng_thể_GSBB.md` — Chat output vào đây sau khi xử lý brief

---

## 7. Runbook Day 0 → Day 30

### 🟦 DAY 0 — Nhận bàn giao

**Owner:** Tech Lead
**Time:** 30 phút

- [ ] Nhận folder `GSBB_BUILD/` từ GSF (qua zip / drive / git)
- [ ] Đặt vào máy: `~/GSBB_BUILD/`
- [ ] Xác minh có **60 files** trong folder (`find ~/GSBB_BUILD -type f | wc -l`)
- [ ] Đọc `DO_NOT_COMMIT.md` để hiểu folder này là workspace tạm

---

### 🟦 DAY 1 — Setup repo GitHub

**Owner:** Tech Lead
**Time:** 2 giờ

- [ ] Tạo GitHub Organization GSBB (nếu chưa có): https://github.com/organizations/new
- [ ] Tạo repo private: `gh repo create gsbb/GSBB_PROJECTS --private`
- [ ] Clone về máy: `git clone git@github.com:gsbb/GSBB_PROJECTS.git`
- [ ] Copy nội dung `GSBB_BUILD/` vào repo (TRỪ `DO_NOT_COMMIT.md` và `.gitignore` workspace)
- [ ] Tạo `.gitignore` chuẩn (xem `IMPLEMENTATION_PLAN.md` mục 1.4)
- [ ] First commit: `git commit -m "feat: initialize GSBB Control Tower scaffolding from GSF blueprint"`
- [ ] Push lên main: `git push -u origin main`

---

### 🟦 DAY 2 — Cài Claude Code + đọc tài liệu

**Owner:** Tech Lead + Dev
**Time:** 4 giờ

- [ ] Cài Python 3.11+ (`pyenv install 3.11.9 && pyenv global 3.11.9`)
- [ ] Cài Node 20+ (`brew install node@20`)
- [ ] Cài Claude Code: `npm install -g @anthropic-ai/claude-code`
- [ ] Login Claude Code: `claude` (cần Anthropic API key hoặc Claude Pro)
- [ ] Mở Claude Code trong repo: `cd GSBB_PROJECTS && claude`
- [ ] Test cài đặt: trong Claude Code gõ `/help` → thấy danh sách lệnh
- [ ] Tech Lead + Dev đọc theo Section 3 của bài này
- [ ] **BẮT BUỘC** đọc `lessons-learned.md` 12 LL seed (15 phút)

---

### 🟦 DAY 3 — Test scaffolding chạy được

**Owner:** Tech Lead
**Time:** 2 giờ

- [ ] Cài Python deps: `pip install -r requirements.txt`
- [ ] Test schema validator: `python3 CORE_SCRIPTS/scripts/schema_validator.py`
  → Kỳ vọng: 5/5 sample PASS
- [ ] Test classify: `python3 WAR_ROOM/classify/classify_campaign.py`
  → Kỳ vọng: log "Counts: {'Accelerate': 5, 'Support': 1, 'Watch': 6, 'Reset': 2, 'Close': 0}"
- [ ] Test Control Tower: `cd CONTROL_TOWER && python3 serve.py 8080`
  → Mở http://localhost:8080 thấy trang Executive Summary với 14 OC
- [ ] Test War Room: terminal khác `cd WAR_ROOM && python3 serve.py 8090`
  → Mở http://localhost:8090 thấy 4 rooms
- [ ] Demo cho PMO Lead (15 phút) — họ nhìn được product là gì
- [ ] Nếu có bug → ghi vào `lessons-learned.md` LL mới + fix

---

### 🟦 DAY 4-5 — Chốt KPI với CEO

**Owner:** PMO Lead + CEO + CFO
**Tool:** Claude Chat
**Time:** 1 buổi họp 90 phút

- [ ] PMO Lead in `20260420_PMO_Phân-tích_KPI-đề-xuất-Control-tower.docx` cho CEO
- [ ] Trong buổi họp, CEO + CFO chốt:
  - 8 trang nào ưu tiên trước (Nhóm A khuyến nghị: 1, 2, 3, 8)
  - Bộ KPI cho từng trang (max 10 KPI/trang)
  - **Ngưỡng cảnh báo 3 màu** cho mỗi KPI (vd EBITDA > 25 tỷ = Xanh · 18-25 = Vàng · < 18 = Đỏ)
- [ ] PMO Lead dùng **Claude Chat** soạn biên bản chốt KPI (template trong skill `gsbb-doc-format`)
- [ ] Save biên bản vào `docs/MEETING-KPI-Chot-YYYY-MM-DD.md`

---

### 🟦 DAY 5-7 — Chốt data ownership

**Owner:** Data Lead + 5 phòng ban (CFO · Sales · SX · QA · PMO)
**Tool:** Claude Chat (soạn brief họp) + bảng tính
**Time:** 1 buổi họp 60 phút + 2 ngày follow-up

- [ ] Data Lead soạn brief họp (dùng Chat) — đính kèm `DATA_REQUIREMENTS.md`
- [ ] Họp với 5 trưởng phòng ban — chốt:
  - Mỗi loại dữ liệu ai cung cấp · format gì · tần suất bao lâu
  - Ai chịu trách nhiệm nếu data trễ
- [ ] Data Lead **điền cột** "Người cung cấp" + "Trạng thái sẵn sàng" trong `DATA_REQUIREMENTS.md`
- [ ] Commit `DATA_REQUIREMENTS.md` đã điền lên GitHub

---

### 🟦 DAY 8-10 — Build Trang 1 (Tóm tắt CEO) + Trang 8 (14 OC)

**Owner:** Dev #1 (Trang 1) · Dev #2 (Trang 8)
**Tool:** Claude Code
**Time:** 3 ngày mỗi trang

- [ ] Dev mở Claude Code trong `CONTROL_TOWER/`
- [ ] Nói với Claude: *"Đọc CLAUDE.md root + .claude/rules/* + lessons-learned.md trước khi code. Sau đó build trang Finance theo schema DATA_LAYER/schemas/finance.schema.json. Sample data ở finance_data_sample.json. Format giống app/index.html. RAG color theo ngưỡng chốt trong docs/MEETING-KPI-Chot-YYYY-MM-DD.md."*
- [ ] Test local: `python3 serve.py 8080`
- [ ] Click trang, check số đúng vs sample
- [ ] Commit + push
- [ ] Demo cho PMO (15 phút)

→ Lặp tương tự cho Trang 8.

---

### 🟦 DAY 11-14 — Demo CEO + iterate

**Owner:** PMO Lead + Tech Lead
**Time:** 1 buổi demo 30 phút + 3 ngày iterate

- [ ] Demo Trang 1 + Trang 8 cho CEO (sample data)
- [ ] Note feedback CEO bằng giấy / Telegram
- [ ] PMO + Tech Lead chọn 3-5 feedback quan trọng nhất
- [ ] Dev iterate 3 ngày
- [ ] Demo lại CEO → approve

---

### 🟦 DAY 15-20 — Build Trang 2 (Tài chính) + Trang 3 (Khách hàng)

**Owner:** Dev #1 (Tài chính) · Dev #2 (Khách hàng)
**Tool:** Claude Code
**Time:** 6 ngày

- [ ] Trang Tài chính: dùng schema `finance.schema.json` + sample data
- [ ] Trang Khách hàng: dùng `customer.schema.json` + sample data (từ file `Data/20260516_Sale_*.xlsx`)
- [ ] Demo CFO + Sales Lead

---

### 🟦 DAY 21-25 — Setup data thật (Phase 1 offline)

**Owner:** Data Lead + 5 trưởng phòng ban
**Tool:** Excel + Claude Code
**Time:** 5 ngày

- [ ] Data Lead tạo TEMPLATE.xlsx cho 5 domain (dùng Claude Code generate)
- [ ] Phân phát TEMPLATE cho 5 trưởng phòng ban
- [ ] Mỗi trưởng phòng nộp file Excel mẫu vào `templates/<domain>/inbox/`
- [ ] Dev viết 5 extract script (`extract_finance.py` · `extract_customer.py` · ...)
- [ ] Chạy: `python3 CONTROL_TOWER/extract/refresh_all.py`
- [ ] Verify: dashboard hiển thị số từ Excel thật (không phải sample nữa)

---

### 🟦 DAY 26-30 — Nhịp họp tuần + tinh chỉnh

**Owner:** PMO Lead + CEO
**Time:** 2 buổi họp + 3 ngày tinh chỉnh

- [ ] **Sáng thứ 2:** CEO mở dashboard 30 phút — review tình hình
- [ ] **Sáng thứ 6:** PMO + Owner họp War Room (chưa build, dùng tạm trang OC)
- [ ] PMO Lead viết CEO Weekly Brief đầu tiên (dùng Chat + skill `gsbb-ceo-weekly-brief`)
- [ ] Ghi 3-5 LL mới vào `lessons-learned.md`
- [ ] Kết thúc Day 30 → review tiến độ với CEO → quyết định Tuần 5-12

---

## 8. Data Flow Map — Dữ liệu từ đâu đến đâu

```
┌──────────────────────────────────────────────────────────────────┐
│  NGUỒN GỐC (do data owner pull)                                   │
│                                                                    │
│  Bravo ERP  →  CFO  →  Excel hằng ngày                            │
│  CRM/Cogover →  Sales Lead → Excel hằng tuần                      │
│  MES/Xunyue →  SX Lead → Excel hằng ngày                          │
│  QA system  →  QA Lead → Excel hằng ngày                          │
│  PMO Tracker → PMO Lead → Excel hằng tuần                         │
└──────────────────────────────────┬───────────────────────────────┘
                                   ▼
              ┌──────────────────────────────────────┐
              │  templates/<domain>/inbox/           │
              │  (Excel paste vào đây hằng ngày)     │
              └──────────────────┬───────────────────┘
                                 ▼
              ┌──────────────────────────────────────┐
              │  CONTROL_TOWER/extract/*.py          │
              │  (Script đọc Excel → validate → JSON)│
              └──────────────────┬───────────────────┘
                                 ▼
              ┌──────────────────────────────────────┐
              │  DATA_LAYER/<domain>/*.json          │ ← Nguồn sự thật
              │  (Commit vào git làm audit trail)    │
              └──────┬─────────────────────┬─────────┘
                     ▼                     ▼
      ┌──────────────────────┐    ┌──────────────────────┐
      │  CONTROL_TOWER/      │    │  WAR_ROOM/           │
      │  (8 trang dashboard) │    │  (4 rooms quyết định) │
      └──────────┬───────────┘    └──────────┬───────────┘
                 │                            │
                 └──────────┬─────────────────┘
                            ▼
              ┌──────────────────────────────────────┐
              │  CLAUDE_LAYER/                       │
              │  (AI insights · CEO Weekly Brief)    │
              │  Output: DATA_LAYER/ai_insights.json │
              └──────────────────┬───────────────────┘
                                 ▼
                       CEO · PMO · BOD
                  (đọc qua trình duyệt / email)
```

### Giai đoạn 1 (W1-W12): Excel manual paste
### Giai đoạn 2 (W13+): Thay bằng API connectors (Bravo · MES · Sheets)

---

## 9. 7 Workflow thường gặp — Step-by-step

### Workflow 1 — Data owner cập nhật data hằng ngày

**Owner:** CFO · Sales Lead · SX Lead · QA Lead · PMO
**Tool:** Excel + Telegram alert
**Frequency:** Hằng ngày (sáng 8:00)

1. Mở hệ thống nguồn (Bravo · MES · CRM · QA system)
2. Export báo cáo ngày → file Excel
3. Save vào folder share: `templates/<domain>/inbox/YYYY-MM-DD.xlsx`
4. (Phase 1) Báo Tech Lead → Tech Lead chạy `refresh_all.py`
5. (Phase 2) Cron tự động chạy lúc 8:30 → dashboard auto update

---

### Workflow 2 — Dev build trang mới

**Owner:** Dev
**Tool:** Claude Code
**Time:** 2-3 ngày/trang

```bash
cd GSBB_PROJECTS
claude
```

Trong Claude Code, nói:
```
Đọc CLAUDE.md, .claude/rules/*, lessons-learned.md, gsbb-domain.md trước.
Sau đó build trang Quality (trang 6 trong gsbb-domain.md).
Schema: DATA_LAYER/schemas/quality.schema.json
Sample data: DATA_LAYER/quality/quality_data_sample.json
Format giống app/index.html nhưng có biểu đồ Pareto top 5 defects (dùng Chart.js từ CDN).
RAG threshold: FPY < 90% = Đỏ · 90-95% = Vàng · > 95% = Xanh
Test local rồi báo tôi mở trình duyệt verify.
```

---

### Workflow 3 — PMO viết CEO Weekly Brief

**Owner:** PMO Lead
**Tool:** Claude Chat (web/app)
**Time:** 15 phút mỗi sáng thứ 2

1. Mở Claude Chat
2. Paste prompt từ `.claude/skills/gsbb-ceo-weekly-brief/SKILL.md`
3. Paste 5 file JSON từ `DATA_LAYER/` vào Chat
4. Chat output draft 1 trang
5. PMO review 5 phút · edit
6. Forward CEO qua email/Telegram

→ Sau Phase 2 (W12+): Trợ lý AI tự generate vào sáng Chủ nhật, PMO chỉ review.

---

### Workflow 4 — OC Owner báo IPAM issue

**Owner:** 14 OC Owner
**Tool:** Claude Chat
**Time:** 10 phút khi có issue mới

1. Mở Claude Chat
2. Nói: *"Soạn IPAM entry mới cho OC-03. Issue: Xunyue trễ tích hợp 3 tuần. Cần PMO escalate."*
3. Chat output format JSON theo schema `ipam_log`
4. Owner copy vào Telegram group PMO
5. PMO Lead paste vào `DATA_LAYER/campaign/ipam_log.json` (qua Code)

---

### Workflow 5 — Tech Lead sửa bug

**Owner:** Tech Lead
**Tool:** Claude Code
**Time:** Tùy bug

```bash
claude

# Trong Claude Code:
# Issue: dashboard hiển thị COPQ = 87 tỷ (đúng phải 8.7 tỷ)
```

Nói với Claude:
```
Bug: trang Tài chính hiển thị COPQ = 87 tỷ, đúng phải 8.7 tỷ.
Debug: check DATA_LAYER/finance/finance_data.json, check extract script.
Tìm root cause (không patch tạm).
Trước khi fix → đề xuất nguyên nhân + cách verify.
```

→ Claude Code tìm bug · propose fix · user duyệt · fix · test · commit.

Sau khi fix → ghi vào `lessons-learned.md`:
```
### LL-014 — Đơn vị raw số liệu vs đơn vị display
**Triệu chứng:** ...
**Bài học:** ...
**Áp dụng:** ...
```

---

### Workflow 6 — Cập nhật schema thêm KPI mới

**Owner:** Tech Lead + Data Lead
**Tool:** Claude Code
**Time:** 2 giờ

1. CEO yêu cầu thêm KPI mới (vd "tỷ lệ tăng trưởng khách hàng mới")
2. Data Lead xác nhận data có sẵn không
3. Tech Lead mở Claude Code:
   ```
   Thêm field "new_customer_growth_pct" vào schemas/customer.schema.json.
   Tạo migration file ở DATA_LAYER/migrations/YYYYMMDD_add_customer_growth.md
   Update sample data + extract script + trang Customer hiển thị KPI mới.
   ```
4. Test local · commit · push
5. Ghi LL nếu phát hiện điều mới

---

### Workflow 7 — Demo CEO cuối tuần

**Owner:** PMO Lead + Tech Lead
**Tool:** Trình duyệt (CEO) · Telegram (feedback)
**Time:** 30 phút mỗi thứ 6

1. Sáng thứ 6: PMO + Tech Lead refresh data mới nhất
2. CEO mở `http://localhost:8080` (Phase 1) hoặc `control-tower.gsbb.vn` (Phase 2)
3. Click qua 8 trang · 4 War Room (15 phút)
4. CEO note feedback vào Telegram group
5. Tech Lead triage: bug critical fix ngay · feature mới đưa vào backlog
6. Update `lessons-learned.md` nếu có insight mới

---

## 10. Troubleshooting

### "Claude Code không chạy"
- Check: `claude --version`
- Re-login: `claude` (gõ trong terminal)
- Check internet · API key valid

### "Dashboard hiển thị 'Lỗi tải dữ liệu'"
- Check serve.py đang chạy: `lsof -i :8080`
- Check file JSON tồn tại: `ls DATA_LAYER/<domain>/`
- Mở Console trình duyệt (F12) xem lỗi gì

### "Schema validator FAIL"
- Đọc message lỗi → biết field nào sai
- Compare với `DATA_LAYER/schemas/<domain>.schema.json`
- Fix file JSON hoặc fix script extract

### "Git push bị reject"
- `git pull --rebase origin main`
- Re-push: `git push`

### "Claude Code đang code sai convention"
- Nhắc Claude: *"Đọc lại `.claude/rules/*` + `lessons-learned.md` trước khi code tiếp"*
- Update rules nếu phát hiện convention chưa có

---

## 11. FAQ

**Q1: Tôi không biết code, có dùng Claude Code được không?**
A: Không bắt buộc. PMO/OC Owner chỉ dùng Chat. Code dành cho Tech Lead + Dev.

**Q2: Bao giờ chuyển từ Excel paste sang API thật?**
A: Sau W12 (kết thúc Phase 1). Phase 2 build API connector cho Bravo + MES + Sheets.

**Q3: War Room có lên web không?**
A: Khuyến nghị: chỉ chạy local hoặc VPN-only. Dữ liệu chiến lược nhạy cảm — không nên public.

**Q4: Nếu Tech Lead nghỉ giữa chừng?**
A: `CLAUDE.md` + `lessons-learned.md` + skill `.claude/skills/*` cung cấp đầy đủ context cho người mới. Onboarding 1 tuần là chạy được.

**Q5: Có cần training team 14 OC Owner không?**
A: Có. PMO Lead training 60 phút cho 14 Owner về:
- Cách báo status OC hằng tuần
- Cách dùng skill `gsbb-ipam-facilitation` trong Chat
- Cách đọc dashboard

**Q6: Quá nhiều subscription Claude Pro ($20 × 17 người = nhiều), có cách rẻ hơn?**
A: Có thể:
- 14 OC Owner dùng free tier (giới hạn message/ngày)
- Hoặc 1 account Claude Team chia sẻ cho 5 người = $25-30/người
- Hoặc dùng Claude API trực tiếp + 1 web UI nội bộ (chỉ Tech Lead build được)

**Q7: Tài liệu nào cần Chat đọc trước khi viết?**
A: Theo brief cụ thể (vd `BRIEF-Báo_cáo_Tổng_thể_GSBB.md` liệt kê 14 source). Nói chung: HANDOVER + IMPLEMENTATION_PLAN + DATA_REQUIREMENTS + tài liệu domain liên quan.

**Q8: Tài liệu nào Code load tự động?**
A: Đầu mỗi session, Code load:
- `CLAUDE.md` (root)
- `lessons-learned.md`
- `.claude/rules/*.md`
- File `CLAUDE.md` của project đang làm (vd `CONTROL_TOWER/CLAUDE.md`)
- Skill được trigger theo câu kích hoạt

**Q9: Có monitor cost Claude API không?**
A: Có. Sau W12 build CLAUDE_LAYER → setup cost alert ở Anthropic Console > $X/tháng.

**Q10: Bao giờ team GSBB tự bay được?**
A: Sau 60 ngày (Phase 1 done). Sau 90 ngày (Phase 2 done) → vận hành ổn định không cần GSF support.

---

## 12. Liên hệ hỗ trợ

| Vấn đề | Liên hệ |
|---|---|
| Architecture · best practice | GSF — Lê Vũ Minh (`minhvu.lee@outlook.com`) |
| Domain knowledge GSBB | PMO Lead GSBB |
| Bug code | Tech Lead GSBB |
| Data sai/thiếu | Data Lead GSBB |
| KPI/scope changes | CEO GSBB qua PMO |

---

*Goldsun Bao Bì · Tài liệu nội bộ · Không phát hành ra ngoài*
*Soạn: Lê Vũ Minh (GSF) · 2026-05-17*
