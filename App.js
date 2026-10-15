/* ===== MOTOR / APP ===== */
var P=Object.assign({}, PROC, FAQ, {calendario:CAL_ITEM});
function goNextPF(k){curPF=k;pzS={k:1,tx:0,ty:0};render();}
window.goNextPF=goNextPF;
function goFlux(k){tab="fluxo";view="hub";cur=k;filter="";renderTabs();render();try{window.scrollTo(0,0);}catch(e){}}
window.goConcCls=function(){ if(window.goFlux) goFlux("classificacao"); };
/* ===== ícones (traço, 24px) ===== */
var ICO={
  inicio:'<path d="M3.5 10.2 12 3.5l8.5 6.7"/><path d="M5.5 9v11.5h13V9"/><path d="M10 20.5v-6h4v6"/>',
  fluxo:'<rect x="3" y="3.5" width="7" height="6" rx="1.5"/><rect x="14" y="14.5" width="7" height="6" rx="1.5"/><path d="M6.5 9.5v3a2 2 0 0 0 2 2H14"/>',
  processos:'<path d="M10 6.5h10.5M10 12h10.5M10 17.5h10.5"/><path d="m3.5 6.5 1.6 1.6 2.9-3"/><path d="m3.5 12 1.6 1.6 2.9-3"/><path d="m3.5 17.5 1.6 1.6 2.9-3"/>',
  duvidas:'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.7"/><path d="M12 16.9h.01"/>',
  calendario:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/>',
  responsaveis:'<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 5.4a3.3 3.3 0 0 1 0 6.3"/><path d="M17.6 14.2a6 6 0 0 1 3.4 5.3"/>',
  busca:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  externo:'<path d="M14 4h6v6"/><path d="M10 14 20 4"/><path d="M19 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5.5"/>',
  play:'<path d="M7 4.8v14.4L19 12z" fill="currentColor" stroke="none"/>',
  planilha:'<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M4 9h16M4 14.5h16M10 9v11.5"/>',
  fornecedor:'<path d="M4 9.5 5.5 4.5h13L20 9.5"/><path d="M4 9.5h16v1.2a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0z"/><path d="M5.5 12.8v7.7h13v-7.7"/>',
  mural:'<path d="M4 5.5h16v10H9.5L4 19.5z"/>',
  check:'<path d="m5 12.5 4.3 4.3L19 7"/>',
  historico:'<path d="M4.2 12a7.8 7.8 0 1 0 2.3-5.5"/><path d="M4 4.5v4h4"/><path d="M12 8v4.3l2.8 1.7"/>',
  mais:'<path d="M12 5v14M5 12h14"/>',
  email:'<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  copiar:'<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
  conceito:'<path d="M5 4.5h10.5L19 8v11.5H5z"/><path d="M15 4.5V8.5h4"/><path d="M8.5 12.5h7M8.5 16h5"/>'
};
function ico(n){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICO[n]||'')+'</svg>'; }

var PROCFISC={
  visao:{ name:"Visão geral do processo", svgmap:true },
  recebimento:{ name:"Recebimento e fontes de entrada", svgmap:true },
  classificacao:{name:"Classificação da nota", svgmap:true},
  analise:{name:"Análise da nota", svgmap:true},
  chamados:{name:"Abertura de chamados", svgmap:true},
  carimbo:{name:"Carimbo da nota", svgmap:true},
  lancamento:{name:"Lançamento no SAP", svgmap:true},
  armazenamento:{name:"Armazenamento da nota", svgmap:true},
  fechamento:{name:"Planilha de Contratos", svgmap:true}
};
/* menu de Processos: visão geral, etapas na ordem do fluxo e o processo de apoio (chamados) */
var PF_SECOES=[["Visão geral",["visao"]],["Etapas, na ordem do fluxo",["recebimento","classificacao","analise","carimbo","lancamento","armazenamento","fechamento"]],["Apoio",["chamados"]]];
var ORDER_PROCFISC=PF_SECOES.reduce(function(a,s){ return a.concat(s[1]); },[]);

var STAT={pronto:["var(--ok)","pronto"],rascunho:["var(--draft)","rascunho"],vazio:["var(--empty)","a preencher"]};
var cur="recebimento", view="hub", filter="", stepIdx=-1, catOpen={}, selCal=null, nearOpen=false, calMonthOpen=null, calYear=null, calCollapsed=false, calView="mes", curPF=null, tab="inicio", inicioCat="todos", inicioCompose=false, muralFlash=null;
/* histórico do mural */
var muralView="mural", histSel=null, histQ="", histMes="todos", histCat="todos", histSit="todas", histMobDet=false;
var root=document.getElementById("root");

