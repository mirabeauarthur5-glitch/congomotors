(function(){
  var CM=window.CM, id=new URLSearchParams(location.search).get("id"), v=CM.store.get(id), root=document.getElementById("vd");
  if(!v){document.title="Véhicule introuvable — CongoMotors";root.innerHTML='<div style="padding:180px 0 120px"><h1 style="font-size:clamp(34px,6vw,80px)">Véhicule introuvable</h1><p style="color:var(--muted);margin:18px 0 28px">Cette fiche n\'existe pas ou a été retirée du catalogue.</p><a class="btn solid" href="showroom.html">Retour au showroom</a></div>';return}
  document.title=CM.vName(v)+" — CongoMotors";
  var imgs=(v.images||[]).map(function(i){return typeof i==="string"?i:i.src});
  var rows=[["Marque",v.brand],["Modèle",v.model],["Catégorie",v.category],["Année",CM.fmt(v,"year")],["Prix",CM.fmt(v,"price")],["Kilométrage",CM.fmt(v,"mileage")],["Carburant",v.fuel],["Boîte",v.transmission],["Disponibilité",CM.statusLabel(v)]];
  var msg="Bonjour CongoMotors, je souhaite des informations sur : "+CM.vName(v)+(v.year?" ("+v.year+")":"")+". Merci de me confirmer la disponibilité, le prix et l'état du véhicule.";
  var labels=["Avant","Côté","Arrière","Intérieur"];
  var thumbs="";for(var i=0;i<4;i++){thumbs+=imgs[i]?'<button type="button" data-i="'+i+'" aria-label="Photo '+(i+1)+'" aria-current="'+(i===0)+'"><img src="'+CM.esc(imgs[i])+'" alt="" loading="lazy" width="200" height="150"></button>':'<button type="button" class="slot" disabled aria-label="'+labels[i]+' : photo à fournir">'+labels[i]+'<br>à fournir</button>'}
  var others=CM.store.all().filter(function(x){return x.id!==v.id&&(x.brand===v.brand||x.category===v.category)}).slice(0,3);
  root.innerHTML='<div class="vd"><div><div class="gal-main" id="gm" data-id="'+CM.esc(v.id)+'">'+CM.media(v,0,true)+'</div><div class="thumbs" id="th">'+thumbs+'</div></div>'+
   '<div><p class="crumbs"><a href="showroom.html">Showroom</a> / '+CM.esc(v.brand)+'</p><h1>'+CM.esc(CM.vName(v))+'</h1>'+
   (v.example!==false?'<div class="notice"><strong>Exemple de catalogue.</strong> Ce véhicule n\'est pas présenté comme disponible chez CongoMotors. Disponibilité, prix et caractéristiques à confirmer.</div>':'')+
   '<table class="spec"><tbody>'+rows.map(function(r){return '<tr><th scope="row">'+r[0]+'</th><td'+(r[1]?'':' class="tbc"')+'>'+CM.esc(r[1]||"À confirmer")+'</td></tr>'}).join("")+'</tbody></table>'+
   '<div class="actions"><a class="btn solid wa" id="waBtn" target="_blank" rel="noopener" href="'+CM.waLink(msg)+'">'+CM.WA+'Demander sur WhatsApp</a><a class="btn" href="recherche.html">Recherche personnalisée</a></div></div></div>'+
   (others.length?'<section style="padding-bottom:100px"><div class="sec-head"><h2 style="font-size:clamp(28px,4vw,52px)">Dans le même esprit</h2></div><div class="grid">'+others.map(CM.card).join("")+'</div></section>':"");
  document.getElementById("waBtn").addEventListener("click",function(){CM.store.logRequest({type:"Véhicule",summary:CM.vName(v),message:msg})});
  var gm=document.getElementById("gm");
  document.getElementById("th").addEventListener("click",function(e){var b=e.target.closest("button[data-i]");if(!b)return;
    this.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-current",x===b)});
    var n=+b.dataset.i;if(window.gsap&&!CM.reduce){gsap.to(gm,{opacity:0,duration:.15,onComplete:function(){gm.innerHTML=CM.media(v,n,true);gsap.to(gm,{opacity:1,duration:.35})}})}else gm.innerHTML=CM.media(v,n,true)});
  if(window.gsap&&!CM.reduce){gsap.from(".vd h1",{y:30,opacity:0,duration:.8,ease:"power3.out"});gsap.from(".gal-main",{clipPath:"inset(0 0 100% 0)",duration:1,ease:"power3.out",clearProps:"clipPath"})}
})();
