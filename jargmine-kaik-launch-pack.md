# Järgmine Käik — Launch Pack

Kõik tekstid, emailid, postitused ja töövood ühes failis. Copy-paste valmis.

---

## 0) Pakkumise tuum (LUKUS — ei muuda enne esimest launch'i)

| Väli | Väärtus |
|---|---|
| Toote nimi | Järgmine Käik — 3-kuuline akustilise kitarri teekond |
| Tavapakett | **49€** (ühekordne makse) |
| VIP | **179€**, ainult **10 kohta** |
| Kestus | 3 kuud |
| Formaat/kuu | 1 õppetund + 1 PDF + 1 harjutusplaan + 1 muusikaline rakendus |
| Lisaks | Kinnine liikmete kanal + kuu lõpus "näita oma mängu" päev |
| VIP lisand | 45-min Zoom + personaalne tagasiside + 30 päeva harjutussoovitused |
| Müüginumbrid | Min 10 + 2 VIP = 848€ · Hea 25 + 5 VIP = 2120€ · Väga hea 40 + 10 VIP = 3750€ |

**Sisuplaan:**
- **Kuu 1:** Parem käsi rahulikuks — sõrmitsemise baas, pöial, lihtne muster, stabiilsus
- **Kuu 2:** Akordisaade, mis ei kõla igavalt — 3 saatevõtet sama akordiringi peal
- **Kuu 3:** Meloodia akordide sisse — bass + akord + lihtne meloodia koos

---

## 1) Müügilehe tekst (HTML on `jargmine-kaik-landing.html`)

Allikas: vt eraldi HTML-fail samas harus. Lehe blokid:
1. Hero (pealkiri + alapealkiri + CTA)
2. Avatekst (lugesin kursuse ostjate vastuseid…)
3. Lubadus
4. Kellele sobib
5. Kellele ei sobi
6. Mida 3 kuu jooksul teeme (3 kuud)
7. Mida sa saad
8. Alguskuupäeva blokk
9. Paketid (Tava 49€ + VIP 179€)
10. Turvalisuse lause (pärast ei lähe automaatselt kuumakseks)
11. FAQ
12. Final CTA

**Enne avaldamist tee:**
- Asenda kõik `[KUUPÄEV]` ja `[KONTAKT]` tegelikega
- Asenda `#` ostulinkidel päris WooCommerce checkout URL-iga
- Vajaduse korral tõsta üles tegelik foto (`.bio .photo` div on placeholder)

---

## 2) Alguskuupäeva ajakava (NÄIDIS — pane oma kalendrisse)

| Päev | Kuupäev (täida) | Tegevus |
|---|---|---|
| -7 | T | Senistele ostjatele soojenduskiri ("lugesin teie vastused läbi") |
| -5 | N | Müük avaneb senistele ostjatele |
| -3 | L | Pehme sotsiaalmeedia avapostitus |
| -2 | P | Avalik müük + VIP-meeldetuletus |
| -1 | E | Viimane kiri "algab homme" |
| 0 | T | Hooaeg algab — 1. kuu materjal avaneb |
| +30 | T+30 | 2. kuu materjal |
| +60 | T+60 | 3. kuu materjal |
| +90 | T+90 | Hooaja lõpetus + jätku-pakkumine |

---

## 3) WooCommerce seadistus

### Toode 1 — Järgmine Käik (Tava)
- **Pealkiri:** Järgmine Käik — 3-kuuline akustilise kitarri teekond
- **Hind:** 49€
- **Tootekategooria:** Digikursus / Veebikursus / Kitarrikursus
- **Type:** Virtual / Downloadable (vajadusel)
- **Laoseis:** piiramatu
- **Lühikirjeldus:**
  > 3-kuuline juhendatud teekond inimesele, kes oskab juba mõnda akordi, aga tahab selget järgmist sammu. Iga kuu saad ühe õppetunni, PDF-i, harjutusplaani ja muusikalise rakenduse.

