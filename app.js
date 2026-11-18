const $ = (id) => document.getElementById(id);
const form = $('chatForm'), input = $('prompt'), messages = $('messages'), welcome = $('welcome');
let currentMessages = [], conversations = [];
let busy = false;
try { conversations = JSON.parse(localStorage.getItem('nexus-history') || '[]'); } catch {}
renderHistory();
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function renderHistory(){const host=$('history');host.innerHTML='';if(!conversations.length){host.innerHTML='<div class="history-empty">Your conversations will appear here.</div>';return;}conversations.slice(0,12).forEach((c,i)=>{const b=document.createElement('button');b.className='history-item';b.textContent=c.title;b.onclick=()=>{currentMessages=c.messages.slice();renderMessages();};host.appendChild(b);});}
function saveConversation(){if(!currentMessages.length)return;const first=currentMessages.find(m=>m.role==='user');const title=(first?.content||'New conversation').slice(0,38);conversations=[{title,messages:currentMessages},...conversations.filter(c=>c.title!==title)].slice(0,12);try{localStorage.setItem('nexus-history',JSON.stringify(conversations));}catch{}renderHistory();}
function renderMessages(){messages.innerHTML='';currentMessages.forEach(m=>addMessage(m.role,m.content,false));const has=currentMessages.length>0;messages.style.display=has?'flex':'none';welcome.style.display=has?'none':'block';}
function addMessage(role,content,animate=true){const row=document.createElement('div');row.className='message '+role;const avatar=document.createElement('div');avatar.className='avatar';avatar.textContent=role==='user'?'N':'✦';const bubble=document.createElement('div');bubble.className='bubble';bubble.textContent=content;row.append(avatar,bubble);messages.appendChild(row);if(animate)row.scrollIntoView({behavior:'smooth',block:'end'});return bubble;}
function resize(){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,180)+'px';}
input.addEventListener('input',resize);
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
$('newChat').onclick=()=>{currentMessages=[];renderMessages();input.focus();};
$('clearChat').onclick=()=>{currentMessages=[];renderMessages();toast('Current chat cleared');};
$('mobileMenu').onclick=()=>$('sidebar').classList.toggle('open');
$('browserNav').onclick=()=>toast('Web reader is planned for a future update.');
document.querySelectorAll('.suggestion').forEach(b=>b.onclick=()=>{input.value=b.dataset.prompt;resize();input.focus();});
form.addEventListener('submit',async e=>{e.preventDefault();const content=input.value.trim();if(!content||busy)return;busy=true;$('sendButton').disabled=true;input.value='';resize();welcome.style.display='none';messages.style.display='flex';currentMessages.push({role:'user',content});addMessage('user',content);const bubble=addMessage('assistant','Thinking…');bubble.classList.add('typing');try{const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:currentMessages,model:$('model').value})});const data=await response.json();if(!response.ok)throw new Error(data.error||'The request failed.');bubble.classList.remove('typing');bubble.textContent=data.reply;currentMessages.push({role:'assistant',content:data.reply});saveConversation();}catch(err){bubble.classList.remove('typing');bubble.textContent='I could not connect to the AI service. '+err.message+' Check that the site owner has configured OPENAI_API_KEY in the hosting environment.';}finally{busy=false;$('sendButton').disabled=false;input.focus();}});
