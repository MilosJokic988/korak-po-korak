/* Vizuelna podrška – piktogrami, vrste materijala, gotovi predlošci i smernice po nivou podrške. */

/* Piktogrami su emoji simboli (rade na svakom telefonu i računaru i štampaju se u boji).
   Za decu kojoj treba konkretnije, uz svaku karticu može da se doda fotografija. */
export const PICTO = [
  { id: "dan", title: "Dan i škola", items: [
    ["🚶", "dolazak"], ["🏫", "škola"], ["📚", "rad"], ["✏️", "pisanje"], ["📖", "čitanje"], ["🔢", "matematika"], ["🎨", "crtanje"], ["✂️", "sečenje"],
    ["💻", "računar"], ["🎵", "muzika"], ["⚽", "fizičko"], ["🧸", "igra"], ["🧱", "kocke"], ["🧩", "slagalica"], ["🌳", "napolju"], ["🛝", "park"],
    ["⭕", "krug"], ["🪑", "sedim"], ["⏸️", "pauza"], ["🍎", "užina"], ["🍽️", "ručak"], ["🥤", "piće"], ["🚽", "toalet"], ["🧼", "pranje ruku"],
    ["🪥", "pranje zuba"], ["🛁", "kupanje"], ["👕", "oblačenje"], ["👟", "obuvanje"], ["🧥", "jakna"], ["🎒", "torba"], ["🛏️", "spavanje"], ["🚌", "autobus"],
    ["🚗", "auto"], ["🏠", "kući"], ["🛒", "prodavnica"], ["🩺", "doktor"], ["🦷", "zubar"], ["💇", "frizer"], ["📺", "televizor"], ["📱", "tablet"],
    ["🧑‍🏫", "nastavnik"], ["👩", "mama"], ["👨", "tata"], ["👵", "baka"], ["🧒", "drug"], ["👫", "drugari"], ["🐶", "pas"], ["🎂", "rođendan"],
  ] },
  { id: "kom", title: "Komunikacija", items: [
    ["🙋", "ja"], ["👉", "ti"], ["🫴", "želim"], ["🤲", "daj"], ["👍", "da"], ["👎", "ne"], ["🆘", "pomoć"], ["➕", "još"],
    ["✅", "gotovo"], ["✋", "stop"], ["⏸️", "pauza"], ["⏳", "čekam"], ["❓", "šta"], ["📍", "gde"], ["👤", "ko"], ["🚶", "idemo"],
    ["👀", "gledaj"], ["👂", "slušaj"], ["🤫", "tiho"], ["📦", "otvori"], ["❤️", "volim"], ["💔", "ne volim"], ["🤕", "boli me"], ["🥶", "hladno"],
    ["🥵", "toplo"], ["😋", "gladan"], ["🚰", "žedan"], ["😴", "umoran"], ["👋", "zdravo"], ["🙏", "molim"], ["🤝", "hvala"], ["🔁", "opet"],
  ] },
  { id: "osecanja", title: "Osećanja", items: [
    ["😊", "srećan"], ["😢", "tužan"], ["😠", "ljut"], ["😨", "uplašen"], ["😩", "umoran"], ["🤩", "uzbuđen"], ["😕", "zbunjen"], ["😌", "miran"],
    ["😮", "iznenađen"], ["😤", "frustriran"], ["🤒", "bolestan"], ["😐", "dosadno"], ["🥰", "voljen"], ["😳", "postiđen"], ["😖", "preopterećen"], ["🙂", "dobro"],
  ] },
  { id: "senzorno", title: "Senzorno", items: [
    ["🎧", "slušalice"], ["⛺", "miran kutak"], ["🌀", "ljuljanje"], ["🤸", "trambolina"], ["🦘", "skakanje"], ["🛌", "teško ćebe"], ["🫂", "čvrst zagrljaj"], ["💆", "masaža"],
    ["💪", "teški rad"], ["🛒", "guranje"], ["📦", "nošenje"], ["🧗", "penjanje"], ["💃", "ples"], ["🌬️", "disanje"], ["🫧", "mehurići"], ["🧃", "slamka"],
    ["🍬", "žvakanje"], ["🥕", "hrskavo"], ["🖐️", "dodir"], ["🏖️", "pesak"], ["💦", "voda"], ["🟢", "gnjecalica"], ["🕶️", "naočare"], ["💡", "prigušeno svetlo"],
  ] },
  { id: "pravila", title: "Pravila", items: [
    ["✋", "podigni ruku"], ["🗣️", "jedan po jedan"], ["↔️", "lični prostor"], ["🧺", "pospremi"], ["🪑", "sedi na mesto"], ["🤫", "tiho"], ["👂", "slušaj"], ["⏳", "čekaj red"],
    ["🙌", "ruke kod sebe"], ["🚶", "hodaj"], ["💛", "budi ljubazan"], ["🤝", "deli"], ["👀", "gledaj u tablu"], ["🙋", "pitaj za pomoć"], ["🚫", "ne"], ["⭐", "bravo"],
  ] },
  { id: "vreme", title: "Vreme i nagrade", items: [
    ["⏰", "sat"], ["⏳", "peščani sat"], ["🔔", "zvono"], ["📅", "kalendar"], ["☀️", "jutro"], ["🌤️", "popodne"], ["🌙", "veče"], ["1️⃣", "jedan"],
    ["2️⃣", "dva"], ["3️⃣", "tri"], ["4️⃣", "četiri"], ["5️⃣", "pet"], ["⭐", "zvezdica"], ["🏆", "pehar"], ["🎁", "poklon"], ["🍪", "keks"],
    ["🎮", "igrica"], ["🎈", "balon"], ["🚂", "voz"], ["🦖", "dinosaurus"], ["🚀", "raketa"], ["🌈", "duga"], ["🎉", "slavlje"], ["😀", "osmeh"],
  ] },
];

