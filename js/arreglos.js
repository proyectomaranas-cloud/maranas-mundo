(function(){
  var v=document.getElementById('landing-video')||document.querySelector('video'); if(!v) return;
  function arreglar(){
    var l=document.getElementById('landing');
    if(!l) return;
    var cs=getComputedStyle(l);
    if(cs.display==='none'||cs.visibility==='hidden'||cs.opacity==='0') return;
    if(getComputedStyle(v).display==='none') v.style.display='block';
    if(v.paused){ v.muted=true; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  }
  new MutationObserver(arreglar).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class','style']});
  window.addEventListener('hashchange',function(){ setTimeout(arreglar,100); });
  document.addEventListener('click',function(){ setTimeout(arreglar,150); });
})();
