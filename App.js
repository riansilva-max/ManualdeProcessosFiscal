/* ===== MOTOR / APP ===== */
var P=Object.assign({}, PROC, FAQ, {calendario:CAL_ITEM});

var PROCFISC={
  recebimento:{ name:"Recebimento e fontes de entrada", map:[
    {step:"Nota chega", link:"recebimento", desc:"A nota ou fatura chega por uma das fontes de entrada: <span data-goflux='recebimento' style='color:var(--accent);text-decoration:underline;cursor:pointer;font-weight:500;'>e-mail do Fiscal</span>, <span data-goflux='recebimento' style='color:var(--accent);text-decoration:underline;cursor:pointer;font-weight:500;'>portais/prefeituras</span> ou <span data-goflux='recebimento' style='color:var(--accent);text-decoration:underline;cursor:pointer;font-weight:500;'>chamado no JIRA</span>.", erros:[{e:"A definir (ex.: nota chega no e-mail errado)",f:"A definir."}]},
    {step:"Localizar a nota", link:"recebimento", desc:"Localizar a nota no portal correspondente e baixar/confirmar o documento.", erros:[{e:"A definir (ex.: nota não localizada em nenhum portal)",f:"A definir."}]},
    {step:"Conferir tipo e dados", link:"classificacao", desc:"Conferir se a nota tem pedido/contrato e identificar o tipo: <span data-goflux='classificacao' style='color:var(--accent);text-decoration:underline;cursor:pointer;font-weight:500;'>contrato fixo</span>, <span data-goflux='classificacao' style='color:var(--accent);text-decoration:underline;cursor:pointer;font-weight:500;'>contrato variável</span> ou <span data-goflux='classificacao' style='color:var(--accent);text-decoration:underline;cursor:pointer;font-weight:500;'>esporádica</span>.", erros:[{e:"A definir (ex.: nota sem pedido/contrato)",f:"A definir."},{e:"A definir (ex.: nota em duplicidade)",f:"A definir."}]},
    {step:"Nota localizada", link:"analise", desc:"Com a nota localizada e conferida, segue para a <span data-goflux='analise' style='color:var(--accent);text-decoration:underline;cursor:pointer;font-weight:500;'>Análise de nota fiscal</span>.", erros:[]}
  ] },
  classificacao:{name:"Classificação da nota", campos:{objetivo:"",descricao:"",responsaveis:"",passos:"",excecoes:"",observacoes:""}},
  analise:{name:"Análise da nota", campos:{objetivo:"",descricao:"",responsaveis:"",passos:"",excecoes:"",observacoes:""}},
  chamados:{name:"Abertura de chamados", campos:{objetivo:"",descricao:"",responsaveis:"",passos:"",excecoes:"",observacoes:""}}
};
var ORDER_PROCFISC=["recebimento","classificacao","analise","chamados"];

var STAT={pronto:["var(--ok)","pronto"],rascunho:["var(--draft)","rascunho"],vazio:["var(--empty)","a preencher"]};
var cur="geral", view="hub", filter="", stepIdx=-1, catOpen={}, selCal=null, nearOpen=false, calMonthOpen=null, calYear=null, calCollapsed=false, calView="mes", curPF=null, tab="fluxo";
var root=document.getElementById("root");