export const LEVELS = {
  3: { title: "Nivo 3", long: "Nivo 3 – veoma značajna podrška", color: "#c2410c",
    tips: ["1–3 kartice odjednom; prvo – posle je osnova", "Velike kartice, po mogućstvu fotografije stvarnih predmeta", "Jedna reč ili bez teksta – uz pokazivanje i gest", "Objekat prelaza (npr. kašika = ručak)", "Osnovna komunikaciona tabla: želim, još, gotovo, pomoć, ne", "Senzorni raspored svaki dan, predvidivo"] },
  2: { title: "Nivo 2", long: "Nivo 2 – značajna podrška", color: "#a16207",
    tips: ["4–6 kartica, slika + reč", "Tabla izbora sa 2–4 opcije", "Kratke socijalne priče (3–6 rečenica, svaka sa slikom)", "Semafor osećanja (zeleno – žuto – crveno)", "Token tabla sa 5 žetona", "Najava prelaza tajmerom"] },
  1: { title: "Nivo 1", long: "Nivo 1 – potrebna podrška", color: "#15803d",
    tips: ["Raspored celog dana sa vremenom i čeklistom", "Tekst uz manju sliku; učenik sam štiklira", "Vizuelne skripte za razgovor i složenije socijalne situacije", "Skala 1–5 sa strategijama za samoregulaciju", "Token tabla sa 10 žetona ili dogovor", "Senzorni pasoš koji učenik zna da pokaže"] },
};

export const COLS_BY_LEVEL = { 3: 2, 2: 3, 1: 4 };

export const COM_CATS = {
  ljudi: { label: "Ljudi", color: "#fde68a" },
  radnje: { label: "Radnje", color: "#bbf7d0" },
  stvari: { label: "Stvari", color: "#fed7aa" },
  opis: { label: "Opis / osećanja", color: "#bfdbfe" },
  drustvo: { label: "Društvene reči", color: "#fbcfe8" },
  pitanja: { label: "Pitanja", color: "#e9d5ff" },
};

const it = (pic, text, extra = {}) => ({ pic: pic ? "e:" + pic : "", text, ...extra });

