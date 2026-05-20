---
brief_type: welcome_doc_writing
audience: Team GSBB nhận bàn giao folder (CEO · BOD · PMO · 14 OC Owner · Tech Lead · Data Lead · Working Team)
purpose: Viết 1 tài liệu welcome thân thiện, dễ đọc, mô tả "bạn vừa nhận gì · vì sao có nó · làm gì tiếp theo" — đây là tài liệu ĐẦU TIÊN team mở ra khi nhận folder
language: Tiếng Việt — business-friendly, ấm áp, KHÔNG tech term, KHÔNG dài dòng
length_target: 5-7 trang A4 (~2.500-3.500 từ)
output_format: Markdown file lưu vào `docs/WELCOME-Team-GSBB.md` + paste vào Google Doc gửi qua email cho team khi handover
output_path: /Users/minhlee/Downloads/GS_AI/GSBB_BUILD/docs/WELCOME-Team-GSBB.md
related_briefs:
  - BRIEF-Báo_cáo_Tổng_thể_GSBB.md (báo cáo dài 12-15 trang cho BOD)
  - BRIEF-Onboarding-Team-GSBB.md (runbook chi tiết 30 ngày cho tech team)
---

# Brief — Viết Welcome Doc cho Team GSBB Khi Nhận Bàn Giao

## 0. Vì sao cần tài liệu này (khác với 2 brief trước)

Team GSBB sẽ nhận **3 tài liệu** dùng vào 3 mục đích khác nhau:

| Doc | Đối tượng | Khi đọc | Độ dài | Tone |
|---|---|---|---|---|
| **WELCOME-Team-GSBB.md** (bài này) | TẤT CẢ team | Ngày đầu nhận folder (5 phút mở thư đầu tiên) | 5-7 trang | Ấm áp, thân thiện, khích lệ |
| `REPORT-Tổng_thể_GSBB.md` | CEO + BOD | Họp trình đề án | 12-15 trang | Formal, business, full data |
| `ONBOARDING-Team-GSBB.md` | Tech Lead · Dev · Data Lead | Khi bắt đầu code | 25 trang runbook | Hướng dẫn step-by-step |

→ Welcome Doc là **bộ mặt đầu tiên** team GSBB nhìn thấy. Phải làm họ **hứng thú · tự tin · biết bước tiếp theo** chứ không choáng ngợp.

---

## 1. Yêu cầu tone & style

### KHÔNG dùng (tuyệt đối)

- Tech term: API · schema · cron · webhook · JSON · serve.py · Vercel · Supabase · cloud · deploy · CI/CD · repo · commit · branch
- Tên file kỹ thuật: `.json` · `.py` · `serve.py`
- Marketing speak: "đột phá" · "tối ưu hóa toàn diện" · "chuẩn quốc tế" · "cách mạng"
- Đe dọa: "phải bằng mọi giá" · "tuyệt đối không" · "bắt buộc làm"
- Câu dài > 25 từ
- Bullet list dài > 7 mục liên tiếp
- Tên CEO thật — chỉ "CEO"

### NÊN dùng

- Tiếng Việt rõ ràng, từ thông dụng
- Câu ngắn 10-20 từ
- Hỏi-đáp thân thiện ("Bạn vừa nhận gì?", "Bạn cần làm gì?", "Bạn lo lắng gì?")
- Ví dụ cụ thể, số liệu cụ thể
- Cảm hứng nhẹ nhàng (không lên gân)
- Acknowledge effort của team GSBB (họ chuẩn bị chạy 1 hành trình 90 ngày)

### Tone tham khảo

Như "lời gửi gắm từ đơn vị anh em GSF cho GSBB" — không phải vendor handover khô khan. Có chút "câu chuyện": GSF đã đi qua hành trình này, hiểu khó khăn, bàn giao kinh nghiệm.

---

## 2. Cấu trúc bắt buộc — 8 phần

### Phần 1 — Thư mở đầu (1 trang)

