const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const{context,data,root,C}=require('./helpers/atlas.cjs');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/before-film-pedagogy-hashes.json'),'utf8'));
const meta=data.filmPedagogy,proof=JSON.parse(fs.readFileSync(path.join(root,'content/film-pedagogy.json'),'utf8'));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const originalQuestions=['Vad är psilocybin?','Vilka sjukdomar eller besvär hoppas forskarna kunna behandla?','Hur beskriver patienterna sina upplevelser av behandlingen?','Vilka positiva effekter nämns i filmen?','Vilka risker eller nackdelar tas upp?','Varför ges behandlingen tillsammans med utbildad personal?','Vilka bevis använder forskarna för att visa att behandlingen fungerar?','Vilka argument framförs av personer som är skeptiska?','Något i filmen som förvånade dig?','Tror du att psilocybin kommer att användas som läkemedel i framtiden? Varför eller varför inte?'];

test('Film pedagogy adds material while preserving all38 old sections, every prior answer, all species, old concepts, source files and shell',()=>{
 assert.equal(Object.keys(baseline.sections).length,38);for(const[id,sha]of Object.entries(baseline.sections))assert.equal(hash(data.sections.find(s=>s.id===id)),sha,id);
 assert.equal(hash(data.species),baseline.species);assert.equal(hash(data.cues),baseline.cues);
 for(const[term,sha]of Object.entries(baseline.concepts))assert.equal(hash(data.concepts.find(c=>c.term===term)),sha,term);
 for(const[file,sha]of Object.entries(baseline.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),sha,file);
 assert.equal(data.schema,1);assert.equal(data.contentRevision,'film-subject-v2');assert.equal(C.initialState().course,'svampatlas-v1');
});

test('All ten teacher questions are verbatim, classified properly and traceable; the main discussion has two substantive positions',()=>{
 const{A}=context(),teacher=meta.teacherQuestionIds.map(id=>A.entities.get(id));assert.deepEqual(teacher.map(q=>q.question),originalQuestions);
 assert.deepEqual(teacher.map(q=>q.teacherNumber),[1,2,3,4,5,6,7,8,9,10]);assert(teacher.slice(0,8).every(q=>q.type!=='open'));assert.equal(teacher[8].assessment.modelLabel,'Exempel på personlig reflektion');assert.equal(teacher[9].type,'open');
 for(const q of teacher){assert(q.answer.split(/\s+/).length>=100,q.id);assert(q.factIds.length);assert((q.assessment||q.pedagogy).criteria.length);assert(proof.teacherQuestions.some(x=>x.exerciseId===q.id&&x.question===q.question))}
 const q=A.entities.get(meta.discussionQuestionId);assert.equal(q.question,'Bör psykedeliska substanser som psilocybin få användas inom sjukvården för att behandla psykisk ohälsa, eller är riskerna för stora? Motivera ditt ställningstagande med argument från filmen.');
 for(const text of[q.answer,q.assessment.examples[0].text]){assert(text.split(/\s+/).length>=350);assert(text.includes('\n\n'));assert.match(text,/blindning|försöksgruppen|avslöja vem/);assert.match(text,/Etiskt/);assert.match(text,/slutsats/)}
 assert(q.assessment.analysis.some(x=>/Motargument/.test(x.label)));assert(q.assessment.analysis.some(x=>/Slutsats/.test(x.label)));
});

