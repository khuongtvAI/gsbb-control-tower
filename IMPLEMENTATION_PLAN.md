# Implementation Plan — GSBB Control Tower & War Room

> **Mục tiêu:** Đưa Control Tower + War Room vào vận hành thật trong **90 ngày**, chia thành **2 giai đoạn**:
> - **Phase 1 (ngày 1-60):** Build local, dùng sample data + dữ liệu thật offline (Excel paste)
> - **Phase 2 (ngày 61-90):** Push online — GitHub + Supabase + Vercel + domain `control-tower.gsbb.vn`

> **Cam kết đầu ra:** 90 ngày → dashboard sống + war room sống + Claude integration + auto refresh + auth phân quyền.

---

## 0. Tóm tắt 1 trang

| Phase | Ngày | Mục tiêu chính | Đầu ra cứng |
|---|---|---|---|
| **P0 — Kick-off** | 1-7 | Setup môi trường + chốt scope + chốt schema | Repo GitHub · Claude Code chạy được · CLAUDE.md đầy đủ |
| **P1 — Local Dev** | 8-30 | Build 4 page ưu tiên (Nhóm A) + War Room Campaign · sample data | Dashboard local chạy 8080 · War Room local chạy 8090 · Demo CEO |
| **P1 — Mở rộng** | 31-60 | Build Nhóm B (2 page) + Nhóm C (2 page) + tích hợp data thật offline (Excel paste) | 8 trang đầy đủ · 4 war room đầy đủ · CEO/PMO dùng thật hàng tuần |
| **P2 — Web** | 61-75 | Deploy lên Vercel + Supabase + domain + auth | `control-tower.gsbb.vn` live · phân quyền theo role · auto refresh |
| **P2 — Tinh chỉnh** | 76-90 | Claude integration · daily insights · audit ROI · handover production | CEO Weekly Brief tự động · ROI report · vận hành ổn định |

---

## 1. Phase 0 — Kick-off (Ngày 1-7)

### 1.1. Chốt vai trò & owner (Ngày 1)

| Vai trò | Ai | Trách nhiệm |
|---|---|---|
| **Project Sponsor** | CEO GSBB | Phê duyệt scope · chốt RAG threshold · review tuần |
| **AI PMO Lead** | Lead P&C | Owner tổng · chạy nhịp tuần · escalate blocker |
| **Tech Lead** | Digital/IT Lead | Owner code · code review · deploy |
| **Data Lead** | Phòng kế hoạch hoặc IT data | Cung cấp data từ Bravo · MES · Sheets · Excel |
| **OC Owners (14)** | Theo phân công CEO | Nhập IPAM · OC status weekly |
| **Cố vấn kỹ thuật** | GSF (Minh) | Review architecture · best practice |

### 1.2. Tạo repo GitHub (Ngày 1-2)

```bash
# Trên GitHub Organization GSBB
gh repo create gsbb/GSBB_PROJECTS --private --description "GSBB Control Tower & Campaign War Room"

# Clone về máy
git clone git@github.com:gsbb/GSBB_PROJECTS.git
cd GSBB_PROJECTS

# Unzip nội dung GSBB_BUILD/ vào đây (trừ DO_NOT_COMMIT.md và .gitignore của workspace cũ)
unzip ~/Downloads/GSBB_BUILD.zip -d .
rm DO_NOT_COMMIT.md
# Thay .gitignore bằng bản chuẩn (xem mục 1.4)

git add -A
git commit -m "feat: initialize GSBB Control Tower scaffolding from GSF blueprint"
git push -u origin main
```

### 1.3. Setup máy dev (Ngày 2-3)

Mỗi dev cài:

```bash
# macOS
brew install pyenv node@20 git gh ripgrep jq fd
pyenv install 3.11.9 && pyenv global 3.11.9

# Windows: dùng WSL2 Ubuntu rồi chạy tương tự
```

