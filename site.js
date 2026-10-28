(()=> {
  const nav=document.querySelector(".site-nav");
  const toggle=nav?.querySelector(".nav-toggle");
  const closeMenu=()=>{nav?.classList.remove("menu-open");toggle?.setAttribute("aria-expanded","false");toggle?.setAttribute("aria-label","Open menu")};
  toggle?.addEventListener("click",()=>{
    const open=toggle.getAttribute("aria-expanded")!=="true";
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open?"Close menu":"Open menu");
    nav.classList.toggle("menu-open",open);
  });
  nav?.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",closeMenu));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
  window.addEventListener("resize",()=>{if(window.innerWidth>900)closeMenu()});

  const filters=[...document.querySelectorAll("[data-work-filter]")];
  const cards=[...document.querySelectorAll("[data-work-card]")];
  const count=document.querySelector(".filter-count");
  const applyFilter=(filter)=>{
    let shown=0;
    cards.forEach(card=>{
      const topics=(card.dataset.topic||"").split(/\s+/);
      const visible=filter==="all"||topics.includes(filter);
      card.hidden=!visible;
      if(visible)shown++;
    });
    filters.forEach(button=>{
      const active=button.dataset.workFilter===filter;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",String(active));
    });
    if(count)count.textContent=filter==="all"?"":shown+" stories";
  };
  filters.forEach(button=>button.addEventListener("click",()=>applyFilter(button.dataset.workFilter)));
})();