test('Every new film exercise has verified film fact links, safe source times and useful full models instead of unsupported mechanisms',()=>{
 const{A}=context(),facts=new Map(data.sections.flatMap(s=>s.facts.map(f=>[f.id,f]))),newSections=data.sections.filter(s=>meta.newSectionIds.includes(s.id));
 assert.equal(newSections.length,3);assert.equal(newSections.flatMap(s=>s.cards).length,18);assert.equal(newSections.flatMap(s=>s.quiz).length,16);assert.equal(newSections.flatMap(s=>s.recall).length,20);
 for(const s of newSections)for(const q of[...s.cards,...s.quiz,...s.recall]){assert.equal(q.source.kind,'film');assert.match(q.source.time,/^\d\d:\d\d:\d\d$/);for(const id of q.factIds)assert(facts.has(id),q.id+' -> '+id);const a=q.assessment||q.pedagogy;if(a)for(const f of a.facts){assert.equal(f.text,facts.get(f.factId).text);assert.equal(f.time,facts.get(f.factId).time)}}
 assert.equal(meta.reasoningQuestionIds.length,8);for(const id of meta.reasoningQuestionIds){const q=A.entities.get(id);assert.equal(q.type,'open');assert.equal(q.assessment.kind,'filmPedagogical');assert(q.answer.split(/\s+/).length>=150,id);assert(q.assessment.analysis.length>=4);assert(q.assessment.criteria.length>=5)}
 const definitions=proof.teacherQuestions[0];assert(definitions.factIds.includes('film-psilocybin-steve-fact-1'));assert(meta.sourceGaps.some(x=>/receptorer/.test(x.topic)));assert.equal(proof.sourceYear,2022);
});

test('A model is hidden initially, reveal never rates, hiding returns to independent practice, and literal text is escaped',()=>{
 const{A}=context(),F=A.filmStudy,q=A.entities.get(meta.discussionQuestionId);let html=F.reasoningView(q.id);
 assert(html.includes('Visa A-nivå-svar'));assert(!html.includes('Fullständigt modellresonemang'));assert(!html.includes('Så är svaret uppbyggt'));assert.equal(Object.keys(A.state.reviews).length,0);
 const own='Min egen avvägning. <script>alert(1)</script>';F.input({id:'film-own-answer',dataset:{question:q.id},value:own});assert.equal(A.state.filmResponses[q.id].text,own);assert.equal(Object.keys(A.state.reviews).length,0);
 F.actions['film-rate']({dataset:{id:q.id,rating:'know'}});assert.equal(Object.keys(A.state.reviews).length,0);
 F.actions['film-model-toggle']({dataset:{id:q.id}});html=F.reasoningView(q.id);assert(html.includes('Fullständigt modellresonemang'));assert(html.includes('Så är svaret uppbyggt'));assert(html.includes('Alternativ slutsats'));assert(html.includes(C.escape(own)));assert(!html.includes('<script>alert'));assert.equal(Object.keys(A.state.reviews).length,0);
 F.actions['film-model-toggle']({dataset:{id:q.id}});html=F.reasoningView(q.id);assert(!html.includes('Fullständigt modellresonemang'));assert.equal(A.state.filmResponses[q.id].text,own);
});

test('Teacher facts and reflection answers are hidden too, and all film routes render through existing components',()=>{
 const{A}=context(),F=A.filmStudy;for(const id of meta.teacherQuestionIds){let h=F.teacherView(id);assert(h.includes('Ditt svar med egna ord'));assert(!h.includes('Utvecklat svar</h3>'));assert(!h.includes('Fullständigt modellresonemang'));F.actions['film-model-toggle']({dataset:{id}});h=F.teacherView(id);assert(h.includes('Bedömningsstöd')||h.includes('Kontrollera din förklaring'))}
 assert(F.hub().includes('Lärarens'));assert(F.teacherView().includes(originalQuestions[9]));assert(F.reasoningView().includes('LÄRARENS DISKUSSIONSUPPGIFT'));assert(F.repeatView().includes('Filmens repetition'));
 for(const id of meta.reasoningQuestionIds)assert(A.views.assessment(A.entities.get(id)).includes('Fullständigt modellresonemang'));
});

test('Returning to a question starts a fresh hidden-answer practice and keeps the saved writing',()=>{
 const{A}=context(),F=A.filmStudy,id=meta.reasoningQuestionIds[0];F.input({id:'film-own-answer',dataset:{question:id},value:'Min egen text'});F.actions['film-model-toggle']({dataset:{id}});assert(F.reasoningView(id).includes('Fullständigt modellresonemang'));F.onNavigate();const html=F.reasoningView(id);assert(!html.includes('Fullständigt modellresonemang'));assert(html.includes('Min egen text'));assert.equal(Object.keys(A.state.reviews).length,0);
});

