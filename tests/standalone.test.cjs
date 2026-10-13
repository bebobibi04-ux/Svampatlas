const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');

test('The standalone shell loads only bundled relative scripts and styles, including under a repository subpath',()=>{
 const resources=[...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)].map(x=>x[1]).filter(x=>!x.startsWith('data:'));
 assert.equal(resources.length,10);
 for(const resource of resources){assert(!/^\/|^[a-z]+:/i.test(resource),resource);assert(fs.statSync(path.join(root,resource)).isFile());assert.equal(new URL(resource,'https://example.org/Svampatlas/').pathname,'/Svampatlas/'+resource)}
 assert(!/<base\b/i.test(html));assert(fs.existsSync(path.join(root,'.nojekyll')));
});

test('Runtime has no service integrations, remote resource loaders, or authentication dependency',()=>{
 assert(!fs.existsSync(path.join(root,'.openai')));
 for(const filename of ['app.js','core.js','sessions.js','views.js','additions.js','additions-core.js','additions-data.js']){
  const text=fs.readFileSync(path.join(root,'js',filename),'utf8');
  assert(!/modelContext|openai\.com|chatgpt\.site|\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource/.test(text),filename);
 }
 const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');assert(!/@import|url\(\s*['"]?https?:/.test(css));
 const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');assert(app.includes("storageKey='svampatlas-v1',draftKey='svampatlas-exam-v1'"));assert(app.includes('localStorage.setItem'));
});

test('Original export assets and unchanged runtimes match the historical export inventory',()=>{
 const crypto=require('node:crypto'),inventory=JSON.parse(fs.readFileSync(path.join(root,'docs/EXPORTKONTROLL.json'),'utf8'));
 for(const item of inventory.preservedWebsiteFiles.filter(item=>!['index.html','js/data.js','js/sessions.js'].includes(item.file)))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,item.file))).digest('hex'),item.sha256,item.file);
 // The additive shell is checked against its complete prior HTML in additions.test.cjs.
 // Full original content preservation is checked by before-powerpoint hashes.

 const data=JSON.parse(fs.readFileSync(path.join(root,'content/course.json'),'utf8'));assert.equal(data.contentRevision,'film-subject-v2');assert.equal(data.species.length,54);assert.equal(data.sections.filter(s=>s.source.kind==='film').flatMap(s=>s.recall).filter(q=>q.type==='open'&&q.revision===2).length,8);
});
