const { verifySession } = require("./_token");

const CATEGORIES = [
  "motors","real-estate","mobiles","watches","computers","electronics","furniture",
  "fashion","services","jobs","kids","beauty","pets","sports","books","home-garden","krakeeb",
];
const CURRENCIES = {
  JO: ["JOD"],
  LB: ["LBP", "USD"],
  PS: ["ILS", "JOD"],
  SY: ["SYP", "USD"],
};

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

function json(res, code, body) {
  res.status(code).json(body);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const query = sql();

  if (req.method === "GET") {
    const country = String((req.query && req.query.country) || "").toUpperCase();
    if (!["JO", "LB", "PS", "SY"].includes(country)) return json(res, 400, { ok: false, error: "invalid_country" });
    if (!query) return json(res, 200, { ok: true, listings: [] });
    const rows = await query`
      select id, country_code, city, neighborhood, category_slug, title, description, price, currency, image_url, created_at
      from listings
      where country_code = ${country}
      order by created_at desc
      limit 50
    `;
    return json(res, 200, { ok: true, listings: rows });
  }

  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" });

  const session = verifySession(bearer(req));
  if (!session || !session.email) return json(res, 401, { ok: false, error: "unauthorized" });

  let body = req.body;
  if (typeof body === "string") body = JSON.parse(body || "{}");
  body = body || {};

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const category = String(body.categorySlug || "").trim();
  const subcategory = String(body.subcategorySlug || "").trim();
  const attrs = body.attrs && typeof body.attrs === "object" ? body.attrs : {};
  const city = String(body.city || "").trim();
  const neighborhood = String(body.neighborhood || "").trim();
  const currency = String(body.currency || "").trim().toUpperCase();
  const price = Number(body.price);
  let image = String(body.image || "");
  if (image && (image.length > 350000 || !image.startsWith("data:image/"))) image = "";

  if (!query) return json(res, 503, { ok: false, error: "database_unavailable" });

  const users = await query`select email, account_country, phone, confirmed from users where email = ${session.email} limit 1`;
  if (!users.length || !users[0].confirmed) return json(res, 401, { ok: false, error: "unauthorized" });
  const country = users[0].account_country;
  if (session.jti) {
    const live = await query`select session_jti from users where email = ${session.email} limit 1`;
    if (live[0].session_jti && live[0].session_jti !== session.jti) {
      return json(res, 401, { ok: false, error: "revoked" });
    }
  }

  if (title.length < 3 || description.length < 8 || !CATEGORIES.includes(category) || city.length < 2 || neighborhood.length < 2) {
    return json(res, 400, { ok: false, error: "invalid_input" });
  }
  if (!Number.isFinite(price) || price <= 0) return json(res, 400, { ok: false, error: "invalid_price" });
  if (!(CURRENCIES[country] || []).includes(currency)) return json(res, 400, { ok: false, error: "invalid_currency" });

  const countRows = await query`select count(*)::int as n from listings where seller_email = ${session.email}`;
  if ((countRows[0] && countRows[0].n) >= 5) return json(res, 403, { ok: false, error: "free_limit" });

  const inserted = await query`
    insert into listings (
      seller_email, seller_phone, country_code, city, neighborhood,
      category_slug, subcategory_slug, title, description, price, currency, image_url, attrs
    ) values (
      ${session.email}, ${users[0].phone}, ${country}, ${city}, ${neighborhood},
      ${category}, ${subcategory || null}, ${title}, ${description}, ${price}, ${currency}, ${image || null}, ${JSON.stringify(attrs)}
    ) returning id
  `;
  return json(res, 200, { ok: true, id: inserted[0].id, country });
};
