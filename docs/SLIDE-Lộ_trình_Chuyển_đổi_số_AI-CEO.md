# SLIDE DECK — Lộ Trình Chuyển Đổi Số Sang AI
### Trình bày cho CEO · GSBB · 2026

---

---

## SLIDE 1 — TRANG BÌA

# Chuyển Đổi Số Sang AI
## Từ Báo Cáo Thủ Công → Quyết Định Theo Thời Gian Thực

**GSBB Control Tower & Campaign War Room**

> *"Dữ liệu đến tay CEO sớm hơn 24 giờ — quyết định đúng hơn 10 lần."*

**Người trình bày:** AI PMO Lead · P&C
**Ngày:** Tháng 5, 2026

---

---

## SLIDE 2 — VẤN ĐỀ HIỆN TẠI

# Chúng Ta Đang Mất Bao Nhiêu?

### Thực trạng báo cáo hôm nay:

| Vấn đề | Hệ quả |
|---|---|
| Dữ liệu từ 5 nguồn (Bravo · MES · Sheets · Excel · Báo cáo tay) | CEO nhìn **bức tranh phân mảnh** |
| Báo cáo tổng hợp mất **2-3 ngày** | Quyết định dựa trên số liệu **đã cũ** |
| Không có ngưỡng RAG tự động | Vấn đề bị phát hiện **sau khi đã trễ** |
| 14 OC chạy song song, không có dashboard tập trung | PMO **không thấy** điểm nghẽn sớm |
| Insights phụ thuộc vào con người | Bỏ sót **pattern ẩn** trong dữ liệu |

### Chi phí vô hình:
> Mỗi ngày trễ quyết định = **cơ hội bị mất + chi phí tồn đọng**

---

---

## SLIDE 3 — TẦM NHÌN

# GSBB 90 Ngày Tới Trông Như Thế Nào?

```
7:00 SA — Claude AI tự động đọc toàn bộ data, viết insights
7:30 SA — CEO Weekly Brief tự động gửi inbox
8:00 SA — CEO mở Control Tower: 1 trang, tất cả KPI, màu RAG tức thì
           → Xanh: tiếp tục · Vàng: theo dõi · Đỏ: hành động ngay
```

### Từ → Đến:

| Hôm nay | 90 ngày tới |
|---|---|
| Báo cáo thủ công 2-3 ngày | Dashboard live, refresh mỗi sáng |
| Excel rời rạc | 1 nguồn sự thật duy nhất |
| CEO hỏi → chờ 1 ngày | CEO hỏi Claude → đáp trong 30 giây |
| Phát hiện vấn đề sau sự cố | Phát hiện vấn đề trước khi vỡ |
| 14 OC báo cáo riêng lẻ | 1 War Room phân loại chiến lược rõ ràng |

---

---

## SLIDE 4 — GIẢI PHÁP

# Hệ Sinh Thái Số GSBB

```
                    ┌─────────────────────────────────┐
                    │         CEO & Ban lãnh đạo       │
                    └──────────────┬──────────────────┘
                                   │
              ┌────────────────────┼───────────────────┐
              ▼                    ▼                    ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐
    │  CONTROL TOWER   │  │   CAMPAIGN WAR   │  │   CLAUDE AI     │
    │  (8 trang KPI)   │  │   ROOM (4 rooms) │  │  Daily Insights │
    │  control-tower   │  │  Phân loại OC    │  │  CEO Brief      │
    │  .gsbb.vn        │  │  Chiến lược      │  │  Query on-demand│
    └────────┬─────────┘  └────────┬─────────┘  └────────┬────────┘
             │                     │                      │
             └─────────────────────┼──────────────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │         DATA LAYER           │
                    │  Finance · Customer · OC     │
                    │  Production · Quality        │
                    └──────────────────────────────┘
                                   ▲
              ┌────────────────────┼───────────────────┐
              │                    │                    │
           Bravo                  MES              Google Sheets
         (Kế toán)            (Sản xuất)            (OC/IPAM)
```

**3 sản phẩm · 1 nền tảng data · Nhiều người dùng · Phân quyền rõ ràng**

---

---

## SLIDE 5 — LỘ TRÌNH 90 NGÀY

# 3 Giai Đoạn — Rõ Ràng, Đo Được

