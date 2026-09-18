module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  let body = req.body;
  if (typeof body === "string") body = JSON.parse(body || "{}");
  body = body || {};
  const raw = String(body.note || body.raw || "").trim();
  if (raw.length < 8) return res.status(400).json({ ok: false, error: "short_note" });
  // Local agent until Agents.listingCopy.provider is a paid model.
  const year = (raw.match(/20\d{2}|19\d{2}/) || [])[0] || "";
  const price = ((raw.match(/\d[\d,]{2,}/) || [])[0] || "").replace(/,/g, "");
  let make = "";
  ["كامري", "تويوتا", "هوندا", "كيا", "هيونداي"].forEach((b) => {
    if (raw.includes(b)) make = b;
  });
  const inspect = raw.includes("فحص");
  const title = [make, year].filter(Boolean).join(" ") + (price ? " للبيع — " + Number(price).toLocaleString("en-US") + " دينار" : " للبيع");
  const bodyText = [
    make || year ? `${[make, year].filter(Boolean).join(" ")} للبيع` : "إعلان للبيع",
    make || year ? `الموديل: ${[make, year].filter(Boolean).join(" ")}` : "",
    price ? `السعر المطلوب: ${Number(price).toLocaleString("en-US")} دينار` : "",
    inspect ? "الفحص: فحص جيد كما ذكر البائع" : "",
    "",
    make ? `${make} ${year} جاهزة للمعاينة والفحص عند من يختاره المشتري.` : "السلعة جاهزة للمعاينة.",
    "للتواصل الجاد: عبر رسائل الإعلان.",
  ]
    .filter((l) => l !== "")
    .join("\n");
  return res.status(200).json({
    ok: true,
    agent: "listing-copy",
    provider: "local",
    title,
    body: bodyText,
    facts: { make, year, price },
    missing: ["العداد", "الموقع", "المحرك والوارد واللون"],
  });
};
