/* ===== MOTOR / APP ===== */
var P=Object.assign({}, PROC, FAQ, {calendario:CAL_ITEM});
var CONCEPT_GERAL={"1":"classificacao","2":"classificacao","8":"classificacao","12":"classificacao","13":"classificacao"};
function goFlux(k){tab="fluxo";view="hub";cur=k;filter="";renderTabs();render();try{window.scrollTo(0,0);}catch(e){}}

var PROCFISC={
  recebimento:{ name:"Recebimento e fontes de entrada", svgmap:true },
  classificacao:{name:"Classificação da nota", svgmap:true},
  analise:{name:"Análise da nota", svgmap:true},
  chamados:{name:"Abertura de chamados", svgmap:true},
  carimbo:{name:"Carimbo da nota", svgmap:true},
  lancamento:{name:"Lançamento no SAP", svgmap:true},
  armazenamento:{name:"Armazenamento da nota", svgmap:true},
  fechamento:{name:"Planilha de Contratos", svgmap:true}
};
var ORDER_PROCFISC=["recebimento","classificacao","analise","carimbo","lancamento","chamados","armazenamento","fechamento"];

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
    var dg='<div class="crumb">Fluxo fiscal</div><div class="titlerow" style="margin-bottom:8px;"><h1 style="font-size:22px;">Fluxo fiscal completo</h1></div>'
      +'<button class="cta" id="fullflow-btn" style="margin-bottom:12px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>Abrir fluxo completo detalhado (nova aba)</button>'
      +'<div style="font-size:12.5px;color:var(--muted);margin-bottom:10px;">Visão geral abaixo — toque nas caixas azuis para ir ao detalhe de cada etapa. Para o fluxo inteiro detalhado em tela cheia, use o botão acima.</div>'
      +'<div style="border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:12px;overflow:auto;max-height:calc(100vh - 340px);">'+geralMapSvg()+'</div>';
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





