/* CongoMotors — administration (DÉMO : stockage local du navigateur, aucune authentification) */
(function(){
  var CM=window.CM, S=CM.store, $=function(i){return document.getElementById(i)};
  var dlg=$("dlg"), form=$("vform"), editing=null, imgs=[];

  function slug(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
  function num(v){return v===""||v==null?null:Number(v)}

  /* Onglets */
  document.querySelectorAll(".tabs button").forEach(function(b){b.addEventListener("click",function(){
    document.querySelectorAll(".tabs button").forEach(function(x){x.setAttribute("aria-selected",x===b)});
    $("tab-veh").hidden=b.dataset.tab!=="veh";$("tab-req").hidden=b.dataset.tab!=="req";
    if(b.dataset.tab==="req")renderReq()})});

  /* Liste véhicules */
  function renderList(){
    var t=$("aq").value.trim().toLowerCase();
    var list=S.all().filter(function(v){return!t||CM.vName(v).toLowerCase().indexOf(t)>=0||v.category.toLowerCase().indexOf(t)>=0});
    $("vrows").innerHTML=list.map(function(v){
      return '<tr><td><strong>'+CM.esc(CM.vName(v))+'</strong>'+(v.example!==false?'<br><small style="color:var(--muted)">Exemple de catalogue</small>':'')+'</td><td>'+CM.esc(v.category)+'</td><td>'+(CM.fmt(v,"year")||"À confirmer")+'</td><td>'+(CM.fmt(v,"price")||"À confirmer")+'</td><td>'+CM.statusLabel(v)+'</td><td>'+((v.images||[]).length)+'</td>'+
      '<td class="act"><button type="button" data-e="'+CM.esc(v.id)+'">Modifier</button><button type="button" class="del" data-d="'+CM.esc(v.id)+'">Supprimer</button></td></tr>'}).join("")||'<tr><td colspan="7">Aucun véhicule.</td></tr>';
    $("cats").innerHTML=Array.from(new Set(S.all().map(function(v){return v.category}))).sort().map(function(c){return '<option value="'+CM.esc(c)+'">'}).join("");
  }
  $("aq").addEventListener("input",renderList);
  $("vrows").addEventListener("click",function(e){
    var b=e.target.closest("button");if(!b)return;
    if(b.dataset.e)open(S.get(b.dataset.e));
    if(b.dataset.d){var v=S.get(b.dataset.d);if(v&&confirm("Supprimer « "+CM.vName(v)+" » du catalogue (ce navigateur) ?")){S.remove(v.id);renderList()}}
  });

  /* Formulaire */
  function renderImgs(){
    $("imgsEdit").innerHTML=imgs.map(function(s,i){return '<div class="im"><img src="'+CM.esc(s)+'" alt="Photo '+(i+1)+'"><button type="button" data-r="'+i+'" aria-label="Retirer la photo '+(i+1)+'">×</button></div>'}).join("")||'<small style="color:var(--muted)">Aucune photo : l\'état « Photo à fournir » sera affiché.</small>'}
  $("imgsEdit").addEventListener("click",function(e){var b=e.target.closest("[data-r]");if(!b)return;imgs.splice(+b.dataset.r,1);renderImgs()});
  function open(v){
    editing=v||null;form.reset();
    $("dtitle").textContent=v?"Modifier "+CM.vName(v):"Ajouter un véhicule";
    var d=v||{status:"to_confirm",example:true,rental:false,images:[]};
    $("f_brand").value=d.brand||"";$("f_model").value=d.model||"";$("f_cat").value=d.category||"";$("f_status").value=d.status||"to_confirm";
    $("f_year").value=d.year||"";$("f_price").value=d.price||"";$("f_km").value=d.mileage||"";$("f_fuel").value=d.fuel||"";$("f_gear").value=d.transmission||"";
    $("f_flags").value=d.rental?"rent":"sale";$("f_ex").value=d.example===false?"0":"1";
    imgs=(d.images||[]).map(function(i){return typeof i==="string"?i:i.src});renderImgs();
    if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","")}
  $("addV").addEventListener("click",function(){open(null)});

  /* Photos : redimensionnées (≤1400 px) et converties en WebP pour limiter le stockage */
  $("f_files").addEventListener("change",function(){
    Array.from(this.files).forEach(function(f){
      var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){
        var k=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
        c.getContext("2d").drawImage(im,0,0,c.width,c.height);imgs.push(c.toDataURL("image/webp",.82));renderImgs()};im.src=r.result};r.readAsDataURL(f)});
    this.value=""});

  form.addEventListener("submit",function(e){
    var sub=e.submitter;if(!sub||sub.value!=="save")return;
    e.preventDefault();
    if(!form.reportValidity())return;
    var v={id:editing?editing.id:"",brand:$("f_brand").value.trim(),model:$("f_model").value.trim(),category:$("f_cat").value.trim(),
      year:num($("f_year").value),price:num($("f_price").value),mileage:num($("f_km").value),fuel:$("f_fuel").value.trim()||null,transmission:$("f_gear").value.trim()||null,
      status:$("f_status").value,example:$("f_ex").value==="1",rental:$("f_flags").value==="rent",images:imgs.slice()};
    if(!v.id){var base=slug(v.brand+" "+v.model),id=base,n=2;while(S.get(id))id=base+"-"+n++;v.id=id}
    if(!S.upsert(v)){alert("Enregistrement impossible (stockage local plein). Retirez des photos ou exportez le JSON.");return}
    dlg.close();renderList()});

  /* Export / import / reset */
  $("exp").addEventListener("click",function(){
    var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S.all(),null,1)],{type:"application/json"}));a.download="congomotors-catalogue.json";a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},2000)});
  $("imp").addEventListener("change",function(){
    var f=this.files[0];if(!f)return;var r=new FileReader();
    r.onload=function(){try{var l=JSON.parse(r.result);if(!Array.isArray(l)||l.some(function(v){return!v.id||!v.brand||!v.model}))throw 0;
      if(confirm("Remplacer le catalogue local par "+l.length+" véhicules ?")){S.save(l);renderList()}}catch(e){alert("Fichier JSON invalide.")}};
    r.readAsText(f);this.value=""});
  $("rst").addEventListener("click",function(){if(confirm("Effacer vos modifications locales et revenir au catalogue d'exemple ?")){S.reset();renderList()}});

  /* Demandes */
  function renderReq(){
    var l=S.requests();
    $("rrows").innerHTML=l.map(function(r){return '<tr><td>'+new Date(r.date).toLocaleString("fr-FR")+'</td><td>'+CM.esc(r.type)+'</td><td>'+CM.esc(r.summary)+'</td><td><details><summary>Voir</summary><pre style="white-space:pre-wrap;font:inherit;margin-top:8px">'+CM.esc(r.message)+'</pre><small style="color:var(--muted)">'+CM.esc(r.status)+'</small></details></td></tr>'}).join("")||'<tr><td colspan="4">Aucune demande préparée depuis ce navigateur.</td></tr>'}
  $("clrReq").addEventListener("click",function(){if(confirm("Vider la liste des demandes ?")){S.clearRequests();renderReq()}});

  renderList();
})();
