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
 root.innerHTML='<div class="youtube-carousel-head"><div><p class="eyebrow">VIDEOS</p><h2>Latest Videos</h2></div><div class="youtube-carousel-nav"><button type="button" class="button ghost" id="ytPrev">←</button><button type="button" class="button ghost" id="ytNext">→</button></div></div><div class="youtube-carousel-track" id="ytTrack">'+ids.map((id,i)=>'<article class="youtube-card"><div class="youtube-frame"><button class="youtube-poster" type="button" data-video-id="'+id+'" aria-label="Play YouTube video '+(i+1)+'"><img src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt="YouTube video '+(i+1)+' thumbnail" loading="lazy"><span class="youtube-play">▶</span></button></div><div class="youtube-card-label"><span>Video '+(i+1)+'</span><a href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div></article>').join('')+'</div>';
 document.querySelectorAll('.youtube-poster').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.videoId;const frame=btn.parentElement;frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';}));
 const track=document.getElementById('ytTrack');
 document.getElementById('ytPrev').onclick=()=>track.scrollBy({left:-track.clientWidth*.85,behavior:'smooth'});
 document.getElementById('ytNext').onclick=()=>track.scrollBy({left:track.clientWidth*.85,behavior:'smooth'});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initSiteSettings);else initSiteSettings();
})();