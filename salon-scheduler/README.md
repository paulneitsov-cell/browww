# Salongi graafik

Lokaalne brauseripõhine kuugraafiku rakendus kahele iluteenuste salongile.

## Funktsionaalsus (MVP)

- Kahe salongi seadistus (Salong A ja Salong B)
- Lahtiolekuajad ja vajalik töötajate kaetus iga nädalapäeva kohta
- Töötajate haldus: lubatud salongid, eelistatud salong, sihttunnid (min/cel/max),
  laupäevatöö, eelistatud kellaajaperiood, märkmed
- Töötaja kuueelistused: pole saadaval / eelistab vaba / eelistab tööd päevad
- Kuugraafiku genereerimine ühe nupuvajutusega (mitme katsega randomiseeritud algoritm)
- Vaated: kalender, töötaja vaade, salongi vaade
- Töötaja kogutundide arvutus ja kõrvalekallete märgistus
- CSV-eksport
- Andmed salvestatakse brauseri `localStorage`-i

Edasiarendused (mitte-MVP): käsitsi vahetuste muutmine, Exceli eksport,
ajaplokk-tasandil kaetuse mõõtmine, fikseeritud vahetused.

## Tehnoloogia

- React 18 + TypeScript
- Vite
- Ei mingit serverit, ei mingit sisselogimist

## Lokaalselt jooksutamine

```bash
cd salon-scheduler
npm install
npm run dev
```

Vaikimisi avaneb brauseris `http://localhost:5173`.

## Tootmisbuild

```bash
npm run build
npm run preview
```

## Failistruktuur

```
salon-scheduler/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig*.json
└── src/
    ├── main.tsx                    rakenduse käivitus
    ├── App.tsx                     ülemine raam + tabid
    ├── styles.css
    ├── types.ts                    andmemudel + Eesti tõlked
    ├── storage.ts                  localStorage abstraktsioon
    ├── sampleData.ts               Salong A + Salong B + 4 töötajat
    ├── utils/
    │   ├── date.ts                 kuupäeva-/aja-abifunktsioonid
    │   └── csv.ts                  CSV-eksport
    ├── scheduler/
    │   └── generate.ts             genereerimisalgoritm + skoorimine
    └── pages/
        ├── SetupPage.tsx           salongid + töötajad
        ├── PreferencesPage.tsx     kuueelistused (kalender)
        ├── GeneratePage.tsx        graafiku genereerimine
        └── SchedulePage.tsx        graafiku vaated + CSV-eksport
```

## Andmemudel (lühidalt)

- `Salon`: nimi, aadress, lahtiolekuajad nädalapäevati, vajalik töötajate arv
- `Employee`: nimi, lubatud salongid, eelistatud salong, kuu sihttunnid (min/cel/max),
  laupäevatöö, kellaajaeelistus, kuueelistused (võti `YYYY-MM`)
- `Schedule`: aasta, kuu, vahetuste loetelu, hoiatused
- `Shift`: töötaja, salong, kuupäev, algus, lõpp

Vt täpsemalt: `src/types.ts`.

## Algoritm

1. Iga päeva ja salongi kohta arvutatakse tunnipõhine vajadus.
2. Igale tühjale tunnile otsitakse kandidaatvahetus (4–10 tundi pikk),
   mis ei riku kõvasid piiranguid.
3. Iga kandidaat skooritakse pehmete eelistuste järgi:
   - eelistatud salongi boonus
   - kellaajaeelistus
   - eelistatud tööpäevad / vabapäevad
   - kuusihttundide kaugus
   - järjestikuste tööpäevade arv
4. Valitakse kõrgeima skooriga kandidaat, vahetus salvestatakse,
   nõudlus vähendatakse.
5. Kogu protsessi korratakse mitu korda erineva päeva-/salongijärjestusega
   (multi-restart) ja jäädakse parima üldskooriga lahenduse juurde.
6. Kui mõni nõue jääb täitmata (katmata tunnid, alla minimaalsete tundide jne),
   genereeritakse selgitavad hoiatused.

Kõvad piirangud:
- vahetus 4–10 tundi
- ei tohi olla samaaegselt kahes salongis
- "pole saadaval" päevadel ei plaanita
- maksimaalseid kuutunde ei ületata
- ainult lubatud salongid
- laupäevad ainult neile, kes saavad

Pehmed piirangud (skooritakse):
- eelistatud salong
- eelistatud kellaajaperiood
- eelistatud tööpäevad / vabapäevad
- sihttundide lähedus
- < 6 järjestikust tööpäeva
- vahetuse pikkus ≥ 5 tundi

## Näidisandmed

Esimesel käivitamisel laaditakse näidisandmed:

- Salong A (E-R 10–20, L 10–18)
- Salong B (E-R 9–19, L 10–16)
- Anna Tamm, Mari Kask, Liis Mets, Kristi Saar

Andmete lähtestamiseks vajuta paremas ülemises nurgas "Lähtesta".
