/* CongoMotors — éléments communs : en-tête, pied de page, menu, WhatsApp, cartes, révélations */
(function(){
  var CM=window.CM, cfg=CM.store.cfg;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");
  CM.reduce=reduce;
  CM.esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
  CM.waLink=function(text){return "https://wa.me/"+cfg.wa+"?text="+encodeURIComponent(text)};
  var WA='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2A9.9 9.9 0 0 0 3.6 17l-1.6 5 5.1-1.6A9.9 9.9 0 1 0 12.04 2zm5.8 14c-.25.7-1.4 1.3-1.9 1.35-.5.05-1 .25-3.3-.7-2.8-1.15-4.6-4-4.75-4.2-.13-.2-1.1-1.5-1.1-2.8s.7-1.95.95-2.2c.25-.27.53-.33.7-.33h.5c.17 0 .38-.07.6.45l.8 2c.07.15.1.3 0 .5-.1.2-.15.3-.3.47l-.43.5c-.14.15-.3.3-.13.6.17.3.75 1.25 1.6 2 1.1.97 2 1.27 2.3 1.4.3.15.47.12.65-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15l2 1c.28.13.46.2.53.3.07.1.07.65-.18 1.35z"/></svg>';
  CM.WA=WA;
  var NAV=[["index.html","Accueil"],["showroom.html","Showroom"],["location.html","Location"],["recherche.html","Recherche sur mesure"],["a-propos.html","À propos"],["contact.html","Contact"]];
  var page=(location.pathname.split("/").pop()||"index.html");
  if(page==="vehicule.html") page="showroom.html";
  var home=page==="index.html";

  function header(){
    var el=document.getElementById("hdr"); if(!el) return;
    var links=NAV.map(function(n){return '<a href="'+n[0]+'"'+(n[0]===page?' aria-current="page"':'')+'>'+n[1]+'</a>'}).join("");
    var dl=NAV.map(function(n,i){return '<a class="dl" href="'+n[0]+'"><small>0'+(i+1)+'</small>'+n[1]+'</a>'}).join("");
    el.className="hdr"+(home?"":" solid");
    el.innerHTML='<div class="wrap hdr-in"><a class="brand" href="index.html" aria-label="CongoMotors — accueil"><img src="assets/congomotors-logo-reference.jpg" width="52" height="52" alt="Logo CongoMotors"><span>CongoMotors</span></a>'+
      '<nav class="nav" aria-label="Navigation principale">'+links+'</nav>'+
      '<div class="hdr-cta"><a class="btn sm wa" target="_blank" rel="noopener" href="'+CM.waLink("Bonjour CongoMotors, je souhaite des informations.")+'">'+WA+'WhatsApp</a>'+
      '<button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="drawer"><i></i><i></i></button></div></div>'+
      '<div class="drawer" id="drawer" role="dialog" aria-label="Menu">'+dl+'<div class="drawer-foot">'+cfg.phone+' · '+cfg.cities.join(" · ")+'</div></div>';
    var b=el.querySelector(".burger");
    function set(o){document.body.classList.toggle("menu-open",o);b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Fermer le menu":"Ouvrir le menu")}
    b.addEventListener("click",function(){set(!document.body.classList.contains("menu-open"))});
    el.querySelectorAll(".drawer a").forEach(function(a){a.addEventListener("click",function(){set(false)})});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false)});
    if(home){var on=function(){el.classList.toggle("solid",window.scrollY>60)};on();window.addEventListener("scroll",on,{passive:true})}
  }
  function footer(){
    var el=document.getElementById("ftr"); if(!el) return;
    el.className="ftr";
    el.innerHTML='<div class="wrap"><div class="ftr-grid"><div><a class="brand" href="index.html"><img src="assets/congomotors-logo-reference.jpg" width="64" height="64" alt="Logo CongoMotors"></a><p class="small">Vente de véhicules, location automobile et recherche personnalisée. Pointe-Noire &amp; Brazzaville, République du Congo.</p></div>'+
      '<div><h4>Showroom</h4><ul><li><a href="showroom.html">Catalogue</a></li><li><a href="location.html">Location</a></li><li><a href="recherche.html">Recherche sur mesure</a></li></ul></div>'+
      '<div><h4>Maison</h4><ul><li><a href="a-propos.html">À propos</a></li><li><a href="contact.html">Contact</a></li><li><a href="admin.html">Administration (démo)</a></li></ul></div>'+
      '<div><h4>Contact</h4><ul><li><a href="tel:+242067933469">'+cfg.phone+'</a></li><li><a target="_blank" rel="noopener" href="'+CM.waLink("Bonjour CongoMotors,")+'">WhatsApp</a></li><li><a target="_blank" rel="noopener" href="'+cfg.tiktok+'">TikTok</a></li><li>'+cfg.cities.join(" · ")+'</li></ul></div></div>'+
      '<div class="legal"><span>© '+new Date().getFullYear()+' CongoMotors</span><span>Les véhicules du catalogue sont des exemples : prix, disponibilité et caractéristiques à confirmer.</span></div></div>';
    var f=document.createElement("a");f.className="wa-float";f.target="_blank";f.rel="noopener";f.setAttribute("aria-label","Écrire sur WhatsApp");f.href=CM.waLink("Bonjour CongoMotors, je souhaite des informations.");f.innerHTML=WA;document.body.appendChild(f);
  }

  /* Image / placeholder */
  CM.vName=function(v){return v.brand+" "+v.model};
  CM.media=function(v,i,big){
    var src=v.images&&v.images[i||0];
    if(src){var s=typeof src==="string"?src:src.src;
      return '<img src="'+CM.esc(s)+'" alt="'+CM.esc(CM.vName(v))+'" loading="lazy" decoding="async" width="800" height="600" onerror="CM.imgFail(this)">'}
    return CM.ph(v,big);
  };
  CM.ph=function(v,big){return '<div class="ph'+(big?' big':'')+'" role="img" aria-label="Photo de '+CM.esc(CM.vName(v))+' à fournir"><small>Photo à fournir</small><b>'+CM.esc(v.brand)+'<br>'+CM.esc(v.model)+'</b><small>Aucune image de remplacement trompeuse</small></div>'};
  CM.imgFail=function(img){var p=img.parentNode;var v=CM.store.get(p.dataset&&p.dataset.id)||{brand:"",model:""};img.outerHTML=CM.ph(v)};
  CM.fmt=function(v,k){var x=v[k]; if(x==null||x==="") return null; if(k==="price") return Number(x).toLocaleString("fr-FR")+" FCFA"; if(k==="mileage") return Number(x).toLocaleString("fr-FR")+" km"; return x};
  CM.statusLabel=function(v){return v.status==="available"?"Disponible":v.status==="reserved"?"Réservé":v.status==="sold"?"Vendu":"Disponibilité à confirmer"};

  CM.card=function(v){
    var price=CM.fmt(v,"price"),year=CM.fmt(v,"year");
    var msg="Bonjour CongoMotors, je souhaite des informations sur : "+CM.vName(v)+(v.year?" ("+v.year+")":"")+". Merci de me confirmer la disponibilité et le prix.";
    return '<article class="vcard" data-id="'+CM.esc(v.id)+'"><div class="vmedia" data-id="'+CM.esc(v.id)+'">'+CM.media(v)+
      '<div class="vbadges">'+(v.example!==false?'<span class="badge gold">Exemple de catalogue</span>':'')+'<span class="badge">'+CM.statusLabel(v)+'</span></div></div>'+
      '<div class="vinfo"><span class="brand-l">'+CM.esc(v.brand)+'</span><h3><a class="vlink" href="vehicule.html?id='+encodeURIComponent(v.id)+'" aria-label="Voir la fiche '+CM.esc(CM.vName(v))+'"></a>'+CM.esc(v.model)+'</h3>'+
      '<div class="vmeta"><span>'+CM.esc(v.category)+'</span><span>Année : <b>'+(year||"À confirmer")+'</b></span><span>Prix : <b>'+(price||"À confirmer")+'</b></span></div>'+
      '<div class="vfoot"><a class="btn sm" href="vehicule.html?id='+encodeURIComponent(v.id)+'">Fiche</a><a class="btn sm solid wa" target="_blank" rel="noopener" data-wa-vehicle="'+CM.esc(v.id)+'" href="'+CM.waLink(msg)+'">'+CM.WA+'WhatsApp</a></div></div></article>';
  };
  /* journalise les ouvertures WhatsApp depuis une fiche véhicule (demande préparée, pas envoyée) */
  document.addEventListener("click",function(e){var a=e.target.closest("[data-wa-vehicle]");if(!a)return;var v=CM.store.get(a.dataset.waVehicle);if(v)CM.store.logRequest({type:"Véhicule",summary:CM.vName(v),message:decodeURIComponent(a.href.split("text=")[1]||"")})});

  /* Révélations */
  CM.reveal=function(root){
    var els=(root||document).querySelectorAll("[data-img-reveal]:not(.in),[data-rv]:not(.in)");
    if(reduce||!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("in")});return}
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{rootMargin:"0px 0px -8% 0px",threshold:.08});
    els.forEach(function(e){io.observe(e)});
  };
  CM.toWhatsApp=function(summary,type,text){CM.store.logRequest({type:type,summary:summary,message:text});window.open(CM.waLink(text),"_blank","noopener")};

  header();footer();
  document.addEventListener("DOMContentLoaded",function(){CM.reveal()});
  if(document.readyState!=="loading")CM.reveal();
})();
