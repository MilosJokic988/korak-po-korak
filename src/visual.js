/* Vizuelna podrška za decu sa PSA (nivo podrške 1, 2, 3):
   galerija alata, uređivač sa živim pregledom, štampa na A4 i deljenje sa porodicom. */

import { admin as api } from "./api.js";
import { esc, toast, openModal, closeModal, fmtDate, ICON } from "./util.js";
import { compressImage } from "./extract.js";
import {
  PICTO, LEVELS, COLS_BY_LEVEL, COM_CATS, KINDS, kindOf, PRESETS, SENSORY_ROWS, DAYS,
  PASS_SECTIONS, PASS_GEAR, LA_COLS, EMO_SCALE5, EMO_TRAFFIC, GUIDE, HOW_TO,
} from "./visual-data.js";

export const V = { list: null, cur: null, dirty: false, saving: false, pickPath: null, za: "", filter: "sve" };

const clone = o => JSON.parse(JSON.stringify(o));
const lines = s => String(s || "").split("\n").map(x => x.trim()).filter(Boolean);

/* ================================================================ CSS (isti za pregled i štampu) */

const VCSS = `
.vdoc{--ink:#1e293b;--muted:#64748b;font-family:"Nunito","Inter",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink)}
.vsheet{width:794px;min-height:1123px;padding:42px 44px 34px;background:#fff;position:relative;box-sizing:border-box;display:flex;flex-direction:column}
.vdoc.land .vsheet{width:1123px;min-height:794px;padding:30px 34px 26px}
.vsheet+.vsheet{margin-top:24px}
.vh{display:flex;align-items:center;gap:16px;margin-bottom:22px;padding-bottom:14px;border-bottom:4px solid #e2e8f0}
.vh .vh-ico{font-size:46px;line-height:1}
.vh h1{font-size:38px;line-height:1.1;margin:0;font-weight:800;letter-spacing:-.5px;color:#1e3a8a}
.vh p{margin:4px 0 0;font-size:17px;color:var(--muted)}
.vfoot{margin-top:auto;padding-top:16px;font-size:11px;color:#94a3b8;text-align:center}
.vp-pic{font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif;font-size:var(--pic,64px);line-height:1.1;display:inline-flex;align-items:center;justify-content:center;min-height:calc(var(--pic,64px)*1.1)}
.vp-pic img{width:calc(var(--pic,64px)*1.15);height:calc(var(--pic,64px)*1.15);object-fit:cover;border-radius:14px;display:block}
.vp-pic.none{min-height:0}
.vg{display:grid;grid-template-columns:repeat(var(--cols,3),1fr);gap:16px}
.vc{border:3px solid #e2e8f0;border-radius:20px;padding:14px 10px 12px;text-align:center;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;break-inside:avoid}
.vc b{font-size:var(--txt,20px);line-height:1.15;font-weight:800}
.vc .vnum{align-self:flex-start;width:34px;height:34px;border-radius:50%;background:#1e3a8a;color:#fff;font-weight:800;font-size:18px;display:grid;place-items:center;margin:-4px 0 -24px -2px}
.vc.cut{border:2.5px dashed #94a3b8}
.vq{font-size:30px;font-weight:800;text-align:center;margin:0 0 18px;color:#1e3a8a}
/* raspored – lista */
.vr{display:flex;flex-direction:column;gap:12px}
.vr-row{display:grid;grid-template-columns:auto auto 1fr auto;align-items:center;gap:18px;border:3px solid #e2e8f0;border-radius:18px;padding:8px 16px;break-inside:avoid}
.vr-row .t{font-size:22px;font-weight:800;color:#1e3a8a;min-width:70px}
.vr-row b{font-size:var(--txt,24px);font-weight:800}
.vbox{width:44px;height:44px;border:3px solid #94a3b8;border-radius:10px}
.vr.no-time .vr-row{grid-template-columns:auto 1fr auto}
.vr.no-check .vr-row{grid-template-columns:auto auto 1fr}
.vr.no-time.no-check .vr-row{grid-template-columns:auto 1fr}
.vstrip{display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;justify-content:center}
.vstrip .vc{flex:0 1 calc((100% - 44px * (var(--cols) - 1)) / var(--cols));min-width:120px}
.vstrip .arr{align-self:center;font-size:32px;color:#94a3b8;font-weight:800}
.vc .vbox{width:34px;height:34px}
/* prvo-posle */
.vpp{display:flex;gap:20px;align-items:stretch;flex:1;max-height:620px}
.vpp .panel{flex:1;border:4px solid #e2e8f0;border-radius:26px;overflow:hidden;display:flex;flex-direction:column}
.vpp .lab{font-size:36px;font-weight:900;color:#fff;text-align:center;padding:10px;letter-spacing:2px}
.vpp .body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px}
.vpp .body b{font-size:var(--txt,34px);font-weight:900}
.vpp .arr{align-self:center;font-size:54px;color:#94a3b8;font-weight:900}
/* komunikacija */
.vcom .vc{border-width:2px;border-radius:14px;padding:8px 6px}
.vlegend{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:16px;font-size:13px;color:var(--muted)}
.vlegend i{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:-2px;margin-right:5px;border:1px solid #cbd5e1}
/* emocije */
.vscale{display:flex;flex-direction:column;gap:10px}
.vscale .row{display:grid;grid-template-columns:90px 1fr 1.2fr 1.4fr;border-radius:18px;overflow:hidden;border:3px solid #e2e8f0;break-inside:avoid}
.vscale .n{color:#fff;font-size:46px;font-weight:900;display:grid;place-items:center}
.vscale .row>div{padding:12px 14px;font-size:17px;line-height:1.35}
.vscale .row>div b{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
.vscale .lbl{font-size:22px!important;font-weight:900}
.vscale.big .n{font-size:64px}
.vscale.big .row{min-height:150px}
/* prelaz */
.vtr{display:flex;flex-direction:column;gap:22px;align-items:center}
.vtr .big{font-size:44px;font-weight:900;color:#1e3a8a;text-align:center}
.vtr .vc{width:340px}
.vcount{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.vcount span{width:92px;height:92px;border:3px dashed #94a3b8;border-radius:18px;display:grid;place-items:center;font-size:46px;font-weight:900;color:#1e3a8a}
.vtr small{font-size:15px;color:var(--muted);text-align:center}
/* tokeni */
.vtok{display:flex;flex-direction:column;gap:22px}
.vtok .top{display:flex;gap:18px;align-items:stretch}
.vtok .top .vc{flex:1}
.vtok .lab{font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.vslots{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;padding:18px;border:4px solid #fde68a;border-radius:24px;background:#fffbeb}
.vslots span{width:var(--slot,96px);height:var(--slot,96px);border-radius:50%;border:4px dashed #f59e0b;background:#fff}
.vtokens{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.vtokens span{width:var(--slot,96px);height:var(--slot,96px);border-radius:50%;border:2px dashed #94a3b8;display:grid;place-items:center;font-size:calc(var(--slot,96px)*.6);font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif}
/* priča */
.vstory{flex:1;display:flex;flex-direction:column;gap:20px}
.vstory .pg{flex:1;border:4px solid #e2e8f0;border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:26px;text-align:center;min-height:470px;break-inside:avoid}
.vstory .pg p{font-size:var(--txt,30px);line-height:1.35;font-weight:700;margin:0;max-width:600px}
.vstory .pg .no{font-size:14px;color:var(--muted);font-weight:800}
.vstory .cover h2{font-size:46px;margin:0;color:#1e3a8a;font-weight:900}
/* skripta i pravila */
.vlist{display:flex;flex-direction:column;gap:14px}
.vlist .li{display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:18px;border:3px solid #e2e8f0;border-radius:20px;padding:10px 18px;break-inside:avoid}
.vlist .no{width:46px;height:46px;border-radius:50%;background:#1e3a8a;color:#fff;font-size:24px;font-weight:900;display:grid;place-items:center}
.vlist b{font-size:var(--txt,24px);font-weight:800;line-height:1.25}
.vlist.bubble .li b{background:#eff6ff;border-radius:18px;padding:10px 16px;position:relative}
.vlist.rules .li{grid-template-columns:auto 1fr}
.vlist.rules .vp-pic{background:#eff6ff;border-radius:50%;width:calc(var(--pic)*1.5);height:calc(var(--pic)*1.5)}
/* senzorni */
.vsen{width:100%;border-collapse:separate;border-spacing:6px;table-layout:fixed}
.vsen th{color:#fff;font-size:18px;font-weight:900;padding:8px;border-radius:12px}
.vsen td{border:2px solid #e2e8f0;border-radius:14px;text-align:center;padding:6px 4px;vertical-align:middle;height:142px}
.vsen td b{display:block;font-size:13px;line-height:1.2;margin-top:2px}
.vsen td.rh{text-align:left;padding:10px;border:0}
.vsen td.rh b{font-size:18px}
.vsen td.rh small{font-size:12px;color:var(--muted)}
/* pasoš */
.vpass{display:flex;flex-direction:column;gap:12px}
.vpass .idrow{display:grid;grid-template-columns:1fr 150px;gap:18px}
.vpass .photo{border:3px dashed #93c5fd;border-radius:14px;background:#eff6ff;display:grid;place-items:center;text-align:center;font-size:13px;color:#3b82f6;height:160px;padding:10px}
.vline{border-bottom:2px solid #cbd5e1;min-height:30px;font-size:16px;padding:4px 2px;margin-bottom:6px}
.vline label{font-weight:800;margin-right:8px}
.vban{display:inline-flex;align-items:center;gap:10px;color:#fff;font-weight:900;font-size:18px;padding:6px 18px 6px 12px;border-radius:10px 30px 30px 10px;margin:6px 0 4px}
.vban small{font-weight:600;opacity:.9;font-size:14px}
.vtwo{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.vtwo .vline{min-height:46px}
.vgear{display:flex;flex-wrap:wrap;gap:6px 22px;font-size:16px}
.vgear span::before{content:"☐ ";font-size:18px}
.vgear span.on::before{content:"☑ "}
/* low arousal */
.vla{width:100%;border-collapse:separate;border-spacing:4px;table-layout:fixed;font-size:12.5px}
.vla th{color:#fff;border-radius:10px;padding:6px 4px;font-size:13px;line-height:1.15}
.vla th small{display:block;font-weight:600;font-size:10px;opacity:.9}
.vla td{border:2px solid #e2e8f0;border-radius:10px;vertical-align:top;padding:6px 8px;line-height:1.3}
.vla td.nm{font-weight:900;font-size:15px;text-align:center;vertical-align:middle;background:#f8fafc}
.vla ul,.vla ol{margin:0;padding-left:16px}
.vla .empty{border-bottom:1px dotted #cbd5e1;height:16px;margin:6px 0}
.vla-note{font-size:13px;text-align:center;margin-top:10px;color:var(--muted)}
/* vodič */
.vguide{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.vguide .g{border:2px solid #e2e8f0;border-radius:16px;padding:10px 14px;display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:start}
.vguide .g .vp-pic{--pic:34px}
.vguide .g b{font-size:16px;display:block}
.vguide .g p{margin:2px 0 0;font-size:13px;line-height:1.35;color:#475569}
.vlvls{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}
.vlvls div{border-radius:16px;padding:10px 14px;border:2px solid}
.vlvls b{font-size:16px}
.vlvls ul{margin:6px 0 0;padding-left:16px;font-size:12.5px;line-height:1.35}
.vhow{font-size:14px;line-height:1.5;margin:6px 0 0;padding-left:20px}
`;

