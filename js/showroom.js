(function(){
  var CM=window.CM, all=CM.store.all();
  var $=function(i){return document.getElementById(i)};
  var q=$("q"),fb=$("fbrand"),fm=$("fmodel"),fy=$("fyear"),fbud=$("fbud"),grid=$("grid"),cnt=$("count"),empty=$("empty"),catBox=$("fcat");
  var state={cat:""};
  function uniq(a){return Array.from(new Set(a)).sort(function(x,y){return String(x).localeCompare(String(y),"fr")})}
  var brands=uniq(all.map(function(v){return v.brand}));
  fb.innerHTML='<option value="">Toutes</option>'+brands.map(function(b){return '<option>'+CM.esc(b)+'</option>'}).join("");
  function fillModels(){var m=uniq(all.filter(function(v){return!fb.value||v.brand===fb.value}).map(function(v){return v.model}));var cur=fm.value;fm.innerHTML='<option value="">Tous</option>'+m.map(function(x){return '<option>'+CM.esc(x)+'</option>'}).join("");if(m.indexOf(cur)>=0)fm.value=cur}
  var cats=uniq(all.map(function(v){return v.category}));
  catBox.innerHTML=['Toutes'].concat(cats).map(function(c,i){return '<button type="button" class="chip" aria-pressed="'+(i===0)+'" data-c="'+(i?CM.esc(c):'')+'">'+CM.esc(c)+'</button>'}).join("");
  var years=uniq(all.map(function(v){return v.year}).filter(Boolean)).reverse();
  if(years.length){fy.innerHTML='<option value="">Toutes</option>'+years.map(function(y){return '<option>'+y+'</option>'}).join("")}
  else{fy.disabled=true;$("yearNote").textContent="Années à confirmer : le filtre s'activera dès que les années seront renseignées."}
  if(!all.some(function(v){return v.price})){fbud.disabled=true;$("budNote").textContent="Prix à confirmer : le filtre s'activera dès que les prix seront renseignés."}

  function apply(){
    var t=q.value.trim().toLowerCase(), bud=parseFloat(fbud.value);
    var res=all.filter(function(v){
      if(fb.value&&v.brand!==fb.value)return false;
      if(fm.value&&v.model!==fm.value)return false;
      if(state.cat&&v.category!==state.cat)return false;
      if(fy.value&&String(v.year)!==fy.value)return false;
      if(!isNaN(bud)&&bud>0&&!(v.price&&v.price<=bud))return false;
      if(t&&(v.brand+" "+v.model+" "+v.category).toLowerCase().indexOf(t)<0)return false;
      return true});
    grid.innerHTML=res.map(CM.card).join("");
    cnt.textContent=res.length+" véhicule"+(res.length>1?"s":"")+" sur "+all.length;
    empty.hidden=res.length>0;
  }
  q.addEventListener("input",apply);
  fb.addEventListener("change",function(){fillModels();apply()});
  [fm,fy].forEach(function(e){e.addEventListener("change",apply)});
  fbud.addEventListener("input",apply);
  catBox.addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;state.cat=b.dataset.c;catBox.querySelectorAll(".chip").forEach(function(c){c.setAttribute("aria-pressed",c===b)});apply()});
  $("reset").addEventListener("click",function(){q.value="";fb.value="";fillModels();fm.value="";fy.value="";fbud.value="";state.cat="";catBox.querySelectorAll(".chip").forEach(function(c,i){c.setAttribute("aria-pressed",i===0)});apply()});
  var f=$("filters");
  $("fopen").addEventListener("click",function(){f.classList.add("open")});
  $("fclose").addEventListener("click",function(){f.classList.remove("open");window.scrollTo({top:0})});
  var p=new URLSearchParams(location.search);
  if(p.get("brand")){fb.value=p.get("brand")}
  fillModels();apply();
})();
