module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const token = bodyData.token;
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ error: 'Secret Key is missing in Vercel settings' });
    }

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const outcome = await verifyRes.json();

    if (outcome.success) {
      res.setHeader('Set-Cookie', 'cf_clearance=verified; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Captcha validation failed' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
