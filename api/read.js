// Public webpage text reader. This is not a general-purpose browser.
function privateHost(host){const h=host.toLowerCase().replace(/^\[|\]$/g,"");if(h==="localhost"||h.endsWith(".localhost")||h.endsWith(".local")||h==="::1"||h==="::")return true;if(/^127\./.test(h)||/^10\./.test(h)||/^192\.168\./.test(h)||/^169\.254\./.test(h)||/^0\./.test(h))return true;const m=h.match(/^172\.(\d+)\./);if(m&&+m[1]>=16&&+m[1]<=31)return true;return !h.includes(".")&&!h.includes(":")}
function decode(s){return s.replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Math.min(0x10ffff,+n))).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))}
module.exports=async function(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed."});
 try{
  const raw=req.body?.url;if(typeof raw!=="string"||raw.length>2048)return res.status(400).json({error:"Enter a valid public webpage URL."});
  let url;try{url=new URL(raw)}catch{return res.status(400).json({error:"That URL is not valid."})}
  if(!["http:","https:"].includes(url.protocol)||url.username||url.password||privateHost(url.hostname))return res.status(400).json({error:"Only public HTTP or HTTPS webpages can be read."});
  let response;
  for(let i=0;i<4;i++){response=await fetch(url,{redirect:"manual",signal:AbortSignal.timeout(12000),headers:{"User-Agent":"NEXUS-Reader/1.0","Accept":"text/html,application/xhtml+xml,text/plain"}});if([301,302,303,307,308].includes(response.status)){const loc=response.headers.get("location");if(!loc)break;url=new URL(loc,url);if(!["http:","https:"].includes(url.protocol)||privateHost(url.hostname))return res.status(400).json({error:"The page redirected to a blocked address."});continue}break}
  if(!response||!response.ok)return res.status(502).json({error:"The webpage could not be fetched (HTTP "+(response?.status||"unknown")+")."});
  const type=response.headers.get("content-type")||"";if(!type.includes("text/html")&&!type.includes("text/plain")&&!type.includes("application/xhtml+xml"))return res.status(415).json({error:"That link does not point to a readable HTML or text page."});
  const html=(await response.text()).slice(0,1200000);let title=(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||url.hostname;title=decode(title.replace(/<[^>]*>/g," ")).replace(/\s+/g," ").trim().slice(0,180);
  const text=decode(html.replace(/<!--[\s\S]*?-->/g," ").replace(/<(script|style|noscript|svg|nav|footer|header)[^>]*>[\s\S]*?<\/\1>/gi," ").replace(/<(br|\/p|\/div|\/article|\/section|\/h[1-6]|\/li|\/tr)[^>]*>/gi,"\n").replace(/<[^>]+>/g," ").replace(/\s+/g," ")).trim().slice(0,18000);
  if(text.length<80)return res.status(422).json({error:"Very little readable text was found on that page."});return res.status(200).json({title,url:url.href,text});
 }catch(e){return res.status(500).json({error:e.name==="TimeoutError"?"The webpage took too long to respond.":e.message||"Could not read that webpage."})}
};