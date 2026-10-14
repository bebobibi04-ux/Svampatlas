const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const{context,data,root,C}=require('./helpers/atlas.cjs'),K=require('../js/additions-core.js');
const extra=JSON.parse(fs.readFileSync(path.join(root,'content/study-additions.json'),'utf8')),cat=K.catalog(data,extra),byId=new Map(cat.items.map(q=>[q.id,q]));
const{beforeFileHash}=require('./helpers/source-restriction.cjs');
const canonical=x=>JSON.parse(JSON.stringify(x));
function extension(){const old=context(),{A}=old,sandbox={window:{AtlasAdditionsCore:K,STUDY_ADDITIONS:extra},crypto:{randomUUID:()=>String(Date.now())+'-'+Math.random()},location:{hash:'#aniva'}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'js/additions.js'),'utf8'),sandbox);for(const q of extra.questions)A.entities.set(q.id,{...q,kind:'advanced',revision:1});A.extensions=sandbox.window.AtlasExtensions(A);A.extensions.restore();A.sessions=old.S;return{...old,E:A.extensions,sandbox}}
function run(items,answers={}){return{id:'run-test',mode:'targeted',order:items.map(q=>q.id),answers,index:0,started:1,submitted:false}}
function checked(q,value,rating,at=1){return{selected:value,checked:true,skipped:false,correct:K.grade(q,value,data,C),selfRating:rating||null,at}}

test('Every previous content byte, old photo, source and core style is preserved; shell adds only three scripts, one style and two navigation links',()=>{
 const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/before-additions-files.json'),'utf8'));
 const changed=new Set(['README.md','index.html','js/app.js','js/views.js','js/sessions.js','tests/standalone.test.cjs','tests/film-pedagogy.test.cjs','tests/powerpoint.test.cjs']);
 for(const[file,record]of Object.entries(baseline))if(!changed.has(file))assert.equal(beforeFileHash(file),record.sha256,file);
 const oldReadme=baseline['README.md'];assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'README.md')).subarray(0,oldReadme.bytes)).digest('hex'),oldReadme.sha256);
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/\?v=[a-f0-9]{12}/g,'').replace('<a href="#provfragor" data-nav="provfragor">Provfrågor – A-nivå &amp; fördjupning</a>','');html=html.replace('<link rel="stylesheet" href="additions.css">','').replace(/<script defer src="js\/additions(?:-core|-data)?\.js"><\/script>/g,'').replace('<a href="#aniva" data-nav="aniva">A-nivå | Fördjupning</a><a href="#slutcheck" data-nav="slutcheck">Slutcheck inför provet</a>','');assert.equal(html,fs.readFileSync(path.join(root,'tests/fixtures/before-additions-index.html'),'utf8'));
 const generated={window:{}};vm.createContext(generated);vm.runInContext(fs.readFileSync(path.join(root,'js/additions-data.js'),'utf8'),generated);assert.deepEqual(canonical(generated.window.STUDY_ADDITIONS),extra);
});

test('Twenty-eight prior and fifteen additional source-linked models cover the entire course without changing or duplicating old questions',()=>{
 assert.equal(extra.questions.length,43);assert.equal(new Set(extra.questions.map(q=>q.id)).size,43);
 const sections=new Set(data.sections.map(s=>s.id)),facts=new Set(data.sections.flatMap(s=>s.facts.map(f=>f.id))),oldQuestions=new Set(data.sections.flatMap(s=>[...s.cards,...s.recall,...s.quiz].map(q=>q.question)));
 assert.deepEqual(extra.topics.flatMap(t=>t.sectionIds).sort(),[...sections].sort());
 for(const q of extra.questions){assert(!oldQuestions.has(q.question),q.id);assert(q.answer.split(/\s+/).length>=140,q.id);assert(q.answer.includes('\n\n'),q.id);assert(q.criteria.length>=4);assert(q.analysis.length>=3);assert(q.keyPoints.length>=3);assert(q.sourceNote.length>60);assert(q.sectionIds.every(id=>sections.has(id)));assert(q.factIds.length>=2&&q.factIds.every(id=>facts.has(id)));assert(extra.topics.some(t=>t.id===q.topicId))}
});

