/* Prikaz biblioteke aktivnosti i šablona (deo za stručnjaka). */

import { LIBRARY, LIB_AREAS, TEMPLATES, libById } from "./library.js";
import { esc, ICON, openModal, artAt, bgAt } from "./util.js";

export const L = { area: "sve", search: "", pick: [] };

const areaOf = a => LIB_AREAS.find(x => x.id === a.area);
const areaIdx = a => LIB_AREAS.findIndex(x => x.id === a.area);

function matches(a) {
  const q = L.search.trim().toLowerCase();
  if (!q) return L.area === "sve" || a.area === L.area;   // pretraga ide kroz celu biblioteku
  return [a.title, a.goal, a.develops, areaOf(a).title].join(" ").toLowerCase().includes(q);
}

export function cards(pickMode) {
  const list = LIBRARY.filter(matches);
  if (!list.length) return `<p class="muted">Nema aktivnosti za ovu pretragu.</p>`;
  return list.map(a => {
    const i = areaIdx(a);
    const picked = L.pick.includes(a.id);
    return `
      <div class="lib-card ${picked ? "picked" : ""}">
        <button class="lib-art ${bgAt(i)}" data-action="lib-open" data-id="${a.id}">${artAt(i)}</button>
        <div class="lib-body">
          <p class="eyebrow">${esc(areaOf(a).title)} · ${esc(a.age)}</p>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.goal)}</p>
          <div class="lib-actions">
            <button class="btn-link" data-action="lib-open" data-id="${a.id}">Pogledaj korake →</button>
            ${pickMode ? `<button class="lib-pick ${picked ? "on" : ""}" data-action="lib-toggle" data-id="${a.id}">${picked ? `✓ Izabrano${L.pick.length > 1 ? ` (${L.pick.indexOf(a.id) + 1}.)` : ""}` : "+ Izaberi"}</button>` : ""}
          </div>
        </div>
      </div>`;
  }).join("");
}

export function libraryView(family) {
  const pickMode = Boolean(family);
  return `
    <div class="page-head">
      ${pickMode ? `<a class="btn-link" href="#/admin/p/${family.id}/novi">← Novi program za: ${esc(family.name)}</a>` : `<p class="eyebrow">Korak po korak</p>`}
      <h1 ${pickMode ? 'style="margin-top:12px"' : ""}>Biblioteka aktivnosti</h1>
      <p class="lead">${LIBRARY.length} gotovih igara u ${LIB_AREAS.length} oblasti – sa ciljem, materijalom, koracima, lakšom i težom varijantom i onim što roditelj prati. ${pickMode ? "Izaberite aktivnosti redom kojim želite da ih porodica radi, pa napravite program." : "Program od njih pravite iz porodice: Novi program → Iz biblioteke ili Šablon."}</p>
    </div>
    <div class="lib-filter">
      <div class="search"><span>${ICON.search}</span><input id="lib-search" placeholder="Pronađi aktivnost…" value="${esc(L.search)}"></div>
      <div class="chip-row chips-scroll">
        <button class="chip ${L.area === "sve" ? "active" : ""}" data-action="lib-area" data-a="sve">Sve</button>
        ${LIB_AREAS.map(a => `<button class="chip ${L.area === a.id ? "active" : ""}" data-action="lib-area" data-a="${a.id}">${esc(a.title)}</button>`).join("")}
      </div>
    </div>
    <div class="lib-grid" id="lib-grid">${cards(pickMode)}</div>
    ${pickMode ? `
      <div class="lib-bar ${L.pick.length ? "show" : ""}">
        <span><b>${L.pick.length}</b> ${L.pick.length === 1 ? "aktivnost izabrana" : "aktivnosti izabrano"} · raspoređuju se u 4 nedelje redom kojim ste ih izabrali</span>
        ${L.pick.length ? `<button class="btn-link" data-action="lib-clear">Poništi</button>` : ""}
        <button class="btn" data-action="lib-create" ${L.pick.length ? "" : "disabled"}>Napravi program</button>
      </div>` : ""}`;
}

export function openLibActivity(id, pickMode) {
  const a = libById(id);
  if (!a) return;
  const picked = L.pick.includes(a.id);
  openModal(`
    <p class="eyebrow">${esc(areaOf(a).title)} · ${esc(a.age)} · ${esc(a.time)}</p>
    <h2>${esc(a.title)}</h2>
    <p class="modal-p"><b>Cilj:</b> ${esc(a.goal)}</p>
    <h4>Materijal</h4><ul>${a.materials.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
    <h4>Koraci</h4><ol class="lib-steps">${a.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
    <h4>Nivoi</h4>${a.levels.map(l => `<p class="modal-p"><b>${esc(l.name)}:</b> ${esc(l.text)}</p>`).join("")}
    <h4>Roditelj prati</h4><ul>${a.tracks.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    <p class="modal-p muted"><b>Razvija:</b> ${esc(a.develops)}</p>
    ${a.note ? `<div class="note-box">${esc(a.note)}</div>` : ""}
    ${pickMode ? `<div class="modal-actions"><button class="btn" data-action="lib-toggle" data-id="${a.id}" data-close-after="1">${picked ? "Ukloni iz izbora" : "+ Izaberi za program"}</button></div>` : ""}`);
}

export function templatesBlock() {
  return `
    <h2 class="section-title" style="margin-top:34px">Brzi početak</h2>
    <p class="muted" style="margin:6px 0 14px">Gotov četvoronedeljni program od aktivnosti iz biblioteke. Posle ga možete menjati kao i svaki drugi.</p>
    <div class="tpl-grid">
      ${TEMPLATES.map((t, i) => `
        <div class="tpl-card">
          <span class="tpl-num ${bgAt(i)}">${artAt(i)}</span>
          <h3>${esc(t.title)}</h3>
          <p class="muted">${esc(t.subtitle)}</p>
          <ol>${t.weeks.map(w => `<li><b>${esc(w.title)}</b> – ${w.ids.map(id => esc((libById(id) || {}).title || "")).join(", ")}</li>`).join("")}</ol>
          <button class="btn" data-action="use-template" data-t="${t.id}">Koristi ovaj šablon</button>
        </div>`).join("")}
    </div>`;
}

/* lista sa kvadratićima za dodavanje u postojeći program (editor) */
export function addListHtml(existingLibIds) {
  return `
    <h2>Dodaj iz biblioteke</h2>
    <p class="modal-p">Štiklirajte aktivnosti koje želite da dodate u ovaj program.</p>
    <div class="lib-addlist">
      ${LIB_AREAS.map(ar => `
        <h4>${esc(ar.title)}</h4>
        ${LIBRARY.filter(a => a.area === ar.id).map(a => `
          <label class="check"><input type="checkbox" name="lib" value="${a.id}" ${existingLibIds.includes(a.id) ? "disabled" : ""}> ${esc(a.title)} ${existingLibIds.includes(a.id) ? `<small class="muted">(već u programu)</small>` : ""}</label>`).join("")}`).join("")}
    </div>
    <div class="modal-actions"><button class="btn" data-ed="lib-add-confirm">Dodaj izabrane</button></div>`;
}
