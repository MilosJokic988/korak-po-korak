/* IOP – individualni obrazovni plan: banke ciljeva i prilagođavanja,
   automatski nacrt iz dosijea, uređivanje i štampa. */

import { allActivities, libById } from "./library.js";
import { esc, fmtDate, todayISO, ICON } from "./util.js";

export const IOP_TYPES = {
  IOP1: { title: "IOP1", long: "IOP1 – prilagođeni način rada i uslovi", hint: "Učenik prati redovan program, a menjaju se način rada, prostor, vreme, materijal i način provere. Najčešći izbor." },
  IOP2: { title: "IOP2", long: "IOP2 – izmenjeni ciljevi i ishodi", hint: "Za jedan ili više predmeta menjaju se ishodi. Donosi se tek posle IOP1, uz saglasnost roditelja i mišljenje interresorne komisije." },
  IOP3: { title: "IOP3", long: "IOP3 – obogaćen program", hint: "Za učenike sa izuzetnim sposobnostima – proširen i produbljen program." },
};

export const IOP_AREAS = [
  { id: "ucenje", title: "Učenje i školske veštine", lib: ["paz", "fin"],
    goals: [
      "Uz vizuelnu podršku samostalno započinje zadatak u roku od 2 minuta, u 4 od 5 prilika.",
      "Prati uputstvo od dva koraka u radu na času bez ponavljanja, u 3 od 5 prilika.",
      "Čita kratak tekst (do 5 rečenica) i odgovara na 3 jednostavna pitanja o njemu, uz najviše jednu pomoć.",
      "Prepisuje kratku rečenicu sa kartice uz pravilan redosled slova, u 4 od 5 pokušaja.",
      "Sabira i oduzima do 20 uz konkretan materijal, tačno u 8 od 10 zadataka.",
    ],
    accom: [
      "Zadaci podeljeni na kraće korake, jedan zadatak po listu",
      "Uvećan font i pregledan raspored na radnom listu",
      "Produženo vreme za izradu zadataka",
      "Usmeno odgovaranje kao zamena za pismeno",
      "Konkretan i vizuelni materijal (slike, brojevna prava, kartice)",
      "Provera razumevanja uputstva – učenik ponovi šta treba da uradi",
    ] },
  { id: "paznja", title: "Pažnja i organizacija", lib: ["paz"],
    goals: [
      "Zadržava pažnju na zadatku 10 minuta uz najviše jedno podsećanje.",
      "Na znak nastavnika prekida aktivnost i usmerava pažnju u roku od 10 sekundi, u 4 od 5 prilika.",
      "Koristi listu koraka i samostalno precrtava završene korake, 4 od 5 dana.",
      "Priprema pribor za čas prema listi samostalno, najmanje 3 dana u nedelji.",
    ],
    accom: [
      "Sedenje blizu nastavnika, dalje od vrata i prozora",
      "Kratka pauza za pokret (1–2 min) na svakih 15–20 minuta rada",
      "Vizuelni raspored časa i dana na klupi",
      "Tajmer ili peščani sat za trajanje zadatka",
      "Dogovoreni neverbalni znak za vraćanje pažnje",
      "Jedno kratko i jasno uputstvo u isto vreme",
    ] },
  { id: "komunikacija", title: "Komunikacija i govor", lib: ["kom"],
    goals: [
      "Iskazuje potrebu ili traži pomoć rečju, gestom ili karticom, u 4 od 5 situacija.",
      "Odgovara na pitanja ko/šta/gde o poznatoj slici ili događaju, u 4 od 5 pitanja.",
      "Prepričava kratak događaj u 3 rečenice uz slikovnu podršku.",
      "Učestvuje u razgovoru u paru sa najmanje 2 smene (pitanje – odgovor).",
    ],
    accom: [
      "Dodatno vreme za odgovor (čekanje 5–10 sekundi)",
      "Slikovna podrška i kartice za komunikaciju",
      "Pitanja zatvorenog tipa ili izbor između dva odgovora",
      "Modelovanje pravilnog izgovora bez ispravljanja pred razredom",
    ] },
  { id: "socijalno", title: "Socijalna interakcija i ponašanje", lib: ["kom", "reg"],
    goals: [
      "Čeka na red u aktivnosti u grupi od 3–4 učenika, uz najviše jedno podsećanje.",
      "Učestvuje u zajedničkoj aktivnosti sa vršnjakom najmanje 10 minuta, 3 puta nedeljno.",
      "U situaciji neslaganja koristi dogovorenu strategiju (zatraži pomoć, udalji se, kaže šta mu smeta), u 3 od 5 prilika.",
      "Poštuje 3 dogovorena pravila razreda uz vizuelni podsetnik, 4 od 5 dana.",
    ],
    accom: [
      "Jasna, vizuelno predstavljena pravila razreda",
      "Najava promena u rasporedu unapred",
      "Vršnjak-podrška u grupnim aktivnostima",
      "Pohvala konkretnog ponašanja odmah nakon što se desi",
      "Dogovoreno mirno mesto za smirivanje",
    ] },
  { id: "samostalnost", title: "Samostalnost i briga o sebi", lib: ["sam"],
    goals: [
      "Samostalno oblači jaknu i obuva se u roku od 5 minuta, u 4 od 5 prilika.",
      "Samostalno pakuje torbu prema slikovnoj listi, 4 od 5 dana.",
      "Samostalno odlazi do toaleta i pere ruke prema slikovnom redosledu.",
      "Samostalno koristi užinu i pribor za jelo, uz najviše jedno podsećanje.",
    ],
    accom: [
      "Slikovni redosled koraka za svakodnevne rutine",
      "Dodatno vreme za presvlačenje i pripremu",
      "Postepeno smanjivanje pomoći odrasle osobe",
      "Dosledna rutina i stalno mesto za stvari",
    ] },
  { id: "motorika", title: "Fina i gruba motorika", lib: ["fin", "gru"],
    goals: [
      "Pravilno drži olovku (tronožni hvat) tokom 5 minuta pisanja, uz najviše jedno podsećanje.",
      "Seče makazama po pravoj i blago zakrivljenoj liniji, uz odstupanje do 0,5 cm.",
      "Hvata loptu srednje veličine sa 2 metra, u 3 od 5 bacanja.",
      "Prelazi poligon sa preprekama (penjanje, provlačenje, preskok) uz minimalnu pomoć.",
    ],
    accom: [
      "Deblja olovka ili nastavak za olovku",
      "Radni listovi sa širim linijama i većim poljima",
      "Smanjen obim prepisivanja – kopija beleški",
      "Prilagođeni zahtevi na fizičkom vaspitanju",
    ] },
  { id: "regulacija", title: "Senzorna obrada i samoregulacija", lib: ["reg"],
    goals: [
      "Prepoznaje i imenuje svoje stanje (miran / uznemiren / umoran) uz skalu ili sliku, u 4 od 5 prilika.",
      "Koristi jednu od dogovorenih strategija smirivanja (disanje, pauza, pritisak), uz najviše jedno podsećanje.",
      "Vraća se aktivnosti u roku od 5 minuta nakon pauze za smirivanje.",
      "Toleriše buku ili promenu u učionici uz dogovorenu podršku, bez prekida rada u 3 od 5 situacija.",
    ],
    accom: [
      "Senzorni predah ili pauza za pokret po potrebi",
      "Slušalice za smanjenje buke u bučnim aktivnostima",
      "Senzorni pribor na klupi (gnjecalica, jastučić za sedenje)",
      "Mirno mesto u učionici",
      "Najava glasnih događaja (zvono, priredba, vežba evakuacije)",
    ] },
];
export const iopArea = id => IOP_AREAS.find(a => a.id === id);

