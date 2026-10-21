/* Deo za stručnjaka i vlasnika platforme: registracija, profil, članarina, vlasnički pregled. */

import { admin as api, owner as ownerApi, signUp } from "./api.js";
import { PROFILE, DEFAULT_WELCOME, applyProfile } from "./config.js";
import { esc, toast, fmtDate, relTime, ICON, copyText, BRAND_MARK } from "./util.js";

export const P = { me: null, owner: null, ownerFilter: "svi", draftPhoto: null };

export const isOwner = () => Boolean(P.me && P.me.status && P.me.status.owner);
export const status = () => (P.me ? P.me.status : null);

export async function loadMe(force = false) {
  if (P.me && !force) return P.me;
  P.me = await api.me();
  applyProfile(P.me.profile);
  return P.me;
}

export function setMe(me) {
  P.me = me;
  applyProfile(me.profile);
}

export async function loadOwner() {
  P.owner = await ownerApi.overview();
  return P.owner;
}

const dani = n => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "dan" : "dana"}`;
const rsd = n => `${Number(n || 0).toLocaleString("sr-RS")} din`;

/* ---------------------------------------------------------------- traka o članarini */

export function statusBanner() {
  const s = status();
  if (!s || s.owner) return "";
  if (s.paused) return `<a class="sub-banner bad" href="#/admin/clanarina">${ICON.info}<span>Nalog je pauziran. Porodice trenutno ne mogu da otvore program.</span><b>Detalji →</b></a>`;
  if (!s.active) {
    const left = Math.max(0, Math.round((new Date(s.family_until) - new Date(new Date().toDateString())) / 864e5));
    return `<a class="sub-banner bad" href="#/admin/clanarina">${ICON.info}<span>Članarina je istekla ${fmtDate(s.access_until)} Možete da čitate, ali ne i da menjate. ${left > 0 ? `Porodice imaju pristup još ${dani(left)}.` : "Porodice trenutno nemaju pristup."}</span><b>Produžite →</b></a>`;
  }
  if (s.trial && s.days_left <= 30) return `<a class="sub-banner ${s.days_left <= 5 ? "warn" : ""}" href="#/admin/clanarina">${ICON.calendar}<span>Probni period: još ${dani(s.days_left)} (do ${fmtDate(s.access_until)}).</span><b>Članarina →</b></a>`;
  if (s.days_left <= 5) return `<a class="sub-banner warn" href="#/admin/clanarina">${ICON.calendar}<span>Članarina ističe za ${dani(s.days_left)} (${fmtDate(s.access_until)}).</span><b>Produžite →</b></a>`;
  return "";
}

/* ---------------------------------------------------------------- registracija */

export function registerScreen(done = false) {
  if (done) return `
    <section class="welcome-card narrow">
      <div class="welcome-mark">${BRAND_MARK}</div>
      <h1>Proverite mejl.</h1>
      <p class="lead">Poslali smo vam link za potvrdu naloga. Kada ga otvorite, vratite se ovde i prijavite se.</p>
      <a class="btn" href="#/admin">Na prijavu</a>
    </section>`;
  return `
    <section class="welcome-card narrow">
      <p class="eyebrow">Korak po korak · za stručnjake</p>
      <h1>Napravite nalog</h1>
      <p class="lead">Prvih ${P.trialDays || 30} dana je besplatno, bez kartice i bez obaveze.</p>
      <form id="register-form" class="panel">
        <div class="field"><label for="r-name">Ime i prezime</label><input class="input" id="r-name" name="full_name" autocomplete="name" placeholder="npr. Ana Petrović" required></div>
        <div class="field"><label for="r-email">Mejl</label><input class="input" id="r-email" name="email" type="email" autocomplete="username" required></div>
        <div class="field"><label for="r-pass">Šifra <small>(najmanje 8 znakova)</small></label><input class="input" id="r-pass" name="password" type="password" minlength="8" autocomplete="new-password" required></div>
        <label class="check"><input type="checkbox" name="terms" required> Prihvatam <a href="#/uslovi" target="_blank">uslove korišćenja i privatnost</a></label>
        <button class="btn btn-lg" type="submit" style="margin-top:14px">Napravi nalog</button>
      </form>
      <p class="muted">Već imate nalog? <a class="btn-link" href="#/admin">Prijavite se</a></p>
    </section>`;
}

export async function submitRegister(data) {
  const name = (data.full_name || "").trim();
  const r = await signUp(data.email.trim(), data.password, name);
  if (r.confirm) return "confirm";
  const me = await api.me();
  setMe(await api.saveProfile({ full_name: name, first_name: name.split(/\s+/)[0] || "" }));
  return me ? "ok" : "ok";
}

/* ---------------------------------------------------------------- profil */

export function profileView(firstTime = false) {
  const p = P.me.profile;
  const photo = P.draftPhoto !== null ? P.draftPhoto : p.photo;
  const f = (name, label, value, hint = "", ph = "") => `
    <div class="field"><label>${label}${hint ? ` <small>${hint}</small>` : ""}</label>
      <input class="input" name="${name}" value="${esc(value || "")}" placeholder="${esc(ph)}" data-live></div>`;
  const ta = (name, label, value, hint = "", ph = "", rows = 3) => `
    <div class="field"><label>${label}${hint ? ` <small>${hint}</small>` : ""}</label>
      <textarea class="input" name="${name}" rows="${rows}" placeholder="${esc(ph)}" data-live>${esc(value || "")}</textarea></div>`;
  return `
    <div class="page-head">
      <p class="eyebrow">${firstTime ? "Dobro došli u Korak po korak" : "Podešavanja"}</p>
      <h1>${firstTime ? "Predstavite se porodicama." : "Moj profil"}</h1>
      <p class="lead">Ovo porodice vide u aplikaciji: vaše ime, fotografiju i reč dobrodošlice. Desno vidite kako to izgleda.</p>
    </div>
    <div class="profile-grid">
      <form id="profile-form" class="panel">
        <div class="photo-row">
          <div class="photo-pick">${photo ? `<img src="${photo}" alt="">` : `<span>${esc(PROFILE.inicijali)}</span>`}</div>
          <div>
            <label class="btn-ghost file-btn">${ICON.upload} ${photo ? "Promeni fotografiju" : "Dodaj fotografiju"}<input type="file" id="photo-input" accept="image/*" hidden></label>
            ${photo ? `<button type="button" class="btn-link danger" data-action="remove-photo">Ukloni</button>` : ""}
            <p class="muted small">Najbolje portret, lice u sredini. Slika se sama iseče i smanji.</p>
          </div>
        </div>
        ${f("full_name", "Ime i prezime", p.full_name, "", "Ana Petrović")}
        <div class="two">
          ${f("first_name", "Kako vas porodice zovu", p.first_name, "", "Ana")}
          ${f("title", "Zvanje", p.title, "", "Master logoped")}
        </div>
        <div class="two">
          ${f("name_dative", "Kome?", p.name_dative, "„pošaljite poruku …“", "Ani")}
          ${f("name_genitive", "Od koga?", p.name_genitive, "„podrška …“", "Ane")}
        </div>
        ${f("role", "Kratko o vama", p.role, "jedan red ispod imena", "Logoped · rad sa porodicom")}
        ${ta("bio", "O vašem radu", p.bio, "", "Podršku povezujemo sa interesovanjima deteta…", 3)}
        ${f("motto", "Moto", p.motto, "", "Postepeno. U svom ritmu. Ka uspehu.")}
        ${ta("welcome", "Reč dobrodošlice", p.welcome, "porodica je vidi na početku programa", DEFAULT_WELCOME, 4)}
        <h3 class="ed-h">Obaveštenja na mejl <small class="muted">(${esc(p.email)})</small></h3>
        <label class="check"><input type="checkbox" name="notify_messages" ${p.notify_messages ? "checked" : ""}> Odmah kada mi porodica pošalje poruku</label>
        <label class="check"><input type="checkbox" name="notify_digest" ${p.notify_digest ? "checked" : ""}> Jednom dnevno – pregled zapažanja i osvrta</label>
        <div class="modal-actions"><button class="btn btn-lg" type="submit">Sačuvaj profil</button>${firstTime ? `<a class="btn-link" href="#/admin">Kasnije</a>` : ""}</div>
      </form>
      <div class="profile-preview">
        <p class="eyebrow">Ovako vas vidi porodica</p>
        <div id="live-preview">${previewCard()}</div>
      </div>
    </div>`;
}

export function previewCard() {
  const photo = P.draftPhoto !== null ? P.draftPhoto : PROFILE.foto;
  return `
    <div class="pv-card">
      <div class="pv-head">
        <span class="avatar big">${photo ? `<img src="${photo}" alt="">` : ""}${esc(PROFILE.inicijali)}</span>
        <div><strong>${esc(PROFILE.ime)}</strong><small>${esc(PROFILE.titula || PROFILE.kratko)}</small></div>
      </div>
      <div class="pv-welcome">
        <p class="eyebrow">Reč od ${esc(PROFILE.imeGenitiv)}</p>
        <p>${esc(PROFILE.dobrodoslica)}</p>
        <p class="sign">— ${esc(PROFILE.imeKratko)}</p>
      </div>
      <p class="muted small">U meniju: „Podrška ${esc(PROFILE.imeGenitiv)}“ · „Pišite ${esc(PROFILE.imeDativ)}“</p>
    </div>`;
}

/* uživo osvežava pregled dok stručnjak kuca */
export function onProfileInput(form) {
  const d = Object.fromEntries(new FormData(form));
  applyProfile({ ...P.me.profile, ...d, photo: P.draftPhoto !== null ? P.draftPhoto : P.me.profile.photo });
  const el = document.getElementById("live-preview");
  if (el) el.innerHTML = previewCard();
}

export async function pickPhoto(file) {
  if (!file || !file.type.startsWith("image/")) return toast("Izaberite sliku.");
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  // kvadrat iz sredine, malo iznad centra (lice je obično u gornjem delu)
  const sx = (bmp.width - side) / 2, sy = Math.max(0, (bmp.height - side) * 0.3);
  const c = document.createElement("canvas");
  c.width = c.height = 400;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 400, 400);
  ctx.drawImage(bmp, sx, sy, side, side, 0, 0, 400, 400);
  bmp.close && bmp.close();
  P.draftPhoto = c.toDataURL("image/jpeg", 0.85);
}

export async function saveProfile(form) {
  const d = Object.fromEntries(new FormData(form));
  const payload = {
    full_name: d.full_name || "", first_name: d.first_name || "", name_dative: d.name_dative || "", name_genitive: d.name_genitive || "",
    title: d.title || "", role: d.role || "", bio: d.bio || "", motto: d.motto || "", welcome: d.welcome || "",
    notify_messages: Boolean(d.notify_messages), notify_digest: Boolean(d.notify_digest),
  };
  if (P.draftPhoto !== null) payload.photo = P.draftPhoto;
  setMe(await api.saveProfile(payload));
  P.draftPhoto = null;
}

/* ---------------------------------------------------------------- članarina */

export function billingView() {
  const s = P.me.status, pay = P.me.payment, p = P.me.profile;
  const state = s.owner ? ["ok", "Vlasnik platforme", "Vaš nalog nema ograničenja."]
    : s.paused ? ["bad", "Nalog je pauziran", "Javite se vlasniku platforme."]
    : !s.active ? ["bad", "Članarina je istekla", `Istekla je ${fmtDate(s.access_until)} Porodice imaju pristup do ${fmtDate(s.family_until)}`]
    : s.trial ? ["ok", "Probni period", `Besplatno do ${fmtDate(s.access_until)} – još ${dani(s.days_left)}.`]
    : ["ok", "Članarina je aktivna", `Plaćeno do ${fmtDate(s.access_until)} – još ${dani(s.days_left)}.`];
  const row = (label, value, copy = true) => value ? `
    <div class="pay-row"><span>${label}</span><b>${esc(value)}</b>${copy ? `<button class="icon-btn" data-copy="${esc(value)}" title="Kopiraj">${ICON.copy}</button>` : ""}</div>` : "";
  const ready = pay.account && pay.recipient;
  return `
    <div class="page-head">
      <p class="eyebrow">Nalog</p>
      <h1>Članarina</h1>
      <p class="lead">Jedna mesečna članarina – neograničen broj porodica i programa.</p>
    </div>
    <div class="billing-grid">
      <div class="panel status-card ${state[0]}">
        <p class="eyebrow">Status</p>
        <h2>${state[1]}</h2>
        <p>${state[2]}</p>
        ${s.owner ? "" : `<div class="meter"><i style="width:${Math.max(0, Math.min(100, (s.days_left / 30) * 100))}%"></i></div>`}
        <ul class="muted small">
          <li>Kada članarina istekne, ništa se ne briše.</li>
          <li>Vi i dalje vidite sve, ali izmene nisu moguće dok se ne produži.</li>
          <li>Porodice imaju pristup još ${dani(pay.grace_days)} posle isteka.</li>
        </ul>
      </div>
      <div class="panel">
        <p class="eyebrow">Kako da platim</p>
        <h2>${rsd(pay.price_rsd)} <small class="muted">mesečno</small></h2>
        ${ready ? `
          <p class="muted">Uplatite iz mobilnog bankarstva ili uplatnicom:</p>
          ${row("Primalac", pay.recipient)}
          ${row("Račun primaoca", pay.account)}
          ${row("Iznos", String(pay.price_rsd) + ",00")}
          ${row("Svrha uplate", pay.purpose)}
          ${row("Model", pay.model, false)}
          ${row("Poziv na broj", p.ref_code)}
          <p class="muted small">Poziv na broj je vaš lični broj – po njemu prepoznajemo uplatu. Možete platiti i više meseci odjednom.</p>
          ${pay.pay_note ? `<p class="note-box small">${esc(pay.pay_note)}</p>` : ""}`
        : `<p class="muted">Podaci za uplatu još nisu objavljeni. Do tada koristite probni period – ništa ne morate da radite.</p>`}
      </div>
    </div>`;
}

/* ---------------------------------------------------------------- vlasnik platforme */

function proState(s) {
  if (s.owner) return ["vlasnik", "ok"];
  if (s.paused) return ["pauziran", "bad"];
  if (!s.active) return [`isteklo ${fmtDate(s.access_until)}`, "bad"];
  if (s.trial) return [`proba do ${fmtDate(s.access_until)}`, "trial"];
  return [`plaćeno do ${fmtDate(s.access_until)}`, s.days_left <= 5 ? "warn" : "ok"];
}

export function ownerView() {
  const o = P.owner, st = o.settings;
  const pros = o.pros.filter(x => !x.status.owner);
  const paid = pros.filter(x => x.status.active && !x.status.trial && !x.status.paused);
  const trial = pros.filter(x => x.status.active && x.status.trial && !x.status.paused);
  const expired = pros.filter(x => !x.status.active || x.status.paused);
  const soon = pros.filter(x => x.status.active && x.status.days_left <= 7);
  const F = P.ownerFilter;
  const list = (F === "placeno" ? paid : F === "proba" ? trial : F === "isteklo" ? expired : F === "uskoro" ? soon : o.pros);
  return `
    <div class="page-head">
      <p class="eyebrow">Vlasnik platforme</p>
      <h1>Stručnjaci i članarine</h1>
      <p class="lead">Kada vidite uplatu na računu, nađite stručnjaka po pozivu na broj i kliknite „+1 mesec“.</p>
    </div>
    <div class="stat-row">
      <div class="stat"><b>${paid.length}</b><span>plaćenih<br>članarina</span></div>
      <div class="stat"><b>${trial.length}</b><span>u probnom<br>periodu</span></div>
      <div class="stat"><b>${rsd(paid.length * st.price_rsd)}</b><span>mesečno<br>(trenutno plaćeni)</span></div>
    </div>
    <div class="chip-row owner-filter">
      ${[["svi", `Svi (${o.pros.length})`], ["uskoro", `Ističe uskoro (${soon.length})`], ["placeno", `Plaćeno (${paid.length})`], ["proba", `Proba (${trial.length})`], ["isteklo", `Isteklo / pauza (${expired.length})`]]
        .map(([k, l]) => `<button class="chip ${F === k ? "active" : ""}" data-action="owner-filter" data-f="${k}">${l}</button>`).join("")}
    </div>
    <div class="fam-list">${list.map(x => {
      const [label, cls] = proState(x.status);
      return `
      <div class="fam-card pro-card">
        <span class="avatar">${esc((x.full_name || x.email || "?")[0].toUpperCase())}</span>
        <span class="fam-main">
          <b>${esc(x.full_name || "(bez imena)")} <em class="state ${cls}">${label}</em></b>
          <small>${esc(x.email)}${x.title ? " · " + esc(x.title) : ""}</small>
          <small class="muted">Poziv na broj: <b>${esc(x.ref_code || "–")}</b> · porodica: ${x.families}${x.test_families ? ` (+${x.test_families} test)` : ""} · zapažanja 30 dana: ${x.obs_30d} · prijava: ${relTime(x.last_login_at)}</small>
          ${x.owner_note ? `<small class="muted">Napomena: ${esc(x.owner_note)}</small>` : ""}
        </span>
        ${x.status.owner ? "" : `<span class="pro-actions">
          <button class="btn" data-action="owner-extend" data-id="${x.id}" data-days="30">+1 mesec</button>
          <button class="btn-ghost" data-action="owner-extend" data-id="${x.id}" data-days="90">+3</button>
          <button class="btn-ghost" data-action="owner-extend" data-id="${x.id}" data-days="365">+12</button>
          <button class="btn-link" data-action="owner-note" data-id="${x.id}">Napomena</button>
          <button class="btn-link ${x.status.paused ? "" : "danger"}" data-action="owner-pause" data-id="${x.id}" data-paused="${x.status.paused ? "0" : "1"}">${x.status.paused ? "Aktiviraj" : "Pauziraj"}</button>
        </span>`}
      </div>`;
    }).join("") || `<p class="muted">Nema stručnjaka u ovoj grupi.</p>`}</div>

    <h2 class="section-title">Podešavanja naplate</h2>
    <form id="owner-settings" class="panel">
      <div class="two">
        <div class="field"><label>Cena (din mesečno)</label><input class="input" name="price_rsd" type="number" min="0" value="${st.price_rsd}"></div>
        <div class="field"><label>Probni period (dana)</label><input class="input" name="trial_days" type="number" min="0" value="${st.trial_days}"></div>
      </div>
      <div class="two">
        <div class="field"><label>Primalac <small>(ime firme / preduzetnika, adresa)</small></label><input class="input" name="recipient" value="${esc(st.recipient)}"></div>
        <div class="field"><label>Račun primaoca</label><input class="input" name="account" value="${esc(st.account)}" placeholder="160-0000000000000-00"></div>
      </div>
      <div class="two">
        <div class="field"><label>Svrha uplate</label><input class="input" name="purpose" value="${esc(st.purpose)}"></div>
        <div class="field"><label>Model</label><input class="input" name="model" value="${esc(st.model)}"></div>
      </div>
      <div class="two">
        <div class="field"><label>Napomena uz uplatu</label><input class="input" name="pay_note" value="${esc(st.pay_note)}"></div>
        <div class="field"><label>Pristup porodica posle isteka (dana)</label><input class="input" name="grace_days" type="number" min="0" value="${st.grace_days}"></div>
      </div>
      <p class="muted small">Dok račun i primalac nisu upisani, stručnjaci vide da podaci za uplatu još nisu objavljeni.</p>
      <button class="btn" type="submit">Sačuvaj podešavanja</button>
    </form>`;
}