Format thư từ:
```
Kính gửi Team GSBB,

[3-4 đoạn ngắn, mỗi đoạn 2-3 câu]

Đoạn 1: Chào mừng + xác nhận bạn vừa nhận gì (1 folder bàn giao 60 file)

Đoạn 2: Câu chuyện ngắn — GSF (đơn vị anh em) đã đi qua hành trình tương tự,
        hiểu các khó khăn, đã chuẩn bị bộ khung này để GSBB không phải bắt
        đầu từ con số 0

Đoạn 3: Lời khích lệ — bạn không cô đơn, có sẵn:
        - 4 tài liệu master hướng dẫn
        - 60 file khung dự án đã chạy được
        - 5 quy trình chuẩn (skills) học được từ GSF
        - 12 bài học (lessons-learned) tránh sai lầm GSF từng mắc
        - Đường dây hỗ trợ kỹ thuật từ GSF mỗi 2 tuần

Đoạn 4: 1 câu kết — "Bạn chỉ cần dành 5 phút đọc hết tài liệu này, sau đó
        biết chính xác làm gì tiếp theo."

Trân trọng,
Lê Vũ Minh — BIM 2nd Lead Goldsun Food
Người soạn bộ bàn giao
```

### Phần 2 — Bạn vừa nhận gì (1 trang)

**Mô tả không kỹ thuật**, dùng metaphor "bộ Lego":

```
Tưởng tượng bạn vừa nhận 1 bộ Lego đã ráp sẵn 30%:
- Khung sườn xong (kiến trúc 2 lớp dùng chung 1 nguồn dữ liệu)
- 1 trang mẫu đã chạy được (Tóm tắt CEO với 14 dự án OC)
- 5 hộp linh kiện theo nhóm (5 nhóm dữ liệu: Tài chính · Khách hàng · Sản xuất · Chất lượng · OC)
- Tập hướng dẫn 4 cuốn (4 tài liệu master)
- Tập "đừng làm sai như chúng tôi" (12 bài học)
- Bộ công thức nấu ăn (5 quy trình chuẩn cho việc lặp lại)

Bạn cần ráp tiếp 70% còn lại trong 90 ngày — nhưng đã có khung và hướng dẫn.
```

Sau đó liệt kê 6 nhóm tài sản (dùng bảng đơn giản, KHÔNG hiện folder tree kỹ thuật):

| Nhóm | Đếm | Mục đích |
|---|---|---|
| Tài liệu hướng dẫn | 4 cuốn | Đọc trước khi làm |
| Khung mã nguồn 2 lớp | 5 dự án | Dev mở rộng thêm |
| Dữ liệu mẫu | 5 nhóm × ~10 file | Chạy được ngay không cần chờ dữ liệu thật |
| Quy trình chuẩn | 5 skill | Cho việc lặp lại hằng tuần |
| Bài học kinh nghiệm | 12 bài | Tránh sai lầm GSF |
| Cấu hình giai đoạn 2 | 3 file mẫu | Khi sẵn sàng đưa lên web nội bộ |

### Phần 3 — Vì sao có bộ bàn giao này (1 trang)

Câu chuyện ngắn:

```
6 tháng trước GSF cũng đứng ở vị trí GSBB hôm nay:
- Dữ liệu phân tán trên Excel, Word, Zalo, Email
- Báo cáo tổng hợp tay mất 1-2 ngày
- 5 trưởng phòng ban chốt số khác nhau cho cùng 1 chỉ tiêu
- CEO mở 8 file mới biết tình hình toàn công ty

Sau 12 tháng vận hành (GSF có ~224 nhà hàng, ~80 dự án CAPEX, ~21 trang
theo dõi), chúng tôi học được vài điều:

1. Phải có 1 nguồn dữ liệu duy nhất — không nhân đôi
2. Demo sớm hơn xây to — CEO cho phản hồi tuần 2-3 chứ đừng đợi tuần 12
3. Phân chia rõ "phòng điều hành" để theo dõi vs "phòng họp chiến lược"
   để quyết định
4. Trợ lý AI giúp tổng hợp, KHÔNG thay quyền quyết của con người

GSBB không cần học lại từ đầu. Bộ này gói toàn bộ kinh nghiệm đó.

Đề án OC.GSP của Chú (GSBB) đã đề cập việc tham khảo kinh nghiệm GSF
(mục 2.3). Bộ bàn giao này là cách cụ thể hóa lời cam kết đó.
```

