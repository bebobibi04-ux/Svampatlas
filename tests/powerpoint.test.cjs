const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {context,data,root,C}=require('./helpers/atlas.cjs');
const fixture=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/before-powerpoint-hashes.json'),'utf8'));
const coverage=JSON.parse(fs.readFileSync(path.join(root,'content/powerpoint-coverage.json'),'utf8'));
function canonical(x){if(Array.isArray(x))return x.map(canonical);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));return x}
function hash(x){return crypto.createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex')}
function filehash(f){return crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')}
const ppt=data.sections.filter(s=>s.source.kind==='ppt'),allFacts=new Map(data.sections.flatMap(s=>s.facts.map(f=>[f.id,{...f,sectionId:s.id}])));

test('All 26 original sections, every old exercise/answer/assessment, 54 species and 287 cues remain exactly unchanged',()=>{
 assert.equal(Object.keys(fixture.sections).length,26);
 for(const[id,sha]of Object.entries(fixture.sections))assert.equal(hash(data.sections.find(s=>s.id===id)),sha,id);
 assert.equal(hash(data.species),fixture.speciesSha256);assert.equal(hash(data.cues),fixture.cuesSha256);
 for(const[term,sha]of Object.entries(fixture.concepts))assert.equal(hash(data.concepts.find(c=>c.term===term)),sha,term);
 for(const[file,sha]of Object.entries({...fixture.runtimeFiles,...fixture.originalAssets}).filter(([file])=>file!=='index.html'))assert.equal(filehash(file),sha,file);
 assert.equal(data.contentRevision,'film-subject-v2');assert.equal(data.schema,1);
});

test('The semantic audit accounts for 136 source elements on all 39 visually inspected pages',()=>{
 assert.equal(coverage.items.length,136);assert.equal(new Set(coverage.items.map(i=>i.id)).size,136);
 assert.deepEqual([...new Set(coverage.items.map(i=>i.page))].sort((a,b)=>a-b),Array.from({length:39},(_,i)=>i+1));
 assert.equal(coverage.items.filter(i=>i.examinable).length,135);
 for(const i of coverage.items){assert(i.knowledge&&i.sourceEvidence,i.id);assert.equal(i.finalStatus,'covered',i.id);for(const id of i.factIds)assert(allFacts.has(id),id);if(!i.examinable)continue;assert(i.sectionIds.length,i.id);assert(i.factIds.length,i.id);if(i.baselineStatus!=='covered')assert(i.factIds.some(id=>id.startsWith('ppt-')),i.id+' needs actual added knowledge');assert(Object.values(i.exerciseIds).flat().length,i.id+' needs an appropriate exercise')}
 assert.equal(data.presentation.sourceSha256,filehash('assets/Svampar.pdf'));
 for(const p of data.presentation.pages){assert.equal(p.page,data.presentation.pages.indexOf(p)+1);assert(p.title&&p.summary);for(const id of p.sectionIds)assert(data.sections.some(s=>s.id===id))}
});

test('PowerPoint source scope includes all new exercises and precisely declared textbook reuse, preserving book/film pools',()=>{
 const{A,S}=context(),reuse=new Set(data.presentation.reusedExerciseIds);
 for(const[mode,field]of[['kort','cards'],['quiz','questions'],['recall','recalls']]){
  const ids=new Set(S.pool(mode,'ppt','all').map(q=>q.id)),expected=A[field].filter(q=>q.source.kind==='ppt'||reuse.has(q.id));
  assert.equal(ids.size,expected.length);for(const q of expected)assert(ids.has(q.id));assert(!S.pool(mode,'ppt','all').some(q=>q.source.kind==='film'));
  for(const source of ['book','film'])assert.equal(S.pool(mode,source,'all').length,A[field].filter(q=>q.source.kind===source).length);
 }
 for(const id of reuse){const q=A.entities.get(id);assert.equal(q.source.kind,'book');assert(q.factIds.every(f=>data.presentation.reusedFactIds.includes(f)),id)}
});

test('Selecting only PowerPoint generates a mixed exam with old overlapping questions and new objective/open questions',()=>{
 const{S,config,draft}=context(undefined,['film']);S.actions['exam-source-only']({dataset:{source:'ppt'}});config['#exam-kind'].value='theory';config['#exam-format'].value='mixed';config['#exam-count'].value='all';S.actions['exam-start']();
 const d=draft(),reuse=new Set(data.presentation.reusedExerciseIds);assert(d.items.some(q=>q.type==='open'));assert(d.items.some(q=>q.type!=='open'));assert(d.items.some(q=>reuse.has(q.id)));for(const q of d.items)assert(q.source.kind==='ppt'||reuse.has(q.id));
 const mixed=context(undefined,['ppt','film']);mixed.config['#exam-kind'].value='mixed';mixed.config['#exam-format'].value='mixed';mixed.config['#exam-count'].value='all';mixed.S.actions['exam-start']();assert(mixed.draft().items.some(q=>q.kind==='art'));assert(mixed.draft().items.some(q=>q.source?.kind==='film'));assert(mixed.draft().items.some(q=>q.source?.kind==='ppt'));
});

test('New biological open responses stay hidden until submission and use manual assessment without changing the objective score',async()=>{
 const{A,S,config,draft}=context(undefined,['ppt']);config['#exam-kind'].value='theory';config['#exam-format'].value='open';config['#exam-count'].value='all';S.actions['exam-start']();
 assert(draft().items.every(q=>q.assessment.kind==='biological'));assert(!S.examView().includes('Källuppgifter och förtydliganden att använda'));
 const q=draft().items[0],text='Plasmogami och karyogami måste skiljas åt. <script>unsafe</script>';S.input({id:'exam-open-answer',value:text});assert.equal(draft().answers[0],text);await S.actions['exam-submit']();
 assert.equal(A.state.attempts[0].total,0);assert.equal(Object.keys(A.state.reviews).length,0);assert(S.examView().includes(C.escape(text)));assert(S.examView().includes('Bedömningsstöd'));assert(!S.examView().includes('<script>unsafe</script>'));
 S.actions['exam-self-rate']({dataset:{index:'0',rating:'unsure'}});assert.equal(A.state.reviews[q.id].revision,1);assert.equal(A.state.attempts[0].answers[0].correct,null);assert.equal(A.state.attempts[0].total,0);
 for(const s of ppt)for(const q of s.recall.filter(q=>q.type==='open')){assert(q.assessment.criteria.length>=5);assert(q.assessment.facts.length);assert(q.assessment.examples.length);assert(q.answer);assert(q.checkpoints.length);for(const f of q.assessment.facts){assert(f.pages.every(p=>p>=1&&p<=39));assert.equal(f.origin,allFacts.get(f.factId).origin);if(f.origin==='clarification')assert(A.views.assessment(q).includes('Biologiskt förtydligande till s.'))}}
});

test('Existing backups, progress, exam history and unfinished exams survive the additive content update',()=>{
 const{A}=context(),oldIds=Object.keys(fixture.sections),oldCard=A.cards.find(q=>q.source.kind==='book'),filmCard=A.cards.find(q=>q.source.kind==='film');
 const saved=C.initialState();saved.read=[oldIds[0],oldIds[2]];saved.lastSection=oldIds[2];saved.theme='dark';
 for(const q of [oldCard,filmCard,data.species[0]])saved.reviews[q.id]={...C.schedule(null,'know',1700000000000),revision:q.revision||1};
 const oldQuestion=A.questions.find(q=>q.source.kind==='book');saved.attempts=[{id:'before-update',at:1700000000000,total:1,correct:1,percent:100,kind:'exam',answers:[{id:oldQuestion.id,correct:true,selected:oldQuestion.correct}],exam:{items:[oldQuestion],started:1699999900000}}];
 const ids=new Set([...A.entities.keys(),...data.sections.map(s=>s.id)]),restored=C.validateBackup(JSON.parse(JSON.stringify(saved)),ids);assert.deepEqual(restored,saved);assert(C.reviewCurrent(filmCard,restored.reviews[filmCard.id]));
 const oldDraft={items:[oldQuestion],index:0,answers:[oldQuestion.correct],submitted:false,started:1700000000000};const d=C.validateDraft(oldDraft,A.entities);assert(d&&d.paused);assert.deepEqual(d.items,oldDraft.items);assert.deepEqual(d.answers,oldDraft.answers);
 const added=A.cards.find(q=>q.source.kind==='ppt');restored.reviews[added.id]={...C.schedule(null,'again',1700000000000),revision:1};restored.read.push(ppt[0].id);assert.deepEqual(C.validateBackup(JSON.parse(JSON.stringify(restored)),ids),restored);
});

test('Visual questions render bundled figures in cards, recall, quizzes and exams; ordering controls retain the same state',()=>{
 const{S,config,draft}=context(undefined,['ppt']);
 for(const mode of ['kort','quiz','recall']){const items=ppt.flatMap(s=>s[mode==='kort'?'cards':mode==='quiz'?'quiz':'recall']).filter(q=>q.figure);assert(items.length);for(const q of items){assert(S.start(mode,'all','all','all','all','write',[q]));const html=mode==='kort'?S.flashView():mode==='quiz'?S.quizView():S.recallView();assert(html.includes(q.figure.image),q.id)}}
 config['#exam-kind'].value='theory';config['#exam-count'].value='all';S.actions['exam-start']();let d=draft(),i=d.items.findIndex(q=>q.figure);assert(i>=0);S.actions['exam-jump']({dataset:{index:String(i)}});assert(S.examView().includes(d.items[i].figure.image));
 i=d.items.findIndex(q=>q.type==='order');assert(i>=0);S.actions['exam-jump']({dataset:{index:String(i)}});S.examView();S.actions['order-move']({dataset:{mode:'exam',index:'0',direction:'1'}});assert(Array.isArray(draft().answers[i]));assert.equal(draft().answers[i].length,d.items[i].items.length);
});

test('All bundled figures and hashes use case-exact relative file paths and generated data equals the authoritative course',()=>{
 const paths=new Set();function visit(dir,prefix=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const relative=prefix+e.name;if(e.isDirectory())visit(path.join(dir,e.name),relative+'/');else paths.add(relative)}}visit(root);
 for(const s of data.sections){for(const f of [s.relevantFigure,...['cards','quiz','recall'].flatMap(k=>s[k].map(q=>q.figure))].filter(Boolean)){assert(!/^\/|^[a-z]+:/i.test(f.image));assert(paths.has(f.image),f.image)}if(s.source.kind==='ppt'){assert(s.source.pages.every(p=>p>=1&&p<=39));for(const q of [...s.cards,...s.quiz,...s.recall])assert(q.factIds.every(f=>allFacts.has(f)))}}
 const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8'),sandbox);assert.equal(JSON.stringify(sandbox.window.STUDY_DATA),JSON.stringify(data));
 const{A}=context();for(const s of ppt){const html=A.views.study(s.id);assert(html.includes(C.escape(s.title)));assert(A.views.search(s.title).includes(s.id));for(const id of s.relatedSections||[])assert(data.sections.some(s=>s.id===id),s.id+' -> '+id)}for(const p of data.presentation.pages)assert(A.views.presentation(String(p.page)).includes('assets/pdf/page-'+p.page+'.jpg'));
});

test('Critical mechanisms retain exact phase/structure distinctions and teacher-source corrections',()=>{
 const section=id=>data.sections.find(s=>s.id===id),body=id=>JSON.stringify(section(id));
 assert.match(body('ppt-slemsvampar-livscykel'),/zyg[oö]t/i);assert.match(body('ppt-slemsvampar-livscykel'),/2n/);assert.match(body('ppt-slemsvampar-livscykel'),/meios/i);assert.match(body('ppt-slemsvampar-livscykel'),/mitos/i);
 assert.match(body('ppt-basidie-livscykel'),/plasmogami/i);assert.match(body('ppt-basidie-livscykel'),/karyogami/i);assert.match(body('ppt-basidie-livscykel'),/n \+ n|n\+n/);
 assert.match(body('ppt-jast-mogel'),/etanol/i);assert.match(body('ppt-jast-mogel'),/koldioxid/i);assert.match(body('ppt-svampgrupper'),/oomycet/i);assert.match(body('ppt-basidiesvampar'),/åsar/i);assert.match(body('ppt-sporsackssvampar'),/inuti/i);
 const asci=section('ppt-sporsackssvampar').quiz.find(q=>q.options?.some(o=>/inuti.*sporsäck|inuti.*ascus/i.test(o)));assert(asci);assert.match(asci.options[asci.correct],/inuti/i);
});
