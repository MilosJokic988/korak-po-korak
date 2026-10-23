/* Dosije deteta / učenika: osnovni podaci, pedagoški profil, potrebe po oblastima,
   hronologija beležaka i lista IOP-a. */

import { esc, fmtDate, todayISO, ICON, openModal } from "./util.js";
import { IOP_AREAS, IOP_TYPES } from "./iop.js";
import { itemRow } from "./visual.js";

export const NOTE_KINDS = ["Beleška", "Opservacija", "Procena", "Sastanak tima", "Razgovor sa roditeljima", "Evaluacija IOP-a"];

export function tabDosije(d) {
  const f = d.family;
  const s = f.dossier || {};
  const needs = s.needs || {};
  const notes = d.dossier_notes || [];
  const iops = d.iops || [];
  const isStudent = f.kind === "ucenik";
  return `
    <form id="dossier-form" class="panel">
      <div class="row-between"><h2>Osnovni podaci</h2><span class="muted small">Vidite samo vi – porodica ovo ne vidi.</span></div>
      <div class="seg" role="radiogroup">
        <label><input type="radio" name="kind" value="porodica" ${!isStudent ? "checked" : ""}> Porodica (kućni program)</label>
        <label><input type="radio" name="kind" value="ucenik" ${isStudent ? "checked" : ""}> Učenik / dete iz grupe</label>
      </div>
      <div class="four">
        <div class="field"><label>Ime deteta <small>bez prezimena</small></label><input class="input" name="children" value="${esc(f.children || "")}"></div>
        <div class="field"><label>Razred / grupa</label><input class="input" name="class_name" value="${esc(f.class_name || "")}" placeholder="npr. 2/3 ili srednja grupa"></div>
        <div class="field"><label>Škola / vrtić</label><input class="input" name="school" value="${esc(f.school || "")}"></div>
        <div class="field"><label>Godina rođenja</label><input class="input" name="birth_year" type="number" min="1990" max="2030" value="${esc(f.birth_year || "")}"></div>
      </div>

      <h2 style="margin-top:22px">Pedagoški profil</h2>
      <div class="two">
        <div class="field"><label>Jake strane</label><textarea class="input" name="strengths" rows="3" placeholder="Šta ide dobro, u čemu je uspešan…">${esc(s.strengths || "")}</textarea></div>
        <div class="field"><label>Interesovanja i motivacija</label><textarea class="input" name="interests" rows="3" placeholder="Šta voli, čime ga lako motivišemo…">${esc(s.interests || "")}</textarea></div>
        <div class="field"><label>Šta pomaže</label><textarea class="input" name="helps" rows="3" placeholder="Vizuelni raspored, kratka uputstva, pauze…">${esc(s.helps || "")}</textarea></div>
        <div class="field"><label>Šta otežava</label><textarea class="input" name="hard" rows="3" placeholder="Buka, promene, dugi zadaci…">${esc(s.hard || "")}</textarea></div>
      </div>
      <div class="field"><label>Saradnja sa porodicom</label><textarea class="input" name="family" rows="2" placeholder="Kako i koliko često se dogovarate sa roditeljima">${esc(s.family || "")}</textarea></div>

      <h2 style="margin-top:22px">Potrebe za podrškom po oblastima</h2>
      <p class="muted small">Štiklirajte oblasti u kojima detetu treba podrška i ukratko opišite trenutni nivo. Od ovoga se pravi IOP.</p>
      <div class="needs">
        ${IOP_AREAS.map(a => { const n = needs[a.id] || {}; return `
          <div class="need ${n.on ? "on" : ""}">
            <label class="check"><input type="checkbox" name="need_${a.id}" ${n.on ? "checked" : ""}> <b>${esc(a.title)}</b></label>
            <textarea class="input" name="needtext_${a.id}" rows="2" placeholder="Trenutni nivo: šta može samostalno, a gde mu treba pomoć">${esc(n.text || "")}</textarea>
          </div>`; }).join("")}
      </div>
      <div class="modal-actions"><button class="btn" type="submit">Sačuvaj dosije</button></div>
    </form>

    <section class="panel" style="margin-top:18px">
      <div class="row-between">
        <div><h2>IOP – individualni obrazovni plan</h2><p class="muted small">Automatski nacrt iz dosijea: ciljevi, prilagođavanja i aktivnosti po oblastima, spreman za štampu.</p></div>
        <button class="btn" data-action="iop-new">${ICON.doc} Napravi IOP iz dosijea</button>
      </div>
      ${iops.length ? `<div class="iop-list">${iops.map(i => `
        <a class="iop-row" href="#/admin/p/${f.id}/iop/${i.id}">
          <span class="iop-badge">${esc((i.data && i.data.type) || "IOP")}</span>
          <span><b>${esc((i.data && i.data.school_year) || "")}</b> · ${fmtDate(i.data && i.data.period_from)} – ${fmtDate(i.data && i.data.period_to)}<small class="muted"> · ${(i.data && i.data.areas || []).length} oblasti · izmenjen ${fmtDate(String(i.updated_at).slice(0, 10))}</small></span>
          <span class="arrow">→</span>
        </a>`).join("")}</div>` : ""}
    </section>

    <section class="panel" style="margin-top:18px">
      <div class="row-between">
        <div><h2>Vizuelna podrška</h2><p class="muted small">Rasporedi, kartice, priče, senzorni pasoš… Štampa se na A4, a može se i podeliti sa porodicom.</p></div>
        <a class="btn" href="#/admin/vizuelno/za=${f.id}">${ICON.plus} Nova vizuelna podrška</a>
      </div>
      ${(d.visuals || []).length ? `<div class="vis-list" style="margin-top:14px">${d.visuals.map(itemRow).join("")}</div>` : ""}
    </section>

    <section class="panel" style="margin-top:18px">
      <h2>Hronologija</h2>
      <form id="note-form" class="note-add">
        <input class="input" type="date" name="note_date" value="${todayISO()}">
        <select class="input" name="kind">${NOTE_KINDS.map(k => `<option>${k}</option>`).join("")}</select>
        <textarea class="input" name="body" rows="2" placeholder="Šta ste primetili, dogovorili ili procenili…" required></textarea>
        <button class="btn" type="submit">Dodaj</button>
      </form>
      ${notes.length ? `<div class="timeline">${notes.map(n => `
        <div class="tl-item">
          <div class="tl-meta"><b>${fmtDate(n.note_date)}</b><span class="tl-kind">${esc(n.kind)}</span><button class="icon-btn danger" data-action="note-delete" data-id="${n.id}" title="Obriši">${ICON.trash}</button></div>
          <p>${esc(n.body).replace(/\n/g, "<br>")}</p>
        </div>`).join("")}</div>` : `<p class="muted">Još nema beležaka.</p>`}
    </section>`;
}