test('Global search includes advanced questions in its real result count and never says no matches beside a valid advanced hit',()=>{
 const{A}=extension(),query='kompakt kropp',q=extra.questions.find(q=>q.question.includes(query));assert(q);const html=A.views.search(query);assert(html.includes('#aniva/'+q.id));assert(!html.includes('Inga träffar.'));const count=Number(html.match(/<p class="meta">(\d+) träffar/)[1]);assert(count>=1);
 const old=A.views.search('heterotrof');assert(old.includes('#studera/naringsstrategi'));assert(old.includes('Flashcard'));assert(old.includes('Active recall'));
});

test('The full checklist covers every fact, concept, prior recall, process, advanced model and each separate photo while retaining 54 species',()=>{
 assert.equal(cat.units.filter(u=>u.kind==='fact').length,335);assert.equal(cat.units.filter(u=>u.kind==='concept').length,130);assert.equal(cat.units.filter(u=>['teacher','recall'].includes(u.kind)).length,97);assert.equal(cat.units.filter(u=>u.kind==='process').length,7);assert.equal(cat.units.filter(u=>u.kind==='advanced').length,43);
 const full=K.choose(cat,'full',C),units=new Set(full.flatMap(q=>q.unitIds));assert.equal(full.length,cat.items.length);assert.equal(new Set(full.map(q=>q.id)).size,full.length);for(const u of cat.units)assert(units.has(u.id),u.id);
 const arts=full.filter(q=>q.kind==='art');assert.equal(new Set(arts.map(q=>q.speciesId)).size,54);for(const s of data.species){const ps=K.photos(s,extra);assert(ps.length>=2||extra.missingPhotos.some(x=>x.speciesId===s.id));assert.equal(arts.filter(q=>q.speciesId===s.id).length,ps.length)}
 assert.equal(full.filter(q=>q.teacherNumber).length,10);assert(cat.topics.every(t=>cat.units.some(u=>u.topicId===t.id)));
});

test('Quickcheck samples all areas and all teacher prompts while explicitly leaving untested checklist points gray',()=>{
 const selected=K.choose(cat,'quick',C);assert(selected.length<cat.items.length);assert.equal(selected.filter(q=>q.teacherNumber).length,10);assert.equal(new Set(selected.filter(q=>q.kind==='art').map(q=>q.speciesId)).size,8);
 for(const t of cat.topics)assert(selected.some(q=>q.topicId===t.id),t.id);
 const answers=Object.fromEntries(selected.filter(q=>q.kind==='self').map(q=>[q.id,checked(q,'Min förklaring','know')]));const r=K.report(cat,run(selected,answers));assert(r.gray.length>0);assert(r.topics.some(t=>t.status==='gray'));assert.equal(r.objective.total,0);assert.equal(r.self.rated,Object.keys(answers).length);
});

test('A complete check only becomes green with evidence for all 720 points, and two photographs still count as one species',()=>{
 assert.equal(extra.photos.length,54);assert.equal(extra.missingPhotos.length,0);assert(data.species.every(s=>K.photos(s,extra).length===2));
 const full=K.choose(cat,'full',C),answers={};for(const q of full){const value=q.kind==='self'?'Ett självbedömt testsvar':q.kind==='art'?data.species.find(s=>s.id===q.speciesId).name:q.kind==='process'?q.steps.map((_,i)=>i):q.original.type==='order'?q.original.items:q.original.correct;answers[q.id]=checked(q,value,q.kind==='self'?'know':null)}
 const r=K.report(cat,run(full,answers));assert.equal(r.total,720);assert.equal(r.tested,720);assert.equal(r.gray.length,0);assert.equal(r.red.length,0);assert.equal(r.status,'green');assert(r.topics.every(t=>t.status==='green'));assert.equal(r.uniqueSpecies,54);assert.equal(full.filter(q=>q.kind==='art').length,108);
 const objective=full.find(q=>q.kind==='objective'&&q.unitIds.some(id=>full.some(s=>s.kind==='self'&&s.unitIds.includes(id))));answers[objective.id]={...answers[objective.id],correct:false,at:1};for(const q of full.filter(s=>s.kind==='self'&&s.unitIds.some(id=>objective.unitIds.includes(id))))answers[q.id].at=999;const weaker=K.report(cat,run(full,answers));assert(weaker.red.length>0);assert.equal(weaker.topics.find(t=>t.id===objective.topicId).status,'red');
});

