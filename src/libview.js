/* Prikaz biblioteke aktivnosti, mojih aktivnosti i šablona (deo za stručnjaka). */

import { LIBRARY, LIB_AREAS, TEMPLATES, CUSTOM, libById, areaInfo, allActivities } from "./library.js";
import { esc, ICON, openModal, artAt, bgAt } from "./util.js";

export const L = { area: "sve", search: "", pick: [], tab: "sve", draftPhoto: null, draftArt: null };

const areaIdx = a => { const i = LIB_AREAS.findIndex(x => x.id === a.area); return i < 0 ? 5 : i; };
const artIdx = a => (a.mine ? a.art : areaIdx(a));

function matches(a) {
  if (L.tab === "moje" && !a.mine) return false;
  const q = L.search.trim().toLowerCase();
  if (!q) return L.area === "sve" || a.area === L.area;   // pretraga ide kroz celu biblioteku
  return [a.title, a.goal, a.develops, areaInfo(a.area).title].join(" ").toLowerCase().includes(q);
}

const artBox = (a, cls, attrs = "") => a.photo
  ? `<button class="${cls} photo" ${attrs}><img src="${a.photo}" alt=""></button>`
  : `<button class="${cls} ${bgAt(artIdx(a))}" ${attrs}>${artAt(artIdx(a))}</button>`;

export function cards(pickMode) {
  const list = allActivities().filter(matches);
  if (!list.length) return L.tab === "moje" && !L.search
    ? `<div class="empty-notes"><h3>Još nemate svoje aktivnosti.</h3><p>Kliknite „Nova aktivnost“ i opišite igru koju koristite u radu – posle je ubacujete u programe kao i ostale.</p></div>`
    : `<p class="muted">Nema aktivnosti za ovu pretragu.</p>`;
  return list.map(a => {
    const picked = L.pick.includes(a.id);
    return `
      <div class="lib-card ${picked ? "picked" : ""} ${a.mine ? "mine" : ""}">
        ${artBox(a, "lib-art", `data-action="lib-open" data-id="${a.id}"`)}
        <div class="lib-body">
          <p class="eyebrow">${a.mine ? `<span class="mine-tag">moja</span> ` : ""}${esc(areaInfo(a.area).title)}${a.age ? " · " + esc(a.age) : ""}</p>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.goal)}</p>
          <div class="lib-actions">
            <button class="btn-link" data-action="lib-open" data-id="${a.id}">Pogledaj korake →</button>
            ${pickMode ? `<button class="lib-pick ${picked ? "on" : ""}" data-action="lib-toggle" data-id="${a.id}">${picked ? `✓ Izabrano${L.pick.length > 1 ? ` (${L.pick.indexOf(a.id) + 1}.)` : ""}` : "+ Izaberi"}</button>`
              : a.mine ? `<a class="btn-link" href="#/admin/biblioteka/moja/${a.dbId}">Uredi</a>` : ""}
          </div>
        </div>
      </div>`;
  }).join("");
}