/* ---------------------------------------------------------------- vrste */
export const KINDS = [
  { id: "raspored", title: "Vizuelni raspored", icon: "📅", desc: "Redosled aktivnosti tokom dana ili časa – detetu pokazuje šta sledi.", max: 14 },
  { id: "prvoposle", title: "Prvo – posle", icon: "➡️", desc: "Šta prvo radimo i šta sledi posle. Najjednostavniji i najmoćniji alat.", max: 3 },
  { id: "sekvenca", title: "Sekvenca koraka", icon: "🔢", desc: "Koraci jedne rutine: pranje ruku, oblačenje, toalet, pakovanje torbe…", max: 10 },
  { id: "izbori", title: "Tabla izbora", icon: "🫴", desc: "„Šta želiš?“ – izbor između 2 do 9 opcija. Jača autonomiju.", max: 9 },
  { id: "komunikacija", title: "Komunikaciona tabla", icon: "💬", desc: "Osnovne reči i simboli za iskazivanje potreba (potpomognuta komunikacija).", max: 30 },
  { id: "emocije", title: "Emocije i skala", icon: "😊", desc: "Kartice osećanja, semafor ili skala 1–5 sa strategijama smirivanja.", max: 16 },
  { id: "prelaz", title: "Prelaz i tajmer", icon: "⏳", desc: "„Još 5 minuta – sada je vreme za…“ sa odbrojavanjem za skidanje.", max: 0 },
  { id: "prica", title: "Socijalna priča", icon: "📖", desc: "Kratka priča koja objašnjava situaciju i šta se očekuje. Štampa se kao knjižica.", max: 12 },
  { id: "skripta", title: "Vizuelna skripta", icon: "🗨️", desc: "Šta da KAŽEM i URADIM u određenoj situaciji – korak po korak.", max: 8 },
  { id: "pravila", title: "Pravila i podsetnici", icon: "✋", desc: "Vizuelna pravila razreda ili kuće, za stalno mesto na zidu.", max: 10 },
  { id: "tokeni", title: "Token tabla", icon: "⭐", desc: "„Radim za…“ – žetoni koji vode do dogovorene nagrade.", max: 0 },
  { id: "kartice", title: "Kartice za pomoć i pauzu", icon: "🆘", desc: "Male kartice koje dete nosi i pokazuje: pauza, pomoć, toalet, previše je glasno.", max: 12 },
  { id: "senzorni", title: "Nedeljni senzorni raspored", icon: "🌀", desc: "Teški rad, vestibularno, taktilno i oralno-motorno – po danima.", max: 0 },
  { id: "pasos", title: "Senzorni pasoš", icon: "🧠", desc: "Šta detetu smeta, šta pomaže i kako prepoznati preopterećenje.", max: 0 },
  { id: "lowarousal", title: "Low arousal plan", icon: "🌿", desc: "Okidači, rani znaci, šta pomaže, šta izbegavamo i koraci podrške – za dete ili celu grupu.", max: 0 },
];
export const kindOf = id => KINDS.find(k => k.id === id);

export const SENSORY_ROWS = [
  { id: "tesko", title: "Teški rad", sub: "proprioceptivno", color: "#fef3c7", ideas: [["💪", "nošenje knjiga"], ["🛒", "guranje kolica"], ["🧗", "penjanje"], ["📦", "premeštanje kutija"], ["🪑", "pomeranje stolica"], ["🧺", "nošenje korpe"], ["🤸", "puzanje kroz tunel"]] },
  { id: "vest", title: "Vestibularno", sub: "pokret i ravnoteža", color: "#dbeafe", ideas: [["🌀", "ljuljanje"], ["🤸", "trambolina"], ["🦘", "skakanje"], ["💃", "ples"], ["🎠", "vrteška"], ["🚶", "hodanje po liniji"], ["⚽", "lopta za sedenje"]] },
  { id: "takt", title: "Taktilno", sub: "dodir", color: "#dcfce7", ideas: [["🏖️", "kinetički pesak"], ["🖐️", "senzorna kutija"], ["💦", "igra vodom"], ["🟢", "plastelin"], ["🎨", "slikanje prstima"], ["🫘", "pasulj i pirinač"], ["🧸", "mekane igračke"]] },
  { id: "oral", title: "Oralno-motorno", sub: "usta i disanje", color: "#fce7f3", ideas: [["🫧", "duvanje mehurića"], ["🧃", "pijenje na slamku"], ["🥕", "hrskava užina"], ["🌬️", "duvanje perca"], ["🍬", "žvakanje"], ["🎈", "duvanje balona"], ["🎵", "pevanje"]] },
];
export const DAYS = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];

export const PASS_SECTIONS = [
  { id: "sluh", title: "Sluh", sub: "zvuci", icon: "👂", color: "#f59e0b" },
  { id: "vid", title: "Vid", sub: "svetla i boje", icon: "👁️", color: "#16a34a" },
  { id: "dodir", title: "Dodir", sub: "teksture i pritisak", icon: "🖐️", color: "#2563eb" },
  { id: "pokret", title: "Pokret i položaj", sub: "ravnoteža", icon: "🏃", color: "#4f46e5" },
  { id: "miris", title: "Miris i ukus", sub: "hrana, mirisi", icon: "👃", color: "#db2777" },
  { id: "telo", title: "Unutrašnji osećaji", sub: "glad, žeđ, toalet, bol", icon: "🫀", color: "#0d9488" },
];
export const PASS_GEAR = ["Slušalice / čepići za uši", "Naočare za sunce", "Igračka za vrpoljenje", "Voda / grickalica", "Kartice za pauzu i pomoć", "Teški jastučić ili ćebe", "Omiljeni predmet"];

