# Filmens källgranskning

Slutligt studiematerial finns i `../film-content.json`: 16 avsnitt, 59 teoriblock, 97 tidsatta fakta, 29 begrepp, 85 repetitionskort, 49 fyralternativsfrågor och 16 återkallningsövningar. JSON-strukturen har validerats, inklusive unika id:n, tidsformat, korttyper och quizens svarsalternativ.

## Granskade källor

- Lokal MP4: `E:\downloads\Vetenskapens värld - Frisk av magiska svampar - under 500MB.mp4`.
- Användarens inklistrade VTT: `C:\Users\lucas\.codex\attachments\f2cb370a-5cd1-4cec-9a40-6123d950c55d\Pasted text.txt`.
- Tillhandahållen källadress för VTT är sparad i materialets `coverage`. Adressen har inte använts för att importera nya medicinska uppgifter.

MP4:s metadata anger 00:58:51.776, 1920×1080 och 25 bilder/sekund. Den innehåller AV1-video och AAC-ljud, utan separat textningsström. VTT innehåller 287 cues; sista cue slutar 00:59:22.560. Cueernas sammanlagda visningstid är 1 347,72 sekunder, cirka 38,2 procent av den lokala filmens längd. Detta är ett mått på visningstid, inte på andelen sakuppgifter.

## Filmgranskningens metod och omfattning

VTT lästes i sin helhet och normaliserades till `cues.json` och `transcript.txt`. Redaktörsnoter och formatering användes inte som filmrepliker.

Från den lokala MP4-filen togs 883 bildrutor var fjärde sekund genom hela filmen, från 00:00:00 till 00:58:48. De nedre bilddelarna lästes med svensk Windows OCR för att hitta intervjutext som redan är inbränd i bilden. OCR-resultat finns i `ocr-1-200.json`, `ocr-180-900.json` och den sammanslagna `ocr-transcript.txt`. OCR läste även bildbrus och miljötext; detta fördes inte vidare automatiskt till teorin.

Centrala intervjupåståenden kontrollerades också visuellt i `review-1.jpg` till `review-6.jpg` samt riktade fulla bildrutor i `frames`. Bland de granskade punkterna finns MDMA/amygdala/prefrontala cortex; fragmenterade traumaminnen; beroendeintervjuns formulering och behov av vidare forskning; escitalopram; nätverksbildens 7 200 kopplingar; välbefinnande; placebo- och blindningskritik; det hypotetiska exemplet 90–100 procent; företagets tillgänglighetsambition; musikens roll; krävande patientupplevelser; KI:s 30 deltagare; och sluttexterna.

## Textning och tidsförhållande

VTT innehåller i huvudsak svensk berättarröst och svenska repliker. Många engelska intervjuer saknas där, men har svensk översättning inbränd i videobilden. Luckorna är därför inte skäl att anta att filmen saknar detta innehåll.

Ämnesövergångar i bildstickprov från inledning till studiosamtal ligger ungefär i fas med VTT. Ingen exakt ljudbaserad synkronisering har genomförts. Ingen generell tidsförskjutning har därför lagts till. Längdskillnaden på 30,784 sekunder ger inte i sig stöd för att flytta alla textningstider.

VTT:s sista cue, 00:59:16.560–00:59:22.560, gäller ett programuppehåll och nästa sändning. Den ligger helt efter den lokala videons slut. Bildrutorna 00:58:44 och 00:58:48 visar sluttexter. Den avslutande VTT-uppgiften har inte använts i teorin och kan inte verifieras mot den lokala MP4-filen.

## Bevarade sakliga begränsningar

- Allt innehåll återger filmens perspektiv och uppgifter från 2022. Dagens regler, godkännanden, forskning eller marknadsläge har inte förts in.
- VTT och filmens inbrända svenska översättning har granskats. Ingen separat fullständig transkription eller oberoende lyssning av allt engelskt tal har gjorts.
- Fyra sekunders sampling kan missa mycket korta textrepliker. Varje enskild bildruta har inte lästs manuellt. Materialet är en omfattande sammanställning, inte en ordagrann eller garanterat uttömmande transkription.
- Ursprungliga forskningsartiklar har inte granskats. Siffror, mekanismer och myndighetskrav anges som programuppgifter.
- Patientberättelser skiljs från gruppresultat. Symtomminskning beskrivs inte som garanterad permanent bot.
- De tre självmordsförsöken i Compass-studien beskrivs som händelser som skulle undersökas vidare; inget orsakssamband påstås vara fastslaget.
- Nittio till hundra procent i Carhart-Harris resonemang markeras som hypotetiskt, inte som ett uppmätt studieresultat.
- De två nätverksbilderna sägs ha samma antal visade kopplingar, 7 200, men annan fördelning. Materialet påstår inte att just illustrationen visar fler kopplingar totalt.
- KI:s psilocybinstudie är pågående och MDMA-studien planerad i filmens tidsperspektiv. Slutresultat eller godkännande tillskrivs dem inte.
- Hopp om godkännande mot slutet av 2023 och marknadsprognosen fem år framåt förblir dåtida ambitioner och prognoser.

