---
description: Thêm bộ lọc Năm/Quý/Tháng/Tuần vào trang HTML — tự động chọn tuần hiện tại khi load, cascade khi thay đổi, kết hợp với năm để lọc chính xác
argument-hint: <file_html> [supabase_table=list_week] [anchor_selector=#main-content]
---

# Period Filter — Năm / Quý / Tháng / Tuần

Khi được gọi, thêm bộ lọc **Năm → Quý → Tháng → Tuần** vào một trang HTML đang có sẵn dữ liệu từ Supabase.

## Đầu vào

`$ARGUMENTS` — format: `<file_html> [supabase_table] [anchor_selector]`

| Tham số | Bắt buộc | Mặc định |
|---|---|---|
| `file_html` | ✅ | — |
| `supabase_table` | ❌ | `list_week` |
| `anchor_selector` | ❌ | Phần tử đầu tiên trong `#main-content` |

---

## Bước 1 — Đọc file HTML

Dùng Read tool đọc toàn bộ `file_html`. Xác định:

1. **`SB_URL` và `SB_ANON`** — tìm 2 const này trong `<script>` để reuse
2. **Vị trí chèn filter bar** — tìm comment hoặc element đầu tiên bên trong `<div id="main-content">`
3. **Tên biến data chính** — thường là `ALL_DATA`, `DISPLAY_DATA`, `FILTER_STATE`, `CHARTS`
4. **Hàm render** — tìm tất cả hàm `render*()` để biết cần gọi lại khi filter thay đổi
5. **Hàm `applyFilter()`** — hàm filter bảng detail (nếu có), cần chuyển sang dùng `DISPLAY_DATA`

---

## Bước 2 — Thêm CSS (nếu chưa có)

Chèn vào `<style>` trong `<head>`, chỉ nếu class `main-filter-bar` chưa tồn tại:

```css
/* ── Period filter bar ───────────────────────────────────────── */
.main-filter-bar { display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; background:white; border:1px solid var(--border); border-radius:10px; padding:0.85rem 1.25rem; margin-bottom:1.25rem; box-shadow:0 1px 3px rgba(0,0,0,.06); }
.mf-group { display:flex; align-items:center; gap:0.4rem; }
.mf-group label { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); white-space:nowrap; }
.mf-group select { font-size:0.85rem; font-weight:600; padding:0.35rem 0.7rem; border:1.5px solid var(--border); border-radius:7px; background:white; color:var(--text); cursor:pointer; transition:border-color .15s; min-width:110px; }
.mf-group select:hover, .mf-group select:focus { outline:none; border-color:var(--green); }
.mf-divider { width:1px; height:24px; background:var(--border); flex-shrink:0; }
.mf-reset { font-size:0.75rem; padding:0.35rem 0.85rem; border:1.5px solid var(--border); border-radius:7px; background:white; color:var(--muted); cursor:pointer; transition:all .15s; font-weight:600; }
.mf-reset:hover { border-color:var(--red); color:var(--red); background:#fff7f7; }
.mf-status { margin-left:auto; font-size:0.75rem; color:var(--green); font-weight:600; white-space:nowrap; padding:0.3rem 0.75rem; background:#f0fdf4; border-radius:20px; border:1px solid var(--border); }
```

---

## Bước 3 — Chèn HTML filter bar

Chèn **ngay sau** `<div id="main-content" ...>` (trước bất kỳ nội dung nào):

```html
<!-- ── Period filter: Year / Quarter / Month / Week ── -->
<div class="main-filter-bar" id="main-filter-bar">
  <div class="mf-group">
    <label>Năm</label>
    <select id="mf-year" onchange="onYearChange()"><option value="">Tất cả</option></select>
  </div>
  <div class="mf-divider"></div>
  <div class="mf-group">
    <label>Quý</label>
    <select id="mf-quarter" onchange="onQuarterChange()"><option value="">Tất cả quý</option></select>
  </div>
  <div class="mf-divider"></div>
  <div class="mf-group">
    <label>Tháng</label>
    <select id="mf-month" onchange="onMonthChange()"><option value="">Tất cả tháng</option></select>
  </div>
  <div class="mf-divider"></div>
  <div class="mf-group">
    <label>Tuần</label>
    <select id="mf-week" onchange="onWeekChange()"><option value="">Tất cả tuần</option></select>
  </div>
  <button class="mf-reset" onclick="resetMainFilter()">↺ Tất cả</button>
  <span class="mf-status" id="filter-status">Đang tải…</span>
</div>
```

---

## Bước 4 — Chèn JS vào `<script>`

### 4a. Thêm state và helpers (sau các `const` config hiện có)

```js
// ── Period filter state ───────────────────────────────────────
const FILTER_STATE = { year: null, quarter: null, month: null, week: null };
let LIST_WEEK_DATA = [];
let DISPLAY_DATA   = [];
const CHARTS = {};   // dùng để destroy chart trước khi recreate

const getQuarter   = m => Math.ceil(parseInt(m) / 3);
const parseWeekNum = v => parseInt((v||'').toString().replace(/^W/i, '')) || 0;

function getISOWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day  = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}
```

> **Lưu ý `parseWeekNum`:** cột `week` trong Supabase thường lưu dạng `"W21"` (VARCHAR). Hàm này strip chữ `W` trước khi so sánh số nguyên với `list_week.weeks`.

### 4b. Fetch list_week

```js
async function fetchListWeek() {
  const h = { 'apikey': SB_ANON, 'Authorization': 'Bearer '+SB_ANON };
  const res = await fetch(SB_URL+'/rest/v1/list_week?select=*&order=years.asc,weeks.asc&limit=300', { headers: h });
  if (!res.ok) return [];
  return res.json();
}
```

### 4c. Populate functions (cascade Năm → Quý → Tháng → Tuần)

```js
function populateYearSelect() {
  const years = [...new Set(LIST_WEEK_DATA.map(r=>r.years).filter(Boolean))].sort((a,b)=>a-b);
  const sel = document.getElementById('mf-year');
  years.forEach(y => {
    const o = document.createElement('option'); o.value = y; o.textContent = 'Năm '+y; sel.appendChild(o);
  });
}

function populateQuarterSelect(year) {
  const sel = document.getElementById('mf-quarter');
  sel.innerHTML = '<option value="">Tất cả quý</option>';
  let rows = year ? LIST_WEEK_DATA.filter(r=>r.years===year) : LIST_WEEK_DATA;
  const qs = [...new Set(rows.map(r=>r.quarter).filter(Boolean))].sort((a,b)=>a-b);
  qs.forEach(q => { const o=document.createElement('option'); o.value=q; o.textContent='Q'+q; sel.appendChild(o); });
}

function populateMonthSelect(year, quarter) {
  const sel = document.getElementById('mf-month');
  sel.innerHTML = '<option value="">Tất cả tháng</option>';
  let rows = LIST_WEEK_DATA;
  if (year)    rows = rows.filter(r=>r.years===year);
  if (quarter) rows = rows.filter(r=>r.quarter===quarter);
  const months = [...new Set(rows.map(r=>r.months).filter(Boolean))].sort((a,b)=>a-b);
  months.forEach(m => { const o=document.createElement('option'); o.value=m; o.textContent='Tháng '+m; sel.appendChild(o); });
}

function populateWeekSelect(year, quarter, month) {
  const sel = document.getElementById('mf-week');
  sel.innerHTML = '<option value="">Tất cả tuần</option>';
  let rows = LIST_WEEK_DATA;
  if (year)    rows = rows.filter(r=>r.years===year);
  if (quarter) rows = rows.filter(r=>r.quarter===quarter);
  if (month)   rows = rows.filter(r=>r.months===month);
  [...rows].sort((a,b)=>a.weeks-b.weeks).forEach(r => {
    const o = document.createElement('option');
    o.value = r.weeks;
    o.textContent = 'W'+r.weeks+(r.months?' (T'+r.months+')':'');
    sel.appendChild(o);
  });
}
```

### 4d. detectCurrentPeriod — auto-select tuần hiện tại khi load

```js
function detectCurrentPeriod() {
  const today    = new Date();
  const curYear  = today.getFullYear();
  const curMonth = today.getMonth() + 1;
  const curWeek  = getISOWeek(today);
  const curQ     = getQuarter(curMonth);

  // Năm
  const ySel = document.getElementById('mf-year');
  if ([...ySel.options].find(o=>parseInt(o.value)===curYear)) {
    ySel.value = curYear; FILTER_STATE.year = curYear;
  }
  populateQuarterSelect(FILTER_STATE.year);

  // Quý
  const qSel = document.getElementById('mf-quarter');
  if ([...qSel.options].find(o=>parseInt(o.value)===curQ)) {
    qSel.value = curQ; FILTER_STATE.quarter = curQ;
  }
  populateMonthSelect(FILTER_STATE.year, FILTER_STATE.quarter);

  // Tháng
  const mSel = document.getElementById('mf-month');
  if ([...mSel.options].find(o=>parseInt(o.value)===curMonth)) {
    mSel.value = curMonth; FILTER_STATE.month = curMonth;
  }
  populateWeekSelect(FILTER_STATE.year, FILTER_STATE.quarter, FILTER_STATE.month);

  // Tuần
  const wSel = document.getElementById('mf-week');
  if ([...wSel.options].find(o=>parseInt(o.value)===curWeek)) {
    wSel.value = curWeek; FILTER_STATE.week = curWeek;
  }
  updateFilterStatus();
}

function updateFilterStatus() {
  const parts = [];
  if (FILTER_STATE.year)    parts.push('Năm '+FILTER_STATE.year);
  if (FILTER_STATE.quarter) parts.push('Q'+FILTER_STATE.quarter);
  if (FILTER_STATE.month)   parts.push('T'+FILTER_STATE.month);
  if (FILTER_STATE.week)    parts.push('W'+FILTER_STATE.week);
  document.getElementById('filter-status').textContent = parts.length ? parts.join(' · ') : 'Toàn bộ dữ liệu';
}
```

### 4e. Event handlers (cascade + applyMainFilter)

```js
function onYearChange() {
  const v = document.getElementById('mf-year').value;
  FILTER_STATE.year = v ? parseInt(v) : null;
  FILTER_STATE.quarter = null; FILTER_STATE.month = null; FILTER_STATE.week = null;
  populateQuarterSelect(FILTER_STATE.year);
  populateMonthSelect(FILTER_STATE.year, null);
  populateWeekSelect(FILTER_STATE.year, null, null);
  applyMainFilter();
}
function onQuarterChange() {
  const v = document.getElementById('mf-quarter').value;
  FILTER_STATE.quarter = v ? parseInt(v) : null;
  FILTER_STATE.month = null; FILTER_STATE.week = null;
  populateMonthSelect(FILTER_STATE.year, FILTER_STATE.quarter);
  populateWeekSelect(FILTER_STATE.year, FILTER_STATE.quarter, null);
  applyMainFilter();
}
function onMonthChange() {
  const v = document.getElementById('mf-month').value;
  FILTER_STATE.month = v ? parseInt(v) : null;
  FILTER_STATE.week = null;
  populateWeekSelect(FILTER_STATE.year, FILTER_STATE.quarter, FILTER_STATE.month);
  applyMainFilter();
}
function onWeekChange() {
  const v = document.getElementById('mf-week').value;
  FILTER_STATE.week = v ? parseInt(v) : null;
  applyMainFilter();
}
function resetMainFilter() {
  FILTER_STATE.year = null; FILTER_STATE.quarter = null; FILTER_STATE.month = null; FILTER_STATE.week = null;
  document.getElementById('mf-year').value = '';
  populateQuarterSelect(null);
  populateMonthSelect(null, null);
  populateWeekSelect(null, null, null);
  applyMainFilter();
}
```

### 4f. applyMainFilter — ưu tiên: Tuần > Tháng > Quý > Năm, luôn kết hợp với Năm

```js
function applyMainFilter() {
  let data = ALL_DATA;

  if (FILTER_STATE.week) {
    // Tuần cụ thể — strip "W" prefix vì cột week lưu dạng "W21"
    data = data.filter(r => parseWeekNum(r.week) === FILTER_STATE.week);
    // Kết hợp Năm nếu có (lọc qua list_week để đảm bảo đúng năm)
    if (FILTER_STATE.year) {
      const validWeeks = LIST_WEEK_DATA
        .filter(r => r.years === FILTER_STATE.year && r.weeks === FILTER_STATE.week)
        .map(r => r.weeks);
      if (validWeeks.length) data = data.filter(r => parseWeekNum(r.week) === FILTER_STATE.week);
      // Nếu list_week không có tuần này trong năm đã chọn → data rỗng
      else data = [];
    }
  } else if (FILTER_STATE.month) {
    let rows = LIST_WEEK_DATA.filter(r => r.months === FILTER_STATE.month);
    if (FILTER_STATE.year) rows = rows.filter(r => r.years === FILTER_STATE.year);
    const wNums = rows.map(r => r.weeks);
    data = data.filter(r => wNums.includes(parseWeekNum(r.week)));
  } else if (FILTER_STATE.quarter) {
    let rows = LIST_WEEK_DATA.filter(r => r.quarter === FILTER_STATE.quarter);
    if (FILTER_STATE.year) rows = rows.filter(r => r.years === FILTER_STATE.year);
    const wNums = rows.map(r => r.weeks);
    data = data.filter(r => wNums.includes(parseWeekNum(r.week)));
  } else if (FILTER_STATE.year) {
    const wNums = LIST_WEEK_DATA.filter(r => r.years === FILTER_STATE.year).map(r => r.weeks);
    data = data.filter(r => wNums.includes(parseWeekNum(r.week)));
  }

  DISPLAY_DATA = data;
  updateFilterStatus();

  // Gọi lại tất cả hàm render — truyền DISPLAY_DATA
  // ⚠️ Thay thế danh sách hàm bên dưới bằng hàm render thực tế của trang
  // Mỗi render*() phải destroy chart cũ trước khi tạo mới:
  //   if (CHARTS.myChart) { CHARTS.myChart.destroy(); delete CHARTS.myChart; }
  //   CHARTS.myChart = new Chart(...)
  renderAll(DISPLAY_DATA);   // <-- adapter: xem Bước 5
}
```

---

## Bước 5 — Adapter renderAll()

Đọc các hàm render hiện có trong trang, tạo hàm wrapper:

```js
function renderAll(data) {
  // Thay bằng danh sách hàm render thực tế của trang
  renderInsights(data);
  renderKPIs(data);
  renderTrendChart(data);
  renderLevelChart(data);
  // ... các hàm render khác ...
  applyFilter();   // nếu trang có filter bảng detail
}
```

**Đồng thời** cập nhật mỗi hàm `render*Chart*()` để destroy chart instance cũ:

```js
function renderTrendChart(data) {
  if (CHARTS.trend) { CHARTS.trend.destroy(); delete CHARTS.trend; }
  // ... code tạo chart ...
  CHARTS.trend = new Chart(document.getElementById('chart-trend'), { ... });
}
```

---

## Bước 6 — Cập nhật init()

Thêm `fetchListWeek()` vào `Promise.all`, gọi `populateYearSelect()` và `detectCurrentPeriod()`:

```js
async function init() {
  try {
    [ALL_DATA, LIST_WEEK_DATA] = await Promise.all([fetchData(), fetchListWeek()]);

    // ... setup UI hiện có ...

    populateYearSelect();
    detectCurrentPeriod();   // auto-chọn tuần/tháng/quý/năm hiện tại
    applyMainFilter();       // render lần đầu với filter mặc định
    populateFilters(DISPLAY_DATA);   // nếu trang có filter bảng detail
  } catch(e) {
    // ... error handling ...
  }
}
```

---

## Bước 7 — Cập nhật applyFilter() bảng detail (nếu có)

Nếu trang đã có hàm `applyFilter()` cho bảng detail, đổi nguồn từ `ALL_DATA` → `DISPLAY_DATA`:

```js
// TRƯỚC: let filtered = ALL_DATA;
// SAU:
let filtered = DISPLAY_DATA.length ? DISPLAY_DATA : ALL_DATA;
```

---

## Quy tắc lọc

| Ưu tiên | Điều kiện | Logic |
|---|---|---|
| 1 | Tuần được chọn | `parseWeekNum(r.week) === week` + kết hợp năm qua `list_week` |
| 2 | Tháng được chọn | Lấy tuần thuộc tháng từ `list_week`, filter data theo tuần đó |
| 3 | Quý được chọn | Lấy tuần thuộc quý từ `list_week`, filter data theo tuần đó |
| 4 | Chỉ Năm | Lấy tất cả tuần của năm từ `list_week`, filter data |
| 5 | Không chọn gì | Toàn bộ `ALL_DATA` |

**Kết hợp Năm:** khi chọn Tháng/Quý, nếu Năm cũng được chọn → filter `list_week` theo cả năm lẫn tháng/quý trước khi lấy danh sách tuần.

---

## Xử lý lỗi thường gặp

| Vấn đề | Nguyên nhân | Xử lý |
|---|---|---|
| Chọn tuần nhưng data không đổi | Cột `week` lưu `"W21"` — `parseInt("W21") = NaN` | Dùng `parseWeekNum()` strip "W" trước |
| Combobox Quý/Tháng rỗng | `list_week.quarter` hoặc `list_week.months` null | Chạy SQL populate: `UPDATE list_week SET months = ..., quarter = CEIL(months/3.0)` |
| Chart bị duplicate khi filter | Không destroy instance cũ | Thêm `if (CHARTS.x) { CHARTS.x.destroy(); }` trước `new Chart(...)` |
| Chọn Tháng nhưng lọc sai năm | applyMainFilter không kết hợp năm | Luôn `if (FILTER_STATE.year) rows = rows.filter(r=>r.years===year)` |

---

## Báo cáo sau khi hoàn thành

```
✅ Period filter đã thêm vào: <file_html>
   Filter bar: Năm → Quý → Tháng → Tuần → ↺ Reset
   Auto-detect: Tuần W<N> / T<M> / Q<Q> / Năm <Y>
   Cascade: Năm → Quý → Tháng → Tuần
   Kết hợp Năm: ✅ (mọi filter đều kết hợp với năm đã chọn)
   Charts destroy/recreate: ✅ (không duplicate)
   Data source: list_week (<supabase_table>)
```
