import fs from 'node:fs/promises';
import path from 'node:path';
import {root,loadSite,renderSite} from './factory.mjs';
for(const file of await fs.readdir(path.join(root,'sites'))){
 if(!file.endsWith('.json')) continue;
 const slug=file.slice(0,-5), site=await loadSite(slug);
 const out=path.resolve(root,'../public/preview',slug,'index.html');
 // Existing output is a frozen snapshot. Regenerate deliberately via factory.mjs.
 try { await fs.access(out); console.log('Preserved '+slug); continue; } catch {}
 const html=await renderSite(site,{allowDraft:site.demo});
 await fs.mkdir(path.dirname(out),{recursive:true}); await fs.writeFile(out,html);
 console.log('Generated '+slug);
}
