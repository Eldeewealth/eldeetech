const { setSessionCookie, verifyCredentials } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' });
    const ok = await verifyCredentials(username, password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    setSessionCookie(res, { sub: username, role: 'admin' });
    return res.status(200).json({ success: true });
  } catch (e) {
    const msg = e && e.message ? e.message : 'Login failed';
    return res.status(500).json({ success: false, message: msg });
  }
};

