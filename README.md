# Svampatlas – fristående webbplats

**Publicerad 2026-10-10:** [Öppna Svampatlas](https://bebobibi04-ux.github.io/Svampatlas/) · [Källkod på GitHub](https://github.com/bebobibi04-ux/Svampatlas).

Det här är den befintliga färdigbyggda Svampatlas, exporterad för vanlig webbhosting och GitHub Pages. Besökare behöver ingen inloggning. Webbplatsen behöver varken ChatGPT, OpenAI-tjänster, API-nycklar, databas, installation av paket eller byggsteg.

Allt studiematerial, filmkorrigeringarna, designen, navigationen, bilderna och studieverktygen är bevarade. Endast den valfria agentintegrationen har tagits bort och backupinstruktionen har anpassats till byte av valfri webbadress. Koden använder vanlig HTML, CSS och JavaScript.

## PowerPoint-komplettering 2026-10-10

Hela lärarens 39-sidiga PowerPoint ingår nu i teori, kort, quiz, active recall och prov. Tolv nya avsnitt kompletterar det bevarade originalmaterialet. [Fullständig sida-för-sida-granskning och testresultat](docs/POWERPOINT-TACKNING.md). Äldre verifieringsrapporter beskriver versionen före denna komplettering.

## Publicera gratis på GitHub Pages

1. Packa upp ZIP-filen och öppna mappen **Svampatlas**.
2. Skapa ett **offentligt** repository på GitHub, exempelvis `Svampatlas`.
3. Ladda upp **innehållet i mappen** till repositoryts rot. `index.html`, `styles.css`, `js` och `assets` ska ligga direkt där, inte inuti en extra Svampatlas-mapp. Ta med `.nojekyll`.
4. Öppna **Settings → Pages**. Välj **Deploy from a branch**, **main** och **/(root)**. Klicka **Save**.
5. Vänta tills publiceringen är klar och öppna **Visit site** på samma sida.

GitHub Free stöder Pages från offentliga repositories. Webbplatsen blir offentligt tillgänglig. Instruktionerna följer [GitHubs publiceringsguide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) och [inställningarna för publiceringskälla](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Publiceringen är genomförd i repositoryt `bebobibi04-ux/Svampatlas`, från **main** och **/(root)**. Instruktionerna ovan gäller om du vill publicera en egen kopia. Se [publiceringskontrollen](docs/GITHUB-PAGES-PUBLICERING.md) för verifieringen av den verkliga GitHub Pages-adressen.

### Om du laddar upp i webbläsaren

Ladda upp de uppackade filerna, inte ZIP-filen. GitHubs webbgränssnitt tar [högst 100 filer åt gången](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository). Paketet har fler filer, så använd flera omgångar:

1. På repositoryts startsida väljer du **Add file → Upload files**. Dra in allt från Svampatlas-mappen **utom assets** och spara med **Commit changes**. Behåll undermapparna. För ett tomt repository används länken **uploading an existing file**.
2. På startsidan väljer du **Add file → Create new file**. Skriv `assets/.gitkeep` som filnamn och spara. Det skapar assets-mappen.
3. Öppna **assets** i repositoryt. Välj **Add file → Upload files** och dra in mapparna **book**, **figures**, **species**, samt filerna **Svampar.pdf**, **Svampar-att-lara-in.xlsx** och **undertexter.vtt** från den lokala assets-mappen. Spara ändringarna.
4. Öppna **assets** igen och ladda upp mappen **pdf** i en egen omgång. Den ska ligga på `assets/pdf`, inte direkt i repositoryts rot.
5. Kontrollera att `index.html` ligger i roten och att en artbild ligger exempelvis på `assets/species/kantarell.webp`. Aktivera sedan Pages enligt stegen ovan.

Om du redan använder Git eller GitHub Desktop kan du kopiera hela innehållet till ditt repository och skicka alla filer samtidigt. Webbplatsen behöver inga sådana program för att besökas.

## Använd utan internet eller egen server

Öppna `index.html` i en vanlig webbläsare. Sidans studiematerial och bilder ligger lokalt i paketet; inga externa skript eller typsnitt laddas. Länkar till källor behöver internet när du väljer att öppna dem. Filmen kan öppnas från din egen enhet i **Film & undertexter**. Den stora videofilen ingår inte i paketet, precis som i den tidigare versionen.

För stabil lokal lagring rekommenderas en lokal webbserver. Med Python installerat, öppna en terminal i Svampatlas-mappen och kör:

```powershell
python -m http.server 4438 --bind 127.0.0.1
```

Öppna `http://127.0.0.1:4438/`. Ingen OpenAI-tjänst används. Behåll samma adress mellan studiepass. Lagring vid direkt öppning av filer varierar mellan webbläsare.

## Flytta din studieprogress

Progress, repetitionsdatum och provsvar sparas i webbläsaren för webbplatsens adress. De följer inte automatiskt med när du byter från den gamla adressen till GitHub Pages.

1. På den gamla webbplatsen: **Min progress & backup → Exportera backup**.
2. Öppna den nya GitHub Pages-webbplatsen i din webbläsare.
3. Välj **Min progress & backup → Importera backup** och välj den exporterade filen.

Alla tidigare lagringsnycklar, fråge-ID:n och backupformat är bevarade. Backup innehåller läsmarkeringar, självskattningar, repetitioner, inlämnade resultat och öppna provsvar. Ett pågående prov ingår inte i backup; lämna in det före flytten om du vill föra över resultatet. Exportera backup regelbundet och före rensning av webbplatsdata.

## Filer och vidareutveckling

```text
index.html               Webbplatsens startsida
styles.css               Oförändrad design och mobilanpassning
js/                      Webbplatsens kod och färdiga studiedata
assets/                  54 artbilder, boksidor, figurer, PDF och undertexter
content/course.json      Aktuellt strukturerat studiematerial
content/film-subject.json Ämnesorienterad filmrevision
content/coverage.csv      Kunskapsenheter och övningskopplingar
docs/                    Innehållsrapport, exportkontroll och verifiering
tests/                   Funktionstester
tools/build-data.mjs      Uppdaterar js/data.js från course.json
.nojekyll                GitHub Pages serverar filerna direkt
```

Ändra `content/course.json` för nytt material. Behåll stabila ID:n och källreferenser. Höj `revision` vid väsentliga ändringar av en övning. Öppna resonemangsfrågor ligger i `recall`, med `type: "open"` och `assessment` för källuppgifter, argument, osäkerheter, kriterier och exempel.

Med Node.js kan du uppdatera studiedata och kontrollera funktionerna:

```powershell
node tools/build-data.mjs
node --test tests/study.test.cjs
node --test tests/standalone.test.cjs
```

Webbplatsen kräver inte Node.js för att användas eller publiceras. Kontrollera även originalbilder, källinventering och övningar efter innehållsändringar. Ändras bok- eller artmaterial avsiktligt behöver jämförelseunderlaget i testerna uppdateras.

Se `docs/GITHUB-PAGES-PUBLICERING.md` för kontrollen av den publicerade webbplatsen och `docs/FRISTAENDE-VERIFIERING.md` för exportkontrollen. Tidigare innehållsrapport och filmgranskning följer med som dokumentation.

## Filmens lärarfrågor och resonemang, 2026-10-12

Filmens studieplats finns på `#filmstudier`. Alla tio originalfrågor på `#filmfragor` har utvecklade svar. `#resonemang` ger åtta egna resonemangsövningar, två fullständiga diskussionsmodeller, argumentationsanalys och bedömningsstöd. Svar börjar dolda; egen skrivtext och självskattning kan sparas och säkerhetskopieras. Filmen kan väljas separat i provläget.

Tillägget innehåller tre filmavsnitt, 18 kort, 16 quizfrågor och 20 recallfrågor. Alla tidigare 38 avsnitt, 54 arter, övningssvar och originalbilder är bevarade. 36 tester passerade, och verklig export/import av både äldre och nya backupdata är verifierad. Se [slutrapporten](docs/FILM-PEDAGOGIK-SLUTRAPPORT.md) och [källgranskningen](docs/FILM-PEDAGOGIK-KALLGRANSKNING.json).


## Tillägg 14 oktober 2026

[A-nivå | Fördjupning & resonemang](https://bebobibi04-ux.github.io/Svampatlas/#aniva) tillför 28 källförankrade modeller över hela provområdet. [Slutchecken](https://bebobibi04-ux.github.io/Svampatlas/#slutcheck) har 46 uppgifter i snabbcheck och 452 i fullständig kontroll, med spårbar täckning, tydlig självbedömning och repetitionsplan. Alla 54 arter har två olika autentiska fotografier och bildvariation i träningen.

Alla tidigare kursdata och originalbilder är bevarade. Nya data byggs vid behov med `node tools/build-additions.mjs`. Kontroll: `node --test tests/*.test.cjs`.

[Fullständig slutrapport och verifieringsgränser](docs/TRE-TILLAGG-SLUTRAPPORT.md) · [Nya bildkällor och individuella licenser](content/extra-image-sources.json). Blodchampinjonens andra foto har CC BY-NC 4.0; dess kommersiella återanvändning ingår inte.


## Provfrågor och källgranskning – 2026-10-14

Ny sektion `#provfragor`: fem rapporterade frågor och tio övningsfrågor med utvecklade, källbundna svar. Alla 43 fördjupningsmodeller är kopplade till samma träning och backup. Fakta begränsas till boken, undervisningens PowerPoint och tillgängligt filminnehåll. Se [slutrapporten](docs/PROVFRAGOR-KALLOR-SLUTRAPPORT.md) och [granskningsloggen](docs/STRIKT-KALLGRANSKNING.json).
