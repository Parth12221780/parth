import { db } from "hatchable";
export const access="admin"; export const methods=["GET","POST"];
function esc(v){return String(v??"").replace(/'/g,"''");}
export default async function(req,res){
  if(req.method==="GET"){
    const {rows}=await db.query("SELECT setting_key,setting_value FROM site_settings WHERE setting_key IN ('whatsapp_number','telegram_link','favicon_url','background_data','youtube_links','seo_pages','integration_config')");
    const out={whatsapp_number:"",telegram_link:"",favicon_url:"",background_data:"",youtube_links:[],seo_pages:{},integration_config:{}};
    for(const r of rows){if(r.setting_key==="youtube_links"){try{out.youtube_links=JSON.parse(r.setting_value||"[]");}catch{out.youtube_links=[];}}else if(r.setting_key==="seo_pages"){try{out.seo_pages=JSON.parse(r.setting_value||"{}");}catch{out.seo_pages={};}}
    else if(r.setting_key==="integration_config"){try{out.integration_config=JSON.parse(r.setting_value||"{}");}catch{out.integration_config={};}}
    else out[r.setting_key]=r.setting_value||"";}
    return res.json(out);
  }
  const b=req.body||{},wa=String(b.whatsapp_number||"").trim(),tg=String(b.telegram_link||"").trim();
  const fav=String(b.favicon_data||b.favicon_url||"").trim(),bg=String(b.background_data||"").trim();
  if(fav && !/^data:image\/(png|x-icon|vnd.microsoft.icon|svg\+xml|jpeg|webp);base64,/i.test(fav) && !/^https?:\/\//i.test(fav)) return res.status(400).json({error:"Invalid favicon image."});
  if(fav.length>700000) return res.status(400).json({error:"Favicon file is too large. Keep it under about 500 KB."});
  if(bg && !/^data:image\/(png|x-icon|vnd.microsoft.icon|svg\+xml|jpeg|webp);base64,/i.test(bg) && !/^https?:\/\//i.test(bg)) return res.status(400).json({error:"Invalid background image."});
  if(bg.length>3000000) return res.status(400).json({error:"Background image is too large. Keep it under about 2 MB."});
  let yt=Array.isArray(b.youtube_links)?b.youtube_links.map(x=>String(x||"").trim()).filter(Boolean).slice(0,100):[];
  let seo=null; if(b.seo_pages&&typeof b.seo_pages==="object"&&!Array.isArray(b.seo_pages)) seo=b.seo_pages;
  let integration=null;
  if(b.integration_config&&typeof b.integration_config==="object"&&!Array.isArray(b.integration_config)){
    const allowed=['google_verification','ga4_measurement_id','gtm_container_id','google_ads_id','google_ads_label','adsense_publisher_id','meta_pixel_id','meta_domain_verification'];
    integration={}; for(const k of allowed) integration[k]=String(b.integration_config[k]||"").trim().slice(0,300);
  }
  const pairs=[["whatsapp_number",wa],["telegram_link",tg],["favicon_url",fav],["background_data",bg],["youtube_links",JSON.stringify(yt)]]; if(seo!==null)pairs.push(["seo_pages",JSON.stringify(seo)]); if(integration!==null)pairs.push(["integration_config",JSON.stringify(integration)]);
  for(const [k,v] of pairs)
    await db.query("INSERT INTO site_settings(setting_key,setting_value,updated_at) VALUES ('"+k+"','"+esc(v)+"',now()) ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value,updated_at=now()");
  res.json({ok:true,whatsapp_number:wa,telegram_link:tg,favicon_url:fav,background_data:bg,youtube_links:yt,seo_pages:seo});
}