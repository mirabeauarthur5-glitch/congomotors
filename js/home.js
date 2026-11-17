(function(){
  var CM=window.CM;
  var pick=["toyota-land-cruiser-300","mercedes-benz-classe-g","land-rover-range-rover","nissan-patrol","toyota-land-cruiser-prado","toyota-hilux","bmw-x5","lexus-lx-600"];
  var all=CM.store.all(), list=pick.map(function(id){return all.find(function(v){return v.id===id})}).filter(Boolean);
  if(list.length<8) list=all.slice(0,8);
  document.getElementById("featured").innerHTML=list.map(CM.card).join("");
  document.getElementById("homeWa").href=CM.waLink("Bonjour CongoMotors, je souhaite des informations.");
  document.getElementById("homeWa").innerHTML=CM.WA+"WhatsApp";

  /* Vidéo 360° : lecture muette, contrôle, repli élégant */
  var hero=document.getElementById("hero"), vid=document.getElementById("heroVideo"), tog=document.getElementById("heroToggle");
  function fallback(){hero.classList.add("no-video");tog.hidden=true}
  var srcs=vid.querySelectorAll("source"), failed=0;
  srcs.forEach(function(s){s.addEventListener("error",function(){if(++failed>=srcs.length)fallback()})});
  vid.addEventListener("error",fallback);
  vid.addEventListener("loadeddata",function(){tog.hidden=false;
    if(!CM.reduce){var p=vid.play();if(p&&p.catch)p.catch(function(){tog.textContent="Lecture";tog.setAttribute("aria-label","Lancer la vidéo")})}
    else{tog.textContent="Lecture";tog.setAttribute("aria-label","Lancer la vidéo")}});
  setTimeout(function(){if(vid.readyState===0&&vid.networkState===3)fallback()},1200);
  tog.addEventListener("click",function(){if(vid.paused){vid.play();tog.textContent="Pause";tog.setAttribute("aria-label","Mettre la vidéo en pause")}else{vid.pause();tog.textContent="Lecture";tog.setAttribute("aria-label","Lancer la vidéo")}});
  document.addEventListener("visibilitychange",function(){if(document.hidden&&!vid.paused&&hero.classList.contains("no-video")===false){/* économie batterie */}});

  /* Motion */
  if(!window.gsap||CM.reduce){CM.reveal();return}
  gsap.registerPlugin(ScrollTrigger);
  var tl=gsap.timeline({defaults:{ease:"power4.out"}});
  tl.from(".hero h1 .ln>span",{yPercent:110,duration:1.1,stagger:.12})
    .from("[data-hero]",{y:16,opacity:0,duration:.8,stagger:.1},"-=.6")
    .from(".hero-fallback img",{scale:.9,opacity:0,duration:1.2},0);
  /* parallax discret du plateau de repli + fondu du hero */
  gsap.to(".hero-fallback .stage",{yPercent:-6,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
  gsap.to(".hero-body",{yPercent:-12,opacity:.2,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom 30%",scrub:true}});
  /* masques typographiques des titres de section */
  gsap.utils.toArray(".sec .mask>span").forEach(function(el){
    gsap.from(el,{yPercent:110,duration:1,ease:"power4.out",scrollTrigger:{trigger:el,start:"top 90%",once:true}})});
  /* services : entrée latérale décalée */
  gsap.from(".svc",{x:40,opacity:0,duration:.9,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:".services",start:"top 80%",once:true}});
  /* cartes : apparition en clip */
  ScrollTrigger.batch("#featured .vcard",{start:"top 92%",once:true,onEnter:function(b){gsap.fromTo(b,{clipPath:"inset(0 0 100% 0)",opacity:1},{clipPath:"inset(0 0 0% 0)",duration:.9,stagger:.08,ease:"power3.out",clearProps:"clipPath"})}});
  CM.reveal();
  /* hero sans vidéo ni JS ne doit rester masqué */
})();
