// Lightweight public encyclopedia search tool for NEXUS. No API key required.
module.exports=async function(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed."});
 try{
  const q=typeof req.body?.query==="string"?req.body.query.trim().slice(0,240):"";
  if(q.length<2)return res.status(400).json({error:"Enter a longer search query."});
  const api=new URL("https://en.wikipedia.org/w/api.php");
  api.search=new URLSearchParams({action:"query",generator:"search",gsrsearch:q,gsrlimit:"5",gsrnamespace:"0",prop:"extracts",exintro:"1",explaintext:"1",exchars:"900",format:"json"}).toString();
  const r=await fetch(api,{headers:{"User-Agent":"NEXUS-AI/1.4 (public search tool)"},signal:AbortSignal.timeout(10000)});
  if(!r.ok)return res.status(502).json({error:"The search service is temporarily unavailable."});
  const data=await r.json();
  const pages=Object.values(data.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));
  const results=pages.map(p=>({title:p.title,extract:(p.extract||"").slice(0,900),url:"https://en.wikipedia.org/?curid="+p.pageid}));
  return res.status(200).json({provider:"Wikipedia",results});
 }catch(e){return res.status(500).json({error:e.name==="TimeoutError"?"Search timed out. Try again.":"Could not complete the search."})}
};
