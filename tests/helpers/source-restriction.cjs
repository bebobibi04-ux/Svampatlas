const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const audit=()=>JSON.parse(fs.readFileSync(path.join(root,'docs/STRIKT-KALLGRANSKNING.json'),'utf8'));
function beforeCourse(data){const old=JSON.parse(JSON.stringify(data));for(const c of audit().changes.filter(c=>c.file==='course').reverse()){let parent=old;for(const k of c.path.slice(0,-1))parent=parent[k];const key=c.path.at(-1);assert.deepEqual(parent[key],c.after,c.path.join('.'));if(c.added)delete parent[key];else parent[key]=c.before}return old}
function beforeFileHash(file){const b=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/before-source-restriction-files.json'),'utf8'));const change=audit().fileChanges[file];if(!change)return crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),change.after,file+' changed after verified source correction');assert.equal(change.before,b[file].sha256);return change.before}
module.exports={beforeCourse,beforeFileHash};
