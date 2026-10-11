export async function onRequestGet({request,env}){
  if(!env.PAYSTACK_SECRET_KEY)return Response.json({error:'Payment verification is not configured.'},{status:503});
  const reference=new URL(request.url).searchParams.get('reference');if(!reference||reference.length>200)return Response.json({error:'Missing or invalid payment reference.'},{status:400});
  const r=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${env.PAYSTACK_SECRET_KEY}`}});const result=await r.json().catch(()=>({}));
  if(!r.ok||!result.status)return Response.json({error:'Could not verify payment.'},{status:502});
  const d=result.data;return Response.json({status:d.status,reference:d.reference,amount:d.amount,currency:d.currency,paid_at:d.paid_at,customer_email:d.customer?.email,verified:d.status==='success'&&d.currency==='NGN'});
}
