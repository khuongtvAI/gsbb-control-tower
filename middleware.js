// Vercel Edge Middleware — protect all routes unless authenticated
async function verifyToken(token, secret) {
  try {
    const dot = token.lastIndexOf('.');
    if (dot < 1) return false;
    const data    = token.slice(0, dot);
    const sigB64u = token.slice(dot + 1);

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );

    const b64  = sigB64u.replace(/-/g, '+').replace(/_/g, '/');
    const pad  = b64 + '='.repeat((4 - b64.length % 4) % 4);
    const bin  = atob(pad);
    const sigBytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) sigBytes[i] = bin.charCodeAt(i);

    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
    if (!valid) return false;

    const b64p    = data.replace(/-/g, '+').replace(/_/g, '/');
    const padP    = b64p + '='.repeat((4 - b64p.length % 4) % 4);
    const payload = JSON.parse(atob(padP));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  const { pathname } = new URL(request.url);

  // Public paths — skip auth
  if (
    pathname === '/login.html' ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/_vercel/')
  ) return;

  const secret = process.env.GSBB_SECRET;
  // If secret not configured yet, bypass auth (backwards compatible)
  if (!secret) return;

  const cookie = request.headers.get('cookie') || '';
  const m      = cookie.match(/gsbb_tok=([\w.\-]+)/);
  const token  = m?.[1];

  if (!token || !(await verifyToken(token, secret))) {
    return Response.redirect(new URL('/login.html', request.url), 302);
  }
}

export const config = {
  matcher: ['/((?!_vercel|favicon\\.ico).*)'],
};