export const LA_COLS = [
  { id: "okidaci", title: "Okidači", sub: "šta može da izazove uznemirenost", color: "#db2777", icon: "⚠️" },
  { id: "rani", title: "Rani znaci", sub: "šta primetimo", color: "#ea8a1a", icon: "👁️" },
  { id: "pomaze", title: "Šta pomaže", sub: "smirujuće strategije", color: "#16a34a", icon: "💚" },
  { id: "izbegavamo", title: "Šta izbegavamo", sub: "ne pomaže", color: "#dc2626", icon: "⛔" },
  { id: "koraci", title: "Plan podrške", sub: "koraci", color: "#2563eb", icon: "📋" },
  { id: "posle", title: "Posle smirivanja", sub: "šta pomaže nakon", color: "#0d9488", icon: "⭐" },
];

export const EMO_SCALE5 = [
  { n: 5, color: "#dc2626", label: "Eksplozija", body: "Vičem, bacam stvari, ne mogu da slušam", help: "Odrasla osoba je mirno uz mene, miran kutak, bez pitanja" },
  { n: 4, color: "#f97316", label: "Jako uznemiren", body: "Stežem pesnice, srce mi lupa, plačem", help: "Slušalice, izlazim na pauzu, teško ćebe" },
  { n: 3, color: "#eab308", label: "Napet", body: "Vrpoljim se, nervira me, glasniji sam", help: "Duboko disanje, gnjecalica, voda" },
  { n: 2, color: "#22c55e", label: "Dobro", body: "Mogu da radim i da slušam", help: "Nastavljam, pohvala" },
  { n: 1, color: "#3b82f6", label: "Miran", body: "Opušten sam, spreman za učenje", help: "Uživam :)" },
];
export const EMO_TRAFFIC = [
  { n: 3, color: "#dc2626", label: "Stani", body: "Previše mi je, uznemiren sam", help: "Miran kutak, slušalice, odrasla osoba uz mene" },
  { n: 2, color: "#eab308", label: "Uspori", body: "Počinje da mi smeta", help: "Pauza, disanje, pokret" },
  { n: 1, color: "#22c55e", label: "Spreman sam", body: "Miran sam i mogu da radim", help: "Nastavljam" },
];

/* ---------------------------------------------------------------- gotovi predlošci
   items[].core = ostaje i za nivo 3 (kraća verzija) */
