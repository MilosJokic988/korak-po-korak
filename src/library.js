/* Biblioteka aktivnosti „Korak po korak“ – opšte, proverene igre koje stručnjak
   može odmah da ponudi porodici. Svaka aktivnost je u istom obliku kao aktivnost
   u programu, pa se jednim klikom prebacuje u program porodice.
   Sadržaj je opšteg tipa (podrška kroz igru), nije terapija niti dijagnoza –
   stručnjak bira i prilagođava aktivnosti detetu. */

import { normalizeContent } from "./program.js";

export const LIB_AREAS = [
  { id: "reg", title: "Regulacija i senzorika", intro: "Aktivnosti koje telu daju jasne, predvidive informacije i pomažu detetu da se smiri i bude spremno za igru." },
  { id: "paz", title: "Pažnja i slušanje", intro: "Kratke igre u kojima dete vežba da sluša, čeka znak i zadrži pažnju na zajedničkoj aktivnosti." },
  { id: "fin", title: "Fina motorika", intro: "Igre za snagu šake, hvat i preciznost prstiju – priprema za samostalno jelo, oblačenje i crtanje." },
  { id: "gru", title: "Gruba motorika i ravnoteža", intro: "Kretanje kroz igru: ravnoteža, koordinacija obe strane tela i planiranje pokreta." },
  { id: "kom", title: "Komunikacija i govor", intro: "Igre koje stvaraju razlog da dete pokaže, zatraži, izabere i razmeni – rečju, gestom ili pogledom." },
  { id: "sam", title: "Samostalnost i rutine", intro: "Svakodnevne situacije kao prilika za učenje: kuhinja, oblačenje, pospremanje i redosled dana." },
];

const A = (id, area, title, d) => ({ id, area, title, ...d });

