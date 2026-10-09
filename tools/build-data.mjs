import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'content/course.json'),'utf8'));
fs.writeFileSync(path.join(root,'js/data.js'),'window.STUDY_DATA='+JSON.stringify(data)+';\n');
console.log('Studiedata uppdaterad: '+data.sections.length+' avsnitt, '+data.species.length+' artnamn.');
