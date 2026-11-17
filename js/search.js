(function(){
  var CM=window.CM, all=CM.store.all();
  document.getElementById("brands").innerHTML=Array.from(new Set(all.map(function(v){return v.brand}))).sort().map(function(b){return '<option value="'+CM.esc(b)+'">'}).join("");
  document.getElementById("s_cat").innerHTML+=Array.from(new Set(all.map(function(v){return v.category}))).sort().map(function(c){return '<option>'+CM.esc(c)+'</option>'}).join("");
  CM.bindForm(document.getElementById("searchForm"),document.getElementById("searchStatus"),{type:"Recherche personnalisée",intro:"Bonjour CongoMotors, je souhaite une recherche personnalisée de véhicule :",summary:function(f){return ((f.s_brand.value+" "+f.s_model.value).trim()||"Recherche ouverte")}});
})();