export function ensureCss() {
  if (typeof document === "undefined" || document.getElementById("vcss")) return;
  const s = document.createElement("style");
  s.id = "vcss"; s.textContent = VCSS;
  document.head.appendChild(s);
}

/* ================================================================ crtanje */

export function picHtml(p, extra = "") {
  if (!p) return `<span class="vp-pic none" ${extra}></span>`;
  if (p.startsWith("data:")) return `<span class="vp-pic" ${extra}><img src="${p}" alt=""></span>`;
  return `<span class="vp-pic" ${extra}>${esc(p.replace(/^e:/, ""))}</span>`;
}

const lvl = d => [1, 2, 3].includes(Number(d.level)) ? Number(d.level) : 2;
const colsOf = (d, n) => Math.max(1, Math.min(n || 1, Number(d.cols) || COLS_BY_LEVEL[lvl(d)]));
function sizes(d, cols) {
  const base = { 3: [120, 34], 2: [80, 24], 1: [56, 19] }[lvl(d)];
  const pic = Math.round(Math.min(base[0], 560 / cols * 0.62));
  const txt = Math.round(Math.min(base[1], 30 - cols * 1.5 + (lvl(d) === 3 ? 6 : 0)));
  return `--cols:${cols};--pic:${pic}px;--txt:${Math.max(14, txt)}px`;
}

function head(rec, icon) {
  const d = rec.data;
  return `<header class="vh"><span class="vh-ico">${picHtml("e:" + icon)}</span><div><h1>${esc(rec.title)}</h1>${d.child ? `<p>${esc(d.child)}</p>` : ""}</div></header>`;
}
const foot = `<div class="vfoot">Korak po korak · vizuelna podrška</div>`;
const sheet = (inner, cls = "") => `<section class="vsheet ${cls}">${inner}${foot}</section>`;

