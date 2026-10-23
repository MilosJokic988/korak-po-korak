# Korak po korak

Platforma za stručnjake (defektologe, logopede, terapeute) i porodice sa kojima rade.

- **Stručnjak** se sam registruje i dobije probni period. Podesi svoj profil (ime, fotografija, reč dobrodošlice), pravi porodice i programe, prati zapažanja i odgovara na poruke. Posle probnog perioda plaća mesečnu članarinu.
- **Porodica** otvara lični link ili upisuje kod i dobija program svog stručnjaka: Plan za danas, aktivnosti korak po korak, zapažanja i poruke.
- **Vlasnik platforme** vidi sve stručnjake, kome ističe članarina, i jednim klikom produžava članarinu kad stigne uplata.

Tehnički: Vite (bez dodatnih biblioteka), Supabase (baza i prijava), Vercel (hosting i funkcije), Resend (mejlovi).

---

## 1. Postavljanje (jednom, oko 30 minuta)

### A) GitHub
Napravite **nov privatan** repozitorijum, npr. `korak-po-korak`, i u njega pošaljite ceo ovaj folder.

### B) Supabase – baza
1. **supabase.com → New project**: Name `korak-po-korak`, jaka šifra baze, Region **Central EU (Frankfurt)**.
2. **SQL Editor → New query** → nalepite **ceo** `supabase/schema.sql` → **Run** („Success“).
3. **Authentication → Sign In / Providers → Email**:
   - **Allow new users to sign up: UKLJUČENO** (stručnjaci se sami registruju)
   - **Confirm email: ISKLJUČENO** za početak. Supabase-ov besplatni mejl servis šalje samo nekoliko mejlova na sat, pa bi potvrde kasnile. Kada povežete svoj domen u Resend-u (vidi E), možete da ga uključite.
4. **Authentication → URL Configuration → Site URL**: adresa aplikacije, npr. `https://korakpokorak.vercel.app`.
5. **Project Settings → API Keys**: prepišite **Project URL** i **Publishable** ključ. **Nikad ne koristite secret / service_role ključ.**

### C) Vercel – hosting
1. **Add New → Project** → izaberite GitHub repozitorijum → **Deploy**.
2. **Settings → Environment Variables** (Production):
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = Publishable ključ
3. **Deployments → ⋯ → Redeploy**.

### D) Vaš nalog i vlasnička prava
1. Otvorite aplikaciju → **Prijava za stručnjake → Registrujte se** i napravite svoj nalog.
2. U Supabase **SQL Editor** pokrenite (sa svojim mejlom):
   ```sql
   insert into public.platform_admins (user_id)
   select id from auth.users where email = 'vas@mejl.com'
   on conflict do nothing;
   ```
3. Osvežite aplikaciju. U meniju se pojavljuje **Vlasnik**. Tu upišite podatke za uplatu (primalac, račun, cena). Dok ih ne upišete, stručnjaci vide da podaci za uplatu još nisu objavljeni.

### E) Obaveštenja mejlom (preporučeno)
1. **resend.com** → nalog → **Domains → Add domain** (vaš domen, npr. `korakpokorak.rs`) i dodajte DNS zapise koje pokaže. **Bez potvrđenog domena Resend šalje samo na vaš mejl**, a ne stručnjacima.
2. **API Keys → Create API Key**.
3. Supabase SQL Editor:
   ```sql
   insert into public.app_settings (key, value) values ('notify_secret', 'IZMISLITE-DUGACKU-TAJNU-32-ZNAKA')
   on conflict (key) do update set value = excluded.value;
   ```
4. Vercel → Environment Variables: `RESEND_API_KEY`, `NOTIFY_SECRET` (ista tajna), `NOTIFY_FROM` (npr. `Korak po korak <obavestenja@korakpokorak.rs>`), `APP_URL`. Pa Redeploy.
5. Provera: otvorite `https://VASA-ADRESA/api/notify`, treba da piše `{"ok":true,"sent":0}`.

Svaki stručnjak dobija mejl za poruke odmah, a zbirni mejl sa zapažanjima jednom dnevno. U svom profilu može to da isključi.

---

## 2. Naplata članarine

- Stručnjak u meniju **Članarina** vidi status i podatke za uplatu, sa svojim **pozivom na broj**.
- Kada uplata stigne na račun, u meniju **Vlasnik** nađete stručnjaka po pozivu na broj i kliknete **+1 mesec** (ili +3, +12). Produžava se od datuma isteka, pa se ništa ne gubi ni kad neko plati ranije.
- Kad članarina istekne: stručnjak i dalje vidi sve, ali ne može da menja. Porodice imaju pristup još nekoliko dana (podešava se, podrazumevano 7), a onda vide „Program je trenutno pauziran“. **Ništa se ne briše.**
- **Pauziraj** gasi pristup odmah (npr. zloupotreba), a **Aktiviraj** ga vraća.
- Brojevi kartica nikada ne prolaze kroz aplikaciju. Ako kasnije uvedete plaćanje karticom, to ide preko servisa kao što je Lemon Squeezy, na njihovoj stranici za plaćanje.

