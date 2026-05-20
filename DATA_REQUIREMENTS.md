# Data Requirements — GSBB Control Tower & War Room

> **Mục đích:** Liệt kê toàn bộ data cần thiết cho 8 trang Control Tower + 4 War Room. Mỗi item: nguồn · owner · tần suất · format · schema · trạng thái sẵn sàng.
>
> **Cách dùng:** Data Lead điền cột "Người cung cấp" + "Trạng thái sẵn sàng" trong tuần 1 → đây là bản gốc để track gap.

---

## 1. Tổng quan 5 domain data

| Domain | JSON files | Nguồn chính | Tần suất | Owner |
|---|---|---|---|---|
| **Finance** | `finance_data.json` · `ebitda_bridge.json` | Bravo ERP · CFO | Daily / Weekly | CFO |
| **Customer** | `customer_data.json` · `pipeline_data.json` · `otip_data.json` | Sales/CRM · Cogover | Daily | Sales Lead |
| **Production** | `production_data.json` · `oee_data.json` · `downtime_data.json` | MES · Xunyue | Daily | SX Lead |
| **Quality** | `quality_data.json` · `copq_data.json` · `ncr_capa_data.json` | QA · Công nghệ | Daily / Weekly | QA Lead |
| **Campaign** | `campaign_data.json` · `oc_status_data.json` · `ipam_log_data.json` · `escalation_queue.json` · `waiting_decisions.json` | PMO · OC Owners · IPAM team · CEO | Daily / Weekly | PMO |

---

## 2. Bảng chi tiết từng JSON file

### 2.1. Finance Domain

| File | Fields chính | Nguồn raw | Tần suất | Người cung cấp | Trạng thái sẵn sàng |
|---|---|---|---|---|---|
| `finance_data.json` | revenue · gross_margin · ebitda · copq · cash_position · ar/ap · inventory_value | Bravo export Excel hàng ngày | Daily | [chờ điền] | [chờ điền] |
| `ebitda_bridge.json` | from_period · to_period · bridge_items[{name, delta, type}] | Bravo + CFO Excel | Weekly | [chờ điền] | [chờ điền] |

**Ví dụ schema (finance_data.json):**
```json
{
  "meta": { "extracted_at": "2026-05-17T08:00:00+07:00", "source": "Bravo", "period": "2026-05" },
  "data": {
    "revenue_bn": 245.6,
    "gross_margin_pct": 18.3,
    "ebitda_bn": 22.1,
    "copq_bn": 8.7,
    "cash_position_bn": 45.0,
    "ar_overdue_bn": 12.3,
    "inventory_value_bn": 88.5,
    "rag": { "revenue": "green", "ebitda": "amber", "copq": "red" }
  }
}
```

### 2.2. Customer Domain

| File | Fields chính | Nguồn raw | Tần suất | Người cung cấp | Trạng thái sẵn sàng |
|---|---|---|---|---|---|
| `customer_data.json` | top_customers[{name, industry, revenue_ytd, margin, status}] · churn_list | Sales Excel + BCTC | Weekly | [chờ điền] | ✅ Có sample từ `Data/20260516_Sale_...xlsx` |
| `pipeline_data.json` | opportunities[{id, customer, stage, value_bn, weighted, close_month}] · win_rate | Cogover · CRM | Daily | [chờ điền] | ✅ Có sample (CRM_Data sheet) |
| `otip_data.json` | otip_pct · late_orders · short_orders · root_causes | Sales/KHSX | Daily | [chờ điền] | [chờ điền] |

**Mapping với data có sẵn:**
- File `Data/20260516_Sale_DulieuKinhDoanhTinhDenT4.xlsx` chứa **ERP_Data** (264 rows · 12 fields: Date · Week · Plant · Customer · Industry · Salesperson · FC_Value · PO_Value · DO_Value · Revenue) → trực tiếp map vào `customer_data.json` + `pipeline_data.json`
- Sheet **CRM_Data** (87 opportunities · stages Lead/Qualified/Won) → `pipeline_data.json`
- Sheet **CEO Dashboard · Sales & Order · Margin & Customer · Inventory & Delivery** → template UI tham khảo, không cần re-build

