(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AtlasAdditionsCore=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const revision='additions-2026-10-14';
 const safeId=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 function advancedQuestions(extra){return [...(extra.questions||[]),...(extra.examVariants?.questions||[])]}
 function photos(species,extra){return [{id:species.id+'-original',image:species.image,quizImage:extra.originalQuizImages?.[species.id],imageSource:species.imageSource||species.sourceUrl,author:species.author,license:species.license,license_url:species.license_url,attribution:species.attribution,scientificName:species.identity_name,verificationNote:'Det tidigare granskade originalfotot.'},...(extra.photos||[]).filter(p=>p.speciesId===species.id)]}
 function catalog(data,extra){
  const topics=[...(extra.topics||[]),{id:'artkunskap',title:'Artkunskap · alla 54 arter',sectionIds:[]}],topicFor=id=>topics.find(t=>t.sectionIds.includes(id))?.id||'ovrigt';
  const units=[],items=[],factMap=new Map(),covered=new Set();
  for(const s of data.sections)for(const f of s.facts){factMap.set(f.id,{...f,sectionId:s.id,source:s.source});units.push({id:'fact:'+f.id,title:f.text,topicId:topicFor(s.id),sectionIds:[s.id],kind:'fact'})}
  const add=q=>{q.unitIds=[...new Set(q.unitIds||[])];items.push(q);for(const id of q.unitIds)covered.add(id)};
  for(const s of data.sections){
   for(const r of s.recall){const id='recall:'+r.id;units.push({id,title:r.question,topicId:topicFor(s.id),sectionIds:[s.id],kind:r.teacherNumber?'teacher':'recall'});add({id,entityId:r.id,kind:'self',original:r,question:r.question,answer:r.answer,criteria:r.checkpoints||r.assessment?.criteria||[],sectionIds:[s.id],topicId:topicFor(s.id),unitIds:[id,...(r.factIds||[]).map(f=>'fact:'+f)],source:s.source,teacherNumber:r.teacherNumber||null,priority:r.teacherNumber?3:2})}
   if(s.process){const id='process:'+s.id;units.push({id,title:s.process.title,topicId:topicFor(s.id),sectionIds:[s.id],kind:'process'});add({id,kind:'process',question:'Ordna och kontrollera processen: '+s.process.title,steps:s.process.steps.map(x=>x.label),answer:s.process.steps.map((x,i)=>(i+1)+'. '+x.label+': '+x.text).join('\n\n'),criteria:['Rätt ordning mellan samtliga steg.','Läs även förklaringen till varje steg efter kontrollen.'],sectionIds:[s.id],topicId:topicFor(s.id),unitIds:[id],source:s.source,priority:3})}
  }
  for(const c of data.concepts){const id=c.controlId||'concept:'+safeId(c.term);units.push({id,title:c.term,topicId:topicFor(c.sectionIds[0]),sectionIds:c.sectionIds,kind:'concept'});add({id,kind:'self',question:'Förklara begreppet '+c.term+' med egna ord.',answer:c.definition,criteria:['Definitionens betydelse återges korrekt.','Begreppet skiljs från närliggande begrepp.'],sectionIds:c.sectionIds,topicId:topicFor(c.sectionIds[0]),unitIds:[id],priority:2})}
  for(const s of data.sections)for(const c of s.cards){const missing=(c.factIds||[]).filter(f=>factMap.has(f)&&!covered.has('fact:'+f));if(missing.length)add({id:'card:'+c.id,entityId:c.id,kind:'self',question:c.question,answer:c.answer,criteria:['Alla delar av det källbaserade svaret återges utan stöd.'],sectionIds:[s.id],topicId:topicFor(s.id),unitIds:missing.map(f=>'fact:'+f),source:c.source||s.source,priority:1})}
  for(const f of factMap.values())if(!covered.has('fact:'+f.id)){const supplement=(extra.coverageQuestions||[]).find(q=>q.factId===f.id);if(!supplement)throw Error('Slutchecken saknar en källbaserad fråga för '+f.id);add({id:'fact:'+f.id,kind:'self',question:supplement.question,answer:f.text,criteria:['Återge uppgiften i sin källkontext; dra ingen generell slutsats från ett enskilt exempel.'],sectionIds:[f.sectionId],topicId:topicFor(f.sectionId),unitIds:['fact:'+f.id],source:f.source,priority:1})}
  for(const q of advancedQuestions(extra)){const id='advanced:'+q.id;units.push({id,title:q.question,topicId:q.topicId,sectionIds:q.sectionIds,kind:'advanced'});add({id,entityId:q.id,kind:'self',advanced:true,original:q,question:q.question,answer:q.answer,criteria:q.criteria,sectionIds:q.sectionIds,topicId:q.topicId,unitIds:[id,...q.factIds.map(f=>'fact:'+f)],priority:3})}
  for(const s of data.sections){const q=s.quiz.find(q=>q.type==='order')||s.quiz.find(q=>q.type==='multi')||s.quiz[0];if(q)add({id:'objective:'+q.id,entityId:q.id,kind:'objective',original:q,question:q.question,answer:q.explanation,sectionIds:[s.id],topicId:topicFor(s.id),unitIds:(q.factIds||[]).map(f=>'fact:'+f),source:q.source||s.source,priority:2})}
  for(const p of data.species)for(const photo of photos(p,extra)){const id='photo:'+photo.id;units.push({id,title:p.name+' · fotografi '+(photos(p,extra).findIndex(x=>x.id===photo.id)+1),topicId:'artkunskap',sectionIds:[],kind:'photo',speciesId:p.id,photoId:photo.id});add({id,entityId:p.id,kind:'art',speciesId:p.id,photoId:photo.id,question:'Vad heter svampen?',topicId:'artkunskap',sectionIds:[],unitIds:[id],priority:3})}
  const ids=new Set(units.map(u=>u.id));for(const item of items)for(const id of item.unitIds)if(!ids.has(id))throw Error('Okänd kontrollpunkt '+id);
  return{revision,topics,units,items};
 }
 function choose(cat,mode,C,selected){
  if(mode==='targeted')return C.shuffle(cat.items.filter(q=>(selected||[]).includes(q.id)));
  if(mode==='full')return [...cat.topics.flatMap(t=>C.shuffle(cat.items.filter(q=>q.topicId===t.id)))];
  const chosen=new Map(),take=xs=>xs.forEach(q=>chosen.set(q.id,q));
  take(cat.items.filter(q=>q.teacherNumber));
  for(const t of cat.topics.filter(t=>t.id!=='artkunskap')){const group=cat.items.filter(q=>q.topicId===t.id);take(C.shuffle(group.filter(q=>q.advanced)).slice(0,1));take(C.shuffle(group.filter(q=>!q.advanced&&!q.teacherNumber&&q.kind==='self')).slice(0,1))}
  take(C.shuffle(cat.items.filter(q=>q.kind==='process')).slice(0,2));take(C.shuffle(cat.items.filter(q=>q.kind==='objective')).slice(0,2));
  const art=C.shuffle(cat.items.filter(q=>q.kind==='art')),seen=new Set();take(art.filter(q=>{if(seen.has(q.speciesId))return false;seen.add(q.speciesId);return true}).slice(0,8));return C.shuffle([...chosen.values()]);
 }
 function grade(item,value,data,C){
  if(item.kind==='art')return C.gradeName(value,data.species.find(s=>s.id===item.speciesId));
  if(item.kind==='process')return Array.isArray(value)&&value.length===item.steps.length&&value.every((v,i)=>v===i);
  if(item.kind==='objective'){const q=item.original;if(q.type==='order')return Array.isArray(value)&&value.join('|')===q.items.join('|');if(q.type==='multi')return Array.isArray(value)&&value.length===q.correct.length&&[...value].sort().join('|')===[...q.correct].sort().join('|');return Number.isInteger(value)&&value===q.correct}
  return null;
 }
 function report(cat,run){
  const observed=new Map(),answers=run?.answers||{},order=new Set(run?.order||[]);
  for(const q of cat.items){const r=answers[q.id];if(!order.has(q.id)||!r?.checked||r.skipped)continue;const status=typeof r.correct==='boolean'?(r.correct?'green':'red'):r.selfRating==='know'?'green':r.selfRating==='unsure'?'yellow':r.selfRating==='again'?'red':'gray';for(const id of q.unitIds){const prev=observed.get(id);const rank={gray:0,green:1,yellow:2,red:3};if(!prev||rank[status]>rank[prev.status]||rank[status]===rank[prev.status]&&r.at>=prev.at)observed.set(id,{status,at:r.at,method:typeof r.correct==='boolean'?'objective':'self',itemId:q.id})}}
  const evaluate=us=>{const groups={green:[],yellow:[],red:[],gray:[]};for(const u of us)groups[observed.get(u.id)?.status||'gray'].push(u);const status=groups.red.length?'red':groups.yellow.length?'yellow':groups.gray.length?'gray':'green';return{status,total:us.length,tested:us.length-groups.gray.length,...groups}};
  const topics=cat.topics.map(t=>({...t,...evaluate(cat.units.filter(u=>u.topicId===t.id))}));
  const failures=cat.items.filter(q=>order.has(q.id)&&answers[q.id]?.checked&&(answers[q.id].correct===false||['again','unsure'].includes(answers[q.id].selfRating)));
  const missingItems=cat.items.filter(q=>order.has(q.id)&&(!answers[q.id]?.checked||answers[q.id]?.skipped||q.kind==='self'&&!answers[q.id].selfRating));
  const priorities=[...failures].sort((a,b)=>(answers[a.id]?.correct===false||answers[a.id]?.selfRating==='again'?0:1)-(answers[b.id]?.correct===false||answers[b.id]?.selfRating==='again'?0:1)||b.priority-a.priority);
  const objective=Object.values(answers).filter(r=>r.checked&&!r.skipped&&typeof r.correct==='boolean'),self=Object.values(answers).filter(r=>r.checked&&!r.skipped&&r.correct===null);
  return{...evaluate(cat.units),topics,observed,failures,missingItems,priorities,objective:{total:objective.length,correct:objective.filter(r=>r.correct).length},self:{total:self.length,rated:self.filter(r=>r.selfRating).length},uniqueSpecies:new Set(cat.units.filter(u=>u.kind==='photo'&&observed.has(u.id)&&observed.get(u.id).status!=='gray').map(u=>u.speciesId)).size};
 }
 function sanitize(raw,cat,data,C,advancedIds){
  const out={revision,advancedResponses:{},photoRotation:{},checks:{active:null,history:[]}};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
  const itemMap=new Map(cat.items.map(q=>[q.id,q]));
  if(raw.advancedResponses&&typeof raw.advancedResponses==='object')for(const id of advancedIds){const v=Object.prototype.hasOwnProperty.call(raw.advancedResponses,id)&&raw.advancedResponses[id];if(v&&typeof v.text==='string')out.advancedResponses[id]={text:v.text.slice(0,20000),at:Number.isFinite(v.at)?v.at:0}}
  for(const p of data.species){const n=raw.photoRotation?.[p.id];if(Number.isSafeInteger(n)&&n>=0)out.photoRotation[p.id]=n}
  const cleanRun=r=>{if(!r||typeof r.id!=='string'||!Array.isArray(r.order)||!r.order.length||r.order.length>cat.items.length||!r.order.every(id=>itemMap.has(id))||new Set(r.order).size!==r.order.length)return null;const order=[...r.order],answers={};for(const id of order){const q=itemMap.get(id),a=Object.prototype.hasOwnProperty.call(r.answers||{},id)&&r.answers[id];if(!a||typeof a!=='object')continue;let selected=typeof a.selected==='string'?a.selected.slice(0,20000):Number.isInteger(a.selected)?a.selected:Array.isArray(a.selected)&&a.selected.length<100?a.selected.filter(v=>typeof v==='string'||Number.isInteger(v)):null;const checked=a.checked===true,skipped=a.skipped===true;answers[id]={selected,checked,skipped,correct:checked&&!skipped?grade(q,selected,data,C):null,selfRating:q.kind==='self'&&checked&&typeof selected==='string'&&selected.trim()&&['know','unsure','again'].includes(a.selfRating)?a.selfRating:null,at:Number.isFinite(a.at)?a.at:0}}
   return{id:r.id.slice(0,100),mode:['quick','full','targeted'].includes(r.mode)?r.mode:'quick',order,index:Number.isInteger(r.index)?Math.max(0,Math.min(r.index,order.length-1)):0,answers,started:Number.isFinite(r.started)?r.started:0,finished:Number.isFinite(r.finished)?r.finished:null,submitted:r.submitted===true};};
  out.checks.active=cleanRun(raw.checks?.active);if(Array.isArray(raw.checks?.history))out.checks.history=raw.checks.history.slice(-12).map(cleanRun).filter(Boolean);return out;
 }
 return{revision,safeId,advancedQuestions,photos,catalog,choose,grade,report,sanitize};
});