### Phần 4 — Bạn cần làm gì tuần đầu (1.5 trang)

Format: "5 việc trong 7 ngày đầu" — mỗi việc 1 đoạn ngắn.

```
✅ Việc 1 — Ngày 1: Phân vai trò (PMO Lead làm)
Quyết định 4 vai trò: ai làm AI PMO Lead, ai làm Trưởng Kỹ thuật, ai làm
Trưởng Dữ liệu, ai làm Owner cho 14 dự án OC.
(Tham khảo tài liệu HANDOVER mục 3.1)

✅ Việc 2 — Ngày 2-3: Cài công cụ (Trưởng Kỹ thuật làm)
Tạo kho dự án riêng trên GitHub của GSBB. Cài Claude Code (công cụ AI lập
trình) cho 3-5 máy làm việc. Test thử bộ khung chạy được.
(Tham khảo tài liệu ONBOARDING mục Day 1-3)

✅ Việc 3 — Ngày 4-5: Họp chốt số liệu với CEO
PMO Lead + CFO + CEO họp 90 phút: chốt 8 trang nào ưu tiên trước, mỗi
trang theo dõi 5-7 chỉ số quan trọng nhất, ngưỡng nào là Đỏ/Vàng/Xanh.
(Tham khảo tài liệu DATA_REQUIREMENTS)

✅ Việc 4 — Ngày 5-7: Họp chốt dữ liệu với 5 phòng ban
Trưởng Dữ liệu họp với CFO, Trưởng Kinh doanh, Trưởng Sản xuất, Trưởng
Chất lượng, PMO: ai cung cấp loại dữ liệu nào, hằng ngày hay hằng tuần,
ai chịu trách nhiệm nếu trễ.

✅ Việc 5 — Cuối tuần 1: Demo nhỏ cho CEO
Trưởng Kỹ thuật demo trang Tóm tắt CEO (với dữ liệu mẫu) cho CEO xem 15
phút. Mục đích: CEO nhìn được "sản phẩm cuối trông như thế nào" — để
phản hồi sớm, tránh xây sai 8 tuần sau mới phát hiện.
```

Cuối phần này:
```
Sau 7 ngày này, bạn có:
- Vai trò rõ ràng
- Công cụ chạy được
- Bộ số liệu cần theo dõi đã chốt
- Dữ liệu đầu vào có người chịu trách nhiệm
- CEO đã thấy demo và cho phản hồi

→ Sẵn sàng vào tuần 2 bắt đầu xây thật.
```

### Phần 5 — Ai dùng công cụ gì (1 trang)

Bảng đơn giản, dễ hiểu:

| Bạn là ai | Bạn dùng công cụ gì | Để làm gì |
|---|---|---|
| CEO / Lãnh đạo | Trình duyệt web | Mở dashboard xem tình hình mỗi sáng |
| Trưởng PMO | Trợ lý AI viết văn bản (Claude Chat) | Soạn báo cáo · biên bản · brief gửi BOD |
| Owner 14 dự án OC | Trợ lý AI viết văn bản | Soạn cập nhật tuần · báo IPAM |
| Thư ký họp | Trợ lý AI viết văn bản | Soạn biên bản từ ghi âm |
| Trưởng Dữ liệu | Excel + Trợ lý AI hỗ trợ | Cập nhật dữ liệu hằng ngày |
| Trưởng Kỹ thuật | Trợ lý AI lập trình (Claude Code) | Xây + bảo trì hệ thống |
| Lập trình viên | Trợ lý AI lập trình | Xây từng trang |

