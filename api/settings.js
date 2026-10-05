import { db } from "hatchable";
export const access="public"; export const methods=["GET"];
export default async function(req,res){
  const {rows}=await db.query("SELECT setting_key,setting_value FROM site_settings WHERE setting_key IN ('whatsapp_number','telegram_link','favicon_url','background_data','youtube_links')");
  const out={whatsapp_number:"",telegram_link:"",favicon_url:"",background_data:"",youtube_links:[]};
  for(const r of rows){
    if(r.setting_key==="youtube_links"){try{out.youtube_links=JSON.parse(r.setting_value||"[]");}catch{out.youtube_links=[];}}
    else out[r.setting_key]=r.setting_value||"";
  }
  res.json(out);
}