export function libraryView(family) {
  const pickMode = Boolean(family);
  const mine = CUSTOM.length;
  return `
    <div class="page-head row-between">
      <div>
        ${pickMode ? `<a class="btn-link" href="#/admin/p/${family.id}/novi">← Novi program za: ${esc(family.name)}</a>` : `<p class="eyebrow">Korak po korak</p>`}
        <h1 ${pickMode ? 'style="margin-top:12px"' : ""}>Biblioteka aktivnosti</h1>
        <p class="lead">${LIBRARY.length} gotovih igara u ${LIB_AREAS.length} oblasti${mine ? ` i ${mine} ${mine === 1 ? "vaša aktivnost" : "vaših aktivnosti"}` : ""} – sa ciljem, materijalom, koracima, lakšom i težom varijantom. ${pickMode ? "Izaberite aktivnosti redom kojim želite da ih porodica radi, pa napravite program." : "Program od njih pravite iz porodice: Novi program → Složi iz biblioteke ili Šablon."}</p>
      </div>
      ${pickMode ? "" : `<a class="btn" href="#/admin/biblioteka/nova">${ICON.plus} Nova aktivnost</a>`}
    </div>
    <div class="chips tabs">
      <button class="chip ${L.tab === "sve" ? "active" : ""}" data-action="lib-tab" data-t="sve">Sve aktivnosti</button>
      <button class="chip ${L.tab === "moje" ? "active" : ""}" data-action="lib-tab" data-t="moje">Moje aktivnosti (${mine})</button>
    </div>
    <div class="lib-filter">
      <div class="search"><span>${ICON.search}</span><input id="lib-search" placeholder="Pronađi aktivnost…" value="${esc(L.search)}"></div>
      ${L.tab === "sve" ? `<div class="chip-row chips-scroll">
        <button class="chip ${L.area === "sve" ? "active" : ""}" data-action="lib-area" data-a="sve">Sve oblasti</button>
        ${LIB_AREAS.map(a => `<button class="chip ${L.area === a.id ? "active" : ""}" data-action="lib-area" data-a="${a.id}">${esc(a.title)}</button>`).join("")}
      </div>` : ""}
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
    ${a.photo ? `<img class="lib-modal-photo" src="${a.photo}" alt="">` : ""}
    <p class="eyebrow">${esc(areaInfo(a.area).title)}${a.age ? " · " + esc(a.age) : ""}${a.time ? " · " + esc(a.time) : ""}</p>
    <h2>${esc(a.title)}</h2>
    ${a.goal ? `<p class="modal-p"><b>Cilj:</b> ${esc(a.goal)}</p>` : ""}
    ${a.materials.length ? `<h4>Materijal</h4><ul>${a.materials.map(m => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}
    ${a.steps.length ? `<h4>Koraci</h4><ol class="lib-steps">${a.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
    ${a.levels.length ? `<h4>Nivoi</h4>${a.levels.map(l => `<p class="modal-p"><b>${esc(l.name)}:</b> ${esc(l.text)}</p>`).join("")}` : ""}
    ${a.tracks.length ? `<h4>Roditelj prati</h4><ul>${a.tracks.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    ${a.develops ? `<p class="modal-p muted"><b>Razvija:</b> ${esc(a.develops)}</p>` : ""}
    ${a.note ? `<div class="note-box">${esc(a.note)}</div>` : ""}
    <div class="modal-actions">
      ${pickMode ? `<button class="btn" data-action="lib-toggle" data-id="${a.id}" data-close-after="1">${picked ? "Ukloni iz izbora" : "+ Izaberi za program"}</button>` : ""}
      ${!pickMode && a.mine ? `<a class="btn-ghost" href="#/admin/biblioteka/moja/${a.dbId}" data-close>Uredi</a>` : ""}
      ${!pickMode && !a.mine ? `<a class="btn-ghost" href="#/admin/biblioteka/nova?od=${a.id}" data-close>Napravi svoju verziju</a>` : ""}
    </div>`);
}

/* ---------------------------------------------------------------- forma: nova / izmena aktivnosti */

export function activityForm(a) {
  const isNew = !a || !a.mine;
  const v = a || { title: "", area: "moje", age: "", time: "", goal: "", materials: [], steps: [], levels: [], tracks: [], develops: "", note: "", art: 0, photo: "" };
  const photo = L.draftPhoto !== null ? L.draftPhoto : (a && a.mine ? v.photo : "");
  const art = L.draftArt !== null ? L.draftArt : (v.mine || v.art != null ? Number(v.art) || 0 : (a ? Math.max(0, LIB_AREAS.findIndex(x => x.id === a.area)) : 0));
  const easy = (v.levels.find(l => /lak/i.test(l.name)) || {}).text || "";
  const hard = (v.levels.find(l => /te[žz]/i.test(l.name)) || {}).text || "";
  const lines = arr => esc((arr || []).join("\n"));
  return `
    <div class="page-head">
      <a class="btn-link" href="#/admin/biblioteka">← Biblioteka</a>
      <h1 style="margin-top:12px">${isNew ? "Nova aktivnost" : "Izmena aktivnosti"}</h1>
      <p class="lead">Opišite igru kao roditelju: šta je cilj, šta treba pripremiti i šta se radi korak po korak. Sačuvana aktivnost ulazi u „Moje aktivnosti“ i može se dodati u bilo koji program.</p>
    </div>
    <form id="activity-form" class="act-form-grid" data-id="${v.mine ? v.dbId : ""}">
      <div class="panel">
        <div class="field"><label>Naziv aktivnosti</label><input class="input" name="title" value="${esc(v.title)}" placeholder="npr. Lov na zvukove" required></div>
        <div class="three">
          <div class="field"><label>Oblast</label><select class="input" name="area">
            ${LIB_AREAS.concat([{ id: "moje", title: "Ostalo / moje" }]).map(x => `<option value="${x.id}" ${v.area === x.id ? "selected" : ""}>${esc(x.title)}</option>`).join("")}
          </select></div>
          <div class="field"><label>Uzrast</label><input class="input" name="age" value="${esc(v.age)}" placeholder="npr. 3–7 god."></div>
          <div class="field"><label>Trajanje</label><input class="input" name="time" value="${esc(v.time)}" placeholder="npr. 5–10 min"></div>
        </div>
        <div class="field"><label>Cilj</label><textarea class="input" name="goal" rows="2" placeholder="Šta dete kroz ovu igru vežba?">${esc(v.goal)}</textarea></div>
        <div class="two">
          <div class="field"><label>Materijal <small>jedno po redu</small></label><textarea class="input" name="materials" rows="4">${lines(v.materials)}</textarea></div>
          <div class="field"><label>Roditelj prati <small>jedno po redu</small></label><textarea class="input" name="tracks" rows="4">${lines(v.tracks)}</textarea></div>
        </div>
        <div class="field"><label>Koraci <small>jedan korak po redu</small></label><textarea class="input" name="steps" rows="6" placeholder="Pripremite…&#10;Pokažite detetu…&#10;Dete…">${lines(v.steps)}</textarea></div>
        <div class="two">
          <div class="field"><label>Lakša varijanta</label><textarea class="input" name="easy" rows="2">${esc(easy)}</textarea></div>
          <div class="field"><label>Teža varijanta</label><textarea class="input" name="hard" rows="2">${esc(hard)}</textarea></div>
        </div>
        <div class="two">
          <div class="field"><label>Šta razvija</label><input class="input" name="develops" value="${esc(v.develops)}" placeholder="npr. pažnja, slušanje, smenjivanje"></div>
          <div class="field"><label>Napomena / bezbednost</label><input class="input" name="note" value="${esc(v.note)}"></div>
        </div>
      </div>
      <div class="panel act-side">
        <h3>Slika</h3>
        <p class="muted small">Izaberite ilustraciju ili dodajte svoju fotografiju (npr. kako izgleda pripremljen materijal).</p>
        <div class="art-pick">
          ${[0, 1, 2, 3, 4].map(i => `<button type="button" class="art-opt ${bgAt(i)} ${!photo && art === i ? "on" : ""}" data-action="act-art" data-i="${i}">${artAt(i)}</button>`).join("")}
        </div>
        <div class="act-photo">${photo ? `<img src="${photo}" alt="">` : `<span class="muted small">Bez fotografije</span>`}</div>
        <label class="btn-ghost file-btn">${ICON.upload} ${photo ? "Promeni fotografiju" : "Dodaj fotografiju"}<input type="file" id="act-photo-input" accept="image/*" hidden></label>
        ${photo ? `<button type="button" class="btn-link danger" data-action="act-photo-remove">Ukloni fotografiju</button>` : ""}
        <div class="act-save">
          <button class="btn btn-lg" type="submit">Sačuvaj aktivnost</button>
          ${v.mine ? `<button type="button" class="btn-link danger" data-action="act-delete" data-id="${v.dbId}">${ICON.trash} Obriši</button>` : ""}
        </div>
      </div>
    </form>`;
}

export function readActivityForm(form) {
  const d = Object.fromEntries(new FormData(form));
  const lines = t => String(t || "").split("\n").map(x => x.trim()).filter(Boolean);
  const levels = [];
  if (d.easy && d.easy.trim()) levels.push({ name: "Lakše", text: d.easy.trim() });
  if (d.hard && d.hard.trim()) levels.push({ name: "Teže", text: d.hard.trim() });
  return {
    title: (d.title || "").trim(), area: d.area || "moje", age: (d.age || "").trim(), time: (d.time || "").trim(),
    goal: (d.goal || "").trim(), materials: lines(d.materials), steps: lines(d.steps), levels, tracks: lines(d.tracks),
    develops: (d.develops || "").trim(), note: (d.note || "").trim(),
  };
}

/* ---------------------------------------------------------------- šabloni i dodavanje u program */

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
export function addListHtml(existingIds) {
  const groups = LIB_AREAS.map(ar => ({ title: ar.title, items: LIBRARY.filter(a => a.area === ar.id) }));
  if (CUSTOM.length) groups.unshift({ title: "Moje aktivnosti", items: CUSTOM });
  return `
    <h2>Dodaj iz biblioteke</h2>
    <p class="modal-p">Štiklirajte aktivnosti koje želite da dodate u ovaj program.</p>
    <div class="lib-addlist">
      ${groups.map(g => `
        <h4>${esc(g.title)}</h4>
        ${g.items.map(a => `
          <label class="check"><input type="checkbox" name="lib" value="${a.id}" ${existingIds.includes(a.id) ? "disabled" : ""}> ${esc(a.title)} ${existingIds.includes(a.id) ? `<small class="muted">(već u programu)</small>` : ""}</label>`).join("")}`).join("")}
    </div>
    <div class="modal-actions"><button class="btn" data-ed="lib-add-confirm">Dodaj izabrane</button></div>`;
}
