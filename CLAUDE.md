# CLAUDE.md — GSBB_PROJECTS

> Trước mỗi session: Review `lessons-learned.md` và relevant project CLAUDE.md.

## Project Portfolio

| Project | Description | CLAUDE.md |
|---|---|---|
| `CORE_SCRIPTS` | Shared Python modules (Bravo · MES · Sheets · Schema · AI · Telegram) | `CORE_SCRIPTS/CLAUDE.md` |
| `DATA_LAYER` | Normalized JSON — source of truth (5 domains) | `DATA_LAYER/CLAUDE.md` |
| `CONTROL_TOWER` | Operational dashboard (8 pages) | `CONTROL_TOWER/CLAUDE.md` |
| `WAR_ROOM` | Strategic decision room (4 rooms) | `WAR_ROOM/CLAUDE.md` |
| `CLAUDE_LAYER` | AI narrative + query tools | `CLAUDE_LAYER/CLAUDE.md` |

## Architecture

Control Tower + War Room dùng chung `DATA_LAYER/`. Claude/Kayson chỉ đọc data, không thay quyền quyết định.

```
Bravo/MES/Sheets → extract scripts → DATA_LAYER/*.json → Control Tower + War Room → Claude insights
```

## Common Commands

```bash
# Refresh all data (Phase 1 — đọc Excel từ templates/<domain>/inbox/)
python3 CONTROL_TOWER/extract/refresh_all.py

# Local Control Tower
cd CONTROL_TOWER && python3 serve.py 8080

# Local War Room
cd WAR_ROOM && python3 serve.py 8090

# Generate AI insights
cd CLAUDE_LAYER && python3 generate_insights.py
```

## Workflow

1. Plan Mode trước task phức tạp → confirm trước khi code
2. Mỗi feature → cập nhật CLAUDE.md tương ứng
3. Schema lock sớm → mọi breaking change phải có migration
4. Sample data committed → dev không bị block
5. Done = verified working (chạy local + visual check OK)

## Tham khảo

- `README.md` — overview
- `IMPLEMENTATION_PLAN.md` — plan 90 ngày
- `DATA_REQUIREMENTS.md` — data inventory
- `HANDOVER_TEAM_GSBB.md` — báo cáo bàn giao
- `lessons-learned.md` — bài học seed từ GSF + tích lũy GSBB (review đầu mỗi session)
- `docs/BRIEF-Báo_cáo_Tổng_thể_GSBB.md` — brief gửi Chat viết Report tổng thể cho BOD
- `docs/REPORT-Tổng_thể_GSBB.md` — Report tổng thể (sau khi Chat output)
- `.claude/skills/` — 5 skills GSBB (doc-format · vietnamese-writing · oc-weekly-review · ipam-facilitation · ceo-weekly-brief)
- `GSBB_Control_Tower_Setup_Guide.md` (file gốc Minh GSF) — tech reference 996 dòng
