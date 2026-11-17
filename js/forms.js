/* Aides formulaires : valide, construit un message WhatsApp, ne prétend JAMAIS qu'une demande est envoyée */
(function(){
  var CM=window.CM;
  CM.bindForm=function(form,statusEl,opts){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var bad=null;form.querySelectorAll("[required]").forEach(function(f){var ok=f.value.trim()!=="";f.setAttribute("aria-invalid",!ok);if(!ok&&!bad)bad=f});
      if(bad){show("Merci de renseigner les champs obligatoires (*).",true);bad.focus();return}
      if(opts.validate){var err=opts.validate(form);if(err){show(err,true);return}}
      var lines=[opts.intro];
      form.querySelectorAll("input,select,textarea").forEach(function(f){if(f.name&&f.value.trim())lines.push("• "+f.name+" : "+f.value.trim())});
      var text=lines.join("\n");
      CM.store.logRequest({type:opts.type,summary:opts.summary(form),message:text});
      var w=window.open(CM.waLink(text),"_blank","noopener");
      show("Message préparé. WhatsApp s'ouvre avec votre message : <strong>vous devez l'envoyer vous-même</strong>. Votre demande n'est transmise à CongoMotors qu'une fois le message envoyé dans WhatsApp. Si rien ne s'ouvre, <a target=\"_blank\" rel=\"noopener\" href=\""+CM.waLink(text)+"\">cliquez ici</a>.");
    });
    function show(h,err){statusEl.innerHTML=h;statusEl.className="status show";statusEl.style.borderColor=err?"#d97b6f":"var(--gold)"}
  };
})();