export const LIBRARY = [
  /* ---------------------------------------------------------- Regulacija i senzorika */
  A("reg-sendvic", "reg", "Sendvič od jastuka", {
    age: "2–8 god.", time: "3–5 min",
    goal: "Smirivanje i bolja svest o telu kroz blag, ravnomeran pritisak.",
    materials: ["2–3 velika jastuka ili debelo ćebe", "prostirka ili krevet"],
    steps: [
      "Dete legne na stomak na prostirku ili krevet – ono je „hleb“.",
      "Roditelj najavljuje sastojke: „Stavljamo sir!“ i položi jastuk preko leđa i nogu.",
      "Rukama preko jastuka daje spor, ravnomeran pritisak, od ramena ka stopalima.",
      "Dodaje „sastojke“ (paradajz, salata…) – svaki put pita: „Još ili dosta?“",
      "Na kraju „zagrize sendvič“ – nežno stisne jastuk i polako ga skloni.",
    ],
    levels: [
      { name: "Lakše", text: "Samo jedan jastuk i kratko trajanje; dete može da drži ruke slobodne." },
      { name: "Teže", text: "Dete samo bira redosled sastojaka i govori „još“ ili „dosta“." },
    ],
    tracks: ["da li se telo opušta ili napinje", "da li traži još pritiska", "kako izgleda posle aktivnosti"],
    develops: "regulacija, propriocepcija, telesna šema, zajednička pažnja",
    note: "Glava i lice uvek ostaju slobodni. Pritisak je prijatan i lako se skida; prekinuti na prvi znak nelagode.",
  }),
  A("reg-tovar", "reg", "Teški tovar", {
    age: "2–8 god.", time: "5 min",
    goal: "Organizovanje tela i smirivanje kroz guranje, vučenje i nošenje.",
    materials: ["korpa za veš ili kutija", "knjige ili flaše vode", "lopta veća od deteta (po želji)"],
    steps: [
      "Napunite korpu sa nekoliko knjiga ili flaša – to je „teret za kamion“.",
      "Dete gura korpu kroz sobu do „skladišta“ (npr. do kauča).",
      "Istovari teret jedan po jedan predmet i odnese ga na mesto.",
      "Zamenite uloge: roditelj vozi, dete daje znak „kreni“ i „stani“.",
    ],
    levels: [
      { name: "Lakše", text: "Kratka putanja i laganiji teret." },
      { name: "Teže", text: "Putanja sa okretom, ili nošenje dva predmeta odjednom obema rukama." },
    ],
    tracks: ["da li posle guranja lakše sedi i sluša", "koliko pomoći mu treba", "da li prati znak „stani“"],
    develops: "propriocepcija, snaga, planiranje pokreta, regulacija",
    note: "Teret prilagoditi detetu – treba da bude izazovan, ali bez naprezanja.",
  }),
  A("reg-kutija", "reg", "Senzorna kutija", {
    age: "2–7 god.", time: "5–10 min",
    goal: "Postepeno upoznavanje različitih materijala i istraživanje rukama.",
    materials: ["plitka kutija ili posuda", "pirinač, pasulj ili testenina", "kašika, čaša, levak", "2–3 male igračke"],
    steps: [
      "U kutiju sipajte pirinač i sakrijte nekoliko malih igračaka.",
      "Prvo samo posmatrajte zajedno: „Šta je ovo?“ – dete ne mora odmah da dodiruje.",
      "Ponudite kašiku i čašu: presipanje, punjenje i pražnjenje.",
      "Pronalaženje skrivenih igračaka – kašikom, pa prstima, kako detetu prija.",
      "Na kraju zajedno pospremite i operite ruke.",
    ],
    levels: [
      { name: "Lakše", text: "Krupniji materijal (testenina) i rad samo kašikom." },
      { name: "Teže", text: "Dete traži tačno određenu igračku („nađi autić“) ili presipa levkom." },
    ],
    tracks: ["koji materijal prihvata, a koji izbegava", "da li koristi obe ruke", "koliko dugo ostaje u igri"],
    develops: "taktilna obrada, fina motorika, pažnja, istraživanje",
    note: "Stalni nadzor zbog stavljanja sitnih predmeta u usta. Dodir se nikad ne forsira.",
  }),
  A("reg-disanje", "reg", "Duvamo perce", {
    age: "3–8 god.", time: "2–3 min",
    goal: "Mirno, kontrolisano disanje kao način smirivanja.",
    materials: ["perce, maramica ili papirna lopta", "slamka (po želji)"],
    steps: [
      "Sedite jedno naspram drugog, perce je na stolu između vas.",
      "Roditelj pokaže: polako udahne na nos i dugo duva – perce putuje.",
      "Dete pokušava da perce oduva do „cilja“ (ivica stola, šolja).",
      "Igrajte se brzinom: „sporo kao puž“ – „jako kao vetar“, pa opet sporo.",
      "Završite sa tri spora daha zajedno.",
    ],
    levels: [
      { name: "Lakše", text: "Lagan predmet i blizak cilj." },
      { name: "Teže", text: "Duvanje kroz slamku ili vođenje papirne loptice kroz „lavirint“ od knjiga." },
    ],
    tracks: ["da li uspeva da duva duže", "da li se posle smiri", "da li samo traži igru kad je uznemiren"],
    develops: "regulacija, oralna motorika, pažnja",
    note: "Prekinuti ako se dete zadihano ili mu se vrti u glavi.",
  }),

  /* ---------------------------------------------------------- Pažnja i slušanje */
  A("paz-stani", "paz", "Stani – kreni uz muziku", {
    age: "2–8 god.", time: "5 min",
    goal: "Slušanje i čekanje znaka; zaustavljanje pokreta na signal.",
    materials: ["omiljena muzika", "crvena i zelena kartica (po želji)"],
    steps: [
      "Muzika svira – zajedno plešete ili hodate po sobi.",
      "Muzika stane – oboje se „zamrznete“. Pokažite crvenu karticu.",
      "Sačekajte par sekundi i pohvalite zaustavljanje: „Stao si!“",
      "Muzika ponovo svira – zelena kartica, „kreni“.",
      "Posle nekoliko krugova dete pušta i zaustavlja muziku za vas.",
    ],
    levels: [
      { name: "Lakše", text: "Muzika staje predvidivo i uz karticu." },
      { name: "Teže", text: "Bez kartice, ili sa posebnim pokretom na stop (čučni, ruke gore)." },
    ],
    tracks: ["koliko brzo reaguje na tišinu", "da li čeka znak za nastavak", "da li uživa u ulozi vođe"],
    develops: "auditivna pažnja, inhibicija, regulacija, igra po pravilu",
  }),
  A("paz-zvuci", "paz", "Zvučne kutijice", {
    age: "3–8 god.", time: "5–10 min",
    goal: "Razlikovanje zvukova i povezivanje zvuka sa predmetom.",
    materials: ["4–6 jednakih neprovidnih kutijica ili teglica", "pirinač, pasulj, dugmad, voda"],
    steps: [
      "Napunite po dve kutijice istim sadržajem (dva para za početak).",
      "Protresite jednu: „Slušaj!“ Pa protresite drugu.",
      "Dete traži kutijicu koja zvuči isto – tako pravi parove.",
      "Otvorite par i proverite zajedno šta je unutra.",
    ],
    levels: [
      { name: "Lakše", text: "Samo dva para vrlo različitih zvukova (pirinač i dugmad)." },
      { name: "Teže", text: "Tri ili četiri para, ili zvuci koji su slični." },
    ],
    tracks: ["da li sluša do kraja pre izbora", "koliko parova pogodi", "da li traži ponavljanje"],
    develops: "auditivna diskriminacija, pažnja, pamćenje",
  }),
  A("paz-nestalo", "paz", "Šta je nestalo?", {
    age: "3–8 god.", time: "5 min",
    goal: "Vizuelna pažnja i kratkoročno pamćenje.",
    materials: ["3–5 poznatih predmeta (lopta, kašika, autić…)", "maramica"],
    steps: [
      "Poređajte tri predmeta i zajedno ih imenujte.",
      "Prekrijte ih maramicom i ispod nje sakrijte jedan predmet.",
      "Otkrijte: „Šta je nestalo?“ – dete pokazuje ili kaže.",
      "Zamenite uloge – dete sakriva, roditelj pogađa (i ponekad namerno pogreši).",
    ],
    levels: [
      { name: "Lakše", text: "Dva predmeta i ostavite vidljivo mesto gde je bio." },
      { name: "Teže", text: "Pet predmeta, ili se predmeti i premeste." },
    ],
    tracks: ["koliko predmeta pamti", "da li gleda dok se predmeti imenuju", "kako reaguje na grešku"],
    develops: "vizuelna pažnja, pamćenje, razumevanje reči, smenjivanje",
  }),
  A("paz-ritam", "paz", "Ritam za mnom", {
    age: "3–8 god.", time: "3–5 min",
    goal: "Slušanje, oponašanje i pamćenje kratkog niza.",
    materials: ["dlanovi, sto ili bubanj (šerpa i kašika)"],
    steps: [
      "Roditelj otapše kratak ritam: tap – tap.",
      "Dete ponavlja. Pohvalite pokušaj, ne savršenstvo.",
      "Polako produžavajte: tap – tap – pauza – tap.",
      "Dete smišlja ritam, roditelj ponavlja.",
    ],
    levels: [
      { name: "Lakše", text: "Dva udarca, uz to da dete gleda vaše ruke." },
      { name: "Teže", text: "Tri do četiri udarca, ili ritam sa promenom (sto – dlanovi)." },
    ],
    tracks: ["da li čeka kraj vašeg ritma", "koliko dug niz ponavlja", "da li uživa da vodi"],
    develops: "auditivna pažnja, sekvencioniranje, imitacija, ritam",
  }),

  /* ---------------------------------------------------------- Fina motorika */
  A("fin-stipaljke", "fin", "Štipaljke na kartonu", {
    age: "3–8 god.", time: "5–10 min",
    goal: "Jačanje stiska prstiju (palac i kažiprst).",
    materials: ["drvene ili plastične štipaljke", "karton ili ivica kutije", "bojice za označavanje (po želji)"],
    steps: [
      "Pokažite kako se štipaljka otvara – „usta“ se otvaraju i zatvaraju.",
      "Dete kači štipaljke po ivici kartona.",
      "Napravite sunce, ježa ili lava – štipaljke su zraci, bodlje, griva.",
      "Na kraju ih skida jednu po jednu i spušta u kutiju.",
    ],
    levels: [
      { name: "Lakše", text: "Mekše štipaljke i samo skidanje." },
      { name: "Teže", text: "Kačenje po bojama (crvena na crveno polje) ili nošenje sitnih predmeta štipaljkom." },
    ],
    tracks: ["kojim prstima drži štipaljku", "da li zamara ruku", "da li koristi drugu ruku da pridrži karton"],
    develops: "snaga šake, hvat, koordinacija oko–ruka",
  }),
  A("fin-pinceta", "fin", "Pinceta i pomponi", {
    age: "3–8 god.", time: "5 min",
    goal: "Precizan hvat i kontrola pokreta.",
    materials: ["krupna pinceta ili hvataljka za led", "pomponi ili vatene loptice", "kalup za led ili kartonska ambalaža za jaja"],
    steps: [
      "Pomponi su „jaja“, a kalup je „gnezdo“.",
      "Dete pincetom prenosi po jedan pompon u svako polje.",
      "Brojite zajedno ili imenujte boje.",
      "Vratite sve nazad u činiju – drugom rukom.",
    ],
    levels: [
      { name: "Lakše", text: "Hvatanje prstima umesto pincete, ili veća hvataljka." },
      { name: "Teže", text: "Razvrstavanje po bojama, ili sitniji predmeti (pasulj)." },
    ],
    tracks: ["kako drži pincetu", "da li prati pogledom ruku", "koliko predmeta prenese bez ispadanja"],
    develops: "fina motorika, vizuomotorna koordinacija, pažnja",
    note: "Sitni predmeti samo uz nadzor.",
  }),
  A("fin-testo", "fin", "Testo: valjaj, štipaj, seci", {
    age: "2–8 god.", time: "10 min",
    goal: "Snaga i spretnost šaka kroz oblikovanje.",
    materials: ["plastelin ili domaće slano testo", "oklagija ili čaša", "plastični nožić ili kalupi"],
    steps: [
      "Gnječite testo zajedno – „mesimo hleb“.",
      "Pravite „zmije“ valjanjem dlanovima po stolu.",
      "Štipajte male komade prstima – to su „mrvice za ptice“.",
      "Razvaljajte i iseckajte ili utisnite kalupima.",
    ],
    levels: [
      { name: "Lakše", text: "Mekano testo, samo gnječenje i utiskivanje." },
      { name: "Teže", text: "Pravljenje kuglica određene veličine ili jednostavnog oblika po modelu." },
    ],
    tracks: ["da li koristi obe ruke", "prihvata li lepljiv/mekan materijal", "da li prati model"],
    develops: "snaga šake, bilateralna koordinacija, taktilna obrada, kreativnost",
  }),
  A("fin-perle", "fin", "Nizanje krupnih perli", {
    age: "3–8 god.", time: "5–10 min",
    goal: "Koordinacija obe ruke i preciznost.",
    materials: ["krupne perle ili kratka testenina (makarone)", "pertla sa čvrstim krajem ili kanap sa selotejpom na vrhu"],
    steps: [
      "Na kraj pertle vežite čvor da perle ne spadnu.",
      "Jednom rukom dete drži pertlu, drugom navlači perlu.",
      "Napravite ogrlicu, „gusenicu“ ili voz.",
      "Pratite niz: „crvena, plava, crvena…“ ako je dete spremno.",
    ],
    levels: [
      { name: "Lakše", text: "Kratka, kruta pertla i velike rupe (testenina)." },
      { name: "Teže", text: "Ponavljanje niza po kartici ili manje perle." },
    ],
    tracks: ["koju ruku koristi za držanje", "da li pogledom prati vrh pertle", "koliko perli niže samostalno"],
    develops: "bilateralna koordinacija, fina motorika, pažnja, nizovi",
    note: "Sitne perle samo uz nadzor; pertlu ne ostavljati detetu bez nadzora.",
  }),

  /* ---------------------------------------------------------- Gruba motorika i ravnoteža */
  A("gru-staza", "gru", "Staza od jastuka", {
    age: "2–8 god.", time: "10 min",
    goal: "Planiranje pokreta, ravnoteža i praćenje redosleda.",
    materials: ["jastuci", "stolica i ćebe (tunel)", "kutija ili korpa", "lopta"],
    steps: [
      "Napravite stazu od 3 dela: preko jastuka – kroz tunel – ubaci loptu u korpu.",
      "Prvo vi prođete i kažete svaki korak: „preko“, „kroz“, „ubaci“.",
      "Dete prolazi stazu, a vi pratite rečima.",
      "Kad je sigurno, dodajte još jednu stanicu ili promenite redosled.",
    ],
    levels: [
      { name: "Lakše", text: "Dve stanice i ruka podrške na jastucima." },
      { name: "Teže", text: "Četiri stanice, ili dete samo smišlja stazu i redosled." },
    ],
    tracks: ["da li pamti redosled", "kako se snalazi na mekanoj podlozi", "da li traži pomoć"],
    develops: "motorno planiranje, ravnoteža, praćenje uputstava, prostorni pojmovi",
    note: "Ukloniti oštre ivice i predmete o koje može da se udari.",
  }),
  A("gru-traka", "gru", "Hod po traci", {
    age: "3–8 god.", time: "5 min",
    goal: "Ravnoteža i kontrola tela.",
    materials: ["traka za pod ili kanap", "plišana igračka (po želji)"],
    steps: [
      "Zalepite traku na pod (ravna linija, 2–3 metra).",
      "Dete hoda po traci kao „cirkusant na žici“.",
      "Na kraju linije čeka igračka koju treba spasiti i doneti nazad.",
      "Probajte i drugačije: na prstima, unazad, sa jastukom na glavi.",
    ],
    levels: [
      { name: "Lakše", text: "Šira traka i hvatanje za vašu ruku." },
      { name: "Teže", text: "Cik-cak linija ili hodanje peta-prsti." },
    ],
    tracks: ["koliko koraka ostaje na liniji", "da li gleda ispred sebe", "kako koristi ruke za ravnotežu"],
    develops: "statička i dinamička ravnoteža, posturalna kontrola, pažnja",
  }),
  A("gru-lopta", "gru", "Kotrljaj, uhvati, baci", {
    age: "2–8 god.", time: "5–10 min",
    goal: "Koordinacija oko–ruka i smenjivanje u igri.",
    materials: ["mekana lopta", "kutija ili korpa kao meta"],
    steps: [
      "Sedite na podu raširenih nogu, jedno naspram drugog. Kotrljajte loptu: „Tebi – meni.“",
      "Kada je kotrljanje sigurno, ustanite i dodajte loptu iz blizine.",
      "Bacanje u korpu sa sve veće udaljenosti.",
      "Dete bira ko je sledeći i daje znak „sad!“.",
    ],
    levels: [
      { name: "Lakše", text: "Veća, mekana lopta i kotrljanje." },
      { name: "Teže", text: "Manja lopta, hvatanje u letu, ili bacanje jednom rukom." },
    ],
    tracks: ["da li prati loptu pogledom", "da li čeka svoj red", "koristi li obe ruke pri hvatanju"],
    develops: "koordinacija oko–ruka, bilateralna koordinacija, smenjivanje, socijalna igra",
  }),
  A("gru-zivotinje", "gru", "Životinjski hodovi", {
    age: "2–8 god.", time: "5 min",
    goal: "Snaga, koordinacija i oponašanje pokreta.",
    materials: ["slike životinja (po želji)", "slobodan prostor"],
    steps: [
      "Roditelj pokaže životinju i pokret: meda (na rukama i stopalima), žaba (skok iz čučnja), rak (unazad).",
      "Dete oponaša – dovoljan je i pokušaj.",
      "Dodajte zvuk životinje uz pokret.",
      "Dete izvlači sliku i pokazuje vama koju životinju da „glumite“.",
    ],
    levels: [
      { name: "Lakše", text: "Jedna životinja, kratka razdaljina." },
      { name: "Teže", text: "Smena dve životinje na znak („meda – žaba!“)." },
    ],
    tracks: ["da li oponaša pokret", "kako se drži na rukama", "da li povezuje sliku i pokret"],
    develops: "snaga trupa i ramena, imitacija, koordinacija, simbolička igra",
  }),

  /* ---------------------------------------------------------- Komunikacija i govor */
  A("kom-kutija", "kom", "Kutija iznenađenja", {
    age: "2–6 god.", time: "5 min",
    goal: "Razlog da dete zatraži nastavak („još“, „otvori“) i podeli pažnju.",
    materials: ["kutija sa poklopcem ili vrećica", "3–5 zanimljivih predmeta (zvečka, autić, balon)"],
    steps: [
      "Protresite kutiju i sa uzbuđenjem kažite: „Šta li je unutra?“",
      "Polako otvorite i izvadite jedan predmet – igrajte se kratko.",
      "Zastanite i čekajte da dete pogledom, gestom ili rečju zatraži „još“.",
      "Na svaki pokušaj odmah odgovorite i dajte reč: „Još! Otvaramo!“",
    ],
    levels: [
      { name: "Lakše", text: "Prihvatite pogled ili pružanje ruke kao zahtev." },
      { name: "Teže", text: "Čekajte reč ili znak („još“, „otvori“) ili izbor između dva predmeta." },
    ],
    tracks: ["kako traži nastavak (pogled, gest, glas, reč)", "da li deli uzbuđenje sa vama", "koliko čeka"],
    develops: "inicijacija komunikacije, združena pažnja, rane reči",
  }),
  A("kom-jaiti", "kom", "Ja pa ti", {
    age: "2–7 god.", time: "5 min",
    goal: "Smenjivanje i čekanje reda – osnova razgovora.",
    materials: ["kocke za kulu ili kutija za ubacivanje", "kartica „ja“ i „ti“ (po želji)"],
    steps: [
      "Gradite kulu zajedno: „Ja“ – stavite kocku. „Ti“ – dete stavlja kocku.",
      "Ponavljajte ritmično i prstom pokazujte čiji je red.",
      "Kada kula padne – zajedno vičete „bum!“ i počinjete ispočetka.",
      "Probajte i drugim igrama: ubacivanje u kutiju, slaganje slagalice.",
    ],
    levels: [
      { name: "Lakše", text: "Kratki redovi i vaša ruka koja pokazuje kad je njegov red." },
      { name: "Teže", text: "Dete samo kaže „ja“ ili „ti“, ili u igri učestvuje i treća osoba." },
    ],
    tracks: ["da li čeka svoj red", "da li gleda vas kada je vaš red", "da li koristi reč ili gest za red"],
    develops: "smenjivanje, socijalna igra, pažnja, rane reči",
  }),
  A("kom-slikovnica", "kom", "Slikovnica „Pokaži mi“", {
    age: "2–6 god.", time: "5 min",
    goal: "Razumevanje reči, pokazivanje i imenovanje.",
    materials: ["slikovnica sa krupnim slikama poznatih stvari"],
    steps: [
      "Sedite jedno pored drugog, slikovnica je između vas.",
      "Prvo vi komentarišete: „Maca. Maca spava.“ – i pokažete kažiprstom.",
      "Pitajte: „Gde je maca?“ Dete pokazuje.",
      "Pustite dete da okreće stranice i bira šta gledate.",
    ],
    levels: [
      { name: "Lakše", text: "Jedna slika po strani i samo pokazivanje." },
      { name: "Teže", text: "Dete imenuje ili odgovara na „šta radi?“." },
    ],
    tracks: ["da li pokazuje kažiprstom", "koje reči razume", "da li inicira – pokazuje vama"],
    develops: "razumevanje govora, pokazni gest, rečnik, združena pažnja",
  }),
  A("kom-izbor", "kom", "Ovo ili ono?", {
    age: "2–7 god.", time: "kroz dan",
    goal: "Izbor između dve ponuđene mogućnosti.",
    materials: ["dva stvarna predmeta (dve užine, dve igračke, dve majice)"],
    steps: [
      "Držite po jedan predmet u svakoj ruci: „Jabuka ili banana?“",
      "Sačekajte da dete pogleda, pokaže ili kaže izbor.",
      "Odmah dajte izabrano i ponovite reč: „Banana!“",
      "Koristite izbore svaki dan – užina, igračka, pesma, majica.",
    ],
    levels: [
      { name: "Lakše", text: "Jedan omiljeni i jedan nezanimljiv predmet." },
      { name: "Teže", text: "Izbor sa slika umesto predmeta, ili tri mogućnosti." },
    ],
    tracks: ["kako pokazuje izbor", "da li je izbor dosledan", "da li ponavlja reč"],
    develops: "funkcionalna komunikacija, samostalnost, rečnik",
  }),

  /* ---------------------------------------------------------- Samostalnost i rutine */
  A("sam-kuhinja", "sam", "Mali pomoćnik u kuhinji", {
    age: "3–8 god.", time: "10 min",
    goal: "Učešće u svakodnevnoj radnji i praćenje redosleda.",
    materials: ["činija, kašika", "jednostavni sastojci (voće za salatu, žitarice i mleko)"],
    steps: [
      "Pokažite sastojke i recite plan: „Pravimo voćnu salatu.“",
      "Dete pere voće, sipa ili meša – jedan korak u jednom trenutku.",
      "Koristite kratke reči: „sipaj“, „mešaj“, „stavi“.",
      "Zajedno poslužite i pojedite ono što ste napravili.",
    ],
    levels: [
      { name: "Lakše", text: "Jedan zadatak (samo mešanje)." },
      { name: "Teže", text: "Dva do tri koraka redom, po slikama recepta." },
    ],
    tracks: ["koliko koraka prati", "da li koristi obe ruke", "kako prihvata nove ukuse i mirise"],
    develops: "samostalnost, praksija, razumevanje naloga, senzorno istraživanje",
    note: "Bez noževa, šporeta i vrućih posuda.",
  }),
  A("sam-oblacenje", "sam", "Oblačenje kao igra", {
    age: "2–7 god.", time: "kroz rutinu",
    goal: "Postepeno samostalno oblačenje i svest o telu.",
    materials: ["odeća za taj dan", "ogledalo (po želji)"],
    steps: [
      "Poređajte odeću redom kojim se oblači.",
      "Roditelj uradi skoro sve, a dete završi poslednji korak (npr. povuče čarapu do kraja).",
      "Imenujte delove tela i odeće: „Ruka u rukav.“",
      "Kada je poslednji korak siguran, dete preuzima i pretposlednji.",
    ],
    levels: [
      { name: "Lakše", text: "Dete radi samo završni pokret." },
      { name: "Teže", text: "Dete samo bira redosled ili oblači jednostavan komad od početka." },
    ],
    tracks: ["koji korak radi samo", "da li prati redosled", "koliko vremena mu treba"],
    develops: "samostalnost, telesna šema, motorno planiranje, rečnik",
  }),
  A("sam-raspored", "sam", "Slike za redosled dana", {
    age: "3–8 god.", time: "5 min + kroz dan",
    goal: "Predvidivost dana i lakši prelazi između aktivnosti.",
    materials: ["3–5 slika ili crteža (doručak, igra, šetnja, kupanje, spavanje)", "lepljiva traka ili čičak"],
    steps: [
      "Napravite traku dana: slike ređajte s leva na desno.",
      "Ujutru zajedno pogledajte šta danas sledi.",
      "Posle svake aktivnosti dete skida ili okreće sliku: „Gotovo!“",
      "Pre promene najavite: „Još malo igre, pa šetnja“ i pokažite sliku.",
    ],
    levels: [
      { name: "Lakše", text: "Samo dve slike: „prvo – pa onda“." },
      { name: "Teže", text: "Ceo dan ili dete samo slaže raspored." },
    ],
    tracks: ["da li lakše prihvata promene", "da li samo pokazuje šta sledi", "kada mu je najteže"],
    develops: "regulacija, razumevanje vremena, samostalnost",
  }),
  A("sam-pospremanje", "sam", "Pospremanje uz pesmu", {
    age: "2–7 god.", time: "5 min",
    goal: "Završavanje aktivnosti i razvrstavanje.",
    materials: ["kutije ili korpe za igračke (sa slikom na svakoj)", "pesmica za pospremanje"],
    steps: [
      "Kada je igra gotova, pustite ili zapevajte uvek istu pesmicu.",
      "Pokažite gde šta ide: kocke u ovu, autići u onu kutiju.",
      "Pospremajte zajedno – vi jedan predmet, dete jedan.",
      "Kad je sve na mestu, proslavite: „Bravo, gotovo!“",
    ],
    levels: [
      { name: "Lakše", text: "Jedna kutija za sve." },
      { name: "Teže", text: "Razvrstavanje po vrsti ili boji u više kutija." },
    ],
    tracks: ["da li prepoznaje pesmu kao znak", "koliko predmeta odloži", "da li razvrstava"],
    develops: "završavanje aktivnosti, klasifikacija, samostalnost, rutine",
  }),
];