### 2.3. Production Domain

| File | Fields chính | Nguồn raw | Tần suất | Người cung cấp | Trạng thái sẵn sàng |
|---|---|---|---|---|---|
| `production_data.json` | output_by_line · completion_pct · manpower_actual_vs_plan · shift_logs | MES export | Daily | [chờ điền] | [chờ điền] |
| `oee_data.json` | overall_oee · availability · performance · quality · by_machine[] | MES/Xunyue | Daily | [chờ điền] | [chờ điền] |
| `downtime_data.json` | downtime_events[{machine, start, end, reason, category}] · pareto | MES | Daily | [chờ điền] | [chờ điền] |

### 2.4. Quality Domain

| File | Fields chính | Nguồn raw | Tần suất | Người cung cấp | Trạng thái sẵn sàng |
|---|---|---|---|---|---|
| `quality_data.json` | fpy_pct · defect_count · top_defects[] · complaint_count | QA Excel | Daily | [chờ điền] | ✅ Có sample từ `Data/20260506_QC_...xlsx` (sheet Data NG: 146 rows · 35 fields) |
| `copq_data.json` | copq_bn · breakdown_by_category · trend_4w | QA + Finance | Weekly | [chờ điền] | [chờ điền] |
| `ncr_capa_data.json` | open_ncr[] · open_capa[] · closure_rate · overdue_count | QA | Daily | [chờ điền] | ✅ Có sample (sheet Car, audit + Đối sách) |

**Mapping với data có sẵn:**
- File `Data/20260506_QC_Du_Lieu_Loi_Thang11_2025.xlsx` chứa đầy đủ: IPO Tổng hợp · Khách hàng · Data NG · CAR audit · Đối sách · Kết luận · Họp đầu ca · CTQ theo tuần · Dashboard
- → Map trực tiếp sang `quality_data.json` + `ncr_capa_data.json`

### 2.5. Campaign Domain (CHÍNH — trọng tâm GSBB)

| File | Fields chính | Nguồn raw | Tần suất | Người cung cấp | Trạng thái sẵn sàng |
|---|---|---|---|---|---|
| `campaign_data.json` | overall_status · total_oc · red/amber/green count · phase | PMO | Weekly | [chờ điền] | ✅ Có sample từ `Data/GSBB_Biz Contrl Tower_Master_Action_Tracker_W19.xlsx` |
| `oc_status_data.json` | oc_list[{id, name, owner, status, completion, blocker, next_milestone}] (14 OC) | OC Owners | Weekly | 14 OC Owners | ✅ Có sample từ `GSBB_14OC_Master_Reference.html` + Master Action Tracker |
| `ipam_log_data.json` | ipam_entries[{date, issue, owner, action, mitigation, status, deadline}] | IPAM facilitator | Daily | [chờ điền] | [chờ điền] |
| `escalation_queue.json` | escalations[{id, from_oc, to_role, reason, raised_at, due, status}] | PMO + OC Owners | Daily | PMO | [chờ điền] |
| `waiting_decisions.json` | decisions[{id, topic, requested_by, decision_owner, deadline, blocker_impact}] | CEO + PMO | Daily | PMO | [chờ điền] |

**Mapping với data có sẵn:**
- File `Master Action Tracker W19` (31 rows · 12 fields: Mã việc · Nhóm việc · Mục tiêu · Đầu ra · Owner · Phối hợp · Deadline · Dữ liệu cần nộp · Trạng thái · Blocker · Cách kiểm tra · Ghi chú) → trực tiếp là source cho `campaign_data.json`
- File `GSBB_14OC_Master_Reference.html` + `GSBB_14OC_owner_remapping.html` → 14 OC list

---

## 3. Gap Analysis (cập nhật sau buổi họp Data tuần 1)

### 3.1. Data đã có sẵn (dùng ngay)

| Domain | File source | Build được trang nào |
|---|---|---|
| Customer | `20260516_Sale_DulieuKinhDoanhTinhDenT4.xlsx` | Trang 3 (Customer) · một phần Trang 4 (OTIP) |
| Quality | `20260506_QC_Du_Lieu_Loi_Thang11_2025.xlsx` | Trang 6 (Quality & COPQ) |
| Campaign | `Master Action Tracker W19` + `14OC HTML` | Trang 1 (Executive) · Trang 8 (OC Board) |