const R = {
  raspored(rec) {
    const d = rec.data, items = d.items || [];
    if (d.orientation === "h") {
      const cols = Math.min(items.length || 1, lvl(d) === 3 ? 2 : lvl(d) === 2 ? 4 : 5);
      return sheet(head(rec, "📅") + `<div class="vstrip" style="${sizes(d, cols)}">${items.map((x, i) => `${i ? `<span class="arr">→</span>` : ""}<div class="vc">${picHtml(x.pic)}${d.showText === false ? "" : `<b>${esc(x.text)}</b>`}${d.showTime && x.time ? `<small>${esc(x.time)}</small>` : ""}${d.check ? `<span class="vbox"></span>` : ""}</div>`).join("")}</div>`);
    }
    const st = sizes(d, lvl(d) === 3 ? 2 : lvl(d) === 2 ? 4 : 6);
    return sheet(head(rec, "📅") + `<div class="vr ${d.showTime ? "" : "no-time"} ${d.check ? "" : "no-check"}" style="${st}">${items.map(x => `
      <div class="vr-row">${d.showTime ? `<span class="t">${esc(x.time || "")}</span>` : ""}${picHtml(x.pic)}<b>${esc(x.text)}</b>${d.check ? `<span class="vbox"></span>` : ""}</div>`).join("")}</div>`);
  },
  prvoposle(rec) {
    const d = rec.data, n = d.three ? 3 : 2, items = (d.items || []).slice(0, n);
    while (items.length < n) items.push({ pic: "", text: "" });
    const colors = ["#16a34a", "#2563eb", "#7c3aed"];
    const labels = d.labels || ["PRVO", "POSLE", "ONDA"];
    const pic = n === 3 ? 120 : 170;
    return sheet(head(rec, "➡️") + `<div class="vpp" style="--pic:${pic}px;--txt:${n === 3 ? 28 : 38}px">${items.map((x, i) => `${i ? `<span class="arr">➜</span>` : ""}<div class="panel" style="border-color:${colors[i]}"><div class="lab" style="background:${colors[i]}">${esc(labels[i] || "")}</div><div class="body">${picHtml(x.pic)}<b>${esc(x.text)}</b></div></div>`).join("")}</div>`);
  },
  sekvenca(rec) {
    const d = rec.data, items = d.items || [], cols = colsOf(d, items.length);
    return sheet(head(rec, "🔢") + `<div class="vg" style="${sizes(d, cols)}">${items.map((x, i) => `<div class="vc"><span class="vnum">${i + 1}</span>${picHtml(x.pic)}<b>${esc(x.text)}</b></div>`).join("")}</div>`);
  },
  izbori(rec) {
    const d = rec.data, items = d.items || [], cols = colsOf(d, items.length);
    return sheet(head(rec, "🫴") + (d.question ? `<p class="vq">${esc(d.question)}</p>` : "") + `<div class="vg" style="${sizes(d, cols)}">${items.map(x => `<div class="vc">${picHtml(x.pic)}<b>${esc(x.text)}</b></div>`).join("")}</div>`);
  },
  komunikacija(rec) {
    const d = rec.data, items = d.items || [];
    const cols = Math.max(1, Math.min(items.length || 1, Number(d.cols) || { 3: 3, 2: 4, 1: 6 }[lvl(d)]));
    const used = [...new Set(items.map(x => x.cat).filter(c => COM_CATS[c]))];
    return sheet(head(rec, "💬") + `<div class="vg vcom" style="${sizes(d, cols)}">${items.map(x => `<div class="vc" style="background:${(COM_CATS[x.cat] || {}).color || "#fff"}">${picHtml(x.pic)}<b>${esc(x.text)}</b></div>`).join("")}</div>
      ${used.length ? `<div class="vlegend">${used.map(c => `<span><i style="background:${COM_CATS[c].color}"></i>${COM_CATS[c].label}</span>`).join("")}</div>` : ""}`);
  },
  emocije(rec) {
    const d = rec.data;
    if (d.mode === "skala" || d.mode === "semafor") {
      const scale = d.scale || (d.mode === "skala" ? EMO_SCALE5 : EMO_TRAFFIC);
      return sheet(head(rec, d.mode === "skala" ? "🌡️" : "🚦") + `<div class="vscale ${d.mode === "semafor" ? "big" : ""}">${scale.map(s => `
        <div class="row"><div class="n" style="background:${esc(s.color)}">${esc(s.n)}</div><div class="lbl" style="color:${esc(s.color)}">${esc(s.label)}</div><div><b>Kako izgleda</b>${esc(s.body)}</div><div><b>Šta mi pomaže</b>${esc(s.help)}</div></div>`).join("")}</div>`);
    }
    const items = d.items || [], cols = colsOf(d, items.length);
    return sheet(head(rec, "😊") + `<div class="vg" style="${sizes(d, cols)}">${items.map(x => `<div class="vc">${picHtml(x.pic)}<b>${esc(x.text)}</b></div>`).join("")}</div>`);
  },
  prelaz(rec) {
    const d = rec.data, m = Math.max(1, Math.min(10, Number(d.minutes) || 5));
    const from = d.from || {}, to = d.to || {};
    return sheet(head(rec, "⏳") + `<div class="vtr" style="--pic:110px;--txt:32px">
      <div class="vc">${picHtml(from.pic)}<b>${esc(from.text)}</b></div>
      <div class="big">⏳ Još ${m} ${m === 1 ? "minut" : m < 5 ? "minuta" : "minuta"}</div>
      <div class="vcount">${Array.from({ length: m }, (_, i) => `<span>${m - i}</span>`).join("")}</div>
      <small>Svaki minut skinite (ili precrtajte) po jedan broj.</small>
      <div class="big" style="font-size:36px">Sada je vreme za:</div>
      <div class="vc" style="border-color:#16a34a">${picHtml(to.pic)}<b>${esc(to.text)}</b></div></div>`);
  },
  prica(rec) {
    const d = rec.data, items = d.items || [];
    const st = `--pic:${lvl(d) === 1 ? 110 : 150}px;--txt:${lvl(d) === 1 ? 26 : 32}px`;
    const pages = [`<div class="pg cover">${picHtml(items[0] ? items[0].pic : "e:📖")}<h2>${esc(rec.title)}</h2>${d.child ? `<p>${esc(d.child)}</p>` : ""}</div>`]
      .concat(items.map((x, i) => `<div class="pg">${picHtml(x.pic)}<p>${esc(x.text)}</p><span class="no">${i + 1}</span></div>`));
    const out = [];
    for (let i = 0; i < pages.length; i += 2) out.push(sheet(`<div class="vstory" style="${st}">${pages[i]}${pages[i + 1] || ""}</div>`));
    return out.join("");
  },
  skripta(rec) {
    const d = rec.data, items = d.items || [];
    return sheet(head(rec, "🗨️") + `<div class="vlist bubble" style="--pic:${lvl(d) === 3 ? 80 : 56}px;--txt:${lvl(d) === 3 ? 28 : 23}px">${items.map((x, i) => `<div class="li"><span class="no">${i + 1}</span>${picHtml(x.pic)}<b>${esc(x.text)}</b></div>`).join("")}</div>`);
  },
  pravila(rec) {
    const d = rec.data, items = d.items || [];
    return sheet(head(rec, "✋") + `<div class="vlist rules" style="--pic:${lvl(d) === 3 ? 72 : 52}px;--txt:${lvl(d) === 3 ? 30 : 24}px">${items.map(x => `<div class="li">${picHtml(x.pic)}<b>${esc(x.text)}</b></div>`).join("")}</div>`);
  },
  tokeni(rec) {
    const d = rec.data, n = Math.max(1, Math.min(10, Number(d.count) || 5));
    const slot = n <= 3 ? 170 : n <= 5 ? 122 : 92;
    const goal = d.goal || {}, rew = d.reward || {};
    return sheet(head(rec, "⭐") + `<div class="vtok" style="--slot:${slot}px;--pic:120px;--txt:30px">
      <div class="top"><div class="vc"><span class="lab">Kada</span>${picHtml(goal.pic)}<b>${esc(goal.text)}</b></div>
      <div class="vc" style="border-color:#f59e0b;background:#fffbeb"><span class="lab">Radim za</span>${picHtml(rew.pic)}<b>${esc(rew.text)}</b></div></div>
      <div class="vslots">${Array.from({ length: n }, () => "<span></span>").join("")}</div>
      <p class="vtr" style="margin:0"><small>Žetoni za izrezivanje:</small></p>
      <div class="vtokens">${Array.from({ length: n }, () => `<span>${esc(d.token || "⭐")}</span>`).join("")}</div></div>`);
  },
  kartice(rec) {
    const d = rec.data, items = d.items || [], cols = colsOf(d, items.length);
    return sheet(head(rec, "🆘") + `<div class="vg" style="${sizes(d, cols)}">${items.map(x => `<div class="vc cut" style="min-height:${cols <= 2 ? 300 : cols === 3 ? 220 : 170}px">${picHtml(x.pic)}<b>${esc(x.text)}</b></div>`).join("")}</div><p class="vtr" style="margin:14px 0 0"><small>✂ Izrežite po isprekidanim linijama i plastificirajte. Dete nosi kartice uz sebe.</small></p>`);
  },
  senzorni(rec) {
    const d = rec.data, nd = Number(d.days) === 7 ? 7 : 5;
    const dayColors = ["#ea580c", "#0d9488", "#ca8a04", "#2563eb", "#16a34a", "#db2777", "#7c3aed"];
    const cells = d.cells || [];
    return sheet(head(rec, "🌀") + `<table class="vsen" style="--pic:${nd === 7 ? 46 : 58}px"><thead><tr><th style="background:transparent;width:150px"></th>${DAYS.slice(0, nd).map((x, i) => `<th style="background:${dayColors[i]}">${x}</th>`).join("")}</tr></thead>
      <tbody>${SENSORY_ROWS.map((r, ri) => `<tr><td class="rh" style="background:${r.color}"><b>${r.title}</b><br><small>${r.sub}</small></td>${DAYS.slice(0, nd).map((_, di) => { const c = (cells[ri] || [])[di] || {}; return `<td style="background:${r.color}55">${picHtml(c.pic)}<b>${esc(c.text || "")}</b></td>`; }).join("")}</tr>`).join("")}</tbody></table>`, "");
  },
  pasos(rec) {
    const d = rec.data, s = d.s || {};
    const ln = (t, cls = "") => t ? `<div class="vline ${cls}">${esc(t).replace(/\n/g, "<br>")}</div>` : `<div class="vline"></div><div class="vline"></div>`;
    return sheet(`<header class="vh"><span class="vh-ico">${picHtml("e:🧠")}</span><div><h1>Senzorni pasoš</h1><p>Šta mi smeta, šta mi pomaže i kako da mi pomognete</p></div></header>
      <div class="vpass">
        <div class="idrow"><div>
          <div class="vline"><label>Ime:</label>${esc(d.child || "")}</div>
          <div class="vline"><label>Prezime:</label></div>
          <div class="vline"><label>Datum rođenja:</label></div>
          <div class="vline"><label>Hitni kontakt:</label></div>
        </div><div class="photo">Ovde zalepite<br>moju fotografiju</div></div>
        <div><span class="vban" style="background:#ea580c">👤 Ukratko o meni <small>šta volim, šta me motiviše, kako najbolje komuniciram</small></span>${ln(d.about)}</div>
        ${PASS_SECTIONS.map(p => { const v = s[p.id] || {}; return `<div><span class="vban" style="background:${p.color}">${p.icon} ${p.title} <small>(${p.sub})</small></span>
          <div class="vtwo"><div class="vline"><label>Smeta mi:</label>${esc(v.a || "")}</div><div class="vline"><label>Pomaže mi:</label>${esc(v.b || "")}</div></div></div>`; }).join("")}
        <div><span class="vban" style="background:#dc2626">⚠️ Kako reagujem na preopterećenje? <small>kako da prepoznate da mi je teško</small></span>${ln(d.overload)}</div>
        <div><span class="vban" style="background:#16a34a">✔ Šta možete da uradite da mi pomognete?</span>${[0, 1, 2].map(i => `<div class="vline"><label>${i + 1}.</label>${esc((d.help || [])[i] || "")}</div>`).join("")}</div>
        <div><span class="vban" style="background:#ea580c">🎒 Moja oprema <small>uvek nosim sa sobom</small></span>
          <div class="vgear">${PASS_GEAR.map(g => `<span class="${(d.gear || []).includes(g) ? "on" : ""}">${esc(g)}</span>`).join("")}${d.gear_other ? `<span class="on">${esc(d.gear_other)}</span>` : ""}</div></div>
      </div>`);
  },
  lowarousal(rec) {
    const d = rec.data, rows = d.rows && d.rows.length ? d.rows : [{}];
    const list = t => { const a = lines(t); return a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<div class="empty"></div><div class="empty"></div><div class="empty"></div>`; };
    const steps = t => { const a = lines(t); return a.length ? `<ol>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : `<ol>${[1, 2, 3, 4].map(() => `<li><div class="empty"></div></li>`).join("")}</ol>`; };
    return sheet(`<header class="vh"><span class="vh-ico">${picHtml("e:🌿")}</span><div><h1>${esc(rec.title || "Low arousal plan")}</h1><p>Smireno. Razumem. Pomažem.${d.child ? " · " + esc(d.child) : ""}</p></div></header>
      <table class="vla"><thead><tr><th style="background:#334155;width:92px">Dete</th>${LA_COLS.map(c => `<th style="background:${c.color}">${c.icon} ${c.title}<small>${c.sub}</small></th>`).join("")}</tr></thead>
      <tbody>${rows.map(r => `<tr><td class="nm">${esc(r.name || "")}</td>${LA_COLS.map(c => `<td>${c.id === "koraci" ? steps(r[c.id]) : list(r[c.id])}</td>`).join("")}</tr>`).join("")}</tbody></table>
      <p class="vla-note">💛 Svako dete je jedinstveno. Naš cilj je razumevanje, smirenost i podrška.</p>`);
  },
};

const LANDSCAPE = ["senzorni", "lowarousal"];

export function renderDoc(rec) {
  const d = rec.data || {};
  const fn = R[rec.kind];
  if (!fn) return "";
  return `<div class="vdoc lv${lvl(d)} k-${rec.kind} ${LANDSCAPE.includes(rec.kind) ? "land" : ""}">${fn(rec)}</div>`;
}

export function guideDoc() {
  return `<div class="vdoc">${sheet(`<header class="vh"><span class="vh-ico">${picHtml("e:🧩")}</span><div><h1>Vizuelna podrška deci sa PSA</h1><p>Razumevanje · predvidivost · sigurnost · samostalnost</p></div></header>
    <div class="vguide">${GUIDE.map(([i, t, p]) => `<div class="g">${picHtml("e:" + i)}<div><b>${esc(t)}</b><p>${esc(p)}</p></div></div>`).join("")}</div>
    <div class="vlvls">${[3, 2, 1].map(n => `<div style="border-color:${LEVELS[n].color}"><b style="color:${LEVELS[n].color}">${esc(LEVELS[n].long)}</b><ul>${LEVELS[n].tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`).join("")}</div>
    <b style="font-size:16px">Kako koristiti vizuelne podrške?</b><ol class="vhow">${HOW_TO.map(t => `<li>${esc(t)}</li>`).join("")}</ol>`)}</div>`;
}

export function printDoc(html, title, landscape) {
  const w = window.open("", "_blank");
  if (!w) return toast("Dozvolite iskačuće prozore da bi se otvorila štampa.", "error");
  w.document.write(`<!doctype html><html lang="sr"><head><meta charset="utf-8"><title>${esc(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
    <style>@page{size:A4 ${landscape ? "landscape" : "portrait"};margin:0}html,body{margin:0;background:#e5e7eb}*{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box}
    .bar{position:sticky;top:0;background:#1e3a8a;color:#fff;padding:10px 16px;font:14px system-ui;display:flex;gap:12px;align-items:center;justify-content:center;z-index:5}
    .bar button{font:inherit;font-weight:700;padding:8px 18px;border-radius:8px;border:0;cursor:pointer}
    .wrap{display:flex;flex-direction:column;align-items:center;padding:20px 0}
    .vsheet{box-shadow:0 2px 10px rgba(0,0,0,.15)}
    @media print{.bar{display:none}.wrap{padding:0}html,body{background:#fff}.vsheet{box-shadow:none;margin:0!important;page-break-after:always;break-after:page}.vsheet:last-child{page-break-after:auto}}
    ${VCSS}</style></head><body><div class="bar">A4 ${landscape ? "položeno" : "uspravno"} · uključite „Pozadinske grafike“ u podešavanjima štampe <button onclick="print()">Štampaj / PDF</button></div><div class="wrap">${html}</div></body></html>`);
  w.document.close();
}

/* ================================================================ novi materijal */

export function buildData(kind, presetIdx, level, child, rows) {
  const pre = (PRESETS[kind] || [])[presetIdx] || (PRESETS[kind] || [])[0] || { title: kindOf(kind).title, data: {} };
  const d = clone(pre.data);
  d.level = level; d.child = child || "";
  if (Array.isArray(d.items) && level === 3 && d.items.some(x => x.core)) d.items = d.items.filter(x => x.core);
  if (Array.isArray(d.items)) d.items.forEach(x => delete x.core);
  if (kind === "raspored" && level === 3) { d.showTime = false; d.orientation = "v"; d.check = false; }
  if (kind === "raspored" && level === 1) d.showTime = true;
  if (kind === "senzorni") d.cells = SENSORY_ROWS.map((r, ri) => DAYS.map((_, di) => { const [e, t] = r.ideas[(di + ri) % r.ideas.length]; return { pic: "e:" + e, text: t }; }));
  if (kind === "pasos") Object.assign(d, { about: "", s: {}, overload: "", help: ["", "", ""], gear: PASS_GEAR.slice(0, 4), gear_other: "" });
  if (kind === "lowarousal") d.rows = rows && rows.length ? rows.map(n => ({ name: n })) : [{ name: child || "" }];
  if (kind === "tokeni" && !d.count) d.count = level === 3 ? 3 : level === 2 ? 5 : 10;
  return { title: pre.title, data: d };
}

export function newModal(kind, families, za) {
  const k = kindOf(kind);
  const pres = PRESETS[kind] || [];
  const students = families.filter(f => !f.archived);
  const def = za ? students.find(f => f.id === za) : null;
  openModal(`
    <h2>${esc(k.icon)} ${esc(k.title)}</h2>
    <p class="modal-p">${esc(k.desc)}</p>
    <form id="vis-new-form" class="modal-form" data-kind="${kind}">
      ${pres.length > 1 ? `<div class="field"><label>Počni od</label><div class="vis-presets">${pres.map((p, i) => `<label class="radio-card"><input type="radio" name="preset" value="${i}" ${i === 0 ? "checked" : ""}><span><b>${esc(p.title)}</b></span></label>`).join("")}</div></div>` : `<input type="hidden" name="preset" value="0">`}
      <div class="field"><label>Nivo podrške</label>
        <div class="seg">${[3, 2, 1].map(n => `<label><input type="radio" name="level" value="${n}" ${n === 2 ? "checked" : ""}> ${LEVELS[n].title}</label>`).join("")}</div>
        <small class="muted">Nivo 3: manje kartica, veće slike, bez teksta · Nivo 1: više koraka, tekst i čeklista.</small></div>
      <div class="field"><label>Za koga</label>
        <select class="input" name="family"><option value="">Opšti materijal (bez deteta)</option>
          ${kind === "lowarousal" ? `<option value="__grupa">Cela grupa – svi učenici</option>` : ""}
          ${students.map(f => `<option value="${f.id}" ${def && def.id === f.id ? "selected" : ""}>${esc(f.name)}${f.kind === "ucenik" ? " · učenik" : ""}</option>`).join("")}
        </select></div>
      <div class="modal-actions"><button class="btn" type="submit">Napravi</button><button class="btn-link" type="button" data-close>Odustani</button></div>
    </form>`);
}

/* ================================================================ galerija */

export function galleryView(families) {
  const za = V.za ? families.find(f => f.id === V.za) : null;
  const list = V.list || [];
  const kids = [...new Map(list.filter(x => x.family_id).map(x => [x.family_id, x.family_name])).entries()];
  const shown = list.filter(x => V.filter === "sve" || (V.filter === "opste" ? !x.family_id : x.family_id === V.filter));
  return `
    <div class="page-head row-between">
      <div>
        <p class="eyebrow">Za decu sa PSA · nivo podrške 1, 2, 3</p>
        <h1>Vizuelna podrška</h1>
        <p class="lead">Rasporedi, prvo – posle, sekvence, table izbora i komunikacije, emocije, socijalne priče, senzorni pasoš i low arousal plan. Izaberite nivo podrške – kartice se same prilagode – pa štampajte na A4 ili podelite sa porodicom.</p>
      </div>
      <button class="btn-ghost" data-action="vis-guide">${ICON.print} Vodič za roditelje i nastavnike</button>
    </div>
    ${za ? `<div class="notice">${ICON.info} Pravite materijal za: <b>${esc(za.name)}</b>. <button class="btn-link" data-action="vis-za-clear">Opšti materijal</button></div>` : ""}
    <div class="vis-levels">${[3, 2, 1].map(n => `<details class="vis-level" style="--c:${LEVELS[n].color}"><summary><b>${esc(LEVELS[n].long)}</b></summary><ul>${LEVELS[n].tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></details>`).join("")}</div>
    <div class="vis-tools">${KINDS.map(k => `
      <button class="vis-tool" data-action="vis-new" data-kind="${k.id}">
        <span class="vis-ico">${esc(k.icon)}</span>
        <span><b>${esc(k.title)}</b><small>${esc(k.desc)}</small></span>
      </button>`).join("")}</div>
    <h2 class="section-title" style="margin:34px 0 12px">Moji materijali</h2>
    ${list.length ? `
      <div class="chips" style="margin-bottom:12px"><button class="chip ${V.filter === "sve" ? "active" : ""}" data-action="vis-filter" data-f="sve">Svi (${list.length})</button>
        <button class="chip ${V.filter === "opste" ? "active" : ""}" data-action="vis-filter" data-f="opste">Opšti</button>
        ${kids.map(([id, n]) => `<button class="chip ${V.filter === id ? "active" : ""}" data-action="vis-filter" data-f="${id}">${esc(n || "Dete")}</button>`).join("")}</div>
      <div class="vis-list">${shown.map(itemRow).join("")}</div>`
    : `<div class="empty-notes"><h3>Još nema materijala.</h3><p>Izaberite alat iznad – svaki počinje od gotovog predloška koji samo prilagodite.</p></div>`}`;
}

export function itemRow(x) {
  const k = kindOf(x.kind) || { icon: "🧩", title: x.kind };
  return `<a class="vis-row" href="#/admin/vizuelno/${x.id}"><span class="vis-ico sm">${esc(k.icon)}</span>
    <span class="grow"><b>${esc(x.title)}</b><small class="muted">${esc(k.title)}${x.family_name ? " · " + esc(x.family_name) : ""} · nivo ${esc((x.data && x.data.level) || 2)} · ${fmtDate(String(x.updated_at).slice(0, 10))}</small></span>
    ${x.shared ? `<span class="badge-kind">vidi porodica</span>` : ""}<span class="arrow">→</span></a>`;
}

/* ================================================================ uređivač */

const inp = (k, v, ph = "", type = "text") => `<input class="input" data-k="${k}" type="${type}" value="${esc(v ?? "")}" placeholder="${esc(ph)}">`;
const area = (k, v, rows = 2, ph = "") => `<textarea class="input" data-k="${k}" rows="${rows}" placeholder="${esc(ph)}">${esc(v ?? "")}</textarea>`;
const chk = (k, v, label) => `<label class="check"><input type="checkbox" data-k="${k}" data-struct="1" ${v ? "checked" : ""}> ${label}</label>`;
const picBtn = (k, p) => `<button type="button" class="vis-picbtn" data-action="vis-pic" data-k="${k}" title="Izaberi sliku">${p ? picHtml(p) : "＋"}</button>`;

function itemsEditor(rec, opts = {}) {
  const d = rec.data, items = d.items || [], max = (kindOf(rec.kind) || {}).max || 12;
  return `
    <div class="vis-items">${items.map((x, i) => `
      <div class="vis-item">
        ${picBtn(`data.items.${i}.pic`, x.pic)}
        ${opts.textarea ? area(`data.items.${i}.text`, x.text, 2, "Rečenica") : inp(`data.items.${i}.text`, x.text, "Tekst")}
        ${opts.time ? `<input class="input vis-time" data-k="data.items.${i}.time" value="${esc(x.time || "")}" placeholder="8:00">` : ""}
        ${opts.cat ? `<select class="input vis-cat" data-k="data.items.${i}.cat">${Object.entries(COM_CATS).map(([c, v]) => `<option value="${c}" ${x.cat === c ? "selected" : ""}>${v.label}</option>`).join("")}</select>` : ""}
        <span class="vis-item-btns">
          <button type="button" class="icon-btn" data-action="vis-move" data-i="${i}" data-d="-1" title="Gore">↑</button>
          <button type="button" class="icon-btn" data-action="vis-move" data-i="${i}" data-d="1" title="Dole">↓</button>
          <button type="button" class="icon-btn danger" data-action="vis-del" data-i="${i}" title="Ukloni">${ICON.trash}</button>
        </span>
      </div>`).join("")}</div>
    ${items.length < max ? `<button type="button" class="btn-ghost" data-action="vis-add">${ICON.plus} Dodaj ${opts.textarea ? "stranu" : "karticu"}</button>` : `<p class="muted small">Najviše ${max} kartica.</p>`}`;
}

function colsField(d) {
  return `<div class="field"><label>Kartica u redu</label><select class="input" data-k="data.cols" data-struct="1"><option value="0">automatski (po nivou)</option>${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${Number(d.cols) === n ? "selected" : ""}>${n}</option>`).join("")}</select></div>`;
}

const EDIT = {
  raspored: (r, d) => `
    <div class="two"><div class="field"><label>Izgled</label><select class="input" data-k="data.orientation" data-struct="1"><option value="v" ${d.orientation !== "h" ? "selected" : ""}>Uspravna lista</option><option value="h" ${d.orientation === "h" ? "selected" : ""}>Traka (sleva nadesno)</option></select></div>
    <div class="field"><label>&nbsp;</label>${chk("data.showTime", d.showTime, "Prikaži vreme")}${chk("data.check", d.check, "Kvadratić za štikliranje")}</div></div>
    ${itemsEditor(r, { time: d.showTime })}`,
  prvoposle: (r, d) => `${chk("data.three", d.three, "Tri koraka (prvo – posle – onda)")}
    <div class="three">${[0, 1, 2].slice(0, d.three ? 3 : 2).map(i => `<div class="field"><label>Natpis ${i + 1}</label>${inp(`data.labels.${i}`, (d.labels || [])[i])}</div>`).join("")}</div>
    ${itemsEditor(r)}`,
  sekvenca: (r, d) => colsField(d) + itemsEditor(r),
  izbori: (r, d) => `<div class="two"><div class="field"><label>Pitanje</label>${inp("data.question", d.question, "Šta želiš?")}</div>${colsField(d)}</div>${itemsEditor(r)}`,
  komunikacija: (r, d) => colsField(d) + `<p class="muted small">Boja kartice po vrsti reči pomaže detetu da brže nađe simbol.</p>` + itemsEditor(r, { cat: true }),
  emocije: (r, d) => `<div class="field"><label>Prikaz</label><select class="input" data-k="data.mode" data-struct="1">
      <option value="kartice" ${d.mode === "kartice" ? "selected" : ""}>Kartice osećanja</option>
      <option value="semafor" ${d.mode === "semafor" ? "selected" : ""}>Semafor (3 nivoa) – nivo 2 i 3</option>
      <option value="skala" ${d.mode === "skala" ? "selected" : ""}>Skala 1–5 – nivo 1 i 2</option></select></div>
    ${d.mode === "kartice" ? colsField(d) + itemsEditor(r) : (d.scale || []).map((s, i) => `
      <div class="vis-scale-row"><span class="vis-n" style="background:${esc(s.color)}">${esc(s.n)}</span>
        <div class="grow">${inp(`data.scale.${i}.label`, s.label, "Naziv")}
        <div class="two tight">${area(`data.scale.${i}.body`, s.body, 2, "Kako izgleda")}${area(`data.scale.${i}.help`, s.help, 2, "Šta mi pomaže")}</div></div></div>`).join("")}`,
  prelaz: (r, d) => `<div class="field"><label>Koliko minuta pre prelaza</label><select class="input" data-k="data.minutes" data-struct="1">${[1, 2, 3, 5, 10].map(n => `<option ${Number(d.minutes) === n ? "selected" : ""}>${n}</option>`).join("")}</select></div>
    <div class="two"><div class="field"><label>Sada radimo</label><div class="vis-item">${picBtn("data.from.pic", (d.from || {}).pic)}${inp("data.from.text", (d.from || {}).text)}</div></div>
    <div class="field"><label>Sledeće je</label><div class="vis-item">${picBtn("data.to.pic", (d.to || {}).pic)}${inp("data.to.text", (d.to || {}).text)}</div></div></div>`,
  prica: (r) => `<p class="muted small">Pišite u prvom licu, kratko i pozitivno: opišite situaciju, šta drugi osećaju i šta dete može da uradi. Na 2–3 opisne rečenice dolazi jedna koja usmerava.</p>` + itemsEditor(r, { textarea: true }),
  skripta: (r) => itemsEditor(r),
  pravila: (r) => `<p class="muted small">Pravila pišite kao ono što RADIMO (ne „ne trči“, već „hodam“).</p>` + itemsEditor(r),
  tokeni: (r, d) => `<div class="two"><div class="field"><label>Broj žetona</label><select class="input" data-k="data.count" data-struct="1">${[3, 4, 5, 6, 8, 10].map(n => `<option ${Number(d.count) === n ? "selected" : ""}>${n}</option>`).join("")}</select></div>
    <div class="field"><label>Žeton</label><select class="input" data-k="data.token" data-struct="1">${["⭐", "😀", "❤️", "🚗", "🦖", "⚽", "🌈", "🚀"].map(e => `<option ${d.token === e ? "selected" : ""}>${e}</option>`).join("")}</select></div></div>
    <div class="two"><div class="field"><label>Kada (ponašanje / zadatak)</label><div class="vis-item">${picBtn("data.goal.pic", (d.goal || {}).pic)}${inp("data.goal.text", (d.goal || {}).text)}</div></div>
    <div class="field"><label>Radim za (nagrada)</label><div class="vis-item">${picBtn("data.reward.pic", (d.reward || {}).pic)}${inp("data.reward.text", (d.reward || {}).text)}</div></div></div>`,
  kartice: (r, d) => colsField(d) + itemsEditor(r),
  senzorni: (r, d) => `<div class="field"><label>Dani</label><select class="input" data-k="data.days" data-struct="1"><option value="5" ${Number(d.days) !== 7 ? "selected" : ""}>Ponedeljak – petak</option><option value="7" ${Number(d.days) === 7 ? "selected" : ""}>Cela nedelja</option></select></div>
    <div class="vis-sen">${SENSORY_ROWS.map((row, ri) => `<h4 style="background:${row.color}">${row.title} <small>${row.sub}</small></h4>
      <div class="vis-sen-row">${DAYS.slice(0, Number(d.days) === 7 ? 7 : 5).map((day, di) => { const c = ((d.cells || [])[ri] || [])[di] || {}; return `<div class="vis-sen-cell"><small>${day.slice(0, 3)}</small>${picBtn(`data.cells.${ri}.${di}.pic`, c.pic)}${inp(`data.cells.${ri}.${di}.text`, c.text)}</div>`; }).join("")}</div>`).join("")}</div>`,
  pasos: (r, d) => `
    <p class="muted small">Prezime, datum rođenja i hitni kontakt ostaju prazni na papiru – upisuju se rukom (ne čuvamo ih u aplikaciji).</p>
    <div class="field"><label>Ukratko o meni</label>${area("data.about", d.about, 3, "Šta volim, šta me motiviše, kako najbolje komuniciram")}</div>
    ${PASS_SECTIONS.map(p => `<div class="field"><label>${p.icon} ${p.title} <small>(${p.sub})</small></label><div class="two tight">${area(`data.s.${p.id}.a`, ((d.s || {})[p.id] || {}).a, 2, "Smeta mi")}${area(`data.s.${p.id}.b`, ((d.s || {})[p.id] || {}).b, 2, "Pomaže mi")}</div></div>`).join("")}
    <div class="field"><label>Kako reagujem na preopterećenje?</label>${area("data.overload", d.overload, 2, "Prekrivam uši, povlačim se, vičem…")}</div>
    <div class="field"><label>Šta možete da uradite da mi pomognete?</label>${[0, 1, 2].map(i => inp(`data.help.${i}`, (d.help || [])[i], `${i + 1}.`)).join("")}</div>
    <div class="field"><label>Moja oprema</label>${PASS_GEAR.map(g => `<label class="check"><input type="checkbox" data-gear value="${esc(g)}" ${(d.gear || []).includes(g) ? "checked" : ""}> ${esc(g)}</label>`).join("")}${inp("data.gear_other", d.gear_other, "Drugo")}</div>`,
  lowarousal: (r, d) => `
    <p class="muted small">Svaku stavku u novi red. Plan podrške: 4 koraka redom (npr. Ostanem smiren → Ponudim izbor → Usmerim na miran kutak → Dajem vreme).</p>
    ${(d.rows || []).map((row, i) => `
      <details class="vis-la" ${i === 0 ? "open" : ""}><summary><b>${esc(row.name || `Dete ${i + 1}`)}</b><button type="button" class="icon-btn danger" data-action="vis-la-del" data-i="${i}" title="Ukloni">${ICON.trash}</button></summary>
        <div class="field"><label>Ime</label>${inp(`data.rows.${i}.name`, row.name)}</div>
        <div class="two tight">${LA_COLS.map(c => `<div class="field"><label>${c.icon} ${c.title} <small>${c.sub}</small></label>${area(`data.rows.${i}.${c.id}`, row[c.id], 3)}</div>`).join("")}</div>
      </details>`).join("")}
    ${(d.rows || []).length < 8 ? `<button type="button" class="btn-ghost" data-action="vis-la-add">${ICON.plus} Dodaj dete</button>` : ""}`,
};

export function editorView(families) {
  const rec = V.cur, d = rec.data, k = kindOf(rec.kind);
  const fam = rec.family_id ? families.find(f => f.id === rec.family_id) : null;
  return `
    <div class="page-head row-between">
      <div><a class="btn-link" href="${fam ? `#/admin/p/${fam.id}` : "#/admin/vizuelno"}">← ${fam ? esc(fam.name) + " · Dosije" : "Vizuelna podrška"}</a>
        <p class="eyebrow" style="margin-top:12px">${esc(k.icon)} ${esc(k.title)} · ${esc(LEVELS[lvl(d)].long)}</p>
        <h1>${esc(rec.title)}</h1></div>
      <div class="row-gap">
        <button class="btn-ghost" data-action="vis-print">${ICON.print} Štampaj / PDF</button>
        <button class="btn" form="vis-form" type="submit">${V.saving ? "Čuvam…" : V.dirty ? "Sačuvaj *" : "Sačuvaj"}</button>
      </div>
    </div>
    <div class="vis-edit">
      <form id="vis-form" class="panel vis-form">
        <div class="field"><label>Naslov</label>${inp("title", rec.title)}</div>
        <div class="two">
          <div class="field"><label>Nivo podrške</label><select class="input" data-k="data.level" data-struct="1">${[3, 2, 1].map(n => `<option value="${n}" ${lvl(d) === n ? "selected" : ""}>${LEVELS[n].long}</option>`).join("")}</select></div>
          <div class="field"><label>Ime deteta na papiru</label>${inp("data.child", d.child, "npr. Tino")}</div>
        </div>
        ${fam ? `<label class="check vis-share"><input type="checkbox" data-k="shared" data-struct="1" ${rec.shared ? "checked" : ""}> Prikaži porodici u aplikaciji (mogu i sami da odštampaju)</label>` : ""}
        <hr class="vis-hr">
        ${EDIT[rec.kind](rec, d)}
        <div class="vis-foot">
          <button class="btn" type="submit">Sačuvaj</button>
          <button type="button" class="btn-ghost" data-action="vis-dup">Napravi kopiju</button>
          <button type="button" class="btn-link danger" data-action="vis-delete">${ICON.trash} Obriši</button>
        </div>
      </form>
      <div class="vis-preview-wrap">
        <div class="vis-preview-head"><b>Pregled (A4)</b><small class="muted">menja se dok kucate</small></div>
        <div class="vprev" id="vprev"><div class="vprev-inner" id="vprev-inner">${renderDoc(rec)}</div></div>
        <div class="vis-tips"><b>${esc(LEVELS[lvl(d)].long)}</b><ul>${LEVELS[lvl(d)].tips.slice(0, 4).map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>
      </div>
    </div>`;
}

export function fitPreviews(root = document) {
  root.querySelectorAll(".vprev").forEach(box => {
    const inner = box.firstElementChild;
    if (!inner) return;
    const doc = inner.querySelector(".vdoc");
    const w = doc && doc.classList.contains("land") ? 1123 : 794;
    const s = box.clientWidth / w;
    inner.style.width = w + "px";
    inner.style.transform = `scale(${s})`;
    box.style.height = Math.ceil(inner.scrollHeight * s) + "px";
  });
}
if (typeof window !== "undefined") window.addEventListener("resize", () => fitPreviews());

/* ---------------------------------------------------------------- čitanje forme */

function setPath(obj, path, val) {
  const p = path.split(".");
  let o = obj;
  for (let i = 0; i < p.length - 1; i++) {
    const k = /^\d+$/.test(p[i]) ? Number(p[i]) : p[i];
    if (o[k] == null) o[k] = /^\d+$/.test(p[i + 1]) ? [] : {};
    o = o[k];
  }
  o[/^\d+$/.test(p[p.length - 1]) ? Number(p[p.length - 1]) : p[p.length - 1]] = val;
}

export function syncForm() {
  const form = document.getElementById("vis-form");
  if (!form || !V.cur) return;
  form.querySelectorAll("input[data-k], select[data-k], textarea[data-k]").forEach(el => {
    let v = el.type === "checkbox" ? el.checked : el.value;
    if (["data.level", "data.cols", "data.count", "data.minutes", "data.days"].includes(el.dataset.k)) v = Number(v);
    setPath(V.cur, el.dataset.k, v);
  });
  const gear = form.querySelectorAll("[data-gear]");
  if (gear.length) V.cur.data.gear = [...gear].filter(x => x.checked).map(x => x.value);
}

function refreshPreview() {
  const inner = document.getElementById("vprev-inner");
  if (!inner) return;
  inner.innerHTML = renderDoc(V.cur);
  fitPreviews();
}

/* ---------------------------------------------------------------- izbor slike */

function pickerModal() {
  openModal(`
    <h2>Izaberite sliku</h2>
    <div class="vis-pick-top">
      <div class="search"><span>${ICON.search}</span><input id="vis-pick-search" placeholder="Pretraga: toalet, igra, ljut…"></div>
      <label class="btn-ghost file-btn">${ICON.upload} Fotografija<input type="file" id="vis-pick-file" accept="image/*" hidden></label>
      <button class="btn-link" data-action="vis-pick" data-v="">Bez slike</button>
    </div>
    <div class="vis-pick-grid">
      ${PICTO.map(c => `<h4>${esc(c.title)}</h4><div class="vis-pick-cat">${c.items.map(([e, t]) => `<button type="button" class="vis-pick" data-action="vis-pick" data-v="e:${e}" data-t="${esc(t)}" title="${esc(t)}"><span>${e}</span><small>${esc(t)}</small></button>`).join("")}</div>`).join("")}
    </div>
    <p class="muted small" style="margin-top:10px">Za decu kojoj su simboli apstraktni, najbolje rade fotografije stvarnih predmeta i mesta (npr. njihova šolja, njihova učionica).</p>`, "modal-wide");
  setTimeout(() => { const s = document.getElementById("vis-pick-search"); if (s) s.focus(); }, 50);
}

/* ================================================================ akcije (poziva ih admin.js) */

export async function loadList() {
  V.list = await api.visuals({});
}

function getPath(obj, path) { return path.split(".").reduce((o, k) => (o == null ? o : o[/^\d+$/.test(k) ? Number(k) : k]), obj); }

export async function save() {
  if (!V.cur) return;
  const rec = V.cur;
  V.saving = true;
  try {
    const r = await api.saveVisual({ id: rec.id, family_id: rec.family_id || null, kind: rec.kind, title: rec.title, data: rec.data, shared: Boolean(rec.shared) });
    rec.updated_at = r.updated_at;
    if (V.cur === rec) V.dirty = false;
    V.list = null;
  } finally { V.saving = false; }
}

export function onClick(t, rerender, families) {
  const a = t.dataset.action;
  if (!a || !a.startsWith("vis-")) return false;
  (async () => {
    try {
      switch (a) {
        case "vis-new": return newModal(t.dataset.kind, families, V.za);
        case "vis-za-clear": V.za = ""; return rerender();
        case "vis-filter": V.filter = t.dataset.f; return rerender();
        case "vis-guide": return printDoc(guideDoc(), "Vizuelna podrška – vodič", false);
        case "vis-print": syncForm(); return printDoc(renderDoc(V.cur), V.cur.title, LANDSCAPE.includes(V.cur.kind));
        case "vis-pic": syncForm(); V.pickPath = t.dataset.k; return pickerModal();
        case "vis-pick": setPath(V.cur, V.pickPath, t.dataset.v); V.dirty = true; closeModal(); return rerender();
        case "vis-add": syncForm(); V.cur.data.items.push({ pic: "", text: "" }); V.dirty = true; return rerender();
        case "vis-del": syncForm(); V.cur.data.items.splice(Number(t.dataset.i), 1); V.dirty = true; return rerender();
        case "vis-move": {
          syncForm();
          const l = V.cur.data.items, i = Number(t.dataset.i), j = i + Number(t.dataset.d);
          if (j < 0 || j >= l.length) return;
          [l[i], l[j]] = [l[j], l[i]]; V.dirty = true; return rerender();
        }
        case "vis-la-add": syncForm(); V.cur.data.rows.push({ name: "" }); V.dirty = true; return rerender();
        case "vis-la-del": syncForm(); V.cur.data.rows.splice(Number(t.dataset.i), 1); V.dirty = true; return rerender();
        case "vis-dup": {
          syncForm();
          const r = await api.saveVisual({ family_id: V.cur.family_id || null, kind: V.cur.kind, title: V.cur.title + " (kopija)", data: V.cur.data, shared: false });
          V.list = null; toast("Kopija je napravljena.");
          location.hash = `#/admin/vizuelno/${r.id}`;
          return;
        }
        case "vis-delete": {
          if (!confirm("Obrisati ovaj materijal?")) return;
          const fid = V.cur.family_id;
          await api.deleteVisual(V.cur.id);
          V.cur = null; V.dirty = false; V.list = null;
          toast("Obrisano.");
          location.hash = fid ? `#/admin/p/${fid}` : "#/admin/vizuelno";
          return;
        }
      }
    } catch (err) { toast(err.message || "Greška.", "error"); }
  })();
  return true;
}

export function onInput(e) {
  if (e.target.id === "vis-pick-search") {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".vis-pick").forEach(b => { b.hidden = q && !b.dataset.t.includes(q); });
    document.querySelectorAll(".vis-pick-cat").forEach(c => { const any = [...c.children].some(b => !b.hidden); c.hidden = !any; c.previousElementSibling.hidden = !any; });
    return true;
  }
  if (e.target.closest && e.target.closest("#vis-form")) {
    syncForm(); V.dirty = true; refreshPreview();
    return true;
  }
  return false;
}

export async function onChange(e, rerender) {
  if (e.target.id === "vis-pick-file" && e.target.files[0]) {
    try {
      const c = await compressImage(e.target.files[0], 420, 0.8);
      setPath(V.cur, V.pickPath, c.dataUrl); V.dirty = true;
      closeModal(); rerender();
    } catch { toast("Ova slika ne može da se otvori.", "error"); }
    return true;
  }
  if (e.target.closest && e.target.closest("#vis-form")) {
    syncForm(); V.dirty = true;
    if (e.target.dataset.struct || e.target.dataset.gear !== undefined) {
      if (e.target.dataset.k === "data.mode") {
        const m = V.cur.data.mode;
        if (m === "skala") V.cur.data.scale = clone(EMO_SCALE5);
        if (m === "semafor") V.cur.data.scale = clone(EMO_TRAFFIC);
        if (m === "kartice" && !(V.cur.data.items || []).length) V.cur.data.items = clone(PRESETS.emocije[0].data.items).map(x => (delete x.core, x));
      }
      if (e.target.dataset.k === "data.three" && V.cur.data.three && (V.cur.data.items || []).length < 3) V.cur.data.items.push({ pic: "", text: "" });
      if (e.target.dataset.k === "data.days" && Number(V.cur.data.days) === 7) {
        V.cur.data.cells = SENSORY_ROWS.map((r, ri) => DAYS.map((_, di) => ((V.cur.data.cells || [])[ri] || [])[di] || (([em, tx]) => ({ pic: "e:" + em, text: tx }))(r.ideas[(di + ri) % r.ideas.length])));
      }
      rerender();
    } else refreshPreview();
    return true;
  }
  return false;
}

export async function onSubmit(form, data, families) {
  if (form.id === "vis-new-form") {
    const kind = form.dataset.kind;
    const level = Number(data.level) || 2;
    let family_id = data.family || null, child = "", rows = null;
    if (family_id === "__grupa") {
      rows = families.filter(f => !f.archived && f.kind === "ucenik").map(f => f.children || f.name).slice(0, 8);
      family_id = null; child = "";
    } else if (family_id) {
      const f = families.find(x => x.id === family_id);
      child = f ? (f.children || f.name) : "";
    }
    const { title, data: d } = buildData(kind, Number(data.preset) || 0, level, child, rows);
    const r = await api.saveVisual({ family_id, kind, title: rows ? title + " – grupa" : title, data: d, shared: false });
    closeModal();
    V.list = null;
    location.hash = `#/admin/vizuelno/${r.id}`;
    return true;
  }
  if (form.id === "vis-form") {
    syncForm();
    await save();
    toast("Sačuvano.");
    return "rerender";
  }
  return false;
}

/* ================================================================ za porodicu */

export function familyPage(visuals) {
  if (!visuals || !visuals.length) return `<div class="empty-notes"><h3>Još nema vizuelne podrške.</h3><p>Kada vam stručnjak pošalje raspored, kartice ili priču, pojaviće se ovde.</p></div>`;
  return `
    <div class="page-head"><p class="eyebrow">Za kod kuće</p><h1>Vizuelna podrška</h1>
      <p class="lead">Rasporedi, kartice i priče koje je pripremio vaš stručnjak. Odštampajte ih i stavite na vidljivo mesto, u visini očiju deteta.</p></div>
    <div class="vis-fam">${visuals.map((x, i) => `
      <div class="panel vis-fam-card">
        <div class="row-between"><div><p class="eyebrow">${esc((kindOf(x.kind) || {}).title || "")}</p><h3>${esc(x.title)}</h3></div>
          <button class="btn-ghost" data-action="vis-fam-print" data-i="${i}">${ICON.print} Štampaj</button></div>
        <div class="vprev"><div class="vprev-inner">${renderDoc(x)}</div></div>
      </div>`).join("")}</div>`;
}

export function familyPrint(visuals, i) {
  const x = visuals[i];
  if (x) printDoc(renderDoc(x), x.title, LANDSCAPE.includes(x.kind));
}
