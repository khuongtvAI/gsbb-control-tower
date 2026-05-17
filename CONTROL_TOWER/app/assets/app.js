// Minimal vanilla JS — fetch JSON từ DATA_LAYER và render.

const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('vi-VN', { maximumFractionDigits: 1 }));

async function loadJSON(path) {
  // serve.py proxies /data/<path> → DATA_LAYER/<path>
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Fetch ${path} failed: ${r.status}`);
  return r.json();
}

async function renderExecutive() {
  try {
    // Phase 1: dùng sample files. Khi có data thật, đổi tên file ở extract script.
    const [fin, oc] = await Promise.all([
      loadJSON('/data/finance/finance_data_sample.json'),
      loadJSON('/data/campaign/oc_status_data_sample.json'),
    ]);

    document.getElementById('kpi-revenue').textContent = fmt(fin.data.revenue_bn);
    document.getElementById('kpi-ebitda').textContent  = fmt(fin.data.ebitda_bn);
    document.getElementById('kpi-copq').textContent    = fmt(fin.data.copq_bn);

    document.getElementById('oc-red').textContent   = oc.data.rag_count.red;
    document.getElementById('oc-amber').textContent = oc.data.rag_count.amber;
    document.getElementById('oc-green').textContent = oc.data.rag_count.green;

    document.getElementById('kpi-esc').textContent  = oc.data.escalation_queue_count;
    document.getElementById('kpi-wait').textContent = oc.data.waiting_decisions_count;

    const tbody = document.getElementById('oc-rows');
    tbody.innerHTML = oc.data.oc_list.map(o => `
      <tr class="${o.status}">
        <td>${o.id}</td>
        <td>${o.name}</td>
        <td>${o.truc || ''}</td>
        <td>${o.phase || ''}</td>
        <td>${o.status.toUpperCase()}</td>
        <td>${o.completion_pct ?? ''}%</td>
        <td>${o.next_milestone || ''}<br><small>${o.milestone_due || ''}</small></td>
        <td>${o.blocker || ''}</td>
      </tr>
    `).join('');

    document.getElementById('meta-source').textContent = `${fin.meta.source} · ${oc.meta.source}`;
    document.getElementById('meta-time').textContent   = new Date(oc.meta.extracted_at).toLocaleString('vi-VN');
  } catch (err) {
    document.querySelector('main').insertAdjacentHTML('afterbegin',
      `<div style="background:#fee;border:1px solid #fcc;padding:1rem;border-radius:8px;color:#900;">
        Lỗi tải dữ liệu: ${err.message}<br>
        <small>Chạy <code>python3 serve.py 8080</code> ở thư mục CONTROL_TOWER/, mở qua http://localhost:8080</small>
      </div>`);
  }
}

if (document.getElementById('kpi-summary')) {
  renderExecutive();
}