export const PRESETS = {
  raspored: [
    { title: "Školski dan", data: { orientation: "v", showTime: true, check: true, items: [
      it("🚶", "Dolazak", { time: "8:00", core: true }), it("⭕", "Jutarnji krug", { time: "8:15" }), it("📚", "Rad", { time: "8:30", core: true }), it("⏸️", "Pauza", { time: "9:15" }),
      it("🍎", "Užina", { time: "10:00", core: true }), it("🌳", "Igra napolju", { time: "10:30" }), it("🎨", "Crtanje", { time: "11:00" }), it("🏠", "Kući", { time: "12:00", core: true })] } },
    { title: "Jutro kod kuće", data: { orientation: "v", showTime: true, check: true, items: [
      it("🛏️", "Ustajem", { time: "7:00" }), it("🚽", "Toalet", { time: "7:05", core: true }), it("🧼", "Umivam se"), it("👕", "Oblačim se", { core: true }),
      it("🍽️", "Doručak", { time: "7:30", core: true }), it("🪥", "Perem zube"), it("🎒", "Uzimam torbu"), it("🚌", "Polazim", { time: "7:50", core: true })] } },
    { title: "Popodne i veče", data: { orientation: "v", showTime: true, check: true, items: [
      it("🍽️", "Ručak", { time: "13:00", core: true }), it("🛏️", "Odmor"), it("📚", "Domaći", { time: "15:00" }), it("🛝", "Park", { time: "16:00", core: true }),
      it("📺", "Crtani"), it("🍽️", "Večera", { time: "18:30" }), it("🛁", "Kupanje", { core: true }), it("🛏️", "Spavanje", { time: "20:30", core: true })] } },
    { title: "Struktura časa", data: { orientation: "h", showTime: false, check: true, items: [
      it("⭕", "Pozdrav", { core: true }), it("👂", "Slušam"), it("📚", "Radim zadatak", { core: true }), it("⏸️", "Pauza"), it("✅", "Gotovo", { core: true })] } },
  ],
  prvoposle: [
    { title: "Prvo rad, posle igra", data: { three: false, labels: ["PRVO", "POSLE", "ONDA"], items: [it("📚", "Rad"), it("🧸", "Igra")] } },
    { title: "Prvo jedemo, posle park", data: { three: false, labels: ["PRVO", "POSLE", "ONDA"], items: [it("🍽️", "Ručak"), it("🛝", "Park")] } },
    { title: "Prvo – posle – onda", data: { three: true, labels: ["PRVO", "POSLE", "ONDA"], items: [it("👕", "Oblačenje"), it("🚌", "Autobus"), it("🏫", "Škola")] } },
  ],
  sekvenca: [
    { title: "Pranje ruku", data: { items: [it("🚰", "Otvorim slavinu", { core: true }), it("💦", "Pokvasim ruke"), it("🧼", "Natrljam sapun", { core: true }), it("🖐️", "Trljam ruke"), it("💦", "Isperem ruke"), it("🚰", "Zatvorim slavinu"), it("🧻", "Obrišem ruke", { core: true })] } },
    { title: "Pranje zuba", data: { items: [it("🪥", "Uzmem četkicu", { core: true }), it("🦷", "Stavim pastu"), it("😁", "Perem gornje zube", { core: true }), it("😬", "Perem donje zube"), it("💦", "Isperem usta"), it("✅", "Vratim četkicu", { core: true })] } },
    { title: "Toalet", data: { items: [it("🚽", "Spustim pantalone", { core: true }), it("🚽", "Sednem na WC šolju"), it("🧻", "Obrišem se"), it("👖", "Podignem pantalone", { core: true }), it("💧", "Pustim vodu"), it("🧼", "Operem ruke", { core: true })] } },
    { title: "Oblačenje za napolje", data: { items: [it("🧥", "Jakna", { core: true }), it("🧣", "Šal"), it("🧢", "Kapa"), it("🧤", "Rukavice"), it("👟", "Cipele", { core: true }), it("🚪", "Idemo napolje", { core: true })] } },
    { title: "Pakovanje torbe", data: { items: [it("📚", "Knjige", { core: true }), it("✏️", "Pernica", { core: true }), it("📒", "Sveske"), it("🍎", "Užina"), it("🚰", "Flašica vode"), it("🎒", "Zatvorim torbu", { core: true })] } },
    { title: "Odlazak na spavanje", data: { items: [it("🛁", "Kupanje", { core: true }), it("👕", "Pidžama"), it("🪥", "Zubi", { core: true }), it("📖", "Priča"), it("💡", "Gasim svetlo"), it("🛏️", "Spavanje", { core: true })] } },
  ],
  izbori: [
    { title: "Šta želiš da radiš?", data: { question: "Šta želiš?", cols: 0, items: [it("🧱", "Kocke", { core: true }), it("🧩", "Slagalica", { core: true }), it("🎨", "Crtanje"), it("📖", "Knjiga"), it("🎵", "Muzika"), it("🫧", "Mehurići")] } },
    { title: "Šta želiš da piješ?", data: { question: "Šta želiš da piješ?", cols: 0, items: [it("💧", "Voda", { core: true }), it("🧃", "Sok", { core: true }), it("🥛", "Mleko"), it("🍵", "Čaj")] } },
    { title: "Kako želiš da se smiriš?", data: { question: "Šta će mi pomoći?", cols: 0, items: [it("🎧", "Slušalice", { core: true }), it("⛺", "Miran kutak", { core: true }), it("🌬️", "Disanje"), it("🟢", "Gnjecalica"), it("🚶", "Šetnja"), it("🛌", "Teško ćebe")] } },
    { title: "Užina", data: { question: "Šta želiš za užinu?", cols: 0, items: [it("🍎", "Jabuka", { core: true }), it("🍌", "Banana", { core: true }), it("🥨", "Perece"), it("🍪", "Keks"), it("🥪", "Sendvič"), it("🥕", "Šargarepa")] } },
  ],
  komunikacija: [
    { title: "Osnovna tabla", data: { cols: 0, items: [
      it("🫴", "želim", { cat: "radnje", core: true }), it("➕", "još", { cat: "drustvo", core: true }), it("✅", "gotovo", { cat: "drustvo", core: true }), it("🆘", "pomoć", { cat: "drustvo", core: true }), it("👎", "ne", { cat: "drustvo", core: true }), it("👍", "da", { cat: "drustvo", core: true }),
      it("⏸️", "pauza", { cat: "radnje" }), it("🚽", "toalet", { cat: "stvari" }), it("🥤", "piće", { cat: "stvari" }), it("🍎", "hrana", { cat: "stvari" }), it("🧸", "igra", { cat: "stvari" }), it("🤕", "boli me", { cat: "opis" }),
      it("🙋", "ja", { cat: "ljudi" }), it("👉", "ti", { cat: "ljudi" }), it("🧑‍🏫", "nastavnik", { cat: "ljudi" }), it("👩", "mama", { cat: "ljudi" }), it("🚶", "idemo", { cat: "radnje" }), it("👀", "gledaj", { cat: "radnje" }),
      it("😊", "srećan", { cat: "opis" }), it("😢", "tužan", { cat: "opis" }), it("😠", "ljut", { cat: "opis" }), it("❓", "šta", { cat: "pitanja" }), it("📍", "gde", { cat: "pitanja" }), it("👋", "zdravo", { cat: "drustvo" })] } },
    { title: "Tabla za užinu", data: { cols: 0, items: [
      it("🙋", "ja", { cat: "ljudi", core: true }), it("🫴", "želim", { cat: "radnje", core: true }), it("➕", "još", { cat: "drustvo", core: true }), it("✅", "gotovo", { cat: "drustvo", core: true }),
      it("🍎", "jabuka", { cat: "stvari" }), it("🍌", "banana", { cat: "stvari" }), it("🥪", "sendvič", { cat: "stvari" }), it("💧", "voda", { cat: "stvari" }), it("🧃", "sok", { cat: "stvari" }), it("🍪", "keks", { cat: "stvari" }),
      it("😋", "ukusno", { cat: "opis" }), it("👎", "ne volim", { cat: "opis" }), it("🙏", "molim", { cat: "drustvo" }), it("🤝", "hvala", { cat: "drustvo" }), it("🆘", "pomoć", { cat: "drustvo" }), it("🧻", "salveta", { cat: "stvari" })] } },
    { title: "Tabla za igru", data: { cols: 0, items: [
      it("🙋", "ja", { cat: "ljudi", core: true }), it("👉", "ti", { cat: "ljudi" }), it("🫴", "želim", { cat: "radnje", core: true }), it("🔁", "opet", { cat: "drustvo", core: true }), it("✋", "stop", { cat: "drustvo", core: true }), it("⏳", "moj red", { cat: "drustvo" }),
      it("🧱", "kocke", { cat: "stvari" }), it("⚽", "lopta", { cat: "stvari" }), it("🧩", "slagalica", { cat: "stvari" }), it("🚗", "autić", { cat: "stvari" }), it("🎨", "boje", { cat: "stvari" }), it("🫧", "mehurići", { cat: "stvari" }),
      it("🤲", "daj", { cat: "radnje" }), it("📦", "otvori", { cat: "radnje" }), it("🤝", "zajedno", { cat: "drustvo" }), it("🎉", "super", { cat: "opis" }), it("😠", "ljut", { cat: "opis" }), it("✅", "gotovo", { cat: "drustvo" })] } },
  ],
  emocije: [
    { title: "Kako se osećam?", data: { mode: "kartice", items: [it("😊", "srećan", { core: true }), it("😢", "tužan", { core: true }), it("😠", "ljut", { core: true }), it("😨", "uplašen"), it("😩", "umoran"), it("🤩", "uzbuđen"), it("😕", "zbunjen"), it("😌", "miran")] } },
    { title: "Semafor osećanja", data: { mode: "semafor", scale: EMO_TRAFFIC } },
    { title: "Moja skala 1–5", data: { mode: "skala", scale: EMO_SCALE5 } },
  ],
  prelaz: [
    { title: "Još 5 minuta", data: { minutes: 5, from: it("🧸", "Igra"), to: it("📚", "Rad") } },
    { title: "Kraj odmora", data: { minutes: 3, from: it("🌳", "Dvorište"), to: it("🏫", "Učionica") } },
    { title: "Polazak kući", data: { minutes: 5, from: it("🎨", "Crtanje"), to: it("🏠", "Kući") } },
  ],
  prica: [
    { title: "Kada zvoni zvono", data: { items: [it("🏫", "U školi ponekad zvoni zvono."), it("🔔", "Zvono je glasno. Ono znači da je čas gotov ili da počinje."), it("😖", "Neki put mi zvono smeta jer je glasno."), it("🎧", "Mogu da stavim slušalice ili da pokrijem uši."), it("🚶", "Kada zvono prestane, idem na svoje mesto."), it("😌", "Zvono traje kratko. Ja sam bezbedan.")] } },
    { title: "Kada se plan promeni", data: { items: [it("📅", "Svaki dan imam svoj raspored."), it("🔄", "Ponekad se plan promeni. To se dešava svima."), it("😕", "Mogu da se osećam ljuto ili zbunjeno. To je u redu."), it("🧑‍🏫", "Učiteljica će mi pokazati novi plan na slikama."), it("🌬️", "Mogu duboko da dišem i da pogledam šta je sledeće."), it("⭐", "Kada prihvatim promenu, ponosan sam na sebe.")] } },
    { title: "Čekam svoj red", data: { items: [it("👫", "Kada se igramo, svako ima svoj red."), it("⏳", "Dok drug igra, ja čekam."), it("🙌", "Dok čekam, ruke držim kod sebe."), it("👀", "Mogu da gledam kako se drug igra."), it("🙋", "Kada je moj red, ja igram."), it("😊", "Kada čekam red, drugari vole da se igraju sa mnom.")] } },
    { title: "Idem kod zubara", data: { items: [it("🦷", "Danas idem kod zubara."), it("🪑", "Sešću u veliku stolicu koja može da se pomera."), it("💡", "Iznad mene će biti jako svetlo. Mogu da nosim naočare."), it("😮", "Zubar će reći „otvori usta“ i pogledati moje zube."), it("✋", "Ako mi je teško, mogu da podignem ruku da zubar stane."), it("🎁", "Kada završimo, idemo kući. Uspeo sam!")] } },
    { title: "Idem u prodavnicu", data: { items: [it("🛒", "Idem u prodavnicu da kupimo ono što nam treba."), it("👥", "U prodavnici može biti ljudi i gužve."), it("🎧", "Ako je glasno, mogu da stavim slušalice."), it("🤝", "Držim mamu ili tatu za ruku i guram kolica."), it("⏳", "Na kasi čekamo red."), it("🏠", "Kada platimo, idemo kući.")] } },
    { title: "Šišanje", data: { items: [it("💇", "Kosa mi raste, pa je ponekad šišamo."), it("🪑", "Sedim u stolici i nosim ogrtač."), it("✂️", "Makaze i mašinica prave zvuk. Ne bole."), it("⏳", "Šišanje traje koliko i jedna pesma ili dve."), it("🎧", "Mogu da slušam muziku ili da držim omiljenu igračku."), it("😎", "Posle šišanja izgledam lepo i dobijam pohvalu.")] } },
    { title: "Vežba evakuacije", data: { items: [it("🔔", "Ponekad u školi zvoni posebno glasno zvono za vežbu."), it("🚶", "Tada svi zajedno, mirno, izlazimo napolje."), it("🧑‍🏫", "Idem uz učiteljicu i držim drugara za ruku."), it("🎧", "Mogu da pokrijem uši ili nosim slušalice."), it("🌳", "Napolju stojimo na dogovorenom mestu i čekamo."), it("🏫", "Kada se vežba završi, vraćamo se u učionicu.")] } },
  ],
  skripta: [
    { title: "Kako da pitam drugara da se igramo", data: { items: [it("👋", "Pozdravim: „Zdravo!“"), it("👀", "Pogledam drugara."), it("🗣️", "Pitam: „Hoćeš da se igramo?“"), it("⏳", "Sačekam odgovor."), it("🙂", "Ako kaže ne – u redu je, pitam nekog drugog.")] } },
    { title: "Kako da tražim pomoć", data: { items: [it("🙋", "Podignem ruku ili priđem."), it("🗣️", "Kažem: „Treba mi pomoć.“"), it("👉", "Pokažem šta mi ne ide."), it("⏳", "Sačekam."), it("🤝", "Kažem: „Hvala.“")] } },
    { title: "U prodavnici", data: { items: [it("👋", "Pozdravim: „Dobar dan.“"), it("🗣️", "Kažem šta želim: „Molim vas, …“"), it("💰", "Dam novac."), it("⏳", "Sačekam kusur."), it("🤝", "Kažem: „Hvala, doviđenja.“")] } },
  ],
  pravila: [
    { title: "Pravila razreda", data: { items: [it("✋", "Podignem ruku kada želim nešto da kažem.", { core: true }), it("🗣️", "Govorimo jedan po jedan."), it("🙌", "Ruke držim kod sebe.", { core: true }), it("🚶", "U učionici hodamo."), it("🧺", "Pospremim stvari na svoje mesto.", { core: true }), it("💛", "Lepo se ophodimo jedni prema drugima.")] } },
    { title: "Pravila za pauzu", data: { items: [it("🆘", "Kada mi je teško, pokažem karticu „pauza“."), it("⛺", "Idem u miran kutak."), it("⏳", "Pauza traje dok peščani sat ne istekne."), it("📚", "Posle pauze se vraćam na zadatak.")] } },
  ],
  tokeni: [
    { title: "Radim za… (5 žetona)", data: { count: 5, goal: it("📚", "Završim zadatak"), reward: it("🎮", "Igrica 5 minuta"), token: "⭐" } },
    { title: "Radim za… (3 žetona)", data: { count: 3, goal: it("🪑", "Sedim na mestu"), reward: it("🫧", "Mehurići"), token: "😀" } },
    { title: "Radim za… (10 žetona)", data: { count: 10, goal: it("✋", "Podignem ruku"), reward: it("🏆", "Biram aktivnost"), token: "⭐" } },
  ],
  kartice: [
    { title: "Kartice za pomoć", data: { items: [it("⏸️", "Treba mi pauza", { core: true }), it("🆘", "Treba mi pomoć", { core: true }), it("🚽", "Toalet", { core: true }), it("🎧", "Previše je glasno"), it("🥤", "Žedan sam"), it("🤕", "Boli me"), it("😴", "Umoran sam"), it("✋", "Stop")] } },
  ],
  senzorni: [
    { title: "Nedeljni senzorni raspored", data: { days: 5 } },
  ],
  pasos: [{ title: "Senzorni pasoš", data: {} }],
  lowarousal: [{ title: "Low arousal plan", data: {} }],
};

