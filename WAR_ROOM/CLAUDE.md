# WAR_ROOM — 4 Decision Rooms

War Room ≠ Dashboard. War Room là nơi **chốt quyết định chiến lược**, mỗi room dẫn đến **1 hành động cụ thể**.

## 4 Rooms

| Room | File | Decision Buckets |
|---|---|---|
| Campaign Portfolio | `app/campaign-portfolio.html` | Accelerate / Support / Watch / Reset / Close |
| Customer Portfolio | `app/customer-portfolio.html` | Protect / Grow / Fix / Price-up / Exit |
| Plant / Family | `app/plant-family.html` | Invest / Stabilize / Fix bottleneck / Pilot AI / Phase out |
| Issue / Loss Hotspot | `app/issue-loss.html` | Fix now / Root-cause / Monitor / SOP / Escalate |

## Nguyên tắc

- **Đọc lại** từ `../DATA_LAYER/*.json` — KHÔNG nhân đôi data
- `classify/classify_<room>.py` chứa rule engine → output `data/<room>_classification.json`
- Threshold rule do CEO + PMO chốt → ghi vào `classify/rules.py`
- War Room Phase 2 nên **private/local-only** vì dữ liệu chiến lược

## Commands

```bash
python3 serve.py 8090
python3 classify/classify_campaign.py
```