function wrap(d){
  if(tab==="calendario") return '<div class="panel panel-full">'+d+'</div>';
  return '<div class="layout"><div class="rail">'+railHtml()+'</div><div class="panel">'+d+'</div></div>';
}
function itemHtml(k,sub){var p=P[k];return '<div class="item'+(sub?" item-sub":"")+' '+(k===cur?"active":"")+'" data-k="'+k+'"><span class="name">'+p.name+'</span></div>';}
function railHtml(){
  var q=filter.trim().toLowerCase();
  var html='<input class="search" id="search" placeholder="Buscar…" value="'+filter.replace(/"/g,'&quot;')+'">';
  if(tab==="fluxo"){
    var lastSec="";
    ORDER_FLUXO.forEach(function(k){var p=P[k]; if(q&&p.name.toLowerCase().indexOf(q)<0)return;
      if(p.sec!==lastSec){html+='<div class="sec-label">'+p.sec+'</div>';lastSec=p.sec;}
      html+=itemHtml(k,false);});
  } else if(tab==="duvidas"){
    var lastCat="";
    ORDER_FAQ.forEach(function(k){var p=P[k]; if(q&&p.name.toLowerCase().indexOf(q)<0)return;
      if(p.cat!==lastCat){var copen=(!!catOpen[p.cat]||!!q);html+='<div class="cat-label" data-ctoggle="'+p.cat+'">'+p.cat+' <span style="float:right;font-weight:400;">'+(copen?"▾":"▸")+'</span></div>';lastCat=p.cat;}
      if(!(catOpen[p.cat]||q))return;
      html+=itemHtml(k,true);});
  }
  return html;
}
function hubHtml(){
  if(cur==="geral"){
    var dg='<div class="crumb">Visão geral</div><div class="titlerow"><h1>Manual de Processos Fiscal</h1></div>'
      +'<div class="lead">Escolha um processo no menu ao lado para ver o passo a passo — ou apresente o fluxo completo.</div>'
      +'<button class="cta" id="present"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>Apresentar o fluxo completo</button>';
    return wrap(dg);
  }
  const p=P[cur],[,label]=(STAT[p.status]||["",""]);
  let d='<div class="crumb">'+p.sec+'</div><div class="titlerow"><h1>'+p.name+'</h1></div>';
  if(p.lead)d+='<div class="lead">'+p.lead+'</div>';
  if(p.flow)d+='<button class="cta" id="present"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>Apresentar todo o processo</button>';
  if(p.calendar){d+='<div id="calwrap"></div>';setTimeout(renderCalendar,0);return wrap(d);}if(p.checklist){var cl='<div style="margin-top:8px;">';cl+='<div style="font-size:13px;color:var(--muted);margin-bottom:12px;">'+p.checklist.hint+'</div>';cl+='<div id="cklist"></div>';cl+='<div style="margin-top:10px;"><button class="cta secondary" id="ckreset" style="width:auto;">Limpar marcações</button></div>';d+=cl;setTimeout(renderChecklist,0);return wrap(d);}if(p.faq){var fb='';fb+='<div style="margin-top:16px;display:flex;flex-direction:column;gap:12px;">';fb+='<div style="border:1px solid var(--border);border-left:3px solid var(--draft);border-radius:10px;padding:13px 16px;background:var(--surface-2);"><div style="font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--draft-ink);margin-bottom:4px;">Problema</div><div style="font-size:15px;color:var(--ink);line-height:1.65;">'+p.faq.problema+'</div></div>';fb+='<div style="border:1px solid var(--border);border-left:3px solid var(--text-accent);border-radius:10px;padding:13px 16px;background:var(--surface-2);"><div style="font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--accent-ink);margin-bottom:4px;">Processo</div><div style="font-size:15px;color:var(--ink);line-height:1.65;">'+p.faq.processo+'</div></div>';fb+='<div style="border:1px solid var(--border);border-left:3px solid var(--ok);border-radius:10px;padding:13px 16px;background:var(--surface-2);"><div style="font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--ok-ink);margin-bottom:4px;">Solução</div><div style="font-size:15px;color:var(--ink);line-height:1.65;">'+p.faq.solucao+'</div></div>';if(p.img){fb+='<img src="'+p.img+'" alt="exemplo" style="margin-top:2px;max-width:100%;border:1px solid var(--border);border-radius:8px;">';}fb+='</div>';d+=fb;return wrap(d);}if(p.steps.length===0){
    d+='<div class="steps"><div class="empty-box">Processo ainda não preenchido.<br>Aqui entram as etapas assim que você definir este fluxo.</div></div>';
  }else{
    d+='<div class="steps">'+p.steps.map((s,i)=>{
      let lk='';
      if(s.link){ lk = s.link.todo
        ? '<span class="lnk todo">'+s.link.label+'</span>'
        : '<a class="lnk" href="'+s.link.u+'" target="_blank" rel="noopener">'+s.link.label+' ↗</a>'; }
      var im=s.img?'<img src="'+s.img+'" alt="exemplo" style="display:block;margin-top:10px;max-width:100%;border:1px solid var(--border);border-radius:8px;">':'';var imt=s.imgTodo?'<div style="margin-top:10px;border:1px dashed var(--border-strong);border-radius:8px;padding:18px;text-align:center;color:var(--faint);font-size:13px;">imagem do carimbo — a incluir</div>':'';return '<div class="step"><div class="h"><span class="num">'+String(i+1).padStart(2,'0')+'</span>'+s.t+'</div><div class="d">'+s.d+'</div>'+im+imt+lk+'</div>';
    }).join("")+'</div>';
  }
  if(p.gallery){d+='<div style="margin-top:24px;border-top:1px solid var(--border);padding-top:16px;">'+'<div style="font-size:12px;font-weight:600;color:var(--faint);letter-spacing:.05em;text-transform:uppercase;margin-bottom:4px;">Tutorial passo a passo — SAP</div>'+'<div style="font-size:13px;color:var(--muted);margin-bottom:12px;">'+p.gallery.length+' telas · role para acompanhar o lançamento completo</div>'+p.gallery.map(function(src,i){return '<div style="margin-bottom:14px;"><div style="font-size:12px;color:var(--faint);margin-bottom:4px;">Tela '+(i+1)+' de '+p.gallery.length+'</div><img src="'+src+'" alt="SAP tela '+(i+1)+'" style="width:100%;border:1px solid var(--border);border-radius:8px;"></div>';}).join('')+'</div>';}return wrap(d);
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
    if(list.length)chips+='<span class="calchip venc">'+list.length+(list.length===1?' vencimento':' vencimentos')+'</span>';
    if(iso===COMPET_FECHA)chips+='<span class="calchip comp">Fecha competência</span>';
    h+='<div class="calcell'+(isToday?" today":"")+(isSel?" sel":"")+'" data-cal="'+iso+'"><div class="calnum">'+dn+'</div>'+chips+'</div>';
  }
  var rem=(7-((first+days)%7))%7;
  for(var t=0;t<rem;t++)h+='<div class="calcell empty"></div>';
  return h+'</div>';
}


