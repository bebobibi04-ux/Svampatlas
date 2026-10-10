(()=>{
 'use strict';
 const C=window.StudyCore,data=window.STUDY_DATA,main=document.querySelector('#main');
 const A={C,data,sections:data.sections,viewFilters:{},videoUrl:null,videoOffset:0};
 for(const [key,kind] of [['cards','card'],['quiz','quiz'],['recall','recall']])A[key==='quiz'?'questions':key==='recall'?'recalls':key]=A.sections.flatMap(s=>(s[key]||[]).map(x=>({...x,sectionId:s.id,source:x.source||s.source,kind})));
 A.openQuestions=A.recalls.filter(q=>q.type==='open');
 A.concepts=data.concepts||[];
 A.entities=new Map([...data.species.map(x=>({...x,kind:'species'})),...A.cards,...A.questions,...A.recalls].map(x=>[x.id,x]));
 const ids=new Set([...A.entities.keys(),...A.sections.map(x=>x.id)]),storageKey='svampatlas-v1',draftKey='svampatlas-exam-v1';
 let toastTimer,storageFailed=false;
 A.toast=message=>{const el=document.querySelector('#toast');el.textContent=message;el.classList.add('toast-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('toast-visible'),4500)};
 A.confirm=message=>new Promise(resolve=>{const d=document.querySelector('#confirm-dialog');document.querySelector('#confirm-message').textContent=message;d.returnValue='';d.addEventListener('close',()=>resolve(d.returnValue==='yes'),{once:true});d.showModal()});
 A.state=C.initialState();
 try{const saved=localStorage.getItem(storageKey);if(saved)A.state=C.validateBackup(JSON.parse(saved),ids)}catch{setTimeout(()=>A.toast('Sparad data kunde inte läsas. Du kan importera en backup i Min progress.'),300)}
 A.save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(A.state))}catch{if(!storageFailed){storageFailed=true;A.toast('Webbläsaren tillåter inte lagring. Exportera din progress innan du stänger.')}}};
 A.isReviewed=id=>C.reviewCurrent(A.entities.get(id),A.state.reviews[id]);
 A.isDue=id=>!!A.state.reviews[id]&&(!A.isReviewed(id)||A.state.reviews[id].due<=Date.now());
 A.rate=(id,rating,revision)=>{if(!A.entities.has(id))return;A.state.reviews[id]={...C.schedule(A.state.reviews[id],rating),revision:revision??A.entities.get(id).revision??1};A.save()};
 A.record=(kind,answers,extra={})=>{const score=C.score(answers),attempt={id:crypto.randomUUID?.()||'attempt-'+Date.now(),at:Date.now(),kind,...score,answers,...extra};A.state.attempts.push(attempt);A.state.attempts=A.state.attempts.slice(-250);A.save();return attempt};
 A.dueItems=()=>[...A.entities.values()].filter(x=>A.isDue(x.id));
 A.weakSections=()=>A.sections.map(section=>({section,count:[...A.entities.values()].filter(x=>x.sectionId===section.id&&['again','unsure'].includes(A.state.reviews[x.id]?.rating)).length})).filter(x=>x.count).sort((a,b)=>b.count-a.count);
 A.formatDate=value=>new Intl.DateTimeFormat('sv-SE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
 A.loadDraft=()=>{try{return C.validateDraft(JSON.parse(localStorage.getItem(draftKey)),A.entities)}catch{return null}};
 A.saveDraft=d=>{try{localStorage.setItem(draftKey,JSON.stringify({...d,order:null}))}catch{A.toast('Det pågående provet kunde inte sparas.')}};
 A.clearDraft=()=>{try{localStorage.removeItem(draftKey)}catch{}};
 A.go=hash=>{if(location.hash===hash)A.render();else location.hash=hash};
 A.views=window.AtlasViews(A);A.sessions=window.AtlasSessions(A);
 function theme(){document.documentElement.dataset.theme=A.state.theme;document.querySelector('#theme-toggle').setAttribute('aria-label',A.state.theme==='dark'?'Växla till ljust läge':'Växla till mörkt läge')}
 function seconds(time){return String(time||'0').split(':').reduce((n,x)=>n*60+Number(x),0)}
 function seek(value){const player=document.querySelector('#film-player');if(!player||!A.videoUrl){A.toast('Välj din videofil för att hoppa till en tidskod.');return}const move=()=>{player.currentTime=Math.max(0,Math.min(player.duration||Infinity,value+A.videoOffset));player.scrollIntoView({block:'center',behavior:'smooth'})};if(player.readyState)move();else player.addEventListener('loadedmetadata',move,{once:true})}
 A.render=()=>{let route,id;try{[route='oversikt',id='']=location.hash.slice(1).split('/').map(decodeURIComponent)}catch{route='oversikt';id=''}if(!route)route='oversikt';let html;
 switch(route){case'oversikt':html=A.views.overview();break;case'arter':if(id){const p=data.species.find(x=>x.id===id);if(p)A.viewFilters.speciesQuery=p.name}html=A.views.species();break;case'studera':html=A.views.study(id);break;case'kort':html=A.sessions.flashView(id);break;case'recall':html=A.sessions.recallView(id);break;case'quiz':html=A.sessions.quizView(id);break;case'arttraning':html=A.sessions.artView();break;case'prov':html=A.sessions.examView(id);break;case'repetera':html=A.views.repetition();break;case'begrepp':if(id){const c=A.concepts.find(x=>C.normalize(x.term)===id);if(c)A.viewFilters.glossaryQuery=c.term}html=A.views.glossary();break;case'sok':html=A.views.search(id);break;case'kallor':html=A.views.sources();break;case'bildkallor':html=A.views.credits();break;case'presentation':html=A.views.presentation(id);break;case'film':html=A.views.film(id);break;case'framsteg':html=A.views.progress();break;default:html=A.views.head('Sidan saknas','Hitta tillbaka')+'<a class="button" href="#oversikt">Till översikten</a>'}
 main.innerHTML=html;document.querySelectorAll('[data-nav]').forEach(el=>{const active=el.dataset.nav===route;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});document.title=(main.querySelector('h1')?.textContent||'Studera')+' · Svampatlas';if(route==='film'&&id&&A.videoUrl)seek(seconds(id));
 };
 function download(name,value){const url=URL.createObjectURL(new Blob([value],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
 const actions={...A.sessions.actions,
 'zoom':el=>{const d=document.querySelector('#image-dialog');d.querySelector('img').src=el.dataset.src;d.querySelector('img').alt=el.dataset.caption||'Förstorad bild';d.querySelector('p').textContent=el.dataset.caption||'';d.showModal()},
 'concept':el=>{const c=A.concepts.find(x=>x.term===el.dataset.term);if(!c)return;const d=document.querySelector('#concept-dialog');d.querySelector('.dialog-content').innerHTML=`<h2>${C.escape(c.term)}</h2><p>${C.escape(c.definition)}</p>${c.sectionIds.map(id=>`<p><a href="#studera/${C.escape(id)}">Läs ${C.escape(A.sections.find(s=>s.id===id)?.title||'avsnittet')}</a></p>`).join('')}`;d.showModal()},
 'mark-read':el=>{const id=el.dataset.id;if(A.state.read.includes(id))A.state.read=A.state.read.filter(x=>x!==id);else A.state.read.push(id);A.save();A.render()},
 'process-step':el=>{const s=A.sections.find(s=>s.id===el.dataset.id),step=s?.process?.steps[Number(el.dataset.index)];if(!step)return;document.querySelector('#process-explanation').textContent=step.text;el.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===el))},
 'video-jump':el=>seek(Number(el.dataset.seconds)),
 'backup-export':()=>download('Svampatlas-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(A.state,null,2)),
 'clear-progress':async()=>{if(await A.confirm('Nollställ läsmarkeringar, repetitioner och resultat? Exportera en backup först om du vill behålla dem.')){A.state=C.initialState();A.save();A.clearDraft();location.reload()}}
 };
 document.addEventListener('click',event=>{if(event.target.closest('.skip')){event.preventDefault();main.focus();main.scrollIntoView();return}const confirmation=event.target.closest('[data-confirm]');if(confirmation){confirmation.closest('dialog').close(confirmation.dataset.confirm);return}const close=event.target.closest('.dialog-close');if(close){close.closest('dialog').close();return}const el=event.target.closest('[data-action]');if(el&&!el.disabled){event.preventDefault();actions[el.dataset.action]?.(el)}if(event.target.closest('dialog a'))event.target.closest('dialog').close()});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
 document.addEventListener('submit',event=>{if(event.target.id==='search-form'){event.preventDefault();A.go('#sok/'+encodeURIComponent(document.querySelector('#global-search').value.trim()))}else if(event.target.id==='art-answer-form'){event.preventDefault();A.sessions.form(event.target)}});
 document.addEventListener('input',event=>{const el=event.target;A.sessions.input(el);if(el.dataset.filter&&el.tagName==='INPUT'){const start=el.selectionStart,end=el.selectionEnd,id=el.id;A.viewFilters[el.dataset.filter]=el.value;A.render();const next=document.getElementById(id);next?.focus({preventScroll:true});next?.setSelectionRange(start,end)}});
 document.addEventListener('change',async event=>{const el=event.target;if(el.dataset.filter){A.viewFilters[el.dataset.filter]=el.value;A.render()}if(el.id==='video-file'&&el.files[0]){if(A.videoUrl)URL.revokeObjectURL(A.videoUrl);A.videoUrl=URL.createObjectURL(el.files[0]);A.render()}if(el.id==='video-offset'){A.videoOffset=Math.max(-120,Math.min(120,Number(el.value)||0))}if(el.id==='backup-import'&&el.files[0]){try{const next=C.validateBackup(JSON.parse(await el.files[0].text()),ids);next.read=next.read.filter(id=>A.sections.some(s=>s.id===id));if(await A.confirm('Ersätt nuvarande progress med innehållet i backupen?')){A.state=next;A.save();theme();A.clearDraft();A.render();A.toast('Din progress har återställts.')}}catch(error){A.toast(error.message||'Backupen kunde inte läsas.')}el.value=''}});
 document.querySelector('#theme-toggle').addEventListener('click',()=>{A.state.theme=A.state.theme==='dark'?'light':'dark';theme();A.save()});
 document.querySelector('#menu-toggle').addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');document.querySelector('#menu-toggle').setAttribute('aria-expanded',String(open))});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.body.classList.remove('menu-open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false')}A.sessions.key(event)});
 window.addEventListener('hashchange',()=>{document.body.classList.remove('menu-open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');A.render();window.scrollTo(0,0);main.focus({preventScroll:true})});
 window.Svampatlas=Object.freeze({getProgress:()=>({readSections:A.state.read.length,totalSections:A.sections.length,reviewedCards:A.cards.filter(c=>A.isReviewed(c.id)).length,trainedSpecies:data.species.filter(s=>A.state.reviews[s.id]).length,due:A.dueItems().length,tests:A.state.attempts.length}),startPractice:(mode,scope='all')=>{if(!['kort','recall','quiz','arttraning'].includes(mode)||!['all','book','ppt','film',...A.sections.map(s=>s.id)].includes(scope))throw Error('Ogiltigt studiepass');A.sessions.start(mode,scope);return {mode,scope}}});
 theme();A.render();
})();