### Toode 2 — Järgmine Käik VIP
- **Pealkiri:** Järgmine Käik VIP — Paul vaatab su mängu üle
- **Hind:** 179€
- **Laoseis:** **10** (kindlasti pane piirang, et ei müüks rohkem)
- **Lühikirjeldus:**
  > Kõik "Järgmise Käigu" materjalid + üks 45-minutiline Zoom Pauliga, personaalne tagasiside ja 30 päeva harjutussoovitused. Ainult 10 kohta.

### Maksed
- Stripe + Montonio (Eesti pangad — Swedbank, SEB, LHV, Coop)

---

## 4) Maksejärgsed automaatkirjad (Brevo)

### Kiri A — Tavapaketi tellimuse kinnitus
**Teema:** Tere tulemast "Järgmisesse Käiku"

```
Hei!

Aitäh, et liitusid "Järgmise Käigu" asutajahooajaga.

See on 3-kuuline teekond, kus võtame rahulikult ette kolm asja: parema käe kontrolli, ilusama akordisaate ja meloodia lisamise mängu.

Esimene materjal avaneb [KUUPÄEV].

Eesmärk ei ole korraga kõike õppida. Eesmärk on teha iga kuu üks asi päriselt paremini.

Liitu kinnise grupiga siit: [GRUPI LINK]

Paul
```

### Kiri B — VIP tellimuse kinnitus
**Teema:** Sinu VIP-koht on kinnitatud

```
Hei!

Aitäh, et liitusid "Järgmine Käik VIP" paketiga.

Lisaks 3-kuulisele asutajahooajale saad ühe 45-minutilise Zoomi minuga, kus vaatame sinu mängu üle ja paneme paika konkreetse järgmise sammu.

Enne kõnet võid saata mulle ühe kuni 3-minutilise video oma mängust. See ei pea olema ideaalne. Piisab, kui näen mõlemat kätt ja kuulen heli selgelt.

Broneeri endale sobiv aeg siit: [CALENDLY LINK]

Paul
```

---

## 5) Brevo segmendid

Tee vähemalt need 3 listi (rohkem võib, kui aega on):
- **Senised ostjad** (kõik FF, Mängi Midagi jne)
- **Järgmine Käik — Tava**
- **Järgmine Käik — VIP**

Hilisemad (kui jõuad):
- Küsitlusele klikkinud
- Küsitlusele vastanud
- FF ostjad
- Mängi Midagi ostjad

---

## 6) Liikmete koht — Facebook privaatgrupp

**Grupi nimi:** Järgmine Käik — asutajahooaeg

**Grupi kirjeldus:**
> See on kinnine grupp "Järgmise Käigu" osalejatele. Siia tulevad kuu fookused, meeldetuletused ja "näita oma mängu" päevad.

**Liitumisküsimus uutele liikmetele:** "Mis on su ostumeili aadress?" (kasutad ristkontrollimiseks)

**Pinned post (loomise päeval):**
```
Tere tulemast!

See on rahulik koht. Kolm asja, mida siit oodata:

1. Iga kuu üks fookus, üks õppetund, üks PDF.
2. Kuu viimasel reedel "näita oma mängu" päev — kui tahad, postita kuni 60-sek video.
3. Vastan valitud küsimustele ja teen ühiseid kokkuvõtteid. Personaalse tagasiside saavad VIP-id eraldi Zoomis.

Esimene materjal avaneb [KUUPÄEV].

Paul
```

---

## 7) E-mailijada (täielik tekstidena)

### Email 1 — Soojendus (päev -7, senistele ostjatele)
**Teema:** Lugesin teie vastused läbi

