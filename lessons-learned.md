# Lessons Learned — GSBB Control Tower & War Room

> **Mục đích:** Tích lũy bài học vận hành qua các session. Đầu mỗi session Claude Code phải review file này trước khi action.
>
> **Cách dùng:** Mỗi correction từ user · mỗi bug discovered · mỗi pattern surprising → ghi vào đây.
>
> **Seed ban đầu** (2026-05-17): GSF (Goldsun Food) đã vận hành Dashboard 21 trang + War Room 224 stores + 5GATE 75 dự án + Running Coach app trong 12 tháng. Các bài học dưới đây seed từ kinh nghiệm thực tế đó.

---

## Section 1 — Lessons từ GSF (seed — đọc trước khi bắt đầu)

### LL-001 — Data không sạch = dự án chết

**Triệu chứng:** GSF tuần 6 phát hiện 20% dữ liệu finance sai do nhập tay → CEO mất niềm tin → suýt scrap project.

**Bài học:** Schema lock CỰC kỳ sớm (W1-W2). Data Lead làm gate — không build UI cho domain nào nếu schema domain đó chưa CEO/CFO chốt. Mọi extract script PHẢI validate trước ghi JSON.

**Áp dụng GSBB:** Tuần 1 chốt 5 schema · Tuần 2 viết validator · Tuần 3 mới bắt đầu build trang.

---

### LL-002 — Demo sớm hơn build to

**Triệu chứng:** GSF cố build 14 trang xong mới demo CEO → CEO nhìn không hứng thú vì 1/2 trang không đúng nhu cầu → phải rebuild 6 trang.

**Bài học:** Tuần 2-3 demo trang đầu tiên (dù xấu) cho CEO. Iterate. Build tiếp khi đã có feedback. Không build to.

**Áp dụng GSBB:** W3 demo trang 1 (Executive) + trang 8 (OC) cho CEO — dù sample data + 80% complete. W4-5 mới build tiếp.

---

### LL-003 — War Room ≠ Dashboard thứ 2

**Triệu chứng:** GSF ban đầu coi War Room như "dashboard chi tiết hơn" → owners không dùng vì trùng Control Tower.

**Bài học:** War Room phải dẫn đến 1 **quyết định cụ thể**. Mỗi room có 5 bucket quyết định (Accelerate/Support/Watch/Reset/Close hoặc tương đương). Sau mỗi session War Room, mỗi mục PHẢI có owner + deadline + tiêu chí done.

**Áp dụng GSBB:** Build 4 rooms với 5 bucket quyết định rõ ràng (xem [[WAR_ROOM/CLAUDE]]).

---

### LL-004 — CEO chỉ nhớ 5-7 số/trang

**Triệu chứng:** GSF trang Finance đầu có 18 KPI → CEO scroll 30s không tìm thấy số quan trọng → bỏ trang.

**Bài học:** Mỗi trang Control Tower MAX 10 KPI hiển thị, ưu tiên 5-7. Đèn 3 màu phải instant nhìn ra Red.

**Áp dụng GSBB:** Mỗi trang Phase 1 build chỉ 7 KPI. KPI nice-to-have đi vào "drill-down" page riêng.

---

### LL-005 — Schema breaking change phải có migration

**Triệu chứng:** GSF W8 đổi field `revenue` → `revenue_vnd` trong finance schema → toàn bộ historical data sai format → mất 2 ngày recover.

**Bài học:** Mọi schema change PHẢI có migration script + git tag version. Không silent rename field.

**Áp dụng GSBB:** Khi đổi schema → tạo `DATA_LAYER/migrations/YYYYMMDD_<change>.md` + script convert old → new. Xem [[DATA_LAYER/CLAUDE]].

---

### LL-006 — Co-Authored-By Claude gây Vercel deploy fail

**Triệu chứng:** GSF commit có `Co-Authored-By: Claude <noreply@anthropic.com>` → Vercel reject deploy với "Deployment Blocked" do email không match account.

**Bài học:** KHÔNG bao giờ thêm `Co-Authored-By` line vào commit message. Đã ghi vào `.claude/rules/git-conventions.md`.

**Áp dụng GSBB:** Rule hardcoded vào git-conventions.md. Khi Claude Code commit, KHÔNG thêm trailer.

---

### LL-007 — Per-file try/except trong pipeline

**Triệu chứng:** GSF refresh script crash giữa chừng khi 1 file Excel sai format → các domain còn lại không refresh → CEO mở dashboard thấy data cũ.

**Bài học:** Mọi pipeline loop PHẢI `try/except + continue` per file. 1 file fail không kill cả run. Log lỗi rõ + telegram alert.

**Áp dụng GSBB:** `refresh_all.py` đã có pattern. Mọi script extract khác phải tuân.

---

### LL-008 — CEO anonymization

**Triệu chứng:** GSF có brief gửi đối tác có nêu "CEO Lê Vinh chỉ đạo..." → đối tác track email cá nhân CEO.

