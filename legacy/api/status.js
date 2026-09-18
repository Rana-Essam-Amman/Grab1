function sql() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { neon } = require("@neondatabase/serverless");
    return neon(process.env.DATABASE_URL);
  } catch (_) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  const email = String((req.query && req.query.email) || "").trim().toLowerCase();
  if (!email.includes("@")) return res.status(400).json({ error: "invalid_input" });
  const query = sql();
  if (!query) return res.status(200).json({ found: false, confirmed: false });
  const rows = await query`select email, account_country, confirmed, session_jti from users where email = ${email} limit 1`;
  if (!rows.length) return res.status(200).json({ found: false, confirmed: false });
  const confirmed = !!rows[0].confirmed;
  let sessionToken = null;
  if (confirmed) {
    try {
      const crypto = require("crypto");
      const { signSession } = require("./_token");
      let jti = rows[0].session_jti;
      if (!jti) {
        jti = crypto.randomBytes(16).toString("hex");
        await query`update users set session_jti = ${jti} where email = ${rows[0].email}`;
      }
      sessionToken = signSession({ email: rows[0].email, country: rows[0].account_country, jti });
    } catch (_) {}
  }
  return res.status(200).json({
    found: true,
    confirmed,
    country: rows[0].account_country,
    sessionToken,
  });
};