```
Hei!

Aitäh kõigile, kes küsitlusele vastasid.

Lugesin vastused läbi ja üks asi jäi väga selgelt kõlama: paljudel ei ole probleem selles, et tahtmist poleks. Tahtmist on. Aga mingil hetkel kaob suund ära.

Kordusid eriti kolm asja:
- parem käsi ei kuula alati;
- ei ole selge, mida järgmisena õppida;
- tahaks, et lihtsad akordid kõlaksid ilusamalt ja musikaalsemalt.

See on väga tuttav koht. Just sinna jäävad paljud harrastusmängijad kinni: mõned akordid on olemas, huvi on olemas, aga puudub konkreetne järgmine samm.

Selle põhjal panen kokku väikese 3-kuulise asutajahooaja nimega Järgmine Käik.

See ei ole suur ja lõputu kursus. Pigem rahulik teekond: iga kuu üks konkreetne oskus, üks õppetund, üks harjutusplaan ja üks muusikaline rakendus.

Avan selle esmalt senistele ostjatele.

Järgmises kirjas saadan täpse info ja liitumisvõimaluse.

Paul
```

### Email 2 — Avamine senistele ostjatele (päev -5)
**Teema:** Avan "Järgmise Käigu" asutajahooaja

```
Hei!

Eile kirjutasin, et teie vastustest kordus üks selge asi: paljud ei vaja lihtsalt veel ühte videot, vaid selget järgmist sammu.

Nüüd on esimene väike hooaeg valmis müügiks.

Järgmine Käik on 3-kuuline akustilise kitarri teekond neile, kes oskavad juba mõnda akordi, aga tahavad kõlada kindlamalt, ilusamalt ja musikaalsemalt.

3 kuu jooksul võtame ette:
1. parema käe kontrolli;
2. akordisaate, mis ei kõla igavalt;
3. meloodia lisamise akordidesse.

Iga kuu saad ühe õppetunni, PDF-i, harjutusplaani ja väikese muusikalise rakenduse.

Tavapakett maksab 49€.

Lisaks avan 10 VIP-kohta, kus saad ühe 45-minutilise Zoomi minuga. Vaatan su mängu üle, annan tagasisidet ja panen sulle paika 30 päeva harjutussuuna.

VIP hind on 179€.

Liituda saad siit: [LINK]

Esimene hooaeg algab [KUUPÄEV].

Paul
```

### Email 3 — VIP-meeldetuletus (päev -2)
**Teema:** VIP-kohti on ainult 10

```
Hei!

Väike meeldetuletus: "Järgmise Käigu" VIP-kohti on ainult 10, sest need sisaldavad personaalset 45-minutilist Zoomi minuga.

[KUI VIP-e ON JUBA OSTETUD, LISA SIIA PÄRIS NUMBER:]
[X kohta on juba võetud. Vabu kohti on (10-X).]

VIP sobib sulle, kui tahad teada, mis just sinu mängus arengut kõige rohkem pidurdab ja mida järgmise 30 päeva jooksul harjutada.

VIP sisaldab:
- kogu 3-kuulist asutajahooaega;
- 45-min Zoomi;
- võimalust saata enne kõnet lühike mänguvideo;
- personaalset tagasisidet;
- 30 päeva harjutussoovitusi.

VIP hind: 179€

[LINK]

Kui tahad lihtsalt 3-kuulise hooajaga liituda, siis tavapakett on 49€.

Paul
```

### Email 4 — Algus läheneb (päev -2 või -1)
**Teema:** "Järgmine Käik" algab [KUUPÄEV]

```
Hei!

"Järgmise Käigu" esimene asutajahooaeg algab [KUUPÄEV].

Esimesel kuul võtame ette parema käe kontrolli: kuidas saada sõrmitsemine rahulikumaks, ühtlasemaks ja musikaalsemaks.

See on hea koht alustamiseks, sest väga tihti ei ole probleem selles, et inimene ei tea akorde. Probleem on selles, et parem käsi ei anna akordidele elu.

Kui tahad liituda, saad seda teha siit: [LINK]

Tavapakett: 49€
VIP: 179€, ainult 10 kohta

Paul
```

