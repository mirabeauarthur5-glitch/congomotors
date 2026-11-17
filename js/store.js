/* CongoMotors — couche de données (version DÉMO, stockage local du navigateur).
   Architecture prête pour un backend : remplacer les fonctions de CM.store par des appels API
   (GET/POST/PUT/DELETE /vehicles, POST /requests) sans toucher aux pages. */
(function(){
  var KEY="cm_catalog_v1", RKEY="cm_requests_v1";
  var CFG={ brand:"CongoMotors", phone:"+242 06 793 34 69", wa:"242067933469",
    tiktok:"https://www.tiktok.com/@antonyfranckloufimpou111", cities:["Pointe-Noire","Brazzaville"] };
  function read(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
  function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
  function base(){
    var man=window.CM_IMAGES||{};
    return (window.CM_VEHICLES||[]).map(function(v){
      var c=Object.assign({},v); if((!c.images||!c.images.length)&&man[c.id]) c.images=man[c.id].slice(); return c;});
  }
  var store={
    cfg:CFG,
    all:function(){ return read(KEY,null)||base(); },
    isCustom:function(){ return !!read(KEY,null); },
    get:function(id){ return store.all().find(function(v){return v.id===id}); },
    save:function(list){ return write(KEY,list); },
    upsert:function(v){ var l=store.all(),i=l.findIndex(function(x){return x.id===v.id}); if(i>=0) l[i]=v; else l.push(v); return store.save(l); },
    remove:function(id){ return store.save(store.all().filter(function(v){return v.id!==id})); },
    reset:function(){ try{localStorage.removeItem(KEY)}catch(e){} },
    requests:function(){ return read(RKEY,[]); },
    logRequest:function(r){ var l=store.requests(); r.id=Date.now().toString(36); r.date=new Date().toISOString(); r.status="Message préparé (WhatsApp ouvert par le visiteur — envoi non vérifiable)"; l.unshift(r); write(RKEY,l.slice(0,300)); },
    clearRequests:function(){ write(RKEY,[]); }
  };
  window.CM=window.CM||{}; window.CM.store=store;
})();
