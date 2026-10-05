(()=>{
async function initSiteSettings(){
 try{
  const r=await fetch('/api/settings');const s=await r.json();
  const fav=document.getElementById('siteFavicon');
  if(fav&&s.favicon_url)fav.href=s.favicon_url;
  if(s.background_data){
   const bgTarget=document.querySelector('main')||document.body;
   bgTarget.classList.add('has-site-background');
   bgTarget.style.setProperty('--site-background-image','url("'+s.background_data+'")');
 }
  document.querySelectorAll('.whatsapp-btn').forEach(a=>{
    const n=String(s.whatsapp_number||'').replace(/\\D/g,'');
    if(n)a.href='https://wa.me/'+(n.startsWith('91')?n:'91'+n);
  });
  document.querySelectorAll('.telegram-btn').forEach(a=>{if(s.telegram_link)a.href=s.telegram_link;});
  applyPageSeo(s.seo_pages||{});
  applyMarketingIntegrations(s.integration_config||{});
  renderYoutubeCarousel(Array.isArray(s.youtube_links)?s.youtube_links:[]);
 }catch(e){}
}
function addMeta(name,content,attr="name"){
 if(!content)return;
 let el=document.head.querySelector('meta['+attr+'="'+name+'"]');
 if(!el){el=document.createElement('meta');el.setAttribute(attr,name);document.head.appendChild(el);}
 el.setAttribute('content',content);
}
function addExternalScript(id,src,attrs={}){
 if(document.getElementById(id))return;
 const s=document.createElement('script');s.id=id;s.src=src;s.async=true;
 Object.entries(attrs).forEach(([k,v])=>s.setAttribute(k,v));
 document.head.appendChild(s);
}
function applyMarketingIntegrations(c){
 const x=c||{};
 if(x.google_verification)addMeta("google-site-verification",x.google_verification);
 if(x.meta_domain_verification)addMeta("facebook-domain-verification",x.meta_domain_verification);
 const ga=x.ga4_measurement_id;
 const ads=x.google_ads_id;
 if(ga||ads){
  if(!window.dataLayer)window.dataLayer=[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  addExternalScript("googleGtag","https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ga||ads));
  window.gtag("js",new Date());
  if(ga)window.gtag("config",ga);
  if(ads)window.gtag("config",ads);
 }
 if(x.gtm_container_id){
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({"gtm.start":new Date().getTime(),event:"gtm.js"});
  addExternalScript("googleTagManager","https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(x.gtm_container_id));
 }
 if(x.adsense_publisher_id){
  addExternalScript("googleAdSense","https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(x.adsense_publisher_id),{"crossorigin":"anonymous"});
 }
 if(x.meta_pixel_id){
  if(!window.fbq){
   const n=window.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);};
   n.push=n;n.loaded=true;n.version="2.0";n.queue=[];window._fbq=n;
  }
  addExternalScript("metaPixel","https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init",x.meta_pixel_id);
  window.fbq("track","PageView");
 }
}
function applyPageSeo(seoPages){
 const key=location.pathname==="/"?"/":(location.pathname.endsWith("/")?location.pathname:location.pathname);
 const x=seoPages&&seoPages[key]; if(!x)return;
 const setMeta=(name,content,attr="name")=>{
  if(!content)return;
  let el=document.head.querySelector('meta['+attr+'="'+name+'"]');
  if(!el){el=document.createElement('meta');el.setAttribute(attr,name);document.head.appendChild(el);}
  el.setAttribute('content',content);
 };
 if(x.title)document.title=x.title;
 setMeta("description",x.description);
 setMeta("robots",x.robots||"index,follow");
 setMeta("keywords",x.keywords);
 setMeta("og:title",x.og_title||x.title,"property");
 setMeta("og:description",x.og_description||x.description,"property");
 setMeta("og:image",x.og_image,"property");
 setMeta("og:url",x.canonical||location.href,"property");
 setMeta("og:type","website","property");
 if(x.canonical){
  let link=document.head.querySelector('link[rel="canonical"]');
  if(!link){link=document.createElement('link');link.rel="canonical";document.head.appendChild(link);}
  link.href=x.canonical;
 }
 if(x.schema_json){
  try{
   const data=JSON.parse(x.schema_json);
   let script=document.getElementById("adminSeoSchema");
   if(!script){script=document.createElement("script");script.id="adminSeoSchema";script.type="application/ld+json";document.head.appendChild(script);}
   script.textContent=JSON.stringify(data);
  }catch(e){}
 }
}
function youtubeId(url){
 try{
  const u=new URL(url);
  if(u.hostname.includes('youtu.be'))return u.pathname.slice(1).split('/')[0];
  if(u.hostname.includes('youtube.com')){
   if(u.pathname==='/watch')return u.searchParams.get('v');
   if(u.pathname.startsWith('/shorts/'))return u.pathname.split('/')[2];
   if(u.pathname.startsWith('/embed/'))return u.pathname.split('/')[2];
  }
 }catch(e){}
 return null;
}
function renderYoutubeCarousel(links){
 const root=document.getElementById('youtubeCarousel');
 if(!root||!links.length)return;
 const ids=links.map(youtubeId).filter(Boolean);
 if(!ids.length)return;
 root.innerHTML='<div class="youtube-carousel-head"><div><p class="eyebrow">VIDEOS</p><h2>Latest Videos</h2></div><div class="youtube-carousel-nav"><button type="button" class="button ghost" id="ytPrev">←</button><button type="button" class="button ghost" id="ytNext">→</button></div></div><div class="youtube-carousel-track" id="ytTrack">'+ids.map((id,i)=>'<article class="youtube-card"><div class="youtube-frame"><button class="youtube-poster" type="button" data-video-id="'+id+'" aria-label="Play YouTube video '+(i+1)+'"><img src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt="YouTube video '+(i+1)+' thumbnail" loading="lazy"><span class="youtube-play">▶</span></button></div><div class="youtube-card-label"><span>Video '+(i+1)+'</span><a href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div></article>').join('')+'</div>';
 document.querySelectorAll('.youtube-poster').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.videoId;const frame=btn.parentElement;frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';}));
 const track=document.getElementById('ytTrack');
 document.getElementById('ytPrev').onclick=()=>track.scrollBy({left:-track.clientWidth*.85,behavior:'smooth'});
 document.getElementById('ytNext').onclick=()=>track.scrollBy({left:track.clientWidth*.85,behavior:'smooth'});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initSiteSettings);else initSiteSettings();
})();