### Email 5 — Viimane võimalus (päev -1)
**Teema:** Viimane võimalus liituda enne algust

```
Hei!

"Järgmine Käik" algab homme.

Kui tahad esimese hooajaga kaasa tulla, siis nüüd on hea hetk liituda.

3 kuu jooksul võtame rahulikult ette:
- parema käe kontrolli;
- ilusama akordisaate;
- meloodia lisamise akordidesse.

See sobib sulle, kui oskad juba mõnda akordi, aga tahad lõpuks selgemat suunda ja paremat kõla.

Liitumine:
Tavapakett: 49€
VIP: 179€, ainult 10 kohta

[LINK]

Paul
```

### Email 6 — Hooaja algus (päev 0)
**Teema:** 1. kuu: parem käsi rahulikuks

```
Hei!

"Järgmise Käigu" esimene kuu algab.

Selle kuu fookus on parem käsi: kuidas saada sõrmitsemine rahulikumaks, ühtlasemaks ja musikaalsemaks.

Vaata esimene õppetund siit: [VIDEO LINK]

PDF / harjutusleht: [PDF LINK]

Selle kuu eesmärk: mängida üks lihtne sõrmitsemismuster 60 sekundit järjest ilma katkestamata.

Ära kiirusta. Tee seda rahulikult. Kõige tähtsam ei ole tempo, vaid ühtlus.

Paul
```

---

## 8) Sotsiaalmeedia plaan

### Postitus 1 — Pehme avapostitus (päev -3)
**FB + IG caption:**

```
Lugesin oma kursuse ostjate vastuseid ja üks asi kordus: paljud ei jää kinni selle taha, et nad ei tahaks harjutada. Nad jäävad kinni selle taha, et nad ei tea, mida järgmisena harjutada.

Seepärast teen väikese 3-kuulise teekonna nimega Järgmine Käik.

See on neile, kes oskavad juba mõnda akordi, aga tahavad, et akustiline kitarr hakkaks kõlama kindlamalt, ilusamalt ja musikaalsemalt.

Iga kuu üks oskus.
Üks õppetund.
Üks harjutusplaan.
Üks muusikaline rakendus.

Tavapakett: 49€
VIP: 179€, ainult 10 kohta

[LINK]
```

### Reel/TikTok #1 — "Halb vs parem" (päev -2)
Video sisu:
1. Algaja tuim strumm (5 sek)
2. Sama akordiring rahuliku sõrmitsemisega (8 sek)

Tekst ekraanil: **"Sama akord. Teine parem käsi. Hoopis teine kõla."**

Lõpus tekst: *"Sellepärast algab 'Järgmine Käik' parema käe kontrollist."*

Caption: link bio's.

### Reel/TikTok #2 — "Mida järgmisena õppida?" (päev -1)
Räägid kaamerasse:
> "Paljud kirjutasid küsitluses, et nad ei tea, mida järgmisena õppida. See ongi põhjus, miks tegin 'Järgmise Käigu' — mitte sada videot, vaid iga kuu üks konkreetne samm. Algab [KUUPÄEV]. Link bio's."

### Reel/TikTok #3 — Miniõpetus (päev 0 või +1)
20–30 sekundit lihtsast parema käe mustrist (esimese kuu materjalist).

Lõpus tekst: *"Kui tahad sellist asja rahulikult ja süsteemselt teha, siis 'Järgmine Käik' algas. Link bio's."*

---

## 9) VIP töövoog

1. **Ostab VIP-i** → Brevo sõnastus saadab Kiri B + Calendly linki
2. **Broneerib aja** Calendly's (10–12 võimalikku aega 4–6 nädala jooksul)
3. **Saadab enne kõnet** kuni 3-min mänguvideo
4. **Sa vaatad video üle** enne kõnet
5. **Zoomis 45 min** — vaatad mängu, küsid 2–3 küsimust, näitad 1–2 konkreetset asja
6. **Pärast kõnet** saadad lühikese kirjaliku plaani

