const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const audit=()=>JSON.parse(fs.readFileSync(path.join(root,'docs/STRIKT-KALLGRANSKNING.json'),'utf8'));
const presentation=()=>JSON.parse(fs.readFileSync(path.join(root,'docs/PROVSVAR-PRESENTATION-GRANSKNING.json'),'utf8'));
function reverseChanges(data,changes,file){const old=JSON.parse(JSON.stringify(data));for(const c of changes.filter(c=>c.file===file).reverse()){let parent=old;for(const k of c.path.slice(0,-1))parent=parent[k];const key=c.path.at(-1);assert.deepEqual(parent[key],c.after,c.path.join('.'));if(c.added)delete parent[key];else parent[key]=c.before}return old}
const variants=()=>JSON.parse(fs.readFileSync(path.join(root,'docs/PROVVARIANTER-ADDITIONSKONTROLL.json'),'utf8'));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const canonsha=x=>crypto.createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
function beforeVariants(data,file='course'){const old=JSON.parse(JSON.stringify(data)),v=variants();if(file==='additions'){assert.equal(canonsha(old.examVariants),v.variantsCanonicalSha256);delete old.examVariants}assert.equal(canonsha(old),v.beforeCanonicalSha256[file]);return old}
function beforeVariantFileHash(file){let sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');const change=variants().fileChanges[file];if(change){assert.equal(sha,change.after,file+' changed after verified variant extension');sha=change.before}return sha}
function beforePresentation(data,file='course'){return reverseChanges(beforeVariants(data,file),presentation().changes,file)}
function beforeCourse(data){return reverseChanges(beforePresentation(data),audit().changes,'course')}
function beforeFileHash(file){const b=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/before-source-restriction-files.json'),'utf8'));let sha=beforeVariantFileHash(file);const style=presentation().fileChanges[file];if(style){assert.equal(sha,style.after,file+' changed after verified presentation edit');sha=style.before}const change=audit().fileChanges[file];if(!change)return sha;assert.equal(sha,change.after,file+' changed after verified source correction');assert.equal(change.before,b[file].sha256);return change.before}
module.exports={beforeCourse,beforePresentation,beforeFileHash,beforeVariants,beforeVariantFileHash};