Chú thích cuối bảng:
- "Trợ lý AI viết văn bản" = Claude Chat — dùng qua trình duyệt như Gmail
- "Trợ lý AI lập trình" = Claude Code — dùng trên máy tính của lập trình viên
- Cả 2 đều là sản phẩm của hãng Anthropic — dữ liệu nội bộ GSBB được bảo mật (zero data retention)

### Phần 6 — Đọc tài liệu theo thứ tự nào (0.5 trang)

Hỏi-đáp ngắn:

```
❓ Tôi là CEO / BOD — đọc gì?
   → 1 tài liệu duy nhất: "Báo cáo Tổng thể" (12-15 trang) — sẽ có sau
     khi PMO yêu cầu trợ lý AI viết.

❓ Tôi là PMO Lead — đọc gì?
   → Đọc theo thứ tự (60 phút):
     1. Tài liệu này (Welcome) — 5 phút
     2. Báo cáo bàn giao GSF→GSBB (HANDOVER) — 15 phút
     3. Plan 90 ngày (IMPLEMENTATION_PLAN) — 30 phút
     4. Yêu cầu dữ liệu (DATA_REQUIREMENTS) — 10 phút

❓ Tôi là Trưởng Kỹ thuật / Lập trình viên — đọc gì?
   → 1. Tài liệu này — 5 phút
     2. Hướng dẫn 30 ngày đầu (ONBOARDING) — 25 phút
     3. 12 bài học GSF (lessons-learned) — 15 phút ⭐ BẮT BUỘC

❓ Tôi là Owner dự án OC — đọc gì?
   → 1. Tài liệu này — 5 phút
     2. PMO sẽ tổ chức buổi training 60 phút riêng cho 14 Owner
```

### Phần 7 — Bạn lo lắng gì? (Câu hỏi thường gặp, 1 trang)

10 câu hỏi nhẹ nhàng, trấn an:

```
❓ "Chúng tôi không có người biết lập trình — làm sao?"
✅ Vẫn làm được. Trợ lý AI lập trình giúp lập trình viên trung cấp làm
   việc của lập trình viên cao cấp. Cần 1 người có nền tảng Python cơ bản
   + Excel tốt là đủ. Nếu thiếu, GSF có thể giới thiệu freelancer ngắn hạn.

❓ "Nếu Trưởng Kỹ thuật nghỉ giữa chừng thì sao?"
✅ Toàn bộ kiến thức đã được tài liệu hóa. Người mới có thể bắt nhịp
   trong 1 tuần nhờ đọc tài liệu CLAUDE.md + bài học kinh nghiệm.

❓ "Dữ liệu của chúng tôi đang nằm ở Bravo, Excel, Word, Email — làm sao
    đưa vào hệ thống?"
✅ Giai đoạn đầu (3 tháng): xuất file Excel từ hệ thống → đặt vào thư
   mục chung → chương trình tự động đọc. KHÔNG cần kết nối phần mềm
   ngay. Giai đoạn 2 mới làm kết nối thật.

❓ "CEO không có thời gian dùng dashboard hằng ngày."
✅ Đây là vấn đề chúng tôi đã gặp ở GSF. Giải pháp: trợ lý AI tự viết
   1 trang tóm tắt sáng thứ 2 hằng tuần. CEO chỉ cần đọc 2 phút thay
   vì mở dashboard.

❓ "Ngân sách 70-200 triệu/năm có cao không?"
✅ So với 1.5 tỷ tiết kiệm/năm (theo phép tính trong Đề án OC.GSP của
   GSBB) → hoàn vốn dưới 1 tháng. Có thể bắt đầu với gói rẻ hơn (50
   triệu/năm) nếu nhân lực hiện tại đủ.

❓ "Dữ liệu chiến lược có bị rò rỉ không?"
✅ 3 lớp bảo vệ:
   1. Phòng Họp Chiến lược chạy nội bộ (không lên web công khai)
   2. Phân quyền theo vai trò (chỉ CEO + PMO xem dữ liệu chiến lược)
   3. Trợ lý AI Anthropic cam kết zero data retention

❓ "GSBB khác GSF, bộ khung này có phù hợp không?"
✅ Khung kỹ thuật giống. Nội dung khác (GSF F&B vs GSBB Bao Bì) → đã
   được điều chỉnh: 5 nhóm dữ liệu, 8 trang, 4 phòng họp đều theo
   nghiệp vụ GSBB. 14 OC đã được mô hình hóa.

❓ "Chúng tôi muốn bắt đầu từ 1 trang, không phải 8 trang — được không?"
✅ Hoàn toàn nên làm. Khuyến nghị bắt đầu với 2 trang ưu tiên cao:
   Trang Tóm tắt CEO + Trang 14 OC. 6 trang còn lại làm theo nhịp.

❓ "Sau 90 ngày, GSBB có tự bay được không?"
✅ Có. Kế hoạch 90 ngày được thiết kế để cuối tháng 3 GSBB hoàn toàn
   tự vận hành. GSF sẵn sàng hỗ trợ tiếp nếu cần (review mỗi 2 tuần).

❓ "Nếu muốn dừng giữa chừng thì sao?"
✅ Mọi tài sản (mã nguồn · dữ liệu · tài liệu) thuộc về GSBB. Có thể
   pause hoặc đổi hướng bất kỳ lúc nào. Không có khóa công nghệ
   (vendor lock-in).
```

