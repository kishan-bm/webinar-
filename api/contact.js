const nodemailer = require('nodemailer');

const TO_ADDRESS = 'contact@navigationtrading.com, support@navigationtrading.com, kishan@qodet.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip CR/LF so user input can't inject extra SMTP headers.
function clean(value, maxLen) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, maxLen);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Honeypot: a hidden field real users never fill in. If it's set, silently
  // pretend success so bots don't learn to avoid it.
  if (clean(body.company, 100)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 150) || 'General Question';
  const message = String(body.message || '').trim().slice(0, 5000);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email, and message are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error('Contact form: SMTP env vars are not configured.');
    return res.status(500).json({ ok: false, error: 'Email is not configured yet. Please try again later.' });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"NavigationTrading Website" <${user}>`,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `[Contact Form] ${subject} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form send failed:', err);
    return res.status(502).json({ ok: false, error: 'Could not send your message right now. Please email us directly.' });
  }
};
