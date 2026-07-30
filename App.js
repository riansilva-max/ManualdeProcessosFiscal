/* ===== MOTOR / APP ===== */
var P=Object.assign({}, PROC, FAQ, {calendario:CAL_ITEM});
var STAT={pronto:["var(--ok)","pronto"],rascunho:["var(--draft)","rascunho"],vazio:["var(--empty)","a preencher"]};
var cur="geral", view="hub", filter="", stepIdx=-1, catOpen={}, selCal=null, nearOpen=false, calMonthOpen=null, calYear=null, tab="fluxo";
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
  var wd=["D","S","T","Q","Q","S","S"];
  var h='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;">';
  wd.forEach(function(w){h+='<div style="text-align:center;font-size:11px;color:var(--faint);padding:2px;">'+w+'</div>';});
  for(var i=0;i<first;i++)h+='<div></div>';
  for(var dn=1;dn<=days;dn++){
    var iso=calIso(y,m,dn), isSel=(iso===selCal), isToday=(iso===todayIso);
    var bg=isSel?"var(--accent-soft)":"transparent";
    var bd=isSel?"2px solid var(--accent)":(isToday?"1px solid var(--border-strong)":"1px solid var(--border)");
    h+='<div data-cal="'+iso+'" style="cursor:pointer;text-align:center;padding:6px 2px;border:'+bd+';border-radius:7px;background:'+bg+';font-size:12.5px;min-height:30px;">'+dn+'</div>';
  }
  return h+'</div>';
}
function taskGet(d){try{return JSON.parse(localStorage.getItem("manualfiscal:tasks:"+d)||"[]");}catch(e){return [];}}
function taskSet(d,x){try{localStorage.setItem("manualfiscal:tasks:"+d,JSON.stringify(x));}catch(e){}}
function renderCalDay(){
  var el=document.getElementById("calday"); if(!el)return;
  if(!selCal){el.innerHTML='<div style="font-size:13px;color:var(--faint);margin-top:12px;">Clique em um dia para ver os avisos e as tarefas.</div>';return;}
  var ev=(typeof EVENTOS!=="undefined"&&EVENTOS[selCal])?EVENTOS[selCal]:[];
  var list=VENC[selCal]||[];
  var comp=(selCal===COMPET_FECHA)?'<div style="margin-bottom:8px;color:var(--danger-ink);font-weight:500;">Fechamento da competência.</div>':'';
  var det='<div style="border:1px solid var(--border);border-radius:10px;padding:16px 18px;background:var(--surface-2);margin-top:14px;">';
  det+='<div style="font-weight:600;margin-bottom:10px;">'+calBR(selCal)+'</div>'+comp;
  if(ev.length) det+='<div style="font-size:12px;font-weight:600;color:var(--accent-ink);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Avisos e eventos</div><div style="font-size:14px;line-height:1.85;margin-bottom:'+(list.length?"12px":"0")+';">'+ev.map(function(f){return "• "+calEsc(f);}).join("<br>")+'</div>';
  if(list.length) det+='<div style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Vencimentos ('+list.length+')</div><div style="font-size:14px;line-height:1.85;">'+list.map(function(f){return "• "+calEsc(f);}).join("<br>")+'</div>';
  if(!ev.length && !list.length && !comp) det+='<div style="font-size:13px;color:var(--muted);">Sem avisos ou vencimentos neste dia.</div>';
  det+='</div>';
  var tk=taskGet(selCal);
  var t='<div style="border:1px solid var(--border);border-radius:10px;padding:16px 18px;background:var(--surface-2);margin-top:12px;">';
  t+='<div style="font-weight:600;margin-bottom:4px;">Minhas tarefas — '+calBR(selCal)+'</div>';
  t+='<div style="font-size:12px;color:var(--muted);margin-bottom:12px;">Anote o que fazer neste dia. Salvo só neste navegador, para você — volte quando quiser para consultar.</div>';
  t+='<div style="display:flex;gap:8px;margin-bottom:'+(tk.length?"12px":"0")+';"><input id="taskinput" class="search" style="flex:1;margin:0;" placeholder="Nova tarefa…"><button class="cta" id="taskadd" style="width:auto;">Adicionar</button></div>';
  if(tk.length) t+='<div>'+tk.map(function(it,i){return '<label style="display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--border);border-radius:9px;margin-bottom:7px;background:'+(it.done?"var(--accent-soft)":"var(--surface)")+';"><input type="checkbox" data-tk="'+i+'" '+(it.done?"checked":"")+' style="width:17px;height:17px;accent-color:var(--accent);cursor:pointer;"><span style="flex:1;font-size:14px;'+(it.done?"color:var(--muted);text-decoration:line-through;":"color:var(--ink);")+'">'+calEsc(it.text)+'</span><button data-del="'+i+'" title="remover" style="background:none;border:none;color:var(--faint);cursor:pointer;font-size:18px;line-height:1;">×</button></label>';}).join('')+'</div>';
  t+='</div>';
  el.innerHTML=det+t;
  var inp=document.getElementById("taskinput"), add=document.getElementById("taskadd");
  function addTask(){var v=inp.value.trim(); if(!v)return; var x=taskGet(selCal); x.push({text:v,done:false}); taskSet(selCal,x); renderCalDay(); var ni=document.getElementById("taskinput"); if(ni)ni.focus();}
  if(add)add.onclick=addTask; if(inp)inp.onkeydown=function(e){if(e.key==="Enter")addTask();};
  el.querySelectorAll("[data-tk]").forEach(function(cb){cb.onchange=function(){var x=taskGet(selCal);x[cb.getAttribute("data-tk")].done=cb.checked;taskSet(selCal,x);renderCalDay();};});
  el.querySelectorAll("[data-del]").forEach(function(bt){bt.onclick=function(e){e.preventDefault();var x=taskGet(selCal);x.splice(bt.getAttribute("data-del"),1);taskSet(selCal,x);renderCalDay();};});
}
function renderCalendar(){
  var host=document.getElementById("calwrap"); if(!host)return;
  var today=new Date(); today.setHours(0,0,0,0);
  var todayIso=calIso(today.getFullYear(),today.getMonth(),today.getDate());
  if(calYear===null) calYear=today.getFullYear();
  if(calMonthOpen===null) calMonthOpen=today.getMonth();
  var cf=new Date(COMPET_FECHA+"T00:00:00"); var dd=Math.round((cf-today)/86400000);
  var compHtml=(dd>=0&&dd<=7)?'<div class="cal-alert danger" style="margin-top:16px;">'+(dd===0?"A competência fecha hoje":"Faltam "+dd+(dd===1?" dia":" dias")+" para o fechamento da competência")+' ('+calBR(COMPET_FECHA)+') — lançar todas as notas com impostos antes do fechamento.</div>':(dd<0?'':'<div style="font-size:13px;color:var(--muted);margin-top:16px;">Fechamento da competência em '+calBR(COMPET_FECHA)+'.</div>');
  var ab=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  var picker='<div class="calpicker"><div class="calpicker-head"><span>'+calYear+'</span><span class="yrnav"><button data-yr="-1">‹</button><button data-yr="1">›</button></span></div><div class="calmon-grid">';
  for(var m=0;m<12;m++){
    var pref=calYear+"-"+calPad(m+1);
    var hasData=Object.keys(VENC).some(function(iso){return iso.indexOf(pref)===0;})||(COMPET_FECHA.indexOf(pref)===0)||(typeof EVENTOS!=="undefined"&&Object.keys(EVENTOS).some(function(iso){return iso.indexOf(pref)===0;}));
    var sel=(m===calMonthOpen);
    picker+='<div class="calmon'+(sel?' sel':'')+'" data-mon="'+m+'">'+ab[m]+(hasData?'<span style="position:absolute;top:6px;right:8px;width:6px;height:6px;border-radius:50%;background:'+(sel?"#fff":"var(--accent)")+';"></span>':'')+'</div>';
  }
  picker+='</div></div>';
  var grid='<div>'+monthGrid(new Date(calYear,calMonthOpen,1),todayIso)+'<div id="calday"></div></div>';
  host.innerHTML=picker+grid+compHtml;
  host.querySelectorAll("[data-yr]").forEach(function(el){el.onclick=function(){calYear+=parseInt(el.getAttribute("data-yr"));selCal=null;renderCalendar();};});
  host.querySelectorAll("[data-mon]").forEach(function(el){el.onclick=function(){calMonthOpen=parseInt(el.getAttribute("data-mon"));selCal=null;renderCalendar();};});
  host.querySelectorAll("[data-cal]").forEach(function(c){c.onclick=function(){selCal=c.getAttribute("data-cal");renderCalendar();};});
  renderCalDay();
}





var TABS=[["fluxo","Fluxo fiscal"],["duvidas","Dúvidas recorrentes"],["calendario","Calendário"]];
function renderTabs(){
  document.getElementById("tabbar").innerHTML=TABS.map(function(t){return '<button class="tabbtn'+(tab===t[0]?" active":"")+'" data-tab="'+t[0]+'">'+t[1]+'</button>';}).join("");
  document.querySelectorAll(".tabbtn").forEach(function(b){b.onclick=function(){switchTab(b.getAttribute("data-tab"));};});
}
function switchTab(t){
  tab=t; view="hub"; stepIdx=-1; filter="";
  if(t==="fluxo")cur="geral";
  else if(t==="duvidas"){cur=ORDER_FAQ[0]; catOpen[P[ORDER_FAQ[0]].cat]=true;}
  else { cur="calendario"; var _t=new Date(); calYear=_t.getFullYear(); calMonthOpen=_t.getMonth(); selCal=calIso(_t.getFullYear(),_t.getMonth(),_t.getDate()); }
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
  root.innerHTML=hubHtml();
  wireHub();
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