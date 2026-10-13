# Innehållsgranskning: avancerade tilläggsfrågor, 14 oktober 2026

## Leverans och omfattning

`advanced-content.json` innehåller 28 nya frågor: 8 med boken som huvudkälla, 10 med PowerPointen som huvudkälla och 10 med filmen som huvudkälla. Frågorna kopplar ofta samman flera källor. Tolv kunskapsområden fördelar de 41 befintliga avsnitten exakt en gång. Även frågornas egna avsnittslänkar täcker samtliga 41 avsnitt.

Varje fråga har ett sammanhängande modellsvar på 202–229 ord, fem kunskapspunkter, fem bedömningspunkter och tre korta förklaringar av resonemangets struktur. Svaren har minst fyra stycken. De prövar tillämpning, jämförelse, felsökning av modeller, följder av blockerade processer, tolkning av belägg eller argumentation. De är inte gamla frågor med tillägget ”förklara utförligt”. Att närliggande kunskap återkommer är avsiktligt: de nya frågorna använder den i andra sammanhang och ersätter inte befintliga övningar.

A-nivå är här ett pedagogiskt kvalitetsmål: korrekt begreppsanvändning, sammanhängande orsaksförklaringar, tillämpning, relevanta jämförelser, belägg och nyanserad slutsats. Materialet är ingen garanti för lärarens betyg och ingen påstådd officiell poängmatris för en viss provversion. Även andra välgrundade resonemang kan vara godtagbara, särskilt i etiska frågor.

## Faktagrund

Utgångspunkt: det befintliga projektets `content/course.json`, SHA-256 `362f276cd8e46b5521330ebf7b41b2ad981191e32108169a242038dd1b124f5d`.

Hela avsnittslistan och alla fakta för bok, PowerPoint och film lästes. Avsnittens källhänvisningar samt tidigare granskade förklaringar lästes och jämfördes med metadata i `book-source.json`, `film-source.json`, `film-pedagogy.json` och `powerpoint-coverage.json`.

- Boken avser redan lästa originalfoton av sidorna 266–269. Källans begränsande uttryck, till exempel många, vanligen och kan, behålls där de är avgörande.
- PowerPointen är den tidigare granskade PDF-filen `Svampar.pdf`, 39 sidor. De tidigare korrigeringarna av äldre systematik, namnlösa bilder och livscykelfel används som de redan finns i projektet. Inga nya moderna taxonomiska utläggningar tillförs.
- Filmens medicinska, regulatoriska och ekonomiska information återges som dokumentärens framställning 2022. Den tidigare granskningen av VTT, bildtext/OCR och relevanta bildrutor återanvänds. Detta arbete har inte skapat en ny fullständig transkription av originalets engelska ljud och påstår inte heller det.
- Lärarens tio filmfrågor och den centrala diskussionsuppgiften finns kvar i originaldelen. De nya filmfrågorna är kompletterande analyser av bland annat felaktiga rubriker, grafer, mekanismargument och prioriteringskonflikter.

Ingen ny extern biologisk eller medicinsk faktakälla har införts. Inga nya provområden, receptorförklaringar, aktuella laguppgifter, doseringsråd eller godkännandestatusar har lagts till. Alla biologiska grundpåståenden hänvisar till existerande faktaposter. Det finns 294 faktareferenser, till 237 olika befintliga fakta. Samtliga hänvisningar är validerade och finns i de avsnitt som respektive fråga länkar till. De 28 uppgifterna täcker inte ensamma varje enskilt av kursens 335 fakta; de kompletteras av slutcheckens övriga täckningskatalog.

## Gräns mellan källa och analys

Varje fråga har `sourceNote`, där källområden och sid- eller avsnittsankare anges tillsammans med förklaring av vad som är ett pedagogiskt scenario eller egen analys. Filmens avsnittsankare är inte ett påstående att samtliga uppgifter sägs vid just startsekunden; de exakta faktaposterna bär egna tidsangivelser i kursens källdata.

Tankeexperimenten om kompakt svampform, plantor, behållare, omritade diagram, kärnfusionsblockering, tidningsrubriker, regionbeslut och besparingsförslag är tydligt påhittade. De används för att pröva tillämpning av redan behandlad kunskap. Inga resultat från dessa fall påstås vara uppmätta. En blockerad modellprocess används för logisk analys av den givna cykeln, inte för att uppfinna egenskaper hos en verklig mutant.

