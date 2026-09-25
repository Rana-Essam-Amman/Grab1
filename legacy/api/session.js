const { verifySession } = require("./_token");

function sql() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { neon } = require("@neondatabase/serverless");
    return neon(process.env.DATABASE_URL);
  } catch (_) {
    return null;
  }
}

function bearer(req) {
  const h = req.headers.authorization || req.headers.Authorization || "";
  return String(h).replace(/^Bearer\s+/i, "").trim();
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const payload = verifySession(bearer(req));
  if (!payload || !payload.email) return res.status(401).json({ ok: false, error: "invalid_session" });

  const query = sql();
  if (query && payload.jti) {
    const rows = await query`select session_jti, account_country, confirmed from users where email = ${payload.email} limit 1`;
    if (!rows.length || !rows[0].confirmed || (rows[0].session_jti && rows[0].session_jti !== payload.jti)) {
      return res.status(401).json({ ok: false, error: "revoked" });
    }
  }

  if (req.method === "DELETE") {
    if (query) await query`update users set session_jti = null where email = ${payload.email}`;
    return res.status(200).json({ ok: true, loggedOut: true });
  }

  return res.status(200).json({
    ok: true,
    email: payload.email,
    country: payload.country,
    exp: payload.exp,
  });
};
