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
/* Project directory filters */
document.querySelectorAll("[data-project-filter]").forEach(button=>{
  button.addEventListener("click",()=>{
    const filter=button.dataset.projectFilter;
    const tiles=[...document.querySelectorAll("[data-project-tile]")];
    let visible=0;
    tiles.forEach(tile=>{
      const topics=(tile.dataset.projectTopic||"").split(/\s+/);
      const show=filter==="all"||topics.includes(filter);
      tile.hidden=!show;
      if(show)visible++;
    });
    document.querySelectorAll("[data-project-filter]").forEach(item=>{
      const active=item===button;
      item.classList.toggle("is-active",active);
      item.setAttribute("aria-pressed",String(active));
    });
    const count=document.querySelector(".project-filter-count");
    if(count)count.textContent=visible+" project"+(visible===1?"":"s");
    const empty=document.querySelector(".project-filter-empty");
    if(empty)empty.hidden=visible>0;
  });
});
/* Open a tucked-away project process when its directory link is chosen. */
document.querySelectorAll('.project-tile[href^="#"]').forEach(link=>{
  link.addEventListener("click",()=>{
    const target=document.querySelector(link.getAttribute("href"));
    const disclosure=target?.matches("details")?target:target?.querySelector("details");
    if(disclosure)disclosure.open=true;
  });
});
/* Skills tabs and per-area search */
(()=>{
  const tabs=[...document.querySelectorAll("[data-skill-tab]")];
  const panels=[...document.querySelectorAll("[data-skill-panel]")];
  const search=document.querySelector("#skills-search");
  const status=document.querySelector("#skills-status");
  let active="research";
  const update=()=>{
    const panel=document.querySelector('[data-skill-panel="'+active+'"]');
    let found=0;
    panel?.querySelectorAll("[data-skill-entry]").forEach(item=>{
      const match=item.textContent.toLowerCase().includes((search?.value||"").trim().toLowerCase());
      item.hidden=!match;
      if(match)found++;
    });
    panel?.querySelectorAll("[data-skill-group]").forEach(group=>{
      group.hidden=!group.querySelector("[data-skill-entry]:not([hidden])");
    });
    if(status)status.textContent=search?.value.trim()?found+" matching items in "+active:"Showing "+active+" skills and experience";
  };
  tabs.forEach(tab=>tab.addEventListener("click",()=>{
    active=tab.dataset.skillTab;
    tabs.forEach(item=>{
      const selected=item===tab;
      item.classList.toggle("is-active",selected);
      item.setAttribute("aria-selected",String(selected));
      item.tabIndex=selected?0:-1;
    });
    panels.forEach(panel=>{
      const selected=panel.dataset.skillPanel===active;
      panel.hidden=!selected;
      panel.classList.toggle("is-active",selected);
    });
    if(search)search.value="";
    update();
  }));
  search?.addEventListener("input",update);
  update();
})();
