const { verifySession } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const payload = verifySession(req);
  if (!payload) return res.status(401).json({ success: false, message: 'Unauthorized' });
  res.status(200).json({ success: true, user: { username: payload.sub, role: payload.role } });
};

