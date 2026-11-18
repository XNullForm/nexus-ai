// Open-weight model gateway. Store HF_TOKEN only in server environment variables.
const MODEL="Qwen/Qwen2.5-7B-Instruct-1M:featherless";
module.exports=async function(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed."});
 const token=process.env.HF_TOKEN;if(!token)return res.status(503).json({error:"NEXUS model service is not configured. Add HF_TOKEN in Vercel Environment Variables, then redeploy."});
 try{
  const body=req.body||{};if(!Array.isArray(body.messages)||!body.messages.length||body.messages.length>32)return res.status(400).json({error:"Send a valid conversation (up to 32 messages)."});
  const messages=body.messages.map(m=>{if(!m||!["user","assistant"].includes(m.role)||typeof m.content!=="string")throw Error("Invalid message format.");return{role:m.role,content:m.content.slice(0,10000)}});
  const upstream=await fetch("https://router.huggingface.co/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,messages:[{role:"system",content:"You are NEXUS, a capable, thoughtful AI assistant. Be accurate, clear, friendly, and age-appropriate. Never claim to have browsed or used tools unless that happened. If uncertain, say so."},...messages],temperature:.65,max_tokens:1200})});
  const data=await upstream.json().catch(()=>({}));if(!upstream.ok){const msg=data.error?.message||data.error||"Open-model inference failed.";return res.status(upstream.status>=400&&upstream.status<600?upstream.status:502).json({error:String(msg).slice(0,500)})}
  const reply=data.choices?.[0]?.message?.content;if(typeof reply!=="string"||!reply.trim())return res.status(502).json({error:"The model returned an empty response. Try again shortly."});
  return res.status(200).json({reply,model:MODEL,provider:"Hugging Face Inference Providers"});
 }catch(error){return res.status(500).json({error:error.message||"Unexpected model server error."})}
};