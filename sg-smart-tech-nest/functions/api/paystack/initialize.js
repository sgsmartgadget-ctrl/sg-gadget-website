const CATALOG={
  'earbuds-2in1':25000,'winwolf-earphones':7000,'p9-headset':8000,'powerpulse':20000,
  'philly-50k':35000,'infinix-smart-20':203000,'phone-stand':8000,'smart-glasses':15000,
  'eco-flow':265000,'speaker':11000,'tititall-50k':45000
};
export async function onRequestPost({request,env}){
  if(!env.PAYSTACK_SECRET_KEY)return Response.json({error:'Online payments are not configured yet. Please use WhatsApp checkout.'},{status:503});
  let body;try{body=await request.json()}catch{return Response.json({error:'Invalid request.'},{status:400})}
  const customer=body.customer||{},items=body.items||[];
  if(!customer.name||!customer.phone||!customer.email||!customer.address||!['Nigeria','Ghana'].includes(customer.country))return Response.json({error:'Please complete all checkout details.'},{status:400});
  if(!Array.isArray(items)||!items.length||items.length>30)return Response.json({error:'Your cart is empty or invalid.'},{status:400});
  let total=0;const cleanItems=[];
  for(const item of items){const price=CATALOG[item.id],qty=Number(item.quantity);if(!price||!Number.isInteger(qty)||qty<1||qty>20)return Response.json({error:'One or more cart items are invalid. Refresh and try again.'},{status:400});total+=price*qty;cleanItems.push({id:item.id,quantity:qty,unit_price:price});}
  if(total<100||total>100000000)return Response.json({error:'Order total is outside the supported range.'},{status:400});
  const origin=new URL(request.url).origin;
  const payload={email:String(customer.email).trim(),amount:String(total*100),currency:'NGN',callback_url:origin+'/payment-callback.html',metadata:{custom_fields:[{display_name:'Customer name',variable_name:'customer_name',value:String(customer.name).slice(0,100)},{display_name:'Phone',variable_name:'phone',value:String(customer.phone).slice(0,30)},{display_name:'Country',variable_name:'country',value:customer.country}],customer_name:String(customer.name).slice(0,100),phone:String(customer.phone).slice(0,30),delivery_address:String(customer.address).slice(0,500),country:customer.country,items:cleanItems}};
  const r=await fetch('https://api.paystack.co/transaction/initialize',{method:'POST',headers:{Authorization:`Bearer ${env.PAYSTACK_SECRET_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const result=await r.json().catch(()=>({}));if(!r.ok||!result.status||!result.data?.authorization_url)return Response.json({error:result.message||'Could not initialize payment. Please try again.'},{status:502});
  return Response.json({authorization_url:result.data.authorization_url,reference:result.data.reference});
}
