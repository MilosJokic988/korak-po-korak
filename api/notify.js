// Obaveštenja stručnjacima mejlom (preko Resend-a). Svaki stručnjak dobija
// samo svoje porodice, na mejl sa kojim je registrovan (ako je to uključio u profilu).
//
//  POST /api/notify?kind=message  – aplikacija ga pozove čim porodica pošalje poruku
//  GET  /api/notify?kind=all      – Vercel Cron ga pozove jednom dnevno (zbirni mejl)
//
// Potrebno na Vercel-u (Settings → Environment Variables):
//   RESEND_API_KEY  – ključ sa resend.com (tip: Secret)
//   NOTIFY_SECRET   – ista tajna koja je upisana u Supabase tabelu app_settings
//   NOTIFY_FROM     – pošiljalac, npr. "Korak po korak <obavestenja@vasdomen.rs>"
//                     (za slanje na tuđe adrese Resend traži potvrđen domen)
//   APP_URL         – adresa aplikacije, npr. https://korakpokorak.vercel.app
// Supabase adresa i ključ se uzimaju iz postojećih VITE_SUPABASE_* promenljivih.

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
let APP_URL = (process.env.APP_URL || "").replace(/\/$/, "");
const FROM = process.env.NOTIFY_FROM || "Korak po korak <onboarding@resend.dev>";

const ISKUSTVA = { prijalo: "Prijalo je", prilagodjavanje: "Uz prilagođavanje", pauza: "Bila je potrebna pauza", istrazujemo: "Još istražujemo" };

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nl = s => esc(s).replace(/\n/g, "<br>");
const fam = x => `${x.family}${x.is_test ? " (test)" : ""}`;
const link = x => `${APP_URL}/#/admin/p/${x.family_id}`;

async function rpc(name, p) {
  const headers = { apikey: SUPABASE_KEY, "Content-Type": "application/json" };
  if (SUPABASE_KEY.split(".").length === 3) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, { method: "POST", headers, body: JSON.stringify({ p }) });
  const t = await r.text();
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${t.slice(0, 200)}`);
  return t ? JSON.parse(t) : null;
}

function groupByFamily(list) {
  const m = new Map();
  for (const x of list) {
    if (!m.has(x.family_id)) m.set(x.family_id, { head: x, items: [] });
    m.get(x.family_id).items.push(x);
  }
  return [...m.values()];
}

const wrap = (title, inner) => `<!doctype html><html><body style="margin:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;color:#23332e">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<p style="font-size:12px;letter-spacing:1.5px;color:#6b7a73;margin:0 0 6px">KORAK PO KORAK</p>
<h1 style="font-size:22px;font-weight:normal;margin:0 0 18px">${esc(title)}</h1>
${inner}
<p style="margin:26px 0 0"><a href="${APP_URL}/#/admin" style="background:#1f3b73;color:#fff;text-decoration:none;padding:11px 18px;border-radius:10px;display:inline-block">Otvori aplikaciju</a></p>
<p style="font-size:11px;color:#8a958f;margin-top:22px">Ovaj mejl šalje aplikacija Korak po korak. Obaveštenja možete isključiti u svom profilu.</p>
</div></body></html>`;

const card = inner => `<div style="background:#ffffff;border:1px solid #e1e6ee;border-radius:14px;padding:14px 16px;margin:0 0 12px">${inner}</div>`;

function messagesHtml(msgs) {
  return groupByFamily(msgs).map(g => card(
    `<p style="margin:0 0 8px"><b><a href="${link(g.head)}" style="color:#1f3b73">${esc(fam(g.head))}</a></b></p>` +
    g.items.map(x => `<p style="margin:0 0 8px;line-height:1.5">„${nl(x.body)}“</p>`).join("")
  )).join("");
}

function obsHtml(obs) {
  return groupByFamily(obs).map(g => card(
    `<p style="margin:0 0 8px"><b><a href="${link(g.head)}" style="color:#1f3b73">${esc(fam(g.head))}</a></b> · ${g.items.length} ${g.items.length === 1 ? "zapažanje" : "zapažanja"}</p>` +
    g.items.map(x => `<p style="margin:0 0 8px;line-height:1.5">• <b>${esc(x.activity || "Aktivnost")}</b>${x.experience ? ` – ${esc(ISKUSTVA[x.experience] || x.experience)}` : ""}` +
      `${x.details ? `<br><span style="color:#55635d">${nl(x.details)}</span>` : ""}${x.remember ? `<br><span style="color:#55635d">Zapamtiti: ${nl(x.remember)}</span>` : ""}</p>`).join("")
  )).join("");
}

function revHtml(revs) {
  return groupByFamily(revs).map(g => card(
    `<p style="margin:0 0 8px"><b><a href="${link(g.head)}" style="color:#1f3b73">${esc(fam(g.head))}</a></b> · nedeljni osvrt</p>` +
    g.items.map(x => `<p style="margin:0 0 8px;line-height:1.5">${x.good ? `<b>Dobro:</b> ${nl(x.good)}<br>` : ""}${x.hard ? `<b>Teško:</b> ${nl(x.hard)}<br>` : ""}${x.next ? `<b>Sledeće:</b> ${nl(x.next)}` : ""}</p>`).join("")
  )).join("");
}

function textVersion(d) {
  const out = [];
  for (const x of d.messages) out.push(`Poruka – ${fam(x)}: ${x.body}`);
  for (const x of d.observations) out.push(`Zapažanje – ${fam(x)}: ${x.activity}${x.experience ? " (" + (ISKUSTVA[x.experience] || x.experience) + ")" : ""}${x.details ? " – " + x.details : ""}`);
  for (const x of d.reviews) out.push(`Osvrt – ${fam(x)}: ${[x.good, x.hard, x.next].filter(Boolean).join(" / ")}`);
  out.push("", `${APP_URL}/#/admin`);
  return out.join("\n");
}