function wrap(d){
  if(tab==="calendario") return '<div class="panel panel-full">'+d+'</div>';
  return '<div class="layout"><div class="rail">'+railHtml()+'</div><div class="panel">'+d+'</div></div>';
}
function itemHtml(k,sub){var p=P[k];return '<div class="item'+(sub?" item-sub":"")+' '+(k===cur?"active":"")+'" data-k="'+k+'" role="link" tabindex="0"'+(k===cur?' aria-current="page"':'')+'><span class="name">'+p.name+'</span></div>';}
function railHtml(){
  var q=filter.trim().toLowerCase();
  var html='<input class="search" id="search" type="search" placeholder="'+(tab==="duvidas"?"Filtrar dúvidas":"Filtrar tópicos")+'" aria-label="Filtrar a lista" value="'+filter.replace(/"/g,'&quot;')+'">';
  if(tab==="fluxo"){
    var lastSec="";
    ORDER_FLUXO.forEach(function(k){var p=P[k]; if(q&&p.name.toLowerCase().indexOf(q)<0)return;
      if(p.sec!==lastSec){html+='<div class="sec-label">'+p.sec+'</div>';lastSec=p.sec;}
      html+=itemHtml(k,false);});
  } else if(tab==="duvidas"){
    /* agrupa por categoria (na ordem em que cada uma aparece), mesmo que os itens estejam espalhados */
    var cats=[], byCat={};
    ORDER_FAQ.forEach(function(k){var p=P[k]; if(q&&p.name.toLowerCase().indexOf(q)<0)return;
      if(!byCat[p.cat]){byCat[p.cat]=[];cats.push(p.cat);} byCat[p.cat].push(k);});
    cats.forEach(function(c){var copen=(!!catOpen[c]||!!q);
      html+='<div class="cat-label" data-ctoggle="'+c+'" role="button" tabindex="0" aria-expanded="'+copen+'">'+c+'<span aria-hidden="true">'+(copen?"▾":"▸")+'</span></div>';
      if(copen) byCat[c].forEach(function(k){html+=itemHtml(k,true);});});
    if(q&&!cats.length) html+='<p class="rail-empty">Nenhuma dúvida com esse nome. Tente a busca geral (Ctrl K).</p>';
  }
  if(tab==="fluxo"&&q&&html.indexOf('class="item')<0) html+='<p class="rail-empty">Nenhum tópico com esse nome. Tente a busca geral (Ctrl K).</p>';
  return html;
}
function hubHtml(){
  var p=P[cur];
  if(p.calendar){
    var dc='<div class="cal-head"><div><h1>Calendário fiscal</h1><p>Vencimentos de fornecedores por dia, avisos de rotina e suas anotações pessoais.</p></div></div><div id="calwrap"></div>';
    setTimeout(renderCalendar,0); return wrap(dc);
  }
  var d='<p class="crumb">'+(p.faq?('Dúvidas recorrentes / '+calEsc(p.cat||'')):calEsc(p.sec||''))+'</p><h1>'+p.name+'</h1>';
  if(p.lead) d+='<p class="lead">'+p.lead+'</p>';
  if(p.material && typeof RT_SLIDES!=="undefined"){
    var strip=''; for(var mi=0;mi<RT_SLIDES.length;mi++){ strip+='<button type="button" class="slide" onclick="rtOpen('+mi+')" aria-label="Ampliar slide '+(mi+1)+'"><img src="'+RT_SLIDES[mi]+'" alt="" loading="lazy"><span>'+(mi+1)+'</span></button>'; }
    d+='<section class="material"><div class="mat-h"><div><h2>Apresentação original</h2><p>'+RT_SLIDES.length+' slides. Clique em um slide para ampliar e use as setas do teclado para avançar. O resumo prático vem logo abaixo.</p></div><button type="button" class="cta secondary" onclick="rtOpen(0)">'+ico("play")+'Ver em tela cheia</button></div><div class="strip">'+strip+'</div></section>';
  }
  if(p.flow) d+='<button class="cta" id="present" type="button">'+ico("play")+'Apresentar o processo</button>';
  if(p.checklist){var cl='<div style="margin-top:8px;">';cl+='<div style="font-size:13px;color:var(--muted);margin-bottom:12px;">'+p.checklist.hint+'</div>';cl+='<div id="cklist"></div>';cl+='<div style="margin-top:10px;"><button class="cta secondary" id="ckreset" style="width:auto;">Limpar marcações</button></div>';d+=cl;setTimeout(renderChecklist,0);return wrap('<div class="doc">'+d+'</div>');}
  if(p.faq){
    var fb='<div class="faq">'
      +'<section class="faq-b faq-p"><h3>Problema</h3><div>'+p.faq.problema+'</div></section>'
      +'<section class="faq-b faq-c"><h3>Processo</h3><div>'+p.faq.processo+'</div></section>'
      +'<section class="faq-b faq-s"><h3>Solução</h3><div>'+p.faq.solucao+(p.img?'<img src="'+p.img+'" alt="Exemplo">':'')+'</div></section>'
      +'</div>';
    return wrap('<div class="doc">'+d+fb+'</div>');
  }
  if(!p.steps||p.steps.length===0){
    d+='<div class="steps"><div class="empty-box">Este processo ainda não foi preenchido.</div></div>';
  } else {
    d+='<div class="steps'+(p.material?' article':'')+'">'+p.steps.map(function(s,i){
      var lk='';
      if(s.link){ lk = s.link.todo ? '<span class="lnk todo">'+s.link.label+'</span>' : '<a class="lnk" href="'+s.link.u+'" target="_blank" rel="noopener">'+s.link.label+ico("externo")+'</a>'; }
      var im=s.img?'<img src="'+s.img+'" alt="Exemplo" loading="lazy" style="display:block;margin-top:12px;max-width:100%;border:1px solid var(--border);border-radius:8px;">':'';
      var imt=s.imgTodo?'<div class="empty-box" style="margin-top:12px;padding:18px;">Imagem do carimbo a incluir</div>':'';
      return '<div class="step" id="st-'+i+'"><div class="num">'+(i+1)+'</div><div class="sbody"><div class="h">'+s.t+'</div><div class="d">'+s.d+'</div>'+im+imt+lk+'</div></div>';
    }).join('')+'</div>';
  }
  if(p.gallery){
    d+='<section class="gallery"><h2>Tutorial no SAP</h2><p>'+p.gallery.length+' telas, na ordem do lançamento.</p>'
      +p.gallery.map(function(src,i){ return '<figure><figcaption>Tela '+(i+1)+' de '+p.gallery.length+'</figcaption><img src="'+src+'" alt="SAP, tela '+(i+1)+'" loading="lazy"></figure>'; }).join('')
      +'</section>';
  }
  return wrap('<div class="doc">'+d+'</div>');
}
function presentHtml(){
  const p=P[cur],[,label]=(STAT[p.status]||["",""]),stepping=stepIdx>=0;
  let cap= stepping
    ? '<div class="caption" id="cap"><div class="ct">'+(stepIdx+1)+'. '+p.steps[stepIdx].t+'</div><div class="cd">'+p.steps[stepIdx].d+'</div></div>'
    : '<div class="caption" id="cap"><div class="ct">Visão geral</div><div class="cd">Usar “Próximo” para percorrer o fluxo etapa por etapa. Os itens em destaque são clicáveis.</div></div>';
  return '<div class="present-head"><button class="cta secondary" id="back">← Voltar à consulta</button><h1 style="font-size:19px;">'+p.name+'</h1></div>'+'<div class="stage"><div class="pres-nav sticky"><button class="cta secondary" id="prev">← Anterior</button><button class="cta" id="next">Próximo →</button><span class="spacer"></span><span class="counter" id="counter"></span><button class="cta secondary" id="showall">Ver tudo</button></div>'+cap+'<div class="flow'+(stepping?' stepping':'')+'" id="flow">'+p.flow+'</div></div>';
}
function applyHighlight(){
  const flow=document.getElementById("flow");if(!flow)return;
  flow.classList.toggle("stepping",stepIdx>=0);
  flow.querySelectorAll(".fnode").forEach(n=>n.classList.remove("hl"));
  if(stepIdx>=0){const n=flow.querySelector('.fnode[data-i="'+stepIdx+'"]');if(n){n.classList.add("hl");try{n.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"});}catch(e){}}}
  const capEl=document.getElementById("cap");if(capEl){if(stepIdx>=0){var sc=P[cur].steps[stepIdx];capEl.innerHTML='<div class="ct">'+(stepIdx+1)+'. '+sc.t+'</div><div class="cd">'+sc.d+'</div>';}else{capEl.innerHTML='<div class="ct">Visão geral</div><div class="cd">Usar Próximo para percorrer, ou clicar em um item do mapa para ver a explicação.</div>';}}const c=document.getElementById("counter");if(c)c.textContent=(stepIdx>=0?(stepIdx+1):"—")+" / "+P[cur].steps.length;
}
function calEsc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");}
function calPad(n){return (n<10?"0":"")+n;}
function calIso(y,m,d){return y+"-"+calPad(m+1)+"-"+calPad(d);}
function calBR(iso){var p=iso.split("-");return p[2]+"/"+p[1];}
function monthGrid(base,todayIso){
  var y=base.getFullYear(),m=base.getMonth();
  var first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
  var wd=["dom","seg","ter","qua","qui","sex","sáb"];
  var h='<div class="calgrid">';
  wd.forEach(function(w){h+='<div class="wd">'+w+'</div>';});
  for(var i=0;i<first;i++)h+='<div class="calcell empty"></div>';
  for(var dn=1;dn<=days;dn++){
    var iso=calIso(y,m,dn), isSel=(iso===selCal), isToday=(iso===todayIso);
    var ev=(typeof EVENTOS!=="undefined"&&EVENTOS[iso])?EVENTOS[iso]:[];
    var list=VENC[iso]||[];
    var chips='';
    ev.forEach(function(e){chips+='<span class="calchip evt" title="'+calEsc(e)+'">'+calEsc(e)+'</span>';});
    if(list.length)chips+='<span class="calchip venc" title="'+list.length+(list.length===1?' vencimento':' vencimentos')+'"><b>'+list.length+'</b><span class="lbl">'+(list.length===1?' vencimento':' vencimentos')+'</span></span>';
    if(CUREMAIL && noteOf(iso))chips+='<span class="calchip note">Anota\u00e7\u00e3o</span>';
    h+='<div class="calcell'+(isToday?" today":"")+(isSel?" sel":"")+'" data-cal="'+iso+'" role="button" tabindex="0" aria-pressed="'+isSel+'" aria-label="Dia '+dn+(list.length?(', '+list.length+(list.length===1?' vencimento':' vencimentos')):'')+'"><div class="calnum">'+dn+'</div>'+chips+'</div>';
  }
  var rem=(7-((first+days)%7))%7;
  for(var t=0;t<rem;t++)h+='<div class="calcell empty"></div>';
  return h+'</div>';
}


/* ===== login por e-mail + anotações (localStorage) ===== */
var CUREMAIL = (function(){ try{return localStorage.getItem("manual_email")||"";}catch(e){return "";} })();
function emailNorm(s){ return (s||"").trim().toLowerCase(); }
function emailValid(s){ s=emailNorm(s); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function setEmail(c){ var n=emailNorm(c); if(n!==CUREMAIL){ try{ inicioCompose=false; }catch(e){} } CUREMAIL=n; try{localStorage.setItem("manual_email",CUREMAIL);}catch(e){} updateEmailBadge(); }
function updateEmailBadge(){ var el=document.getElementById("emailBadge"); if(!el)return;
  if(CUREMAIL){ var loc=CUREMAIL.split("@")[0]; el.innerHTML='<span class="av">'+calEsc(loc.charAt(0).toUpperCase())+'</span><span class="em">'+calEsc(loc)+'</span>'; el.title=CUREMAIL+" (clique para trocar)"; }
  else { el.innerHTML='<span class="av off">?</span><span class="em">Entrar</span>'; el.title="Entrar com e-mail"; }
  el.onclick=function(){ var cov=document.getElementById("cover"); var inp=document.getElementById("coverEmail"); if(inp)inp.value=CUREMAIL; var er=document.getElementById("coverEmailErr"); if(er)er.textContent=""; if(cov)cov.style.display=""; if(AUTH_ON&&!AUTH_USER&&GSI_OK) gsiBotao(); };
  el.onkeydown=function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); el.click(); } };
}
function notesKey(){ return "manual_notes_"+CUREMAIL; }
function getNotes(){ if(!CUREMAIL)return {}; try{return JSON.parse(localStorage.getItem(notesKey())||"{}");}catch(e){return {};} }
function noteOf(iso){ var n=getNotes(); return n[iso]||""; }
function saveNote(iso,txt){ if(!CUREMAIL)return; var n=getNotes(); if(txt&&txt.trim())n[iso]=txt.trim(); else delete n[iso]; try{localStorage.setItem(notesKey(),JSON.stringify(n));}catch(e){} }
/* ===== lightbox do material (slides Reforma Tributária) ===== */
var rtIdx=0;
function rtEnsure(){
  var ov=document.getElementById("rtLight");
  if(ov)return ov;
  ov=document.createElement("div");
  ov.id="rtLight"; ov.className="lb";
  ov.setAttribute("role","dialog"); ov.setAttribute("aria-modal","true"); ov.setAttribute("aria-label","Slides da apresentação");
  ov.style.display="none";
  ov.innerHTML='<div class="lb-top"><span class="lb-title">Apresentação original da Reforma Tributária</span><button id="rtClose" class="lb-close" type="button" aria-label="Fechar">Fechar <kbd>Esc</kbd></button></div>'
    +'<img id="rtImg" class="lb-img" alt="Slide da apresentação">'
    +'<div class="lb-nav">'
    +'<button id="rtPrev" class="lb-btn" type="button">‹ Anterior</button>'
    +'<span id="rtCount" class="lb-count" aria-live="polite"></span>'
    +'<button id="rtNext" class="lb-btn" type="button">Próximo ›</button>'
    +'</div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov) rtClose(); });
  document.getElementById("rtClose").onclick=rtClose;
  document.getElementById("rtPrev").onclick=function(){rtNav(-1);};
  document.getElementById("rtNext").onclick=function(){rtNav(1);};
  document.addEventListener("keydown",function(e){
    if(document.getElementById("rtLight").style.display==="none")return;
    if(e.key==="Escape")rtClose(); else if(e.key==="ArrowLeft")rtNav(-1); else if(e.key==="ArrowRight")rtNav(1);
  });
  return ov;
}
function rtShow(){
  if(typeof RT_SLIDES==="undefined")return;
  var im=document.getElementById("rtImg"); im.src=RT_SLIDES[rtIdx]; im.alt="Slide "+(rtIdx+1)+" de "+RT_SLIDES.length;
  document.getElementById("rtCount").textContent=(rtIdx+1)+" de "+RT_SLIDES.length;
}
window.rtOpen=function(i){ rtEnsure(); rtIdx=i||0; rtShow(); document.getElementById("rtLight").style.display="flex"; var nx=document.getElementById("rtNext"); if(nx)nx.focus({preventScroll:true}); };
window.rtClose=function(){ var o=document.getElementById("rtLight"); if(o)o.style.display="none"; };
window.rtNav=function(dir){ if(typeof RT_SLIDES==="undefined")return; rtIdx=(rtIdx+dir+RT_SLIDES.length)%RT_SLIDES.length; rtShow(); };
function renderCalDay(){
  var el=document.getElementById("calday"); if(!el)return;
  if(!selCal){ el.innerHTML='<div class="daycard"><div class="dsec"><p class="dhint">Escolha um dia no calendário para ver os vencimentos e as suas anotações.</p></div></div>'; return; }
  var ev=(typeof EVENTOS!=="undefined"&&EVENTOS[selCal])?EVENTOS[selCal]:[];
  var list=VENC[selCal]||[];
  var dt=new Date(selCal+"T00:00:00");
  var wdn=["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  var mnl=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  var h='<div class="daycard"><div class="daycard-h"><div class="dd">'+dt.getDate()+'</div><div><div class="dw">'+cap1(wdn[dt.getDay()])+'</div><div class="dm">'+dt.getDate()+' de '+mnl[dt.getMonth()]+' de '+dt.getFullYear()+'</div></div></div>';
  if(ev.length) h+='<section class="dsec"><h3>Avisos e eventos</h3><ul class="dlist">'+ev.map(function(f){return '<li>'+calEsc(f)+'</li>';}).join('')+'</ul></section>';
  h+='<section class="dsec"><h3>Vencimentos'+(list.length?'<span class="ct">'+list.length+'</span>':'')+'</h3>'
    +(list.length?'<ul class="dlist">'+list.map(function(f){return '<li>'+calEsc(f)+'</li>';}).join('')+'</ul>':'<p class="dempty">Nenhum vencimento neste dia.</p>')+'</section>';
  if(CUREMAIL){
    var nv=noteOf(selCal);
    h+='<section class="dsec dnote"><h3>Minhas anotações</h3><textarea id="dayNote" placeholder="Tarefas e lembretes para este dia">'+calEsc(nv)+'</textarea>'
      +'<div class="drow"><button id="dayNoteSave" class="cta" type="button">Salvar anotação</button><span id="dayNoteMsg" class="dmsg" role="status"></span></div></section>';
  } else {
    h+='<section class="dsec"><p class="dhint">Para escrever anotações pessoais neste dia, entre com seu e-mail pelo botão no canto superior direito.</p></section>';
  }
  h+='</div>';
  el.innerHTML=h;
  var sv=document.getElementById("dayNoteSave");
  if(sv)sv.onclick=function(){ saveNote(selCal, document.getElementById("dayNote").value); var m=document.getElementById("dayNoteMsg"); if(m){ m.textContent="Anotação salva"; setTimeout(function(){ renderCalendar(); },700); } };
}
function miniMonth(y,m,todayIso){
  var mn=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  var first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
  var wd=["D","S","T","Q","Q","S","S"];
  var h='<div class="ymonth"><div class="ymonth-title" data-gomon="'+m+'" role="button" tabindex="0" title="Abrir '+mn[m]+'">'+mn[m]+'</div><div class="ygrid">';
  wd.forEach(function(w){h+='<div class="ywd">'+w+'</div>';});
  for(var i=0;i<first;i++)h+='<div class="ycell empty"></div>';
  for(var dn=1;dn<=days;dn++){
    var iso=calIso(y,m,dn);
    var hasData=(!!VENC[iso])||(typeof EVENTOS!=="undefined"&&!!EVENTOS[iso]);
    var cls='ycell';
    if(iso===todayIso)cls+=' today'; else if(hasData)cls+=' data';
    if(iso===selCal)cls+=' sel';
    h+='<div class="'+cls+'" data-cal="'+iso+'">'+dn+'</div>';
  }
  return h+'</div></div>';
}
function renderCalendar(){
  var host=document.getElementById("calwrap"); if(!host)return;
  var today=new Date(); today.setHours(0,0,0,0);
  var todayIso=calIso(today.getFullYear(),today.getMonth(),today.getDate());
  if(calYear===null) calYear=today.getFullYear();
  if(calMonthOpen===null) calMonthOpen=today.getMonth();
  var notif='';
  var rotDia=rotLista("dia");
  if(rotDia.length){
    notif='<div class="cal-routine"><b>Rotina diária</b>'+rotDia.map(function(o){return '<span>'+calEsc(o.t)+'</span>';}).join('')+'</div>';
  }
  var mn=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  var toggle='<div class="calviewtoggle" role="group" aria-label="Visualização"><button type="button" data-view="mes" class="'+(calView==="mes"?"active":"")+'">Mês</button><button type="button" data-view="ano" class="'+(calView==="ano"?"active":"")+'">Ano</button></div>';
  if(calView==="ano"){
    var nav='<div class="calnav2"><button type="button" data-mn="-1" title="Ano anterior" aria-label="Ano anterior">‹</button><button type="button" data-mn="1" title="Próximo ano" aria-label="Próximo ano">›</button><span class="calnav-title">'+calYear+'</span>'+toggle+'</div>';
    var yg='<div class="yeargrid">';
    for(var mm=0;mm<12;mm++) yg+=miniMonth(calYear,mm,todayIso);
    yg+='</div>';
    host.innerHTML=notif+nav+yg;
  } else {
    var nav='<div class="calnav2"><button type="button" data-mn="-1" title="Mês anterior" aria-label="Mês anterior">‹</button><button type="button" data-mn="1" title="Próximo mês" aria-label="Próximo mês">›</button><span class="calnav-title">'+mn[calMonthOpen]+' de '+calYear+'</span><button type="button" class="cta secondary" id="calToday" style="height:34px;padding:0 14px;">Hoje</button>'+toggle+'</div>';
    host.innerHTML=notif+nav+'<div class="calsplit"><div class="calmain">'+monthGrid(new Date(calYear,calMonthOpen,1),todayIso)+'</div><div id="calday"></div></div>';
  }
  host.querySelectorAll("[data-view]").forEach(function(el){el.onclick=function(){calView=el.getAttribute("data-view");renderCalendar();};});
  host.querySelectorAll("[data-mn]").forEach(function(el){el.onclick=function(){var d=parseInt(el.getAttribute("data-mn"));if(calView==="ano"){calYear+=d;}else{calMonthOpen+=d;if(calMonthOpen<0){calMonthOpen=11;calYear--;}if(calMonthOpen>11){calMonthOpen=0;calYear++;}}selCal=null;renderCalendar();};});
  var ct=document.getElementById("calToday"); if(ct)ct.onclick=function(){ calYear=today.getFullYear(); calMonthOpen=today.getMonth(); selCal=todayIso; renderCalendar(); };
  host.querySelectorAll(".calcell[data-cal]").forEach(function(c){c.onclick=function(){var iso=c.getAttribute("data-cal");selCal=iso;renderCalendar();var n=host.querySelector('.calcell[data-cal="'+iso+'"]');if(n)n.focus({preventScroll:true});if(window.innerWidth<=1040){var dc=document.getElementById("calday");if(dc)dc.scrollIntoView({block:"nearest",behavior:"smooth"});}};});
  kbClick(".calcell[data-cal],.ycell[data-cal],.ymonth-title[data-gomon]");
  host.querySelectorAll(".ymonth-title[data-gomon]").forEach(function(t){t.onclick=function(){calMonthOpen=parseInt(t.getAttribute("data-gomon"));calView="mes";selCal=null;renderCalendar();};});
  host.querySelectorAll(".ycell[data-cal]").forEach(function(c){c.onclick=function(){var iso=c.getAttribute("data-cal");selCal=iso;calYear=parseInt(iso.split("-")[0]);calMonthOpen=parseInt(iso.split("-")[1])-1;calView="mes";renderCalendar();};});
  if(calView!=="ano") renderCalDay();
}


var TABS=[["inicio","Início"],["fluxo","Fluxo fiscal"],["processos","Processos"],["duvidas","Dúvidas"],["calendario","Calendário"],["responsaveis","Responsáveis"]];
function renderTabs(){
  document.getElementById("tabbar").innerHTML=TABS.map(function(t){var on=(tab===t[0]);return '<button type="button" class="tabbtn'+(on?" active":"")+'" data-tab="'+t[0]+'"'+(on?' aria-current="page"':'')+'>'+ico(t[0])+'<span>'+t[1]+'</span></button>';}).join("");
  document.querySelectorAll(".tabbtn").forEach(function(b){b.onclick=function(){switchTab(b.getAttribute("data-tab"));};});
  /* celular: abas roláveis; mantém a aba ativa à vista e some com o degradê no fim */
  var tb=document.getElementById("tabbar"), act=tb.querySelector(".tabbtn.active");
  function tbEnd(){ tb.classList.toggle("at-end", tb.scrollLeft+tb.clientWidth>=tb.scrollWidth-2); }
  if(tb.scrollWidth>tb.clientWidth && act){ var ar=act.getBoundingClientRect(), tr=tb.getBoundingClientRect(); tb.scrollLeft=Math.max(0, tb.scrollLeft+(ar.left-tr.left)-(tr.width-ar.width)/2); }
  tb.onscroll=tbEnd; tbEnd();
}
function switchTab(t){
  tab=t; view="hub"; stepIdx=-1; filter="";
  if(t==="fluxo")cur="recebimento";
  else if(t==="duvidas"){cur=ORDER_FAQ[0]; catOpen[P[ORDER_FAQ[0]].cat]=true;}
  else if(t==="calendario"){ cur="calendario"; var _t=new Date(); calYear=_t.getFullYear(); calMonthOpen=_t.getMonth(); selCal=calIso(_t.getFullYear(),_t.getMonth(),_t.getDate()); calCollapsed=false; }
  else if(t==="processos"){ curPF=ORDER_PROCFISC[0]; }
  else if(t==="inicio"){ muralView="mural"; histMobDet=false; }
  renderTabs(); render();
  try{ window.scrollTo(0,0); }catch(e){}
}
function wireHub(){
  var s=document.getElementById("search");
  if(s)s.oninput=function(e){filter=e.target.value;var pos=e.target.selectionStart;render();var ns=document.getElementById("search");if(ns){ns.focus();ns.setSelectionRange(pos,pos);}};
  document.querySelectorAll(".item[data-k]").forEach(function(el){el.onclick=function(){cur=el.dataset.k;render();goTopMain();};});
  document.querySelectorAll("[data-ctoggle]").forEach(function(el){el.onclick=function(){var c=el.getAttribute("data-ctoggle");catOpen[c]=!catOpen[c];render();var n=document.querySelector('[data-ctoggle="'+c+'"]');if(n)n.focus();};});
  kbClick(".item[data-k],[data-ctoggle]");
  var pr=document.getElementById("present"); if(pr)pr.onclick=function(){view="present";stepIdx=-1;render();};
  document.querySelectorAll("[data-goflux]").forEach(function(el){el.onclick=function(ev){ev.stopPropagation();goFlux(el.getAttribute("data-goflux"));};});
}
function wirePresent(){
  document.getElementById("back").onclick=function(){view="hub";stepIdx=-1;render();};
  document.getElementById("prev").onclick=function(){stepIdx=Math.max(0,stepIdx>0?stepIdx-1:0);applyHighlight();};
  document.getElementById("next").onclick=function(){stepIdx=Math.min(stepIdx+1,P[cur].steps.length-1);applyHighlight();};
  document.getElementById("showall").onclick=function(){stepIdx=-1;applyHighlight();};
  document.querySelectorAll('#flow .fnode[data-i]').forEach(function(n){
    n.style.cursor="pointer";
    var i=n.getAttribute("data-i");
    n.addEventListener("click",function(){stepIdx=parseInt(i);applyHighlight();});
  });
  applyHighlight();
}
/* ===== Página inicial — Mural do Fiscal ===== */
var NCAT={ pendencia:{l:"Pendência",b:"#D7263D",bg:"#FCE8EA",ink:"#A01B2C"},
  aviso:{l:"Aviso",b:"#184CA0",bg:"#E8EFF9",ink:"#123A7A"},
  tratativa:{l:"Em tratativa",b:"#D9A62E",bg:"#FEF3D6",ink:"#8A6D1A"} };
var NCAT_ORDER=["pendencia","aviso","tratativa"];
/* situação de pendências e tratativas: começa "em aberto" e muda a cada atualização publicada */
var NSIT={ aberto:"Em aberto", andamento:"Em andamento", resolvido:"Concluído" };
var NSIT_ORDER=["aberto","andamento","resolvido"];
var ATUAL_LIVE=[], ATUAL_OK=false;
/* "ciente": quem já viu cada publicação (tabela mural_cientes); EQUIPE = lista de acesso, para mostrar quem falta */
var CIENTES_LIVE=[], CIENTE_OK=false, EQUIPE=null, cienteAberto={};
var TXT_CONCLUIDO="Concluído.";
function getNoticias(){ if(DB_READY) return window.NOTICIAS_LIVE||[]; if(window.NOTICIAS_LIVE&&window.NOTICIAS_LIVE.length) return window.NOTICIAS_LIVE; return (typeof NOTICIAS!=="undefined"&&NOTICIAS)?NOTICIAS:[]; }
function nCat(n){ return NCAT[n.cat]?n.cat:"aviso"; }
function nKey(n){ return n._id?String(n._id):("s:"+(n.data||"")+":"+(n.titulo||"")); }
function nPorKey(k){ var L=getNoticias(); for(var i=0;i<L.length;i++){ if(nKey(L[i])===k) return L[i]; } return null; }
function isoLocal(ts){ var d=new Date(ts); if(!ts||isNaN(d)) return {d:"",h:""}; return {d:calIso(d.getFullYear(),d.getMonth(),d.getDate()), h:calPad(d.getHours())+":"+calPad(d.getMinutes())}; }
/* atualizações de um item, da mais antiga para a mais recente */
function nAtualizacoes(n){
  var L;
  if(DB_READY){ var id=String(n._id||"");
    L=ATUAL_LIVE.filter(function(u){ return String(u.noticia_id)===id; }).map(function(u){ var t=isoLocal(u.criado_em);
      return {_id:String(u.id), data:t.d, hora:t.h, ord:Date.parse(u.criado_em)||0, texto:u.texto||"", status:u.status||"", autor:u.autor||"", email:u.email||""}; });
  } else {
    L=(Array.isArray(n.atualizacoes)?n.atualizacoes:[]).map(function(u,i){ return {data:u.data||"", hora:"", ord:(Date.parse(u.data||"")||0)+i, texto:u.texto||"", status:u.status||"", autor:u.autor||""}; });
  }
  return L.sort(function(a,b){ return a.ord-b.ord; });
}
function nSitInicial(n){ return NSIT[n.status]?n.status:"aberto"; }
function nSit(n){ var s=(nCat(n)==="aviso")?"":nSitInicial(n); nAtualizacoes(n).forEach(function(u){ if(NSIT[u.status]) s=u.status; }); return s; }
function nUltimaData(n){ var a=nAtualizacoes(n); return a.length?(a[a.length-1].data||n.data||""):(n.data||""); }
function diasDesde(iso){ if(!iso) return 9999; var p=String(iso).split("-"), d=new Date(+p[0],+p[1]-1,+p[2]), h=new Date(); h=new Date(h.getFullYear(),h.getMonth(),h.getDate()); return Math.round((h-d)/864e5); }
function quandoTxt(iso){ var d=diasDesde(iso); return d===0?"hoje":(d===1?"ontem":(d>1?"há "+d+" dias":"")); }
/* o mural mostra o que está em jogo; o resto fica no histórico:
   pendências e tratativas ficam até 7 dias depois de resolvidas; avisos ficam 30 dias */
function nNoMural(n){ var s=nSit(n), d=diasDesde(nUltimaData(n)); if(!s) return d<=30; return s!=="resolvido" || d<=7; }
function sitHtml(s){ return s?'<span class="nsit s-'+s+'">'+NSIT[s]+'</span>':''; }
/* ===== Mural em tempo real (Supabase) =====
   Configuração em banco.js. Sem ela (ou sem internet para a biblioteca), o mural fica no modo manual (noticias.js). */
var DB_READY=false, DB=null;
function dbTabela(){ return (typeof SUPABASE_TABELA!=="undefined"&&SUPABASE_TABELA)?SUPABASE_TABELA:"mural_noticias"; }
function dbEnabled(){ return (typeof SUPABASE_URL!=="undefined") && /^https:\/\//.test(SUPABASE_URL||"") && (typeof SUPABASE_CHAVE!=="undefined") && !!SUPABASE_CHAVE
  && (typeof supabase!=="undefined") && !!supabase.createClient; }
function dbTabelaCiente(){ return (typeof SUPABASE_TABELA_CIENTE!=="undefined"&&SUPABASE_TABELA_CIENTE)?SUPABASE_TABELA_CIENTE:"mural_cientes"; }
function dbTabelaAt(){ return (typeof SUPABASE_TABELA_ATUAL!=="undefined"&&SUPABASE_TABELA_ATUAL)?SUPABASE_TABELA_ATUAL:"mural_atualizacoes"; }
function dbCarregar(){
  var qa=DB.from(dbTabela()).select("id,data,cat,titulo,texto,autor,email,criado_em").order("criado_em",{ascending:false}).limit(2000);
  /* atualizações: se a tabela ainda não existir (SQL da parte 3), o mural segue funcionando sem elas */
  var qb=Promise.resolve(DB.from(dbTabelaAt()).select("id,noticia_id,criado_em,texto,status,autor,email").order("criado_em",{ascending:true}).limit(10000)).then(null,function(e){ return {error:e}; });
  var qc=Promise.resolve(DB.from(dbTabelaCiente()).select("noticia_id,email,nome,criado_em").order("criado_em",{ascending:true}).limit(20000)).then(null,function(e){ return {error:e}; });
  var qe=(EQUIPE||!DB.rpc)?Promise.resolve(null):Promise.resolve(DB.rpc("equipe")).then(null,function(e){ return {error:e}; });
  return Promise.all([qa,qb,qc,qe]).then(function(rs){
    var r=rs[0], u=rs[1], c=rs[2], e=rs[3]; if(r.error) throw r.error;
    window.NOTICIAS_LIVE=(r.data||[]).map(function(o){ o._id=String(o.id); return o; });
    ATUAL_OK=!!(u&&!u.error); ATUAL_LIVE=ATUAL_OK?(u.data||[]):[];
    CIENTE_OK=!!(c&&!c.error); CIENTES_LIVE=CIENTE_OK?(c.data||[]):[];
    if(e&&!e.error&&Array.isArray(e.data)) EQUIPE=e.data;
    if(tab==="inicio") renderInicioSafe();
  });
}
/* redesenha a página inicial sem perder o que a pessoa está digitando nem a rolagem da lista do histórico */
function renderInicioSafe(){
  var a=document.activeElement, id=a&&a.id, s=null, e=null; try{ s=a.selectionStart; e=a.selectionEnd; }catch(_){}
  var sel=null;
  if(!id && a && a.getAttribute){ ["data-hsel","data-ciente","data-cientes","data-concluir","data-upd","data-hist"].some(function(at){ var v=a.getAttribute(at); if(v==null) return false;
    sel=(a.closest&&a.closest("#histDet")?"#histDet ":(a.closest&&a.closest(".nitem")?".nitem ":""))+"["+at+'="'+v.replace(/"/g,'\\"')+'"]'; return true; }); }
  var hl=document.querySelector(".hist-list"), st=hl?hl.scrollTop:0;
  render();
  var hl2=document.querySelector(".hist-list"); if(hl2) hl2.scrollTop=st;
  var n=id?document.getElementById(id):(sel?document.querySelector(sel):null);
  if(n&&n!==document.activeElement){ try{ n.focus({preventScroll:true}); if(s!=null&&n.setSelectionRange) n.setSelectionRange(s,e); }catch(_){} }
}
function initMural(){
  if(!dbEnabled()) return;
  try{
    DB=supabase.createClient(SUPABASE_URL, SUPABASE_CHAVE, {auth: loginGoogle()
      ? {persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, flowType:"pkce"}
      : {persistSession:false}});
    DB_READY=true;
    if(liberado()) dbCarregar().catch(function(e){ try{console.warn("Mural:",e&&e.message);}catch(_){} });
    /* tempo real: qualquer aviso novo ou removido atualiza o mural de todos */
    try{ var rec=function(){ if(liberado()) dbCarregar().catch(function(){}); };
      DB.channel("mural").on("postgres_changes",{event:"*",schema:"public",table:dbTabela()},rec)
        .on("postgres_changes",{event:"*",schema:"public",table:dbTabelaAt()},rec)
        .on("postgres_changes",{event:"*",schema:"public",table:dbTabelaCiente()},rec).subscribe(); }catch(e){}
    /* reserva: confere de novo a cada 2 minutos, caso a conexão em tempo real caia */
    setInterval(function(){ if(!document.hidden && liberado()) dbCarregar().catch(function(){}); }, 120000);
  }catch(e){ DB_READY=false; try{console.warn("Mural: banco indisponível",e&&e.message);}catch(_){} }
}
/* ===== Login com o Google (Supabase Auth) =====
   Ligado por LOGIN_GOOGLE=true em banco.js. A conta Google identifica quem publica;
   só contas @preventsenior.com.br entram. Sem isso, o manual usa o e-mail digitado. */
var AUTH_ON=false, AUTH_USER=null, DOMINIO="@preventsenior.com.br";
/* Acesso restrito: com LOGIN_GOOGLE ligado, o manual só abre para quem está na lista
   de acesso do banco (tabela acesso_manual). O banco confere de novo em cada leitura. */
var ACESSO=null, ACESSO_SEQ=0;
function travado(){ return loginGoogle(); }
function liberado(){ return !travado() || !!ACESSO; }
function dbTabelaAcesso(){ return (typeof SUPABASE_TABELA_ACESSO!=="undefined"&&SUPABASE_TABELA_ACESSO)?SUPABASE_TABELA_ACESSO:"acesso_manual"; }
function contatoAdmin(){ return (typeof MURAL_ADMIN!=="undefined"&&MURAL_ADMIN)?MURAL_ADMIN:""; }
function coverMsg(t,info){ var e=document.getElementById("coverEmailErr"); if(!e) return; e.textContent=t||""; e.classList.toggle("info",!!info); }
function loginGoogle(){ return (typeof LOGIN_GOOGLE!=="undefined") && LOGIN_GOOGLE===true; }
function authInit(){
  if(!DB_READY||!loginGoogle()||!DB.auth) return;
  AUTH_ON=true; coverModo(); gsiCarregar();
  DB.auth.getSession().then(function(r){ authAplicar(r&&r.data&&r.data.session); }).catch(function(){ authAplicar(null); });
  DB.auth.onAuthStateChange(function(ev,session){ if(ev==="INITIAL_SESSION") return; authAplicar(session); });
}
function authAplicar(session){
  var u=session&&session.user, em=u?emailNorm(u.email||""):"";
  var cov=document.getElementById("cover"), seq=++ACESSO_SEQ;
  if(!u){ AUTH_USER=null; ACESSO=null; setEmail(""); window.NOTICIAS_LIVE=[]; ATUAL_LIVE=[]; CIENTES_LIVE=[]; EQUIPE=null;
    if(cov&&travado()) cov.style.display="";
    coverModo(); updateEmailBadge(); render(); return; }
  if(ACESSO && ACESSO.email===em && AUTH_USER){ coverModo(); return; }   // mesma pessoa, já conferida
  /* confere na lista de acesso do banco antes de abrir o manual */
  ACESSO=null; AUTH_USER=null; coverMsg("Conferindo o acesso de "+em+"…",true); coverModo();
  Promise.resolve(DB.from(dbTabelaAcesso()).select("email,nome,admin").eq("email",em).limit(1)).then(function(r){
    if(seq!==ACESSO_SEQ) return;
    if(r&&r.error) throw r.error;
    var row=r&&r.data&&r.data[0];
    if(!row){
      ACESSO=null; AUTH_USER=null; setEmail("");
      DB.auth.signOut().catch(function(){});
      if(cov) cov.style.display="";
      coverMsg("O e-mail "+em+" não tem acesso ao Manual Fiscal."+(contatoAdmin()?" Para pedir acesso, fale com "+contatoAdmin()+".":""));
      coverModo(); updateEmailBadge(); render(); return;
    }
    var md=u.user_metadata||{};
    ACESSO={email:em, nome:row.nome||"", admin:!!row.admin};
    AUTH_USER={email:em, nome:md.full_name||md.name||row.nome||autorNome(em)};
    setEmail(em); coverMsg(""); if(cov) cov.style.display="none";
    coverModo(); updateEmailBadge(); render();
    if(DB_READY) dbCarregar().catch(function(){});
  }).catch(function(e){
    if(seq!==ACESSO_SEQ) return;
    ACESSO=null; AUTH_USER=null; if(cov) cov.style.display="";
    coverMsg("Não foi possível conferir o seu acesso agora. Confira a internet e tente de novo."+(e&&e.message?" ("+e.message+")":""));
    coverModo(); updateEmailBadge(); render();
  });
}
function authEntrar(){
  var err=document.getElementById("coverEmailErr"); coverMsg("");
  var volta=location.href.split("#")[0].split("?")[0];
  DB.auth.signInWithOAuth({provider:"google", options:{redirectTo:volta, queryParams:{prompt:"select_account"}}})
    .then(function(r){ if(r&&r.error&&err) err.textContent="Não foi possível abrir o login do Google: "+r.error.message; })
    .catch(function(e){ if(err) err.textContent="Não foi possível abrir o login do Google."; });
}
/* login ligado, mas o Supabase não carregou (internet, bloqueio): o manual fica fechado */
function travaSemLogin(){
  ["coverEmailBox","coverGoogle","coverGsi","coverBtn","coverSkip","coverConta"].forEach(function(id){ var e=document.getElementById(id); if(e) e.hidden=true; });
  var sub=document.querySelector(".cover-sub"); if(sub) sub.textContent="Acesso restrito à equipe do setor Fiscal.";
  coverMsg("Não foi possível carregar o login. Confira a internet e recarregue a página.");
  var nt=document.getElementById("coverNote"); if(nt) nt.textContent="";
  var cov=document.getElementById("cover"); if(cov) cov.style.display="";
}
function authSair(){ if(!DB||!DB.auth) return; DB.auth.signOut().then(function(){ authAplicar(null); }).catch(function(){ authAplicar(null); }); }
/* ===== Botão oficial do Google (Google Identity Services) =====
   Com GOOGLE_CLIENT_ID em banco.js, o login abre direto no Google a partir do site:
   a tela do Google mostra o endereço do manual, e não o do Supabase.
   Sem ele (ou se o Google não carregar), vale o botão próprio (login pelo Supabase). */
var GSI_OK=false, GSI_NONCE=null;
function gsiClientId(){ var c=(typeof GOOGLE_CLIENT_ID!=="undefined")?String(GOOGLE_CLIENT_ID||"").trim():""; return /\.apps\.googleusercontent\.com$/.test(c)?c:""; }
function gsiCarregar(){
  if(!AUTH_ON||!gsiClientId()||window.__gsiLoad) return; window.__gsiLoad=true;
  var sc=document.createElement("script"); sc.src="https://accounts.google.com/gsi/client"; sc.async=true; sc.onload=gsiPreparar;
  document.head.appendChild(sc);
}
/* nonce: o Google recebe o hash; o Supabase recebe o original e confere que o login é deste pedido */
function gsiNovoNonce(){
  var a=new Uint8Array(32); crypto.getRandomValues(a); var raw=btoa(String.fromCharCode.apply(null,a));
  return crypto.subtle.digest("SHA-256",new TextEncoder().encode(raw)).then(function(h){
    return {raw:raw, hash:Array.prototype.map.call(new Uint8Array(h),function(b){ return ("0"+b.toString(16)).slice(-2); }).join("")}; });
}
function gsiPreparar(){
  if(!(window.google&&google.accounts&&google.accounts.id)||!(window.crypto&&crypto.subtle)) return;
  gsiNovoNonce().then(function(n){
    GSI_NONCE=n;
    google.accounts.id.initialize({client_id:gsiClientId(), nonce:n.hash, callback:gsiResposta, auto_select:false, ux_mode:"popup"});
    GSI_OK=true; coverModo();
  }).catch(function(){});
}
function gsiBotao(){
  var box=document.getElementById("coverGsi"), g=document.getElementById("coverGoogle");
  if(!box||!GSI_OK||AUTH_USER) return;
  box.hidden=false; if(g) g.hidden=true;
  var w=Math.round((box.parentNode&&box.parentNode.clientWidth)||320); w=Math.max(220,Math.min(400,w||320));
  try{ google.accounts.id.renderButton(box,{type:"standard",theme:"outline",size:"large",text:"signin_with",shape:"rectangular",logo_alignment:"center",width:w,locale:"pt-BR"}); }
  catch(e){ box.hidden=true; if(g) g.hidden=false; }
}
function gsiResposta(r){
  var err=document.getElementById("coverEmailErr"); coverMsg("");
  if(!r||!r.credential||!DB||!DB.auth) return;
  DB.auth.signInWithIdToken({provider:"google", token:r.credential, nonce:GSI_NONCE&&GSI_NONCE.raw})
    .then(function(x){
      if(x&&x.error){ if(err) err.textContent="Não foi possível entrar: "+x.error.message; return; }
      authAplicar(x&&x.data&&x.data.session);
    })
    .catch(function(){ if(err) err.textContent="Não foi possível entrar com o Google. Tente de novo."; })
    .then(function(){ gsiPreparar(); });   // novo nonce para o próximo login
}
/* tela de entrada: mostra o botão do Google (ou a conta conectada) no lugar do campo de e-mail */
function coverModo(){
  if(!AUTH_ON) return;
  function el(id){ return document.getElementById(id); }
  var box=el("coverEmailBox"), g=el("coverGoogle"), b=el("coverBtn"), sk=el("coverSkip"), ct=el("coverConta"), nt=el("coverNote"), sub=document.querySelector(".cover-sub");
  if(box) box.hidden=true;
  if(sub) sub.textContent="Acesso restrito à equipe do setor Fiscal. Entre com a sua conta Google corporativa.";
  if(AUTH_USER){
    if(g) g.hidden=true; if(el("coverGsi")) el("coverGsi").hidden=true; if(b){ b.hidden=false; b.textContent="Continuar"; } if(sk){ sk.hidden=false; sk.textContent="Sair da conta"; }
    if(ct){ ct.hidden=false; ct.innerHTML='Conectado como<b>'+calEsc(AUTH_USER.nome)+'</b>'+calEsc(AUTH_USER.email); }
    if(nt) nt.textContent="Para entrar com outra conta, saia desta primeiro.";
  } else {
    if(GSI_OK) gsiBotao(); else if(g) g.hidden=false;
    if(b) b.hidden=true; if(sk){ sk.hidden=true; sk.textContent="Sair da conta"; } if(ct) ct.hidden=true;
    if(nt) nt.textContent="Só os e-mails autorizados entram. Não pedimos senha: o Google confirma quem você é."+(contatoAdmin()?" Para pedir acesso, fale com "+contatoAdmin()+".":"");
  }
}
function dbPublish(item){
  if(!DB_READY||!DB) return Promise.reject(new Error("banco de dados indisponível"));
  return DB.from(dbTabela()).insert({ data:item.data, cat:item.cat, titulo:item.titulo, texto:item.texto, autor:item.autor, email:item.email||"" })
    .then(function(r){ if(r.error) throw r.error; return dbCarregar(); });
}
function dbRemove(id){ if(!DB_READY||!DB||!id) return; DB.from(dbTabela()).delete().eq("id",id).then(function(){ return dbCarregar(); }).catch(function(){}); }
function dbPublishAt(u){
  if(!DB_READY||!DB) return Promise.reject(new Error("banco de dados indisponível"));
  return DB.from(dbTabelaAt()).insert({ noticia_id:Number(u.noticia_id), texto:u.texto, status:u.status||null, autor:u.autor, email:u.email||"" })
    .then(function(r){ if(r.error) throw r.error; return dbCarregar(); });
}
function dbRemoveAt(id){ if(!DB_READY||!DB||!id) return; DB.from(dbTabelaAt()).delete().eq("id",id).then(function(){ return dbCarregar(); }).catch(function(){}); }
function nEsc(s){ return calEsc(s||"").replace(/\n/g,"<br>"); }
function brFull(iso){ var p=iso.split("-"); return p[2]+"/"+p[1]+"/"+p[0]; }
function cap1(t){ t=String(t||''); return t.charAt(0).toUpperCase()+t.slice(1); }
/* teclado: Enter/Espaço acionam elementos clicáveis que não são <button> */
function kbClick(sel){ document.querySelectorAll(sel).forEach(function(el){ if(el._kb)return; el._kb=1; el.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); e.stopPropagation(); window.__kb=true; if(typeof el.click==="function") el.click(); else el.dispatchEvent(new MouseEvent("click",{bubbles:true})); window.__kb=false; } }); }); }
/* dica dos mapas: mouse (roda) ou toque (pinça / botões) */
function mapHint(first){ var touch=false; try{ touch=window.matchMedia("(pointer:coarse)").matches; }catch(e){} return first+(touch?" Arraste para mover; afaste dois dedos ou use os botões + e − para aproximar.":" Arraste para mover e use a roda do mouse para aproximar."); }
/* no celular a lista fica acima do conteúdo: depois de escolher, rola até o conteúdo */
function goTopMain(){ if(window.innerWidth>760)return; var p=document.querySelector(".panel"); if(p)p.scrollIntoView({block:"start"}); }
function goCalDay(iso){ switchTab("calendario"); var p=iso.split("-"); calYear=+p[0]; calMonthOpen=+p[1]-1; selCal=iso; calView="mes"; renderCalendar(); }
function attrEsc(s){ return calEsc(s).replace(/"/g,"&quot;"); }
/* nome de quem está logado, a partir do e-mail: rian.silva@... -> Rian Silva */
function autorNome(em){ if(!em && AUTH_USER && AUTH_USER.nome) return AUTH_USER.nome; em=em||CUREMAIL; if(!em) return ""; return em.split("@")[0].split(/[._-]+/).filter(Boolean).map(function(p){ return p.charAt(0).toUpperCase()+p.slice(1); }).join(" "); }
/* quem pode publicar: com o banco ligado, qualquer pessoa logada; sem ele, só o responsável (cópia manual) */
function muralPodePublicar(){ if(AUTH_ON) return !!AUTH_USER; return !!CUREMAIL && (DB_READY || muralIsAdmin()); }
function muralIsAdmin(){ if(AUTH_ON) return !!(ACESSO&&ACESSO.admin); return (typeof MURAL_ADMIN!=="undefined"&&MURAL_ADMIN)?(CUREMAIL===emailNorm(MURAL_ADMIN)):true; }
var MESES_MIN=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

/* ===== Minha rotina: dia / semana / mês =====
   - itens fixos do setor vêm de NOTIFS (calendario.js) e entram só na rotina do dia;
   - itens pessoais ficam no navegador, por e-mail (rotina_itens_<email>);
   - as marcações recomeçam a cada dia, a cada semana (segunda-feira) e a cada mês. */
var rotView="dia";
var ROT_VIEWS=[["dia","Dia"],["semana","Semana"],["mes","Mês"]];
function rotGetItens(){ var o={dia:[],semana:[],mes:[]}; if(!CUREMAIL) return o;
  try{ var j=JSON.parse(localStorage.getItem("rotina_itens_"+CUREMAIL)||"{}"); ["dia","semana","mes"].forEach(function(k){ if(Array.isArray(j[k])) o[k]=j[k]; }); }catch(e){}
  return o; }
function rotSetItens(o){ if(!CUREMAIL) return; try{ localStorage.setItem("rotina_itens_"+CUREMAIL,JSON.stringify(o)); }catch(e){} }
function rotMonday(d){ var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()); x.setDate(x.getDate()-((x.getDay()+6)%7)); return x; }
function rotPeriod(v){ var n=new Date();
  if(v==="semana"){ var m=rotMonday(n); return "s-"+calIso(m.getFullYear(),m.getMonth(),m.getDate()); }
  if(v==="mes") return "m-"+n.getFullYear()+"-"+calPad(n.getMonth()+1);
  return "d-"+calIso(n.getFullYear(),n.getMonth(),n.getDate()); }
function rotDoneKey(v){ return "rotina_feito_"+(CUREMAIL||"anon")+"_"+rotPeriod(v); }
function rotGetDone(v){ try{ var a=JSON.parse(localStorage.getItem(rotDoneKey(v))||"[]"); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
function rotSetDone(v,a){ try{ localStorage.setItem(rotDoneKey(v),JSON.stringify(a)); }catch(e){} }
function rotFixas(v){ if(v!=="dia"||typeof NOTIFS==="undefined"||!NOTIFS) return []; return NOTIFS.map(function(o){ return {id:"fx:"+o.t, t:o.t, d:o.d||"", fixa:true}; }); }
function rotLista(v){ return rotFixas(v).concat(rotGetItens()[v].map(function(o){ return {id:o.id, t:o.t, d:"", fixa:false}; })); }
function rotPerLabel(v){ var n=new Date(), mn=MESES_MIN;
  if(v==="semana"){ var a=rotMonday(n), b=new Date(a.getFullYear(),a.getMonth(),a.getDate()+6);
    return "Semana de "+a.getDate()+(a.getMonth()!==b.getMonth()?" de "+mn[a.getMonth()]:"")+" a "+b.getDate()+" de "+mn[b.getMonth()]+". As marcações recomeçam toda segunda-feira."; }
  if(v==="mes") return cap1(mn[n.getMonth()])+" de "+n.getFullYear()+". As marcações recomeçam no dia 1º.";
  return "Hoje, "+n.getDate()+" de "+mn[n.getMonth()]+". As marcações recomeçam todo dia."; }
function rotinaInner(){
  var v=rotView, lista=rotLista(v), done=rotGetDone(v);
  var feitas=lista.filter(function(o){ return done.indexOf(o.id)>=0; }).length;
  var nomeV={dia:"do dia",semana:"da semana",mes:"do mês"}[v];
  var h='<div class="rot-h"><h2>Minha rotina</h2>'+(lista.length?'<span class="rot-prog">'+feitas+' de '+lista.length+' concluídas</span>':'')+'</div>';
  h+='<div class="segm" role="tablist" aria-label="Período da rotina">'+ROT_VIEWS.map(function(r){ var on=(r[0]===v);
    return '<button type="button" role="tab" aria-selected="'+on+'" class="'+(on?'on':'')+'" data-rview="'+r[0]+'">'+r[1]+'</button>'; }).join('')+'</div>';
  h+='<p class="rot-per">'+rotPerLabel(v)+'</p>';
  if(lista.length){
    h+='<div class="rot-list">'+lista.map(function(o){ var on=done.indexOf(o.id)>=0;
      return '<div class="rot'+(on?' done':'')+'"><label><input type="checkbox" data-rid="'+attrEsc(o.id)+'"'+(on?' checked':'')+'><span class="rtx"><span class="rt">'+calEsc(o.t)+'</span>'+(o.d?'<span class="rd">'+calEsc(o.d)+'</span>':'')+'</span></label>'
        +(o.fixa?'<span class="rot-fixa" title="Item fixo do setor, vale para todos">Fixa</span>'
                :'<button type="button" class="rot-del" data-rdel="'+attrEsc(o.id)+'" title="Remover da rotina" aria-label="Remover “'+attrEsc(o.t)+'” da rotina">×</button>')
        +'</div>'; }).join('')+'</div>';
  } else {
    h+='<p class="rot-empty">Nada na rotina '+nomeV+' ainda.'+(CUREMAIL?' Adicione abaixo o que você faz '+(v==="dia"?"todo dia":(v==="semana"?"toda semana":"todo mês"))+'.':'')+'</p>';
  }
  if(CUREMAIL){
    h+='<form class="rot-add" id="rotAdd" autocomplete="off"><input id="rotNew" class="field" maxlength="120" placeholder="Nova tarefa '+nomeV+'" aria-label="Nova tarefa da rotina '+nomeV+'"><button type="submit" class="cta">'+ico("mais")+'Adicionar</button></form>';
  } else {
    h+='<p class="rot-login">Para montar sua própria rotina, <button type="button" class="linkbtn" id="rotLogin">entre com seu e-mail</button>.</p>';
  }
  return h;
}
function renderRotina(focusNew){
  var c=document.getElementById("rotCard"); if(!c) return;
  c.innerHTML=rotinaInner(); wireRotina();
  if(focusNew){ var i=document.getElementById("rotNew"); if(i) i.focus({preventScroll:true}); }
}
function wireRotina(){
  var c=document.getElementById("rotCard"); if(!c) return;
  c.querySelectorAll("[data-rview]").forEach(function(b){ b.onclick=function(){
    rotView=b.getAttribute("data-rview"); renderRotina();
    var nb=c.querySelector('[data-rview="'+rotView+'"]'); if(nb) nb.focus({preventScroll:true}); }; });
  c.querySelectorAll("input[data-rid]").forEach(function(cb){ cb.onchange=function(){
    var id=cb.getAttribute("data-rid"), a=rotGetDone(rotView).filter(function(x){ return x!==id; });
    if(cb.checked) a.push(id); rotSetDone(rotView,a);
    var row=cb.closest(".rot"); if(row) row.classList.toggle("done",cb.checked);
    var pg=c.querySelector(".rot-prog"); if(pg){ var all=c.querySelectorAll("input[data-rid]"), k=0; all.forEach(function(x){ if(x.checked)k++; }); pg.textContent=k+" de "+all.length+" concluídas"; }
  }; });
  c.querySelectorAll("[data-rdel]").forEach(function(b){ b.onclick=function(){
    var id=b.getAttribute("data-rdel"), o=rotGetItens();
    o[rotView]=o[rotView].filter(function(x){ return x.id!==id; }); rotSetItens(o);
    rotSetDone(rotView, rotGetDone(rotView).filter(function(x){ return x!==id; }));
    renderRotina(true); }; });
  var f=document.getElementById("rotAdd");
  if(f) f.onsubmit=function(e){ e.preventDefault();
    var i=document.getElementById("rotNew"), t=String(i.value||"").replace(/\s+/g," ").trim();
    if(!t){ i.focus(); return; }
    var o=rotGetItens(); o[rotView].push({id:"p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6), t:t.slice(0,120)});
    rotSetItens(o); renderRotina(true); };
  var lg=document.getElementById("rotLogin"); if(lg) lg.onclick=function(){ var b=document.getElementById("emailBadge"); if(b) b.click(); };
}

function inicioHtml(){
  var now=new Date();
  var todayIso=calIso(now.getFullYear(),now.getMonth(),now.getDate());
  var mn=MESES_MIN;
  var wd=["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  var wds=["dom","seg","ter","qua","qui","sex","sáb"];
  var nome=""; if(CUREMAIL){ var lp=CUREMAIL.split("@")[0].split(/[._-]/)[0]; nome=lp.charAt(0).toUpperCase()+lp.slice(1); }

  // ---- dados ----
  var vToday=(typeof VENC!=="undefined"&&VENC[todayIso])?VENC[todayIso]:[];
  var next=[], sum7=0, maxN=vToday.length;
  for(var k=1;k<=7;k++){ var dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+k); var iso=calIso(dt.getFullYear(),dt.getMonth(),dt.getDate()); if(typeof VENC!=="undefined"&&VENC[iso]){ var nn=VENC[iso].length; next.push({iso:iso,n:nn,wd:wds[dt.getDay()]}); sum7+=nn; if(nn>maxN)maxN=nn; } }
  if(maxN<1) maxN=1;
  var allN=getNoticias();
  var nPend=allN.filter(function(n){return n.cat==="pendencia" && nSit(n)!=="resolvido";}).length;
  var nTrat=allN.filter(function(n){return n.cat==="tratativa" && nSit(n)!=="resolvido";}).length;

  // ---- cabeçalho ----
  var partes=[];
  partes.push(vToday.length?(vToday.length===1?"1 fornecedor vence hoje":vToday.length+" fornecedores vencem hoje"):"nenhum fornecedor vence hoje");
  if(nPend) partes.push(nPend===1?"há 1 pendência em aberto":"há "+nPend+" pendências em aberto");
  var resumo=partes.join(" e "); resumo=resumo.charAt(0).toUpperCase()+resumo.slice(1)+".";
  var head='<div class="ini-head"><div><h1 class="ini-title">Bom trabalho'+(nome?', '+calEsc(nome):'')+'</h1><p class="ini-sub">'+resumo+'</p></div>'
    +'<div class="ini-date"><b>'+cap1(wd[now.getDay()])+'</b>'+now.getDate()+' de '+mn[now.getMonth()]+' de '+now.getFullYear()+'</div></div>';

  // ---- quadros (no estilo dos quadros de impostos da NFS-e) ----
  function box(act,label,val,cls){ return '<button type="button" class="taxbox'+(cls?' '+cls:'')+'" data-act="'+act+'"><span class="tl">'+label+'</span><span class="tv">'+val+'</span></button>'; }
  var tax='<div class="taxrow">'
    +box("hoje","Vencem hoje",vToday.length,vToday.length?"hot":"zero")
    +box("semana","Vencem nos próximos 7 dias",sum7,sum7?"":"zero")
    +box("pend","Pendências em aberto",nPend,nPend?"":"zero")
    +box("trat","Tratativas em andamento",nTrat,nTrat?"":"zero")
    +'</div>';

  if(muralView==="hist") return '<div class="panel panel-full ini">'+head+tax+histHtml()+'</div>';

  // ---- mural: filtros e ação (o aviso é escrito numa janela própria) ----
  var tools='<div class="mtools">';
  tools+='<button type="button" class="ncchip'+(inicioCat==="todos"?" on":"")+'" data-ncat="todos">Todos</button>';
  NCAT_ORDER.forEach(function(c){ tools+='<button type="button" class="ncchip'+(inicioCat===c?" on":"")+'" data-ncat="'+c+'">'+NCAT[c].l+'</button>'; });
  tools+='<span class="msep" aria-hidden="true"></span><button type="button" class="ncchip hist-chip" id="histOpen">'+ico("historico")+'Histórico</button>';
  tools+='<button type="button" class="cta" id="ncToggle" aria-haspopup="dialog">'+ico("mais")+'Publicar aviso</button>';
  tools+='</div>';
  var flash='';
  if(muralFlash){ flash='<div class="flash '+(muralFlash.ok?'ok':'err')+'" role="status">'+calEsc(muralFlash.t)+'</div>'; }

  // ---- feed: só o que está em jogo; o que foi resolvido ou é antigo fica no histórico ----
  var noMural=allN.filter(nNoMural), arq=allN.length-noMural.length;
  var list=noMural.slice();
  list.sort(function(a,b){ return String(nUltimaData(b)).localeCompare(String(nUltimaData(a))) || String(b.data||"").localeCompare(String(a.data||"")); });
  if(inicioCat!=="todos") list=list.filter(function(n){return nCat(n)===inicioCat;});
  var feed='<div class="feed" id="muralFeed">';
  if(!list.length){ feed+='<p class="nempty">'+({todos:'Nada no mural agora.',pendencia:'Nenhuma pendência no mural agora.',aviso:'Nenhum aviso no mural agora.',tratativa:'Nenhuma tratativa no mural agora.'}[inicioCat]||'Nada no mural agora.')+(arq?' O que já foi resolvido está no histórico.':'')+'</p>'; }
  list.forEach(function(n){ feed+=nitemHtml(n,todayIso); });
  feed+='</div>';
  if(arq) feed+='<p class="narch">'+(arq===1?'1 publicação resolvida ou antiga está':arq+' publicações resolvidas ou antigas estão')+' no histórico.<button type="button" class="linkbtn" id="histOpen2">Abrir o histórico</button></p>';
  var main='<section class="msheet mural-main"><div class="sec-h"><h2>Mural do setor</h2><span class="ct">'+noMural.length+(noMural.length===1?' publicação':' publicações')+'</span></div>'+tools+flash+feed+'</section>';

  // ---- lateral: vencimentos da semana ----
  function pct(n){ return Math.max(4,Math.round(n/maxN*100)); }
  var rows='<tr class="vclick'+(vToday.length?' vtoday':'')+'" data-calgo="'+todayIso+'"><td class="vd">Hoje</td><td class="vw"></td><td class="vbar"><i><b style="width:'+(vToday.length?pct(vToday.length):0)+'%"></b></i></td><td class="vn">'+vToday.length+'</td></tr>';
  next.forEach(function(d){ rows+='<tr class="vclick" data-calgo="'+d.iso+'"><td class="vd">'+calBR(d.iso)+'</td><td class="vw">'+d.wd+'</td><td class="vbar"><i><b style="width:'+pct(d.n)+'%"></b></i></td><td class="vn">'+d.n+'</td></tr>'; });
  var agenda='<section class="msheet ablock"><h2>Vencimentos da semana</h2><table class="vtable"><tbody>'+rows+'</tbody></table>'
    +(next.length?'':'<p class="dempty" style="margin:8px 0 0">Nada nos próximos 7 dias.</p>')
    +'<button type="button" class="linkbtn" id="go-cal">Abrir o calendário completo</button></section>';

  // ---- lateral: minha rotina ----
  var rot='<section class="msheet ablock rotina" id="rotCard">'+rotinaInner()+'</section>';

  return '<div class="panel panel-full ini">'+head+tax+'<div class="mural-grid">'+main+'<aside class="mural-aside">'+agenda+rot+'</aside></div></div>';
}
function wireInicio(){
  // busca opcional de notícias externas (sem redeploy) — uma vez por sessão
  if(typeof NOTICIAS_URL!=="undefined" && NOTICIAS_URL && !window._ncFetched){
    window._ncFetched=true;
    try{ fetch(NOTICIAS_URL,{cache:"no-store"}).then(function(r){return r.json();}).then(function(j){ if(Array.isArray(j)&&j.length){ window.NOTICIAS_LIVE=j; if(tab==="inicio")render(); } }).catch(function(){}); }catch(e){}
  }
  document.querySelectorAll(".ncchip[data-ncat]").forEach(function(b){ b.onclick=function(){ muralFlash=null; inicioCat=b.getAttribute("data-ncat"); render(); }; });
  var tg=document.getElementById("ncToggle"); if(tg)tg.onclick=function(){ muralFlash=null; openCompose(); };
  ["histOpen","histOpen2"].forEach(function(id){ var h=document.getElementById(id); if(h) h.onclick=function(){ openHist(null); }; });
  document.querySelectorAll("[data-hist]").forEach(function(b){ b.onclick=function(){ openHist(b.getAttribute("data-hist")); }; });
  document.querySelectorAll("[data-upd]").forEach(function(b){ b.onclick=function(){ openCompose({upd:b.getAttribute("data-upd")}); }; });
  document.querySelectorAll("[data-concluir]").forEach(function(b){ b.onclick=function(){ openCompose({upd:b.getAttribute("data-concluir"), concluir:true}); }; });
  document.querySelectorAll("[data-ciente]").forEach(function(b){ b.onclick=function(){ cienteAlternar(b.getAttribute("data-ciente")); }; });
  document.querySelectorAll(".nitem [data-cientes]").forEach(function(b){ b.onclick=function(){ var k=b.getAttribute("data-cientes"); cienteAberto[k]=!cienteAberto[k]; renderInicioSafe(); }; });
  wireHist();
  var gc=document.getElementById("go-cal"); if(gc)gc.onclick=function(){ switchTab("calendario"); };
  document.querySelectorAll("tr[data-calgo]").forEach(function(r){ r.onclick=function(){ goCalDay(r.getAttribute("data-calgo")); }; });
  document.querySelectorAll(".taxbox[data-act]").forEach(function(bx){ bx.onclick=function(){
    var a=bx.getAttribute("data-act"), n=new Date(), ti=calIso(n.getFullYear(),n.getMonth(),n.getDate());
    if(a==="hoje") goCalDay(ti);
    else if(a==="semana") switchTab("calendario");
    else { inicioCat=(a==="pend")?"pendencia":(a==="trat"?"tratativa":"todos"); muralView="mural"; muralFlash=null; render(); var f=document.getElementById("muralFeed"); if(f&&f.scrollIntoView) f.scrollIntoView({behavior:"smooth",block:"start"}); }
  }; });
  wireRotina();
  document.querySelectorAll("[data-del]").forEach(function(b){ b.onclick=function(){ if(confirm("Remover esta publicação e todo o histórico dela?")) dbRemove(b.getAttribute("data-del")); }; });
  document.querySelectorAll("[data-delat]").forEach(function(b){ b.onclick=function(){ if(confirm("Remover esta atualização do histórico?")) dbRemoveAt(b.getAttribute("data-delat")); }; });
}
/* quem pode remover: o autor ou o responsável */
function podeRemover(email){ return DB_READY && !!CUREMAIL && (muralIsAdmin() || emailNorm(email)===CUREMAIL); }
/* botão "Atualizar": com o banco, só depois do SQL da parte 3; sem ele, só o responsável (cópia manual) */
function podeAtualizar(){ return DB_READY ? ATUAL_OK : muralPodePublicar(); }
function nitemHtml(n,todayIso){
  var c=nCat(n), k=nKey(n), at=nAtualizacoes(n), s=nSit(n), u=at.length?at[at.length-1]:null;
  /* em aberto: só a bolinha na cor da categoria; em andamento e concluído seguem com o nome */
  var sit=(s==="aberto")?'<span class="ndot '+c+'" role="img" aria-label="Em aberto" title="Em aberto"></span>':sitHtml(s);
  var h='<article class="nitem"><div class="nmeta"><span class="stag '+c+'">'+NCAT[c].l+'</span>'+sit
    +'<span class="nby"><span>'+(n.autor&&n.autor!=="-"?calEsc(n.autor)+', ':'')+'<time datetime="'+calEsc(n.data||'')+'">'+(n.data?brFull(n.data):'')+'</time></span></span>'
    +(n._id&&podeRemover(n.email)?'<button class="ndel" type="button" data-del="'+attrEsc(n._id)+'" title="Remover do mural" aria-label="Remover do mural">×</button>':'')
    +'</div><h3 class="ntit"><button type="button" class="ntit-link" data-hist="'+attrEsc(k)+'" title="Ver o histórico completo">'+calEsc(n.titulo||'')+'</button></h3><p class="ntxt">'+nEsc(n.texto||'')+'</p>';
  if(u) h+='<div class="nlast"><div class="nlast-h">Última atualização, '+brFull(u.data)+(u.autor&&u.autor!=="-"?', por '+calEsc(u.autor):'')+(NSIT[u.status]?': '+NSIT[u.status].toLowerCase():'')+'</div>'+(u.texto!==TXT_CONCLUIDO?'<p>'+nEsc(u.texto)+'</p>':'')+'</div>';
  h+='<div class="nfoot">'+cienteBarra(n)+'<span class="nbtns">'+concluirHtml(n,"nbtn")
    +(podeAtualizar()?'<button type="button" class="nbtn" data-upd="'+attrEsc(k)+'">'+ico("mais")+'Atualizar</button>':'')+'</span></div>';
  if(cienteAberto[k]) h+=cientePainel(n);
  return h+'</article>';
}
/* ---- ciente ---- */
function podeCiente(){ return DB_READY && CIENTE_OK && !!AUTH_USER; }
function nCientes(n){ var id=String(n._id||""); return CIENTES_LIVE.filter(function(x){ return String(x.noticia_id)===id; }).sort(function(a,b){ return String(a.criado_em||"").localeCompare(String(b.criado_em||"")); }); }
function nomeCurto(nome,email){ var t=String(nome||"").trim(); return t?t.split(/\s+/)[0]:(autorNome(email).split(" ")[0]||email); }
function iniciais(nome,email){ var p=String(nome||autorNome(email)||"?").trim().split(/\s+/); return ((p[0]||"?").charAt(0)+(p.length>1?p[p.length-1].charAt(0):"")).toUpperCase(); }
function cienteBarra(n){
  if(!DB_READY||!CIENTE_OK||!n._id) return '<span></span>';
  var L=nCientes(n), k=nKey(n), eu=AUTH_USER?AUTH_USER.email:"", euDei=L.some(function(x){ return x.email===eu; });
  var nomes=L.map(function(x){ return x.email===eu?"Você":(x.nome||autorNome(x.email)); });
  var av=L.slice(0,5).map(function(x){ return '<i title="'+attrEsc(x.nome||x.email)+'">'+calEsc(iniciais(x.nome,x.email))+'</i>'; }).join('')+(L.length>5?'<i class="mais">+'+(L.length-5)+'</i>':'');
  var cont=L.length+(EQUIPE&&EQUIPE.length?' de '+EQUIPE.length:'');
  var dica=L.length?'Deram ciente: '+nomes.join(", ")+'. Clique para ver a lista.':'Ninguém deu ciente ainda. Clique para ver quem falta.';
  return '<span class="cbar">'
    +(podeCiente()?'<button type="button" class="cbtn'+(euDei?' on':'')+'" data-ciente="'+attrEsc(k)+'" aria-pressed="'+euDei+'" title="'+(euDei?'Você deu ciente. Clique para desfazer.':'Marcar que você viu esta publicação')+'">'+ico("check")+'Ciente</button>':'')
    +'<button type="button" class="cwho" data-cientes="'+attrEsc(k)+'" aria-expanded="'+(!!cienteAberto[k])+'" title="'+attrEsc(dica)+'" aria-label="'+attrEsc(cont+' deram ciente. '+dica)+'">'+(av?'<span class="cav">'+av+'</span>':'')+'<span class="cct">'+cont+'</span></button></span>';
}
function cientePainel(n){
  var L=nCientes(n), ja={}; L.forEach(function(x){ ja[x.email]=1; });
  var h='<div class="cpanel"><div><h4>Deram ciente ('+L.length+')</h4>';
  h+=L.length?'<ul>'+L.map(function(x){ var t=isoLocal(x.criado_em); return '<li><span>'+calEsc(x.nome||autorNome(x.email))+'</span><time>'+(t.d?calBR(t.d)+' '+t.h:'')+'</time></li>'; }).join('')+'</ul>':'<p class="vazio">Ninguém ainda.</p>';
  h+='</div>';
  if(EQUIPE){ var autor=emailNorm(n.email||""), F=EQUIPE.filter(function(x){ var e=emailNorm(x.email); return !ja[e] && e!==autor; });
    h+='<div class="falta"><h4>Ainda não deram ciente ('+F.length+')</h4>'+(F.length?'<ul>'+F.map(function(x){ return '<li><span>'+calEsc(x.nome||autorNome(x.email))+'</span></li>'; }).join('')+'</ul>':'<p class="vazio">Todo mundo já viu.</p>')+'</div>'; }
  return h+'</div>';
}
function cienteAlternar(k){
  var n=nPorKey(k); if(!n||!podeCiente()) return;
  var em=AUTH_USER.email, id=Number(n._id), tem=nCientes(n).some(function(x){ return x.email===em; });
  if(tem) CIENTES_LIVE=CIENTES_LIVE.filter(function(x){ return !(String(x.noticia_id)===String(n._id)&&x.email===em); });
  else CIENTES_LIVE.push({noticia_id:id, email:em, nome:(AUTH_USER.nome||"").slice(0,80), criado_em:new Date().toISOString()});
  renderInicioSafe();
  var q=tem?DB.from(dbTabelaCiente()).delete().eq("noticia_id",id).eq("email",em)
           :DB.from(dbTabelaCiente()).insert({noticia_id:id, email:em, nome:(AUTH_USER.nome||"").slice(0,80)});
  Promise.resolve(q).then(function(r){ if(r&&r.error) throw r.error; return dbCarregar(); })
    .catch(function(e){ muralFlash={ok:false,t:"Não foi possível registrar o ciente"+(e&&e.message?": "+e.message:"")+"."}; dbCarregar().catch(function(){ renderInicioSafe(); }); });
}
/* ---- concluir ---- */
function nConclusao(n){ var at=nAtualizacoes(n); for(var i=at.length-1;i>=0;i--){ if(at[i].status==="resolvido") return at[i]; if(NSIT[at[i].status]) return null; } return null; }
function concluirHtml(n,cls){
  var k=nKey(n);
  if(nSit(n)==="resolvido"){ var u=nConclusao(n);
    return '<span class="nconcl">'+ico("check")+'Concluído'+(u&&u.autor&&u.autor!=="-"?' por '+calEsc(nomeCurto(u.autor,u.email))+(u.data?' em '+calBR(u.data):''):'')+'</span>'; }
  return podeAtualizar()?'<button type="button" class="'+cls+' concl" data-concluir="'+attrEsc(k)+'">'+ico("check")+'Concluir</button>':'';
}

/* ===== Histórico do mural: tudo o que já foi publicado, com as atualizações de cada item ===== */
function mesNome(ym){ if(!ym) return "Sem data"; var p=ym.split("-"); return cap1(MESES_MIN[+p[1]-1]||"")+" de "+p[0]; }
function histFiltrados(){
  var toks=palNorm(histQ).trim().split(/\s+/).filter(Boolean);
  return getNoticias().filter(function(n){
    if(histCat!=="todos" && nCat(n)!==histCat) return false;
    if(histMes!=="todos" && String(n.data||"").slice(0,7)!==histMes) return false;
    if(histSit!=="todas" && nSit(n)!==histSit) return false;
    if(toks.length){ var hay=palNorm([n.titulo,n.texto,n.autor].concat(nAtualizacoes(n).map(function(u){ return u.texto+" "+u.autor; })).join(" "));
      for(var i=0;i<toks.length;i++){ if(hay.indexOf(toks[i])<0) return false; } }
    return true;
  }).sort(function(a,b){ return String(b.data||"").localeCompare(String(a.data||"")) || String(b.criado_em||"").localeCompare(String(a.criado_em||"")); });
}
function histLista(L){
  if(!L.length) return '<p class="hist-empty">Nada encontrado com esses filtros.</p>';
  var cont={}; L.forEach(function(n){ var ym=String(n.data||"").slice(0,7); cont[ym]=(cont[ym]||0)+1; });
  var h='', mes=null;
  L.forEach(function(n){ var ym=String(n.data||"").slice(0,7);
    if(ym!==mes){ if(mes!==null) h+='</div>'; mes=ym; h+='<div class="hist-grp"><h3 class="hist-mes">'+mesNome(ym)+'<span>'+cont[ym]+'</span></h3>'; }
    var k=nKey(n), at=nAtualizacoes(n), c=nCat(n), on=(k===histSel);
    h+='<button type="button" class="hrow'+(on?' on':'')+'" data-hsel="'+attrEsc(k)+'" aria-pressed="'+on+'">'
      +'<span class="hrow-m"><span class="stag '+c+'">'+NCAT[c].l+'</span>'+sitHtml(nSit(n))+'<time>'+(n.data?brFull(n.data):'')+'</time></span>'
      +'<span class="hrow-t">'+calEsc(n.titulo||'')+'</span>'
      +'<span class="hrow-s">'+(at.length?(at.length===1?'1 atualização':at.length+' atualizações')+', a última em '+brFull(at[at.length-1].data):'Sem atualizações')+'</span></button>';
  });
  return h+'</div>';
}
function histDetalhe(n){
  if(!n) return '<div class="hd-empty">'+ico("historico")+'<p>Escolha um item da lista para ver tudo o que aconteceu com ele, do começo até hoje.</p></div>';
  var c=nCat(n), s=nSit(n), at=nAtualizacoes(n), k=nKey(n), ult=nUltimaData(n), q=quandoTxt(ult), ini=(c==='aviso')?'':nSitInicial(n);
  var aut=function(a){ return a&&a!=="-"?' por '+calEsc(a):''; };
  var h='<button type="button" class="linkbtn hd-back" id="histVoltaLista">Voltar à lista</button>';
  h+='<div class="hd-top"><span class="stag '+c+'">'+NCAT[c].l+'</span>'+sitHtml(s)+'</div>';
  h+='<h3 class="hd-tit">'+calEsc(n.titulo||'')+'</h3>';
  h+='<p class="hd-meta">'+(ini?'Aberto':'Publicado')+' em '+(n.data?brFull(n.data):'-')+aut(n.autor)+'. '
    +(at.length?'Última atualização em '+brFull(ult)+(q?' ('+q+')':'')+'.':'Ainda sem atualizações.')+'</p>';
  // linha do tempo
  var hi=n.criado_em?isoLocal(n.criado_em).h:"";
  h+='<ol class="tl"><li class="tl-i '+(ini?'s-'+ini:'s-pub')+'"><div class="tl-when"><b>'+(n.data?brFull(n.data):'')+'</b>'+hi+'</div>'
    +'<div class="tl-body"><div class="tl-h"><span class="tl-dm">'+(n.data?brFull(n.data):'')+'</span>'+(ini?'Aberto':'Publicado')+aut(n.autor)+'</div><p>'+nEsc(n.texto||'')+'</p></div></li>';
  var ant=ini;
  at.forEach(function(u){
    var ok=!!NSIT[u.status], mud=ok&&u.status!==ant; if(ok) ant=u.status;
    h+='<li class="tl-i s-'+(ok?u.status:'nota')+'"><div class="tl-when"><b>'+brFull(u.data)+'</b>'+(u.hora||'')+'</div>'
      +'<div class="tl-body"><div class="tl-h"><span class="tl-dm">'+brFull(u.data)+'</span>'+(mud?'Mudou para '+sitHtml(u.status):'Atualização')+aut(u.autor)
      +(u._id&&podeRemover(u.email)?'<button type="button" class="ndel" data-delat="'+attrEsc(u._id)+'" title="Remover esta atualização" aria-label="Remover esta atualização">×</button>':'')
      +'</div>'+(u.texto!==TXT_CONCLUIDO?'<p>'+nEsc(u.texto)+'</p>':'')+'</div></li>';
  });
  h+='</ol>';
  if(DB_READY&&CIENTE_OK&&n._id) h+='<div class="hd-ciente"><div class="hd-ciente-h">'+cienteBarra(n)+'</div>'+cientePainel(n)+'</div>';
  h+='<div class="hd-act">'+concluirHtml(n,"cta secondary")+(podeAtualizar()?'<button type="button" class="cta" data-upd="'+attrEsc(k)+'">'+ico("mais")+'Adicionar atualização</button>':'')
    +'<button type="button" class="cta secondary" id="histMail">'+ico("email")+'Enviar resumo por e-mail</button>'
    +(n._id&&podeRemover(n.email)?'<button type="button" class="linkbtn hd-del" data-del="'+attrEsc(n._id)+'">Remover publicação</button>':'')+'</div>';
  return h;
}
function histHtml(){
  var L=histFiltrados(), wide=window.innerWidth>860;
  if(histSel && !L.some(function(n){ return nKey(n)===histSel; })) histSel=null;
  if(!histSel && wide && L.length) histSel=nKey(L[0]);
  var meses={}; getNoticias().forEach(function(n){ var ym=String(n.data||"").slice(0,7); if(ym) meses[ym]=1; });
  var opM='<option value="todos">Todos os meses</option>'+Object.keys(meses).sort().reverse().map(function(ym){ return '<option value="'+ym+'"'+(histMes===ym?' selected':'')+'>'+mesNome(ym)+'</option>'; }).join('');
  var opC='<option value="todos">Todas as categorias</option>'+NCAT_ORDER.map(function(c){ return '<option value="'+c+'"'+(histCat===c?' selected':'')+'>'+NCAT[c].l+'</option>'; }).join('');
  var opS='<option value="todas">Qualquer situação</option>'+NSIT_ORDER.map(function(s){ return '<option value="'+s+'"'+(histSit===s?' selected':'')+'>'+NSIT[s]+'</option>'; }).join('');
  var tot=getNoticias().length;
  return '<section class="msheet hist" id="histSec">'
    +'<div class="hist-h"><div><h2>Histórico do mural</h2><p>Tudo o que já foi publicado, mês a mês, com as atualizações de cada item. Escolha um item para ver em que pé ele está.</p></div>'
    +'<button type="button" class="cta secondary" id="histBack">Voltar ao mural</button></div>'
    +'<div class="hist-f" role="search">'
    +'<input id="histQ" class="field" type="search" placeholder="Buscar por título, texto ou pessoa" aria-label="Buscar no histórico" value="'+attrEsc(histQ)+'">'
    +'<select id="histMes" class="field" aria-label="Mês de abertura">'+opM+'</select>'
    +'<select id="histCat" class="field" aria-label="Categoria">'+opC+'</select>'
    +'<select id="histSit" class="field" aria-label="Situação">'+opS+'</select></div>'
    +'<p class="hist-ct">'+(L.length===tot?(tot===1?'1 publicação':tot+' publicações'):L.length+' de '+tot+' publicações')+'</p>'
    +'<div class="hist-body'+(histMobDet&&histSel?' det':'')+'"><div class="hist-list">'+histLista(L)+'</div>'
    +'<div class="hist-det" id="histDet" aria-live="polite">'+histDetalhe(histSel?nPorKey(histSel):null)+'</div></div>'
    +'</section>';
}
function openHist(k){
  muralView="hist"; muralFlash=null;
  if(k){ histSel=k; histMobDet=true; var n=nPorKey(k); if(n && !histFiltrados().some(function(x){ return nKey(x)===k; })){ histQ=""; histMes="todos"; histCat="todos"; histSit="todas"; } }
  else histMobDet=false;
  if(tab!=="inicio"){ tab="inicio"; view="hub"; renderTabs(); }
  render();
  var sec=document.getElementById(k&&window.innerWidth<=860?"histDet":"histSec"); if(sec&&sec.scrollIntoView) sec.scrollIntoView({block:"start"});
  var r=k?document.querySelector('.hrow[data-hsel="'+k.replace(/"/g,'\\"')+'"]'):null;
  if(r&&window.innerWidth>860){ var hl=document.querySelector(".hist-list"); if(hl) hl.scrollTop=Math.max(0,r.offsetTop-hl.offsetTop-60); }
}
function histMail(n){
  if(!n) return;
  var at=nAtualizacoes(n), s=nSit(n), c=NCAT[nCat(n)].l;
  var L=[c+(s?" ("+NSIT[s].toLowerCase()+")":"")+": "+n.titulo, "", (n.data?brFull(n.data):"")+" | "+(c!=="Aviso"?"Aberto":"Publicado")+(n.autor&&n.autor!=="-"?" por "+n.autor:""), n.texto||""];
  at.forEach(function(u){ L.push("", brFull(u.data)+(u.hora?" "+u.hora:"")+" | "+(NSIT[u.status]?NSIT[u.status]:"Atualização")+(u.autor&&u.autor!=="-"?" por "+u.autor:""), u.texto); });
  gmailAbrir("Mural do Fiscal — Histórico: "+n.titulo, L.join("\n")+"\n\n—\nResumo do histórico no Mural do Fiscal."+((typeof MURAL_LINK!=="undefined"&&MURAL_LINK)?("\nAbrir o manual: "+MURAL_LINK):""));
}
function wireHist(){
  if(!document.getElementById("histSec")) return;
  var b=document.getElementById("histBack"); if(b) b.onclick=function(){ muralView="mural"; histMobDet=false; render(); var f=document.querySelector(".mural-main"); if(f&&f.scrollIntoView) f.scrollIntoView({block:"start"}); };
  var q=document.getElementById("histQ"); if(q) q.oninput=function(){ histQ=q.value; histMobDet=false; renderInicioSafe(); };
  [["histMes",function(v){ histMes=v; }],["histCat",function(v){ histCat=v; }],["histSit",function(v){ histSit=v; }]].forEach(function(p){
    var s=document.getElementById(p[0]); if(s) s.onchange=function(){ p[1](s.value); histMobDet=false; renderInicioSafe(); }; });
  document.querySelectorAll(".hrow[data-hsel]").forEach(function(r){ r.onclick=function(){
    histSel=r.getAttribute("data-hsel"); histMobDet=true;
    if(window.innerWidth>860){ renderInicioSafe(); var d=document.getElementById("histDet"); if(d){ var t=d.getBoundingClientRect().top; if(t<0||t>window.innerHeight*0.6) d.scrollIntoView({block:"start"}); } }
    else { render(); var d2=document.getElementById("histSec"); if(d2) d2.scrollIntoView({block:"start"}); var bk=document.getElementById("histVoltaLista"); if(bk) bk.focus({preventScroll:true}); }
  }; });
  var vl=document.getElementById("histVoltaLista"); if(vl) vl.onclick=function(){ var k=histSel; histMobDet=false; render();
    var r=k?document.querySelector('.hrow[data-hsel="'+k.replace(/"/g,'\\"')+'"]'):null; if(r){ r.scrollIntoView({block:"center"}); r.focus({preventScroll:true}); } };
  var ml=document.getElementById("histMail"); if(ml) ml.onclick=function(){ histMail(histSel?nPorKey(histSel):null); };
}

/* ===== Janela "Publicar aviso" (fica fora do #root: atualizações do mural não apagam o que está sendo escrito) ===== */
var composeDraft=null, composeLast=null, composeMode=null, updDraft=null, composeOpener=null;
function composeEnsure(){
  var el=document.getElementById("compose"); if(el) return el;
  el=document.createElement("div"); el.id="compose"; el.className="mdl"; el.hidden=true;
  el.innerHTML='<div class="mdl-back"></div><div class="mdl-dlg" role="dialog" aria-modal="true" aria-labelledby="mdlTitle"><div id="mdlBody" class="mdl-in"></div></div>';
  document.body.appendChild(el);
  el.querySelector(".mdl-back").onclick=function(){ closeCompose(); };
  el.addEventListener("keydown",function(e){
    if(e.key==="Escape"){ e.preventDefault(); e.stopPropagation(); closeCompose(); return; }
    if(e.key==="Tab"){
      var f=[].slice.call(el.querySelectorAll('button:not([disabled]),input:not([type="radio"]),input[type="radio"]:checked,select,textarea')).filter(function(x){ return x.offsetParent!==null||x.type==="radio"; });
      if(!f.length) return; var a=f[0], z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){ e.preventDefault(); z.focus(); }
      else if(!e.shiftKey&&document.activeElement===z){ e.preventDefault(); a.focus(); }
    }
  });
  return el;
}
function composeVals(){
  var r=document.querySelector('#compose input[name="ncCat"]:checked');
  return { cat:r?r.value:"aviso",
    tit:String((document.getElementById("ncTit")||{}).value||"").trim(),
    txt:String((document.getElementById("ncTxt")||{}).value||"").trim() };
}
function composeMsg(t,err){ var m=document.getElementById("ncMsg"); if(!m) return; m.style.color=err?"var(--red-ink)":""; m.style.fontWeight=""; m.textContent=t; }
function composeRef(){ return composeMode&&composeMode.upd?nPorKey(composeMode.upd):null; }
function composeForm(){
  var x='<button type="button" class="mdl-x" id="mdlClose" aria-label="Fechar">×</button>';
  var ref=composeRef();
  if(!CUREMAIL){
    var tt=ref?'Atualizar':'Publicar aviso', oq=ref?'atualizar o mural':'publicar no mural';
    return '<div class="mdl-h"><div><h2 id="mdlTitle">'+tt+'</h2><p>'+(AUTH_ON?'Para '+oq+' e avisar o setor por e-mail, entre com a sua conta Google da Prevent Senior. Sai com o seu nome.':'Para '+oq+' e avisar o setor por e-mail, entre com o seu e-mail profissional. Sai com o seu nome.')+'</p></div>'+x+'</div>'
      +'<div class="mdl-f"><span id="ncMsg" class="ncmsg" role="status"></span><button type="button" class="cta secondary" id="mdlDone">Agora não</button><button type="button" class="cta" id="mdlLogin">Entrar</button></div>';
  }
  if(ref) return composeFormUpd(ref,x);
  var pub=muralPodePublicar();
  var d=composeDraft||{cat:"aviso",tit:"",txt:""};
  var adm=(typeof MURAL_ADMIN!=="undefined"&&MURAL_ADMIN)?MURAL_ADMIN:"";
  var hint = DB_READY ? 'O aviso aparece na hora para todo o setor. Depois de publicar, você pode avisar também por e-mail.'
    : (pub ? 'Publicar copia o aviso: cole no topo da lista <code>NOTICIAS</code> em <code>noticias.js</code> e publique o site.'
           : 'O mural ainda não está ligado ao banco de dados. Por enquanto, avise o setor por e-mail; o responsável'+(adm?' (<b>'+calEsc(adm)+'</b>)':'')+' publica no mural.');
  var cats=NCAT_ORDER.map(function(c){ return '<label><input type="radio" name="ncCat" value="'+c+'"'+(d.cat===c?' checked':'')+'><span><i style="background:'+NCAT[c].b+'"></i>'+NCAT[c].l+'</span></label>'; }).join('');
  return '<div class="mdl-h"><div><h2 id="mdlTitle">Publicar aviso</h2><p>'+hint+'</p></div>'+x+'</div>'
    +'<div class="mdl-b">'
    +'<span class="flabel" id="ncCatL">Categoria</span><div class="cpick" role="radiogroup" aria-labelledby="ncCatL">'+cats+'</div>'
    +'<label class="flabel" for="ncTit">Título</label><input id="ncTit" class="field" maxlength="90" placeholder="Ex.: Pedido sem saldo — BRASFILTER" value="'+attrEsc(d.tit)+'">'
    +'<label class="flabel" for="ncTxt">Recado</label><textarea id="ncTxt" class="field" rows="5" maxlength="1500" placeholder="O que o setor precisa saber ou fazer">'+calEsc(d.txt)+'</textarea>'
    +'<p class="mdl-who">Publicado por <b>'+calEsc(autorNome())+'</b> <span>('+calEsc(CUREMAIL)+')</span></p>'
    +'</div>'
    +'<div class="mdl-f"><span id="ncMsg" class="ncmsg" role="status"></span>'
    +'<button type="button" class="cta secondary" id="ncMail">'+ico("email")+'Enviar por e-mail</button>'
    +(pub?'<button type="button" class="cta" id="ncCopy">Publicar</button>':'')
    +'</div>';
}
/* atualização de um item: o que mudou e, para pendências e tratativas, a situação agora */
function composeFormUpd(n,x){
  var pub=muralPodePublicar(), s=nSit(n), k=nKey(n), cc=!!(composeMode&&composeMode.concluir), dk=k+(cc?"#c":"");
  var d=(updDraft&&updDraft.k===dk)?updDraft:{sit:s,txt:""};
  if(cc) return '<div class="mdl-h"><div><h2 id="mdlTitle">Concluir</h2><p>Marca '+(nCat(n)==="aviso"?'este aviso como concluído':'esta '+(nCat(n)==="pendencia"?'pendência':'tratativa')+' como concluída')+' para todo o setor. Fica no histórico com o seu nome.</p></div>'+x+'</div>'
    +'<div class="mdl-b"><div class="upd-ref"><span class="stag '+nCat(n)+'">'+NCAT[nCat(n)].l+'</span>'+sitHtml(s)+'<b>'+calEsc(n.titulo||'')+'</b></div>'
    +'<label class="flabel" for="ncTxt">Como foi resolvido <span class="opc">(opcional)</span></label><textarea id="ncTxt" class="field" rows="3" maxlength="1500" placeholder="Ex.: Nota lançada no dia 15. Fornecedor avisado.">'+calEsc(d.txt)+'</textarea>'
    +'<p class="mdl-who">Concluído por <b>'+calEsc(autorNome())+'</b> <span>('+calEsc(CUREMAIL)+')</span></p></div>'
    +'<div class="mdl-f"><span id="ncMsg" class="ncmsg" role="status"></span>'
    +(pub?'<button type="button" class="cta secondary" id="mdlDone">Cancelar</button><button type="button" class="cta green" id="ncCopy">'+ico("check")+'Concluir</button>':'<button type="button" class="cta secondary" id="mdlDone">Fechar</button>')+'</div>';
  var hint = DB_READY ? 'Registre o que mudou. A atualização entra no histórico deste item e aparece no mural para todo o setor.'
    : (pub ? 'Publicar copia a atualização: cole dentro de <code>atualizacoes:[ ]</code> deste item em <code>noticias.js</code> e publique o site.'
           : 'O mural ainda não está ligado ao banco de dados. Por enquanto, avise o setor por e-mail.');
  var sits=NSIT_ORDER.map(function(v){ return '<label><input type="radio" name="ncSit" value="'+v+'"'+(d.sit===v?' checked':'')+'><span><i class="d-'+v+'"></i>'+NSIT[v]+'</span></label>'; }).join('');
  return '<div class="mdl-h"><div><h2 id="mdlTitle">Atualizar</h2><p>'+hint+'</p></div>'+x+'</div>'
    +'<div class="mdl-b">'
    +'<div class="upd-ref"><span class="stag '+nCat(n)+'">'+NCAT[nCat(n)].l+'</span>'+sitHtml(s)+'<b>'+calEsc(n.titulo||'')+'</b></div>'
    +(s?'<span class="flabel" id="ncSitL">Situação agora</span><div class="cpick" role="radiogroup" aria-labelledby="ncSitL">'+sits+'</div>':'')
    +'<label class="flabel" for="ncTxt">O que mudou</label><textarea id="ncTxt" class="field" rows="4" maxlength="1500" placeholder="Ex.: Contratos ajustou o saldo do pedido. Falta lançar a nota.">'+calEsc(d.txt)+'</textarea>'
    +'<p class="mdl-who">Publicado por <b>'+calEsc(autorNome())+'</b> <span>('+calEsc(CUREMAIL)+')</span></p>'
    +'</div>'
    +'<div class="mdl-f"><span id="ncMsg" class="ncmsg" role="status"></span>'
    +'<button type="button" class="cta secondary" id="ncMail">'+ico("email")+'Enviar por e-mail</button>'
    +(pub?'<button type="button" class="cta" id="ncCopy">Publicar atualização</button>':'')
    +'</div>';
}
function composeOkUpd(u){
  var n=u._ref;
  return '<div class="mdl-h"><div><h2 id="mdlTitle">'+(u._concluir?'Concluído':'Atualização publicada')+'</h2><p>'+(u._concluir?'Marcado como concluído para todo o setor. Sai do mural em 7 dias e fica no histórico.':'Já está no histórico do item e no mural.')+'</p></div><button type="button" class="mdl-x" id="mdlClose" aria-label="Fechar">×</button></div>'
    +'<div class="mdl-b"><div class="mdl-ok"><span class="stag '+nCat(n)+'">'+NCAT[nCat(n)].l+'</span> '+sitHtml(nSit(n))+'<h3>'+calEsc(n.titulo||'')+'</h3>'+(u.texto!==TXT_CONCLUIDO?'<p>'+nEsc(u.texto)+'</p>':'')+'</div></div>'
    +'<div class="mdl-f"><span id="ncMsg" class="ncmsg" role="status" style="color:var(--ink-2);font-weight:500">Quer avisar também por e-mail?</span>'
    +'<button type="button" class="cta secondary" id="ncVerHist">'+ico("historico")+'Ver histórico</button>'
    +'<button type="button" class="cta secondary" id="ncMail">'+ico("email")+'Enviar por e-mail</button><button type="button" class="cta" id="mdlDone">Concluir</button></div>';
}
function composeOk(item){
  if(item._ref) return composeOkUpd(item);
  return '<div class="mdl-h"><div><h2 id="mdlTitle">Aviso publicado</h2><p>Já aparece no mural para todo o setor.</p></div><button type="button" class="mdl-x" id="mdlClose" aria-label="Fechar">×</button></div>'
    +'<div class="mdl-b"><div class="mdl-ok"><span class="stag '+(NCAT[item.cat]?item.cat:'aviso')+'">'+(NCAT[item.cat]||NCAT.aviso).l+'</span><h3>'+calEsc(item.titulo)+'</h3><p>'+nEsc(item.texto)+'</p></div></div>'
    +'<div class="mdl-f"><span id="ncMsg" class="ncmsg" role="status" style="color:var(--ink-2);font-weight:500">Quer avisar também por e-mail?</span>'
    +'<button type="button" class="cta secondary" id="ncMail">'+ico("email")+'Enviar por e-mail</button><button type="button" class="cta" id="mdlDone">Concluir</button></div>';
}
function gmailAbrir(assunto,corpo){
  var para=(typeof EMAILS_TIME!=="undefined"&&EMAILS_TIME&&EMAILS_TIME.length)?EMAILS_TIME.join(","):"";
  var url="https://mail.google.com/mail/?view=cm&fs=1"
    +(para?("&to="+encodeURIComponent(para)):"")
    +"&su="+encodeURIComponent(assunto)+"&body="+encodeURIComponent(corpo);
  window.open(url,"_blank");
}
function composeMail(item){
  var link=(typeof MURAL_LINK!=="undefined"&&MURAL_LINK)?("\nAbrir o manual: "+MURAL_LINK):"";
  var por=(item.autor&&item.autor!=="-"?("\nEnviado por: "+item.autor+(item.email?" ("+item.email+")":"")):"");
  if(item._ref){
    var n=item._ref, sitL=NSIT[item.status]?NSIT[item.status]:"";
    gmailAbrir("Mural do Fiscal — "+(item._concluir?"Concluído":"Atualização")+": "+n.titulo,
      (sitL?"Situação: "+sitL+"\n\n":"")+(item.texto!==TXT_CONCLUIDO?item.texto:"Marcado como concluído.")
      +"\n\n—\nReferente a: "+NCAT[nCat(n)].l+(n.data?" de "+brFull(n.data):"")+", "+n.titulo
      +"\nAtualização publicada no Mural do Fiscal."+link+por);
  } else {
    var catL=(NCAT[item.cat]||NCAT.aviso).l;
    gmailAbrir("Mural do Fiscal — "+catL+": "+item.titulo, item.texto+"\n\n—\nAtualização publicada no Mural do Fiscal."+link+por);
  }
  composeMsg("Gmail aberto em outra aba. Revise os destinatários e envie.");
}
function composeItem(){
  var ref=composeRef();
  if(ref){
    var tx=String((document.getElementById("ncTxt")||{}).value||"").trim(), sr=document.querySelector('#compose input[name="ncSit"]:checked');
    var hj=new Date(), cc=!!composeMode.concluir;
    if(!tx && !cc){ composeMsg("Escreva o que mudou.",true); var te=document.getElementById("ncTxt"); if(te) te.focus(); return null; }
    return {_ref:ref, _concluir:cc, noticia_id:ref._id||"", data:calIso(hj.getFullYear(),hj.getMonth(),hj.getDate()), texto:tx||TXT_CONCLUIDO, status:cc?"resolvido":((nSit(ref)&&sr)?sr.value:null), autor:autorNome()||"-", email:CUREMAIL};
  }
  var v=composeVals();
  if(!v.tit||!v.txt){ composeMsg("Preencha o título e o recado.",true); var e=document.getElementById(v.tit?"ncTxt":"ncTit"); if(e) e.focus(); return null; }
  var n=new Date();
  return {data:calIso(n.getFullYear(),n.getMonth(),n.getDate()), cat:v.cat, titulo:v.tit, texto:v.txt, autor:autorNome()||"-", email:CUREMAIL};
}
function composeWire(){
  var x=document.getElementById("mdlClose"); if(x) x.onclick=function(){ closeCompose(); };
  var dn=document.getElementById("mdlDone"); if(dn) dn.onclick=function(){ closeCompose(); };
  var lg=document.getElementById("mdlLogin"); if(lg) lg.onclick=function(){ closeCompose(); var b=document.getElementById("emailBadge"); if(b) b.click(); };
  var ml=document.getElementById("ncMail");
  if(ml) ml.onclick=function(){ var it=composeLast||composeItem(); if(it) composeMail(it); };
  var vh=document.getElementById("ncVerHist");
  if(vh) vh.onclick=function(){ var k=composeLast&&composeLast._ref?nKey(composeLast._ref):null; composeOpener=null; closeCompose(); openHist(k); };
  var cp=document.getElementById("ncCopy");
  if(cp) cp.onclick=function(){
    var item=composeItem(); if(!item) return;
    var upd=!!item._ref;
    if(DB_READY){
      composeMsg("Publicando…"); cp.disabled=true;
      (upd?dbPublishAt(item):dbPublish(item)).then(function(){
        if(upd) updDraft=null; else composeDraft=null;
        composeLast=item;
        var b=document.getElementById("mdlBody"); if(b){ b.innerHTML=composeOk(item); composeWire(); var d=document.getElementById("mdlDone"); if(d) d.focus(); }
      }).catch(function(err){
        cp.disabled=false;
        composeMsg("Não foi possível publicar: "+((err&&err.message)||"erro")+". Confira a configuração em banco.js.",true);
      });
      return;
    }
    // sem banco de dados: modo manual (copia o bloco para o noticias.js)
    function cl(s){ return String(s).replace(/\\/g,"").replace(/"/g,"'").replace(/\s+/g," ").trim(); }
    if(upd){
      var ue='      { data:"'+item.data+'", '+(item.status?'status:"'+item.status+'", ':'')+'texto:"'+cl(item.texto)+'", autor:"'+cl(item.autor)+'" },';
      var ud=function(){ composeMsg("Atualização copiada. Cole dentro de atualizacoes:[ ] deste item em noticias.js e publique o site."); };
      try{ navigator.clipboard.writeText(ue).then(ud,function(){ fallbackCopy(ue); ud(); }); }catch(e){ fallbackCopy(ue); ud(); }
      return;
    }
    var entry='  { data:"'+item.data+'", cat:"'+item.cat+'", titulo:"'+cl(item.titulo)+'", texto:"'+cl(item.texto)+'", autor:"'+cl(item.autor)+'" },';
    function done(){ composeMsg("Aviso copiado. Cole no topo de NOTICIAS em noticias.js e publique o site."); }
    try{ navigator.clipboard.writeText(entry).then(done,function(){ fallbackCopy(entry); done(); }); }
    catch(e){ fallbackCopy(entry); done(); }
  };
}
function openCompose(opt){
  var el=composeEnsure(); composeLast=null;
  composeMode=(opt&&opt.upd&&nPorKey(opt.upd))?{upd:opt.upd, concluir:!!opt.concluir}:null;
  var a=document.activeElement; composeOpener=(a&&a!==document.body)?{id:a.id||"", upd:a.getAttribute&&(a.getAttribute("data-upd")||a.getAttribute("data-concluir")), attr:(a.getAttribute&&a.getAttribute("data-concluir")!=null)?"data-concluir":"data-upd", inDet:!!(a.closest&&a.closest("#histDet"))}:null;
  document.getElementById("mdlBody").innerHTML=composeForm(); composeWire();
  el.hidden=false; inicioCompose=true; document.documentElement.classList.add("mdl-open");
  setTimeout(function(){ var t=composeMode?document.getElementById("ncTxt"):document.getElementById(composeDraft&&composeDraft.tit?"ncTxt":"ncTit"); t=t||document.getElementById("mdlLogin"); if(t) t.focus(); },10);
}
function closeCompose(){
  var el=document.getElementById("compose"); if(!el||el.hidden) return;
  if(!composeLast && composeMode && document.getElementById("ncTxt")){
    var tx=String(document.getElementById("ncTxt").value||"").trim(), sr=document.querySelector('#compose input[name="ncSit"]:checked');
    updDraft=tx?{k:composeMode.upd+(composeMode.concluir?"#c":""), txt:tx, sit:sr?sr.value:""}:null;
  } else if(!composeLast && document.getElementById("ncTit")){ var v=composeVals(); composeDraft=(v.tit||v.txt)?v:null; }
  el.hidden=true; inicioCompose=false; composeLast=null; composeMode=null; document.documentElement.classList.remove("mdl-open");
  /* devolve o foco para quem abriu a janela */
  var o=composeOpener, t=null; composeOpener=null;
  if(o){ if(o.id) t=document.getElementById(o.id);
    if(!t&&o.upd){ var esc=o.upd.replace(/"/g,'\\"'); t=document.querySelector((o.inDet?'#histDet ':'.nitem ')+'['+(o.attr||'data-upd')+'="'+esc+'"]')||document.querySelector('[data-upd="'+esc+'"]'); } }
  t=t||document.getElementById("ncToggle"); if(t) t.focus({preventScroll:true});
}
function fallbackCopy(t){ try{ var ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }catch(e){} }
/* ===== busca global (Ctrl+K ou /) ===== */
var PAL={open:false, items:[], view:[], act:0};
function palNorm(s){ return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(); }
function palText(html){ var d=document.createElement("div"); d.innerHTML=String(html||""); return (d.textContent||"").replace(/\s+/g," ").trim(); }
function palBuild(){
  var L=[];
  function add(g,icon,t,s,txt,go){ if(!t) return; L.push({g:g,ic:icon,t:t,s:s||"",n:palNorm(t),x:palNorm((s||"")+" "+(txt||"")),go:go}); }
  TABS.forEach(function(t){ add("Seções",t[0],t[1],"Abrir a seção","",function(){ switchTab(t[0]); }); });
  add("Ações","calendario","Vencimentos de hoje","Abre o calendário no dia de hoje","hoje vence vencimento dia",function(){ var h=new Date(); goCalDay(calIso(h.getFullYear(),h.getMonth(),h.getDate())); });
  ORDER_FLUXO.forEach(function(k){ var p=P[k]; if(!p) return;
    add("Conceitos","conceito",p.name,p.sec||"Fluxo fiscal",palText(p.lead),function(){ goFlux(k); });
    (p.steps||[]).forEach(function(st,i){ add("Conceitos","conceito",palText(st.t),p.name,palText(st.d),function(){ goFlux(k); palJumpStep(i); }); });
  });
  ORDER_PROCFISC.forEach(function(k){ var vis=(k==="visao"); add("Processos","processos",PROCFISC[k].name,vis?"Do recebimento ao fechamento do mês, em uma tela":"Mapa do processo, com os detalhes em cada etapa",vis?"fluxo completo fluxo fiscal completo mapa geral ponta a ponta todas as etapas":"",function(){ tab="processos"; view="hub"; curPF=k; pzS={k:1,tx:0,ty:0}; renderTabs(); render(); }); });
  ORDER_FAQ.forEach(function(k){ var p=P[k]; if(!p) return; var f=p.faq||{};
    add("Dúvidas","duvidas",p.name,"Dúvidas recorrentes / "+(p.cat||""),palText(f.problema)+" "+palText(f.processo)+" "+palText(f.solucao),function(){ tab="duvidas"; view="hub"; cur=k; filter=""; catOpen[p.cat]=true; renderTabs(); render(); });
  });
  if(typeof VENC!=="undefined"){
    var map={}, h=new Date(), ti=calIso(h.getFullYear(),h.getMonth(),h.getDate());
    Object.keys(VENC).forEach(function(iso){ VENC[iso].forEach(function(nm){ var key=String(nm).replace(/\s+/g," ").trim(); (map[key]=map[key]||[]).push(iso); }); });
    Object.keys(map).sort().forEach(function(nm){ var ds=map[nm].sort(), prox=ds.filter(function(d){return d>=ti;}), alvo=prox.length?prox[0]:ds[ds.length-1];
      var sub=(prox.length?"Próximo vencimento: "+brFull(prox[0]):"Último vencimento: "+brFull(alvo))+(ds.length>1?" ("+ds.length+" datas no calendário)":"");
      add("Fornecedores","fornecedor",nm,sub,"",function(){ goCalDay(alvo); });
    });
  }
  getNoticias().forEach(function(n){ var s=nSit(n), k=nKey(n);
    add("Mural","mural",n.titulo||"",NCAT[nCat(n)].l+(s?", "+NSIT[s].toLowerCase():"")+(n.data?", publicado em "+brFull(n.data):""),(n.texto||"")+" "+nAtualizacoes(n).map(function(u){ return u.texto; }).join(" "),function(){ openHist(k); }); });
  PAL.items=L;
}
function palJumpStep(i){ setTimeout(function(){ var el=document.getElementById("st-"+i); if(!el) return; try{ el.scrollIntoView({behavior:"smooth",block:"start"}); }catch(e){ el.scrollIntoView(); } el.classList.add("flash"); setTimeout(function(){ el.classList.remove("flash"); },1800); },60); }
function palSearch(q){
  var qn=palNorm(q).trim();
  if(!qn) return PAL.items.filter(function(it){ return it.g==="Seções"||it.g==="Ações"; });
  var toks=qn.split(/\s+/).filter(Boolean), res=[];
  PAL.items.forEach(function(it){
    var hay=it.n+" "+it.x; for(var i=0;i<toks.length;i++){ if(hay.indexOf(toks[i])<0) return; }
    var sc=0; if(it.n.indexOf(qn)===0) sc+=120; else if(it.n.indexOf(qn)>=0) sc+=70;
    toks.forEach(function(t){ sc+=(it.n.indexOf(t)>=0)?20:4; });
    if(it.g==="Seções") sc+=10; if(it.g==="Processos") sc+=8; if(it.g==="Dúvidas") sc+=4;
    sc-=Math.min(20,it.t.length/12);
    res.push({it:it,sc:sc});
  });
  res.sort(function(a,b){ return b.sc-a.sc; });
  var order=["Seções","Ações","Processos","Conceitos","Dúvidas","Fornecedores","Mural"], cap={"Seções":6,"Ações":3,"Processos":8,"Conceitos":8,"Dúvidas":6,"Fornecedores":10,"Mural":5}, groups={};
  res.forEach(function(r){ var g=r.it.g; groups[g]=groups[g]||[]; if(groups[g].length<(cap[g]||6)) groups[g].push(r); });
  var gs=Object.keys(groups).sort(function(a,b){ return (groups[b][0].sc-groups[a][0].sc)||(order.indexOf(a)-order.indexOf(b)); });
  var out=[]; gs.forEach(function(g){ groups[g].forEach(function(r){ out.push(r.it); }); });
  return out;
}
function palHi(text,q){
  var raw=String(text||""), norm=palNorm(raw), toks=palNorm(q).trim().split(/\s+/).filter(Boolean), marks=[];
  if(norm.length!==raw.length||!toks.length) return calEsc(raw);
  toks.forEach(function(tk){ var p=norm.indexOf(tk); if(p>=0) marks.push([p,p+tk.length]); });
  if(!marks.length) return calEsc(raw);
  marks.sort(function(a,b){ return a[0]-b[0]; });
  var out="", last=0; marks.forEach(function(m){ if(m[0]<last) return; out+=calEsc(raw.slice(last,m[0]))+"<mark>"+calEsc(raw.slice(m[0],m[1]))+"</mark>"; last=m[1]; });
  return out+calEsc(raw.slice(last));
}
function palEnsure(){
  var el=document.getElementById("palette"); if(el) return el;
  el=document.createElement("div"); el.id="palette"; el.className="pal"; el.hidden=true;
  el.innerHTML='<div class="pal-back" data-palclose></div><div class="pal-dlg" role="dialog" aria-modal="true" aria-label="Buscar no manual">'
    +'<div class="pal-in">'+ico("busca")+'<input id="palQ" type="text" placeholder="Buscar conceitos, processos, dúvidas ou fornecedores" autocomplete="off" spellcheck="false" aria-controls="palR"><kbd>Esc</kbd></div>'
    +'<div class="pal-res" id="palR" role="listbox"></div>'
    +'<div class="pal-foot"><span>↑ ↓ para navegar</span><span>Enter para abrir</span><span>Esc para fechar</span></div></div>';
  document.body.appendChild(el);
  el.querySelector("[data-palclose]").onclick=closePalette;
  var q=el.querySelector("#palQ");
  q.oninput=function(){ PAL.act=0; palRender(); };
  q.onkeydown=function(e){
    if(e.key==="ArrowDown"){ e.preventDefault(); e.stopPropagation(); PAL.act=Math.min(PAL.act+1,PAL.view.length-1); palRender(true); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); e.stopPropagation(); PAL.act=Math.max(PAL.act-1,0); palRender(true); }
    else if(e.key==="Enter"){ e.preventDefault(); e.stopPropagation(); palGo(PAL.act); }
    else if(e.key==="Escape"){ e.preventDefault(); e.stopPropagation(); closePalette(); }
    else if(e.key==="ArrowLeft"||e.key==="ArrowRight"){ e.stopPropagation(); }
  };
  return el;
}
function palRender(keep){
  var q=document.getElementById("palQ").value, box=document.getElementById("palR"), v=palSearch(q);
  PAL.view=v;
  if(!v.length){ box.innerHTML='<div class="pal-empty">Nada encontrado para “'+calEsc(q)+'”. Tente o nome do fornecedor, o nome de um processo ou uma palavra do assunto.</div>'; return; }
  var h="", lastG="";
  v.forEach(function(it,i){ if(it.g!==lastG){ h+='<div class="pal-g">'+it.g+'</div>'; lastG=it.g; }
    h+='<div class="pal-it'+(i===PAL.act?' on':'')+'" role="option" id="pal-o'+i+'" data-pi="'+i+'" aria-selected="'+(i===PAL.act)+'"><span class="pi">'+ico(it.ic)+'</span><span class="pb"><span class="pt">'+palHi(it.t,q)+'</span>'+(it.s?'<span class="ps">'+calEsc(it.s)+'</span>':'')+'</span></div>'; });
  box.innerHTML=h;
  box.querySelectorAll("[data-pi]").forEach(function(r){
    r.onmousemove=function(){ var i=+r.getAttribute("data-pi"); if(i!==PAL.act){ PAL.act=i; box.querySelectorAll(".pal-it.on").forEach(function(x){ x.classList.remove("on"); }); r.classList.add("on"); } };
    r.onclick=function(){ palGo(+r.getAttribute("data-pi")); };
  });
  var on=box.querySelector(".pal-it.on"); if(on&&keep) on.scrollIntoView({block:"nearest"});
}
function palGo(i){ var it=PAL.view&&PAL.view[i]; if(!it) return; closePalette(); try{ it.go(); }catch(e){} }
function openPalette(){
  var cov=document.getElementById("cover"); if(cov&&getComputedStyle(cov).display!=="none") return;
  var cm=document.getElementById("compose"); if(cm&&!cm.hidden) return;
  palBuild(); var el=palEnsure(); el.hidden=false; PAL.open=true; PAL.act=0;
  var q=document.getElementById("palQ"); q.value=""; palRender(); setTimeout(function(){ q.focus(); },10);
}
function closePalette(){ var el=document.getElementById("palette"); if(el) el.hidden=true; PAL.open=false; }
window.openPalette=openPalette;
document.addEventListener("keydown",function(e){
  var k=e.key;
  if((e.ctrlKey||e.metaKey)&&(k==="k"||k==="K")){ e.preventDefault(); if(PAL.open) closePalette(); else openPalette(); return; }
  if(k==="/"&&!PAL.open){ var t=e.target, tg=t&&t.tagName; if(tg==="INPUT"||tg==="TEXTAREA"||tg==="SELECT"||(t&&t.isContentEditable)) return; e.preventDefault(); openPalette(); }
},true);
function render(){
  if(!liberado()){ root.innerHTML=""; return; }
  if(view==="present"){root.innerHTML=presentHtml();wirePresent();return;}
  if(tab==="inicio"){root.innerHTML=inicioHtml();wireInicio();return;}
  if(tab==="processos"){root.innerHTML=procfiscHtml();wireProcfisc();return;}
  if(tab==="responsaveis"){root.innerHTML=responsaveisHtml();return;}
  root.innerHTML=hubHtml();
  wireHub();
}
function pgOval(cx,cy,rx,ry,f,s,tc,title,sub,gf){
  var g='<g'+(gf?' data-goflux="'+gf+'" style="cursor:pointer;"':'')+'>';
  g+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" stroke="'+s+'" stroke-width="1"/>';
  if(sub){
    g+='<text x="'+cx+'" y="'+(cy-7)+'" text-anchor="middle" dominant-baseline="central" fill="'+tc+'" font-size="15" font-weight="600" font-family="inherit">'+title+'</text>';
    g+='<text x="'+cx+'" y="'+(cy+11)+'" text-anchor="middle" dominant-baseline="central" fill="'+tc+'" font-size="12" opacity="0.85" font-family="inherit">'+sub+'</text>';
  } else { g+='<text x="'+cx+'" y="'+cy+'" text-anchor="middle" dominant-baseline="central" fill="'+tc+'" font-size="15" font-weight="600" font-family="inherit">'+title+'</text>'; }
  return g+'</g>';
}
function pgLegend(x,y){
  function sw(mx,my,f,s,dia){ return dia? '<polygon points="'+(mx+8)+','+my+' '+(mx+16)+','+(my+8)+' '+(mx+8)+','+(my+16)+' '+mx+','+(my+8)+'" fill="'+f+'" stroke="'+s+'"/>' : '<rect x="'+mx+'" y="'+my+'" width="16" height="16" rx="3" fill="'+f+'" stroke="'+s+'"/>'; }
  function tx(tX,tY,t){ return '<text x="'+tX+'" y="'+tY+'" fill="#5A5852" font-size="13.5" font-family="inherit">'+t+'</text>'; }
  var g='<rect x="'+x+'" y="'+y+'" width="740" height="130" rx="10" fill="#F5F8FC" stroke="#E3E1DA"/>';
  g+='<text x="'+(x+18)+'" y="'+(y+28)+'" fill="#4A4844" font-size="15" font-weight="600" font-family="inherit">Como ler este mapa</text>';
  var l=x+18, r=x+390, R=[y+55,y+85,y+115];
  g+=sw(l,R[0]-12,"#EDEDEA","#9A988F",false)+tx(l+26,R[0],"Óvalos cinzas: Início ou Fim do processo.");
  g+=sw(l,R[1]-12,"#E6F1FB","#185FA5",false)+tx(l+26,R[1],"Caixas azuis: Ações e Processos (clique para detalhes).");
  g+=sw(l,R[2]-12,"#FEF3D6","#D9A62E",false)+tx(l+26,R[2],"Caixas amarelas: Espera / comunicação externa (SLA).");
  g+=sw(r,R[0]-12,"#FBEFD8","#C9922E",true)+tx(r+26,R[0],"Losangos: Pontos de decisão.");
  g+=sw(r,R[1]-12,"#E7F3EC","#2E7D46",false)+tx(r+26,R[1],"Verde: Fluxo de Sucesso Ideal.");
  g+=sw(r,R[2]-12,"#FCEBEB","#D9534F",false)+tx(r+26,R[2],"Vermelho: Erros / Escalonamentos.");
  return g;
}
function pgNode(x,y,w,h,f,s,tc,title,sub,gf){
  var cx=x+w/2, g='<g'+(gf?' data-goflux="'+gf+'" style="cursor:pointer;"':'')+'>';
  g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="'+f+'" stroke="'+s+'" stroke-width="1"/>';
  if(sub){
    g+='<text x="'+cx+'" y="'+(y+h/2-8)+'" text-anchor="middle" dominant-baseline="central" fill="'+tc+'" font-size="15" font-weight="600" font-family="inherit">'+title+'</text>';
    g+='<text x="'+cx+'" y="'+(y+h/2+11)+'" text-anchor="middle" dominant-baseline="central" fill="'+tc+'" font-size="12.5" opacity="0.85" font-family="inherit">'+sub+'</text>';
  } else {
    g+='<text x="'+cx+'" y="'+(y+h/2)+'" text-anchor="middle" dominant-baseline="central" fill="'+tc+'" font-size="15" font-weight="600" font-family="inherit">'+title+'</text>';
  }
  if(gf) g+='<text x="'+(x+w-10)+'" y="'+(y+16)+'" text-anchor="end" fill="'+s+'" font-size="12">↗</text>';
  return g+'</g>';
}
function pgLine(x1,y1,x2,y2,dash){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#C9CFD8" stroke-width="1.5" marker-end="url(#arrow)"'+(dash?' stroke-dasharray="4 3"':'')+'/>';}
function pgDiamond(cx,cy,w,h,f,s,tc,title,gf){
  var pts=cx+','+(cy-h/2)+' '+(cx+w/2)+','+cy+' '+cx+','+(cy+h/2)+' '+(cx-w/2)+','+cy;
  var g='<g'+(gf?' data-goflux="'+gf+'" style="cursor:pointer;"':'')+'>';
  g+='<polygon points="'+pts+'" fill="'+f+'" stroke="'+s+'" stroke-width="1"/>';
  g+='<text x="'+cx+'" y="'+cy+'" text-anchor="middle" dominant-baseline="central" fill="'+tc+'" font-size="13.5" font-weight="600" font-family="inherit">'+title+'</text>';
  return g+'</g>';
}
function openProcFull(key){
  var order = ORDER_PROCFISC.filter(function(k){ return k!=="visao"; });
  var names = {}; order.forEach(function(k){ names[k] = (PROCFISC[k]&&PROCFISC[k].name) || k; });
  var fns=[bx,ln,elb,conv,elbBack,recLbl,di_plus,pmBW,pmBH,pmExpW,buildProcCore,buildProcMap,recMapCore,recMapSvg];
  var src=fns.map(function(f){return f.toString();}).join("\n");
  var slots = order.map(function(k){
    return '<div class="slot" id="slot_'+k+'" style="height:100%;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;">'
      +'<div style="font-size:13px;font-weight:600;color:#184CA0;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px;">'+names[k]+'</div>'
      +'<div class="slotmap" style="flex:1;min-height:0;"></div>'
      +'</div>';
  }).join('<div class="conn" style="display:flex;align-items:center;color:#C9CFD8;font-size:30px;flex:none;padding:0 6px;">&#8594;</div>');
  var js="var C="+JSON.stringify(C)+";var ARROW="+JSON.stringify(ARROW)+";var PM="+JSON.stringify(PM)+";var PROCMAP="+JSON.stringify(PROCMAP)+";var recOpen={};"
    +"var ORDER="+JSON.stringify(order)+";var TARGET="+JSON.stringify(key)+";var SLOT_H=620;"
    +src
    +";function slotSvg(k){return k===\"recebimento\"?recMapSvg():buildProcMap(PROCMAP[k]);}"
    +"function drawAll(){ORDER.forEach(function(k){var s=slotSvg(k);var m=s.match(/viewBox=\"0 0 ([0-9.]+) ([0-9.]+)\"/);var w=m?parseFloat(m[1]):1200,h=m?parseFloat(m[2]):500;var el=document.getElementById('slot_'+k);el.style.width=(SLOT_H*(w/h))+'px';el.querySelector('.slotmap').innerHTML=s;});}"
    +"function recToggle(k){recOpen[k]=!recOpen[k];drawAll();}window.recToggle=recToggle;"
    +"var pz={k:1,tx:0,ty:0};function ap(){var m=document.getElementById('map');m.style.transformOrigin='0 0';m.style.transform='translate('+pz.tx+'px,'+pz.ty+'px) scale('+pz.k+')';}"
    +"function zoomAt(x,y,f){var nk=Math.min(4,Math.max(0.25,pz.k*f));pz.tx=x-(x-pz.tx)*(nk/pz.k);pz.ty=y-(y-pz.ty)*(nk/pz.k);pz.k=nk;ap();}"
    +"function centerOn(key){var st=document.getElementById('stage'),sl=document.getElementById('slot_'+key);if(!st||!sl)return;var sr=st.getBoundingClientRect(),lr=sl.getBoundingClientRect();pz.tx += (sr.width/2)-(lr.left-sr.left)-(lr.width/2);ap();}"
    +"window.addEventListener('load',function(){drawAll();centerOn(TARGET);var st=document.getElementById('stage');"
      +"st.addEventListener('wheel',function(e){e.preventDefault();var r=st.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,e.deltaY<0?1.12:1/1.12);},{passive:false});"
      +"var dg=false,sx=0,sy=0;function nd(t){return t.closest&&(t.closest('.pzbtn')||t.closest('[onclick]'));}"
      +"st.addEventListener('mousedown',function(e){if(e.button!==0||nd(e.target))return;dg=true;sx=e.clientX-pz.tx;sy=e.clientY-pz.ty;st.style.cursor='grabbing';});"
      +"window.addEventListener('mousemove',function(e){if(!dg)return;pz.tx=e.clientX-sx;pz.ty=e.clientY-sy;ap();});"
      +"window.addEventListener('mouseup',function(){dg=false;st.style.cursor='grab';});"
      +"st.addEventListener('touchstart',function(e){if(e.touches.length!==1||nd(e.target))return;dg=true;sx=e.touches[0].clientX-pz.tx;sy=e.touches[0].clientY-pz.ty;});"
      +"st.addEventListener('touchmove',function(e){if(!dg||e.touches.length!==1)return;e.preventDefault();pz.tx=e.touches[0].clientX-sx;pz.ty=e.touches[0].clientY-sy;ap();},{passive:false});"
      +"st.addEventListener('touchend',function(){dg=false;});"
      +"document.querySelectorAll('.pzbtn').forEach(function(b){b.onclick=function(){var z=b.getAttribute('data-z');if(z==='reset'){pz.k=1;pz.tx=0;pz.ty=0;ap();centerOn(TARGET);}else{var r=st.getBoundingClientRect();zoomAt(r.width/2,r.height/2,z==='in'?1.25:1/1.25);}};});"
    +"});";
  var BTN="width:38px;height:38px;border-radius:9px;border:1px solid #E1E5EC;background:#fff;font-size:19px;line-height:1;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.12);color:#184CA0;";
  var html='<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Processos Fiscais — Fluxo completo</title>'
    +'<style>*{box-sizing:border-box}body{margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#EEF2F7;color:#1F2A37}'
    +'header{padding:14px 24px;background:#184CA0;color:#fff}header h1{margin:0;font-size:18px;font-weight:600}header p{margin:3px 0 0;font-size:12.5px;opacity:.85}'
    +'#filmstrip{display:flex;align-items:center;height:100%;padding:0 80px;gap:0;}'
    +'.slotmap svg{width:100%;height:100%;display:block;}</style></head>'
    +'<body><header><h1>Processos Fiscais — fluxo completo</h1><p>Arraste para o lado para percorrer todos os processos, em sequência. Toque nos + para abrir as ramificações. Roda/botões para zoom.</p></header>'
    +'<div id="stage" style="position:relative;height:calc(100vh - 62px);overflow:hidden;cursor:grab;">'
    +'<div id="map" style="position:absolute;top:0;left:0;height:100%;transform-origin:0 0;"><div id="filmstrip">'+slots+'</div></div>'
    +'<div style="position:absolute;right:18px;bottom:18px;display:flex;flex-direction:column;gap:8px;z-index:5;">'
    +'<button class="pzbtn" data-z="in" style="'+BTN+'">+</button>'
    +'<button class="pzbtn" data-z="out" style="'+BTN+'">\u2212</button>'
    +'<button class="pzbtn" data-z="reset" style="'+BTN+'">\u21BA</button></div>'
    +'</div>'
    +'<scr'+'ipt>'+js+'</scr'+'ipt></body></html>';
  var w=window.open("","_blank");
  if(w){w.document.open();w.document.write(html);w.document.close();}
  else alert("Permita pop-ups para abrir em nova aba.");
}

var C = {
    bl: ["#E6F1FB", "#185FA5", "#0C447C"],
    gr: ["#E7F3EC", "#2E7D46", "#1E5B32"],
    wa: ["#FEF3D6", "#D9A62E", "#6E5312"],
    rd: ["#FCEBEB", "#D9534F", "#8A2A26"],
    no: ["#F5F8FC", "#D8DCE3", "#4A5568"],
    gy: ["#F5F8FC", "#9AA1AC", "#1F2A37"],
    tl: ["#E4F2F1", "#2C8078", "#1B5049"]
};
var recOpen={};
window.recToggle=function(k){recOpen[k]=!recOpen[k];render();
  if(window.__kb){ window.__kb=false; var el=document.querySelector('#pcmap .pl[data-pk="'+k+'"]'); if(el) el.focus({preventScroll:true}); } };
function ln(x1, y1, x2, y2, dash) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function elb(x1, y1, x2, y2, dash) { var mx = x1 + 20; return '<path d="M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2 + '" fill="none" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function conv(x1, y1, mx, y2, x2, dash) { return '<path d="M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2 + '" fill="none" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function elbBack(x1, y1, mx, y2, x2, dash) { return '<path d="M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2 + '" fill="none" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function recLbl(x, y, anc, t) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + anc + '" fill="#8A8780" font-size="12.5" font-weight="600" font-family="inherit">' + t + '</text>'; }
function bx(x, y, w, h, c, title, sub, plus, on, gopf) {
    /* título longo quebra em duas linhas para não passar da caixa */
    function lines(t, max) { t = String(t); if (t.length <= max) return [t]; var mid = Math.floor(t.length / 2);
        for (var d = 0; d < mid; d++) { if (t.charAt(mid - d) === ' ') return [t.slice(0, mid - d), t.slice(mid - d + 1)]; if (t.charAt(mid + d) === ' ') return [t.slice(0, mid + d), t.slice(mid + d + 1)]; }
        return [t]; }
    function tx(ty, t, fs, fw, extra) { return '<text x="' + cx + '" y="' + ty + '" text-anchor="middle" fill="' + c[2] + '" font-size="' + fs + '"' + (fw ? ' font-weight="' + fw + '"' : '') + (extra || '') + '>' + t + '</text>'; }
    var cx = x + w / 2, r = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1"/>';
    var L = lines(title, Math.floor((w - (plus ? 44 : 26)) / 7.7));
    if (sub) {
        if (L.length > 1) r += tx(y + h / 2 - 13, L[0], 13, 600) + tx(y + h / 2 + 2, L[1], 13, 600) + tx(y + h / 2 + 17, sub, 10.5, 0, ' opacity=".85"');
        else r += tx(y + h / 2 - 7, title, 14, 600) + tx(y + h / 2 + 10, sub, 11, 0, ' opacity=".85"');
    } else if (L.length > 1) {
        r += tx(y + h / 2 - 8, L[0], 13.5, 600, ' dominant-baseline="central"') + tx(y + h / 2 + 9, L[1], 13.5, 600, ' dominant-baseline="central"');
    } else {
        r += tx(y + h / 2, title, 14, 600, ' dominant-baseline="central"');
    }
    if (plus) {
        var px = x + w - 13, py = y + h - 13;
        r += '<g class="pl" data-pk="' + plus + '" tabindex="0" role="button" aria-label="' + (on ? 'Fechar' : 'Abrir') + ' os detalhes" onclick="recToggle(\'' + plus + '\')" style="cursor:pointer"><circle cx="' + px + '" cy="' + py + '" r="11" fill="' + (on ? c[1] : "#fff") + '" stroke="' + c[1] + '" stroke-width="1.3"/><text x="' + px + '" y="' + (py + 1) + '" text-anchor="middle" dominant-baseline="central" fill="' + (on ? "#fff" : c[1]) + '" font-size="15" font-weight="700">' + (on ? "–" : "+") + '</text></g>';
    }
    if (gopf) return '<g data-gopf="'+gopf+'" style="cursor:pointer">'+r+'</g>';
    return r;
}
function di_plus(cx, cy, w, h, c, title, plus, on) {
    var pts = cx + ',' + (cy - h / 2) + ' ' + (cx + w / 2) + ',' + cy + ' ' + cx + ',' + (cy + h / 2) + ' ' + (cx - w / 2) + ',' + cy;
    var r = '<polygon points="' + pts + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1"/>';
    r += '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="central" fill="' + c[2] + '" font-size="13.5" font-weight="600" font-family="inherit">' + title + '</text>';
    if (plus) {
        var px = cx + w / 2 - 15, py = cy + h / 2 - 15;
        r += '<g class="pl" data-pk="' + plus + '" tabindex="0" role="button" aria-label="' + (on ? 'Fechar' : 'Abrir') + ' os detalhes" onclick="recToggle(\'' + plus + '\')" style="cursor:pointer"><circle cx="' + px + '" cy="' + py + '" r="11" fill="' + (on ? c[1] : "#fff") + '" stroke="' + c[1] + '" stroke-width="1.3"/><text x="' + px + '" y="' + (py + 1) + '" text-anchor="middle" dominant-baseline="central" fill="' + (on ? "#fff" : c[1]) + '" font-size="15" font-weight="700">' + (on ? "–" : "+") + '</text></g>';
    }
    return r;
}
function recMapCore(opt) {
    opt = opt || {};
    var s = "";
    var yM = 100; 
    var boxW = 220; 
    
    var xServ = 20; 
    var xAtiva = 320; 
    var xNota = 1100; 
    var xFim = 1450;
    var max_y = 300;

    // 1. MACRO: Serviços
    s += bx(xServ, yM, boxW, 60, C.bl, "Serviços nas unidades", "sede · núcleos · hospitais");
    s += elb(xServ+boxW, yM+30, xAtiva, yM-10); // Sobe pra Ativa
    s += elb(xServ+boxW, yM+30, xAtiva, yM+70); // Desce pra Passiva
    
    // 2. MACRO: Canais 
    var yAtiva = yM - 40;
    var yPassiva = yM + 40;
    
    s += bx(xAtiva, yAtiva, 240, 60, C.bl, "Busca ATIVA", "por contrato · e-mail · portais", "rec_ativa", recOpen["rec_ativa"]);
    s += bx(xAtiva, yPassiva, 260, 60, C.bl, "Busca PASSIVA", "JIRA — a nota chega", "rec_passiva", recOpen["rec_passiva"]);
    
    var cxEnc = xAtiva + 240 + 80; 
    var childX = cxEnc + 30;        
    
    if (!recOpen["rec_ativa"] && !recOpen["rec_passiva"]) {
        xNota = xAtiva + 240 + 60;
        s += conv(xAtiva+240, yAtiva+30, cxEnc-40, yM+30, xNota);
        s += conv(xAtiva+260, yPassiva+30, cxEnc-40, yM+30, xNota);
    } else {
        var right_edges = [];
        var max_x_canais = xAtiva + 240 + 60;
        var curY = yAtiva; 
        var aX = xAtiva + 280; 

        // --- BUSCA ATIVA ---
        if (recOpen["rec_ativa"]) {
            
            // A. CONTRATO
            s += elb(xAtiva+240, yAtiva+30, aX, curY+30);
            s += bx(aX, curY, 200, 60, C.no, "Buscar por contrato", "planilha de contratos", "bus_ct", recOpen["bus_ct"]);
            var rX = aX + 200;
            if (recOpen["bus_ct"]) {
                var qX = rX + 40;
                s += ln(rX, curY+30, qX, curY+30);
                
                // JÁ ABRE A PERGUNTA E AS RESPOSTAS (Sem botão + aqui)
                s += di_plus(qX+100, curY+30, 200, 80, C.wa, "Tem acesso à planilha?", null, null);
                
                // Sim (frente)
                s += ln(qX+200, curY+30, qX+250, curY+30) + recLbl(qX+225, curY+20, "start", "sim");
                s += bx(qX+250, curY, 200, 60, C.gr, "Filtre pela unidade", "coluna responsável");
                s += ln(qX+450, curY+30, qX+490, curY+30);
                s += bx(qX+490, curY, 200, 60, C.bl, "Buscar por fornecedor", "");
                right_edges.push({x: qX+690, y: curY});
                max_x_canais = Math.max(max_x_canais, qX+690);
                
                // Não (baixo)
                s += elb(qX+100, curY+70, qX+150, curY+110) + recLbl(qX+125, curY+85, "start", "não");
                s += bx(qX+150, curY+80, 180, 60, C.rd, "Solicitar acesso", "");
                right_edges.push({x: qX+330, y: curY+80});
                max_x_canais = Math.max(max_x_canais, qX+330);
                
                curY += 180; 
            } else {
                right_edges.push({x: aX+200, y: curY});
                curY += 80;
            }

            // B. E-MAIL
            var cy_em = curY;
            s += elb(xAtiva+240, yAtiva+30, aX, cy_em+30);
            s += bx(aX, cy_em, 200, 60, C.no, "E-mail do Fiscal", "canal principal", "bus_em", recOpen["bus_em"]);
            var rX_em = aX + 200;
            if (recOpen["bus_em"]) {
                var qX = rX_em + 40;
                s += ln(rX_em, cy_em+30, qX, cy_em+30);
                s += di_plus(qX+100, cy_em+30, 200, 80, C.wa, "Tem dados/senha?", null, null);
                
                // Sim
                s += ln(qX+200, cy_em+30, qX+250, cy_em+30) + recLbl(qX+225, cy_em+20, "start", "sim");
                s += bx(qX+250, cy_em, 200, 60, C.gr, "Acessar e-mail", "fiscal.preventsenior...");
                s += ln(qX+450, cy_em+30, qX+490, cy_em+30);
                s += bx(qX+490, cy_em, 260, 60, C.bl, "Pesquisar (Fornecedor/CNPJ)", "buscar o mais próximo");
                right_edges.push({x: qX+750, y: cy_em});
                max_x_canais = Math.max(max_x_canais, qX+750);
                
                // Não
                s += elb(qX+100, cy_em+70, qX+150, cy_em+110) + recLbl(qX+125, cy_em+85, "start", "não");
                s += bx(qX+150, cy_em+80, 180, 60, C.rd, "Solicitar ao resp.", "");
                right_edges.push({x: qX+330, y: cy_em+80});
                max_x_canais = Math.max(max_x_canais, qX+330);
                
                curY += 180;
            } else {
                right_edges.push({x: aX+200, y: curY});
                curY += 80;
            }

            // C. PORTAIS
            var cy_pt = curY;
            s += elb(xAtiva+240, yAtiva+30, aX, cy_pt+30);
            s += bx(aX, cy_pt, 200, 60, C.no, "Portais", "milhão, arquivei, etc", "bus_pt", recOpen["bus_pt"]);
            var rX_pt = aX + 200;
            if (recOpen["bus_pt"]) {
                var qX = rX_pt + 40;
                s += ln(rX_pt, cy_pt+30, qX, cy_pt+30);
                s += di_plus(qX+100, cy_pt+30, 200, 80, C.wa, "Tem acesso?", null, null);
                
                // Sim -> Escolha do Portal
                s += ln(qX+200, cy_pt+30, qX+250, cy_pt+30) + recLbl(qX+225, cy_pt+20, "start", "sim");
                s += bx(qX+250, cy_pt, 160, 60, C.gr, "Acessar Link", "");
                
                var bifurcX = qX + 450;
                // Milhao (sobe)
                s += elb(qX+410, cy_pt+30, bifurcX, cy_pt-10);
                s += bx(bifurcX, cy_pt-40, 160, 60, C.tl, "Nota do Milhão", "");
                s += ln(bifurcX+160, cy_pt-10, bifurcX+200, cy_pt-10);
                s += bx(bifurcX+200, cy_pt-40, 180, 60, C.no, "Escolhe Unidade", "NF's recebidas");
                right_edges.push({x: bifurcX+380, y: cy_pt-40});
                max_x_canais = Math.max(max_x_canais, bifurcX+380);
                
                // Arquivei (desce)
                s += elb(qX+410, cy_pt+30, bifurcX, cy_pt+70);
                s += bx(bifurcX, cy_pt+40, 160, 60, C.tl, "Arquivei", "");
                s += ln(bifurcX+160, cy_pt+70, bifurcX+200, cy_pt+70);
                s += bx(bifurcX+200, cy_pt+40, 240, 60, C.no, "Relatórios Adv > NFS-e", "Filtra unidade");
                right_edges.push({x: bifurcX+440, y: cy_pt+40});
                max_x_canais = Math.max(max_x_canais, bifurcX+440);
                
                // Não
                s += elb(qX+100, cy_pt+70, qX+150, cy_pt+130) + recLbl(qX+125, cy_pt+85, "start", "não");
                s += bx(qX+150, cy_pt+100, 180, 60, C.rd, "Solicitar acesso", "");
                right_edges.push({x: qX+330, y: cy_pt+100});
                max_x_canais = Math.max(max_x_canais, qX+330);
                
                curY += 200;
            } else {
                right_edges.push({x: aX+200, y: curY});
                curY += 80;
            }

            // D. DRIVE
            var cy_dr = curY;
            s += elb(xAtiva+240, yAtiva+30, aX, cy_dr+30);
            s += bx(aX, cy_dr, 200, 60, C.no, "Pasta Drive (Nicolas)", "esporádico, locação", "bus_dr", recOpen["bus_dr"]);
            var rX_dr = aX + 200;
            if (recOpen["bus_dr"]) {
                var qX = rX_dr + 40;
                s += ln(rX_dr, cy_dr+30, qX, cy_dr+30);
                // No questions here, directly opens
                s += bx(qX, cy_dr, 260, 60, C.gr, "Drive > Pasta com seu nome", "");
                s += ln(qX+260, cy_dr+30, qX+300, cy_dr+30);
                s += bx(qX+300, cy_dr, 280, 60, C.bl, "Buscar tipo", "contrato, locação, esporádico");
                right_edges.push({x: qX+580, y: cy_dr});
                max_x_canais = Math.max(max_x_canais, qX+580);
                curY += 80;
            } else {
                right_edges.push({x: aX+200, y: curY});
                curY += 80;
            }
            
            // Espinha Dorsal Visual
            s = '<path d="M'+(xAtiva+240)+' '+(yAtiva+30)+' H'+(aX-20)+' V'+(curY-50)+'" fill="none" stroke="#C9CFD8" stroke-width="1.6"/>' + s;
        } else {
            right_edges.push({x: xAtiva+240, y: yAtiva});
        }

        // --- BUSCA PASSIVA ---
        if (recOpen["rec_passiva"]) {
            var pY = Math.max(yPassiva, typeof curY !== 'undefined' ? curY : yPassiva); 
            var pX = xAtiva + 300;
            s += elb(xAtiva+260, yPassiva+30, pX, pY+30);
            
            s += bx(pX, pY, 280, 60, C.no, "Nota esporádica / JIRA", "unidade abre o chamado e a nota chega");
            right_edges.push({x: pX+280, y: pY});
            max_x_canais = Math.max(max_x_canais, pX+280);
            curY = pY + 80;
        } else {
            curY = Math.max(curY, yPassiva + 80);
        }
        
        // MACRO: Nota Localizada (Calculando o X baseando em tudo que foi aberto)
        if(recOpen["rec_ativa"]) max_x_canais = Math.max(max_x_canais, (xAtiva+280)+200);
        xNota = max_x_canais + 120;
        var cxEnc2 = xNota - 60;

        // Coletor (Funnels everything to Nota Localizada)
        right_edges.forEach(function(edge) {
            s += conv(edge.x, edge.y + 30, cxEnc2, yM + 30, xNota);
        });
        
        // Liga as macros nao abertas direto
        if(!recOpen["rec_ativa"]) s += conv(xAtiva+240, yAtiva+30, cxEnc2, yM+30, xNota);
        if(!recOpen["rec_passiva"]){
          if(recOpen["rec_ativa"]) s += '<path d="M'+(xAtiva+260)+' '+(yPassiva+30)+' V'+curY+' H'+cxEnc2+' V'+(yM+30)+' H'+xNota+'" fill="none" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"/>';
          else s += conv(xAtiva+260, yPassiva+30, cxEnc2, yM+30, xNota);
        }
    }

    // 3. MACRO: Nota Localizada
    s += bx(xNota, yM, 220, 60, C.gr, "Nota Localizada", "em contrato", "rec_falha", recOpen["rec_falha"]);
    var max_x_falha = xNota + 220;
    
    if (recOpen["rec_falha"]) {
        var fX = xNota;
        var fY = Math.max(yM + 100, typeof curY !== "undefined" ? curY : 0); 
        
        s += elb(xNota+110, yM+60, fX, fY+30);
        s += bx(fX, fY, 240, 60, C.rd, "Nota não encontrada", "falha na busca inicial", null, null);
        s += ln(fX+240, fY+30, fX+280, fY+30);
        s += bx(fX+280, fY, 220, 60, C.wa, "Revisitar buscas", "e-mail · portal", null, null);
        s += ln(fX+500, fY+30, fX+540, fY+30);
        
        s += di_plus(fX+630, fY+30, 180, 80, C.wa, "Encontrou?", null, null);
        
        // Sim Volta
        var retX = xNota + 1100; 
        s += elbBack(fX+720, fY+30, fX+770, yM+30, xNota+220+80, true) + recLbl(fX+735, fY+20, "start", "sim (volta)");
        
        // Nao Desce
        var fY2 = fY + 120;
        s += elb(fX+630, fY+70, fX+520, fY2+30) + recLbl(fX+645, fY+90, "start", "não");
        s += bx(fX+520, fY2, 240, 60, C.wa, "E-mail ao fornecedor", "SLA de 3 dias", null, null);
        s += ln(fX+760, fY2+30, fX+800, fY2+30);
        s += di_plus(fX+890, fY2+30, 180, 80, C.wa, "Enviou?", null, null);
        
        // Sim Volta
        s += elbBack(fX+980, fY2+30, fX+1030, yM+30, xNota+220+80, true) + recLbl(fX+995, fY2+20, "start", "sim (volta)");
        
        // Nao Desce
        var fY3 = fY2 + 120;
        s += elb(fX+890, fY2+70, fX+800, fY3+30) + recLbl(fX+905, fY2+90, "start", "não");
        s += bx(fX+800, fY3, 240, 60, C.rd, "Escalonar pendência", "comunicar gestor", null, null);
        
        max_x_falha = fX + 1100;
        max_y = fY3 + 100;
    } else {
        max_y = Math.max(250, (typeof curY !== "undefined" ? curY : 0) + 50);
    }

    // 4. MACRO: Fim
    xFim = Math.max(xNota + 220 + 120, max_x_falha + 40);
    if (!opt.overview) s += bx(xFim, yM, 240, 60, C.gy, "Classificação da nota", "próximo passo", null, false, "classificacao");
    s += ln(xNota+220, yM+30, xFim, yM+30); // Linha Macro Principal
    
    // Retornos das Falhas
    if (recOpen["rec_falha"]) {
        var fX = xNota;
        var fY = Math.max(yM + 100, typeof curY !== "undefined" ? curY : 0);
        s += conv(fX+720, fY+30, xFim-40, yM+30, xFim, true) + recLbl(fX+730, fY+20, "start", "sim (volta)");
        if (recOpen["rec_err2"]) {
            var fY2 = fY + 120;
            s += conv(fX+980, fY2+30, xFim-30, yM+30, xFim, true) + recLbl(fX+990, fY2+20, "start", "sim (volta)");
        }
    }

    var wTotal = opt.overview ? xFim : xFim + 300;
    return { s: s, w: wTotal, h: max_y, hc: max_y - 40, cy: yM + 30, top: 48, exitX: xFim };
}
function recMapSvg() { var r = recMapCore(); return '<svg viewBox="0 0 ' + r.w + ' ' + r.h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">' + ARROW + r.s + '</svg>'; }

function classMapSvg(){
  var Of="#EDEDEA",Os="#9A988F",Ot="#4A4844", Bf="#E6F1FB",Bs="#185FA5",Bt="#0C447C", Df="#FBEFD8",Ds="#C9922E",Dt="#6B4A12", Gf="#E7F3EC",Gs="#2E7D46",Gt="#1E5B32", Rf="#FCEBEB",Rs="#D9534F",Rt="#8A2A26";
  function lbl(x,y,anc,t){return '<text x="'+x+'" y="'+y+'" text-anchor="'+anc+'" fill="#8A8780" font-size="12.5" font-family="inherit">'+t+'</text>';}
  var f="";
  f+=pgNode(250,166,220,68,Bf,Bs,Bt,"Identificar o tipo","conforme contrato / pedido","classificacao");
  f+=pgLine(470,200,528,200);
  f+=pgDiamond(600,200,150,92,Df,Ds,Dt,"Qual o tipo?");
  f+=pgLine(672,200,698,99)+pgLine(675,200,698,201)+pgLine(672,200,698,303);
  f+=pgNode(700,70,190,58,Bf,Bs,Bt,"Contrato fixo","");
  f+=pgNode(700,172,190,58,Bf,Bs,Bt,"Esporádica","vem da unidade (JIRA)");
  f+=pgNode(700,274,190,58,Bf,Bs,Bt,"Contrato variável","");
  f+=pgLine(890,99,934,99);
  f+=pgDiamond(1030,99,196,82,Df,Ds,Dt,"Divergência > R$ 0,99?");
  f+=pgLine(1128,99,1248,99)+lbl(1188,89,"middle","sim");
  f+=pgNode(1250,68,220,62,Rf,Rs,Rt,"Abrir chamado Contratos","divergência");
  f+=pgLine(890,303,934,303);
  f+=pgDiamond(1030,303,180,80,Df,Ds,Dt,"Fora da média?");
  f+=pgLine(1120,303,1248,303)+lbl(1184,293,"middle","sim");
  f+=pgNode(1250,272,220,62,Rf,Rs,Rt,"Investigar divergência","");
  f+=pgNode(1250,171,210,62,Gf,Gs,Gt,"Nota classificada","pronta para análise");
  f+=pgLine(1030,140,1248,190,false)+lbl(1120,150,"start","não");
  f+=pgLine(1030,263,1248,214,false)+lbl(1120,262,"start","não");
  f+=pgLine(890,201,1248,202);
  f+=pgLine(1360,130,1355,169,true)+lbl(1368,152,"start","resolvido");
  f+=pgLine(1360,272,1355,235,true);
  f+=pgLine(1460,202,1480,202);
  f+=pgOval(1560,202,78,42,Of,Os,Ot,"Segue Análise","","analise");
  var s='<svg viewBox="0 0 1460 620" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;">'+ARROW;
  s+='<g transform="translate(-190,0)">'+f+'</g>';
  s+=pgLegend(60,430);
  return s+'</svg>';
}
/* ===== motor genérico dos Processos Fiscais (padrão fluido + "+") ===== */
var PROCMAP={
  carimbo:{ main:[
    {t:"Análise concluída", sub:"conferência prévia", c:"bl"},
    {t:"Preencher o carimbo", sub:"dados e retenções", c:"bl", plus:"ca_pr", branches:[
      {t:"Empresa: BR11 (antigo) / BR14 (atual)", c:"no"},
      {t:"Fornecedor · Simples · situação", c:"no"},
      {t:"Retenções: ISS · IR · INSS", c:"wa"}
    ]},
    {t:"Código de imposto (IVA)", sub:"define a retenção no SAP", c:"bl"},
    {t:"Código de controle (SAP)", sub:"quais impostos serão retidos", c:"bl"},
    {t:"Conferir carimbo", sub:"bate com o líquido?", c:"bl", plus:"ca_cf", branches:[
      {t:"Conferir o valor líquido", sub:"", c:"no", q:"Está correto?", sim:[{t:"Gerar e aplicar", c:"gr"}], nao:[{t:"Revisar o carimbo", c:"rd"}]}
    ]},
    {t:"Segue para lançamento", sub:"próximo passo", c:"gy", goPF:"lancamento"}
  ]},
  lancamento:{ main:[
    {t:"Tipo de documento", sub:"serviço · MEI · telecom · fatura", c:"bl"},
    {t:"Tipo da nota", sub:"S6 / S5 / T1", c:"bl"},
    {t:"Vencimento", sub:"definir em PAGAMENTO", c:"bl"},
    {t:"Simular", sub:"verificação final", c:"bl"},
    {t:"Gravar", sub:"confirma o lançamento", c:"gr"},
    {t:"Armazenamento", sub:"próximo passo", c:"gy", goPF:"armazenamento"}
  ]},
  armazenamento:{ main:[
    {t:"Quando salvar", sub:"carimbada · lançada · chamado aberto", c:"bl", plus:"ar_er", branches:[
      {t:"Não salvar sem código da unidade ou nº da NF", c:"rd"},
      {t:"Não errar o número da NF", c:"rd"},
      {t:"Não esquecer de salvar após o SAP", c:"rd"}
    ]},
    {t:"Caminho da pasta", sub:"unidade · ano · mês", c:"bl", plus:"ar_ca", branches:[
      {t:"Notas Fiscais (F:) › NF BR14", c:"no"},
      {t:"› Unidade › Ano › Mês", c:"no"},
      {t:"› Fiscal / Contas a Pagar", c:"no"}
    ]},
    {t:"Padrão do nome", sub:"[Unidade] - [Fornecedor] NF [nº]", c:"bl", plus:"ar_nm", branches:[
      {t:"Nº da unidade = 4 últimos do CNPJ do tomador", c:"no"},
      {t:"Ex.: 0030 - HOPEFLEX NF 2165", c:"gr"}
    ]},
    {t:"Contas a Pagar pega", sub:"efetua o pagamento", c:"bl"},
    {t:"Concluído", sub:"fim do armazenamento", c:"gr", goPF:"fechamento"}
  ]},
  fechamento:{ main:[
    {t:"O que é a planilha", sub:"controle dos contratos", c:"bl", plus:"fc_col", branches:[
      {t:"Colunas: pedido · BR11/BR14 · CNPJ · fornecedor", c:"no"},
      {t:"Valor mensal · fixo/variável · fiscal responsável", c:"no"},
      {t:"Uma coluna por mês (jan–dez) com o nº da NF", c:"no"}
    ]},
    {t:"Registrar pela emissão", sub:"data de emissão", c:"bl", plus:"fc_reg", branches:[
      {t:"O nº da nota vai na coluna do mês de EMISSÃO", c:"no"},
      {t:"Emitida em julho → coluna de julho", c:"gr"}
    ]},
    {t:"Fechar o mês", sub:"tudo preenchido", c:"bl"},
    {t:"Concluído", sub:"controle atualizado", c:"gr"}
  ]},
  classificacao:{ main:[
    {t:"Identificar o tipo", sub:"serviço · locação · telecom", c:"bl", plus:"cl_id", branches:[
      {t:"Nota de serviço", sub:"o caso mais comum", c:"no", plus:"cl_serv", img:{src:(typeof PRINT_SERV!=="undefined"?PRINT_SERV:""),w:289,h:420}},
      {t:"Locação", sub:"bens ou imóveis", c:"no", plus:"cl_loc", img:{src:(typeof PRINT_LOC!=="undefined"?PRINT_LOC:""),w:375,h:420}},
      {t:"Telecomunicação", sub:"telefonia · internet", c:"no", plus:"cl_tel", img:{src:(typeof PRINT_TEL!=="undefined"?PRINT_TEL:""),w:451,h:420}}
    ]},
    {t:"Qual o tipo?", sub:"fixo · variável · esporádica", c:"bl", plus:"cl_tipo", branches:[
      {t:"Contrato fixo", sub:"valor fixo mensal", c:"no", plus:"cl_fix", noteH:215,
        note:"O <b>pedido de compra</b> é o documento do SAP que autoriza e controla o pagamento da nota.<br><br>No <b>contrato fixo</b>, o pedido tem <b>uma linha para cada mês</b>, todas com o mesmo valor, até o próximo reajuste.<br><br><b>Regra crítica:</b> a diferença aceitável é de até <b>R$ 0,99</b>; acima disso, não lançar e abrir chamado para Contratos.<br><br><span style='color:#184CA0;cursor:pointer;text-decoration:underline;font-weight:600;' onclick='window.goConcCls&&window.goConcCls()'>Ver conceito completo &#8594;</span>",
        imgs:[{src:(typeof PRINT_FIX!=="undefined"?PRINT_FIX:""),w:600,h:273}]},
      {t:"Contrato variável", sub:"varia por demanda", c:"no", plus:"cl_var", noteH:210,
        note:"No <b>contrato variável</b>, o pedido é <b>uma linha só</b> com um <b>saldo</b> (quantidade/valor) que vai sendo consumido conforme as notas chegam e são lançadas. No print, há um único item com a quantidade total contratada.<br><br>Mesmo variável, o contrato tem <b>histórico e média</b> de faturamento — confira se o valor da nota está coerente com essa média antes de lançar.<br><br><span style='color:#184CA0;cursor:pointer;text-decoration:underline;font-weight:600;' onclick='window.goConcCls&&window.goConcCls()'>Ver conceito completo &#8594;</span>",
        imgs:[{src:(typeof PRINT_VAR!=="undefined"?PRINT_VAR:""),w:600,h:71}]},
      {t:"Esporádica", sub:"eventual / avulsa", c:"no", plus:"cl_esp", noteH:240,
        note:"A <b>nota esporádica</b> é um serviço pontual, fora de contrato. Ela <b>sempre traz o número do pedido no corpo da nota</b> — o <b>PEDIDO DE COMPRA</b> (1º print, destacado na discriminação).<br><br>Esse é o <b>pedido esporádico</b>: no SAP ele aparece como <b>uma linha única</b> (2º print). A unidade envia a nota ao Fiscal pelo <b>JIRA, já autorizada</b> — o Fiscal não abre chamado de aprovação.<br><br><span style='color:#184CA0;cursor:pointer;text-decoration:underline;font-weight:600;' onclick='window.goConcCls&&window.goConcCls()'>Ver conceito completo &#8594;</span>",
        imgs:[{src:(typeof PRINT_ESP_NOTA!=="undefined"?PRINT_ESP_NOTA:""),w:330,h:347},{src:(typeof PRINT_ESP_PED!=="undefined"?PRINT_ESP_PED:""),w:600,h:72}]}
    ]},
    {t:"Análise da nota", sub:"próximo passo", c:"gy", goPF:"analise"}
  ]},
  analise:{ main:[
    {t:"Prestador", sub:"quem emitiu a nota", c:"bl", plus:"an_pr", branches:[
      {t:"CNPJ ativo e razão social na Receita", c:"no"},
      {t:"Município de prestação define o ISS", c:"no"},
      {t:"Optante do Simples muda a retenção", c:"wa"},
      {t:"Onde conferir na nota", sub:"abrir o print", c:"no", plus:"an_pr_img", ph:{w:330,h:200,label:"Print do cabeçalho da nota (prestador) — a incluir"}}
    ]},
    {t:"Tomador", sub:"para quem foi o serviço", c:"bl", plus:"an_to", branches:[
      {t:"Confirmar a unidade pela nota e pelo pedido", c:"no"},
      {t:"Faturar para o local onde o serviço foi executado", c:"no"}
    ]},
    {t:"Serviço", sub:"o que foi prestado", c:"bl", plus:"an_se", branches:[
      {t:"Código de serviço bate com a descrição", c:"no"},
      {t:"Conferir o valor total da nota", c:"no"},
      {t:"Onde conferir na nota", sub:"abrir o print", c:"no", plus:"an_se_img", ph:{w:330,h:200,label:"Print da discriminação e do código de serviço — a incluir"}}
    ]},
    {t:"Impostos e retenção", sub:"Lei nº 116 de 2003", c:"bl", plus:"an_im", branches:[
      {t:"O código de serviço define as regras da nota", c:"no"},
      {t:"Nem todo imposto destacado é retido", c:"wa"},
      {t:"Quem define: código de serviço e regime do prestador", c:"no"},
      {t:"Onde conferir na nota", sub:"abrir o print", c:"no", plus:"an_im_img", ph:{w:330,h:200,label:"Print dos tributos e retenções — a incluir"}}
    ]},
    {t:"Há divergência?", sub:"conferência final", c:"bl", plus:"an_ok", branches:[
      {t:"Discriminação, valores e retenções", sub:"", c:"no", q:"Está tudo certo?", sim:[{t:"Segue para o carimbo", c:"gr"}], nao:[{t:"Valor ou cadastro errado → reemitir", c:"rd"},{t:"Só a descrição → carta de correção", c:"wa"}]}
    ]},
    {t:"Carimbo", sub:"próximo passo", c:"gy", goPF:"carimbo"}
  ]},
  chamados:{ main:[
    {t:"Precisa de chamado?", sub:"quando abrir", c:"bl", plus:"ch_q", branches:[
      {t:"Aprovar nota de contrato variável", c:"no"},
      {t:"Inconsistência no pedido → Contratos", c:"no"},
      {t:"Esporádica: Fiscal NÃO abre (a unidade abre)", c:"rd"}
    ]},
    {t:"Caso 1 — Aprovar nota", sub:"contrato variável", c:"bl", plus:"ch_c1", branches:[
      {t:"A nota vai à unidade pelo JIRA", c:"no"},
      {t:"Só lançar no SAP após a aprovação", c:"wa"}
    ]},
    {t:"Caso 2 — Chamado p/ Contratos", sub:"inconsistência", c:"bl", plus:"ch_c2", branches:[
      {t:"Sempre nº do pedido + motivo", c:"no"},
      {t:"Vencimento (V:) para a triagem", c:"no"},
      {t:"\"Validação NF\" no título quando sem contrato", c:"no"}
    ]},
    {t:"Acompanhar status", sub:"nada pode vencer", c:"bl", plus:"ch_st", branches:[
      {t:"Aguardando unidade → cobrar", c:"wa"},
      {t:"Responsabilidade do Fiscal acompanhar", c:"rd"}
    ]},
    {t:"Resolvido", sub:"segue o fluxo", c:"gr"}
  ]}
};
var PM={NW:220,NH:60,GX:60,BW:230,BH:54,DW:190,DH:76,OW:200,GAP:20,CY:120};
function pmBW(b){ var base=PM.BW;
  if(b.plus && !recOpen[b.plus]) return base;
  if(b.imgs){ var sw=0; b.imgs.forEach(function(im){ sw=Math.max(sw,im.w); }); return base+30+330+24+sw; }
  if(b.ph){ return base+30+b.ph.w; }
  if(b.img){ return base+30+b.img.w; }
  if(b.q){ var sw=0,nw=0; (b.sim||[]).forEach(function(){sw+=PM.OW+PM.GAP;}); (b.nao||[]).forEach(function(){nw+=PM.OW+PM.GAP;}); return base+30+PM.DW+PM.GAP+Math.max(sw,nw); }
  if(b.chain){ var w=base; b.chain.forEach(function(){w+=PM.GAP+PM.OW;}); return w; }
  return base; }
function pmBH(b){ if(b.plus && !recOpen[b.plus]) return PM.BH; if(b.imgs){ var sh=0; b.imgs.forEach(function(im,ii){ sh+=im.h+(ii?16:0); }); return Math.max(b.noteH||160,sh,PM.BH); } if(b.ph) return Math.max(PM.BH,b.ph.h); if(b.img) return Math.max(PM.BH,b.img.h); if(b.q) return PM.BH + ((b.nao&&b.nao.length)?86:0); return PM.BH; }
function pmExpW(n){ if(!n.plus||!recOpen[n.plus]||!n.branches) return 0; var w=0; n.branches.forEach(function(b){w=Math.max(w,pmBW(b));}); return PM.NW/2 + 22 + w; }
function buildProcCore(spec,opt){
  opt=opt||{};
  var main=spec.main; if(opt.dropNext&&main.length&&main[main.length-1].goPF) main=main.slice(0,-1);
  var s="", CY=PM.CY, x=20, maxX=0, maxY=CY+90, pts=[];
  main.forEach(function(n){ pts.push({x:x,n:n}); x += Math.max(PM.NW, pmExpW(n)) + PM.GX; });
  pts.forEach(function(p,i){
    var n=p.n, nx=p.x, ny=CY-PM.NH/2;
    s += bx(nx,ny,PM.NW,PM.NH,C[n.c],n.t,n.sub||"",n.plus||null,n.plus?recOpen[n.plus]:false,n.goPF||null);
    maxX=Math.max(maxX,nx+PM.NW);
    if(i<pts.length-1) s += ln(nx+PM.NW, CY, pts[i+1].x, CY);
    if(n.plus && recOpen[n.plus] && n.branches){
      var trunkX=nx+PM.NW/2, branchX=nx+PM.NW/2+22, by=CY+72, lastY=by+PM.BH/2;
      n.branches.forEach(function(b){
        var midY=by+PM.BH/2; lastY=midY;
        s += ln(trunkX, midY, branchX, midY);
        s += bx(branchX,by,PM.BW,PM.BH,C[b.c],b.t,b.sub||"",b.plus||null,b.plus?recOpen[b.plus]:false);
        var bOpen=!b.plus||recOpen[b.plus];
        var rx=branchX+PM.BW;
        if(bOpen && b.q){
          s += ln(rx,midY,rx+30,midY);
          var dcx=rx+30+PM.DW/2, dcy=midY;
          s += di_plus(dcx,dcy,PM.DW,PM.DH,C.wa,b.q,null,null);
          var dR=rx+30+PM.DW, sx=dR+PM.GAP;
          s += ln(dR,dcy,sx,dcy) + recLbl(dR+8,dcy-10,"start","sim");
          (b.sim||[]).forEach(function(o,j){ if(j) s+=ln(sx-PM.GAP,midY,sx,midY); s+=bx(sx,by,PM.OW,PM.BH,C[o.c],o.t,o.sub||"",null,false); sx+=PM.OW+PM.GAP; });
          maxX=Math.max(maxX,sx);
          var ny2=by+PM.BH+32;
          (b.nao||[]).forEach(function(o,j){
            var nxp=rx+30 + j*(PM.OW+PM.GAP);
            if(j===0) s+=elb(dcx, dcy+PM.DH/2, nxp, ny2+PM.BH/2)+recLbl(dcx+6, dcy+PM.DH/2+14,"start","não");
            else s+=ln(nxp-PM.GAP,ny2+PM.BH/2,nxp,ny2+PM.BH/2);
            s+=bx(nxp,ny2,PM.OW,PM.BH,C[o.c],o.t,o.sub||"",null,false);
            maxX=Math.max(maxX,nxp+PM.OW);
          });
        } else if(bOpen && b.chain){
          var cx=rx;
          b.chain.forEach(function(o){ s+=ln(cx,midY,cx+PM.GAP,midY); cx+=PM.GAP; s+=bx(cx,by,PM.OW,PM.BH,C[o.c],o.t,o.sub||"",null,false); cx+=PM.OW; });
          maxX=Math.max(maxX,cx);
        } else if(bOpen && b.ph){
          var px=rx+30, py=by;
          s += ln(rx,midY,px,midY);
          s += '<rect x="'+px+'" y="'+py+'" width="'+b.ph.w+'" height="'+b.ph.h+'" rx="10" fill="#F7F8FA" stroke="#B9C0CC" stroke-width="1.5" stroke-dasharray="7 5"/>';
          s += '<foreignObject x="'+px+'" y="'+py+'" width="'+b.ph.w+'" height="'+b.ph.h+'">'
            +'<div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing:border-box;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px;text-align:center;font:13px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#5B6672;">'
            +'<div style="font-size:26px;line-height:1;">\u{1F5BC}</div><div>'+(b.ph.label||"Print — a incluir")+'</div></div>'
            +'</foreignObject>';
          maxX=Math.max(maxX,px+b.ph.w);
        } else if(bOpen && b.img && b.img.src){
          var ix=rx+30, iy=by;
          s += ln(rx,midY,ix,midY);
          s += '<rect x="'+ix+'" y="'+iy+'" width="'+b.img.w+'" height="'+b.img.h+'" rx="8" fill="#FFFFFF" stroke="#D6D4CC" stroke-width="1"/>';
          s += '<image href="'+b.img.src+'" x="'+(ix+6)+'" y="'+(iy+6)+'" width="'+(b.img.w-12)+'" height="'+(b.img.h-12)+'" preserveAspectRatio="xMidYMid meet"/>';
          maxX=Math.max(maxX,ix+b.img.w);
        } else if(bOpen && b.imgs){
          var cardW=330, gap=24, cx0=rx+30;
          var stackW=0, stackH=0; b.imgs.forEach(function(im,ii){ stackW=Math.max(stackW,im.w); stackH+=im.h+(ii?16:0); });
          var rowH=Math.max(b.noteH||160, stackH, PM.BH);
          s += ln(rx,midY,cx0,midY);
          s += '<foreignObject x="'+cx0+'" y="'+by+'" width="'+cardW+'" height="'+rowH+'">'
            +'<div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing:border-box;width:100%;height:100%;border:1px solid #D6D4CC;border-radius:10px;background:#FFFFFF;padding:12px 14px;font:13px/1.55 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#26303A;overflow:hidden;">'+b.note+'</div>'
            +'</foreignObject>';
          var imgX=cx0+cardW+gap, iy2=by;
          b.imgs.forEach(function(im){
            if(!im.src) return;
            s += '<rect x="'+imgX+'" y="'+iy2+'" width="'+im.w+'" height="'+im.h+'" rx="8" fill="#FFFFFF" stroke="#D6D4CC" stroke-width="1"/>';
            s += '<image href="'+im.src+'" x="'+(imgX+6)+'" y="'+(iy2+6)+'" width="'+(im.w-12)+'" height="'+(im.h-12)+'" preserveAspectRatio="xMidYMid meet"/>';
            iy2 += im.h+16;
          });
          maxX=Math.max(maxX, imgX+stackW);
        }
        by += pmBH(b)+18;
      });
      s += '<path d="M'+trunkX+' '+(CY+PM.NH/2)+' V'+lastY+'" fill="none" stroke="#C9CFD8" stroke-width="1.6"/>';
      maxY=Math.max(maxY,by);
    }
  });
  return {s:s, w:maxX, h:Math.max(maxY,CY+90), hc:(maxY>CY+90?maxY:CY+PM.NH/2+14), cy:CY, top:CY-PM.NH/2, exitX:(pts.length?pts[pts.length-1].x+PM.NW:20)};
}
function buildProcMap(spec){ var r=buildProcCore(spec); var W=r.w+40, H=r.h;
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">'+ARROW+r.s+'</svg>'; }
/* ===== Processos: visão geral = o fluxo completo, interativo =====
   Cada etapa é desenhada pelo mesmo motor do seu processo (Recebimento e os demais),
   uma abaixo da outra, ligadas por conectores numerados. Os "+" abrem os detalhes aqui mesmo. */
var VF_ROWS=[
  {k:"recebimento", n:1, s:"Onde a nota chega e como localizá-la."},
  {k:"classificacao", n:2, s:"Tipo da nota e do pedido de compra."},
  {k:"analise", n:3, s:"Prestador, tomador, serviço e impostos."},
  {k:"carimbo", n:4, s:"Retenções, IVA e código de controle."},
  {k:"lancamento", n:5, s:"Tipo de documento, vencimento, simular e gravar."},
  {k:"armazenamento", n:6, s:"PDF salvo na pasta da rede, no padrão."},
  {k:"fechamento", n:7, s:"Registro da nota e fechamento do mês."},
  {k:"chamados", apoio:true, s:"Usado quando a nota precisa de aprovação da unidade ou há divergência no pedido."}
];
var VF_SHORT={recebimento:"Recebimento",classificacao:"Classificação",analise:"Análise",carimbo:"Carimbo",lancamento:"Lançamento",armazenamento:"Armazenamento",fechamento:"Planilha",chamados:"Chamados"};
var VF_POS=[];
var VF_CSS=".vf-fo{box-sizing:border-box;width:100%;height:100%;font-family:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif}"
  +".vf-band{display:flex;align-items:center;gap:12px;padding:0 22px;color:#172235;white-space:nowrap}"
  +".vf-n{flex:none;width:28px;height:28px;border-radius:50%;background:#185FA5;color:#fff;font-size:14px;font-weight:700;line-height:28px;text-align:center}"
  +".vf-tag{flex:none;height:26px;padding:0 11px;border-radius:13px;border:1.5px solid #2C8078;color:#1B5049;font-size:12.5px;font-weight:600;line-height:23px}"
  +".vf-tt b{display:block;font-size:16px;font-weight:600;line-height:1.2}"
  +".vf-tt span{display:block;margin-top:3px;font-size:12.5px;line-height:1.3;color:#5A6676}"
  +".vf-lk{flex:none;margin-left:22px;color:#1A4FA3;font-size:13px;font-weight:600;cursor:pointer}"
  +".vf-lk:hover{text-decoration:underline}"
  +".vf-lk:focus{outline:none}.vf-lk:focus-visible{outline:2px solid #1A4FA3;outline-offset:3px;border-radius:3px}"
  +".vf-c{font-size:11.5px;fill:#5F6B7A}"
  +".vf .pl:focus{outline:none}.vf .pl:focus-visible circle{stroke-width:3}";
function vfNames(){ var o={}; VF_ROWS.forEach(function(r){ o[r.k]=(typeof PROCFISC!=="undefined"&&PROCFISC[r.k]&&PROCFISC[r.k].name)||r.k; }); return o; }
/* ===== Visão geral: as etapas emendadas num único fluxo, da esquerda para a direita,
   desenhadas pelo mesmo motor de cada processo (mesmas caixas, linhas e "+"). ===== */
var VF_POS={};
function vfAllKeys(){
  var ks=["rec_ativa","rec_passiva","bus_ct","bus_em","bus_pt","bus_dr","rec_falha"];
  VF_ROWS.forEach(function(r){ var sp=PROCMAP[r.k]; if(!sp||r.apoio) return;
    sp.main.forEach(function(n){ if(n.plus) ks.push(n.plus); (n.branches||[]).forEach(function(b){ if(b.plus) ks.push(b.plus); }); }); });
  return ks;
}
function visaoLinhaCore(){
  var HEAD=56, GAP=64, PAD=24, segs=[], CYL=0;
  VF_ROWS.forEach(function(r){ if(r.apoio) return;
    var g=(r.k==="recebimento") ? recMapCore({overview:true}) : buildProcCore(PROCMAP[r.k],{dropNext:true});
    segs.push({r:r, g:g}); CYL=Math.max(CYL, g.cy); });
  var x=PAD-20, b='', H=0, pos={}, CY=HEAD+CYL;
  segs.forEach(function(sg,i){
    var g=sg.g, r=sg.r, dy=CY-g.cy, x0=x;
    /* título da etapa, discreto, acima do trecho */
    b+='<text x="'+(x0+20)+'" y="'+(PAD+10)+'" fill="#185FA5" font-size="13" font-weight="700" font-family="inherit">'+r.n+'. '+VF_SHORT[r.k]+'</text>'
      +'<text x="'+(x0+20)+'" y="'+(PAD+28)+'" fill="#7B8696" font-size="12" font-family="inherit">'+r.s+' <tspan data-gopf="'+r.k+'" fill="#1A4FA3" font-weight="600" style="cursor:pointer">Abrir o processo ↗</tspan></text>';
    if(i) b+='<line x1="'+(x0-GAP/2+10)+'" y1="'+PAD+'" x2="'+(x0-GAP/2+10)+'" y2="'+(PAD+34)+'" stroke="#E1E6ED" stroke-width="1"/>';
    b+='<g transform="translate('+x0+','+dy+')">'+g.s+'</g>';
    pos[r.k]=x0;
    H=Math.max(H, dy+g.h);
    var ex=x0+g.exitX;
    if(i<segs.length-1){
      if(r.k==="recebimento") x=ex-20;                 /* o Recebimento já termina com a seta: a etapa seguinte começa na ponta dela */
      else { var nx=ex+GAP; b+=ln(ex, CY, nx+20, CY); x=nx; } }
    else { b+=ln(ex, CY, ex+40, CY)+'<circle cx="'+(ex+54)+'" cy="'+CY+'" r="12" fill="#FFFFFF" stroke="#172235" stroke-width="3.5"/><text x="'+(ex+54)+'" y="'+(CY+31)+'" text-anchor="middle" fill="#5F6B7A" font-size="12" font-family="inherit">Fim</text>'; x=ex+90; }
  });
  var W=Math.ceil(x+PAD); H=Math.ceil(H+PAD);
  var svg='<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Visão geral do processo fiscal" style="display:block">'+ARROW
    +'<rect x="0.5" y="0.5" width="'+(W-1)+'" height="'+(H-1)+'" rx="12" fill="#FFFFFF" stroke="#D3DAE3"/>'+b+'</svg>';
  return {svg:svg, W:W, H:H, pos:pos};
}
function visaoMapSvg(){ var r=visaoLinhaCore(); VF_POS=r.pos; return r.svg; }
/* enquadra: tamanho legível, começo do fluxo à vista; o resto se arrasta ou pelos botões das etapas */
function visaoFit(){
  var w=document.getElementById("pcmap"), sv=document.querySelector("#pcmap-inner svg"); if(!w||!sv) return;
  var r=w.getBoundingClientRect(), H=+sv.getAttribute("height")||400;
  var k=.8; pzS={k:k, tx:12, ty:(H*k>r.height-24)?10:Math.round((r.height-H*k)/2)};
}
/* leva o mapa até a etapa escolhida (mantém o zoom) */
function vfGo(i){ var row=VF_ROWS[i]; if(!row) return; if(row.apoio){ openPF(row.k); return; }
  var x=VF_POS[row.k]; if(x==null) return; pzS.tx=Math.round(12-x*pzS.k); pzApply(); }
function vfNavHtml(){
  var h='<div class="vf-nav" role="toolbar" aria-label="Ir para a etapa">';
  VF_ROWS.forEach(function(r,i){ h+='<button type="button" class="ncchip" data-vfgo="'+i+'">'+(r.apoio?'Apoio: chamados':(r.n+'. '+VF_SHORT[r.k]))+'</button>'; });
  return h+'</div>';
}
function vfWire(){
  document.querySelectorAll("[data-vfgo]").forEach(function(b){ b.onclick=function(){ vfGo(+b.getAttribute("data-vfgo")); }; });
  var oa=document.getElementById("vfOpenAll"); if(oa) oa.onclick=function(){ vfAllKeys().forEach(function(k){ recOpen[k]=true; }); render(); };
  var ca=document.getElementById("vfCloseAll"); if(ca) ca.onclick=function(){ vfAllKeys().forEach(function(k){ recOpen[k]=false; }); render(); };
}
window.openPF=function(k){ tab="processos"; view="hub"; curPF=k; pzS={k:1,tx:0,ty:0}; renderTabs(); render(); try{ window.scrollTo(0,0); }catch(e){} };
/* copia as fontes já carregadas (fontes.css) para a aba nova, sem baixar nada */
function fontCss(){ var out=""; try{ for(var i=0;i<document.styleSheets.length;i++){ var sh=document.styleSheets[i]; if(!sh.href||!/fontes\.css/.test(sh.href)) continue; var rs=sh.cssRules; for(var j=0;j<rs.length;j++) out+=rs[j].cssText+"\n"; } }catch(e){} return out; }
function openVisaoFull(){
  var fns=[bx,ln,elb,conv,elbBack,recLbl,di_plus,pmBW,pmBH,pmExpW,buildProcCore,recMapCore,visaoLinhaCore,vfAllKeys];
  var src=fns.map(function(f){ return f.toString(); }).join("\n");
  var nav=VF_ROWS.map(function(r,i){ return '<button type="button" class="chip" data-vfgo="'+i+'">'+(r.apoio?'Apoio: chamados':(r.n+'. '+VF_SHORT[r.k]))+'</button>'; }).join('');
  var js="var C="+JSON.stringify(C)+";var ARROW="+JSON.stringify(ARROW)+";var PM="+JSON.stringify(PM)+";var PROCMAP="+JSON.stringify(PROCMAP)
    +";var VF_ROWS="+JSON.stringify(VF_ROWS)+";var VF_SHORT="+JSON.stringify(VF_SHORT)+";var POS={};var recOpen="+JSON.stringify(recOpen)+";\n"
    +src+"\n"
    +"(function(){var st=document.getElementById('stage'),m=document.getElementById('map'),z={k:1,x:0,y:0},dg=null,moved=false,pin=null;"
    +"function draw(){var r=visaoLinhaCore();m.innerHTML=r.svg;POS=r.pos;}"
    +"function ap(){m.style.transform='translate('+z.x+'px,'+z.y+'px) scale('+z.k+')';}"
    +"function fit(){var r=st.getBoundingClientRect(),sv=m.querySelector('svg'),H=sv?+sv.getAttribute('height'):400;var k=.85;z={k:k,x:24,y:(H*k>r.height-32)?16:Math.round((r.height-H*k)/2)};ap();}"
    +"function zoomAt(px,py,f){var nk=Math.min(3,Math.max(.25,z.k*f));z.x=px-(px-z.x)*(nk/z.k);z.y=py-(py-z.y)*(nk/z.k);z.k=nk;ap();}"
    +"window.recToggle=function(k){recOpen[k]=!recOpen[k];draw();};"
    +"window.goConcCls=function(){var o=window.opener;if(o&&!o.closed){try{o.goFlux('classificacao');o.focus();}catch(e){}}};"
    +"function nd(t){return t.closest&&(t.closest('[onclick]')||t.closest('[data-gopf]')||t.closest('.zb'));}"
    +"st.addEventListener('wheel',function(e){e.preventDefault();var r=st.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,e.deltaY<0?1.12:1/1.12);},{passive:false});"
    +"st.addEventListener('mousedown',function(e){if(e.button!==0||nd(e.target))return;dg={x:e.clientX-z.x,y:e.clientY-z.y,sx:e.clientX,sy:e.clientY};moved=false;st.style.cursor='grabbing';});"
    +"window.addEventListener('mousemove',function(e){if(!dg)return;if(Math.abs(e.clientX-dg.sx)+Math.abs(e.clientY-dg.sy)>4)moved=true;z.x=e.clientX-dg.x;z.y=e.clientY-dg.y;ap();});"
    +"window.addEventListener('mouseup',function(){dg=null;st.style.cursor='grab';});"
    +"function td(t){return Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);}"
    +"st.addEventListener('touchstart',function(e){var r=st.getBoundingClientRect();if(e.touches.length===2){dg=null;pin={d:td(e.touches),x:(e.touches[0].clientX+e.touches[1].clientX)/2-r.left,y:(e.touches[0].clientY+e.touches[1].clientY)/2-r.top};return;}if(e.touches.length!==1||nd(e.target))return;dg={x:e.touches[0].clientX-z.x,y:e.touches[0].clientY-z.y,sx:e.touches[0].clientX,sy:e.touches[0].clientY};moved=false;},{passive:true});"
    +"st.addEventListener('touchmove',function(e){if(pin&&e.touches.length===2){e.preventDefault();var d=td(e.touches);if(pin.d>0)zoomAt(pin.x,pin.y,d/pin.d);pin.d=d;return;}if(!dg||e.touches.length!==1)return;e.preventDefault();if(Math.abs(e.touches[0].clientX-dg.sx)+Math.abs(e.touches[0].clientY-dg.sy)>6)moved=true;z.x=e.touches[0].clientX-dg.x;z.y=e.touches[0].clientY-dg.y;ap();},{passive:false});"
    +"st.addEventListener('touchend',function(e){dg=null;if(!e.touches||e.touches.length<2)pin=null;});"
    +"document.querySelectorAll('.zb button').forEach(function(b){b.onclick=function(){var r=st.getBoundingClientRect(),a=b.getAttribute('data-z');if(a==='fit')fit();else zoomAt(r.width/2,r.height/2,a==='in'?1.25:1/1.25);};});"
    +"document.querySelectorAll('[data-vfgo]').forEach(function(b){b.onclick=function(){var row=VF_ROWS[+b.getAttribute('data-vfgo')];if(!row)return;if(row.apoio){var o=window.opener;if(o&&!o.closed){try{o.openPF(row.k);o.focus();}catch(e){}}return;}var x=POS[row.k];if(x!=null){z.x=Math.round(24-x*z.k);ap();}};});"
    +"document.getElementById('openAll').onclick=function(){vfAllKeys().forEach(function(k){recOpen[k]=true;});draw();};"
    +"document.getElementById('closeAll').onclick=function(){vfAllKeys().forEach(function(k){recOpen[k]=false;});draw();};"
    +"function go(g){var o=window.opener;if(!o||o.closed)return;try{o.openPF(g.getAttribute('data-gopf'));o.focus();}catch(err){}}"
    +"document.addEventListener('click',function(e){if(moved){moved=false;return;}var g=e.target.closest&&e.target.closest('[data-gopf]');if(g)go(g);});"
    +"document.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var t=e.target;if(!t||!t.closest)return;var g=t.closest('[data-gopf]');if(g){e.preventDefault();go(g);return;}var p=t.closest('.pl');if(p){e.preventDefault();var k=p.getAttribute('data-pk');recToggle(k);var n=m.querySelector('.pl[data-pk=\"'+k+'\"]');if(n)n.focus();}});"
    +"draw();fit();window.addEventListener('resize',function(){});})();";
  var CH='.chip{height:32px;padding:0 13px;border-radius:999px;border:1px solid #C7CFD9;background:#fff;color:#4A5869;font:inherit;font-size:13.5px;cursor:pointer}.chip:hover{border-color:#7B8696;color:#172235}';
  var BT='.btn{height:32px;padding:0 12px;border-radius:8px;border:1px solid #C7CFD9;background:#fff;color:#172235;font:inherit;font-size:13px;font-weight:600;cursor:pointer}.btn:hover{background:#F6F8FA;border-color:#7B8696}';
  var html='<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fluxo completo do processo fiscal</title><style>'+fontCss()+'</style>'
    +'<style>*{box-sizing:border-box}html,body{height:100%}body{margin:0;font-family:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:#EDF1F5;color:#172235;overflow:hidden}'
    +'header{background:#fff;border-bottom:1px solid #DCE2E9;padding:12px 24px 10px}header h1{margin:0;font-size:18px;font-weight:600}header p{margin:2px 0 10px;font-size:13px;color:#5A6676}'
    +'.nav{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.nav .sp{flex:1 1 12px}'+CH+BT
    +'#stage{position:relative;height:calc(100% - 112px);overflow:hidden;cursor:grab;touch-action:none;background-color:#F4F6F9;background-image:radial-gradient(circle,#D2D9E2 1px,transparent 1.4px);background-size:20px 20px}'
    +'#map{position:absolute;left:0;top:0;transform-origin:0 0}'
    +'.zb{position:absolute;right:18px;bottom:18px;display:flex;flex-direction:column;background:#fff;border:1px solid #C7CFD9;border-radius:9px;overflow:hidden;box-shadow:0 2px 10px rgba(23,34,53,.1)}'
    +'.zb button{width:40px;height:38px;border:0;border-top:1px solid #DCE2E9;background:#fff;color:#4A5869;font-size:18px;line-height:1;cursor:pointer}.zb button:first-child{border-top:0}.zb button:hover{color:#1A4FA3;background:#F6F8FA}'
    +'</style></head><body><header><h1>Visão geral do processo fiscal</h1><p>Clique nos + para abrir os detalhes. Arraste para mover; use a roda do mouse ou os botões para aproximar.</p>'
    +'<div class="nav">'+nav+'<span class="sp"></span><button type="button" class="btn" id="openAll">Abrir todos os +</button><button type="button" class="btn" id="closeAll">Fechar todos</button></div></header>'
    +'<div id="stage"><div id="map"></div><div class="zb"><button type="button" data-z="in" aria-label="Aproximar">+</button><button type="button" data-z="out" aria-label="Afastar">−</button><button type="button" data-z="fit" aria-label="Ajustar à tela">↺</button></div></div>'
    +'<scr'+'ipt>'+js+'</scr'+'ipt></body></html>';
  var w=window.open("","_blank");
  if(w){ w.document.open(); w.document.write(html); w.document.close(); }
  else alert("Permita pop-ups para abrir em nova aba.");
}
var pzS={k:1,tx:0,ty:0};
function pzApply(){
  var wrap=document.getElementById("pcmap"), inner=document.getElementById("pcmap-inner");
  if(!wrap||!inner) return;
  function upd(){ inner.style.transform="translate("+pzS.tx+"px,"+pzS.ty+"px) scale("+pzS.k+")"; }
  upd();
  function zoomAt(mx,my,f){ var nk=Math.min(4,Math.max(0.3,pzS.k*f)); pzS.tx=mx-(mx-pzS.tx)*(nk/pzS.k); pzS.ty=my-(my-pzS.ty)*(nk/pzS.k); pzS.k=nk; upd(); }
  wrap.onwheel=function(e){ e.preventDefault(); var r=wrap.getBoundingClientRect(); zoomAt(e.clientX-r.left,e.clientY-r.top, e.deltaY<0?1.12:1/1.12); };
  var drag=false, sx=0, sy=0;
  function noDrag(t){ return t.closest && (t.closest(".pzbtn") || t.closest("[onclick]") || t.closest("[data-gopf]") || t.closest("[data-goflux]")); }
  wrap.onmousedown=function(e){ if(e.button!==0||noDrag(e.target))return; drag=true; sx=e.clientX-pzS.tx; sy=e.clientY-pzS.ty; wrap.style.cursor="grabbing"; };
  window.onmousemove=function(e){ if(!drag)return; pzS.tx=e.clientX-sx; pzS.ty=e.clientY-sy; upd(); };
  window.onmouseup=function(){ drag=false; var w=document.getElementById("pcmap"); if(w)w.style.cursor="grab"; };
  var pinch=null;
  function tdist(t){ return Math.hypot(t[0].clientX-t[1].clientX, t[0].clientY-t[1].clientY); }
  wrap.ontouchstart=function(e){
    if(e.touches.length===2){ drag=false; var r=wrap.getBoundingClientRect(); pinch={d:tdist(e.touches), mx:(e.touches[0].clientX+e.touches[1].clientX)/2-r.left, my:(e.touches[0].clientY+e.touches[1].clientY)/2-r.top}; return; }
    if(e.touches.length!==1||noDrag(e.target))return; drag=true; sx=e.touches[0].clientX-pzS.tx; sy=e.touches[0].clientY-pzS.ty; };
  wrap.ontouchmove=function(e){
    if(pinch&&e.touches.length===2){ e.preventDefault(); var d=tdist(e.touches); if(pinch.d>0) zoomAt(pinch.mx,pinch.my,d/pinch.d); pinch.d=d; return; }
    if(!drag||e.touches.length!==1)return; e.preventDefault(); pzS.tx=e.touches[0].clientX-sx; pzS.ty=e.touches[0].clientY-sy; upd(); };
  wrap.ontouchend=function(e){ drag=false; if(!e.touches||e.touches.length<2) pinch=null; };
  wrap.querySelectorAll(".pzbtn").forEach(function(btn){ btn.onclick=function(e){ e.stopPropagation(); var z=btn.getAttribute("data-z"), r=wrap.getBoundingClientRect();
    if(z==="reset"){ if(tab==="processos"&&curPF==="visao") visaoFit(); else pzS={k:1,tx:0,ty:0}; upd(); } else zoomAt(r.width/2, r.height/2, z==="in"?1.25:1/1.25); }; });
  /* teclado: ao focar um item do mapa, mantém ele dentro da área visível */
  wrap.onfocusin=function(e){ wrap.scrollLeft=0; wrap.scrollTop=0; var t=e.target; if(!t||!t.getBoundingClientRect) return;
    var r=wrap.getBoundingClientRect(), b=t.getBoundingClientRect(), dx=0, dy=0;
    if(b.left<r.left+12) dx=r.left+12-b.left; else if(b.right>r.right-12) dx=r.right-12-b.right;
    if(b.top<r.top+12) dy=r.top+12-b.top; else if(b.bottom>r.bottom-12) dy=r.bottom-12-b.bottom;
    if(dx||dy){ pzS.tx+=dx; pzS.ty+=dy; upd(); } };
}
function procfiscHtml(){
  if(!curPF)curPF=ORDER_PROCFISC[0];
  var railh='';
  PF_SECOES.forEach(function(sec,si){ railh+='<div class="sec-label"'+(si?'':' style="margin-top:4px"')+'>'+sec[0]+'</div>';
    sec[1].forEach(function(k){railh+='<div class="item'+(k===curPF?" active":"")+'" data-pf="'+k+'" role="link" tabindex="0"'+(k===curPF?' aria-current="page"':'')+'><span class="name">'+PROCFISC[k].name+'</span></div>';}); });
  var p=PROCFISC[curPF];
  if(p.svgmap){
    var vis=(curPF==="visao");
    var d='<div class="maptool"><div><p class="crumb" style="margin:0 0 2px">Processos fiscais</p><h1>'+p.name+'</h1><p class="maphint">'+mapHint(vis?"Todas as etapas num só fluxo, do recebimento ao fechamento do mês. Clique nos + para abrir os detalhes.":"Clique nos círculos com + para abrir os detalhes.")+'</p></div>'
      +'<div class="maptool-act">'+(vis?'<button type="button" class="cta secondary" id="vfOpenAll">Abrir todos os +</button><button type="button" class="cta secondary" id="vfCloseAll">Fechar todos</button>':'')
      +'<button class="cta secondary" id="procfull-btn" type="button">'+ico("externo")+'Abrir em tela cheia</button></div></div>'
      +(vis?vfNavHtml():'');
    var _map=(vis?visaoMapSvg():(curPF==="recebimento"?recMapSvg():buildProcMap(PROCMAP[curPF])));
    d+='<div id="pcmap" class="mapcanvas">';
    d+='<div id="pcmap-inner" style="position:absolute;inset:0;transform-origin:0 0;">'+_map+'</div>';
    d+='<div class="zoombar"><button class="pzbtn" data-z="in" type="button" title="Aproximar" aria-label="Aproximar">+</button><button class="pzbtn" data-z="out" type="button" title="Afastar" aria-label="Afastar">−</button><button class="pzbtn" data-z="reset" type="button" title="Voltar ao tamanho original" aria-label="Voltar ao tamanho original">↺</button></div>';
    d+='</div>';
    return '<div class="layout"><div class="rail">'+railHtml_pf(railh)+'</div><div class="panel panel-map">'+d+'</div></div>';
  }
  var d='<div class="crumb">Processos Fiscais</div><div class="titlerow"><h1>'+p.name+'</h1></div>';
  var campos=[["Objetivo","objetivo"],["Descrição","descricao"],["Responsáveis","responsaveis"],["Passo a passo","passos"],["Exceções","excecoes"],["Observações","observacoes"]];
  d+='<div class="lead">Estrutura do processo — preencher cada campo abaixo.</div>';
  campos.forEach(function(c){var val=p.campos[c[1]];d+='<div style="border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px;background:var(--surface-2);"><div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--accent-ink);margin-bottom:6px;">'+c[0]+'</div><div style="font-size:14px;color:'+(val?"var(--ink)":"var(--faint)")+';line-height:1.65;">'+(val||"A preencher.")+'</div></div>';});
  return '<div class="layout"><div class="rail">'+railh+'</div><div class="panel">'+d+'</div></div>';
}
function railHtml_pf(h){return h;}
function wireProcfisc(){
  var _pf=document.getElementById("procfull-btn"); if(_pf)_pf.onclick=function(){ if(curPF==="visao") openVisaoFull(); else openProcFull(curPF); };
  if(curPF==="visao"){ if(pzS.k===1 && pzS.tx===0 && pzS.ty===0) visaoFit(); vfWire(); }
  document.querySelectorAll("[data-pf]").forEach(function(el){el.onclick=function(){curPF=el.getAttribute("data-pf");pzS={k:1,tx:0,ty:0};render();goTopMain();};});
  kbClick("[data-pf]");
  document.querySelectorAll("[data-gopf]").forEach(function(el){el.onclick=function(ev){ev.stopPropagation();goNextPF(el.getAttribute("data-gopf"));};});
  pzApply();
  document.querySelectorAll("[data-goflux]").forEach(function(el){el.onclick=function(ev){ev.stopPropagation();goFlux(el.getAttribute("data-goflux"));};});
  kbClick("#pcmap [data-gopf],#pcmap [data-goflux],#pcmap .pl");
}

function responsaveisHtml(){
  var url="https://docs.google.com/spreadsheets/d/14plYnNX5NYxVUgI9fo2rPDzuDhmaP7gpdLNrw6qaK18/edit?usp=sharing";
  var d='<div class="doc"><p class="crumb">Responsáveis</p><h1>Responsáveis por unidade</h1>'
    +'<p class="lead">Unidades, responsáveis e contatos ficam na planilha oficial do setor, no Google Planilhas. O acesso é controlado pelo Google: a planilha só abre para quem tem permissão.</p>'
    +'<div class="resp-card"><div class="resp-ico">'+ico("planilha")+'</div><div><h2>Planilha de responsáveis</h2><p>Abre em uma nova aba do Google Planilhas.</p></div>'
    +'<a href="'+url+'" target="_blank" rel="noopener" class="cta">'+ico("externo")+'Abrir planilha</a></div>'
    +'<div class="notice"><b>Sem acesso?</b> Se o Google pedir permissão, solicite pelo próprio botão do Google ou fale com o responsável pela planilha.</div></div>';
  return '<div class="panel panel-full">'+d+'</div>';
}
document.addEventListener("keydown",function(e){if(view!=="present")return;
  if(e.key==="ArrowRight")document.getElementById("next")&&document.getElementById("next").click();
  if(e.key==="ArrowLeft")document.getElementById("prev")&&document.getElementById("prev").click();
  if(e.key==="Escape")document.getElementById("back")&&document.getElementById("back").click();});
(function init(){
  var u=document.getElementById("updated"); if(u)u.textContent="atualizado em "+new Date().toLocaleDateString("pt-BR");
  var cf=document.getElementById("coverFoot"); if(cf)cf.textContent="atualizado em "+new Date().toLocaleDateString("pt-BR");
  var ci=document.getElementById("coverEmail");
  if(ci){ if(CUREMAIL)ci.value=CUREMAIL; ci.onkeydown=function(e){if(e.key==="Enter"){var b=document.getElementById("coverBtn"); if(b)b.click();}}; }
  var cb=document.getElementById("coverBtn");
  if(cb)cb.onclick=function(){
    if(travado()){ if(AUTH_ON&&AUTH_USER&&ACESSO){ document.getElementById("cover").style.display="none"; render(); } return; }
    var inp=document.getElementById("coverEmail"), err=document.getElementById("coverEmailErr");
    if(!inp || !emailValid(inp.value)){ if(err)err.textContent="Digite um e-mail v\u00e1lido ou escolha \u201cContinuar sem e-mail\u201d."; if(inp)inp.focus(); return; }
    setEmail(inp.value);
    document.getElementById("cover").style.display="none";
    render();
  };
  var cs=document.getElementById("coverSkip");
  if(cs)cs.onclick=function(){
    if(AUTH_ON && AUTH_USER){ authSair(); return; }
    if(travado()) return;   // acesso restrito: não há como entrar sem conta
    setEmail("");
    var err=document.getElementById("coverEmailErr"); if(err)err.textContent="";
    document.getElementById("cover").style.display="none";
    render();
  };
  updateEmailBadge();
  var bh=document.getElementById("brandHome"); if(bh)bh.onclick=function(){ switchTab("inicio"); };
  var sb=document.getElementById("searchBtn"); if(sb)sb.onclick=function(){ openPalette(); };
  var sd=document.getElementById("stampDate");
  if(sd){ var MM=["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"], hj=new Date(); sd.textContent=(hj.getDate()<10?"0":"")+hj.getDate()+"  "+MM[hj.getMonth()]+"  "+hj.getFullYear(); }
  try{ if(window.innerWidth>860 && ci && getComputedStyle(document.getElementById("cover")).display!=="none") ci.focus(); }catch(e){}
  initMural();
  var cg=document.getElementById("coverGoogle"); if(cg) cg.onclick=authEntrar;
  authInit();
  if(travado() && !AUTH_ON) travaSemLogin();
  try{ if(AUTH_ON && window.innerWidth>860 && getComputedStyle(document.getElementById("cover")).display!=="none" && cg) cg.focus(); }catch(e){}
  renderTabs(); render();
})();