/* ---------------------------------------------------------------- vodič (štampa) */
export const GUIDE = [
  ["📅", "Vizuelni rasporedi", "Redosled aktivnosti tokom dana ili zadatka. Smanjuju neizvesnost: dete zna šta sledi."],
  ["➡️", "Prvo – posle", "Najjednostavnija struktura: šta prvo radimo, a šta sledi kao omiljena aktivnost."],
  ["🔢", "Sekvence i koraci", "Rutina razložena na korake. Povećavaju samostalnost (pranje ruku, oblačenje…)."],
  ["🫴", "Table izbora", "Izbor između nekoliko opcija – jača autonomiju i smanjuje frustraciju."],
  ["💬", "Komunikacione table", "Potpomognuta komunikacija: dete pokazuje simbol za ono što želi da kaže. Podržava govor, ne ometa ga."],
  ["😊", "Emocionalne podrške", "Kartice osećanja, semafor ili skala 1–5 pomažu da dete prepozna stanje i izabere strategiju."],
  ["⏳", "Prelazi i tajmeri", "Najava kraja aktivnosti („još 5 minuta“) i vizuelno odbrojavanje smanjuju otpor pri promeni."],
  ["📖", "Socijalne priče", "Kratke priče koje opisuju situaciju, šta drugi misle i šta se očekuje. Čitaju se pre situacije."],
  ["🗨️", "Vizuelne skripte", "Model šta da KAŽEM i URADIM u konkretnoj socijalnoj situaciji."],
  ["✋", "Pravila i podsetnici", "Kratka pravila sa slikom, uvek na istom, vidljivom mestu."],
  ["⭐", "Token table", "Žetoni vizuelno pokazuju koliko je ostalo do dogovorene nagrade."],
  ["🌿", "Low arousal pristup", "Smiren ton, manje reči i više pauza, jasne kratke poruke, bez rasprave u trenutku krize."],
];
export const HOW_TO = [
  "Budite dosledni – iste slike i isti simboli kod kuće i u školi.",
  "Prilagodite detetu: uzrast, nivo podrške, interesovanja.",
  "Postavite podršku na vidljivo mesto u visini očiju deteta.",
  "Uvek uz govor i gest – pokažite karticu i kažite reč.",
  "Počnite sa malo kartica, pa postepeno dodajte.",
  "Pohvalite svaki pokušaj korišćenja.",
];