function renderCalDay(){
  var el=document.getElementById("calday"); if(!el)return;
  if(!selCal){el.innerHTML='<div style="font-size:13px;color:var(--faint);margin-top:14px;text-align:center;">Clique em um dia para ver os avisos e vencimentos.</div>';return;}
  var ev=(typeof EVENTOS!=="undefined"&&EVENTOS[selCal])?EVENTOS[selCal]:[];
  var list=VENC[selCal]||[];
  var comp=(selCal===COMPET_FECHA)?'<div style="margin-bottom:8px;color:var(--danger-ink);font-weight:500;">Fechamento da competência.</div>':'';
  var det='<div style="border:1px solid var(--border);border-radius:10px;padding:16px 18px;background:var(--surface);margin-top:14px;">';
  det+='<div style="font-weight:600;margin-bottom:10px;">'+calBR(selCal)+'</div>'+comp;
  if(ev.length) det+='<div style="font-size:12px;font-weight:600;color:var(--accent-ink);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Avisos e eventos</div><div style="font-size:14px;line-height:1.85;margin-bottom:'+(list.length?"12px":"0")+';">'+ev.map(function(f){return "• "+calEsc(f);}).join("<br>")+'</div>';
  if(list.length) det+='<div style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Vencimentos ('+list.length+')</div><div style="font-size:14px;line-height:1.85;">'+list.map(function(f){return "• "+calEsc(f);}).join("<br>")+'</div>';
  if(!ev.length && !list.length && !comp) det+='<div style="font-size:13px;color:var(--muted);">Sem avisos ou vencimentos neste dia.</div>';
  det+='</div>';
  el.innerHTML=det;
}
function miniMonth(y,m,todayIso){
  var mn=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  var first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
  var wd=["D","S","T","Q","Q","S","S"];
  var h='<div class="ymonth"><div class="ymonth-title" data-gomon="'+m+'">'+mn[m]+'</div><div class="ygrid">';
  wd.forEach(function(w){h+='<div class="ywd">'+w+'</div>';});
  for(var i=0;i<first;i++)h+='<div class="ycell empty"></div>';
  for(var dn=1;dn<=days;dn++){
    var iso=calIso(y,m,dn);
    var hasData=(!!VENC[iso])||(typeof EVENTOS!=="undefined"&&!!EVENTOS[iso])||(iso===COMPET_FECHA);
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
  var cf=new Date(COMPET_FECHA+"T00:00:00"); var dd=Math.round((cf-today)/86400000);
  var banner=(dd>=0&&dd<=7)?'<div class="compbanner">'+(dd===0?"A competência fecha hoje":"Faltam "+dd+(dd===1?" dia":" dias")+" para o fechamento da competência")+' ('+calBR(COMPET_FECHA)+')<div style="font-weight:400;font-size:13px;margin-top:5px;">Lançar todas as notas com impostos antes do fechamento.</div></div>':'';
  var mn=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  var toggle='<div class="calviewtoggle"><button data-view="mes" class="'+(calView==="mes"?"active":"")+'">Mês</button><button data-view="ano" class="'+(calView==="ano"?"active":"")+'">Ano</button></div>';
  if(calView==="ano"){
    var nav='<div class="calnav2"><button data-mn="-1" title="ano anterior">‹</button><button data-mn="1" title="próximo ano">›</button><span class="calnav-title">'+calYear+'</span>'+toggle+'</div>';
    var yg='<div class="yeargrid">';
    for(var mm=0;mm<12;mm++) yg+=miniMonth(calYear,mm,todayIso);
    yg+='</div>';
    host.innerHTML=banner+nav+yg;
  } else {
    var nav='<div class="calnav2"><button data-mn="-1" title="mês anterior">‹</button><button data-mn="1" title="próximo mês">›</button><span class="calnav-title">'+mn[calMonthOpen]+' de '+calYear+'</span>'+toggle+'<button class="calmin" title="'+(calCollapsed?"expandir":"recolher")+'">'+(calCollapsed?"▸":"▾")+'</button></div>';
    var grid=calCollapsed?'':monthGrid(new Date(calYear,calMonthOpen,1),todayIso);
    host.innerHTML=banner+nav+grid+(calCollapsed?'':'<div id="calday"></div>');
  }
  host.querySelectorAll("[data-view]").forEach(function(el){el.onclick=function(){calView=el.getAttribute("data-view");renderCalendar();};});
  host.querySelectorAll("[data-mn]").forEach(function(el){el.onclick=function(){var d=parseInt(el.getAttribute("data-mn"));if(calView==="ano"){calYear+=d;}else{calMonthOpen+=d;if(calMonthOpen<0){calMonthOpen=11;calYear--;}if(calMonthOpen>11){calMonthOpen=0;calYear++;}}selCal=null;renderCalendar();};});
  var mb=host.querySelector(".calmin"); if(mb)mb.onclick=function(){calCollapsed=!calCollapsed;renderCalendar();};
  host.querySelectorAll(".calcell[data-cal]").forEach(function(c){c.onclick=function(){selCal=c.getAttribute("data-cal");renderCalendar();};});
  host.querySelectorAll(".ymonth-title[data-gomon]").forEach(function(t){t.onclick=function(){calMonthOpen=parseInt(t.getAttribute("data-gomon"));calView="mes";selCal=null;renderCalendar();};});
  host.querySelectorAll(".ycell[data-cal]").forEach(function(c){c.onclick=function(){var iso=c.getAttribute("data-cal");selCal=iso;calYear=parseInt(iso.split("-")[0]);calMonthOpen=parseInt(iso.split("-")[1])-1;calView="mes";renderCalendar();};});
  if(calView!=="ano") renderCalDay();
}





var TABS=[["fluxo","Fluxo fiscal"],["processos","Processos Fiscais"],["duvidas","Dúvidas recorrentes"],["calendario","Calendário"],["controles","Controles"],["responsaveis","Responsáveis"]];
function renderTabs(){
  document.getElementById("tabbar").innerHTML=TABS.map(function(t){return '<button class="tabbtn'+(tab===t[0]?" active":"")+'" data-tab="'+t[0]+'">'+t[1]+'</button>';}).join("");
  document.querySelectorAll(".tabbtn").forEach(function(b){b.onclick=function(){switchTab(b.getAttribute("data-tab"));};});
}
function switchTab(t){
  tab=t; view="hub"; stepIdx=-1; filter="";
  if(t==="fluxo")cur="geral";
  else if(t==="duvidas"){cur=ORDER_FAQ[0]; catOpen[P[ORDER_FAQ[0]].cat]=true;}
  else if(t==="calendario"){ cur="calendario"; var _t=new Date(); calYear=_t.getFullYear(); calMonthOpen=_t.getMonth(); selCal=calIso(_t.getFullYear(),_t.getMonth(),_t.getDate()); calCollapsed=false; }
  else if(t==="processos"){ curPF=ORDER_PROCFISC[0]; }
  renderTabs(); render();
}
function wireHub(){
  var s=document.getElementById("search");
  if(s)s.oninput=function(e){filter=e.target.value;var pos=e.target.selectionStart;render();var ns=document.getElementById("search");if(ns){ns.focus();ns.setSelectionRange(pos,pos);}};
  document.querySelectorAll(".item").forEach(function(el){el.onclick=function(){cur=el.dataset.k;render();};});
  document.querySelectorAll("[data-ctoggle]").forEach(function(el){el.onclick=function(){var c=el.getAttribute("data-ctoggle");catOpen[c]=!catOpen[c];render();};});
  var pr=document.getElementById("present"); if(pr)pr.onclick=function(){view="present";stepIdx=-1;render();};
}
function wirePresent(){
  document.getElementById("back").onclick=function(){view="hub";stepIdx=-1;render();};
  document.getElementById("prev").onclick=function(){stepIdx=Math.max(0,stepIdx>0?stepIdx-1:0);applyHighlight();};
  document.getElementById("next").onclick=function(){stepIdx=Math.min(stepIdx+1,P[cur].steps.length-1);applyHighlight();};
  document.getElementById("showall").onclick=function(){stepIdx=-1;applyHighlight();};
  document.querySelectorAll('#flow .fnode[data-i]').forEach(function(n){n.style.cursor="pointer";n.addEventListener("click",function(){stepIdx=parseInt(n.getAttribute("data-i"));applyHighlight();});});
  applyHighlight();
}
function render(){
  if(view==="present"){root.innerHTML=presentHtml();wirePresent();return;}
  if(tab==="processos"){root.innerHTML=procfiscHtml();wireProcfisc();return;}
  if(tab==="controles"){root.innerHTML=controlesHtml();return;}
  if(tab==="responsaveis"){root.innerHTML=responsaveisHtml();return;}
  root.innerHTML=hubHtml();
  wireHub();
}
function procfiscHtml(){
  if(!curPF)curPF=ORDER_PROCFISC[0];
  var railh='<div class="sec-label">Processos</div>';
  ORDER_PROCFISC.forEach(function(k){railh+='<div class="item'+(k===curPF?" active":"")+'" data-pf="'+k+'"><span class="name">'+PROCFISC[k].name+'</span></div>';});
  var p=PROCFISC[curPF];
  var d='<div class="crumb">Processos Fiscais</div><div class="titlerow"><h1>'+p.name+'</h1></div>';
  if(p.map){
    d+='<div class="lead">Passo a passo do processo, com os caminhos quando dá erro. Toque nos termos em azul para ver o conceito no Fluxo Fiscal.</div>';
    p.map.forEach(function(s,idx){
      d+='<div style="border:1px solid var(--border);border-radius:12px;padding:16px 18px;background:var(--surface);">';
      d+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><span style="background:var(--accent);color:#fff;width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex:none;">'+(idx+1)+'</span><span style="font-weight:600;font-size:15px;flex:1;">'+s.step+'</span>'+(s.link?'<span data-goflux="'+s.link+'" style="font-size:12px;color:var(--accent);text-decoration:underline;cursor:pointer;white-space:nowrap;">ver conceito ↗</span>':'')+'</div>';
      d+='<div style="font-size:14px;color:var(--ink);line-height:1.65;">'+s.desc+'</div>';
      (s.erros||[]).forEach(function(er){d+='<div style="margin-top:10px;border:1px solid var(--danger);background:var(--danger-soft);border-radius:8px;padding:10px 12px;"><div style="font-size:12px;font-weight:600;color:var(--danger-ink);margin-bottom:2px;">&#9888; Se der erro: '+er.e+'</div><div style="font-size:13px;color:var(--danger-ink);">O que fazer: '+er.f+'</div></div>';});
      d+='</div>';
      if(idx<p.map.length-1)d+='<div style="text-align:center;color:var(--faint);font-size:20px;margin:2px 0 6px;">&#8595;</div>';
    });
  } else {
    var campos=[["Objetivo","objetivo"],["Descrição","descricao"],["Responsáveis","responsaveis"],["Passo a passo","passos"],["Exceções","excecoes"],["Observações","observacoes"]];
    d+='<div class="lead">Estrutura do processo — preencher cada campo abaixo.</div>';
    campos.forEach(function(c){var val=p.campos[c[1]];d+='<div style="border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px;background:var(--surface-2);"><div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--accent-ink);margin-bottom:6px;">'+c[0]+'</div><div style="font-size:14px;color:'+(val?"var(--ink)":"var(--faint)")+';line-height:1.65;">'+(val||"A preencher.")+'</div></div>';});
  }
  return '<div class="layout"><div class="rail">'+railh+'</div><div class="panel">'+d+'</div></div>';
}
function wireProcfisc(){
  document.querySelectorAll("[data-pf]").forEach(function(el){el.onclick=function(){curPF=el.getAttribute("data-pf");render();};});
  document.querySelectorAll("[data-goflux]").forEach(function(el){el.onclick=function(ev){ev.stopPropagation();var k=el.getAttribute("data-goflux");tab="fluxo";view="hub";cur=k;filter="";renderTabs();render();try{window.scrollTo(0,0);}catch(e){}};});
}
function controlesHtml(){
  var itens=["Controle de Erros","Controle de INSS","Controle de ISS","Controle de Pagamentos Divergentes"];
  var d='<div class="crumb">Controles</div><div class="titlerow"><h1>Controles</h1></div><div class="lead">Controles operacionais da área. Estrutura preparada para os controles abaixo.</div>';
  itens.forEach(function(t){d+='<div style="border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px;background:var(--surface-2);"><div style="font-weight:600;margin-bottom:4px;">'+t+'</div><div style="font-size:13px;color:var(--faint);">A definir.</div></div>';});
  d+='<div style="font-size:12.5px;color:var(--muted);margin-top:6px;">Novos controles poderão ser adicionados aqui.</div>';
  return '<div class="panel panel-full">'+d+'</div>';
}
function responsaveisHtml(){
  var d='<div class="crumb">Responsáveis</div><div class="titlerow"><h1>Responsáveis</h1></div><div class="lead">Responsáveis por processo e por unidade.</div>';
  d+='<div style="border:1px solid var(--border);border-radius:10px;padding:16px 18px;background:var(--surface-2);color:var(--muted);font-size:14px;line-height:1.6;">Aguardando a planilha de responsáveis. Assim que enviada, será espelhada aqui — por processo e por unidade.</div>';
  return '<div class="panel panel-full">'+d+'</div>';
}
document.addEventListener("keydown",function(e){if(view!=="present")return;
  if(e.key==="ArrowRight")document.getElementById("next")&&document.getElementById("next").click();
  if(e.key==="ArrowLeft")document.getElementById("prev")&&document.getElementById("prev").click();
  if(e.key==="Escape")document.getElementById("back")&&document.getElementById("back").click();});
(function init(){
  var u=document.getElementById("updated"); if(u)u.textContent="atualizado em "+new Date().toLocaleDateString("pt-BR");
  var cf=document.getElementById("coverFoot"); if(cf)cf.textContent="atualizado em "+new Date().toLocaleDateString("pt-BR");
  var cb=document.getElementById("coverBtn"); if(cb)cb.onclick=function(){document.getElementById("cover").style.display="none";};
  renderTabs(); render();
})();