export const GENERAL = [
  { id: "prostor", title: "Prostor", items: ["Mesto u prvoj klupi, blizu nastavnika", "Smanjeni vizuelni i zvučni ometači", "Dogovoreno mesto za predah"] },
  { id: "vreme", title: "Vreme", items: ["Produženo vreme za zadatke i proveru znanja", "Kraći radni intervali sa pauzama", "Najava rasporeda i promena"] },
  { id: "materijal", title: "Materijal i sredstva", items: ["Prilagođeni radni listovi (uvećano, manje zadataka po strani)", "Vizuelna i konkretna podrška", "Asistivna sredstva po potrebi"] },
  { id: "ocenjivanje", title: "Provera i ocenjivanje", items: ["Usmena provera kao zamena za pismenu", "Provera u više kraćih delova", "Ocenjivanje napretka u odnosu na lične ciljeve", "Najavljena provera uz jasne kriterijume"] },
];

export const TEAM_ROLES = ["Odeljenski starešina / učitelj", "Predmetni nastavnik", "Defektolog / stručni saradnik", "Pedagog ili psiholog škole", "Roditelj / staratelj"];

/* ---------------------------------------------------------------- generator */

function schoolYear(d = new Date()) {
  const y = d.getFullYear(), m = d.getMonth();
  const start = m >= 7 ? y : y - 1;
  return { label: `${start}/${start + 1}.`, end: `${start + 1}-06-30` };
}
function addMonths(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(y, m - 1 + n, Math.min(d, 28));
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export function activitiesFor(areaId, n = 3) {
  const a = iopArea(areaId);
  if (!a) return [];
  const pool = allActivities().filter(x => a.lib.includes(x.area));
  pool.sort((x, y) => Number(Boolean(y.mine)) - Number(Boolean(x.mine)));   // svoje aktivnosti prvo
  return pool.slice(0, n).map(x => ({ id: x.id, title: x.title }));
}

export function generateIop(fam, type, areaIds, proName = "") {
  const d = fam.dossier || {};
  const needs = d.needs || {};
  const sy = schoolYear();
  const from = todayISO();
  const to = sy.end > from ? sy.end : addMonths(from, 6);
  const evals = [3, 6, 9].map(n => addMonths(from, n)).filter(x => x <= to);
  if (!evals.length || evals[evals.length - 1] !== to) evals.push(to);
  const areas = areaIds.map(id => {
    const a = iopArea(id);
    return {
      id, title: a.title,
      current: (needs[id] && needs[id].text) || "",
      goals: a.goals.slice(0, 3),
      accom: a.accom.slice(0, 3),
      activities: activitiesFor(id),
      who: "", how: "posmatranje u nastavi, ček-lista cilja, beleške roditelja",
    };
  });
  return {
    type, school_year: sy.label, period_from: from, period_to: to,
    student: { name: fam.children || fam.name, class_name: fam.class_name || "", school: fam.school || "", birth_year: fam.birth_year || "" },
    team: TEAM_ROLES.map((role, i) => ({ role, name: i === 2 ? proName : "" })),
    profile: { strengths: d.strengths || "", interests: d.interests || "", helps: d.helps || "", hard: d.hard || "" },
    general: type === "IOP3" ? [] : [GENERAL[0].items[0], GENERAL[1].items[0], GENERAL[1].items[1], GENERAL[2].items[1], GENERAL[3].items[2]],
    general_other: [],
    subjects: type === "IOP2" ? [{ subject: "", outcomes: "" }] : [],
    areas,
    family: d.family || "Roditelji kod kuće sprovode dogovorene aktivnosti iz aplikacije Korak po korak i beleže zapažanja; jednom mesečno kratak razgovor o napretku.",
    eval_dates: evals,
    eval_how: "Na svakoj evaluaciji tim proverava ostvarenost ciljeva (ostvaren / delimično / nije ostvaren) i po potrebi menja ciljeve i podršku.",
    eval_notes: "",
  };
}

/* ---------------------------------------------------------------- uređivanje */

const lines = arr => esc((arr || []).join("\n"));

export function normalizeIop(v) {
  v = v || {};
  return Object.assign(v, {
    type: v.type || "IOP1", student: v.student || {}, team: v.team || [], profile: v.profile || {},
    general: v.general || [], general_other: v.general_other || [], subjects: v.subjects || [], areas: (v.areas || []).map(a => ({ goals: [], accom: [], activities: [], current: "", who: "", how: "", ...a })),
    eval_dates: v.eval_dates || [], family: v.family || "", eval_how: v.eval_how || "", eval_notes: v.eval_notes || "",
  });
}

export function iopView(fam, rec, saving) {
  const v = normalizeIop(rec.data);
  const t = IOP_TYPES[v.type] || IOP_TYPES.IOP1;
  const used = v.areas.map(a => a.id);
  return `
    <div class="page-head">
      <a class="btn-link" href="#/admin/p/${fam.id}">← ${esc(fam.name)} · Dosije</a>
      <div class="row-between" style="margin-top:12px">
        <div>
          <p class="eyebrow">${esc(t.long)}</p>
          <h1>IOP – ${esc(v.student.name || fam.name)}</h1>
          <p class="lead">Nacrt je napravljen iz dosijea. Proverite i dopunite svaku oblast, pa sačuvajte i odštampajte za sastanak tima.</p>
        </div>
        <div class="row-gap">
          <button class="btn-ghost" data-action="iop-print">${ICON.print} Štampaj / PDF</button>
          <button class="btn" form="iop-form" type="submit">${saving ? "Čuvam…" : "Sačuvaj"}</button>
        </div>
      </div>
    </div>
    <div class="notice">${ICON.info} IOP izrađuje tim za dodatnu podršku, a usvaja pedagoški kolegijum škole/vrtića. Ovo je radni nacrt koji olakšava pripremu.${v.type === "IOP2" ? " Za IOP2 su potrebni saglasnost roditelja i mišljenje interresorne komisije." : ""}</div>
    <form id="iop-form" class="iop-form">
      <section class="panel">
        <h2>Osnovni podaci</h2>
        <div class="three">
          <div class="field"><label>Vrsta plana</label><select class="input" data-k="type">${Object.keys(IOP_TYPES).map(k => `<option value="${k}" ${v.type === k ? "selected" : ""}>${IOP_TYPES[k].long}</option>`).join("")}</select></div>
          <div class="field"><label>Školska godina</label><input class="input" data-k="school_year" value="${esc(v.school_year)}"></div>
          <div class="field"><label>Važi od – do</label><div class="two tight"><input class="input" type="date" data-k="period_from" value="${esc(v.period_from)}"><input class="input" type="date" data-k="period_to" value="${esc(v.period_to)}"></div></div>
        </div>
        <div class="three">
          <div class="field"><label>Ime učenika / deteta</label><input class="input" data-k="student.name" value="${esc(v.student.name)}"></div>
          <div class="field"><label>Razred / grupa</label><input class="input" data-k="student.class_name" value="${esc(v.student.class_name)}"></div>
          <div class="field"><label>Škola / vrtić</label><input class="input" data-k="student.school" value="${esc(v.student.school)}"></div>
        </div>
        <h3 class="ed-h">Tim za dodatnu podršku</h3>
        ${v.team.map((m, i) => `
          <div class="team-row">
            <input class="input" data-k="team.${i}.role" value="${esc(m.role)}" placeholder="Uloga">
            <input class="input" data-k="team.${i}.name" value="${esc(m.name)}" placeholder="Ime i prezime člana tima">
            <button type="button" class="icon-btn danger" data-action="iop-team-del" data-i="${i}" title="Ukloni">${ICON.trash}</button>
          </div>`).join("")}
        <button type="button" class="btn-link" data-action="iop-team-add">+ Član tima</button>
      </section>

      <section class="panel">
        <h2>Pedagoški profil</h2>
        <div class="two">
          <div class="field"><label>Jake strane</label><textarea class="input" rows="3" data-k="profile.strengths">${esc(v.profile.strengths)}</textarea></div>
          <div class="field"><label>Interesovanja i motivacija</label><textarea class="input" rows="3" data-k="profile.interests">${esc(v.profile.interests)}</textarea></div>
          <div class="field"><label>Šta pomaže</label><textarea class="input" rows="3" data-k="profile.helps">${esc(v.profile.helps)}</textarea></div>
          <div class="field"><label>Šta otežava</label><textarea class="input" rows="3" data-k="profile.hard">${esc(v.profile.hard)}</textarea></div>
        </div>
      </section>

      ${v.type !== "IOP3" ? `
      <section class="panel">
        <h2>Opšte prilagođavanje</h2>
        <p class="muted small">Štiklirajte šta važi na svim časovima.</p>
        <div class="gen-grid">
          ${GENERAL.map(g => `<div><h4>${esc(g.title)}</h4>${g.items.map(x => `<label class="check"><input type="checkbox" data-gen value="${esc(x)}" ${v.general.includes(x) ? "checked" : ""}> ${esc(x)}</label>`).join("")}</div>`).join("")}
        </div>
        <div class="field"><label>Drugo <small>jedno po redu</small></label><textarea class="input" rows="2" data-k="general_other" data-lines="1">${lines(v.general_other)}</textarea></div>
      </section>` : ""}

      ${v.type === "IOP2" ? `
      <section class="panel">
        <h2>Predmeti sa izmenjenim ishodima</h2>
        ${v.subjects.map((s, i) => `
          <div class="subj-row">
            <input class="input" data-k="subjects.${i}.subject" value="${esc(s.subject)}" placeholder="Predmet">
            <textarea class="input" rows="2" data-k="subjects.${i}.outcomes" placeholder="Prilagođeni ishodi – šta će učenik biti u stanju da uradi">${esc(s.outcomes)}</textarea>
            <button type="button" class="icon-btn danger" data-action="iop-subj-del" data-i="${i}">${ICON.trash}</button>
          </div>`).join("")}
        <button type="button" class="btn-link" data-action="iop-subj-add">+ Predmet</button>
      </section>` : ""}

      <h2 class="section-title" style="margin:28px 0 12px">Oblasti podrške, ciljevi i aktivnosti</h2>
      ${v.areas.map((a, i) => areaBlock(a, i)).join("")}
      <div class="add-area">
        <select class="input" id="iop-area-add"><option value="">+ Dodaj oblast…</option>${IOP_AREAS.filter(a => !used.includes(a.id)).map(a => `<option value="${a.id}">${esc(a.title)}</option>`).join("")}</select>
      </div>

      <section class="panel">
        <h2>Saradnja sa porodicom</h2>
        <textarea class="input" rows="3" data-k="family">${esc(v.family)}</textarea>
      </section>

      <section class="panel">
        <h2>Praćenje i vrednovanje</h2>
        <div class="field"><label>Datumi evaluacije <small>u prvoj godini tromesečno, kasnije dva puta godišnje</small></label>
          <div class="eval-dates">${v.eval_dates.map((d, i) => `<span><input class="input" type="date" data-k="eval_dates.${i}" value="${esc(d)}"><button type="button" class="icon-btn" data-action="iop-eval-del" data-i="${i}">×</button></span>`).join("")}
          <button type="button" class="btn-link" data-action="iop-eval-add">+ datum</button></div></div>
        <div class="field"><label>Način vrednovanja</label><textarea class="input" rows="2" data-k="eval_how">${esc(v.eval_how)}</textarea></div>
        <div class="field"><label>Beleške sa evaluacije</label><textarea class="input" rows="3" data-k="eval_notes">${esc(v.eval_notes)}</textarea></div>
      </section>

      <div class="iop-foot">
        <button class="btn btn-lg" type="submit">Sačuvaj IOP</button>
        <button type="button" class="btn-ghost" data-action="iop-print">${ICON.print} Štampaj / PDF</button>
        <button type="button" class="btn-ghost" data-action="iop-program">${ICON.book} Napravi kućni program od aktivnosti</button>
        <button type="button" class="btn-link danger" data-action="iop-delete">${ICON.trash} Obriši IOP</button>
      </div>
    </form>`;
}

function areaBlock(a, i) {
  const def = iopArea(a.id) || { goals: [], accom: [], lib: [] };
  const sugg = (list, have, target) => list.filter(x => !have.includes(x)).map(x => `<button type="button" class="sugg" data-action="iop-sugg" data-target="${target}" data-text="${esc(x)}">+ ${esc(x)}</button>`).join("");
  const pool = allActivities().filter(x => def.lib.includes(x.area) && !a.activities.some(y => y.id === x.id));
  const others = allActivities().filter(x => !def.lib.includes(x.area) && !a.activities.some(y => y.id === x.id));
  return `
    <section class="panel iop-area">
      <div class="row-between"><h3>${i + 1}. ${esc(a.title)}</h3><button type="button" class="btn-link danger" data-action="iop-area-del" data-i="${i}">Ukloni oblast</button></div>
      <div class="field"><label>Trenutni nivo – šta učenik sada može, a gde mu treba podrška</label><textarea class="input" rows="3" data-k="areas.${i}.current">${esc(a.current)}</textarea></div>
      <div class="field"><label>Ciljevi <small>merljivo: šta, koliko, u kojim uslovima – jedan po redu</small></label>
        <textarea class="input" rows="4" id="ta-g-${i}" data-k="areas.${i}.goals" data-lines="1">${lines(a.goals)}</textarea>
        <div class="sugg-row">${sugg(def.goals, a.goals, `ta-g-${i}`)}</div></div>
      <div class="field"><label>Prilagođavanja i podrška <small>jedno po redu</small></label>
        <textarea class="input" rows="3" id="ta-a-${i}" data-k="areas.${i}.accom" data-lines="1">${lines(a.accom)}</textarea>
        <div class="sugg-row">${sugg(def.accom, a.accom, `ta-a-${i}`)}</div></div>
      <div class="field"><label>Aktivnosti (iz biblioteke – mogu se poslati porodici kao kućni program)</label>
        <div class="act-chips">${a.activities.map((x, k) => `<span class="act-chip">${esc(x.title)}<button type="button" data-action="iop-act-del" data-i="${i}" data-k="${k}" title="Ukloni">×</button></span>`).join("") || `<span class="muted small">Nema izabranih aktivnosti.</span>`}</div>
        <select class="input iop-act-add" data-i="${i}"><option value="">+ Dodaj aktivnost…</option>
          ${pool.length ? `<optgroup label="Predlog za ovu oblast">${pool.map(x => `<option value="${x.id}">${esc(x.title)}${x.mine ? " (moja)" : ""}</option>`).join("")}</optgroup>` : ""}
          <optgroup label="Ostale aktivnosti">${others.map(x => `<option value="${x.id}">${esc(x.title)}${x.mine ? " (moja)" : ""}</option>`).join("")}</optgroup>
        </select></div>
      <div class="two">
        <div class="field"><label>Nosilac / ko sprovodi</label><input class="input" data-k="areas.${i}.who" value="${esc(a.who)}" placeholder="npr. učiteljica, defektolog, roditelj"></div>
        <div class="field"><label>Način praćenja</label><input class="input" data-k="areas.${i}.how" value="${esc(a.how)}"></div>
      </div>
    </section>`;
}

/* čita formu nazad u objekat (pre svakog ponovnog crtanja i pre čuvanja) */
export function syncIopForm(form, v) {
  if (!form) return v;
  form.querySelectorAll("[data-k]").forEach(el => {
    const path = el.dataset.k.split(".");
    let val = el.value;
    if (el.dataset.lines) val = val.split("\n").map(x => x.trim()).filter(Boolean);
    let o = v;
    for (let i = 0; i < path.length - 1; i++) { const k = /^\d+$/.test(path[i]) ? Number(path[i]) : path[i]; if (o[k] == null) o[k] = {}; o = o[k]; }
    const last = /^\d+$/.test(path[path.length - 1]) ? Number(path[path.length - 1]) : path[path.length - 1];
    o[last] = val;
  });
  const gens = form.querySelectorAll("[data-gen]");
  if (gens.length) v.general = [...gens].filter(x => x.checked).map(x => x.value);
  return v;
}

export function newArea(id) {
  const a = iopArea(id);
  return { id, title: a.title, current: "", goals: a.goals.slice(0, 2), accom: a.accom.slice(0, 2), activities: activitiesFor(id), who: "", how: "posmatranje u nastavi, ček-lista cilja" };
}

export const iopActivityIds = v => [...new Set(v.areas.flatMap(a => a.activities.map(x => x.id)).filter(id => libById(id)))];

/* ---------------------------------------------------------------- štampa */

export function iopPrintHtml(v, proName) {
  const t = IOP_TYPES[v.type] || IOP_TYPES.IOP1;
  const ul = arr => arr && arr.length ? `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="empty">—</p>`;
  const p = s => s ? `<p>${esc(s).replace(/\n/g, "<br>")}</p>` : `<p class="empty">—</p>`;
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><title>IOP – ${esc(v.student.name)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font: 11pt/1.45 Georgia, "Times New Roman", serif; color: #111; max-width: 780px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 17pt; text-align: center; margin: 0 0 4px; letter-spacing: .5px; }
  .sub { text-align: center; margin: 0 0 18px; color: #333; }
  h2 { font-size: 12pt; text-transform: uppercase; letter-spacing: .6px; border-bottom: 1.5px solid #111; padding-bottom: 3px; margin: 22px 0 8px; }
  h3 { font-size: 11.5pt; margin: 14px 0 6px; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0; }
  td, th { border: 1px solid #555; padding: 6px 8px; vertical-align: top; text-align: left; font-size: 10.5pt; }
  th { background: #eee; width: 32%; font-weight: normal; }
  ul { margin: 4px 0 6px 18px; padding: 0; } li { margin: 2px 0; }
  .empty { color: #888; }
  .area { break-inside: avoid; border: 1px solid #555; padding: 8px 12px; margin: 10px 0; }
  .sig { display: grid; grid-template-columns: 1fr 1fr; gap: 26px 40px; margin-top: 18px; }
  .sig div { border-top: 1px solid #111; padding-top: 4px; font-size: 10pt; margin-top: 34px; }
  .note { font-size: 9.5pt; color: #444; border: 1px dashed #777; padding: 8px 10px; margin-top: 20px; }
  .bar { text-align: right; margin-bottom: 14px; } .bar button { font: inherit; padding: 8px 16px; cursor: pointer; }
  @media print { .bar { display: none; } body { padding: 0; } }
</style></head><body>
<div class="bar"><button onclick="window.print()">Štampaj / Sačuvaj kao PDF</button></div>
<h1>INDIVIDUALNI OBRAZOVNI PLAN</h1>
<p class="sub">${esc(t.long)} · školska ${esc(v.school_year)} godina</p>
<table>
  <tr><th>Učenik / dete</th><td>${esc(v.student.name)}</td></tr>
  <tr><th>Razred / grupa</th><td>${esc(v.student.class_name)}</td></tr>
  <tr><th>Škola / vrtić</th><td>${esc(v.student.school)}</td></tr>
  <tr><th>Period važenja</th><td>${fmtDate(v.period_from)} – ${fmtDate(v.period_to)}</td></tr>
</table>
<h2>Tim za dodatnu podršku</h2>
<table>${v.team.filter(m => m.role || m.name).map(m => `<tr><th>${esc(m.role)}</th><td>${esc(m.name)}</td></tr>`).join("")}</table>
<h2>Pedagoški profil</h2>
<table>
  <tr><th>Jake strane</th><td>${p(v.profile.strengths)}</td></tr>
  <tr><th>Interesovanja i motivacija</th><td>${p(v.profile.interests)}</td></tr>
  <tr><th>Šta pomaže</th><td>${p(v.profile.helps)}</td></tr>
  <tr><th>Šta otežava</th><td>${p(v.profile.hard)}</td></tr>
</table>
${v.type !== "IOP3" ? `<h2>Opšte prilagođavanje načina rada i uslova</h2>${ul(v.general.concat(v.general_other || []))}` : ""}
${v.type === "IOP2" && v.subjects.length ? `<h2>Predmeti sa izmenjenim ishodima</h2><table>${v.subjects.map(s => `<tr><th>${esc(s.subject)}</th><td>${p(s.outcomes)}</td></tr>`).join("")}</table>` : ""}
<h2>Oblasti podrške</h2>
${v.areas.map((a, i) => `<div class="area">
  <h3>${i + 1}. ${esc(a.title)}</h3>
  <p><b>Trenutni nivo:</b></p>${p(a.current)}
  <p><b>Ciljevi:</b></p>${ul(a.goals)}
  <p><b>Prilagođavanja i podrška:</b></p>${ul(a.accom)}
  <p><b>Aktivnosti:</b> ${a.activities.length ? a.activities.map(x => esc(x.title)).join(", ") : "—"}</p>
  <p><b>Nosilac:</b> ${esc(a.who) || "—"} &nbsp;·&nbsp; <b>Praćenje:</b> ${esc(a.how) || "—"}</p>
</div>`).join("")}
<h2>Saradnja sa porodicom</h2>${p(v.family)}
<h2>Praćenje i vrednovanje</h2>
<p><b>Datumi evaluacije:</b> ${v.eval_dates.filter(Boolean).map(fmtDate).join(", ") || "—"}</p>
${p(v.eval_how)}
${v.eval_notes ? `<p><b>Beleške:</b></p>${p(v.eval_notes)}` : ""}
<h2>Saglasnost i potpisi</h2>
<div class="sig">
  ${v.team.filter(m => m.role).map(m => `<div>${esc(m.role)}${m.name ? ": " + esc(m.name) : ""}</div>`).join("")}
  ${v.team.some(m => /roditelj/i.test(m.role)) ? "" : "<div>Roditelj / staratelj</div>"}
  <div>Datum usvajanja na pedagoškom kolegijumu</div>
</div>
<p class="note">Radni nacrt pripremljen u aplikaciji Korak po korak${proName ? " (" + esc(proName) + ")" : ""}. IOP izrađuje tim za dodatnu podršku, a usvaja pedagoški kolegijum ustanove.${v.type === "IOP2" ? " IOP2 se donosi uz saglasnost roditelja i mišljenje interresorne komisije." : ""}</p>
</body></html>`;
}