test('Evidence statuses are defined, self rating stays separate, ungraded/skipped answers never produce green and objective misses dominate',()=>{
 const art=cat.items.find(q=>q.kind==='art'),self=cat.items.find(q=>q.advanced),r=K.report(cat,run([art,self],{[art.id]:checked(art,'helt fel'),[self.id]:checked(self,'Ett längre självskrivet svar','unsure')}));assert.equal(r.objective.total,1);assert.equal(r.objective.correct,0);assert.equal(r.self.total,1);assert.equal(r.self.rated,1);assert.equal(r.topics.find(t=>t.id==='artkunskap').status,'red');assert.equal(r.topics.find(t=>t.id===self.topicId).status,'yellow');assert.equal(r.priorities[0].id,art.id);
 const partial=K.report(cat,run([self],{[self.id]:checked(self,'Jag har skrivit men inte bedömt')}));assert.equal(partial.tested,0);assert.equal(partial.green.length,0);
 const skipped=K.report(cat,run([art],{[art.id]:{...checked(art,data.species[0].name),skipped:true}}));assert.equal(skipped.objective.total,0);assert.equal(skipped.tested,0);
});

test('Advanced models stay hidden until requested, writing survives backup, reveal never rates and weak-topic filters use existing schedules',()=>{
 const{A,E}=extension(),q=extra.questions[0];let html=E.advanced(q.id);assert(!html.includes('Fullständigt modellsvar'));assert(html.includes('Visa A-nivåsvar'));E.input({id:'advanced-own-answer',dataset:{question:q.id},value:'Egen text <script>test</script>'});assert(E.advanced(q.id).includes('&lt;script&gt;'));assert.equal(Object.keys(A.state.reviews).length,0);
 E.actions['advanced-reveal']({dataset:{id:q.id}});assert(E.advanced(q.id).includes('Fullständigt modellsvar'));assert.equal(Object.keys(A.state.reviews).length,0);E.actions['advanced-rate']({dataset:{id:q.id,rating:'again'}});assert.equal(A.state.reviews[q.id].rating,'again');const count=A.state.reviews[q.id].reviews;E.actions['advanced-rate']({dataset:{id:q.id,rating:'know'}});assert.equal(A.state.reviews[q.id].reviews,count);
 E.onNavigate();assert(!E.advanced(q.id).includes('Fullständigt modellsvar'));A.viewFilters.advancedFocus='weak';assert(E.advanced().includes(C.escape(q.question)));assert.equal(E.sanitize(A.state.additions).advancedResponses[q.id].text,'Egen text <script>test</script>');
});

test('Check answers require an attempt before revealing; longer text never receives an automatic percentage or grade',()=>{
 const{A,E}=extension(),q=cat.items.find(x=>x.advanced);A.state.additions.checks.active=run([q]);E.actions['check-answer']();assert(!A.state.additions.checks.active.answers[q.id]);assert(!E.view('pass').includes('Fullständigt modellsvar'));E.input({id:'check-answer',value:'Egen genomarbetad förklaring'});E.actions['check-answer']();let r=A.state.additions.checks.active.answers[q.id];assert.equal(r.correct,null);assert.equal(r.selfRating,null);assert(E.view('pass').includes('Fullständigt modellsvar'));assert.equal(K.report(cat,A.state.additions.checks.active).tested,0);E.actions['check-rate']({dataset:{rating:'know'}});assert(K.report(cat,A.state.additions.checks.active).tested>0);assert.equal(K.report(cat,A.state.additions.checks.active).objective.total,0);
});