export const libById = id => LIBRARY.find(a => a.id === id);

/* Gotovi šabloni – četvoronedeljni programi od aktivnosti iz biblioteke. */
export const TEMPLATES = [
  {
    id: "t-regulacija", title: "Telo i smirivanje", subtitle: "Regulacija, senzorika i kretanje",
    intro: "Četiri nedelje kratkih aktivnosti koje telu daju jasne informacije i pomažu detetu da bude mirnije i spremnije za igru. Ne morate uraditi sve – jedna aktivnost dnevno je dovoljna.",
    weeks: [
      { title: "Telo i pritisak", ids: ["reg-sendvic", "reg-tovar"] },
      { title: "Istraživanje rukama", ids: ["reg-kutija", "reg-disanje"] },
      { title: "Kretanje", ids: ["gru-zivotinje", "gru-staza"] },
      { title: "Kroz dan", ids: ["sam-raspored", "gru-traka"] },
    ],
  },
  {
    id: "t-paznja", title: "Pažnja i slušanje", subtitle: "Čekanje znaka, pamćenje, ritam",
    intro: "Program kroz igru u kojoj dete vežba da sluša, čeka svoj red i zadrži pažnju. Igre su kratke – bolje je završiti dok je još zabavno.",
    weeks: [
      { title: "Slušamo i stajemo", ids: ["paz-stani", "reg-disanje"] },
      { title: "Zvuci", ids: ["paz-zvuci", "paz-ritam"] },
      { title: "Gledamo i pamtimo", ids: ["paz-nestalo", "kom-jaiti"] },
      { title: "Pravila igre", ids: ["gru-staza", "gru-lopta"] },
    ],
  },
  {
    id: "t-govor", title: "Rani govor i komunikacija", subtitle: "Traženje, izbor, smenjivanje",
    intro: "Program koji stvara što više prilika da dete pokaže, zatraži i izabere – rečju, gestom ili pogledom. Svaki oblik komunikacije se računa.",
    weeks: [
      { title: "Još!", ids: ["kom-kutija", "kom-izbor"] },
      { title: "Ja pa ti", ids: ["kom-jaiti", "gru-lopta"] },
      { title: "Pokaži mi", ids: ["kom-slikovnica", "paz-nestalo"] },
      { title: "Reči kroz dan", ids: ["sam-kuhinja", "sam-oblacenje"] },
    ],
  },
  {
    id: "t-motorika", title: "Ruke i telo", subtitle: "Fina i gruba motorika",
    intro: "Igre za snagu i spretnost – od šake i prstiju do ravnoteže celog tela. Priprema za samostalno jelo, oblačenje i crtanje.",
    weeks: [
      { title: "Snaga šake", ids: ["fin-testo", "fin-stipaljke"] },
      { title: "Preciznost", ids: ["fin-pinceta", "fin-perle"] },
      { title: "Ravnoteža", ids: ["gru-traka", "gru-zivotinje"] },
      { title: "Sve zajedno", ids: ["gru-staza", "sam-pospremanje"] },
    ],
  },
];

