// NEXUS server-side model gateway. Never expose HF_TOKEN in frontend code.
const MODEL="Qwen/Qwen3.5-9B";
module.exports=async function(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed."});
 const token=process.env.HF_TOKEN;
 if(!token)return res.status(503).json({error:"HF_TOKEN is missing. Add it in Vercel → Project Settings → Environment Variables, then redeploy."});
 try{
  const body=req.body||{};
  if(!Array.isArray(body.messages)||!body.messages.length||body.messages.length>32)return res.status(400).json({error:"Send a valid conversation (up to 32 messages)."});
  const messages=body.messages.map(m=>{
   if(!m||!["user","assistant"].includes(m.role)||typeof m.content!=="string")throw new Error("Invalid message format.");
   return{role:m.role,content:m.content.slice(0,10000)};
  });
  const upstream=await fetch("https://router.huggingface.co/v1/chat/completions",{
   method:"POST",
   headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
   body:JSON.stringify({
    model:MODEL,
    messages:[{role:"system",content:"You are NEXUS, a capable, thoughtful AI assistant. Be accurate, clear, friendly, and age-appropriate. Never claim to have browsed or used tools unless that happened. If uncertain, say so."},...messages],
    temperature:.65,
    max_tokens:1200
   })
  });
  const data=await upstream.json().catch(()=>({}));
  if(!upstream.ok){
   const detail=data.error?.message||data.error||data.message||"Hugging Face inference failed.";
   let msg=String(detail);
   if(upstream.status===401||upstream.status===403)msg="Hugging Face rejected the token. Create a fine-grained token with “Make calls to Inference Providers” permission and update HF_TOKEN in Vercel.";
   else if(/provider|not supported|model/i.test(msg))msg+=" Check the model's available providers and that Inference Providers are enabled for your Hugging Face account.";
   return res.status(upstream.status>=400&&upstream.status<600?upstream.status:502).json({error:msg.slice(0,600)});
  }
  const reply=data.choices?.[0]?.message?.content;
  if(typeof reply!=="string"||!reply.trim())return res.status(502).json({error:"The model returned an empty response. Try again shortly."});
  return res.status(200).json({reply,model:MODEL,provider:"Hugging Face Inference Providers (automatic routing)"});
 }catch(error){
  return res.status(500).json({error:error.message||"Unexpected model server error."});
 }
};