test('Photographs rotate between sessions, stay stable within a question, disclose no names before answering, and saved exams keep their selected image',()=>{
 const ctx=extension(),{A,E,S,config}=ctx,s=data.species.find(s=>E.photos(s).length>1);S.start('arttraning','all','all',1,'all','write',[s]);let html=S.artView();const one=html.match(/class="art-photo" src="([^"]+)"/)[1];assert.equal(one, S.artView().match(/class="art-photo" src="([^"]+)"/)[1]);assert(!html.includes(s.name));assert(!one.includes(s.id));S.start('arttraning','all','all',1,'all','write',[s]);const two=S.artView().match(/class="art-photo" src="([^"]+)"/)[1];if(E.photos(s).length>1)assert.notEqual(one,two);
 const selected=E.artItem(s);assert.equal(E.artItem(s,selected.photoId).image,selected.image);assert(E.speciesPhotos(s.id).includes('Fotografi 2'));assert(E.speciesPhotos(s.id).includes('Förstora fotografiet'));config['#exam-kind'].value='art';config['#exam-count'].value='1';S.actions['exam-start']();const snapshot=ctx.draft(),q=snapshot.items[0],sp=data.species.find(p=>p.id===q.speciesId);assert(q.photoId);const expected=E.artItem(sp,q.photoId).image;assert(S.examView().includes(expected));A.loadDraft=()=>C.validateDraft(snapshot,A.entities);vm.runInContext(fs.readFileSync(path.join(root,'js/sessions.js'),'utf8'),ctx.sandbox);const resumed=ctx.sandbox.window.AtlasSessions(A);resumed.actions['exam-resume']();assert(resumed.examView().includes(expected));
});

test('New optional progress restores safely without disturbing old backups, original attempts or unfinished exams',()=>{
 const{A,E}=extension(),q=cat.items.find(q=>q.kind==='art'),sp=data.species.find(s=>s.id===q.speciesId),draft=run([q],{[q.id]:checked(q,sp.name)});A.state.additions.checks.active=draft;const raw=JSON.parse(JSON.stringify(A.state)),old=C.validateBackup(raw,new Set(A.entities.keys()));assert.equal(old.schema,1);assert.deepEqual(old.attempts,raw.attempts);assert.equal(old.additions,undefined);old.additions=E.sanitize(raw.additions);assert.equal(old.additions.checks.active.answers[q.id].correct,true);
 const malicious=JSON.parse(JSON.stringify(raw.additions));malicious.checks.active.answers[q.id].selected='fel';malicious.checks.active.answers[q.id].correct=true;assert.equal(E.sanitize(malicious).checks.active.answers[q.id].correct,false);assert.equal(E.sanitize({checks:{active:{...draft,order:['unknown']}}}).checks.active,null);assert.equal(E.sanitize().checks.active,null);
});

test('Revision plans refer to actual misses, source lessons, concepts, flashcards, recall, advanced questions and species comparison',()=>{
 const{A,E}=extension(),self=cat.items.find(q=>q.advanced),art=cat.items.find(q=>q.kind==='art');A.state.additions.checks.active=run([self,art],{[self.id]:checked(self,'Jag är osäker','again'),[art.id]:checked(art,'fel')});const html=E.view('repetition');assert(html.includes('#kort/'));assert(html.includes('#recall/'));assert(html.includes('#studera/'));assert(html.includes('#aniva/'));assert(html.includes('#artbilder/'));assert(html.includes('Ny kontroll av just dessa uppgifter'));const ids=K.report(cat,A.state.additions.checks.active).priorities.map(q=>q.id);assert.deepEqual(K.choose(cat,'targeted',C,ids).map(q=>q.id).sort(),ids.sort());
});

test('Every supplemental photo has its local bytes, distinct source, author, license and identity evidence; quiz aliases have identical original pixels',()=>{
 for(const s of data.species){const ps=K.photos(s,extra);assert(new Set(ps.map(x=>x.imageSource)).size===ps.length);const quiz=path.join(root,extra.originalQuizImages[s.id]);assert(fs.readFileSync(quiz).equals(fs.readFileSync(path.join(root,s.image))),s.id)}
 for(const photo of extra.photos){assert(fs.existsSync(path.join(root,photo.image)));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,photo.image))).digest('hex'),photo.sha256);assert(photo.identityEvidence.length);assert(photo.author&&photo.license&&photo.license_url);assert(photo.verificationNote);assert(!data.species.some(s=>photo.image.includes(s.id)));assert(photo.width>=300&&photo.height>=300)}
});
