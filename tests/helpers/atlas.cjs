const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),C=require('../../js/core.js'),data=JSON.parse(fs.readFileSync(path.join(root,'content/course.json'),'utf8'));
function context(selectedIds,selectedSources){
 let draft=null;
 const config={'#exam-kind':{value:'mixed'},'#exam-format':{value:'objective'},'#exam-focus':{value:'all'},'#exam-count':{value:'10'}};
 const scopes=data.sections.map(s=>({value:s.id,checked:!selectedIds||selectedIds.includes(s.id)}));
 const sources=['book','ppt','film'].map(value=>({value,checked:!selectedSources||selectedSources.includes(value)}));
 const A={C,data,sections:data.sections,state:C.initialState(),entities:new Map(),viewFilters:{},confirm:async()=>true,render(){},save(){},go(){},toast(){},loadDraft(){return null},saveDraft(d){draft=JSON.parse(JSON.stringify(d))},clearDraft(){draft=null},rate(id,rating,revision){this.state.reviews[id]={...C.schedule(this.state.reviews[id],rating),revision:revision??this.entities.get(id)?.revision??1}},record(kind,answers,extra={}){const a={id:'test-'+this.state.attempts.length,at:Date.now(),kind,...C.score(answers),answers,...extra};this.state.attempts.push(a);return a}};
 for(const [key,field,kind]of[['cards','cards','card'],['quiz','questions','quiz'],['recall','recalls','recall']])A[field]=data.sections.flatMap(s=>s[key].map(q=>({...q,sectionId:s.id,source:q.source||s.source,kind})));
 A.entities=new Map([...A.cards,...A.questions,...A.recalls,...data.species].map(q=>[q.id,q]));A.concepts=data.concepts;A.formatDate=String;A.dueItems=()=>[];A.weakSections=()=>[];
 const sandbox={window:{},document:{querySelector:s=>config[s],querySelectorAll:s=>({'[name=exam-scope]':scopes,'[name=exam-scope]:checked':scopes.filter(s=>s.checked),'[name=exam-source]':sources,'[name=exam-source]:checked':sources.filter(s=>s.checked)}[s]||[])},location:{hash:'#quiz'},confirm:()=>true};
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'js/views.js'),'utf8'),sandbox);A.views=sandbox.window.AtlasViews(A);A.filmStudy=sandbox.window.AtlasFilmStudy(A);A.filmStudy.restore();A.isDue=id=>!!A.state.reviews[id]&&A.state.reviews[id].due<=Date.now();vm.runInContext(fs.readFileSync(path.join(root,'js/sessions.js'),'utf8'),sandbox);
 return{A,S:sandbox.window.AtlasSessions(A),draft:()=>draft,config,scopes,sources};
}
module.exports={context,data,root,C};
