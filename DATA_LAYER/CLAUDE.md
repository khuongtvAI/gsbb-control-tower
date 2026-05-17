# DATA_LAYER — Source of Truth

## Nguyên tắc

- 1 nguồn sự thật duy nhất cho Control Tower + War Room
- Mọi file JSON ở đây có schema tương ứng trong `schemas/`
- Schema-lock sớm — breaking change cần migration
- Sample data committed → dev frontend không bị block

## Cấu trúc

```
finance/
├── finance_data.json          ← Bravo daily
└── ebitda_bridge.json         ← CFO weekly

customer/
├── customer_data.json         ← Sales weekly
├── pipeline_data.json         ← CRM daily
└── otip_data.json             ← KHSX daily

production/
├── production_data.json       ← MES daily
├── oee_data.json              ← MES daily
└── downtime_data.json         ← MES daily

quality/
├── quality_data.json          ← QA daily
├── copq_data.json             ← QA + Finance weekly
└── ncr_capa_data.json         ← QA daily

campaign/
├── campaign_data.json         ← PMO weekly overall
├── oc_status_data.json        ← 14 OC Owners weekly
├── ipam_log_data.json         ← IPAM facilitator daily
├── escalation_queue.json      ← PMO daily
└── waiting_decisions.json     ← CEO + PMO daily

schemas/
├── finance.schema.json
├── customer.schema.json
├── production.schema.json
├── quality.schema.json
└── campaign.schema.json
```

## Update workflow

```bash
# Manual (Phase 1)
python3 ../CONTROL_TOWER/extract/refresh_all.py

# Auto (Phase 2 - GitHub Actions cron)
# Xem .github/workflows/refresh-control-tower.yml
```

## Validation

Mọi extract script gọi `CORE_SCRIPTS/scripts/schema_validator.py` trước khi ghi file.
