module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const token = String((req.query && req.query.token) || "").trim();
  if (!token) return res.status(400).send("missing token");

  let confirmed = false;
  if (process.env.DATABASE_URL) {
    try {
      const { neon } = require("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const crypto = require("crypto");
      const rows = await sql`update users set confirmed = true, confirm_token = null, session_jti = coalesce(session_jti, ${crypto.randomBytes(16).toString("hex")}) where confirm_token = ${token} returning email`;
      confirmed = rows.length > 0;
    } catch (err) {
      confirmed = false;
    }
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const title = confirmed ? "Account confirmed" : "Link received";
  const body = confirmed
    ? "Your Catch the deals account is confirmed. Return to the app."
    : "The link was opened. If the account is not marked confirmed yet, request a new email from the app.";
  return res.status(200).send(`<!doctype html><html><body style="font-family:Georgia,serif;background:#f9f8f4;color:#1a1918;padding:40px">
  <h1>Catch the deals</h1>
  <p><b>${title}</b></p>
  <p>${body}</p>
  </body></html>`);
};
