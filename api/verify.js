export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = JSON.parse(req.body || '{}');
  const secretKey = process.env.TURNSTILE_SECRET_KEY; // سنضيفه في Vercel

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    body: formData,
    method: 'POST',
  });

  const outcome = await result.json();

  if (outcome.success) {
    // تعيين كوكي آمن للمستخدم لمدة 24 ساعة عند النجاح
    res.setHeader('Set-Cookie', 'cf_clearance=verified; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400');
    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ success: false, error: 'Captcha failed' });
  }
}
