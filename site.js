document.addEventListener('DOMContentLoaded',function(){
  var nav=document.querySelector('nav');
  var toggle=document.querySelector('.nav-toggle');
  if(nav&&toggle){
    function closeMenu(){nav.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    });
    nav.querySelectorAll('.nav-links a').forEach(function(link){link.addEventListener('click',closeMenu);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  }

  var threads={
    failure:{number:'01',title:'What can a first attempt teach?',body:'I study productive failure: what learners discover when they try a challenging problem before receiving instruction, and how teachers can design that experience.',link:'Explore ProductiveMath',href:'projects.html'},
    creativity:{number:'02',title:'How do we recognize a creative idea?',body:'I explore ways to notice and support students’ creative thinking in open-ended learning games, including how AI can help assess ideas without flattening them.',link:'Browse research',href:'publications.html'},
    ai:{number:'03',title:'What should stay human?',body:'I design and study learning tools with a simple question in mind: where can AI help, and where should curiosity, judgment, and choice remain with the learner?',link:'See the interactive project',href:'projects.html#somewhere-along-the-way'}
  };
  var detail=document.querySelector('[data-thread-detail]');
  document.querySelectorAll('[data-thread]').forEach(function(button){
    button.addEventListener('click',function(){
      var item=threads[button.getAttribute('data-thread')];
      if(!item||!detail)return;
      document.querySelectorAll('[data-thread]').forEach(function(b){b.setAttribute('aria-pressed',String(b===button));});
      detail.querySelector('[data-thread-number]').textContent=item.number;
      detail.querySelector('[data-thread-title]').textContent=item.title;
      detail.querySelector('[data-thread-body]').textContent=item.body;
      var link=detail.querySelector('[data-thread-link]'); link.textContent=item.link; link.href=item.href;
    });
  });

  var cards=Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  if(cards.length){
    var bar=document.createElement('div'); bar.className='project-filter-bar'; bar.setAttribute('role','group'); bar.setAttribute('aria-label','Filter projects');
    var categories=[['all','All projects'],['learning','AI & learning'],['interactive','Interactive work']];
    categories.forEach(function(entry){
      var b=document.createElement('button'); b.type='button'; b.textContent=entry[1]; b.setAttribute('data-project-filter',entry[0]); b.setAttribute('aria-pressed',String(entry[0]==='all')); bar.appendChild(b);
    });
    var count=document.createElement('span'); count.className='filter-count'; count.setAttribute('aria-live','polite'); bar.appendChild(count);
    cards[0].parentNode.insertBefore(bar,cards[0]);
    function setProjectFilter(key){
      var shown=0;
      cards.forEach(function(card){
        var text=(card.innerText||card.textContent).toLowerCase();
        var isInteractive=text.indexOf('somewhere along the way')>=0||text.indexOf('clues in the news')>=0;
        var isLearning=text.indexOf('legalmind')>=0||text.indexOf('productivemath')>=0||text.indexOf('smarterflash')>=0||text.indexOf('metalingual')>=0;
        var visible=key==='all'||(key==='interactive'&&isInteractive)||(key==='learning'&&isLearning);
        card.hidden=!visible; if(visible)shown++;
      });
      count.textContent=shown+' '+(shown===1?'project':'projects');
      bar.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-project-filter')===key));});
    }
    bar.addEventListener('click',function(e){var b=e.target.closest('[data-project-filter]');if(b)setProjectFilter(b.getAttribute('data-project-filter'));});
    setProjectFilter('all');
  }

  var tabBar=document.querySelector('.tab-bar');
  if(tabBar){
    var search=document.createElement('div'); search.className='pub-search';
    var label=document.createElement('label'); label.setAttribute('for','publication-search'); label.textContent='Find a publication';
    var input=document.createElement('input'); input.type='search'; input.id='publication-search'; input.placeholder='Search title, author, or venue'; input.autocomplete='off';
    var result=document.createElement('span'); result.className='filter-count'; result.setAttribute('aria-live','polite');
    search.appendChild(label);search.appendChild(input);search.appendChild(result);tabBar.parentNode.insertBefore(search,tabBar);
    function filterPublications(){
      var panel=document.querySelector('.panel.active'); if(!panel)return;
      var query=input.value.trim().toLowerCase(); var items=panel.querySelectorAll('.pub-item'); var shown=0;
      items.forEach(function(item){var match=!query||(item.innerText||item.textContent).toLowerCase().includes(query);item.hidden=!match;if(match)shown++;});
      result.textContent=query?shown+' matching '+(shown===1?'item':'items'):'';
    }
    input.addEventListener('input',filterPublications);
    tabBar.querySelectorAll('.tab').forEach(function(button){button.addEventListener('click',function(){setTimeout(filterPublications,0);});});
    filterPublications();
  }
});
