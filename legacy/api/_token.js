const crypto = require("crypto");

function secret() {
  return process.env.JWT_SECRET || "catch-the-deals-dev-only";
}

function signSession(payload) {
  const now = Date.now();
  const body = Buffer.from(JSON.stringify({
    ...payload,
    jti: payload.jti || crypto.randomBytes(16).toString("hex"),
    iat: now,
    exp: now + 30 * 24 * 60 * 60 * 1000,
  })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySession(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  if (expected !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch (_) {
    return null;
  }
}

module.exports = { signSession, verifySession };