var TABS=[["fluxo","Fluxo fiscal"],["processos","Processos Fiscais"],["duvidas","Dúvidas recorrentes"],["calendario","Calendário"],["responsaveis","Responsáveis"]];
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
  document.querySelectorAll("[data-goflux]").forEach(function(el){el.onclick=function(ev){ev.stopPropagation();goFlux(el.getAttribute("data-goflux"));};});
  var fb=document.getElementById("fullflow-btn"); if(fb)fb.onclick=openFullFlow;
}
function wirePresent(){
  document.getElementById("back").onclick=function(){view="hub";stepIdx=-1;render();};
  document.getElementById("prev").onclick=function(){stepIdx=Math.max(0,stepIdx>0?stepIdx-1:0);applyHighlight();};
  document.getElementById("next").onclick=function(){stepIdx=Math.min(stepIdx+1,P[cur].steps.length-1);applyHighlight();};
  document.getElementById("showall").onclick=function(){stepIdx=-1;applyHighlight();};
  document.querySelectorAll('#flow .fnode[data-i]').forEach(function(n){
    n.style.cursor="pointer";
    var i=n.getAttribute("data-i");
    var concept=(cur==="geral")?CONCEPT_GERAL[i]:null;
    if(concept){ n.addEventListener("click",function(e){e.stopPropagation();goFlux(concept);}); }
    else { n.addEventListener("click",function(){stepIdx=parseInt(i);applyHighlight();}); }
  });
  applyHighlight();
}
function render(){
  if(view==="present"){root.innerHTML=presentHtml();wirePresent();return;}
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
function fullFlowSvg(){
  var Of="#EDEDEA",Os="#9A988F",Ot="#4A4844", Bf="#E6F1FB",Bs="#185FA5",Bt="#0C447C", Wf="#FEF3D6",Ws="#D9A62E",Wt="#6E5312", Df="#FBEFD8",Ds="#C9922E",Dt="#6B4A12", Gf="#E7F3EC",Gs="#2E7D46",Gt="#1E5B32", Rf="#FCEBEB",Rs="#D9534F",Rt="#8A2A26";
  function lbl(x,y,anc,t){return '<text x="'+x+'" y="'+y+'" text-anchor="'+anc+'" fill="#8A8780" font-size="13" font-family="inherit">'+t+'</text>';}
  var s='<svg viewBox="0 0 3500 940" width="3500" height="940" xmlns="http://www.w3.org/2000/svg" style="display:block;">'+ARROW;
  /* espinha inicial */
  s+=pgNode(40,366,190,68,Bf,Bs,Bt,"Recebimento","localizar a nota");
  s+=pgLine(230,400,278,400);
  s+=pgNode(280,366,190,68,Bf,Bs,Bt,"Classificação","tipo da nota");
  s+=pgLine(470,400,538,400);
  s+=pgDiamond(620,400,170,100,Df,Ds,Dt,"Qual o tipo?");
  /* FIXO (cima) */
  s+=pgLine(700,400,778,161);
  s+=pgNode(780,132,190,58,Bf,Bs,Bt,"Contrato fixo","");
  s+=pgLine(970,161,1718,384,false);
  /* ESPORÁDICA (meio) */
  s+=pgLine(700,400,778,400);
  s+=pgNode(780,372,190,58,Bf,Bs,Bt,"Esporádica","vem da unidade (JIRA)");
  s+=pgLine(970,401,1718,401);
  /* VARIÁVEL (baixo) */
  s+=pgLine(700,400,778,640);
  s+=pgNode(780,612,190,58,Bf,Bs,Bt,"Contrato variável","");
  s+=pgLine(970,640,1013,640);
  s+=pgNode(1015,612,200,58,Wf,Ws,Wt,"Envia à unidade (JIRA)","aprovar antes de lançar");
  s+=pgLine(1215,640,1268,640);
  s+=pgDiamond(1360,640,180,92,Df,Ds,Dt,"Unidade aprovou?");
  s+=pgLine(1450,640,1718,418,false)+lbl(1470,540,"start","sim");
  s+=pgLine(1360,686,1360,760,true)+lbl(1368,730,"start","não");
  s+=pgNode(1250,762,220,58,Rf,Rs,Rt,"Retorna ao fornecedor","ajustar e reenviar");
  s+=pgLine(1250,791,1115,670,true)+lbl(1120,740,"start","reenvia");
  /* ANÁLISE */
  s+=pgNode(1720,366,200,68,Bf,Bs,Bt,"Análise da nota","prestador · serviço · impostos");
  s+=pgLine(1920,400,1978,400);
  s+=pgDiamond(2080,400,200,100,Df,Ds,Dt,"Discriminação e impostos ok?");
  s+=pgLine(2180,400,2318,400)+lbl(2250,390,"middle","sim");
  s+=pgLine(2080,450,2130,538,true)+lbl(2138,510,"start","não");
  s+=pgNode(2000,540,260,64,Rf,Rs,Rt,"Reemitir / carta de correção","corrigir antes de seguir");
  /* CARIMBO -> LANÇAMENTO -> ARMAZENAMENTO -> PLANILHA -> FIM */
  s+=pgNode(2320,366,180,68,Bf,Bs,Bt,"Carimbo","retenções · IVA · SAP");
  s+=pgLine(2500,400,2558,400);
  s+=pgNode(2560,366,190,68,Bf,Bs,Bt,"Lançamento no SAP","");
  s+=pgLine(2750,400,2808,400);
  s+=pgNode(2810,366,190,68,Bf,Bs,Bt,"Armazenamento","arquivar a nota");
  s+=pgLine(3000,400,3058,400);
  s+=pgNode(3060,366,200,68,Bf,Bs,Bt,"Planilha de Contratos","registro / controle");
  s+=pgLine(3260,400,3300,400);
  s+=pgOval(3390,400,70,44,Of,Os,Ot,"Fim","");
  /* legenda */
  return s+'</svg>';
}
function openFullFlow(){
  var svg=fullFlowSvg();
  var html='<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fluxo Fiscal Completo</title>'
    +'<style>*{box-sizing:border-box}body{margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#EEF2F7;color:#1a1a1a}'
    +'header{padding:14px 24px;background:#184CA0;color:#fff}header h1{margin:0;font-size:18px;font-weight:600}header p{margin:3px 0 0;font-size:12.5px;opacity:.85}'
    +'.scroll{overflow:auto;height:calc(100vh - 60px);padding:20px}svg{display:block}</style></head>'
    +'<body><header><h1>Fluxo Fiscal Completo — Prevent Senior</h1><p>Processo completo detalhado. Role para navegar por todo o fluxo.</p></header>'
    +'<div class="scroll">'+svg+'</div></body></html>';
  var w=window.open("","_blank");
  if(w){ w.document.open(); w.document.write(html); w.document.close(); }
  else { alert("Permita pop-ups para abrir o fluxo completo em nova aba."); }
}
function geralMapSvg(){
  var Of="#EDEDEA",Os="#9A988F",Ot="#4A4844", Bf="#E6F1FB",Bs="#185FA5",Bt="#0C447C", Wf="#FEF3D6",Ws="#D9A62E",Wt="#6E5312", Df="#FBEFD8",Ds="#C9922E",Dt="#6B4A12", Gf="#E7F3EC",Gs="#2E7D46",Gt="#1E5B32", Rf="#FCEBEB",Rs="#D9534F",Rt="#8A2A26";
  function lbl(x,y,anc,t){return '<text x="'+x+'" y="'+y+'" text-anchor="'+anc+'" fill="#8A8780" font-size="12.5" font-family="inherit">'+t+'</text>';}
  var s='<svg viewBox="0 0 2600 680" width="2600" height="680" xmlns="http://www.w3.org/2000/svg" style="display:block;">'+ARROW;
  /* espinha */
  s+=pgNode(30,268,180,64,Bf,Bs,Bt,"Recebimento","localizar a nota","recebimento");
  s+=pgLine(210,300,248,300);
  s+=pgNode(250,268,180,64,Bf,Bs,Bt,"Classificação","tipo da nota","classificacao");
  s+=pgLine(430,300,486,300);
  s+=pgDiamond(560,300,150,90,Df,Ds,Dt,"Qual o tipo?");
  /* tipos */
  s+=pgNode(690,140,180,56,Bf,Bs,Bt,"Contrato fixo","","classificacao");
  s+=pgNode(690,272,180,56,Bf,Bs,Bt,"Esporádica","vem da unidade (JIRA)","classificacao");
  s+=pgNode(690,404,180,56,Bf,Bs,Bt,"Contrato variável","","classificacao");
  s+=pgLine(635,300,688,168)+pgLine(635,300,688,300)+pgLine(635,300,688,432);
  /* ÊNFASE: contrato fixo NÃO abre chamado */
  s+=pgNode(690,36,300,62,Rf,Rs,Rt,"NÃO abrir chamado para contrato fixo","resolver direto com o prestador");
  s+=pgLine(780,140,820,100);
  /* variável -> aprovação */
  s+=pgNode(920,404,196,56,Wf,Ws,Wt,"Aprovação na unidade","via JIRA, antes de lançar");
  s+=pgLine(870,432,918,432);
  /* convergência -> Análise */
  s+=pgLine(870,168,1178,286)+pgLine(870,300,1178,300)+pgLine(1116,432,1178,318);
  s+=pgNode(1180,268,180,64,Bf,Bs,Bt,"Análise da nota","prestador · serviço · impostos","analise");
  s+=pgLine(1360,300,1372,300);
  s+=pgDiamond(1450,300,150,88,Df,Ds,Dt,"Impostos ok?");
  s+=pgLine(1524,300,1598,300)+lbl(1560,290,"middle","sim");
  s+=pgNode(1360,412,240,60,Rf,Rs,Rt,"Reemitir / carta de correção","corrigir antes de seguir");
  s+=pgLine(1450,344,1470,410,true)+lbl(1478,384,"start","não");
  /* carimbo -> lançamento -> armazenamento -> planilha -> fim */
  s+=pgNode(1600,268,160,64,Bf,Bs,Bt,"Carimbo","retenções · IVA","carimbo");
  s+=pgLine(1760,300,1798,300);
  s+=pgNode(1800,268,180,64,Bf,Bs,Bt,"Lançamento no SAP","","lancamento");
  s+=pgLine(1980,300,2018,300);
  s+=pgNode(2020,268,180,64,Bf,Bs,Bt,"Armazenamento","arquivar a nota","armazenamento");
  s+=pgLine(2200,300,2238,300);
  s+=pgNode(2240,268,190,64,Bf,Bs,Bt,"Planilha de Contratos","registro / controle","fechamento");
  s+=pgLine(2430,300,2470,300);
  s+=pgOval(2530,300,58,40,Of,Os,Ot,"Fim","");
  /* legenda */
  return s+'</svg>';
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
window.recToggle=function(k){recOpen[k]=!recOpen[k];render();};
function ln(x1, y1, x2, y2, dash) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function elb(x1, y1, x2, y2, dash) { var mx = x1 + 20; return '<path d="M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2 + '" fill="none" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function conv(x1, y1, mx, y2, x2, dash) { return '<path d="M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2 + '" fill="none" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function elbBack(x1, y1, mx, y2, x2, dash) { return '<path d="M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2 + '" fill="none" stroke="#C9CFD8" stroke-width="1.6" marker-end="url(#arrow)"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
function recLbl(x, y, anc, t) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + anc + '" fill="#8A8780" font-size="12.5" font-weight="600" font-family="inherit">' + t + '</text>'; }
function bx(x, y, w, h, c, title, sub, plus, on) {
    var cx = x + w / 2, r = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1"/>';
    if (sub) {
        r += '<text x="' + cx + '" y="' + (y + h / 2 - 7) + '" text-anchor="middle" fill="' + c[2] + '" font-size="14" font-weight="600">' + title + '</text>';
        r += '<text x="' + cx + '" y="' + (y + h / 2 + 10) + '" text-anchor="middle" fill="' + c[2] + '" font-size="11" opacity=".85">' + sub + '</text>';
    } else { 
        r += '<text x="' + cx + '" y="' + (y + h / 2) + '" text-anchor="middle" dominant-baseline="central" fill="' + c[2] + '" font-size="14" font-weight="600">' + title + '</text>'; 
    }
    if (plus) {
        var px = x + w - 13, py = y + h - 13;
        r += '<g class="pl" onclick="recToggle(\'' + plus + '\')" style="cursor:pointer"><circle cx="' + px + '" cy="' + py + '" r="11" fill="' + (on ? c[1] : "#fff") + '" stroke="' + c[1] + '" stroke-width="1.3"/><text x="' + px + '" y="' + (py + 1) + '" text-anchor="middle" dominant-baseline="central" fill="' + (on ? "#fff" : c[1]) + '" font-size="15" font-weight="700">' + (on ? "–" : "+") + '</text></g>';
    }
    return r;
}
function di_plus(cx, cy, w, h, c, title, plus, on) {
    var pts = cx + ',' + (cy - h / 2) + ' ' + (cx + w / 2) + ',' + cy + ' ' + cx + ',' + (cy + h / 2) + ' ' + (cx - w / 2) + ',' + cy;
    var r = '<polygon points="' + pts + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1"/>';
    r += '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="central" fill="' + c[2] + '" font-size="13.5" font-weight="600" font-family="inherit">' + title + '</text>';
    if (plus) {
        var px = cx + w / 2 - 15, py = cy + h / 2 - 15;
        r += '<g class="pl" onclick="recToggle(\'' + plus + '\')" style="cursor:pointer"><circle cx="' + px + '" cy="' + py + '" r="11" fill="' + (on ? c[1] : "#fff") + '" stroke="' + c[1] + '" stroke-width="1.3"/><text x="' + px + '" y="' + (py + 1) + '" text-anchor="middle" dominant-baseline="central" fill="' + (on ? "#fff" : c[1]) + '" font-size="15" font-weight="700">' + (on ? "–" : "+") + '</text></g>';
    }
    return r;
}
function recMapSvg() {
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
            right_edges.push({x: xAtiva+260, y: yPassiva});
            curY = Math.max(curY, yPassiva + 80);
        }
        
        // MACRO: Nota Localizada (Calculando o X baseando em tudo que foi aberto)
        xNota = max_x_canais + 120;
        var cxEnc2 = xNota - 60;

        // Coletor (Funnels everything to Nota Localizada)
        right_edges.forEach(function(edge) {
            s += conv(edge.x, edge.y + 30, cxEnc2, yM + 30, xNota);
        });
        
        // Liga as macros nao abertas direto
        if(!recOpen["rec_ativa"]) s += conv(xAtiva+240, yAtiva+30, cxEnc2, yM+30, xNota);
        if(!recOpen["rec_passiva"]) s += conv(xAtiva+260, yPassiva+30, cxEnc2, yM+30, xNota);
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
    s += bx(xFim, yM, 240, 60, C.gy, "Classificação da nota", "próximo passo", null, false);
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

    var wTotal = xFim + 300;
    return '<svg viewBox="0 0 ' + wTotal + ' ' + max_y + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">' + ARROW + s + '</svg>';
}

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
    {t:"Segue para lançamento", sub:"próximo passo", c:"gy"}
  ]},
  lancamento:{ main:[
    {t:"Tipo de documento", sub:"serviço · MEI · telecom · fatura", c:"bl"},
    {t:"Tipo da nota", sub:"S6 / S5 / T1", c:"bl"},
    {t:"Vencimento", sub:"definir em PAGAMENTO", c:"bl"},
    {t:"Simular", sub:"verificação final", c:"bl"},
    {t:"Gravar", sub:"confirma o lançamento", c:"gr"},
    {t:"Armazenamento", sub:"próximo passo", c:"gy"}
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
    {t:"Concluído", sub:"fim do armazenamento", c:"gr"}
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
    {t:"Identificar o tipo", sub:"conforme contrato / pedido", c:"bl"},
    {t:"Qual o tipo?", sub:"fixo · variável · esporádica", c:"bl", plus:"cl_tipo", branches:[
      {t:"Contrato fixo", sub:"valor fixo mensal", c:"no", chain:[{t:"Conferir valor do contrato", c:"gr"}]},
      {t:"Contrato variável", sub:"varia por demanda", c:"no", q:"Bate com a média?", sim:[{t:"Classificar", c:"gr"}], nao:[{t:"Investigar divergência", c:"rd"}]},
      {t:"Esporádica", sub:"vem da unidade (JIRA)", c:"no", chain:[{t:"Unidade envia pelo chamado", c:"gr"}]}
    ]},
    {t:"Nota classificada", sub:"pronta para análise", c:"gr"},
    {t:"Análise da nota", sub:"próximo passo", c:"gy"}
  ]},
  analise:{ main:[
    {t:"Prestador", sub:"CNPJ · município · regime", c:"bl", plus:"an_pr", branches:[
      {t:"CNPJ ativo · razão social", c:"no"},
      {t:"Município define o ISS", c:"no"},
      {t:"Optante do Simples muda a retenção", c:"wa"}
    ]},
    {t:"Tomador", sub:"confirmar pelo pedido", c:"bl"},
    {t:"Serviço", sub:"código × descrição", c:"bl"},
    {t:"Impostos e retenção", sub:"Lei 116/2003", c:"bl", plus:"an_im", branches:[
      {t:"O código de serviço define a retenção", c:"no"},
      {t:"Nem todo imposto destacado é retido", c:"wa"}
    ]},
    {t:"Discriminação ok?", sub:"conferir divergências", c:"bl", plus:"an_ok", branches:[
      {t:"Conferência final", sub:"", c:"no", q:"Tudo certo?", sim:[{t:"Segue p/ carimbo", c:"gr"}], nao:[{t:"Valor/cadastro → reemitir", c:"rd"},{t:"Só descrição → carta de correção", c:"wa"}]}
    ]},
    {t:"Carimbo", sub:"próximo passo", c:"gy"}
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
  if(b.q){ var sw=0,nw=0; (b.sim||[]).forEach(function(){sw+=PM.OW+PM.GAP;}); (b.nao||[]).forEach(function(){nw+=PM.OW+PM.GAP;}); return base+30+PM.DW+PM.GAP+Math.max(sw,nw); }
  if(b.chain){ var w=base; b.chain.forEach(function(){w+=PM.GAP+PM.OW;}); return w; }
  return base; }
function pmBH(b){ if(b.q) return PM.BH + ((b.nao&&b.nao.length)?86:0); return PM.BH; }
function pmExpW(n){ if(!n.plus||!recOpen[n.plus]||!n.branches) return 0; var w=0; n.branches.forEach(function(b){w=Math.max(w,pmBW(b));}); return w; }
function buildProcMap(spec){
  var s="", CY=PM.CY, x=20, maxX=0, maxY=CY+90, pts=[];
  spec.main.forEach(function(n){ pts.push({x:x,n:n}); x += Math.max(PM.NW, pmExpW(n)) + PM.GX; });
  pts.forEach(function(p,i){
    var n=p.n, nx=p.x, ny=CY-PM.NH/2;
    s += bx(nx,ny,PM.NW,PM.NH,C[n.c],n.t,n.sub||"",n.plus||null,n.plus?recOpen[n.plus]:false);
    maxX=Math.max(maxX,nx+PM.NW);
    if(i<pts.length-1) s += ln(nx+PM.NW, CY, pts[i+1].x, CY);
    if(n.plus && recOpen[n.plus] && n.branches){
      var by=CY+72;
      n.branches.forEach(function(b){
        s += elb(nx+PM.NW/2, CY+PM.NH/2, nx, by+PM.BH/2);
        s += bx(nx,by,PM.BW,PM.BH,C[b.c],b.t,b.sub||"",null,false);
        var rx=nx+PM.BW;
        if(b.q){
          s += ln(rx,by+PM.BH/2,rx+30,by+PM.BH/2);
          var dcx=rx+30+PM.DW/2, dcy=by+PM.BH/2;
          s += di_plus(dcx,dcy,PM.DW,PM.DH,C.wa,b.q,null,null);
          var dR=rx+30+PM.DW, sx=dR+PM.GAP;
          s += ln(dR,dcy,sx,dcy) + recLbl(dR+8,dcy-10,"start","sim");
          (b.sim||[]).forEach(function(o,j){ if(j) s+=ln(sx-PM.GAP,by+PM.BH/2,sx,by+PM.BH/2); s+=bx(sx,by,PM.OW,PM.BH,C[o.c],o.t,o.sub||"",null,false); sx+=PM.OW+PM.GAP; });
          maxX=Math.max(maxX,sx);
          var ny2=by+PM.BH+32;
          (b.nao||[]).forEach(function(o,j){
            var nxp=rx+30 + j*(PM.OW+PM.GAP);
            if(j===0) s+=elb(dcx, dcy+PM.DH/2, nxp, ny2+PM.BH/2)+recLbl(dcx+6, dcy+PM.DH/2+14,"start","não");
            else s+=ln(nxp-PM.GAP,ny2+PM.BH/2,nxp,ny2+PM.BH/2);
            s+=bx(nxp,ny2,PM.OW,PM.BH,C[o.c],o.t,o.sub||"",null,false);
            maxX=Math.max(maxX,nxp+PM.OW);
          });
        } else if(b.chain){
          var cx=rx;
          b.chain.forEach(function(o){ s+=ln(cx,by+PM.BH/2,cx+PM.GAP,by+PM.BH/2); cx+=PM.GAP; s+=bx(cx,by,PM.OW,PM.BH,C[o.c],o.t,o.sub||"",null,false); cx+=PM.OW; });
          maxX=Math.max(maxX,cx);
        }
        by += pmBH(b)+18;
      });
      maxY=Math.max(maxY,by);
    }
  });
  var W=maxX+40, H=Math.max(maxY,CY+90);
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">'+ARROW+s+'</svg>';
}
function procfiscHtml(){
  if(!curPF)curPF=ORDER_PROCFISC[0];
  var railh='<div class="sec-label">Processos</div>';
  ORDER_PROCFISC.forEach(function(k){railh+='<div class="item'+(k===curPF?" active":"")+'" data-pf="'+k+'"><span class="name">'+PROCFISC[k].name+'</span></div>';});
  var p=PROCFISC[curPF];
  if(p.svgmap){
    var d='<div class="crumb" style="margin-bottom:2px;">Processos Fiscais</div>';
    d+='<div class="titlerow" style="margin-bottom:8px;"><h1 style="font-size:21px;">'+p.name+'</h1></div>';
    d+='<div style="flex:1;min-height:0;position:relative;border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:6px 8px;">';
    d+=(curPF==="recebimento"?recMapSvg():buildProcMap(PROCMAP[curPF]));
    d+='</div>';
    return '<div class="layout"><div class="rail">'+railHtml_pf(railh)+'</div><div class="panel" style="display:flex;flex-direction:column;overflow:hidden;">'+d+'</div></div>';
  }
  var d='<div class="crumb">Processos Fiscais</div><div class="titlerow"><h1>'+p.name+'</h1></div>';
  var campos=[["Objetivo","objetivo"],["Descrição","descricao"],["Responsáveis","responsaveis"],["Passo a passo","passos"],["Exceções","excecoes"],["Observações","observacoes"]];
  d+='<div class="lead">Estrutura do processo — preencher cada campo abaixo.</div>';
  campos.forEach(function(c){var val=p.campos[c[1]];d+='<div style="border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px;background:var(--surface-2);"><div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--accent-ink);margin-bottom:6px;">'+c[0]+'</div><div style="font-size:14px;color:'+(val?"var(--ink)":"var(--faint)")+';line-height:1.65;">'+(val||"A preencher.")+'</div></div>';});
  return '<div class="layout"><div class="rail">'+railh+'</div><div class="panel">'+d+'</div></div>';
}
function railHtml_pf(h){return h;}
function wireProcfisc(){
  document.querySelectorAll("[data-pf]").forEach(function(el){el.onclick=function(){curPF=el.getAttribute("data-pf");render();};});
  document.querySelectorAll("[data-goflux]").forEach(function(el){el.onclick=function(ev){ev.stopPropagation();goFlux(el.getAttribute("data-goflux"));};});
}

function responsaveisHtml(){
  var url="https://docs.google.com/spreadsheets/d/14plYnNX5NYxVUgI9fo2rPDzuDhmaP7gpdLNrw6qaK18/edit?usp=sharing";
  var d='<div class="crumb">Responsáveis</div><div class="titlerow"><h1>Responsáveis</h1></div>';
  d+='<div class="lead">Unidades, responsáveis e contatos ficam na planilha oficial (Google Sheets). O acesso é controlado pelo Google — só quem tem permissão consegue abrir.</div>';
  d+='<a href="'+url+'" target="_blank" rel="noopener" class="cta" style="text-decoration:none;display:inline-flex;">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
    +'Abrir planilha de responsáveis</a>';
  d+='<div style="margin-top:16px;border:1px solid var(--accent);background:var(--accent-soft);color:var(--accent-ink);border-radius:10px;padding:13px 16px;font-size:13px;line-height:1.6;">'
    +'<b>Acesso restrito.</b> A planilha não é exibida dentro do manual — abre em uma aba própria do Google, protegida pelas permissões de compartilhamento. Peça acesso ao responsável caso o Google solicite.'
    +'</div>';
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