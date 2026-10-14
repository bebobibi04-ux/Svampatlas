const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const{context,data,root,C}=require('./helpers/atlas.cjs'),K=require('../js/additions-core.js');
const extra=JSON.parse(fs.readFileSync(path.join(root,'content/study-additions.json'),'utf8'));
const bank=extra.questions.filter(q=>q.collection==='exam-bank'),cat=K.catalog(data,extra);
const exact=['Jämför svampar med djur och växter.','Berätta allting om en svamp.','Jämför slemsvampar och vanliga svampar.','Vad hände i filmen och vad tror du kommer hända i framtiden?','Vad skulle hända om svampar försvann?'];
function extension(){const old=context(),{A}=old,sandbox={window:{AtlasAdditionsCore:K,STUDY_ADDITIONS:extra},location:{hash:'#provfragor'},crypto:{randomUUID:()=>String(Date.now())}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'js/additions.js'),'utf8'),sandbox);for(const q of extra.questions)A.entities.set(q.id,{...q,kind:'advanced'});A.extensions=sandbox.window.AtlasExtensions(A);A.extensions.restore();return{...old,E:A.extensions}}

test('All five reported prompts and ten distinct additional questions have substantive source-bound models and evidence ledgers',()=>{
 assert.equal(bank.length,15);assert.deepEqual(bank.filter(q=>q.provenance==='reported').map(q=>q.question),exact);assert.equal(bank.filter(q=>q.provenance==='practice').length,10);
 assert.equal(new Set(extra.questions.map(q=>q.id)).size,43);assert.equal(new Set(extra.questions.map(q=>q.question)).size,43);
 const facts=new Set(data.sections.flatMap(s=>s.facts.map(f=>f.id)));
 for(const q of bank){assert(q.answer.split(/\s+/).length>230,q.id);assert(q.answer.includes('\n\n'));assert(q.criteria.length>=5);assert(q.analysis.length>=3);assert(q.keyPoints.length>=4);assert(q.factIds.length>=2&&q.factIds.every(id=>facts.has(id)));assert(q.evidenceRefs.length);assert(q.claimLedger.length>=4);assert(q.claimLedger.every(c=>['source','inference','limitation'].includes(c.kind)&&c.statement&&c.support));assert(q.claimLedger.some(c=>c.kind==='inference'));for(const ref of q.evidenceRefs){assert(['book','ppt','film'].includes(ref.kind));if(ref.kind==='film')assert.match(ref.time,/^\d\d:\d\d:\d\d$/);else{assert(Number.isInteger(ref.page));assert(fs.existsSync(path.join(root,ref.kind==='book'?`assets/book/${ref.page}.jpg`:`assets/pdf/page-${ref.page}.jpg`)))}}}
 const example=bank[1];assert(example.answerGuide.length>=2);assert(bank[0].uncertainties.length);assert.match(bank[4].answer,/direkt|Direkt/);assert.match(bank[4].answer,/indirekt|Indirekt/);assert.match(bank[4].answer,/osäkr|osäker/i);
});

test('Exam practice hides every answer, saves literal writing, requires reveal before rating, and preserves source navigation',()=>{
 const{A,E}=extension();let home=E.examBank();assert(home.includes('Rapporterade provfrågor'));assert(home.includes('Förväntningsbaserade övningsfrågor'));assert(!home.includes('Fullständigt modellsvar'));
 for(const q of bank){let html=E.examBank(q.id);assert(html.includes(C.escape(q.question)));assert(!html.includes('Fullständigt modellsvar'));assert(!html.includes(C.escape(q.answer.split('\n\n')[0])));E.actions['advanced-rate']({dataset:{id:q.id,rating:'know'}});assert(!A.state.reviews[q.id]);E.input({id:'advanced-own-answer',dataset:{question:q.id},value:'Mitt svar <script>test</script>'});assert(E.examBank(q.id).includes('&lt;script&gt;'));E.actions['advanced-reveal']({dataset:{id:q.id}});html=E.examBank(q.id);assert(html.includes('Fullständigt modellsvar'));assert(html.includes('Följ källstödet i svaret'));assert(!A.state.reviews[q.id]);E.actions['advanced-rate']({dataset:{id:q.id,rating:'unsure'}});assert.equal(A.state.reviews[q.id].rating,'unsure');E.onNavigate();assert(!E.examBank(q.id).includes('Fullständigt modellsvar'))}
 const restored=E.sanitize(JSON.parse(JSON.stringify(A.state.additions)));for(const q of bank)assert.equal(restored.advancedResponses[q.id].text,'Mitt svar <script>test</script>');
});

