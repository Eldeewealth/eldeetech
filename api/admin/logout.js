const { clearSessionCookie } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  clearSessionCookie(res);
  res.status(200).json({ success: true });
};

