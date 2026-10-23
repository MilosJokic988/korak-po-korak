/* Podešavanja aplikacije koja se retko menjaju. */

// Prihvata i adresu sa "/rest/v1" ili razmakom na kraju (česta greška pri kopiranju).
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "").replace(/\/(rest|auth)\/v1$/, "").replace(/\/+$/, "");
export const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
export const AI_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || "/api/ai";

/* Profil stručnjaka. Na početku je opšti; posle učitavanja se popunjava
   iz baze (applyProfile) – svi delovi aplikacije čitaju ga uživo. */
export const DEFAULT_WELCOME = "Drago mi je što ste tu. Ovde je sve što smo zajedno isplanirali za vaše dete. Ne morate uraditi sve – dovoljno je malo, ali redovno. Svaki dan vas čeka kratak plan, a kad god vam nešto nije jasno ili imate dan kada ništa ne ide, pišite mi. Tu sam.";

export const PROFILE = {
  ime: "Vaš stručnjak",
  imeKratko: "stručnjak",
  imeDativ: "stručnjaku",
  imeGenitiv: "stručnjaka",
  imeAkuzativ: "stručnjaka",
  inicijali: "KK",
  titula: "",
  uloga: "",
  kratko: "Podrška porodici",
  opis: "Podršku povezujemo sa interesovanjima deteta, njegovim razvojnim potrebama i svakodnevicom vaše porodice.",
  citat: "Postepeno. U svom ritmu. Ka uspehu.",
  foto: "",
  avatar: "",
  dobrodoslica: DEFAULT_WELCOME,
};

const BLANK = { ...PROFILE };

export function applyProfile(pro) {
  if (!pro) { Object.assign(PROFILE, BLANK); return PROFILE; }
  const full = (pro.full_name || "").trim();
  const first = (pro.first_name || full.split(/\s+/)[0] || "").trim();
  const initials = full ? full.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() : BLANK.inicijali;
  Object.assign(PROFILE, {
    ime: full || BLANK.ime,
    imeKratko: first || BLANK.imeKratko,
    imeDativ: (pro.name_dative || "").trim() || first || BLANK.imeDativ,
    imeGenitiv: (pro.name_genitive || "").trim() || first || BLANK.imeGenitiv,
    imeAkuzativ: first || BLANK.imeAkuzativ,
    inicijali: initials,
    titula: pro.title || "",
    uloga: pro.role || "",
    kratko: pro.role || pro.title || BLANK.kratko,
    opis: pro.bio || BLANK.opis,
    citat: pro.motto || BLANK.citat,
    foto: pro.photo || "",
    avatar: pro.photo || "",
    dobrodoslica: pro.welcome || DEFAULT_WELCOME,
  });
  return PROFILE;
}

// Rečenice kad porodica uradi ceo „Plan za danas“
export const BRAVO = [
  "Bravo! Danas ste uradili sve – i za dete i za vas to je mnogo. 🌱",
  "Ceo plan za danas je gotov. Ponosni budite na sebe. ☀",
  "Uspeli ste! Mali koraci, svaki dan – baš tako se raste. 🌿",
  "Sve tri stvari danas. To je pravi porodični ritam. 💛",
];

export const ISKUSTVA = [
  { id: "prijalo", naziv: "Prijalo je", ikona: "☀", boja: "#3f9a83" },
  { id: "prilagodjavanje", naziv: "Uz prilagođavanje", ikona: "◌", boja: "#d5a24c" },
  { id: "pauza", naziv: "Bila je potrebna pauza", ikona: "☁", boja: "#c98b6b" },
  { id: "istrazujemo", naziv: "Još istražujemo", ikona: "✧", boja: "#a9b4c2" },
];

export const BUDNOST = ["", "Pospano, usporeno", "Mirno i dostupno", "Uzbuđeno, nemirno", "Preopterećeno"];

export const saglasnost = () => `Ovaj program je napravljen samo za vašu porodicu. Zapažanja, nedeljni osvrti i poruke koje ovde upišete čuvaju se bezbedno na serveru u Evropskoj uniji i vidi ih samo ${PROFILE.ime}, radi praćenja napretka i prilagođavanja programa. Vaš lični kod ne delite sa drugima. Podatke možete u svakom trenutku obrisati ili zatražiti njihovo brisanje.`;

export const PODRAZUMEVANI_SAVETI = [
  "Ne morate uraditi sve. Jedna dobra, kratka interakcija može biti sasvim dovoljna za taj dan.",
  "Detetov odgovor je informacija. Ako nešto ne prija, prilagođavanje nije neuspeh – to je praćenje deteta.",
  "Napredak se često vidi u malim stvarima: dužem pogledu, lakšem prelazu, jednom novom pokretu ili trenutku zajedničkog smeha.",
  "Roditelj ne mora da bude terapeut ceo dan. Najvrednije je da podrška može da stane u stvarni život porodice.",
  "Ponavljanje je učenje. Poznata aktivnost nije „premalo“ ako detetu pomaže da bude regulisano, povezano i dostupno.",
  "Odmor roditelja je deo plana podrške. Kada ste iscrpljeni, birajte najjednostavniju verziju aktivnosti ili je tog dana preskočite.",
];

export const cestaPitanja = () => [
  { p: "Da li treba uraditi sve aktivnosti?", o: "Ne. Program je ponuda, a ne obaveza. Izaberite ono što tog dana ima smisla – i jedna aktivnost je dovoljna." },
  { p: `Da li ${PROFILE.imeKratko} vidi moje beleške?`, o: `Da. Zapažanja, nedeljni osvrti i poruke koje sačuvate stižu ${PROFILE.imeDativ}, radi praćenja napretka i prilagođavanja programa. Niko drugi ih ne vidi.` },
  { p: "Šta ako promenim telefon?", o: "Otvorite isti link ili upišite svoj kod porodice – sve vaše beleške su sačuvane i ponovo će se pojaviti." },
  { p: "Kako da instaliram aplikaciju na telefon?", o: "Android (Chrome): meni ⋮ → Instaliraj aplikaciju. iPhone (Safari): dugme za deljenje → Dodaj na početni ekran. Pri prvom otvaranju sa početnog ekrana upišite kod porodice." },
];