### VIP — kirjaliku plaani template

```
Sinu 30 päeva fookus

1. Kõige suurem tugevus:
2. Kõige suurem pidur:
3. Harjutus 1:
4. Harjutus 2:
5. Mida vältida:
6. Järgmine eesmärk:
```

### Calendly seadistus
- Sündmuse nimi: Järgmine Käik VIP — mängu ülevaatus
- Kestus: 45 min
- Buffer: 15 min enne ja pärast
- Kirjeldus: "Saada enne kõnet kuni 3-min video oma mängust. Mõlemad käed peavad olema näha, heli kuulda. Pärast saad lühikese kirjaliku plaani."

---

## 10) Hooaja jooksul — kuurütm

| Nädal kuus | Tegevus |
|---|---|
| 1 | Õppetund + PDF + harjutusplaan välja |
| 2 | Meeldetuletus + üks väike lisasoovitus grupis |
| 3 | Küsimuste kogumine grupis ("kus sa hetkel kinni oled?") |
| 4 | "Näita oma mängu" päev (reede) + ühine kokkuvõte |

**"Näita oma mängu" päeva post grupis:**
```
Reedel on "näita oma mängu" päev. Kui tahad, postita kuni 60-sekundiline video selle kuu harjutusest. See ei pea olema ideaalne. Mõte on näha, kus sa praegu oled.
```

**Pärast päeva — ühine kokkuvõte:**
```
Mida ma teie videotest märkasin: 3 kõige tavalisemat asja.

1. [Asi 1 — nt parem käsi on liiga pinges]
2. [Asi 2 — nt akordivahetus on liiga kiirustav]
3. [Asi 3 — nt bass kõlab liiga valjult, meloodia kaob]

Selle nädala kõigile: tee [konkreetne harjutus] 5 minutit päevas, et see paraneks.
```

**Kaitse oma aega:** Tavagrupis ei anna personaalset tagasisidet igale videole. Vastad valitud küsimustele ja teed ühiseid kokkuvõtteid.

---

## 11) Mõõdikud — daily tracker

Loo Google Sheets fail "Järgmine Käik Launch Tracker":

### Sheet 1 — Daily
| Kuupäev | Müügilehe külastused | Tava ostud | VIP ostud | Käive | Märkused |
|---|---|---|---|---|---|

### Sheet 2 — E-mailid
| Email # | Saadetud | Avamised (%) | Klikid (%) | Vastused | Müüke selle järel |
|---|---|---|---|---|---|

### Sheet 3 — Sotsiaalmeedia
| Kuupäev | Platvorm | Postitus | Vaatamised | Reaktsioonid | Kommid | Klikid linkidele | Liitumised |
|---|---|---|---|---|---|---|---|

### Sheet 4 — Ostjad
| Eesnimi | Email | Kuupäev | Toode (Tava/VIP) | Kogusumma | VIP aeg broneeritud? | VIP video saadud? | Kõne tehtud? |
|---|---|---|---|---|---|---|---|

### Sheet 5 — Lessons
Pärast launch'i — mis töötas, mis ei töötanud, mida muuta järgmiseks korraks.

---

## 12) Sihtnumbrid

| Tase | Tava | VIP | Käive |
|---|---|---|---|
| **Miinimum** (test õnnestus) | 10 × 49€ = 490€ | 2 × 179€ = 358€ | **848€** |
| **Hea** | 25 × 49€ = 1225€ | 5 × 179€ = 895€ | **2120€** |
| **Väga hea** | 40 × 49€ = 1960€ | 10 × 179€ = 1790€ | **3750€** |

**Kui tulemus on alla miinimumi:** ära paanitse. Vaata, kas probleem oli (a) nõudluses (vähe kliki müügilehele) või (b) konversioonis (palju klikki, vähe oste). Esimene on positsioneerimise/sõnumi probleem. Teine on müügilehe või hinna probleem.