### Phần 8 — Bước đi đầu tiên — Ngay hôm nay (0.5 trang)

Kết bằng 3 bước hành động cụ thể:

```
🎯 NGAY HÔM NAY, bạn có thể làm 3 việc:

1. ⏱ 5 phút — Forward tài liệu này cho:
   - CEO GSBB
   - Trưởng PMO
   - Trưởng Kỹ thuật / IT Lead
   - Trưởng Dữ liệu

2. ⏱ 30 phút — Đặt lịch họp tuần này:
   - Họp 1 (60 phút): CEO + PMO + bạn — phân vai trò + thống nhất
     bắt đầu khi nào
   - Họp 2 (90 phút): CEO + CFO + PMO — chốt số liệu cần theo dõi
     + ngưỡng cảnh báo
   - Họp 3 (60 phút): Trưởng Dữ liệu + 5 phòng ban — chốt ai cung
     cấp dữ liệu nào

3. ⏱ 10 phút — Gửi xác nhận đã nhận folder cho:
   Lê Vũ Minh — Goldsun Food
   Email: minhvu.lee@outlook.com
   (Để chúng tôi đặt lịch hỗ trợ kỹ thuật buổi đầu cho team bạn)

Chúc team GSBB hành trình 90 ngày thuận lợi!
```

Footer:
```
*Goldsun Bao Bì · Tài liệu chào mừng team · Lưu hành nội bộ*
*Soạn bởi: Lê Vũ Minh (Goldsun Food) · Ngày YYYY-MM-DD*
```

---

## 3. Quy tắc trình bày

