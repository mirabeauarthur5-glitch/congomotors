(function(){
  var CM=window.CM, all=CM.store.all(), rent=all.filter(function(v){return v.rental});
  var box=document.getElementById("rentalList");
  box.innerHTML=rent.length?rent.map(CM.card).join(""):'<div class="empty">Le parc de location n\'est pas encore confirmé. Précisez votre besoin dans le formulaire : nous vous indiquerons les véhicules disponibles et les tarifs.</div>';
  var cats=Array.from(new Set(all.map(function(v){return v.category}))).sort();
  document.getElementById("r_cat").innerHTML+=cats.map(function(c){return '<option>'+CM.esc(c)+'</option>'}).join("");
  var today=new Date().toISOString().slice(0,10);["r_from","r_to"].forEach(function(i){document.getElementById(i).min=today});
  CM.bindForm(document.getElementById("rentForm"),document.getElementById("rentStatus"),{type:"Location",intro:"Bonjour CongoMotors, je souhaite faire une demande de location :",summary:function(f){return (f.r_veh.value||f.r_cat.value||"Location")+" — "+f.r_city.value},
    validate:function(f){if(f.r_to.value<f.r_from.value)return "La date de fin doit être postérieure à la date de début."}});
})();