**Pre nego što počnete da naplaćujete:**
- registrovana delatnost (preduzetnik ili firma) i račun na koji se uplaćuje;
- Vercel **Pro** plan (besplatni Hobby plan je samo za nekomercijalnu upotrebu);
- pravnik da pregleda „Uslove korišćenja i privatnost“ (u aplikaciji na `#/uslovi`, tekst je u `src/main.js`).

---

## 3. Programi

- **Biblioteka aktivnosti** (meni „Biblioteka aktivnosti“): 24 gotove igre u 6 oblasti (regulacija i senzorika, pažnja i slušanje, fina motorika, gruba motorika i ravnoteža, komunikacija i govor, samostalnost i rutine). Svaka ima cilj, materijal, korake, lakšu i težu varijantu i šta roditelj prati. Aktivnosti se dodaju/menjaju u `src/library.js`.
- **Novi program → Brzi početak**: 4 gotova šablona od po 4 nedelje (Telo i smirivanje, Pažnja i slušanje, Rani govor i komunikacija, Ruke i telo).
- **Novi program → Složi iz biblioteke**: stručnjak izabere aktivnosti, a program se sam rasporedi u 4 nedelje.
- **U uređivaču → Dodaj iz biblioteke**: dodavanje gotovih igara u bilo koji program.
- **Novi program → Prazan program**: stručnjak ga popunjava u uređivaču (aktivnosti, koraci, nedelje, procena, slike).
- **Uvoz gotovog programa (.json)**: paketi napravljeni za ovu aplikaciju (radi i stari format „Kućni defektolog“).
- **Automatski uvoz Word/PDF dokumenta** (opciono): na Vercel dodajte `ANTHROPIC_API_KEY`. Naplaćuje se po korišćenju (okvirno nekoliko desetina centi po programu) i radi samo stručnjacima sa aktivnom članarinom.

---

### Moje aktivnosti

Biblioteka → **Nova aktivnost**: naziv, oblast, cilj, materijal, koraci, lakša/teža varijanta, plus
ilustracija ili sopstvena fotografija. Kod gotove aktivnosti postoji „Napravi svoju verziju“.
Moje aktivnosti se biraju svuda kao i gotove (Složi iz biblioteke, Dodaj iz biblioteke, IOP), a
fotografija se automatski kopira u program.

### Učenici, dosije i IOP

„Nova porodica / učenik“ → *Učenik iz mog razreda / grupe* (razred, škola, godina rođenja).
Kartica **Dosije** (za sve, ne samo učenike): pedagoški profil, potrebe po 7 oblasti sa opisom
trenutnog nivoa i hronologija beležaka. Dosije porodica ne vidi.

**Napravi IOP iz dosijea** → izbor IOP1/IOP2/IOP3 i oblasti → nacrt sa merljivim ciljevima,
prilagođavanjima, aktivnostima iz biblioteke, timom i datumima evaluacije (tromesečno).
Sve se menja, predlozi se dodaju klikom, a **Štampaj / PDF** daje formalan dokument sa potpisima.
„Napravi kućni program od aktivnosti“ od IOP aktivnosti pravi nacrt programa za roditelje.
IOP je radni nacrt – izrađuje ga tim za dodatnu podršku, a usvaja pedagoški kolegijum.

### Vizuelna podrška (deca sa PSA, nivo 1–3)

Meni **Vizuelna podrška** – 15 alata, svaki počinje od gotovog predloška: vizuelni raspored, prvo – posle,
sekvenca koraka, tabla izbora, komunikaciona tabla (boje po vrsti reči), emocije (kartice, semafor, skala 1–5),
prelaz i tajmer, socijalna priča (knjižica), vizuelna skripta, pravila, token tabla, kartice za pomoć i pauzu,
nedeljni senzorni raspored, senzorni pasoš i low arousal plan (za dete ili celu grupu).

- Izbor nivoa podrške sam prilagođava broj i veličinu kartica (nivo 3: manje, veće, bez teksta).
- Slike: preko 200 simbola sa pretragom ili sopstvena fotografija.
- Pregled A4 se menja dok kucate; **Štampaj / PDF** daje list spreman za plastificiranje.
- Materijal vezan za dete vidi se u njegovom Dosijeu; uz kvačicu „Prikaži porodici“ roditelji ga vide u
  aplikaciji (stavka „Slike“) i mogu sami da ga odštampaju.
- „Vodič za roditelje i nastavnike“ – jednostrani A4 sa objašnjenjem svih vrsta podrške i preporukama po nivou.

## 4. Lokalno pokretanje
```
npm install
cp .env.example .env    # upišite Supabase podatke
npm run dev
```

## 5. Bezbednost ukratko
- Nijedna tabela nije direktno dostupna. Sve ide kroz funkcije u bazi koje proveravaju ko pita.
- Stručnjak vidi samo svoje porodice, a porodica samo svoj program (pristup tajnim kodom od 8 znakova).
- Vlasničke funkcije rade samo za naloge iz tabele `platform_admins`.
- Lični podaci porodica: samo ime deteta, bez prezimena, adresa i telefona.