Inga filer i webbplatsen har redigerats. Alla forskningsartefakter är sparade i denna arbetsmapp.


## Slutgranskning av kopplingen mellan fakta och övningar

Samtliga 85 kort, 49 quizfrågor och 16 återkallningsövningar har nu en icke-tom `factIds`-lista. Referenserna pekar på befintliga faktaposter. Referenser över avsnittsgränser används när en jämförelse eller syntes faktiskt kräver flera avsnitt. Integrationen behöver därför slå upp faktaposter i hela filmens datamängd.

Faktalistan har kompletterats från 79 till 97 poster för att ge konkret stöd åt befintliga frågor: bland annat filmens tidsanknytning till 2022, kritiskt tänkande i apoteksinledningen, PTSD:s fullständiga namn och återupplevande, Rons urval och studiens deltagarbeskrivning, placebons sockerpiller, Steves första upplevelse, dubbelblindningens definition, den märkbara påverkan efter cirka trettio minuter, rapporterna om snedtrippar, den svenska patientgruppens tidigare vårderfarenheter och studiosamtalets historiska exempel.

Quizens facit har lästs igenom i relation till frågorna och källstödet. Inget facitindex behövde ändras. Frågan om vilket depressionspåstående som är för starkt har avsiktligt det felaktiga universalpåståendet som rätt alternativ: uppgiften är att identifiera överdriften, inte att lära in den som sann.

Tidskoderna har kontrollerats mot VTT och tidigare granskad inbränd intervjutext. Några huvudtider har förtydligats till den relevanta repliken: Steves tvåårsuppgift till 00:32:45, Compass-studiens deltagarantal till 00:38:42, kritikerns uppgift om tydlig påverkan till 00:35:08 och kritikens osäkerhet om placebo till 00:35:20, Lundbergs reservation till 00:48:48 och biverkningsperspektiv till 00:49:36 samt presentationen av Gita Rajan till 00:50:04. För flerledade faktaposter finns `evidenceTimes` med de kompletterande relevanta tidspositionerna. Tidigare begränsning om ungefärliga hänvisningar och avsaknad av exakt ljudsynk gäller fortfarande.

Förklaringsfrågor om generalisering, mekanismliknelser och skillnaden mellan hela insatsen och substansens specifika effekt är källkritiska resonemang. Deras faktareferenser anger de filmuppgifter som resonemanget bygger på; resonemangen påstås inte vara nya uppmätta försöksresultat.

### Faktaposter utan övningsreferens

- film-ptsd-ron-fact-2 (00:06:04): Ron berättar att han använde uthållighetssporter för att hantera ilska och skam.
- film-mdma-studie-fact-6 (00:16:52): MAPS-intervjun uttrycker ett dåtida hopp om godkännande mot slutet av 2023.
- film-mdma-mekanism-risk-fact-5 (00:15:02): Två år efter behandlingen beskrivs Ron som fortsatt fri från PTSD.
- film-mdma-mekanism-risk-fact-6 (00:12:52): En intervjuad forskare säger att MDMA inte verkar beroendeframkallande; detta är en bedömning i filmen.
- film-psilocybin-hjarna-fact-6 (00:31:40): Nutt jämför antidepressivas skydd mot stress med ett gips och psilocybinets påverkan med förändrat tänkande i hjärnbarken.
- film-miljo-cancer-fact-3 (00:45:28): Meditation och naturlig förlossning nämns som exempel på upplevelser utan psykedeliska substanser.
- film-studio-historia-fact-3 (00:56:12): Netz försvarsanknutna forskning gällde bland annat hypnos och möjliga förhörssituationer.

Dessa poster finns kvar som teoriinnehåll. Ingen irrelevant övningskoppling har lagts till enbart för att fylla täckningen.
