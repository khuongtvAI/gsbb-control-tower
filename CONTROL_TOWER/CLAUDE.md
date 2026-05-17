# CONTROL_TOWER

Operational dashboard — 8 trang. Đọc từ `../DATA_LAYER/*.json` qua local server.

## Pages

| # | File | Owner data |
|---|---|---|
| 1 | `app/index.html` (Executive) | PMO |
| 2 | `app/finance.html` | CFO |
| 3 | `app/customer.html` | Sales Lead |
| 4 | `app/otip.html` | Sales + KHSX |
| 5 | `app/plant.html` | SX Lead |
| 6 | `app/quality.html` | QA Lead |
| 7 | `app/supply.html` | SCM Lead |
| 8 | `app/oc-ipam.html` | PMO + 14 OC Owners |

## Commands

```bash
# Local dev
python3 serve.py 8080

# Refresh data từ Excel inbox
python3 extract/refresh_all.py
```

## Convention

- HTML static (no build step) — Chart.js / Plotly từ CDN
- Mỗi page fetch `/data/<domain>/<file>.json` qua serve.py proxy
- RAG color: red `#dc2626` · amber `#f59e0b` · green `#16a34a`
