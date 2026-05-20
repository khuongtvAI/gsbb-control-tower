module.exports = function handler(req, res) {
  res.writeHead(302, {
    'Set-Cookie': 'gsbb_tok=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    Location: '/login.html',
  });
  res.end();
};