const PRINCIPLES = [
  { title: "Kratko i često", text: "Pet minuta svaki dan vredi više od sat vremena jednom nedeljno." },
  { title: "Prvo stanje, pa igra", text: "Ako je dete umorno ili uznemireno, prvo smirivanje, a zahtev kasnije." },
  { title: "Pohvalite pokušaj", text: "Pokušaj je uspeh. Opišite šta je dete uradilo: „Stao si kad je muzika stala!“" },
  { title: "Završite na vreme", text: "Prekinite dok je još zabavno – tako će dete rado da se vrati igri." },
];

/* Pretvara aktivnost iz biblioteke u aktivnost programa. */
export function toProgramActivity(a, code, areaId, weeks) {
  return {
    code: String(code), title: a.title, areaId: String(areaId), weeks,
    goal: a.goal, materials: a.materials.slice(), frequency: [a.time, a.age].filter(Boolean).join(" · "),
    steps: a.steps.slice(), levels: a.levels.map(l => ({ ...l })), adapt: "",
    parentTracks: a.tracks.slice(), develops: a.develops || "", note: a.note || "", imageIds: [], video: "", libId: a.id,
  };
}

/* Sastavlja sadržaj programa od liste aktivnosti po nedeljama:
   weekPlan = [{ title, ids: [...] }, ...] (svaka stavka je jedna nedelja). */
