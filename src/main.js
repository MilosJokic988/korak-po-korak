/* Korak po korak – ulazna tačka: rute, okvir stranice i događaji.

   #/                   ulaz za porodice (kod) ili program porodice
   #/p/KOD              lični link porodice
   #/plan, #/aktivnosti, #/zapazanja, #/podrska, #/procena
   #/admin…             deo za stručnjaka
   #/pregled/<strana>   pregled programa „kao roditelj“ (iz editora)            */

import "./style.css";
import { configured, takeRecoveryFromUrl, getSession, signOut, platformPublic } from "./api.js";
import { PROFILE, applyProfile } from "./config.js";
import { $, esc, toast, closeModal, modalOpen, ICON, BRAND_MARK, store, formCode } from "./util.js";
import * as fam from "./family.js";
import * as adm from "./admin.js";
import * as editor from "./editor.js";

const content = $("#content");
const FAMILY_PAGES = ["plan", "aktivnosti", "zapazanja", "podrska", "procena", "vizuelno"];
let route = null;
let previewReturn = "#/admin";

$("#brand-mark").innerHTML = BRAND_MARK;

/* ---------------------------------------------------------------- RUTA */

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const parts = raw.split(/[/?]/).filter(Boolean);
  if (parts[0] === "admin") return { app: "admin", ...adm.parse(parts) };
  if (parts[0] === "pregled") return { app: "preview", page: FAMILY_PAGES.includes(parts[1]) ? parts[1] : "plan" };
  if (parts[0] === "p" && parts[1]) return { app: "link", code: parts[1] };
  if (parts[0] === "za-strucnjake") return { app: "landing" };
  if (parts[0] === "uslovi") return { app: "terms" };
  if (FAMILY_PAGES.includes(parts[0])) return { app: "family", page: parts[0] };
  return { app: "family", page: "plan" };
}

/* ---------------------------------------------------------------- OKVIR */

function setShell(kind, active) {
  const nav = kind === "admin" ? adm.nav() : kind === "welcome" ? [] : fam.navItems();
  const base = kind === "preview" ? "#/pregled/" : "#/";
  const unread = kind === "family" ? fam.unreadCount() : 0;
  const link = n => (kind === "admin" ? n.href : base + n.page);
  $("#nav").innerHTML = nav.map(n => `<a href="${link(n)}" class="${n.page === active ? "active" : ""}">${n.icon}<span>${esc(n.label)}</span>${n.page === "podrska" && unread ? `<i class="dot">${unread}</i>` : ""}</a>`).join("")
    + (kind === "admin" && adm.loggedIn() ? `<a href="#/admin" data-action="logout" class="nav-logout">${ICON.logout}<span>Odjava</span></a>` : "");
  $("#bottom-nav").innerHTML = kind === "admin" ? "" : nav.map(n => `<a href="${link(n)}" class="${n.page === active ? "active" : ""}">${n.icon}<span>${esc(n.short)}</span>${n.page === "podrska" && unread ? `<i class="dot">${unread}</i>` : ""}</a>`).join("");
  document.body.classList.toggle("has-bottom-nav", kind !== "admin" && kind !== "welcome");
  document.body.classList.toggle("is-admin", kind === "admin");
  $("#side-label").textContent = kind === "admin" ? "Stručnjak" : kind === "welcome" ? "" : "Vaš porodični prostor";
  $("#brand").href = kind === "admin" ? "#/admin" : "#/";
  const s = getSession();
  const avatar = `<span class="avatar">${PROFILE.avatar ? `<img src="${PROFILE.avatar}" alt="">` : ""}${esc(PROFILE.inicijali)}</span>`;
  $("#side-foot").innerHTML = kind === "admin"
    ? (adm.loggedIn() ? `<div class="person">${avatar}<div><strong>${esc(PROFILE.ime)}</strong><small>${esc((s && s.email) || "")}</small></div></div>` : "")
    : kind === "welcome" ? ""
    : `<div class="person">${avatar}<div><strong>${esc(PROFILE.ime)}</strong><small>${esc(PROFILE.kratko)}</small></div></div>
       ${kind === "family" ? `<a class="workspace" href="#/podrska">Pišite ${esc(PROFILE.imeDativ)} <span>↗</span></a>` : ""}`;
  $("#sidebar").classList.toggle("hidden-nav", kind === "welcome");
}

