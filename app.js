const $=id=>document.getElementById(id);
const input=$('prompt'),messagesEl=$('messages'),welcome=$('welcome');

let messages=[],history=[],busy=false,activeView='chat',localEngine=null,enginePromise=null;
const LOCAL_MODEL='Qwen2-0.5B-Instruct-q4f16_1-MLC';
async function getLocalEngine(onProgress=()=>{}){
 if(localEngine)return localEngine;
 if(enginePromise)return enginePromise;
 enginePromise=(async()=>{
  if(!navigator.gpu)throw new Error('This browser does not expose WebGPU. Update iOS and open NEXUS in Safari, or try a supported device.');
  onProgress('Loading the local AI engine…');
  const webllm=await import('https://esm.run/@mlc-ai/web-llm');
  const engine=await webllm.CreateMLCEngine(LOCAL_MODEL,{initProgressCallback:p=>onProgress(p.text||'Preparing local model…')});
  localEngine=engine;return engine;
 })();
 try{return await enginePromise}catch(e){enginePromise=null;throw e}
}
try{history=JSON.parse(localStorage.getItem('nexus-history-v2')||'[]')}catch{}
function toast(s){const t=$('toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200)}
function setStatus(s){const b=$('modelStatus').querySelector('b');if(b)b.textContent=s}
function save(){try{localStorage.setItem('nexus-history-v2',JSON.stringify(history.slice(0,30)))}catch{toast('Storage is full; older chats may not save.')}}
function titleOf(ms){return(ms.find(x=>x.role==='user')?.content||'New conversation').slice(0,46)}
function saveChat(){if(!messages.length)return;const title=titleOf(messages);history=[{id:Date.now(),title,messages:messages.slice()},...history.filter(x=>x.title!==title)].slice(0,30);save();renderHistory()}
function renderHistory(){const el=$('history');el.innerHTML='';if(!history.length){el.innerHTML='<div class="history-empty">Your conversations will appear here.</div>';return}history.slice(0,12).forEach(c=>{const b=document.createElement('button');b.className='history-item';b.textContent=c.title;b.onclick=()=>loadChat(c.id);el.append(b)})}
function renderLibrary(){const el=$('libraryList');el.innerHTML='';if(!history.length){el.innerHTML='<div class="empty-tool"><span>▤</span><b>No saved conversations yet</b><small>Start a chat and it will appear here.</small></div>';return}history.forEach(c=>{const row=document.createElement('div');row.className='library-entry';const info=document.createElement('div'),b=document.createElement('b'),sm=document.createElement('small');b.textContent=c.title;sm.textContent=c.messages.length+' messages';info.append(b,sm);const open=document.createElement('button');open.textContent='Open chat →';open.onclick=()=>{loadChat(c.id);switchView('chat')};row.append(info,open);el.append(row)})}
function addMessage(role,content){const row=document.createElement('div');row.className='message '+role;const av=document.createElement('div');av.className='message-avatar';av.textContent=role==='user'?'N':'✦';const bubble=document.createElement('div');bubble.className='message-bubble';bubble.textContent=content;row.append(av,bubble);messagesEl.append(row);row.scrollIntoView({behavior:'smooth',block:'end'});return bubble}
function renderMessages(){messagesEl.innerHTML='';messages.forEach(m=>addMessage(m.role,m.content));const yes=messages.length>0;messagesEl.style.display=yes?'flex':'none';welcome.style.display=yes?'none':'block'}
function loadChat(id){const c=history.find(x=>x.id===id);if(!c)return;messages=c.messages.slice();renderMessages();$('sidebar').classList.remove('open')}
function reset(){messages=[];renderMessages();input.focus()}
function switchView(v){activeView=v;document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));$(v+'View').classList.add('active');document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.view===v));$('viewTitle').textContent=v==='reader'?'Web reader':v==='library'?'Library':'Chat';if(v==='library')renderLibrary();$('sidebar').classList.remove('open')}
$('modelStatus').onclick=()=>{$('settingsModal').classList.add('open')};
function resize(){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,180)+'px'}
document.querySelectorAll('.nav-link').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
$('homeLink').onclick=e=>{e.preventDefault();switchView('chat')};
$('newChat').onclick=()=>{reset();switchView('chat')};
$('mobileMenu').onclick=()=>$('sidebar').classList.toggle('open');
$('clearHistory').onclick=()=>{if(confirm('Delete all locally saved conversations?')){history=[];save();renderHistory();renderLibrary();toast('Saved history cleared.')}};
$('settingsBtn').onclick=()=>$('settingsModal').classList.add('open');
$('closeSettings').onclick=$('doneSettings').onclick=()=>$('settingsModal').classList.remove('open');
$('model').onchange=()=>$('settingsModel').value=$('model').value;
$('settingsModel').onchange=()=>$('model').value=$('settingsModel').value;
document.querySelectorAll('.prompt-card').forEach(b=>b.onclick=()=>{input.value=b.dataset.prompt;input.focus();resize()});
input.addEventListener('input',resize);
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('chatForm').requestSubmit()}});
$('chatForm').addEventListener('submit',async e=>{
 e.preventDefault();const content=input.value.trim();if(!content||busy)return;
 busy=true;$('sendBtn').disabled=true;input.value='';resize();if(activeView!=='chat')switchView('chat');
 welcome.style.display='none';messagesEl.style.display='flex';messages.push({role:'user',content});addMessage('user',content);
 const bubble=addMessage('assistant','Connecting to NEXUS AI…');setStatus('Starting on-device AI…');
 try{
  const engine=await getLocalEngine(progress=>{bubble.textContent='Preparing NEXUS on this device…\n'+progress;setStatus('Loading local model…')});
  bubble.textContent='NEXUS is thinking…';setStatus('Local model · Ready');
  const result=await engine.chat.completions.create({messages:[{role:'system',content:'You are NEXUS, a helpful, thoughtful, age-appropriate AI assistant. Be accurate and clear. You are a compact on-device model; be honest about uncertainty and limitations. Never claim to browse or use tools unless that happened.'},...messages],temperature:.7,max_tokens:700});
  const reply=result.choices?.[0]?.message?.content;
  if(typeof reply!=='string'||!reply.trim())throw new Error('The local model returned an empty response. Try a shorter message.');
  bubble.textContent=reply;messages.push({role:'assistant',content:reply});saveChat();setStatus('Local model · Ready');
 }catch(err){
  bubble.textContent='NEXUS could not start the local model. '+err.message+'\n\nThe first setup downloads a small model to this browser. Keep this tab open and use a regular Safari tab (not Private Browsing).';
  setStatus('Local model needs attention');
 }finally{busy=false;$('sendBtn').disabled=false;input.focus()}
});
$('readerForm').addEventListener('submit',async e=>{
 e.preventDefault();const url=$('readerUrl').value.trim(),result=$('readerResult');
 result.innerHTML='<div class="empty-tool"><span>◌</span><b>Reading page…</b><small>Fetching public page text.</small></div>';$('readerBtn').disabled=true;
 try{const r=await fetch('/api/read',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})}),data=await r.json();if(!r.ok)throw Error(data.error||'Could not read page');const card=document.createElement('article');card.className='article-card';const h=document.createElement('h2'),meta=document.createElement('div'),body=document.createElement('div');h.textContent=data.title||'Webpage';meta.className='article-meta';meta.textContent=data.url;body.className='article-text';body.textContent=data.text;card.append(h,meta,body);result.replaceChildren(card);const ask=document.createElement('button');ask.className='primary-wide';ask.style.marginTop='12px';ask.textContent='Ask NEXUS about this page';ask.onclick=()=>{switchView('chat');input.value='Please analyze this webpage and answer questions about it:\n\n'+data.title+'\n'+data.text.slice(0,9000);resize();input.focus()};result.append(ask)}catch(err){result.textContent=err.message}finally{$('readerBtn').disabled=false}
});
renderHistory();$('settingsModel').value=$('model').value;
