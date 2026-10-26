document.addEventListener('DOMContentLoaded',function(){
  var nav=document.querySelector('nav');
  var toggle=document.querySelector('.nav-toggle');
  if(!nav||!toggle)return;
  function closeMenu(){nav.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
  toggle.addEventListener('click',function(){
    var open=nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  nav.querySelectorAll('.nav-links a').forEach(function(link){link.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(event){if(event.key==='Escape')closeMenu();});
});
