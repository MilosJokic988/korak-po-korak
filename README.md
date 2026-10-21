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

- **Novi program → Počni od praznog**: stručnjak ga popunjava u uređivaču (aktivnosti, koraci, nedelje, procena, slike).
- **Uvoz gotovog programa (.json)**: paketi napravljeni za ovu aplikaciju (radi i stari format „Kućni defektolog“).
- **Automatski uvoz Word/PDF dokumenta** (opciono): na Vercel dodajte `ANTHROPIC_API_KEY`. Naplaćuje se po korišćenju (okvirno nekoliko desetina centi po programu) i radi samo stručnjacima sa aktivnom članarinom.

---

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