function setCrumb(text) {
  $("#crumbs").innerHTML = `Program podrške porodici <span>/</span> <strong>${esc(text)}</strong>`;
  document.title = text ? `${text} · Korak po korak` : "Korak po korak";
}

/* ---------------------------------------------------------------- EKRANI */

function welcomeScreen(error = "") {
  return `
    <section class="welcome-card">
      <div class="welcome-mark">${BRAND_MARK}</div>
      <p class="eyebrow">Korak po korak · program podrške porodici</p>
      <h1>Dobro došli u vaš porodični prostor.</h1>
      <p class="lead">Upišite kod porodice koji ste dobili od svog stručnjaka, ili otvorite lični link iz poruke.</p>
      <form id="code-form" class="code-form">
        <input class="input code-input" name="code" id="code-input" placeholder="npr. K7MQ-4XPA" autocomplete="off" autocapitalize="characters" spellcheck="false" required>
        <button class="btn btn-lg" type="submit">Uđi</button>
      </form>
      ${error ? `<p class="form-error">${esc(error)}</p>` : ""}
      <div class="welcome-links">
        <a class="btn-link" href="#/admin">Prijava za stručnjake</a>
        <span>·</span>
        <a class="btn-link" href="#/za-strucnjake">Vi ste stručnjak? Saznajte više →</a>
      </div>
    </section>`;
}

function pausedScreen() {
  return `
    <section class="welcome-card">
      <div class="welcome-mark">${BRAND_MARK}</div>
      <p class="eyebrow">Korak po korak</p>
      <h1>Program je trenutno pauziran.</h1>
      <p class="lead">Vaše beleške su sačuvane i biće tu kada se program nastavi. Za sve informacije javite se svom stručnjaku.</p>
      <button class="btn" data-action="retry">Pokušaj ponovo</button>
      <div class="welcome-links"><a class="btn-link" href="#/" data-action="forget-code">Uđi sa drugim kodom</a></div>
    </section>`;
}