```
NGÀY    1────────7────────────────30──────────60──────────75──────────90
         │        │                 │           │           │           │
PHASE 0  ├────────┤                 │           │           │           │
Kick-off │Setup   │                 │           │           │           │
         │Scope   │                 │           │           │           │
         │Schema  │                 │           │           │           │
         │        │                 │           │           │           │
PHASE 1  │        ├─────────────────┤           │           │           │
Local    │        │ Build 8 trang   │           │           │           │
Build    │        │ + 4 War Room    │           │           │           │
         │        │ Data thật       │           │           │           │
         │        │ CEO dùng thật   │           │           │           │
         │        │                 │           │           │           │
PHASE 2  │        │                 ├───────────┤           │           │
Web &    │        │                 │ Deploy    │ Claude AI ├───────────┤
AI       │        │                 │ Vercel    │ Insights  │ Vận hành  │
         │        │                 │ Auth      │ Brief     │ ổn định   │
```

| Phase | Thời gian | Kết quả chính |
|---|---|---|
| **P0 — Kick-off** | Ngày 1-7 | Scope chốt · Schema chốt · Team sẵn sàng |
| **P1 — Local** | Ngày 8-60 | 8 trang dashboard · 4 War Room · CEO dùng thật |
| **P2 — Production** | Ngày 61-90 | Web live · Auto refresh · AI insights hàng ngày |

---

---

## SLIDE 6 — PHASE 1 CHI TIẾT

# Phase 1: Xây Nền — CEO Thấy Kết Quả Từ Tuần 2

### Thứ tự build (theo giá trị cho CEO):

**Ưu tiên cao — Tuần 2-4:**
- **Trang 1:** Executive Campaign Summary — CEO mở mỗi sáng
- **Trang 8:** OC & IPAM Board — 14 OC status + điểm nghẽn
- **Trang 2:** Finance & EBITDA — CFO + CEO
- **Trang 3:** Customer & Market — Top 15 KH + pipeline

**Mở rộng — Tuần 5-8:**
- Trang 4: Giao hàng đúng hạn (OTIP/O2D)
- Trang 6: Chất lượng & Chi phí lỗi
- War Room: Phân loại chiến lược 14 OC (Accelerate / Support / Watch / Reset)
- War Room: Danh mục khách hàng (Protect / Grow / Fix / Exit)

**Hoàn thiện — Tuần 9-12:**
- Trang 5 & 7: Sản xuất · Tồn kho
- War Room: Plant/Family + Issue/Loss Hotspot

### Nhịp demo với CEO:
> Tuần 2 → Demo trang đầu tiên · Tuần 4 → Demo Nhóm A đầy đủ · Mỗi tuần 1 feedback loop

---

---

## SLIDE 7 — PHASE 2 CHI TIẾT

# Phase 2: AI & Tự Động Hóa — CEO Không Cần Hỏi, Hệ Thống Tự Báo

### Hạ tầng công nghệ:

| Lớp | Công cụ | Mục đích |
|---|---|---|
| Frontend | Vercel | `control-tower.gsbb.vn` · deploy tự động |
| Database & Auth | Supabase | Phân quyền CEO/PMO/CFO/OC Owner |
| Auto refresh | GitHub Actions | Chạy lúc 8AM hàng ngày · dữ liệu mới mỗi sáng |
| AI Layer | Claude API | Insights hàng ngày · CEO Brief thứ 2 · Query on-demand |

### Phân quyền rõ ràng:

| Vai trò | Quyền xem |
|---|---|
| CEO · Chủ tịch | Tất cả 8 trang + 4 War Room |
| PMO · TL1 | Tất cả 8 trang + 4 War Room |
| CFO | Finance + Campaign |
| OC Owner | OC của mình |

### Claude AI làm gì mỗi ngày?
```
7:00 SA  → Đọc toàn bộ dữ liệu 5 domain
7:05 SA  → Phân tích: OC nào đang nguy hiểm? KH nào cần hành động?
7:10 SA  → Viết CEO Brief: 3 điểm cần biết hôm nay · 1 quyết định cần đưa ra
7:30 SA  → Brief sẵn trong dashboard trước khi CEO mở máy
```

---

---

## SLIDE 8 — ĐỘI NGŨ & NGÂN SÁCH

# Ai Làm Gì? Chi Bao Nhiêu?

### Đội ngũ:

