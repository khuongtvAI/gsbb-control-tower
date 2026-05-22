// ct-auth.js — GSBB Control Tower shared auth
// Loaded in <head> to hide body before content renders
(function () {
  const SB_URL  = 'https://evlrudvtoblhkfjdmmvs.supabase.co';
  const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bHJ1ZHZ0b2JsaGtmamRtbXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDUyMjcsImV4cCI6MjA5NDgyMTIyN30.wKv8zA43uqiqV-VnHl823TF-PrdN4ta6Ib1J1ovk8uM';
  const SESSION_KEY = 'gsbb_ct_session';
  const PAGE_FILE   = (location.pathname.split('/').pop() || 'index.html');

  // ── 1. Immediately hide body so content never flashes ────────
  const hideStyle = document.createElement('style');
  hideStyle.id = 'ct-auth-hide';
  hideStyle.textContent = 'body{visibility:hidden!important}';
  document.head.appendChild(hideStyle);

  // ── 2. Inject auth CSS ────────────────────────────────────────
  const authCss = `
#ct-auth-overlay{position:fixed;inset:0;background:rgba(7,30,15,.93);display:flex;align-items:center;justify-content:center;z-index:9999;visibility:visible!important}
.ct-login-card{background:#fff;border-radius:14px;padding:2.5rem 2rem;width:340px;max-width:92vw;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4)}
.ct-login-logo{font-size:2.5rem;margin-bottom:.5rem}
.ct-login-card h2{font-size:1.3rem;font-weight:800;color:#111;margin-bottom:.2rem}
.ct-login-card p{font-size:.8rem;color:#6b7280;margin-bottom:1.5rem}
.ct-login-field{display:flex;flex-direction:column;gap:.75rem;margin-bottom:1rem}
.ct-login-field input{padding:.6rem .85rem;border:1.5px solid #e5e7eb;border-radius:8px;font-size:.9rem;outline:none;transition:border-color .15s;width:100%;box-sizing:border-box}
.ct-login-field input:focus{border-color:#0B5C2E}
.ct-login-btn{width:100%;padding:.7rem;background:#0B5C2E;color:#fff;border:none;border-radius:8px;font-size:.95rem;font-weight:700;cursor:pointer;transition:background .15s}
.ct-login-btn:hover{background:#0f5c27}
.ct-login-btn:disabled{background:#9ca3af;cursor:not-allowed}
.ct-login-err{color:#b91c1c;font-size:.78rem;margin-top:.5rem;min-height:1rem}
.ct-denied-card{background:#fff;border-radius:14px;padding:2.5rem 2rem;width:380px;max-width:92vw;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4)}
.ct-denied-card h2{font-size:1.1rem;font-weight:800;color:#111;margin:.75rem 0 .5rem}
.ct-denied-card p{font-size:.85rem;color:#6b7280;margin-bottom:1.5rem}
.ct-denied-btns{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
.ct-denied-btns button{padding:.5rem 1.2rem;border-radius:7px;font-size:.85rem;font-weight:600;cursor:pointer;border:1.5px solid #e5e7eb;background:#fff;color:#374151;transition:all .15s}
.ct-denied-btns button:hover{border-color:#0B5C2E;color:#0B5C2E}
.ct-logout-btn{font-size:.75rem;padding:.3rem .75rem;border:1px solid #4a7a5a;border-radius:5px;color:#9ca3af;background:transparent;cursor:pointer;transition:all .15s}
.ct-logout-btn:hover{color:#fff;border-color:#dc2626;background:#dc262622}
`;
  const cssEl = document.createElement('style');
  cssEl.textContent = authCss;
  document.head.appendChild(cssEl);

  // ── Helpers ───────────────────────────────────────────────────
  async function sha256hex(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; }
  }
  function saveSession(s) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  function clearSession() { sessionStorage.removeItem(SESSION_KEY); }

  function hasAccess(session) {
    if (session.isAdmin) return true;
    return (session.funcUrls || []).some(u => u && u.includes(PAGE_FILE));
  }

  // ── Reveal body content ───────────────────────────────────────
  function revealBody(session) {
    const hide = document.getElementById('ct-auth-hide');
    if (hide) hide.remove();
    const ov = document.getElementById('ct-auth-overlay');
    if (ov) ov.remove();
    injectLogoutBtn(session);
  }

  function injectLogoutBtn(session) {
    const hdr = document.querySelector('header');
    if (!hdr || document.getElementById('ct-logout-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'ct-logout-btn';
    btn.className = 'ct-logout-btn';
    btn.title = session.fullName || session.username;
    btn.textContent = '⬡ ' + (session.fullName || session.username) + ' · Đăng xuất';
    btn.onclick = () => { clearSession(); location.reload(); };
    hdr.appendChild(btn);
  }

  // ── Show login overlay ────────────────────────────────────────
  function showLoginOverlay() {
    const ov = document.createElement('div');
    ov.id = 'ct-auth-overlay';
    ov.innerHTML = `
      <div class="ct-login-card">
        <div class="ct-login-logo">⬡</div>
        <h2>GSBB Control Tower</h2>
        <p>Đăng nhập để tiếp tục</p>
        <div class="ct-login-field">
          <input type="text" id="ct-login-user" placeholder="Username" autocomplete="username" onkeydown="if(event.key==='Enter')ctLoginSubmit()">
          <div style="position:relative">
            <input type="password" id="ct-login-pass" placeholder="Mật khẩu" autocomplete="current-password" onkeydown="if(event.key==='Enter')ctLoginSubmit()" style="padding-right:2.4rem;width:100%;box-sizing:border-box;padding:.6rem .85rem;border:1.5px solid #e5e7eb;border-radius:8px;font-size:.9rem;outline:none;transition:border-color .15s">
            <button type="button" onclick="(function(){var i=document.getElementById('ct-login-pass');var b=document.getElementById('ct-pass-eye');i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈'})()" id="ct-pass-eye" tabindex="-1" style="position:absolute;right:.5rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1rem;padding:0;line-height:1;opacity:.6">👁</button>
          </div>
        </div>
        <button class="ct-login-btn" id="ct-login-btn" onclick="ctLoginSubmit()">Đăng nhập</button>
        <div class="ct-login-err" id="ct-login-err"></div>
      </div>`;
    document.body.prepend(ov);
    // Show overlay but keep rest of body hidden
    const hide = document.getElementById('ct-auth-hide');
    if (hide) hide.textContent = 'body>:not(#ct-auth-overlay){visibility:hidden!important}';
    document.getElementById('ct-login-user').focus();
  }

  // ── Show access denied ────────────────────────────────────────
  function showDenied(session) {
    const ov = document.getElementById('ct-auth-overlay') || document.createElement('div');
    ov.id = 'ct-auth-overlay';
    ov.innerHTML = `
      <div class="ct-denied-card">
        <div style="font-size:2.5rem">🔒</div>
        <h2>Không có quyền truy cập</h2>
        <p>Tài khoản <strong>${session.fullName || session.username}</strong><br>không được cấp quyền xem trang này.</p>
        <div class="ct-denied-btns">
          <button onclick="location.href='index.html'">← Về trang chủ</button>
          <button onclick="ctLogoutFn()">Đăng xuất</button>
        </div>
      </div>`;
    if (!document.getElementById('ct-auth-overlay')) document.body.prepend(ov);
    const hide = document.getElementById('ct-auth-hide');
    if (hide) hide.textContent = 'body>:not(#ct-auth-overlay){visibility:hidden!important}';
  }

  // ── Login submit ──────────────────────────────────────────────
  window.ctLoginSubmit = async function () {
    const username = (document.getElementById('ct-login-user').value || '').trim();
    const password = document.getElementById('ct-login-pass').value || '';
    const errEl    = document.getElementById('ct-login-err');
    const btn      = document.getElementById('ct-login-btn');
    errEl.textContent = '';

    if (!username) { errEl.textContent = 'Vui lòng nhập username.'; return; }
    if (!password) { errEl.textContent = 'Vui lòng nhập mật khẩu.'; return; }

    btn.disabled = true;
    btn.textContent = 'Đang kiểm tra…';

    try {
      const hash = await sha256hex(password);
      const h    = { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON };

      // Fetch by username only, compare hash client-side
      const res  = await fetch(
        `${SB_URL}/rest/v1/users?select=id,username,full_name,is_active,is_administrator,password_hash`
        + `&username=ilike.${encodeURIComponent(username)}&limit=1`,
        { headers: h }
      );
      if (!res.ok) throw new Error('Lỗi kết nối (' + res.status + ').');
      const rows = await res.json();

      if (!rows.length) { errEl.textContent = 'Sai username hoặc mật khẩu.'; return; }
      const user = rows[0];
      if (user.password_hash !== hash) { errEl.textContent = 'Sai username hoặc mật khẩu.'; return; }
      if (!user.is_active) { errEl.textContent = 'Tài khoản đã bị vô hiệu hóa.'; return; }

      // Fetch accessible function URLs for non-admin
      let funcUrls = [];
      if (!user.is_administrator) {
        const ufRes = await fetch(
          `${SB_URL}/rest/v1/users_functions?select=functions(url)&user_id=eq.${user.id}`,
          { headers: h }
        );
        if (ufRes.ok) {
          const ufRows = await ufRes.json();
          funcUrls = ufRows.map(r => r.functions && r.functions.url).filter(Boolean);
        }
      }

      const session = {
        userId:   user.id,
        username: user.username,
        fullName: user.full_name || user.username,
        isAdmin:  !!user.is_administrator,
        funcUrls
      };
      saveSession(session);

      if (hasAccess(session)) {
        revealBody(session);
      } else {
        showDenied(session);
      }
    } catch (e) {
      errEl.textContent = e.message || 'Lỗi đăng nhập.';
    } finally {
      const b = document.getElementById('ct-login-btn');
      if (b) { b.disabled = false; b.textContent = 'Đăng nhập'; }
    }
  };

  window.ctLogoutFn = function () { clearSession(); location.reload(); };

  // ── Boot: check session on DOMContentLoaded ───────────────────
  document.addEventListener('DOMContentLoaded', function () {
    const session = getSession();
    if (session) {
      if (hasAccess(session)) {
        revealBody(session);
      } else {
        showDenied(session);
      }
    } else {
      showLoginOverlay();
    }
  });
})();