/* Javna stranica za stručnjake – „prodajna“ strana. */
let pub = null;
function landingScreen() {
  const price = pub ? pub.price_rsd.toLocaleString("sr-RS") : "1.500";
  const trial = pub ? pub.trial_days : 30;
  const F = [
    [ICON.book, "Biblioteka i gotovi šabloni", "24 gotove igre u 6 oblasti i 4 programa od po četiri nedelje – prvi program napravite za minut."],
    [ICON.upload, "Ili svoj program", "Složite sopstveni program u uređivaču – aktivnosti, nedelje, procena, slike."],
    [ICON.calendar, "Plan za danas", "Porodica svakog dana dobija tri male stvari: jutro, igru dana i večernje smirivanje."],
    [ICON.note, "Zapažanja stižu vama", "Roditelji jednim klikom beleže kako je prošlo. Vi vidite kalendar, šta prija i šta ne."],
    [ICON.chat, "Poruke na jednom mestu", "Bez izgubljenih Viber poruka – razgovor sa svakom porodicom uz njen program."],
    [ICON.users, "Vaš lični brend", "Vaše ime, fotografija i reč dobrodošlice. Porodica vidi vas, ne aplikaciju."],
    [ICON.eye, "Moj dan", "Ujutru odmah vidite kome treba odgovor, ko je tih i kome ističe program."],
  ];
  return `
    <section class="landing">
      <div class="landing-hero">
        <div class="welcome-mark">${BRAND_MARK}</div>
        <p class="eyebrow">Korak po korak · za defektologe, logopede i terapeute</p>
        <h1>Programi podrške porodici – bez papira i haosa.</h1>
        <p class="lead">Vi pravite program, porodica ga ima u telefonu, a vi pratite napredak iz dana u dan. Jednostavno za vas, još jednostavnije za roditelje.</p>
        <div class="landing-cta">
          <a class="btn btn-lg" href="#/admin/registracija">Probajte besplatno ${trial} dana</a>
          <a class="btn-ghost btn-lg" href="#/admin">Već imam nalog</a>
        </div>
        <p class="muted small">Bez kartice. Posle probnog perioda ${price} din mesečno.</p>
      </div>
      <div class="landing-grid">${F.map(([i, t, d]) => `<div class="landing-feat">${i}<h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
      <div class="landing-price panel">
        <div>
          <p class="eyebrow">Jedna cena, sve uključeno</p>
          <h2>${price} din <small>/ mesečno</small></h2>
          <ul>
            <li>neograničen broj porodica i programa</li>
            <li>aplikacija za roditelje (telefon, tablet, računar)</li>
            <li>obaveštenja o porukama i zapažanjima</li>
            <li>prvih ${trial} dana besplatno, bez obaveze</li>
          </ul>
        </div>
        <a class="btn btn-lg" href="#/admin/registracija">Napravite nalog</a>
      </div>
      <p class="muted small landing-foot"><a href="#/uslovi">Uslovi korišćenja i privatnost</a> · <a href="#/">Ulaz za porodice</a></p>
    </section>`;
}

function termsScreen() {
  return `
    <section class="welcome-card narrow terms">
      <p class="eyebrow">Korak po korak</p>
      <h1>Uslovi korišćenja i privatnost</h1>
      <h3>Šta je Korak po korak</h3>
      <p>Alat za stručnjake (defektologe, logopede, terapeute) za vođenje programa podrške porodici. Aplikacija nije medicinski uređaj i ne postavlja dijagnoze; sadržaj programa pripremaju stručnjaci i za njega odgovaraju.</p>
      <h3>Podaci</h3>
      <p>Podaci se čuvaju na serverima u Evropskoj uniji. Svaki stručnjak vidi samo svoje porodice, a svaka porodica samo svoj program. Porodice ulaze sa ličnim kodom, bez prezimena i ličnih dokumenata. Na zahtev stručnjaka ili porodice podaci se brišu.</p>
      <h3>Članarina</h3>
      <p>Prvi deo korišćenja je besplatan (probni period). Posle toga se plaća mesečna članarina. Ako se članarina ne produži, nalog prelazi u režim čitanja, a porodice još nekoliko dana imaju pristup; ništa se ne briše.</p>
      <h3>Kontakt</h3>
      <p>Za pitanja i brisanje podataka javite se vlasniku platforme.</p>
      <p class="muted small">Ovo je kratka verzija; pre javnog pokretanja tekst treba da pregleda pravnik.</p>
      <a class="btn-link" href="#/za-strucnjake">← Nazad</a>
    </section>`;
}

function notConfiguredScreen() {
  return `
    <section class="welcome-card">
      <p class="eyebrow">Podešavanje</p>
      <h1>Aplikacija još nije povezana sa bazom.</h1>
      <p class="lead">Dodajte <code>VITE_SUPABASE_URL</code> i <code>VITE_SUPABASE_ANON_KEY</code> (lokalno u fajl <code>.env</code>, a na Vercel-u u Settings → Environment Variables) i ponovo pokrenite aplikaciju. Uputstvo je u fajlu README.md.</p>
      <p class="lead">Proverite i da vrednosti nisu zamenjene: <code>VITE_SUPABASE_URL</code> počinje sa <code>https://</code> i završava se sa <code>.supabase.co</code>, a <code>VITE_SUPABASE_ANON_KEY</code> počinje sa <code>sb_publishable_</code>.</p>
    </section>`;
}

function errorScreen(msg) {
  return `<section class="welcome-card"><h1>Nešto nije u redu.</h1><p class="lead">${esc(msg)}</p><button class="btn" data-action="retry">Pokušaj ponovo</button></section>`;
}

/* ---------------------------------------------------------------- RENDER */

async function render(keepScroll = false) {
  route = parseHash();
  const y = window.scrollY;
  $("#sidebar").classList.remove("open");

  if (!configured) { setShell("welcome"); setCrumb(""); content.innerHTML = notConfiguredScreen(); return; }

  try {
    if (route.app === "link") {
      const code = formCode(route.code).replace("-", "");
      store.set("code", code);
      history.replaceState(null, "", location.pathname + "#/plan");
      return render();
    }

    if (route.app === "landing" || route.app === "terms") {
      setShell("welcome"); setCrumb(route.app === "landing" ? "Za stručnjake" : "Uslovi korišćenja");
      if (route.app === "landing" && !pub) { try { pub = await platformPublic(); } catch {} }
      content.innerHTML = route.app === "landing" ? landingScreen() : termsScreen();
    } else if (route.app === "admin") {
      setShell("admin", adm.activeNav(route));
      if (!keepScroll) content.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
      await adm.load(route);
      setShell("admin", adm.activeNav(route));
      setCrumb(adm.crumb(route));
      content.innerHTML = adm.render(route);
      adm.afterRender(content, route);
    } else if (route.app === "preview") {
      if (!fam.isPreview()) { location.hash = previewReturn; return; }
      setShell("preview", route.page);
      setCrumb("Pregled: " + fam.crumb(route.page));
      content.innerHTML = fam.render(route.page);
      fam.afterRender(content);
    } else {
      if (fam.isPreview()) fam.exitPreview();
      const code = store.get("code", null);
      if (!code) { setShell("welcome"); setCrumb(""); content.innerHTML = welcomeScreen(); return; }
      if (!fam.hasData()) {
        content.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
        try { await fam.load(code); }
        catch (e) {
          if (e.code === "P0003" || /pauziran/i.test(e.message)) { setShell("welcome"); setCrumb(""); content.innerHTML = pausedScreen(); return; }
          if (e.code === "P0002" || /kod/i.test(e.message)) { store.del("code"); setShell("welcome"); setCrumb(""); content.innerHTML = welcomeScreen(e.message); return; }
          throw e;
        }
      }
      setShell("family", route.page === "procena" ? "plan" : route.page);
      setCrumb(fam.crumb(route.page));
      content.innerHTML = fam.render(route.page);
      fam.afterRender(content);
      fam.onPageShown(route.page);
      setShell("family", route.page === "procena" ? "plan" : route.page);
    }
  } catch (e) {
    content.innerHTML = errorScreen(e.message || "Greška.");
  }
  window.scrollTo(0, keepScroll ? y : 0);
}

const rerender = (keep = true) => render(keep);

/* Pregled iz editora */
const ctx = {
  preview(program, family) {
    previewReturn = location.hash || "#/admin";
    fam.setPreview(program, family, editor.imgFetcher);
    location.hash = "#/pregled/plan";
  },
};

/* ---------------------------------------------------------------- DOGAĐAJI */

const appOf = () => (route && route.app === "admin" ? "admin" : "family");

document.addEventListener("click", e => {
  const t = e.target.closest("[data-close],[data-action],[data-open],[data-steps],[data-step],[data-timer],[data-quick],[data-group],[data-filter],[data-tab],[data-tried],[data-del-note],[data-del-review],[data-note-for],[data-zoom],[data-scroll],[data-ed],[data-atab],[data-plan],[data-routine],[data-plan-from-modal]");
  if (!t) return;
  if (t.dataset.close !== undefined) { closeModal(); return; }
  if (t.dataset.action === "retry") { render(); return; }
  if (t.dataset.action === "forget-code") { store.del("code"); applyProfile(null); return; }
  if (t.dataset.action === "logout") { e.preventDefault(); signOut().then(() => { location.hash = "#/admin"; render(); }); return; }
  if (t.dataset.action === "exit-preview") { fam.exitPreview(); location.hash = previewReturn; return; }
  if (appOf() === "admin") adm.onClick(e, t, rerender, ctx);
  else fam.onClick(e, t, rerender);
});

document.addEventListener("input", e => {
  if (appOf() === "admin") adm.onInput(e); else fam.onInput(e);
});

document.addEventListener("change", e => {
  if (appOf() === "admin") adm.onChange(e, rerender);
});

document.addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.id === "code-form") {
    const code = formCode(new FormData(e.target).get("code")).replace("-", "");
    if (code.length < 8) { toast("Kod ima 8 znakova, npr. K7MQ-4XPA."); return; }
    store.set("code", code);
    render();
    return;
  }
  if (appOf() === "admin") adm.onSubmit(e, rerender); else fam.onSubmit(e, rerender);
});

document.addEventListener("dragover", e => { if (e.target.closest("#dropzone")) { e.preventDefault(); e.target.closest("#dropzone").classList.add("over"); } });
document.addEventListener("dragleave", e => { const z = e.target.closest("#dropzone"); if (z) z.classList.remove("over"); });
document.addEventListener("drop", e => { if (e.target.closest("#dropzone")) { e.preventDefault(); adm.onDrop(e, rerender); } });

document.addEventListener("keydown", e => { if (e.key === "Escape" && modalOpen()) closeModal(); });
$("#menu-btn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

window.addEventListener("hashchange", () => { fam.stopAll(); if (modalOpen()) closeModal(); adm.beforeLeave(); render(false); });
window.addEventListener("beforeunload", () => adm.beforeLeave());

/* Osveži podatke porodice kada se aplikacija ponovo otvori (npr. stigla poruka). */
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState !== "visible" || !route || route.app !== "family" || !fam.hasData() || modalOpen()) return;
  const code = store.get("code", null);
  if (code && await fam.load(code, { quiet: true })) render(true);
});

/* ---------------------------------------------------------------- START */

takeRecoveryFromUrl();
render();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
