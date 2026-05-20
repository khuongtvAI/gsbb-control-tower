const crypto = require('crypto');

const USERS = () => ({
  admin: process.env.GSBB_USER_ADMIN,
  ceo:   process.env.GSBB_USER_CEO,
  pmo:   process.env.GSBB_USER_PMO,
});
const SESSION_HOURS = parseInt(process.env.GSBB_SESSION_HOURS) || 8;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const body = await new Promise(resolve => {
    let d = '';
    req.on('data', c => d += c);
    req.on('end', () => resolve(d));
  });

  const params   = new URLSearchParams(body);
  const username = (params.get('username') || '').trim();
  const password = params.get('password') || '';
  const expected = USERS()[username];

  if (!expected || expected !== password) {
    res.writeHead(302, { Location: '/login.html?error=1' });
    return res.end();
  }

  const secret  = process.env.GSBB_SECRET || 'gsbb-no-secret';
  const exp     = Date.now() + SESSION_HOURS * 3_600_000;
  const payload = Buffer.from(JSON.stringify({ u: username, exp })).toString('base64url');
  const sig     = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

  res.writeHead(302, {
    'Set-Cookie': `gsbb_tok=${payload}.${sig}; Path=/; HttpOnly; SameSite=Strict`,
    Location: '/',
  });
  res.end();
};