async function sendMail(to, subject, html, text) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
}

export default async function handler(req, res) {
  const missing = ["RESEND_API_KEY", "NOTIFY_SECRET"].filter(k => !process.env[k]);
  if (!APP_URL) APP_URL = `https://${(req.headers && (req.headers["x-forwarded-host"] || req.headers.host)) || "localhost"}`;
  if (!SUPABASE_URL || !SUPABASE_KEY) missing.push("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
  if (missing.length) return res.status(200).json({ ok: false, configured: false, missing });

  const kind = String((req.query && req.query.kind) || "message") === "all" ? "all" : "message";
  const started = new Date(Date.now() - 1000).toISOString();
  let d;
  try {
    d = await rpc("notify_collect", { secret: process.env.NOTIFY_SECRET, kind });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
  d = { messages: d.messages || [], observations: d.observations || [], reviews: d.reviews || [] };
  // grupisanje po stručnjaku; preskaču se oni koji su isključili obaveštenja
  const byPro = new Map();
  const add = (kindKey, x) => {
    if (!x.pro_email || x.pro_notify === false) return;
    if (!byPro.has(x.pro_email)) byPro.set(x.pro_email, { messages: [], observations: [], reviews: [] });
    byPro.get(x.pro_email)[kindKey].push(x);
  };
  d.messages.forEach(x => add("messages", x));
  d.observations.forEach(x => add("observations", x));
  d.reviews.forEach(x => add("reviews", x));
  if (!byPro.size) return res.status(200).json({ ok: true, sent: 0 });

  let sent = 0;
  const errors = [];
  for (const [to, g] of byPro) {
    let subject, inner;
    if (!g.observations.length && !g.reviews.length) {
      const names = [...new Set(g.messages.map(fam))];
      subject = `Nova poruka – ${names.join(", ")}`;
      inner = messagesHtml(g.messages);
    } else {
      const parts = [];
      if (g.messages.length) parts.push(`${g.messages.length} ${g.messages.length === 1 ? "poruka" : "poruka"}`);
      if (g.observations.length) parts.push(`${g.observations.length} ${g.observations.length === 1 ? "zapažanje" : "zapažanja"}`);
      if (g.reviews.length) parts.push(`${g.reviews.length} ${g.reviews.length === 1 ? "osvrt" : "osvrta"}`);
      subject = `Danas od porodica: ${parts.join(", ")}`;
      inner = (g.messages.length ? `<h2 style="font-size:16px;margin:18px 0 10px">Poruke</h2>${messagesHtml(g.messages)}` : "")
        + (g.observations.length ? `<h2 style="font-size:16px;margin:18px 0 10px">Zapažanja</h2>${obsHtml(g.observations)}` : "")
        + (g.reviews.length ? `<h2 style="font-size:16px;margin:18px 0 10px">Nedeljni osvrti</h2>${revHtml(g.reviews)}` : "");
    }
    try {
      await sendMail(to, subject, wrap(subject, inner), textVersion(g));
      sent += g.messages.length + g.observations.length + g.reviews.length;
    } catch (e) { errors.push(e.message); }
  }
  if (!sent && errors.length) {
    // nijedan mejl nije otišao – vrati kao neposlato, da stigne sledeći put
    try { await rpc("notify_undo", { secret: process.env.NOTIFY_SECRET, since: started }); } catch {}
    return res.status(500).json({ ok: false, error: errors[0] });
  }
  return res.status(200).json({ ok: true, sent, errors: errors.length ? errors : undefined });
}
