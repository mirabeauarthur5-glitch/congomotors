(function(){
  var CM=window.CM;
  document.getElementById("cWa").href=CM.waLink("Bonjour CongoMotors,");
  CM.bindForm(document.getElementById("contactForm"),document.getElementById("contactStatus"),{type:"Contact",intro:"Bonjour CongoMotors, je vous contacte depuis votre site :",summary:function(f){return f.c_sub.value}});
})();