**Bài học:** Mọi doc chính thức chỉ refer "CEO" — không tên thật. Skill `gsbb-doc-format` đã codify.

**Áp dụng GSBB:** Mọi output từ Code/Chat khi nói về CEO GSBB chỉ dùng chữ "CEO".

---

### LL-009 — Cross-reference link phải inline

**Triệu chứng:** GSF brief "Áp dụng SOP-OC-001" → người đọc không biết SOP đó ở đâu → mất 5 phút search.

**Bài học:** Mọi reference đến doc khác PHẢI có link inline `[Tên doc](URL)` ngay tại chỗ. Tra `INDEX.md` (sẽ tạo khi GSBB scale tài liệu).

**Áp dụng GSBB:** Skill `gsbb-vietnamese-writing` Rule 2 đã codify.

---

### LL-010 — Excel cell bắt đầu bằng `=` bị Excel parse như formula

**Triệu chứng:** GSF Sales Mix form export Excel có cell `=A1+1` (text muốn ghi) → Excel mở popup "We found a problem" → user hoảng.

**Bài học:** Khi ghi Excel: cells starting với `=` · `+` · `-` · `@` PHẢI prefix bằng apostrophe `'` hoặc escape. Cross-sheet `DataValidation` refs gây x14 extension break mobile/Outlook → dùng `DefinedName` thay.

**Áp dụng GSBB:** Khi tạo `templates/<domain>/TEMPLATE.xlsx`, kiểm tra leading characters.

---

### LL-011 — Done = Verified Working

**Triệu chứng:** GSF dev báo "trang Finance xong" → CEO mở thấy số sai → revert.

**Bài học:** "Done" PHẢI verified end-to-end:
1. Implement
2. Run/trigger
3. Observe output
4. Adjust nếu sai
5. Propose next step

Không bao giờ mark done chỉ vì compile pass.

**Áp dụng GSBB:** Mọi feature trước khi commit → chạy serve.py · click trang · verify số đúng vs Excel gốc.

---

### LL-012 — Solve root causes, not symptoms

**Triệu chứng:** GSF dashboard thỉnh thoảng load chậm → dev thêm cache 10s → 2 tuần sau cache miss → chậm trở lại.

**Bài học:** Khi chậm/lỗi → đào root cause (vd JSON 200KB không gzip · index miss · N+1 query). Không patch tạm.

**Áp dụng GSBB:** Khi gặp issue, hỏi "tại sao" 3 lần trước khi fix.

---

## Section 2 — Lessons mới (team GSBB ghi vào đây)

> Format mỗi entry:
> ```
> ### LL-XXX — [Tiêu đề]
> **Triệu chứng:** [gì đã xảy ra]
> **Bài học:** [rút ra gì]
> **Áp dụng:** [đã codify ở đâu — rule/skill nào]
> ```

### LL-013 — [chờ team GSBB ghi]

---

## Section 3 — Anti-patterns (việc cấm)

❌ Commit `.env` · `.env.local` · `*.sa-key.json` → security breach
❌ `git push --force` lên `main` → mất history
❌ Skip hook (`--no-verify`) → bypass validation
❌ Thêm `Co-Authored-By: Claude` → Vercel deploy fail
❌ Edit `DATA_LAYER/*.json` thủ công → bypass schema validation, không reproducible
❌ Tạo dashboard thứ 2 cho War Room → nhân đôi logic
❌ Build to demo cuối → CEO không feedback kịp, rework lớn
❌ Nêu tên CEO trong doc chính thức → leak personal info
❌ Dùng tech term trong doc business → mất audience

---

## Section 4 — Patterns đã work tốt (lặp lại)

✅ Schema-first: lock JSON schema W1-W2, sau đó mới build UI
✅ Demo W2-W3 trang đầu tiên, dù 80% — iterate sau
✅ 1 source of truth `DATA_LAYER/` cho Control Tower + War Room
✅ Sample data committed → dev frontend không bị block
✅ Per-file try/except trong pipeline → 1 fail không kill all
✅ Nhịp họp tuần cố định (T2 30min review · T6 60min War Room)
✅ [[CONTROL_TOWER/CLAUDE|CONTROL_TOWER]] + [[WAR_ROOM/CLAUDE|WAR_ROOM]] dùng chung [[DATA_LAYER/CLAUDE|DATA_LAYER]] — không nhân đôi số liệu
✅ [[CORE_SCRIPTS/CLAUDE|CORE_SCRIPTS]] — shared modules, không duplicate logic
✅ [[CLAUDE_LAYER/CLAUDE|CLAUDE_LAYER]] — AI insights đứng trên DATA_LAYER đã chuẩn hóa
✅ CLAUDE.md per project — Claude Code load context per session
✅ Skills folder `.claude/skills/` codify pattern lặp lại

---

*File này là tài sản tích lũy — cập nhật mỗi session · review đầu mỗi session.*
*Soạn lần đầu: 2026-05-17 (seed từ GSF) · Sau đó team GSBB ghi tiếp.*