| Vai trò | Người | Trách nhiệm |
|---|---|---|
| **Project Sponsor** | CEO GSBB | Phê duyệt · chốt ngưỡng KPI · review tuần |
| **AI PMO Lead** | Lead P&C | Owner tổng · nhịp tuần · escalate blocker |
| **Tech Lead** | Digital/IT | Code · review · deploy |
| **Data Lead** | Kế hoạch/IT | Cung cấp data từ Bravo · MES · Sheets |
| **OC Owners (14)** | Theo phân công | Nhập IPAM · báo cáo status tuần |
| **Cố vấn kỹ thuật** | GSF (Minh) | Review architecture · best practice |

### Ngân sách:

| Hạng mục | Phase 1 (tháng 1-2) | Phase 2 (tháng 3) | Năm 2+ |
|---|---|---|---|
| Claude Code (3-5 dev) | ~$200/tháng | ~$200/tháng | ~$200/tháng |
| Anthropic API (AI insights) | $0 | ~$50/tháng | ~$50/tháng |
| Vercel + Supabase | $0 | $0–$45/tháng | $0–$45/tháng |
| Domain `gsbb.vn` | — | ~500K VNĐ/năm | ~500K VNĐ/năm |
| **Tổng ước tính** | | **~30-50 triệu/năm 1** | **~10-15 triệu/năm** |

> **ROI:** Tiết kiệm 20-40 giờ báo cáo thủ công/tuần · Phát hiện vấn đề sớm hơn 24-48 giờ

---

---

## SLIDE 9 — RỦI RO & CAM KẾT

# Chúng Ta Đã Nghĩ Đến Các Rủi Ro

| Rủi ro | Cách giảm thiểu |
|---|---|
| Data không sạch → dashboard vô nghĩa | Data Lead chốt schema trước · validate trước khi build UI |
| CEO không dùng → dự án chết | Demo từ tuần 2 · iterate theo feedback · không build lớn rồi mới demo |
| OC Owner không nhập IPAM | Nhịp họp tuần cố định · escalate trực tiếp nếu trễ |
| Dev nghỉ → mất context | CLAUDE.md đầy đủ · session save mỗi ngày · tài liệu hóa liên tục |
| Rò rỉ data chiến lược | War Room private/local · Auth Supabase · Claude API zero-retention |
| Bravo/MES khó tích hợp | Phase 1 dùng Excel paste tay → không bị block |

### Cam kết đầu ra:

```
Ngày 14:  CEO nhìn thấy dashboard đầu tiên (Trang 1 + OC Board)
Ngày 30:  4 trang Nhóm A chạy, CEO bắt đầu dùng thật
Ngày 60:  8 trang + 4 War Room đầy đủ, dữ liệu thật
Ngày 90:  control-tower.gsbb.vn live · AI Brief tự động · Phân quyền xong
```

> **Nguyên tắc:** Done = CEO đã thấy · đã dùng · đã feedback · hệ thống chạy ổn định.

---

---

## SLIDE 10 — QUYẾT ĐỊNH CẦN TỪ CEO

# Hôm Nay CEO Cần Chốt 3 Điều

### 1. Phê duyệt ngưỡng KPI (RAG Threshold)
> CEO khoanh: KPI nào Đỏ khi nào? Vàng khi nào? Xanh khi nào?
> → Buổi họp 90 phút với CFO + PMO trong tuần này

### 2. Xác nhận Data Owner
> Ai chịu trách nhiệm cung cấp số liệu từ Bravo/MES/Sheets?
> → 1 người cụ thể, 1 deadline cụ thể mỗi domain

### 3. Chốt phạm vi War Room
> War Room chiến lược: chạy nội bộ local-only (bảo mật cao)
> hay deploy lên server nội bộ GSBB với VPN?
> → CEO chốt để team thiết kế bảo mật phù hợp

---

### Bước tiếp theo nếu CEO đồng ý hôm nay:

| Ngày | Hành động |
|---|---|
| Tuần này | AI PMO Lead tổ chức kickoff · Data Lead xác nhận sources |
| Cuối tuần tới | CEO review + chốt bảng KPI RAG |
| Tuần 2 | CEO xem demo trang đầu tiên |

---

> *"Hệ thống này không thay thế quyết định của CEO.*
> *Nó đảm bảo CEO quyết định dựa trên sự thật, không phải ký ức."*

---

*Tài liệu nội bộ GSBB · Không phát hành ra ngoài · 2026*