- **Trang bìa:** đơn giản, 1 dòng tiêu đề "Chào mừng Team GSBB — Bộ Bàn giao Phòng Điều hành Số"
- **Mục lục:** Không bắt buộc (doc ngắn)
- **Heading:** Tối đa 2 cấp (## và ###), không sâu hơn
- **Emoji:** Dùng có chừng mực — ✅ ❓ ⏱ 🎯 ⭐ (không lạm dụng)
- **Bảng:** Đơn giản, max 3 cột
- **Hình minh hoạ:** 0 (doc text-only, dễ paste Google Doc)
- **In nghiêng:** chỉ cho footer + chú thích
- **Bold:** cho keyword quan trọng (vai trò · ngày · số liệu)

---

## 4. Tài liệu nguồn Chat phải đọc trước

Để Chat hiểu context và viết đúng tone, đọc trước:

1. `README.md` — overview
2. `HANDOVER_TEAM_GSBB.md` — chi tiết bàn giao
3. `IMPLEMENTATION_PLAN.md` mục 1-3 — plan 90 ngày
4. `BRIEF-Onboarding-Team-GSBB.md` — runbook tech (để biết Welcome chỉ cần ngắn hơn nhiều)
5. `lessons-learned.md` — biết câu chuyện GSF
6. `.claude/skills/gsbb-vietnamese-writing/SKILL.md` — tone & style chuẩn

---

## 5. Output Format

**Section 1 — Tóm tắt thay đổi (changelog ở đầu file, không paste lên Doc)**

```
- v1.0 (YYYY-MM-DD): Welcome doc đầu tiên, viết cho TẤT CẢ team GSBB
- Đối tượng đọc rộng nhất trong 3 doc (Welcome / Report / Onboarding)
- Tone ấm áp, hỏi-đáp, trấn an
- Độ dài 5-7 trang — ngắn nhất trong 3 doc
- Mục tiêu: 5 phút đọc xong, biết bước tiếp theo
```

**Section 2 — Nội dung Welcome Doc đầy đủ** (paste vào Google Doc)

[Toàn bộ 8 phần theo cấu trúc mục 2]

Frontmatter file `.md`:
```yaml
---
title: Chào mừng Team GSBB — Bộ Bàn giao Phòng Điều hành Số
audience: TẤT CẢ team GSBB (CEO · BOD · PMO · Owner · Tech · Data · Working)
purpose: Tài liệu đầu tiên team mở khi nhận folder bàn giao
version: v1.0
date: 2026-MM-DD
reading_time: 5-7 phút
status: draft / approved / sent
related_docs:
  - HANDOVER_TEAM_GSBB.md
  - IMPLEMENTATION_PLAN.md
  - ONBOARDING-Team-GSBB.md (cho tech)
  - REPORT-Tổng_thể_GSBB.md (cho BOD)
---
```

---

## 6. Self-check trước khi gửi (Chat tự kiểm)

- [ ] Không còn từ tech (API · schema · cron · webhook · JSON · deploy) chưa giải thích
- [ ] Không nêu tên CEO thật — chỉ "CEO"
- [ ] Không tên file `.json` · `.py` · `.sql` trong nội dung chính
- [ ] Mọi mã/từ viết tắt xuất hiện lần đầu có giải thích tại chỗ
- [ ] Tone ấm áp, không bán hàng, không đe dọa
- [ ] Câu ngắn (max 25 từ/câu)
- [ ] Mỗi phần ≤ 1.5 trang
- [ ] Section 7 (FAQ) đầy đủ 10 câu hỏi
- [ ] Section 8 (Bước đi hôm nay) có 3 action concrete với time-box
- [ ] Email Lê Vũ Minh cuối doc chính xác (minhvu.lee@outlook.com)
- [ ] Footer "Tài liệu nội bộ · Lưu hành nội bộ"
- [ ] Độ dài tổng 5-7 trang A4 (~2500-3500 từ)

---

## 7. Workflow sau khi nhận output từ Chat

1. PMO mở Chat output Section 2
2. Save vào `/Users/minhlee/Downloads/GS_AI/GSBB_BUILD/docs/WELCOME-Team-GSBB.md`
3. Verify tone bằng skill `gsbb-vietnamese-writing` self-check
4. Paste vào Google Doc mới
5. Format: font Arial 11, line height 1.5, margins 2.5cm
6. Share Google Doc → gửi email cho CEO + PMO + Tech Lead + Data Lead
7. Email body ngắn:
   ```
   Kính gửi anh/chị,
   Đính kèm thư chào mừng team GSBB nhân dịp bàn giao bộ khung dự án
   Phòng Điều hành Số. Anh/chị dành 5 phút đọc → biết bước tiếp theo.
   Trân trọng,
   [PMO Lead]
   ```

---

*Brief soạn ngày 2026-05-17 · Lê Vũ Minh (GSF) · Tài liệu nội bộ*
