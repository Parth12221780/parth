import { db } from "hatchable";
export const access="admin"; export const methods=["GET","POST"];

function esc(v){return String(v??"").replace(/'/g,"''");}

export default async function(req,res){
  if(req.method==="GET"){
    const {rows}=await db.query("SELECT setting_key,setting_value FROM site_settings WHERE setting_key IN ('whatsapp_number','telegram_link','favicon_url','youtube_links')");
    const out={whatsapp_number:"",telegram_link:"",favicon_url:"",youtube_links:[]};
    for(const r of rows){
      if(r.setting_key==="youtube_links"){try{out.youtube_links=JSON.parse(r.setting_value||"[]");}catch{out.youtube_links=[];}}
      else out[r.setting_key]=r.setting_value||"";
    }
    return res.json(out);
  }
  const b=req.body||{};
  const wa=String(b.whatsapp_number||"").trim();
  const tg=String(b.telegram_link||"").trim();
  const fav=String(b.favicon_url||"").trim();
  let yt=Array.isArray(b.youtube_links)?b.youtube_links.map(x=>String(x||"").trim()).filter(Boolean):[];
  yt=yt.slice(0,100);
  for(const [k,v] of [["whatsapp_number",wa],["telegram_link",tg],["favicon_url",fav],["youtube_links",JSON.stringify(yt)]])
    await db.query("INSERT INTO site_settings(setting_key,setting_value,updated_at) VALUES ('"+k+"','"+esc(v)+"',now()) ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value,updated_at=now()");
  res.json({ok:true,whatsapp_number:wa,telegram_link:tg,favicon_url:fav,youtube_links:yt});
}