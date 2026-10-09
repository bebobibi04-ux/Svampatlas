# Genomförda kontroller, 2026-10-09

## Automatiserade tester

`node --test tests/study.test.cjs`: **15 tester passerade, 0 fel** efter den slutliga innehålls- och funktionsändringen.

Testerna omfattar exakt rättning av de 54 namnen och deras stödda namnvarianter, repetitionsintervall, validerad backup, samtliga objektiva frågetyper, felrepetition, självskattning, provets dolda facit, sparade svar, obesvarade faktasvar, unik identifiering, källreferenser, bildfiler och rendering av samtliga avsnitt.

De nya kontrollerna omfattar öppna frågors källstöd och olika möjliga slutsatser; text som sparas och återupptas; bedömningsstöd först efter inlämning; prov med enbart öppna frågor utan automatiskt procentbetyg; blandade prov där bara objektiva frågor poängsätts; manuella bedömningar som styr repetitionen utan att ändra poängen; backup och historik med öppna svar; äldre sparade frågealternativ; samt bevarade gamla repetitionshistoriker vid innehållsrevision.

En separat jämförelse mot materialet före filmändringen kontrollerar att boktexter och svar, samtliga artposter och undertextblock är oförändrade. Endast elva interna bokfaktareferenser i två frågor har fått korrekt nollutfyllnad.

Alla fem handskrivna JavaScript-filer har även genomgått syntaxkontroll med `node --check`. Webbplatsens genererade datafil kontrolleras samtidigt.

## Webbläsarkontroller

På en separat lokal testadress, utan att ändra användarens progress:

- Ett prov med åtta öppna filmfrågor startades. Bedömningsstödet var dolt före inlämning.
- Ett eget svar skrevs, sidan laddades om och provet återupptogs med samma text.
- Inlämningsdialogen för obesvarade frågor fungerade. Resultatet visade självbedömning utan automatiskt procentbetyg.
- En manuell bedömning sparades. Provhistoriken visade 1/8 öppna svar självbedömda och det sparade svaret kunde öppnas igen.
- En backup laddades ner och importerades via webbplatsens egna kontroller. Svaret och bedömningen bevarades.
- Ämnesorienterad studietext och active recall med bedömningsstöd granskades visuellt.
- Mobilstorlek 390 × 844 provades: dokumentbredd 375 px, ingen horisontell sidöverströmning och skrivfältet rymdes inom innehållet. Normal vy återställdes.
- Active recall granskades i mörkt läge. Inga JavaScript-fel rapporterades i testvyn under kontrollen.

Skärmbilder från den omarbetade filmdelen och mobilvyn medföljer projektpaketet.

## Innehåll och leverans

Samtliga 161 filmövningar har interna hänvisningar till inventerade källuppgifter. 94 av 101 filminventerade uppgifter har en övningskoppling; övriga är bakgrund eller studietext. Inventeringen gör inte anspråk på att ett ofullständigt transkript täcker varje talat ord. Se innehållsrapporten för de konkreta begränsningarna.

ZIP-paketet kontrolleras för läsbarhet och nödvändiga filer. Det innehåller källkod, körbar statisk webbplats, strukturerade data, bilder, originalmaterial, källregister, täckningsmatris, dokumentation och tester. Videofilen, Git-historik, tillfälliga verktygsfiler, personliga provsvar och publiceringsnycklar ingår inte.

Ingen separat kontroll har gjorts i Safari, Firefox eller på en fysisk telefon. GitHub Pages-publicering är dokumenterad men inte utförd. Den privata Sites-publiceringens resultat verifieras genom tjänstens publiceringsstatus; dess inloggningsflöde ingår inte i den lokala funktionsgranskningen.
