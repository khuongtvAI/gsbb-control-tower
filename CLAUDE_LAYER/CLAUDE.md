# CLAUDE_LAYER — AI Integration

## Vai trò

Claude/Kayson đứng trên `DATA_LAYER/` đã chuẩn hóa. Không đọc thủ công nhiều sheet rời.

## Components

- `query_tools.py` — get_oc_status() · list_red_oc() · get_ipam_case() · get_customer_portfolio() · get_quality_hotspots() · get_waiting_decisions() · get_escalation_queue() · get_ebitda_bridge()
- `generate_insights.py` — gọi Anthropic API → ghi `DATA_LAYER/ai_insights.json`
- `prompts/` — template prompts (daily_insights · ceo_weekly_review · oc_review · ipam_support)

## Use cases

| Use case | Cadence | Output location |
|---|---|---|
| Daily insights | Daily 7AM | `DATA_LAYER/ai_insights.json` |
| CEO Weekly Review | Mon 7AM | `DATA_LAYER/ceo_weekly_brief.md` |
| OC Review | On-demand | per-OC summary |
| IPAM Support | On-demand | BM01/BM02 draft |

## Nguyên tắc

- Claude **không thay quyền quyết định** — chỉ generate insight + draft
- Output qua review của owner trước khi dùng
- Anthropic API: bật zero-data-retention ở organization settings

## Liên kết

- [[DATA_LAYER/CLAUDE|DATA_LAYER]] — nguồn dữ liệu Claude đọc (read-only)
- [[CONTROL_TOWER/CLAUDE|CONTROL_TOWER]] — hiển thị ai_insights.json
- [[CORE_SCRIPTS/CLAUDE|CORE_SCRIPTS]] — ai_insights.py module
- [[IMPLEMENTATION_PLAN]] — Phase 2: Claude integration (ngày 82-88)
- [[lessons-learned]] — LL-008: CEO anonymization trong output
