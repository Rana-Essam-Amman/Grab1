function sql() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { neon } = require("@neondatabase/serverless");
    return neon(process.env.DATABASE_URL);
  } catch (_) {
    return null;
  }
}

const recent = new Map();

function normalizeEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at < 1) return value;
  let local = value.slice(0, at);
  let domain = value.slice(at + 1);
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") local = local.split("+")[0].replace(/\./g, "");
  return `${local}@${domain}`;
}

function tooMany(email) {
  const now = Date.now();
  const prev = recent.get(email) || [];
  const windowed = prev.filter((t) => now - t < 10 * 60 * 1000);
  if (windowed.length >= 5) return true;
  windowed.push(now);
  recent.set(email, windowed);
  return false;
}

function normalizePhone(country, raw) {
  let digits = String(raw || "").replace(/[^0-9]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  const cc = { JO: "962", LB: "961", PS: "970", SY: "963" }[country] || "";
  if (cc && digits.startsWith(cc)) return `+${digits}`;
  if (digits.startsWith("0")) digits = digits.slice(1);
  return `+${cc}${digits}`;
}

async function sendLink(email, confirmUrl, login) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { emailed: false, emailError: "RESEND_API_KEY missing" };
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Catch the deals <onboarding@resend.dev>",
      to: [email],
      subject: login ? "Sign in to Catch the deals" : "Confirm your Catch the deals account",
      html: `<p>${login ? "Sign in" : "Confirm your account"}.</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
    }),
  });
  return { emailed: sent.ok, emailError: sent.ok ? null : await sent.text() };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  let body = req.body;
  if (typeof body === "string") body = JSON.parse(body || "{}");
  body = body || {};

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = normalizeEmail(body.email);
  const phone = String(body.phone || "").trim();
  const country = String(body.country || "").trim().toUpperCase();
  let avatar = String(body.avatar || "");
  if (avatar && (avatar.length > 350000 || !avatar.startsWith("data:image/"))) avatar = "";
  const keyPhone = normalizePhone(country, phone);
  if (firstName.length < 2 || lastName.length < 2 || !email.includes("@") || keyPhone.length < 8 || !["JO", "LB", "PS", "SY"].includes(country)) {
    return res.status(400).json({ error: "invalid_input" });
  }
  if (tooMany(email)) return res.status(429).json({ error: "rate_limited", message: "Too many attempts. Try again later." });

  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const base = process.env.PUBLIC_BASE_URL || "https://project-1-preview-rana-essam-amman.vercel.app";
  const confirmUrl = `${base}/api/confirm?token=${encodeURIComponent(token)}`;
  const query = sql();

  if (query) {
    const byEmail = await query`select * from users where email = ${email} limit 1`;
    const byPhone = await query`select * from users where phone_key = ${keyPhone} limit 1`;
    if (byPhone.length && byPhone[0].email !== email) {
      return res.status(409).json({ error: "duplicate_phone", message: "This phone number already has an account." });
    }
    if (byEmail.length) {
      await query`update users set confirm_token = ${token}, phone = ${phone}, phone_key = ${keyPhone}, first_name = ${firstName}, last_name = ${lastName}, avatar_data = coalesce(nullif(${avatar}, ''), avatar_data) where email = ${email}`;
      const login = !!byEmail[0].confirmed;
      const mail = await sendLink(email, confirmUrl, login);
      return res.status(200).json({
        ok: true,
        mode: login ? "login" : "resend",
        country: byEmail[0].account_country,
        saved: true,
        confirmUrl,
        ...mail,
      });
    }
    try {
      await query`
        insert into users (email, phone, phone_key, account_country, first_name, last_name, avatar_data, confirmed, confirm_token)
        values (${email}, ${phone}, ${keyPhone}, ${country}, ${firstName}, ${lastName}, ${avatar || null}, false, ${token})
      `;
    } catch (err) {
      return res.status(409).json({ error: "duplicate", message: String(err.message || err) });
    }
  }

  const mail = await sendLink(email, confirmUrl, false);
  return res.status(200).json({ ok: true, mode: "register", country, saved: !!query, confirmUrl, ...mail });
};