Cài Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
claude  # login với Anthropic API key hoặc Pro/Team subscription
```

Cài (tuỳ chọn) Codex / Gemini CLI cho second opinion:

```bash
npm install -g @openai/codex
# Gemini CLI qua Google Cloud SDK
```

### 1.4. `.gitignore` chuẩn (sau khi handover)

```gitignore
# Environment
.env
.env.*
.env.local
*.sa-key.json
*.service-account.json

# Python
__pycache__/
*.pyc
.venv/
venv/

# Node
node_modules/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# KHÔNG ignore data JSON files (đó là source of truth)
!DATA_LAYER/**/*.json
```

### 1.5. Chốt scope KPI với CEO (Ngày 4-5)

Họp với CEO + CFO + PMO:
- Lấy file `20260420_PMO_Phân-tích_KPI-đề-xuất-Control-tower.docx` làm đầu vào
- CEO khoanh **ngưỡng RAG** (Red < X · Amber X-Y · Green > Y) cho từng KPI
- Loại bỏ KPI nice-to-have (chỉ giữ tối đa 10 KPI/trang)
- Output: bảng KPI đã chốt → cập nhật vào `DATA_LAYER/schemas/*.json`

### 1.6. Chốt nguồn data (Ngày 5-7)

Họp với Data Lead + từng phòng ban:
- Mỗi data source → ai giữ file/access? format gì? cập nhật bao lâu/lần?
- Output: `DATA_REQUIREMENTS.md` đã điền cột "Người cung cấp" + "Trạng thái" cho từng JSON

**Deliverable cuối Phase 0:**
- ✅ Repo GitHub live, CLAUDE.md đầy đủ
- ✅ Claude Code chạy được trên máy 3+ dev
- ✅ Bảng KPI đã chốt với CEO (RAG threshold)
- ✅ Data ownership matrix đầy đủ
- ✅ Sample data đã có cho 5 domain (finance · customer · production · quality · campaign)

---

## 2. Phase 1 — Local Development (Ngày 8-60)

### 2.1. Build order (theo đề xuất Setup Guide gốc)

```
Nhóm A — Ngày 8-30 (ƯU TIÊN CAO):
  ✅ Trang 1: Executive Campaign Summary (1 trang CEO mở mỗi sáng)
  ✅ Trang 8: OC & IPAM Control Board (14 OC status + escalation queue)
  ✅ Trang 2: Finance & EBITDA Bridge (CFO + CEO)
  ✅ Trang 3: Customer & Market Control (top 15 KH + pipeline)

Nhóm B — Ngày 31-45:
  ✅ Trang 4: OTIP / O2D Execution (giao hàng đúng hạn)
  ✅ Trang 6: Quality & COPQ Control (chất lượng + chi phí lỗi)

Nhóm C — Ngày 46-60:
  ✅ Trang 5: Plant & Value Stream Performance (sản xuất · OEE)
  ✅ Trang 7: Supply, Inventory & Material Risk

War Room — Song song với Nhóm A-B:
  ✅ Room 1: Campaign Portfolio (14 OC classification — Accelerate/Support/Watch/Reset/Close)
  ✅ Room 2: Customer Portfolio (Protect/Grow/Fix/Price-up/Exit)
  ✅ Room 3: Plant/Family (Invest/Stabilize/Fix bottleneck/Pilot AI/Phase out)
  ✅ Room 4: Issue/Loss Hotspot (Fix now/Root-cause/Monitor/SOP/Escalate)
```

### 2.2. Workflow build 1 page (mẫu cho mọi page)

```
Bước 1 — Schema lock (1-2 ngày)
  • Mở DATA_LAYER/schemas/<domain>.schema.json
  • Define cấu trúc JSON cho page đó
  • CEO/PMO/CFO review schema → chốt
  • Validate với jsonschema

Bước 2 — Extract script (2-3 ngày)
  • Viết CONTROL_TOWER/extract/extract_<domain>.py
  • Input: file Excel export từ Bravo/MES/Sheets (Phase 1 — paste tay)
  • Output: DATA_LAYER/<domain>/<domain>_data.json
  • Schema validation pass

Bước 3 — Sample data (0.5 ngày)
  • Commit sample data đầy đủ vào DATA_LAYER/ để dev frontend không bị block

Bước 4 — HTML page (3-4 ngày)
  • Build CONTROL_TOWER/app/<domain>.html
  • Fetch JSON · render KPI cards · render charts (Chart.js / Plotly)
  • RAG color theo threshold đã chốt với CEO

Bước 5 — Test local (1 ngày)
  • python3 serve.py 8080
  • Click qua mọi state · check edge cases (data null · 0 records · giá trị âm)

Bước 6 — Demo (0.5 ngày)
  • Demo cho CEO/PMO → ghi feedback → iterate
```

**Estimate:** 1 page = 7-10 ngày dev (1 người full-time). Với 2 dev parallel, 4 pages Nhóm A = 4 tuần.

### 2.3. Phase 1 — Data thật offline (paste tay)

Vì Phase 1 chưa nối API trực tiếp, workflow data thật:

```
Hàng sáng (hoặc theo cadence):
  1. Data owner export file từ Bravo/MES/Sheets → file Excel
  2. Đặt file vào templates/<domain>/inbox/<date>.xlsx
  3. Chạy: python3 CONTROL_TOWER/extract/refresh_all.py
  4. Script đọc Excel → validate → ghi DATA_LAYER/<domain>/<file>.json
  5. git commit DATA_LAYER/ + push (history audit trail)
  6. Dashboard local auto refresh
```

### 2.4. Phase 1 — War Room build (song song)

War Room **đọc lại** từ `DATA_LAYER/` (không nhân đôi data). Workflow:

```
WAR_ROOM/classify/classify_<room>.py
  • Input: DATA_LAYER/<domain>/*.json
  • Logic: rule engine phân loại bucket (vd OC → Accelerate/Support/Watch/...)
  • Output: WAR_ROOM/data/<room>_classification.json
  • Threshold rule do CEO/PMO chốt → ghi vào WAR_ROOM/classify/rules.py
```

UI War Room: dùng cùng pattern Control Tower (HTML static + JSON fetch).

### 2.5. Phase 1 — Claude Code workflow hàng ngày

```bash
cd GSBB_PROJECTS
claude

# Trong Claude Code:
/resume-session       # tiếp tục session trước
/plan                 # plan feature mới
# ... code ...
/code-review          # review trước commit
/simplify             # check code quality
/save-session         # cuối ngày
```

ECC skills khuyến nghị cài:
- `/plan`, `/code-review`, `/tdd`, `/security-review`, `/python-review`, `/docs`, `/save-session`, `/resume-session`, `/brainstorming`, `/simplify`

### 2.6. Phase 1 — Demo + feedback nhịp

| Tuần | Demo cho ai | Nội dung |
|---|---|---|
| W2 | CEO + PMO | Trang 1 (Executive) + Trang 8 (OC Board) — bản beta |
| W3 | CFO + CEO | Trang 2 (Finance) — bản beta |
| W4 | BD/Sales + CEO | Trang 3 (Customer) — bản beta |
| W5 | Toàn bộ | Nhóm A hoàn chỉnh — bắt đầu dùng thật |
| W6-8 | Theo từng trang | Nhóm B (OTIP · Quality) |
| W9 | OC Owners | War Room Campaign Portfolio |
| W10-12 | Toàn bộ | Nhóm C (Plant · Supply) + War Room đầy đủ |

**Deliverable cuối Phase 1:**
- ✅ 8 trang Control Tower chạy local, dùng được bằng sample + dữ liệu thật paste tay
- ✅ 4 War Room đầy đủ
- ✅ Refresh manual workflow ổn định
- ✅ CEO/PMO/CFO đã dùng thật ít nhất 4 tuần
- ✅ Feedback list rõ ràng cho Phase 2

---

## 3. Phase 2 — Web Deployment (Ngày 61-90)

### 3.1. Stack chọn

| Layer | Công cụ | Lý do |
|---|---|---|
| **Code repo** | GitHub | Đã có từ P0 |
| **Hosting Frontend** | Vercel | Static HTML/JS deploy nhanh, free tier dùng được |
| **Database + Auth** | Supabase | Postgres + Row Level Security + Auth · free tier 500MB |
| **Domain** | `control-tower.gsbb.vn` · `war-room.gsbb.vn` | DNS qua Cloudflare/Vercel |
| **Auto refresh** | GitHub Actions (cron) | Daily extract → commit data JSON → trigger Vercel redeploy |
| **AI Layer** | Anthropic Claude API | Daily insights + CEO Weekly Brief |

### 3.2. Tuần 1 Phase 2 (Ngày 61-67) — Setup hạ tầng

- Đăng ký Supabase project · tạo schema
- Đăng ký Vercel team account · link GitHub repo
- Đăng ký domain `gsbb.vn` (nếu chưa có) · setup DNS
- Tạo Service Account Google (cho Sheets API access)
- Setup secret vault: `GOOGLE_SERVICE_ACCOUNT_JSON`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`

### 3.3. Tuần 2 Phase 2 (Ngày 68-74) — Auth + RBAC

```sql
-- Supabase Auth: email + password (hoặc Google OAuth)
-- Tạo bảng user_roles:
CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('ceo','pmo','cfo','tl1','oc_owner','viewer')),
  oc_scope INT[] DEFAULT '{}',  -- OC numbers nếu là oc_owner
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Phân quyền theo role:**

| Role | Control Tower | War Room |
|---|---|---|
| CEO · Chủ tịch | Tất cả 8 trang | Tất cả 4 rooms |
| PMO · TL1 | Tất cả 8 trang | Tất cả 4 rooms |
| CFO | Trang 2 (Finance) + trang campaign-related | Room Customer + Campaign |
| Owner chức năng | Trang theo domain | Room theo domain |
| Claude SA | Read-only data layer | — (Claude không vào War Room) |

### 3.4. Tuần 3 Phase 2 (Ngày 75-81) — Deploy + GitHub Actions

```yaml
# .github/workflows/refresh-control-tower.yml
name: Refresh Control Tower Data
on:
  schedule:
    - cron: '0 1 * * *'  # 08:00 GMT+7 daily
  workflow_dispatch:
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-python@v6
        with: { python-version: '3.11' }
      - run: pip install -r requirements.txt
      - run: python3 CONTROL_TOWER/extract/refresh_all.py
      - run: |
          git config user.email "bot@gsbb.vn"
          git config user.name "GSBB Bot"
          git add DATA_LAYER/
          git diff --cached --quiet || {
            git pull --rebase origin main
            git commit -m "chore: refresh data $(date +%Y-%m-%d)"
            git push
          }
    env:
      GOOGLE_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}
```

Vercel auto deploy khi push lên `main` → dashboard luôn cập nhật.

### 3.5. Tuần 4 Phase 2 (Ngày 82-88) — Claude integration

Build `CLAUDE_LAYER/`:

```python
# CLAUDE_LAYER/generate_insights.py
from anthropic import Anthropic
import json

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def daily_insights():
    data = load_all_domains()  # đọc DATA_LAYER/*.json
    prompt = open("prompts/daily_insights.md").read()
    msg = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=4096,
        messages=[{"role":"user", "content": prompt + json.dumps(data)}]
    )
    write("DATA_LAYER/ai_insights.json", msg.content)
```

Cron 7AM hàng ngày → insights ready trước CEO mở dashboard 8AM.

### 3.6. Phase 2 — War Room: Private hay Public?

Theo Setup Guide gốc: **War Room Phase 2 nên private** (dữ liệu chiến lược):

**Option A (khuyến nghị):** War Room vẫn chạy local-only, Control Tower public
**Option B:** Deploy lên Vercel với password protection (Vercel Pro plan)
**Option C:** Deploy trên server nội bộ GSBB, VPN-only access

→ Chốt với CEO ở W12.

### 3.7. Deliverable cuối Phase 2

- ✅ `control-tower.gsbb.vn` live, auth phân quyền, refresh tự động
- ✅ War Room (option theo CEO chốt)
- ✅ Claude Daily Insights chạy 7AM hàng ngày
- ✅ CEO Weekly Brief tự động sáng thứ 2
- ✅ ROI report: giảm bao nhiêu giờ báo cáo thủ công · phát hiện vấn đề sớm hơn bao lâu
- ✅ Handover production: ai bảo trì · ai monitor · ai escalate

---

## 4. Ngân sách ước tính

| Hạng mục | Phase 1 | Phase 2 |
|---|---|---|
| Claude Code Pro (3-5 dev) | 3-5 × $20/tháng × 2 tháng = ~$200 | tương tự |
| Anthropic API (insights) | $0 (chưa dùng) | ~$50/tháng |
| Vercel | $0 | $0 (free tier) hoặc $20/tháng (Pro auth) |
| Supabase | $0 | $0 (free 500MB) → $25/tháng nếu vượt |
| Domain `gsbb.vn` | — | ~500K VNĐ/năm |
| Service Account · Google API | $0 | $0 |
| **Tổng Năm 1** | | **~30-50 triệu VNĐ** |
| **Vận hành Năm 2+** | | **~10-15 triệu VNĐ/năm** |

(Số liệu tham khảo từ `De_an_OCGSP_v2.0.docx` của GSBB)

---

## 5. Rủi ro & cách giảm thiểu

| Rủi ro | Tác động | Giảm thiểu |
|---|---|---|
| Data không sạch/không đủ | Dashboard "đẹp nhưng vô giá trị" | Data Lead chịu trách nhiệm chốt schema + validate trước build UI |
| CEO không dùng | Dự án chết | Demo sớm tuần 2-3 · iterate theo feedback CEO · không build to lớn rồi mới demo |
| Owner OC không nhập IPAM | War Room rỗng | Nhịp họp tuần cố định · escalate nếu owner trễ |
| Dev nghỉ giữa chừng | Mất context | CLAUDE.md đầy đủ · lessons-learned.md · session-save mỗi ngày |
| Bảo mật data chiến lược | Rò rỉ thông tin nhạy cảm | War Room private/local · auth Supabase RLS · Claude API zero-retention |
| Tích hợp Bravo/MES khó | Trễ Phase 2 | Phase 1 dùng paste Excel tay · không block Phase 1 |

---

## 6. Checklist khởi động (in ra dán bảng)

### Week 1 — Foundation
- [ ] Tạo GitHub repo `GSBB_PROJECTS`
- [ ] Setup cấu trúc folder từ scaffolding
- [ ] Tạo CLAUDE.md + rules
- [ ] Cài Claude Code CLI + ECC trên máy 3+ dev
- [ ] Cài Python 3.11 + dependencies
- [ ] First commit
- [ ] Tạo Google Service Account
- [ ] Xác nhận data sources: ai giữ file nào · format gì

### Week 2 — Data Layer
- [ ] Lock JSON schema cho Finance domain
- [ ] Lock JSON schema cho Campaign domain
- [ ] Viết extract_finance.py (Bravo Excel → JSON)
- [ ] Viết extract_campaign.py (OC/IPAM Sheets → JSON)
- [ ] Schema validation pass cho 2 domains
- [ ] Sample data committed

### Week 3-4 — Nhóm A Pages
- [ ] Page 1: Executive Campaign Summary
- [ ] Page 8: OC & IPAM Control Board
- [ ] Page 2: Finance & EBITDA Bridge
- [ ] Page 3: Customer & Market Control
- [ ] Demo CEO/PMO → feedback

### Week 5-8 — Nhóm B + War Room
- [ ] Page 4: OTIP / O2D
- [ ] Page 6: Quality & COPQ
- [ ] War Room: Campaign Portfolio
- [ ] War Room: Customer Portfolio
- [ ] GitHub Actions auto-refresh

### Week 9-12 — Nhóm C + Claude Layer + Deploy
- [ ] Page 5: Plant & Value Stream
- [ ] Page 7: Supply & Inventory
- [ ] War Room: Plant/Family + Issue/Loss
- [ ] Claude query tools + daily insights
- [ ] Phase 2: Deploy Vercel
- [ ] Auth + phân quyền
- [ ] ROI report

---

*Tài liệu nội bộ GSBB · Không phát hành ra ngoài*
