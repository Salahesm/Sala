/* Root-only loader: expects about.html, education.html, etc. in repo root */
const routes = ["about","education","experience","grants","awards","publications","contact"];
const contentEl = document.getElementById("content");
const yearEl = document.getElementById("year");
const topBtn = document.getElementById("top");
yearEl.textContent = new Date().getFullYear();

function currentRoute(){
  const h = (location.hash || "#about").replace("#","");
  return routes.includes(h) ? h : "about";
}

async function loadSection(name){
  document.querySelectorAll(".tab").forEach(a=>{
    a.classList.toggle("active", a.dataset.section === name);
  });

  // fetch from ROOT (about.html, education.html, etc.)
  const res = await fetch(`${name}.html`);
  if(!res.ok){
    contentEl.innerHTML = `<section class="card"><h2>Not found</h2><p>Couldn’t load <code>${name}.html</code>. Check the filename and path.</p></section>`;
    return;
  }
  const html = await res.text();
  contentEl.innerHTML = html;

  // section hooks
  if(name === "publications"){ publicationsInit(); }
  if(name === "about"){ aboutInit(); }

  document.addEventListener("scroll", ()=>{
    topBtn.style.display = window.scrollY > 400 ? "grid" : "none";
  }, { passive: true });
}
window.addEventListener("hashchange", ()=> loadSection(currentRoute()));
window.addEventListener("DOMContentLoaded", ()=> loadSection(currentRoute()));
topBtn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));

// nav links
document.querySelectorAll('.tab').forEach(a=>{
  a.addEventListener('click', ()=> {/* default hash change is fine */});
});

function aboutInit(){ /* placeholder for future micro-interactions */ }

/* ===== Publications: filter + search ===== */
async function publicationsInit(){
  const list = document.getElementById("publist");
  const tmpl = document.getElementById("pub-item");
  const q = document.getElementById("q");
  const btns = [...document.querySelectorAll(".filter")];
  const active = new Set();

  let pubs = [];
  try{
    const res = await fetch("datapubs.json"); // ROOT, not data/pubs.json
    pubs = await res.json();
  }catch(e){
    console.error("Failed to load publications:", e);
  }

  function render(items){
    list.innerHTML = "";
    items.slice().sort((a,b)=> (b.year||0)-(a.year||0)).forEach(p=>{
      const node = tmpl.content.cloneNode(true);
      node.querySelector(".small").textContent = p.year ?? "";
      node.querySelector(".title").textContent = p.title ?? "";
      node.querySelector(".meta").textContent = p.venue ?? "";
      const tags = node.querySelector(".tags");
      const tag = document.createElement("span");
      tag.className = "chip";
      tag.textContent = (p.type || "").replace("-", " ");
      tags.appendChild(tag);
      list.appendChild(node);
    });
  }

  function apply(){
    const text = (q.value || "").toLowerCase().trim();
    let items = pubs.slice();
    if(active.size){ items = items.filter(p => active.has(p.type)); }
    if(text){
      items = items.filter(p =>
        String(p.title ?? "").toLowerCase().includes(text) ||
        String(p.venue ?? "").toLowerCase().includes(text) ||
        String(p.year ?? "").includes(text)
      );
    }
    render(items);
  }

  btns.forEach(b=>{
    if(b.id === "clear"){
      b.addEventListener("click", ()=>{
        active.clear(); btns.forEach(x=>x.setAttribute("aria-pressed","false"));
        q.value=""; apply();
      });
      return;
    }
    b.addEventListener("click", ()=>{
      const t = b.dataset.tag;
      const pressed = b.getAttribute("aria-pressed") === "true";
      if(pressed){ active.delete(t); b.setAttribute("aria-pressed","false"); }
      else { active.add(t); b.setAttribute("aria-pressed","true"); }
      apply();
    });
  });
  q.addEventListener("input", apply);
  render(pubs);
}
