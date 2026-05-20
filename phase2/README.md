# Phase 2 — Web Deployment

> Chỉ active sau khi Phase 1 hoàn thành (W12+).

## Files

| File | Mục đích | Đích đến trong repo |
|---|---|---|
| `vercel.json` | Security headers + cache | Copy vào `CONTROL_TOWER/vercel.json` |
| `supabase_schema.sql` | RBAC schema (roles · war_room_access · audit_log + RLS) | Paste vào Supabase SQL Editor |
| `github_actions_cron.yml` | Auto-refresh data 8AM daily | Đặt vào `.github/workflows/refresh-control-tower.yml` |

## Stack

- Vercel — host CONTROL_TOWER (free) · WAR_ROOM private (Pro $20/mo)
- Supabase — Auth + RBAC + audit log (free 500MB)
- GitHub Actions — cron refresh
- Anthropic API — daily insights · CEO Weekly Brief
- Domain `gsbb.vn` — DNS Cloudflare → Vercel

## Secrets cần setup

| Secret | Nơi setup | Dùng cho |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel + GH Actions | Claude insights |
| `SUPABASE_URL` | Vercel env | Frontend auth |
| `SUPABASE_ANON_KEY` | Vercel env | Frontend auth |
| `SUPABASE_SERVICE_KEY` | GH Actions (backend only) | Server-side RLS bypass |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | GH Actions | Sheets API |
| `BRAVO_API_KEY` | GH Actions | Bravo ERP |
| `CRON_SECRET` | Vercel | Bảo vệ cron endpoints |

## Domain setup

```
control-tower.gsbb.vn → Vercel project "gsbb-control-tower"
war-room.gsbb.vn      → Vercel project "gsbb-war-room" (password protected)
```