→ **Có thể bắt đầu build Nhóm A + 1 phần Nhóm B ngay tuần 1-2** mà không cần chờ data mới.

### 3.2. Data còn thiếu (cần Data Lead pull về)

| Cần | Nguồn dự kiến | Ai pull | Khi nào cần |
|---|---|---|---|
| Bravo export hàng ngày (revenue · margin · cash) | Bravo ERP | Phòng Kế toán | W2 (cho Trang 2 Finance) |
| EBITDA Bridge | CFO Excel handcraft | CFO | W3 (cho Trang 2 Finance) |
| MES export production · OEE | Xunyue / MES | SX Lead | W6 (cho Trang 5 Plant) |
| Inventory + Supply | Bravo · phòng cung ứng | SCM Lead | W9 (cho Trang 7 Supply) |
| IPAM log + Escalation queue | PMO · OC Owners | PMO + 14 OC Owners | W2 (cho Trang 8) |
| Waiting decisions | CEO/PMO meeting notes | PMO | W2 |
| OTIP details (late/short orders) | KHSX · Sales | Sales Lead | W5 (cho Trang 4) |

### 3.3. Data chưa rõ nguồn (cần CEO chỉ định)

| Cần | Câu hỏi | Người cần ra quyết định |
|---|---|---|
| RAG threshold cho từng KPI | Red < ? · Amber ? - ? · Green > ? | CEO + CFO + PMO |
| Top customers cần protect | List 10-15 KH chiến lược | CEO + Sales Lead |
| OC priority weight | OC nào ưu tiên cao hơn trong dashboard | CEO + PMO |
| War Room decision rule | Threshold để classify Accelerate/Support/Watch/Reset/Close | CEO + PMO |

---

## 4. Quy trình data hằng ngày (Phase 1 — offline)

```
Sáng (trước 8:00):
  1. Mỗi data owner export file Excel từ hệ thống của mình
     • CFO: Bravo financial dashboard → finance_YYYY-MM-DD.xlsx
     • Sales: CRM + ERP pipeline → sales_YYYY-MM-DD.xlsx
     • SX: MES production report → production_YYYY-MM-DD.xlsx
     • QA: defect log → quality_YYYY-MM-DD.xlsx
     • PMO: OC tracker + IPAM log → campaign_YYYY-MM-DD.xlsx
  2. Đặt vào templates/<domain>/inbox/
  3. Chạy: python3 CONTROL_TOWER/extract/refresh_all.py
     • Script loop qua các Excel mới nhất trong từng inbox
     • Validate · normalize · ghi vào DATA_LAYER/<domain>/<file>.json
     • Snapshot lưu vào templates/<domain>/archive/
  4. git commit DATA_LAYER/ → push (audit trail)
  5. Dashboard auto refresh khi reload trình duyệt

Tối (trước 18:00):
  • Tùy domain: cập nhật ipam_log nếu có IPAM session trong ngày
```

---

## 5. Data Pipeline rules (xem `.claude/rules/data-pipeline.md`)

- Một nguồn sự thật: `DATA_LAYER/*.json`
- Schema lock sớm — breaking change cần migration
- Mọi extract script phải validate JSON output
- Rollback = `git revert` trên `DATA_LAYER/`
- JSON > 100KB phải gzip khi serve

---

## 6. Phụ lục — Mapping data có sẵn → file scaffolding

Khi handover sang team GSBB:

```bash
# Sao chép 3 file Excel mẫu vào templates/
cp ~/Downloads/GS_AI/Data/*.xlsx GSBB_PROJECTS/templates/samples/

# Sample JSON đã sẵn trong scaffolding tại:
DATA_LAYER/finance/finance_data_sample.json
DATA_LAYER/customer/customer_data_sample.json
DATA_LAYER/quality/quality_data_sample.json
DATA_LAYER/campaign/oc_status_data_sample.json
DATA_LAYER/campaign/master_action_tracker_sample.json
```

---

*Tài liệu nội bộ GSBB · Không phát hành ra ngoài*