Förslag om kontrollförsök, relevant jämförelse, uppföljning och kompletterande mätningar är metodresonemang. De är inte påståenden om genomförda studier. Etiska begrepp som informerat samtycke, skyddsansvar och rättvis tillgång används för egna normativa avvägningar med filmuppgifter som bakgrund; de beskrivs inte som ett komplett dokumenterat försöksprotokoll.

## Särskilt granskade risker för sakfel

1. Hyfförening/plasmogami skiljs från kärnsammanslagning/karyogami. Två åtskilda haploida kärnor, n + n, är inte en diploid kärna 2n. Bokens allmänna modell likställs inte med den specifika basidiemodellens tidsförlopp.
2. Slemsvampens amöboida och flagellata former är alternativ med dubbelriktade pilar. Ett diploidkärnigt plasmodium utvecklas från en zygot genom mitotiska kärndelningar. Det blandas inte ihop med ett tvåkärnigt svampmycel. Originalets felaktiga diploidlegend behandlas som ett känt källfel.
3. Historiska algsvampar, protister, formgrupper och ekologiska relationer förklaras på sina respektive nivåer. En namnlös bild artbestäms inte säkert, och två liknande fotosubstrat ger inte en gemensam art.
4. Askosporer utvecklas inne i asci och basidiosporer utanpå basidier. Mikroskopiprovens fråga anger sexuell sporbildning; den hävdar inte att varje ospecificerad utvändig spor gör en organism till en basidiesvamp.
5. Kantarellens åsar skiljs från äkta lameller; ring och strumpa från varandra; hattfjäll från sporer. Fler foton ger inte någon garanti för ätlighet.
6. Jäsningens syreoberoende innebär inte att jäst saknar all cellandning. Kyla och utebliven synlig tillväxt bevisar inte att alla sporer dött.
7. Psilocybin/depression och MDMA/PTSD blandas inte ihop. MDMA:s resurskrav eller riskuppgifter används inte som fastställda psilocybinuppgifter. Psykiskt lidande hos cancerpatienter skiljs från behandling av själva cancern.
8. Filmens 30/60 gäller andelar med den redovisade förbättringen, inte att varje persons symtom minskade med dessa procent eller att alla är permanent botade. Ungefär 30 procentenheter och ungefär dubblerad andel är enkel räkning från avrundad grafik, ingen ny studieanalys. Inga osäkerhets- eller signifikansmått hittas på.
9. Två tredjedelar utan PTSD efter två månader gäller MDMA-gruppen. Ett tvåårigt patientfall är inget gruppmått på långtidsnytta.
10. Nätverksbilderna har samma angivna totalantal, 7 200, med annan fördelning. Snökulan är en liknelse. Hjärnavbildning bevisar inte ensam klinisk effekt, permanent bot eller frånvaro av förväntningars bidrag.
11. Svår blindning betyder inte att allt har bevisats vara placebo. Gemensamt stöd i två grupper betyder inte att stödet saknar betydelse. En egen komponent kan bidra till båda gruppernas utfall.
12. Tre självmordsförsök är allvarliga säkerhetssignaler med osäker orsak, varken bevisad substansorsak eller oviktiga händelser. Patienters förändrade sinnesupplevelse diagnostiseras inte som psykos.
13. KI:s fråga om den psykedeliska upplevelsens nödvändighet förblir öppen i materialet. Ingen ny substans som säkert förenar utebliven upplevelse och bevarad nytta påstås finnas.
14. Tradition, historiska förbud, stora marknadsprognoser och ekonomiska intressen är inte självständiga effektmått. Patentintresse bevisar inte fusk. Prognoser från 2022 återges inte som uppnådda nutida utfall.

## Tekniska innehållskontroller

`advanced-content-audit.json` redovisar valideringen: 28 unika ID:n, 12 områden, alla 41 avsnitt exakt en gång i områdeslistan och täckta i frågornas länkar, 8/10/10 i huvudsaklig källfördelning, giltiga faktareferenser, inga ordagranna kopior av gamla frågor, 202–229 ord per modellsvar, fem punkter vardera för kunskap och bedömning samt tre analyser per uppgift.

Slutlig SHA-256 för `advanced-content.json`: `2c72ebac5eb15429d2ebd5624440ba9d9e03feb66e1114c80697044ff252889e`.

Endast nya innehålls- och granskningsfiler har skrivits i arbetsmappen. Inga befintliga webbplatsfiler har ändrats av innehållsarbetet. Granskningen avser innehåll och källkopplingar; funktions-, bevarande- och webbläsartester genomförs av huvudagenten vid integrationen.