export function buildContent({ title, childNames = "", intro = "", weekPlan }) {
  const used = [];
  weekPlan.forEach((w, wi) => w.ids.forEach(id => { const a = libById(id); if (a) used.push({ a, week: wi + 1 }); }));
  const areaOrder = [];
  used.forEach(({ a }) => { if (!areaOrder.includes(a.area)) areaOrder.push(a.area); });
  const areas = areaOrder.map((aid, i) => { const ar = LIB_AREAS.find(x => x.id === aid); return { id: String(i + 1), title: ar.title, intro: ar.intro }; });
  const counters = {};
  const byId = new Map();
  used.forEach(({ a, week }) => {
    const areaId = String(areaOrder.indexOf(a.area) + 1);
    if (byId.has(a.id)) { byId.get(a.id).weeks.push(week); return; }
    counters[areaId] = (counters[areaId] || 0) + 1;
    byId.set(a.id, toProgramActivity(a, `${areaId}.${counters[areaId]}`, areaId, [week]));
  });
  const weeks = weekPlan.map((w, i) => {
    const titles = w.ids.map(id => (libById(id) || {}).title).filter(Boolean);
    return { label: `${i + 1}. nedelja`, fromWeek: i + 1, toWeek: i + 1, title: w.title || "", focus: w.title || "", summary: titles.join(", ") };
  });
  return normalizeContent({
    title, childNames, durationWeeks: weekPlan.length,
    intro: intro || "Kratke aktivnosti kroz igru, uklopljene u vaš dan. Ne morate uraditi sve – jedna aktivnost dnevno je dovoljna.",
    areas, weeks, activities: [...byId.values()], principles: PRINCIPLES.map(p => ({ ...p })),
  });
}

export function contentFromTemplate(t, childNames = "") {
  return buildContent({ title: t.title, childNames, intro: t.intro, weekPlan: t.weeks });
}

/* Izabrane aktivnosti raspoređuje u 4 nedelje redom kojim su izabrane. */
export function contentFromSelection(ids, childNames = "", weeksCount = 4) {
  const n = Math.max(1, Math.min(weeksCount, ids.length));
  const plan = Array.from({ length: n }, () => ({ title: "", ids: [] }));
  ids.forEach((id, i) => plan[Math.floor((i * n) / ids.length)].ids.push(id));
  plan.forEach(w => {
    const areas = [...new Set(w.ids.map(id => libById(id).area))].map(a => LIB_AREAS.find(x => x.id === a).title);
    w.title = areas.join(" i ");
  });
  return buildContent({ title: "Program podrške", childNames, weekPlan: plan });
}