test('New saved film text restores safely with old backup format, and does not replace old reviews, readings or exam snapshots',()=>{
 const{A}=context(),F=A.filmStudy,id=meta.teacherQuestionIds[0],species=data.species[0].id;A.state.read=['naringsstrategi'];A.state.reviews[species]=C.schedule(null,'know',100);
 const snapshot=JSON.stringify(A.state.reviews[species]);F.input({id:'film-own-answer',dataset:{question:id},value:'Mitt sparade svar'});const exported=JSON.parse(JSON.stringify(A.state)),validated=C.validateBackup(exported,new Set([...A.entities.keys(),...A.sections.map(s=>s.id)]));
 A.state=validated;F.restore(exported.filmResponses);assert.equal(A.state.filmResponses[id].text,'Mitt sparade svar');assert.equal(JSON.stringify(A.state.reviews[species]),snapshot);assert.deepEqual(A.state.read,['naringsstrategi']);
 const sanitized=F.sanitizeResponses({[id]:{text:'x'.repeat(22000),at:5},unknown:{text:'fel',at:5}});assert.equal(sanitized[id].text.length,20000);assert.equal(Object.keys(sanitized).length,1);F.restore(undefined);assert.equal(Object.keys(A.state.filmResponses).length,0);assert.equal(JSON.stringify(A.state.reviews[species]),snapshot);
});

test('All18 film open questions enter film-only exam, retain responses and show models only after submission without percentage grading',async()=>{
 const film=data.sections.filter(s=>s.source.kind==='film').map(s=>s.id),{A,S,config,draft}=context(film,['film']);config['#exam-kind'].value='theory';config['#exam-format'].value='open';config['#exam-count'].value='all';S.actions['exam-start']();const d=draft();assert.equal(d.items.length,18);assert(d.items.every(q=>q.source.kind==='film'));
 const index=d.items.findIndex(q=>q.id===meta.discussionQuestionId);assert(index>=0);S.actions['exam-jump']({dataset:{index:String(index)}});assert(!S.examView().includes('Fullständigt modellresonemang'));S.input({id:'exam-open-answer',value:'Ett eget villkorat ställningstagande.'});assert.equal(C.validateDraft(draft(),A.entities).answers[index],'Ett eget villkorat ställningstagande.');
 await S.actions['exam-submit']();assert.equal(A.state.attempts[0].total,0);assert(A.state.attempts[0].answers.every(x=>x.correct===null));assert(S.examView().includes('Fullständigt modellresonemang'));assert(!S.examView().includes('0 %'));
 S.actions['exam-self-rate']({dataset:{index:String(index),rating:'unsure'}});assert.equal(A.state.reviews[meta.discussionQuestionId].rating,'unsure');
});

test('Difficult film reasoning uses the existing repetition schedule without duplicate ratings or affecting other sources',()=>{
 const{A,S}=context(),F=A.filmStudy,id=meta.reasoningQuestionIds[0],book=A.cards.find(q=>q.source.kind==='book');A.state.reviews[book.id]=C.schedule(null,'know',100);const old=JSON.stringify(A.state.reviews[book.id]);F.actions['film-model-toggle']({dataset:{id}});F.actions['film-rate']({dataset:{id,rating:'again'}});assert.equal(A.state.reviews[id].reviews,1);F.actions['film-rate']({dataset:{id,rating:'know'}});assert.equal(A.state.reviews[id].reviews,1);
 assert.equal(JSON.stringify(A.state.reviews[book.id]),old);A.viewFilters.filmReasoningFocus='weak';assert(F.reasoningView().includes(A.entities.get(id).question));assert.equal(S.pool('recall','film','weak').length,1);assert(F.repeatView().includes('#resonemang/'+id));
});