test('Reported questions remain directly reachable with weak/category filters; new models participate in search, advanced practice and full checks',()=>{
 const{A,E}=extension(),q=bank[0];A.viewFilters.examFocus='weak';A.viewFilters.examCategory='practice';const html=E.examBank();for(const q of bank.filter(q=>q.provenance==='reported'))assert(html.includes('#provfragor/'+q.id));assert(html.includes('Inga frågor i urvalet'));
 A.viewFilters.advancedFocus='all';for(const q of bank){assert(E.advanced().includes('#aniva/'+q.id));assert(K.choose(cat,'full',C).some(item=>item.entityId===q.id));assert(A.views.search(q.question).includes('#aniva/'+q.id))}
 const item=cat.items.find(item=>item.entityId===q.id);const run={order:[item.id],answers:{[item.id]:{checked:true,selected:'Eget svar',correct:null,selfRating:'again'}}};assert(K.report(cat,run).priorities.some(item=>item.entityId===q.id));assert(E.repetition().includes('Provfrågor'));
});

test('Source corrections are precisely logged, preserve identities and all original media, and contain no external fact-source links',()=>{
 const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/STRIKT-KALLGRANSKNING.json'),'utf8'));assert.equal(audit.allowedSources.length,3);assert(audit.changes.length>0);assert(audit.originalMedia.length>=100);
 for(const s of data.sections)for(const note of s.sourceNotes||[])assert(!(note.links||[]).some(l=>/^https?:/.test(l.url)),s.id);
 for(const m of audit.originalMedia)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,m.path))).digest('hex'),m.sha256,m.path);
 const current={course:data,additions:extra};for(const c of audit.changes){assert(c.reason&&c.evidence,c.path.join('.'));let v=current[c.file];for(const k of c.path)v=v[k];assert.deepEqual(v,c.after,c.path.join('.'))}
 const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
 const before=require('./helpers/source-restriction.cjs').beforeCourse(data);assert.equal(crypto.createHash('sha256').update(JSON.stringify(canonical(before))).digest('hex'),audit.beforeCourseCanonicalSha256,'No unlogged course changes');
});

test('Every former checklist identity and saved check survives; corrected facit is used without changing historical result records',()=>{
 const old=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/before-source-restriction-check-ids.json'),'utf8')),units=new Set(cat.units.map(u=>u.id)),items=new Set(cat.items.map(q=>q.id));for(const id of old.units)assert(units.has(id),id);for(const id of old.items)assert(items.has(id),id);
 const{A,E}=extension();const active={id:'previous-full-check',mode:'full',order:old.items,index:111,answers:{},started:1,submitted:false};const restored=E.sanitize({checks:{active,history:[{...active,submitted:true}]}});assert.equal(restored.checks.active.order.length,old.items.length);assert.equal(restored.checks.active.index,111);assert.equal(restored.checks.history.length,1);
 const q=A.recalls.find(q=>q.sourceCorrected&&q.type==='open');assert(q);const oldQ={...q,answer:'Borttaget äldre facit',assessment:{...q.assessment,facts:[],examples:[]}};A.state.attempts=[{id:'historical',at:1,kind:'exam',total:0,correct:0,percent:0,exam:{items:[oldQ],started:1},answers:[{id:q.id,kind:'reasoning',selected:'Mitt gamla svar',correct:null,selfRating:'know'}]}];const records=JSON.stringify(A.state.attempts);
 const current=context();current.A.state.attempts=JSON.parse(records);const display=current.S.examView('historical');assert(!display.includes('Borttaget äldre facit'));assert(display.includes(C.escape(q.answer.split('\n')[0])));assert.equal(JSON.stringify(current.A.state.attempts),records);
});
