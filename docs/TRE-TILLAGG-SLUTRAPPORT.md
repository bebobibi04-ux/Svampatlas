# Tre tillägg i Svampatlas

Verifierat 14 oktober 2026. Projektet är samma fristående GitHub Pages-webbplats.

## Leveransen

[A-nivå | Fördjupning & resonemang](https://bebobibi04-ux.github.io/Svampatlas/#aniva) tillför 28 nya frågor med fullständiga modellsvar: åtta med bokförankring, tio med PowerPointförankring och tio om filmen. De kräver tillämpning, analys, jämförelser och värdering av belägg. Modellerna omfattar 202–229 ord och har nyckelpunkter, argumentationsanalys, bedömningsstöd, avsnittslänkar och individuella källförbehåll. Tolv kunskapsområden fördelar alla 41 befintliga avsnitt. Det finns urval för område, tidigare svåra frågor och slumpordning samt en slumpknapp. Facit börjar dolt, kan döljas igen och registrerar ingen kunskap genom att visas. Egna svar sparas lokalt och i backup. Kan, Osäker och Kan inte använder det befintliga repetitionsschemat. A-nivå är ett pedagogiskt kvalitetsmål, ingen betygsgaranti.

[Slutcheck | Är jag redo för provet?](https://bebobibi04-ux.github.io/Svampatlas/#slutcheck) har snabbcheck och fullständig slutcheck. Snabbchecken innehåller 46 uppgifter: ett urval från samtliga områden, alla tio lärarfrågor, två processfrågor, två objektiva teorifrågor och åtta olika arter. Den är uttryckligen ett stickprov.

Fullständig slutcheck innehåller 452 uppgifter. De täcker en spårbar checklista med 705 kontrollpunkter: 335 tidigare faktaposter, 130 begrepp, 97 befintliga återkallningsfrågor, sju processer, 28 nya avancerade uppgifter och 108 fotografier av 54 arter. Överlappande kunskap kan testas på flera sätt; kontrollpunkterna är inte oberoende betygspoäng. Befintliga recalluppgifter och kompletterande kort täcker faktakunskapen. Sju tidigare bakgrundsfakta utan egna kort/recall får avgränsade källfrågor med låg repetitionsprioritet. Dessa är inte nya provområden. Varje avsnitt får också en befintlig objektiv teorifråga. Den exakta matrisen finns i [final-check-coverage.json](../content/final-check-coverage.json).

En fullständig kontroll är lång och kan göras i flera pass. Svar, vald fråga, ordningsföljder, bedömningar och historik sparas. En ny kontroll arkiverar den gamla i den nya funktionens separata historik, som behåller de tolv senaste kontrollerna. Det gamla provlägets historik och pågående prov använder fortsatt sina befintliga fält och nycklar.

[Artbiblioteket](https://bebobibi04-ux.github.io/Svampatlas/#arter) har nu två olika autentiska fotografier för var och en av de 54 arterna. Inget originalfoto har ersatts. Varje art har en jämförelsevy med båda bilderna, bildväxling, förstoring och ursprungliga artlänkar/noteringar. Bildernas källidentifieringar, eventuella synonymer, fotograf och licens har kontrollerats. Bestridda, oidentifierade och motstridigt taxonmärkta kandidater avvisades. Kontaktblad har använts för att visuellt jämföra motiven med originalen; de nya fotografierna visar andra exemplar, vyer eller miljöer och har andra fotografer. Ingen AI-genererad artbild har använts.

Artträningen väljer ett första foto slumpmässigt och växlar därefter mellan tillgängliga foton för samma art. Det valda fotot är stabilt under frågan. Bildmatchning använder också olika foton för mål och alternativ, och pågående vanliga prov behåller sina valda foton vid återupptagning. Slutchecken testar alla 108 foton separat men rapporterar alltid högst 54 olika arter. Quizbilderna använder neutrala, opaka filnamn och alttexter. Artens namn och fotografkällor visas efter besvarandet.

## Resultat och repetitionsplan

Objektiv rättning används för artnamn enligt den befintliga exakta aliaslistan, processordning och befintliga slutna teorifrågor. Fritext får aldrig en påstådd automatisk sak- eller betygsrättning. Användaren skriver först ett eget svar, får facit och kontrollpunkter och självbedömer sedan. Utebliven självbedömning ger inget grönt resultat.

Statusprinciperna är fasta: röd betyder objektivt fel eller självbedömt Kan inte; gul betyder Osäker utan röda resultat; grå innebär saknat svar, utebliven självbedömning eller ofullständig täckning. Grön kräver godkänt för samtliga kontrollpunkter inom området i den aktuella kontrollen. Det svagaste bedömda resultatet används om samma punkt prövas flera gånger, så ett konstaterat fel inte döljs av en annan lyckad fråga. En ny kontroll kan visa förbättring. Olika kontroller blandas inte ihop till en påhittad procentsiffra för provberedskap.

Rapporten skiljer objektiva resultat från självbedömda svar och visar exakt vilka kontrollpunkter som är grå, gula eller röda. Repetera det jag inte kan sammanställer svaga uppgifter med relevanta studietexter, begrepp, kort, recall, avancerade frågor och artjämförelser. Först prioriteras objektiva fel och Kan inte, sedan Osäker; därefter prioriteras centrala tillämpningar, processer, resonemang och artkunskap. En ny kontroll kan skapas för bara de svaga uppgifterna. Återstående grå kontrollpunkter har en egen kontrollknapp.

## Bevarande

Baslinjen var GitHub-commit 9e2f2847fb9f4481b79ec777c86873d1e2bf31a0. Alla 153 tidigare filer jämfördes med GitHub-trädets filhashar före arbetet och en fullständig lokal säkerhetskopia sparades.

Hela den tidigare content/course.json och js/data.js är byteidentiska. Det innebär oförändrade 41 teoriavsnitt, 316 flashcards, 201 quizfrågor, 97 recallfrågor, 130 begrepp, 335 fakta, 54 artobjekt och 287 undertextblock, inklusive samtliga tidigare filmkorrigeringar och fullständiga modellsvar. Originalbilder, bok/PDF, PowerPointmatris och tidigare källgranskningar är bevarade. styles.css och js/core.js är byteidentiska. Inget tidigare innehåll eller facit har raderats eller förenklats.

Tilläggen finns i separata data-, kärn- och gränssnittsfiler. Nödvändiga ändringar i befintlig HTML och tre gränssnittsfiler kopplar in navigation, nya sidor, bilder och den valfria backupdelen additions. Den gamla HTML-strukturen kan återskapas exakt genom att ta bort de två nya navigationslänkarna, tre nya skripten och en extra stilmall. Alla gamla innehålls-ID:n, nycklarna svampatlas-v1 och svampatlas-exam-v1 samt backupschema 1 behålls. Äldre backupfiler behöver inget nytt fält. Tidigare tests frysta HTML-kontroll har avgränsats för just dessa tillåtna tillägg, med en ny exakt kontroll av den fullständiga ursprungliga HTML-koden; deras kontroller av källmaterial, gamla frågor och kärna finns kvar.

Ingen serverfunktion, ChatGPT-inloggning, OpenAI-tjänst eller extern resursladdare har tillkommit. Samtliga quizfoton ingår lokalt i projektet. Nya kontroller sparas lokalt; säkerhetskopior måste fortfarande exporteras om enheten eller webbläsaren byts.

## Källgranskning och bildlicenser

Den globala sökningen inkluderar de nya A-nivåfrågorna i samma träfflista och träffantal som äldre innehåll. Inga-träffar-meddelandet visas inte när en ny fråga matchar.

De 28 nya modellerna har självgranskats och därefter granskats separat mot 294 hänvisningar till 237 befintliga faktaposter. Den separata granskningen gav PASS utan korrigeringskrävande fynd. n + n och 2n, slemsvampscykeln, äldre klassifikationer, MDMA/PTSD kontra psilocybin/depression, 30/60-grafiken och kausalitetsgränserna för riskhändelser kontrollerades särskilt. Se [källgranskningen](TILLAGG-KALLGRANSKNING.json) och [källnoteringarna](TILLAGG-KALLNOTERINGAR.md). Framtids- och vårdresonemang gäller dokumentärens kunskapsläge 2022, inte ett nytt besked om dagens godkännanden.

[Extra bildkällor](../content/extra-image-sources.json) redovisar samtliga 54 nya fotografier med identifieringsunderlag, lokal sökväg, hashvärde, dimensioner, fotograf, licens, attribution och ändringar. Källidentifiering är inte en ny taxonomisk analys från fotot: exempelvis toppmurkla följer kursens redan källnamngivna Morchella conica-begrepp. De ursprungliga artbeskrivningarna och namnvarianterna ändras inte.

Blodchampinjonens andra foto kommer från forskningsgranskad iNaturalist-observation 307449552, fotograf peter_csonka, foto 554557541. Det har CC BY-NC 4.0 och en uttrycklig notering om icke-kommersiell återanvändning. Den licensen behålls för fotografiet; den kostnadsfria studiesajten ger inte rätt att återanvända bilden kommersiellt. Övriga nya fotons individuella CC-licenser och krav följer metadata och visas på sidan. Bilderna har endast storleksanpassats och konverterats till WebP, utan beskärning eller ändrat innehåll.

## Genomförd kontroll

49 automatiska tester passerade med 0 fel. De omfattar alla tidigare regressionstester och nya kontroller av innehållsbevarande, original-HTML, fullständig täckning, grå status i snabbcheck, konservativ sammanvägning av motstridiga resultat, full täckning innan grönt, 108 bilder kontra 54 arter, dolt facit, egen skrivtext, repetitionsprioritering, exakt rättning, backupvalidering, fotoskiften och beständiga fotoval i prov. Alla 54 nya bilders lokala filer, hashvärden, identitetskällor och licensmetadata kontrollerades. De opaka quizkopiorna av originalen har exakt samma filinnehåll som originalbilderna.

Verklig lokal webbläsarkontroll genomfördes under projektsökvägen /Svampatlas/: A-nivåmodell dold/visad, sparad egen text efter omladdning, Osäker och filtret Tidigare svåra; snabbcheck med 46 uppgifter; egen text, manuell bedömning, sparat pass och rapport; personlig repetitionsplan och en riktad omkontroll med ett självbedömt svar; fullständig slutcheck med 452 uppgifter och 108 navigerbara artbilder; avsiktligt felaktigt artnamn med korrekt facit och 1/54 testade arter; ordningsfråga med ändrade steg och korrekt rättning.

Artbiblioteket visade 54 arter med vardera länken till två foton. I Aspsoppsvyn kontrollerades jämförelse, växling till foto 2, förstoring och källangivelse. Två verkliga artträningspass för samma art visade olika opaka bildfiler. Den första besvarades med korrekt svenskt namn och rättades korrekt.

En faktisk backup exporterades och innehöll den nya egna A-nivåtexten, två historiska kontroller och en pågående fullständig kontroll. En äldre backup från 12 oktober importerades via filväljaren: tidigare provhistorik, ett gammalt flashcard och 1/8 manuella provbedömningar återställdes. Därefter importerades den nya backupen, bekräftades och sidan laddades om. Den egna texten, historiken, fråga 345 av 452 och dess sparade artnamn/felresultat återfanns. Detta är verklig filimport utöver automatiska formatkontroller. Testdata skapades endast på den lokala testadressen.

Datorvyn kontrollerades vid 1280×720 med läsbar navigation och två parallella kontrollkort. Mobilvyn kontrollerades vid 390×844 med navigation, bildväxling, förstoring och staplade jämförelsebilder. Dokumentets bredd var 375 pixlar inom 390-pixelsvyn, utan horisontell sidöverströmning. Webbläsarverktygets koordinatklick var inte tillförlitliga efter storleksbytet; berörda kontroller verifierades med tangentbord. Ingen fysisk mobil har provats. Inga konsolfel eller varningar registrerades under funktionskontrollen.

## Gränser för verifieringen

Automatiska tester verifierar funktion och täckningskopplingar, inte att en elev faktiskt kan innehållet. En självbedömning kan vara för generös. De öppna svaren är därför alltid märkta som självbedömning, och någon procentuell garanti för provberedskap visas inte. Alla 452 uppgifter har inte manuellt besvarats i webbläsaren; fullständigt urval och rapportlogik kontrollerades automatiskt, och representativa flöden provades interaktivt.

Andra användares privata progress har inte inspekterats. Bevarande styrks av identiska äldre data/kärnfiler, regressionstester och verklig import av äldre och nya backupfiler. Källornas tidigare redovisade begränsningar gäller fortfarande.

Publiceringsmålet är den befintliga adressen https://bebobibi04-ux.github.io/Svampatlas/. Slutlig publiceringsstatus och kontroll av offentlig version redovisas i leveransen.