export function readDossierForm(form) {
  const d = Object.fromEntries(new FormData(form));
  const needs = {};
  IOP_AREAS.forEach(a => {
    const on = Boolean(d["need_" + a.id]);
    const text = (d["needtext_" + a.id] || "").trim();
    if (on || text) needs[a.id] = { on, text };
  });
  return {
    kind: d.kind === "ucenik" ? "ucenik" : "porodica",
    children: (d.children || "").trim(), class_name: (d.class_name || "").trim(), school: (d.school || "").trim(), birth_year: d.birth_year || "",
    dossier: { strengths: d.strengths || "", interests: d.interests || "", helps: d.helps || "", hard: d.hard || "", family: d.family || "", needs },
  };
}

export function iopNewModal(f) {
  const needs = (f.dossier && f.dossier.needs) || {};
  const any = IOP_AREAS.some(a => needs[a.id] && needs[a.id].on);
  openModal(`
    <h2>Novi IOP iz dosijea</h2>
    <form id="iop-new-form" class="modal-form">
      <div class="field"><label>Vrsta plana</label>
        ${Object.entries(IOP_TYPES).map(([k, t], i) => `<label class="radio-card"><input type="radio" name="type" value="${k}" ${i === 0 ? "checked" : ""}><span><b>${esc(t.long)}</b><small>${esc(t.hint)}</small></span></label>`).join("")}
      </div>
      <div class="field"><label>Oblasti ${any ? "<small>(predloženo iz dosijea)</small>" : "<small>(u dosijeu nema štikliranih oblasti – izaberite ovde)</small>"}</label>
        ${IOP_AREAS.map(a => `<label class="check"><input type="checkbox" name="area" value="${a.id}" ${needs[a.id] && needs[a.id].on ? "checked" : ""}> ${esc(a.title)}</label>`).join("")}
      </div>
      <div class="modal-actions"><button class="btn" type="submit">Napravi nacrt</button><button class="btn-link" type="button" data-close>Odustani</button></div>
    </form>`);
}
