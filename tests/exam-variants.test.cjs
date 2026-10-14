const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const{context,data,root,C}=require('./helpers/atlas.cjs'),K=require('../js/additions-core.js');
const{beforeVariants,beforeVariantFileHash}=require('./helpers/source-restriction.cjs');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),extra=read('content/study-additions.json'),v=extra.examVariants,audit=read('docs/PROVVARIANTER-ADDITIONSKONTROLL.json'),plain=x=>JSON.parse(JSON.stringify(x));
function extension(){const ctx=context(),{A}=ctx,sandbox={window:{AtlasAdditionsCore:K,STUDY_ADDITIONS:extra},crypto:{randomUUID:()=>String(Date.now())},location:{hash:'#provfragor'}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'js/additions.js'),'utf8'),sandbox);for(const q of K.advancedQuestions(extra))A.entities.set(q.id,{...q,kind:'advanced',revision:q.revision||1});const E=sandbox.window.AtlasExtensions(A);A.extensions=E;A.sessions=ctx.S;E.restore();return{...ctx,E,sandbox}}
const meta=/\b(?:PowerPoint(?:en)?|läroboken|boken|läraren|kursmaterialet|undervisningsmaterialet|källmaterialet)\b|Enligt (?:materialet|våra källor)|I materialet|\[(?:Boken|PPT|Film)|\b(?:s\.|sida|bild)\s*\d/i;

test('The extension adds one data property and preserves every old course object, original model, source, photograph and historical audit',()=>{
 const old=beforeVariants(extra,'additions');assert.equal(old.questions.length,43);assert.equal(old.questions.filter(q=>q.provenance==='reported').length,5);assert.deepEqual(beforeVariants(data),data);
 assert.deepEqual(old.questions.filter(q=>q.provenance==='reported').map(q=>q.id),audit.originalQuestionIds);
 const permitted=new Set(['additions.css','content/final-check-coverage.json','content/study-additions.json','index.html','js/additions-core.js','js/additions-data.js','js/additions.js','js/app.js','js/views.js','tests/additions.test.cjs','tests/helpers/source-restriction.cjs','tests/model-presentation.test.cjs']);
 assert.deepEqual(Object.keys(audit.fileChanges).sort(),[...permitted].sort());
 for(const[file,record]of Object.entries(audit.baselineFiles))assert.equal(beforeVariantFileHash(file),record.sha256,file);
 assert.equal(data.species.length,54);assert.equal(data.species.flatMap(s=>K.photos(s,extra)).length,108);
});

test('Every variant has independent developed prose, grading support, valid source links and a stable parent within the same exam bank',()=>{
 assert.equal(v.questions.length,78);assert.equal(new Set(K.advancedQuestions(extra).map(q=>q.id)).size,121);assert.equal(new Set(v.questions.map(q=>q.question)).size,78);assert.equal(new Set(v.questions.map(q=>q.answer)).size,78);
 assert.deepEqual(v.families.map(f=>v.questions.filter(q=>q.variant.category===f.id).length),[36,25,17]);
 const facts=new Set(data.sections.flatMap(s=>s.facts.map(f=>f.id))),sections=new Set(data.sections.map(s=>s.id));
 for(const q of v.questions){const family=v.families.find(f=>f.id===q.variant.category);assert(family);assert.equal(q.variant.parentId,family.parentId);assert(family.subgroups.some(s=>s.id===q.variant.subgroup));assert.equal(q.collection,'exam-bank');assert.equal(q.provenance,'practice');assert.equal(q.revision,1);assert(q.answer.split(/\s+/).length>=100,q.id);assert(q.answer.includes('\n\n'),q.id);assert(!meta.test(q.answer),q.id);assert(!/se (?:det |ett )?(?:tidigare|annat) svar/i.test(q.answer));assert(q.criteria.length>=4);assert(q.keyPoints.length>=3);assert(q.analysis.length>=3);assert(q.factIds.length&&q.factIds.every(id=>facts.has(id)));assert(q.sectionIds.length&&q.sectionIds.every(id=>sections.has(id)));assert(q.evidenceRefs.length);assert(q.claimLedger.some(c=>c.kind==='source'));if(q.variant.category!=='description')assert(q.claimLedger.some(c=>c.kind==='inference'),q.id);assert(extra.topics.some(t=>t.id===q.topicId));for(const r of q.evidenceRefs){assert(['book','ppt','film'].includes(r.kind));if(r.kind==='book')assert(r.page>=266&&r.page<=269);if(r.kind==='ppt')assert(r.page>=1&&r.page<=39);if(r.kind==='film')assert(/^\d{2}:\d{2}:\d{2}$/.test(r.time),q.id)}}
});

test('The five originals retain priority and order; each new family is nested at original 2, 3 or 5 and has no new navigation item',()=>{
 const{E}=extension(),html=E.examBank();let previous=-1;for(const id of audit.originalQuestionIds){const pos=html.indexOf('data-question-id="'+id+'"');assert(pos>previous);previous=pos}
 for(const f of v.families){assert(html.includes('data-parent-id="'+f.parentId+'"'));for(const q of v.questions.filter(q=>q.variant.parentId===f.parentId))assert(html.includes('href="#provfragor/'+q.id+'"'),q.id)}
 const source=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.equal((source.match(/data-nav="provfragor"/g)||[]).length,1);assert(!/data-nav="(?:variants|varianter|comparison|description|consequence)"/.test(source));assert(!/class="model-answer"/.test(html));assert(html.includes('78 kompletterande varianter'));
});

test('All 78 new answers are hidden before reveal, persist literal own writing, rate only after reveal, and keep sources closed outside the model',()=>{
 const{A,E}=extension();for(const q of v.questions){E.onNavigate();let html=E.examBank(q.id);assert(!html.includes('class="model-answer"'));assert(html.includes('#provfragor/'+q.variant.parentId));E.input({id:'advanced-own-answer',dataset:{question:q.id},value:'Eget svar om '+q.id+' <script>text</script>'});assert(E.examBank(q.id).includes('&lt;script&gt;'));E.actions['advanced-rate']({dataset:{id:q.id,rating:'know'}});assert(!A.state.reviews[q.id]);E.actions['advanced-reveal']({dataset:{id:q.id}});html=E.examBank(q.id);const model=html.match(/<section class="model-answer"[^>]*>([\s\S]*?)<\/section>/);assert(model,q.id);assert(model[1].includes('<p>'));assert(!/<(?:ul|ol|details|a)\b|Visa källor|source-badge/.test(model[1]));assert(html.includes('<details class="model-sources"><summary>Visa källor</summary>'));assert(!A.state.reviews[q.id]);E.actions['advanced-rate']({dataset:{id:q.id,rating:'unsure'}});assert.equal(A.state.reviews[q.id].rating,'unsure');const n=A.state.reviews[q.id].reviews;E.actions['advanced-rate']({dataset:{id:q.id,rating:'know'}});assert.equal(A.state.reviews[q.id].reviews,n);E.onNavigate();assert(!E.examBank(q.id).includes('class="model-answer"'));assert(E.sanitize(A.state.additions).advancedResponses[q.id].text.endsWith('<script>text</script>'))}
});

test('Family random selection, weak filters and global search route new variants to the existing bank',()=>{
 const{A,E,sandbox}=extension();let destination='',toast='';A.go=s=>destination=s;A.toast=s=>toast=s;
 for(const family of v.families){for(let i=0;i<12;i++){E.actions['exam-variant-random']({dataset:{parent:family.parentId}});const q=v.questions.find(q=>destination==='#provfragor/'+q.id);assert.equal(q?.variant.parentId,family.parentId)}}
 A.viewFilters.examFocus='weak';destination='';E.actions['exam-bank-random']();assert.equal(destination,'');assert(toast);
 const q=v.questions[0];A.state.reviews[q.id]={...C.schedule(null,'again'),revision:1};A.viewFilters.examVariantFamily='description';E.actions['exam-bank-random']();assert.equal(destination,'#provfragor/'+q.id);
 sandbox.location.hash=destination;E.actions['exam-variant-random']({dataset:{parent:q.variant.parentId}});assert.equal(destination,'#provfragor/'+q.id);
 A.viewFilters.examCategory='variants';const html=E.examBank();assert(html.includes('data-variant-id="'+q.id+'"'));assert(!html.includes('data-variant-id="'+v.questions[1].id+'"'));assert(A.views.search('organismgrupp').includes('#provfragor/'+q.id));assert(E.search('organismgrupp').includes('#provfragor/'+q.id));assert(!E.advanced().includes('href="#aniva/'+q.id+'"'));
});

test('Comparison selection resolves supported pairs to full models, explains source gaps and retains expanded sections across renders',()=>{
 const{A,E}=extension(),ids=new Set(K.advancedQuestions(extra).map(q=>q.id));assert.equal(v.comparisonMatrix.length,231);assert.equal(new Set(v.comparisonMatrix.map(m=>[...m.groups].sort().join('|'))).size,231);
 const family=v.families.find(f=>f.id==='comparison');E.disclosure({dataset:{variantDisclosure:'family:'+family.parentId},open:true});
 for(const row of v.comparisonMatrix){assert(row.groups.length===2);assert(row.reason);for(const id of row.questionIds)assert(ids.has(id));if(row.status==='available')assert(row.questionIds.length);A.viewFilters.variantCompareLeft=row.groups[0];A.viewFilters.variantCompareRight=row.groups[1];const html=E.examBank(family.parentId);assert(html.includes('data-variant-disclosure="family:'+family.parentId+'" open'));for(const id of row.questionIds)assert(html.includes('href="#provfragor/'+id+'"'));if(!row.questionIds.length)assert(html.includes(C.escape(row.reason)))}
 E.disclosure({dataset:{variantDisclosure:'family:'+family.parentId},open:false});assert(!E.examBank(family.parentId).includes('data-variant-disclosure="family:'+family.parentId+'" open'));
});

test('Species and group source gaps are explicit instead of invented art facts; every supported coverage entry resolves to a real answer',()=>{
 const inventory=v.coverage.inventory,ids=new Set(v.questions.map(q=>q.id));assert.equal(inventory.filter(r=>r.speciesId).length,54);assert.equal(inventory.filter(r=>r.speciesId&&!r.questionIds.length).length,45);for(const row of inventory){assert(row.support);for(const id of row.questionIds)assert(ids.has(id));if(!row.questionIds.length)assert(row.gap)}
 const report=read('docs/PROVVARIANTER-TACKNING.json');assert.equal(report.newQuestions,78);assert.equal(report.questionEvidence.length,78);assert(report.allowedSources.length===3);assert(v.coverage.gaps.length>=8);
 const q=v.questions.find(q=>q.id==='variant-describe-magiska-svampar');assert(q);assert(q.evidenceRefs.some(r=>r.kind==='film'));assert(!/Psilocybe|cubensis|semilanceata/.test(q.answer));
});

test('The expanded checklist retains all 467 old items and 720 old units exactly, adding 78 new models',()=>{
 const old=K.catalog(data,beforeVariants(extra,'additions')),cat=K.catalog(data,extra);assert.equal(old.items.length,467);assert.equal(old.units.length,720);assert.equal(cat.items.length,545);assert.equal(cat.units.length,798);
 const items=new Map(cat.items.map(x=>[x.id,x])),units=new Map(cat.units.map(x=>[x.id,x]));for(const q of old.items)assert.deepEqual(items.get(q.id),q);for(const u of old.units)assert.deepEqual(units.get(u.id),u);
 const run={id:'saved-old-run',mode:'full',order:old.items.map(q=>q.id),index:2,answers:{},started:1,finished:null,submitted:false};const clean=K.sanitize({checks:{active:run,history:[run]}},cat,data,C,K.advancedQuestions(extra).map(q=>q.id));assert.deepEqual(clean.checks.active,run);assert.deepEqual(clean.checks.history[0],run);assert.equal(K.report(cat,run).gray.length,798);
 const generated=read('content/final-check-coverage.json');assert.equal(generated.questionCount,545);assert.equal(generated.unitCount,798);
});

test('Original and new progress, own answers and unfinished checks survive backup without identity or schema changes',()=>{
 const{A,E}=extension(),old=extra.questions[0],q=v.questions[0],item=E.cat.items.find(x=>x.entityId===q.id);for(const model of [old,q]){E.input({id:'advanced-own-answer',dataset:{question:model.id},value:'Sparad text '+model.id});A.rate(model.id,'again')}
 const check={id:'new-check',mode:'targeted',order:[item.id],index:0,answers:{[item.id]:{selected:'Mitt svar',checked:true,skipped:false,correct:null,selfRating:'unsure',at:10}},started:1,finished:null,submitted:false};A.state.additions.checks.active=check;const raw=plain(A.state),restored=C.validateBackup(raw,new Set(A.entities.keys()));restored.additions=E.sanitize(raw.additions);assert.equal(restored.schema,1);assert.deepEqual(plain(restored.reviews),raw.reviews);assert.deepEqual(plain(restored.additions.advancedResponses),raw.additions.advancedResponses);assert.deepEqual(plain(restored.additions.checks.active),check);
 const plan=E.view('repetition');assert(plan.includes('#provfragor/'+q.id));assert(!plan.includes('#aniva/'+q.id));assert(E.repetition().includes('1 frågevarianter behöver repeteras'));
});

test('All changed runtime resources have content versions while the existing source/style prefix and standalone navigation are preserved',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const file of ['js/data.js','js/views.js','js/sessions.js','js/additions-core.js','js/additions-data.js','js/additions.js','js/app.js','additions.css']){const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);assert(html.includes(file+'?v='+sha),file)}
 const before=audit.baselineFiles['additions.css'];assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'additions.css')).subarray(0,before.bytes)).digest('hex'),before.sha256);
});