---

## 13) Pärast hooaega — jätku-pakkumine

**Soovitus:** valmista ainult üks variant, mitte mitut. Lihtsam otsus.

**Soovituslik valik:**
- **Järgmine Käik 2** — €59 asutajatele (10€ tõus baseline'ist, premium on €69 hiljem hooaeg liitujatele)

VÕI

- **Aastane jätkuplaan** — €99/aasta, iga kuu üks uus praktiline mänguvara/õppetund

**ÄRA** ehita seda enne esimese launch'i tulemusi. **JA ÄRA** muuda hooaeg 1 automaatseks kuumakseks. Müügilehel on selge sõnastus:
> "Pärast esimest hooaega ei lähe midagi automaatselt kuumakseks. Asutajaliikmed saavad esimesena võimaluse jätkata."

---

## 14) Launch checklist (printida välja)

### Enne avalikku launch'i
- [ ] Pakkumise tuum dokumendis lukus (sinu plaani 1. punkt)
- [ ] 3 kuu sisuplaan lukus (sinu plaani 2. punkt)
- [ ] Alguskuupäev valitud
- [ ] WooCommerce Tavapakett toode loodud
- [ ] WooCommerce VIP toode loodud + laoseis = 10
- [ ] Müügileht WordPressis avaldatud (paste `jargmine-kaik-landing.html`)
- [ ] Kõik `[KUUPÄEV]` ja `[KONTAKT]` asendatud
- [ ] Stripe + Montonio test-ost tehtud (€0.01)
- [ ] Brevo segmendid loodud
- [ ] Maksejärgsed automaatkirjad (Tava + VIP) seadistatud
- [ ] Calendly seadistatud + link kirjas B
- [ ] Facebook privaatgrupp loodud + kirjeldus + pinned post
- [ ] 1. kuu video filmitud + üles laetud (privaatne link)
- [ ] 1. kuu PDF valmis
- [ ] Email 1 (soojendus) ajastatud / saadetud
- [ ] Google Sheets tracker valmis

### Launch-päeval (avalik)
- [ ] 9:00 — Email 2 saadetud kogu listile
- [ ] 9:10 — FB postitus
- [ ] 9:15 — IG postitus + story
- [ ] 9:20 — Reel/TikTok #1 üles
- [ ] 12:00 — kontroll: müüke? tehnilised vead?
- [ ] 18:00 — story update: "X kohta võetud" (kui asjakohane)
- [ ] 22:00 — vasta kõigile commentidele/sõnumitele

### Post-launch
- [ ] Päev +1: Reel/TikTok #2
- [ ] Päev +2: Email 3 (VIP meeldetuletus)
- [ ] Päev +5: Email 4 (algus läheneb)
- [ ] Päev +6: Email 5 (viimane võimalus)
- [ ] Päev +7 (= hooaeg algab): Email 6 + 1. kuu materjal avaneb
- [ ] Iga kuu lõpus: "näita oma mängu" päev + ühine kokkuvõte
- [ ] Hooaja lõpus: jätku-pakkumine

---

## 15) Mida MITTE teha (sinu enda hoiatused, lukustatud)

- Ära hakka enne launch'i tegema täiuslikku portaali.
- Ära filmi kohe 3 kuu kogu sisu, kui see lükkab müüki edasi. **1. kuu peab olema valmis. 2. ja 3. kuu valmivad jooksvalt.**
- Ära pane hinnaks tagasi 39€, kui oled 49€ otsustanud.
- Ära müü VIP-i alla 179€.
- Ära luba igaühele personaalset tagasisidet tavapaketis.
- Ära luba konkreetseid tuntud Eesti lugusid, kui õiguste teema pole selge.
- Ära tee esimest hooaega automaatseks kuumakseks.
- Ära tee nime enam keerulisemaks.
