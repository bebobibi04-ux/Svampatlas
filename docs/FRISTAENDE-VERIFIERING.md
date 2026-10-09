# Verifiering av fristående Svampatlas

Datum: 2026-10-09.

Den befintliga färdigbyggda koden har återanvänts. Webbplatsen består av vanlig HTML, CSS, JavaScript och lokala resurser. Den kräver ingen inloggning, ChatGPT Sites, OpenAI-tjänst, API-nyckel, serverfunktion eller installation av paket. Studiedata är redan inbakade i JavaScript; inget byggsteg krävs för publicering.

## Bevarat material och beteende

Hela `content/course.json` är identisk med den befintliga filmrevisionen `film-subject-v2`. Exportinventeringen i `EXPORTKONTROLL.json` jämför SHA-256 för kursfilen och 111 oförändrade webbplatsfiler, inklusive all CSS, HTML, bilder, figurer, originalmaterial, undertexter och huvuddelen av JavaScript-koden.

- 54 arter med bilder, namn och alias.
- 26 teoriavsnitt: 10 från boken och 16 från filmen.
- 177 flashcards, 103 quizfrågor, 44 active recall-frågor och 59 begrepp.
- 8 öppna resonemangsfrågor med bevarat bedömningsstöd.
- 287 undertextblock och 39 sidor av originalpresentationen.
- Navigation, artträning, sökning, provläge, repetition, lokal progress och backupformat.
- Mobilanpassningens CSS och tidigare design är oförändrade.

Två av webbplatsens kodfiler har avsiktliga ändringar: den valfria WebMCP-agentintegrationen är borttagen från `app.js`, och en instruktion i `views.js` beskriver byte av valfri webbadress. Innehållet och studieverktygens funktioner har inte byggts om. Lagringsnycklar och stabila fråge-ID:n är bevarade.

## Genomförda kontroller

18 automatiska tester passerade utan fel efter uppdatering av studiedata. Alla fem JavaScript-filer klarade syntaxkontroll. Tester omfattar exakt namn- och aliasrättning, repetitionsintervall, backupvalidering, quizets frågetyper, rättning, resultat och felrepetition, självskattning, sparade provsvar, dolt facit före inlämning, öppna och blandade prov, återupptagning, manuell bedömning, filmrevisionens progresshantering samt innehålls- och bildintegritet.

Fristående-specifika tester kontrollerar att HTML använder relativa lokala sökvägar även under `/Svampatlas/`, att `.nojekyll` ingår, att ingen Sites-konfiguration följer med och att webbplatskoden saknar externa resursladdare och agenttjänster.

Webbplatsen öppnades i en vanlig webbläsarvy via en separat lokal statisk server på `http://127.0.0.1:4439/Svampatlas/`. Startsidan svarade med HTTP 200. Artbiblioteket visade 54 namn; sökning efter kantarell gav två matchningar med laddade lokala bilder. Filmens flashcards kunde startas, vändas och självskattas. Självskattningen fanns kvar efter omladdning, med 1 av 177 kort registrerade. Den korrigerade filmintroduktionen visades med källuppgifter, analys, jämförelsen mellan psilocybin och MDMA samt källans tidsperspektiv. Inga JavaScript-fel registrerades under granskningen. Skärmbilden `svampatlas-fristaende.jpg` kommer från denna fristående version.

## Kontrollens gränser och flytt av progress

GitHub-publicering har inte utförts. Ingen verklig GitHub Pages-adress har därför testats. Den lokala kontrollen använder motsvarande undermappsstruktur. Direkt öppning av `index.html` via filsystemet har inte browser-testats; en statisk webbserver eller GitHub Pages ger stabilare lagring mellan studiepass.

Backupformatets kompatibilitet och bevarandet av öppna provsvar har verifierats automatiskt. En extra kontroll med syntetisk backup från originalversionen kunde inte slutföras i webbläsarverktyget eftersom filväljarhändelsen inte kunde fångas. Det testets fil följde inte med i leveransen. Den fristående versionens importkod är bevarad.

Den nya webbläsarkontrollen utfördes i datorvy. Verktygets försök att ändra visningsbredden fick ingen effekt, så ingen ny mobilkontroll påstås här. Mobilanpassningen har bevarats genom identisk CSS och HTML.

Personlig progress ingår inte i projektfilerna. Exportera en backup på den gamla webbplatsen och importera den på den nya via **Min progress & backup**. Ett pågående prov följer inte med i backupen; lämna in det före flytten om du vill föra över resultatet. Den stora MP4-filen ingår fortfarande inte; välj den lokalt i **Film & undertexter**.

Tidigare innehållsrapporter och filmgranskning följer med som historisk dokumentation. Den här rapporten gäller den fristående exporten.
