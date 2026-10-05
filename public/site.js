(()=>{
async function initSiteSettings(){
 try{
  const r=await fetch('/api/settings');const s=await r.json();
  const fav=document.getElementById('siteFavicon');
  if(fav&&s.favicon_url)fav.href=s.favicon_url;
  if(s.background_data){document.body.style.backgroundImage='linear-gradient(rgba(7,12,18,.72),rgba(7,12,18,.78)),url("'+s.background_data+'")';document.body.style.backgroundAttachment='fixed';document.body.style.backgroundSize='cover';document.body.style.backgroundPosition='center center';document.body.style.backgroundRepeat='no-repeat';}
  document.querySelectorAll('.whatsapp-btn').forEach(a=>{
    const n=String(s.whatsapp_number||'').replace(/\\D/g,'');
    if(n)a.href='https://wa.me/'+(n.startsWith('91')?n:'91'+n);
  });
  document.querySelectorAll('.telegram-btn').forEach(a=>{if(s.telegram_link)a.href=s.telegram_link;});
  renderYoutubeCarousel(Array.isArray(s.youtube_links)?s.youtube_links:[]);
 }catch(e){}
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
 root.innerHTML='<div class="youtube-carousel-head"><div><p class="eyebrow">VIDEOS</p><h2>Latest Videos</h2></div><div class="youtube-carousel-nav"><button type="button" class="button ghost" id="ytPrev">←</button><button type="button" class="button ghost" id="ytNext">→</button></div></div><div class="youtube-carousel-track" id="ytTrack">'+ids.map((id,i)=>'<article class="youtube-card"><div class="youtube-frame"><iframe src="https://www.youtube.com/embed/'+id+'?rel=0" title="YouTube video '+(i+1)+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div class="youtube-card-label">Video '+(i+1)+'</div></article>').join('')+'</div>';
 const track=document.getElementById('ytTrack');
 document.getElementById('ytPrev').onclick=()=>track.scrollBy({left:-track.clientWidth*.85,behavior:'smooth'});
 document.getElementById('ytNext').onclick=()=>track.scrollBy({left:track.clientWidth*.85,behavior:'smooth'});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initSiteSettings);else initSiteSettings();
})();