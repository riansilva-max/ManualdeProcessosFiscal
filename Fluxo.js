const ARROW='<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#D6D4CC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>';

function node(cls,id,x,y,w,h,c,title,sub,href){
  const cx=x+w/2, mark=href?'<text x="'+(x+w-12)+'" y="'+(y+14)+'" text-anchor="end" fill="'+c[1]+'" font-size="12">↗</text>':'';
  let inner='<g class="'+cls+'"'+(id!=null?' data-i="'+id+'"':'')+'><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1"/>';
  if(sub){
    inner+='<text class="th" x="'+cx+'" y="'+(y+h/2-9)+'" text-anchor="middle" dominant-baseline="central" fill="'+c[2]+'">'+title+'</text>';
    inner+='<text class="ts" x="'+cx+'" y="'+(y+h/2+11)+'" text-anchor="middle" dominant-baseline="central" fill="'+c[2]+'" opacity="0.8">'+sub+'</text>';
  }else{
    inner+='<text class="th" x="'+cx+'" y="'+(y+h/2)+'" text-anchor="middle" dominant-baseline="central" fill="'+c[2]+'">'+title+'</text>';
  }
  inner+=mark+'</g>';
  return href?('<a href="'+href+'" target="_blank" rel="noopener">'+inner+'</a>'):inner;
}
function box(id,x,y,w,h,c,title,sub,href){return node('fnode',id,x,y,w,h,c,title,sub,href);}
function pbox(x,y,w,h,c,title,sub,href){return node('fnode',null,x,y,w,h,c,title,sub,href);}
function line(x1,y1,x2,y2){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="arr" marker-end="url(#arrow)"/>';}

const BL=['#E6F1FB','#185FA5','#0C447C'], AM=['#FAEEDA','#BA7517','#633806'], GR=['#EAF3DE','#639922','#27500A'], RD=['#FCEBEB','#E24B4A','#791F1F'], GY=['#F1EFE8','#B4B2A9','#444441'], TL=['#E1F5EE','#0F6E56','#08503F'];

const URL_SP='https://nfe.prefeitura.sp.gov.br';
const URL_ARQ='https://app.arquivei.com.br';
const URL_NAC='https://www.nfse.gov.br/consultapublica';
const URL_JIRA='https://preventsenior.atlassian.net/servicedesk/customer/portal/27/group/160/create/1237';


/* ---- FLUXO GERAL: visão de todo o processo ---- */
const FLOW_GERAL=`<svg width="2411" viewBox="0.00 0.00 2410.30 261.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 257)">
<title>fiscal</title>
<!-- start -->
<g id="node1" class="node fnode" data-i="0"
<title>start</title>
<path fill="#eaf3de" stroke="#639922" d="M77,-126C77,-126 12,-126 12,-126 6,-126 0,-120 0,-114 0,-114 0,-102 0,-102 0,-96 6,-90 12,-90 12,-90 77,-90 77,-90 83,-90 89,-96 89,-102 89,-102 89,-114 89,-114 89,-120 83,-126 77,-126"/>
<text text-anchor="middle" x="44.5" y="-105.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Recebimento</text>
</g>
<!-- clf -->
<g id="node2" class="node fnode" data-i="1"
<title>clf</title>
<polygon fill="#faeeda" stroke="#ba7517" points="301,-140 126,-108 301,-76 476,-108 301,-140"/>
<text text-anchor="middle" x="301" y="-111.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Classificação</text>
<text text-anchor="middle" x="301" y="-99.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">fixo, variável ou esporádica?</text>
</g>
<!-- start&#45;&gt;clf -->
<g id="edge1" class="edge">
<title>start&#45;&gt;clf</title>
<path fill="none" stroke="#9aa09a" d="M89.25,-108C98.23,-108 108.2,-108 118.78,-108"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="118.81,-110.45 125.81,-108 118.81,-105.55 118.81,-110.45"/>
</g>
<!-- fix -->
<g id="node3" class="node fnode" data-i="2"
<title>fix</title>
<path fill="#e6f1fb" stroke="#185fa5" d="M649.5,-189C649.5,-189 585.5,-189 585.5,-189 579.5,-189 573.5,-183 573.5,-177 573.5,-177 573.5,-165 573.5,-165 573.5,-159 579.5,-153 585.5,-153 585.5,-153 649.5,-153 649.5,-153 655.5,-153 661.5,-159 661.5,-165 661.5,-165 661.5,-177 661.5,-177 661.5,-183 655.5,-189 649.5,-189"/>
<text text-anchor="middle" x="617.5" y="-168.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Contrato fixo</text>
</g>
<!-- clf&#45;&gt;fix -->
<g id="edge2" class="edge">
<title>clf&#45;&gt;fix</title>
<path fill="none" stroke="#9aa09a" d="M385.04,-124.63C442.63,-136.17 517.45,-151.16 566.2,-160.92"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="565.85,-163.35 573.2,-162.33 566.81,-158.55 565.85,-163.35"/>
<text text-anchor="middle" x="518.5" y="-157.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">fixo</text>
</g>
<!-- var -->
<g id="node4" class="node fnode" data-i="8"
<title>var</title>
<path fill="#e6f1fb" stroke="#185fa5" d="M662,-65C662,-65 573,-65 573,-65 567,-65 561,-59 561,-53 561,-53 561,-41 561,-41 561,-35 567,-29 573,-29 573,-29 662,-29 662,-29 668,-29 674,-35 674,-41 674,-41 674,-53 674,-53 674,-59 668,-65 662,-65"/>
<text text-anchor="middle" x="617.5" y="-44.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Contrato variável</text>
</g>
<!-- clf&#45;&gt;var -->
<g id="edge3" class="edge">
<title>clf&#45;&gt;var</title>
<path fill="none" stroke="#9aa09a" d="M386.69,-91.57C439.41,-81.35 506.06,-68.42 553.99,-59.12"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="554.51,-61.52 560.92,-57.78 553.58,-56.71 554.51,-61.52"/>
<text text-anchor="middle" x="518.5" y="-73.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">variável</text>
</g>
<!-- esp -->
<g id="node5" class="node fnode" data-i="12"
<title>esp</title>
<path fill="#e6f1fb" stroke="#185fa5" d="M644,-126C644,-126 591,-126 591,-126 585,-126 579,-120 579,-114 579,-114 579,-102 579,-102 579,-96 585,-90 591,-90 591,-90 644,-90 644,-90 650,-90 656,-96 656,-102 656,-102 656,-114 656,-114 656,-120 650,-126 644,-126"/>
<text text-anchor="middle" x="617.5" y="-105.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Esporádica</text>
</g>
<!-- clf&#45;&gt;esp -->
<g id="edge4" class="edge">
<title>clf&#45;&gt;esp</title>
<path fill="none" stroke="#9aa09a" d="M476.27,-108C511.76,-108 546.09,-108 571.89,-108"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="571.94,-110.45 578.94,-108 571.94,-105.55 571.94,-110.45"/>
<text text-anchor="middle" x="518.5" y="-110.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">esporádica</text>
</g>
<!-- ped -->
<g id="node6" class="node fnode" data-i="3"
<title>ped</title>
<path fill="#fbfaf7" stroke="#b4b2a9" d="M800,-198C800,-198 726,-198 726,-198 720,-198 714,-192 714,-186 714,-186 714,-174 714,-174 714,-168 720,-162 726,-162 726,-162 800,-162 800,-162 806,-162 812,-168 812,-174 812,-174 812,-186 812,-186 812,-192 806,-198 800,-198"/>
<text text-anchor="middle" x="763" y="-177.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Verifica pedido</text>
</g>
<!-- fix&#45;&gt;ped -->
<g id="edge5" class="edge">
<title>fix&#45;&gt;ped</title>
<path fill="none" stroke="#9aa09a" d="M661.55,-173.7C675.74,-174.59 691.73,-175.59 706.7,-176.53"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="706.82,-178.99 713.95,-176.99 707.12,-174.1 706.82,-178.99"/>
</g>
<!-- uni -->
<g id="node11" class="node fnode" data-i="9"
<title>uni</title>
<path fill="#fbfaf7" stroke="#b4b2a9" d="M803,-65C803,-65 723,-65 723,-65 717,-65 711,-59 711,-53 711,-53 711,-41 711,-41 711,-35 717,-29 723,-29 723,-29 803,-29 803,-29 809,-29 815,-35 815,-41 815,-41 815,-53 815,-53 815,-59 809,-65 803,-65"/>
<text text-anchor="middle" x="763" y="-44.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Envia à unidade</text>
</g>
<!-- var&#45;&gt;uni -->
<g id="edge12" class="edge">
<title>var&#45;&gt;uni</title>
<path fill="none" stroke="#9aa09a" d="M674.39,-47C683.92,-47 693.85,-47 703.45,-47"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="703.71,-49.45 710.71,-47 703.71,-44.55 703.71,-49.45"/>
</g>
<!-- apr -->
<g id="node14" class="node fnode" data-i="13"
<title>apr</title>
<path fill="#e6f1fb" stroke="#185fa5" d="M926,-126C926,-126 845,-126 845,-126 839,-126 833,-120 833,-114 833,-114 833,-102 833,-102 833,-96 839,-90 845,-90 845,-90 926,-90 926,-90 932,-90 938,-96 938,-102 938,-102 938,-114 938,-114 938,-120 932,-126 926,-126"/>
<text text-anchor="middle" x="885.5" y="-111.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Vem da unidade</text>
<text text-anchor="middle" x="885.5" y="-99.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">(via JIRA)</text>
</g>
<!-- esp&#45;&gt;apr -->
<g id="edge17" class="edge">
<title>esp&#45;&gt;apr</title>
<path fill="none" stroke="#9aa09a" d="M656.05,-108C700.09,-108 773.65,-108 825.37,-108"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="825.52,-110.45 832.52,-108 825.52,-105.55 825.52,-110.45"/>
</g>
<!-- pedq -->
<g id="node7" class="node fnode" data-i="4"
<title>pedq</title>
<polygon fill="#faeeda" stroke="#ba7517" points="1054.65,-198 987.28,-180 1054.65,-162 1122.02,-180 1054.65,-198"/>
<text text-anchor="middle" x="1054.65" y="-177.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Pedido OK?</text>
</g>
<!-- ped&#45;&gt;pedq -->
<g id="edge6" class="edge">
<title>ped&#45;&gt;pedq</title>
<path fill="none" stroke="#9aa09a" d="M812.15,-180C857.86,-180 927.21,-180 979.89,-180"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="980.2,-182.45 987.2,-180 980.2,-177.55 980.2,-182.45"/>
</g>
<!-- jira -->
<g id="node8" class="node fnode" data-i="5"
<title>jira</title>
<path fill="#e6f1fb" stroke="#185fa5" d="M1429.3,-193C1429.3,-193 1271.3,-193 1271.3,-193 1265.3,-193 1259.3,-187 1259.3,-181 1259.3,-181 1259.3,-169 1259.3,-169 1259.3,-163 1265.3,-157 1271.3,-157 1271.3,-157 1429.3,-157 1429.3,-157 1435.3,-157 1441.3,-163 1441.3,-169 1441.3,-169 1441.3,-181 1441.3,-181 1441.3,-187 1435.3,-193 1429.3,-193"/>
<text text-anchor="middle" x="1350.3" y="-178.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Chamado no JIRA</text>
<text text-anchor="middle" x="1350.3" y="-166.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">(contratos, com nº do pedido)</text>
</g>
<!-- pedq&#45;&gt;jira -->
<g id="edge8" class="edge">
<title>pedq&#45;&gt;jira</title>
<path fill="none" stroke="#9aa09a" d="M1118.28,-178.93C1157.22,-178.27 1208.08,-177.4 1252.16,-176.65"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1252.22,-179.1 1259.18,-176.53 1252.14,-174.2 1252.22,-179.1"/>
<text text-anchor="middle" x="1206.3" y="-189.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">sem saldo/linha</text>
<text text-anchor="middle" x="1206.3" y="-179.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">ou divergente</text>
</g>
<!-- anl -->
<g id="node15" class="node fnode" data-i="14"
<title>anl</title>
<path fill="#faeeda" stroke="#ba7517" d="M1389.3,-125C1389.3,-125 1311.3,-125 1311.3,-125 1305.3,-125 1299.3,-119 1299.3,-113 1299.3,-113 1299.3,-101 1299.3,-101 1299.3,-95 1305.3,-89 1311.3,-89 1311.3,-89 1389.3,-89 1389.3,-89 1395.3,-89 1401.3,-95 1401.3,-101 1401.3,-101 1401.3,-113 1401.3,-113 1401.3,-119 1395.3,-125 1389.3,-125"/>
<text text-anchor="middle" x="1350.3" y="-104.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Análise da nota</text>
</g>
<!-- pedq&#45;&gt;anl -->
<g id="edge7" class="edge">
<title>pedq&#45;&gt;anl</title>
<path fill="none" stroke="#9aa09a" d="M1090.2,-171.41C1139.88,-159.06 1232.09,-136.14 1292.05,-121.23"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1293,-123.52 1299.2,-119.45 1291.81,-118.77 1293,-123.52"/>
<text text-anchor="middle" x="1206.3" y="-152.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">ok</text>
</g>
<!-- jur -->
<g id="node9" class="node fnode" data-i="6"
<title>jur</title>
<path fill="#e6f1fb" stroke="#185fa5" d="M1649.8,-202C1649.8,-202 1514.8,-202 1514.8,-202 1508.8,-202 1502.8,-196 1502.8,-190 1502.8,-190 1502.8,-178 1502.8,-178 1502.8,-172 1508.8,-166 1514.8,-166 1514.8,-166 1649.8,-166 1649.8,-166 1655.8,-166 1661.8,-172 1661.8,-178 1661.8,-178 1661.8,-190 1661.8,-190 1661.8,-196 1655.8,-202 1649.8,-202"/>
<text text-anchor="middle" x="1582.3" y="-181.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Contratos / Jurídico ajusta</text>
</g>
<!-- jira&#45;&gt;jur -->
<g id="edge9" class="edge">
<title>jira&#45;&gt;jur</title>
<path fill="none" stroke="#9aa09a" d="M1441.54,-178.53C1459.16,-179.22 1477.59,-179.94 1495.08,-180.63"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1495.42,-183.09 1502.51,-180.92 1495.61,-178.19 1495.42,-183.09"/>
</g>
<!-- ret -->
<g id="node10" class="node fnode" data-i="7"
<title>ret</title>
<path fill="#e6f1fb" stroke="#185fa5" d="M1857.3,-246C1857.3,-246 1766.3,-246 1766.3,-246 1760.3,-246 1754.3,-240 1754.3,-234 1754.3,-234 1754.3,-222 1754.3,-222 1754.3,-216 1760.3,-210 1766.3,-210 1766.3,-210 1857.3,-210 1857.3,-210 1863.3,-210 1869.3,-216 1869.3,-222 1869.3,-222 1869.3,-234 1869.3,-234 1869.3,-240 1863.3,-246 1857.3,-246"/>
<text text-anchor="middle" x="1811.8" y="-225.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Contratos retorna</text>
</g>
<!-- jur&#45;&gt;ret -->
<g id="edge10" class="edge">
<title>jur&#45;&gt;ret</title>
<path fill="none" stroke="#9aa09a" d="M1661.91,-199.2C1689.73,-204.59 1720.67,-210.57 1747.1,-215.68"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1746.73,-218.1 1754.07,-217.03 1747.66,-213.29 1746.73,-218.1"/>
</g>
<!-- ret&#45;&gt;ped -->
<g id="edge11" class="edge">
<title>ret&#45;&gt;ped</title>
<path fill="none" stroke="#9aa09a" stroke-dasharray="5,2" d="M1753.83,-233.84C1707.86,-238.05 1641.48,-243 1583.3,-243 1053.65,-243 1053.65,-243 1053.65,-243 970.45,-243 876.81,-217.87 819.1,-199.36"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="819.66,-196.96 812.25,-197.13 818.15,-201.62 819.66,-196.96"/>
<text text-anchor="middle" x="1350.3" y="-245.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">ajustado</text>
</g>
<!-- uniq -->
<g id="node12" class="node fnode" data-i="10"
<title>uniq</title>
<polygon fill="#faeeda" stroke="#ba7517" points="1054.65,-67 955.85,-49 1054.65,-31 1153.45,-49 1054.65,-67"/>
<text text-anchor="middle" x="1054.65" y="-46.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Unidade aprovou?</text>
</g>
<!-- uni&#45;&gt;uniq -->
<g id="edge13" class="edge">
<title>uni&#45;&gt;uniq</title>
<path fill="none" stroke="#9aa09a" d="M815.12,-47.35C852.96,-47.61 905.77,-47.98 952.08,-48.3"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="952.15,-50.75 959.16,-48.35 952.18,-45.85 952.15,-50.75"/>
</g>
<!-- forn -->
<g id="node13" class="node fnode" data-i="11"
<title>forn</title>
<path fill="#fcebeb" stroke="#e24b4a" d="M1408.3,-36C1408.3,-36 1292.3,-36 1292.3,-36 1286.3,-36 1280.3,-30 1280.3,-24 1280.3,-24 1280.3,-12 1280.3,-12 1280.3,-6 1286.3,0 1292.3,0 1292.3,0 1408.3,0 1408.3,0 1414.3,0 1420.3,-6 1420.3,-12 1420.3,-12 1420.3,-24 1420.3,-24 1420.3,-30 1414.3,-36 1408.3,-36"/>
<text text-anchor="middle" x="1350.3" y="-15.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Retorna ao fornecedor</text>
</g>
<!-- uniq&#45;&gt;forn -->
<g id="edge15" class="edge">
<title>uniq&#45;&gt;forn</title>
<path fill="none" stroke="#9aa09a" d="M1117.92,-42.43C1163.26,-37.64 1224.9,-31.13 1273.16,-26.04"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1273.47,-28.47 1280.18,-25.3 1272.96,-23.6 1273.47,-28.47"/>
<text text-anchor="middle" x="1206.3" y="-39.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">não</text>
</g>
<!-- uniq&#45;&gt;anl -->
<g id="edge14" class="edge">
<title>uniq&#45;&gt;anl</title>
<path fill="none" stroke="#9aa09a" d="M1111.55,-56.64C1148.53,-62.04 1198,-69.91 1241.3,-79 1257.97,-82.5 1275.93,-86.9 1292.33,-91.17"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1291.86,-93.58 1299.25,-92.99 1293.1,-88.84 1291.86,-93.58"/>
<text text-anchor="middle" x="1206.3" y="-81.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">aprovou</text>
</g>
<!-- forn&#45;&gt;uni -->
<g id="edge16" class="edge">
<title>forn&#45;&gt;uni</title>
<path fill="none" stroke="#9aa09a" stroke-dasharray="5,2" d="M1280.19,-11.02C1201.49,-4.28 1069.15,3.38 956,-8 910.6,-12.56 860.06,-23.05 822.23,-32.01"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="821.56,-29.65 815.32,-33.66 822.7,-34.41 821.56,-29.65"/>
<text text-anchor="middle" x="1054.65" y="-10.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">reenvia</text>
</g>
<!-- apr&#45;&gt;anl -->
<g id="edge18" class="edge">
<title>apr&#45;&gt;anl</title>
<path fill="none" stroke="#9aa09a" d="M938.24,-107.89C1025.51,-107.7 1201.3,-107.32 1292.11,-107.12"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1292.3,-109.57 1299.29,-107.11 1292.29,-104.67 1292.3,-109.57"/>
</g>
<!-- tipoq -->
<g id="node16" class="node fnode" data-i="15"
<title>tipoq</title>
<polygon fill="#faeeda" stroke="#ba7517" points="1582.3,-139 1478.3,-107 1582.3,-75 1686.3,-107 1582.3,-139"/>
<text text-anchor="middle" x="1582.3" y="-110.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Nota de serviço</text>
<text text-anchor="middle" x="1582.3" y="-98.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">ou locação?</text>
</g>
<!-- anl&#45;&gt;tipoq -->
<g id="edge19" class="edge">
<title>anl&#45;&gt;tipoq</title>
<path fill="none" stroke="#9aa09a" d="M1401.49,-107C1421.94,-107 1446.45,-107 1470.7,-107"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1470.87,-109.45 1477.87,-107 1470.87,-104.55 1470.87,-109.45"/>
</g>
<!-- car -->
<g id="node17" class="node fnode" data-i="16"
<title>car</title>
<path fill="#eaf3de" stroke="#639922" d="M1830.8,-171C1830.8,-171 1792.8,-171 1792.8,-171 1786.8,-171 1780.8,-165 1780.8,-159 1780.8,-159 1780.8,-147 1780.8,-147 1780.8,-141 1786.8,-135 1792.8,-135 1792.8,-135 1830.8,-135 1830.8,-135 1836.8,-135 1842.8,-141 1842.8,-147 1842.8,-147 1842.8,-159 1842.8,-159 1842.8,-165 1836.8,-171 1830.8,-171"/>
<text text-anchor="middle" x="1811.8" y="-150.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Carimbo</text>
</g>
<!-- tipoq&#45;&gt;car -->
<g id="edge20" class="edge">
<title>tipoq&#45;&gt;car</title>
<path fill="none" stroke="#9aa09a" d="M1645.46,-119.57C1686.49,-127.86 1738.87,-138.46 1773.55,-145.47"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1773.33,-147.92 1780.68,-146.91 1774.3,-143.12 1773.33,-147.92"/>
<text text-anchor="middle" x="1720.3" y="-138.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">serviço</text>
</g>
<!-- lan -->
<g id="node18" class="node fnode" data-i="17"
<title>lan</title>
<path fill="#f1efe8" stroke="#8a8880" d="M2021.3,-133C2021.3,-133 1918.3,-133 1918.3,-133 1912.3,-133 1906.3,-127 1906.3,-121 1906.3,-121 1906.3,-109 1906.3,-109 1906.3,-103 1912.3,-97 1918.3,-97 1918.3,-97 2021.3,-97 2021.3,-97 2027.3,-97 2033.3,-103 2033.3,-109 2033.3,-109 2033.3,-121 2033.3,-121 2033.3,-127 2027.3,-133 2021.3,-133"/>
<text text-anchor="middle" x="1969.8" y="-112.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Lançamento no SAP</text>
</g>
<!-- tipoq&#45;&gt;lan -->
<g id="edge21" class="edge">
<title>tipoq&#45;&gt;lan</title>
<path fill="none" stroke="#9aa09a" d="M1681.91,-108.42C1737.04,-109.29 1806.99,-110.52 1869.3,-112 1878.89,-112.23 1889,-112.5 1898.96,-112.78"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1899.1,-115.24 1906.17,-112.99 1899.24,-110.34 1899.1,-115.24"/>
<text text-anchor="middle" x="1811.8" y="-114.8" font-family="Helvetica,sans-Serif" font-size="9.00" fill="#6c736d">locação (sem carimbo)</text>
</g>
<!-- car&#45;&gt;lan -->
<g id="edge22" class="edge">
<title>car&#45;&gt;lan</title>
<path fill="none" stroke="#9aa09a" d="M1842.88,-145.67C1858.95,-141.76 1879.47,-136.76 1899.25,-131.94"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="1899.98,-134.28 1906.2,-130.25 1898.82,-129.52 1899.98,-134.28"/>
</g>
<!-- arq -->
<g id="node19" class="node fnode" data-i="18"
<title>arq</title>
<path fill="#faeeda" stroke="#ba7517" d="M2217.3,-133C2217.3,-133 2082.3,-133 2082.3,-133 2076.3,-133 2070.3,-127 2070.3,-121 2070.3,-121 2070.3,-109 2070.3,-109 2070.3,-103 2076.3,-97 2082.3,-97 2082.3,-97 2217.3,-97 2217.3,-97 2223.3,-97 2229.3,-103 2229.3,-109 2229.3,-109 2229.3,-121 2229.3,-121 2229.3,-127 2223.3,-133 2217.3,-133"/>
<text text-anchor="middle" x="2149.8" y="-118.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Armazenamento na pasta</text>
<text text-anchor="middle" x="2149.8" y="-106.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">padrão do nome</text>
</g>
<!-- lan&#45;&gt;arq -->
<g id="edge23" class="edge">
<title>lan&#45;&gt;arq</title>
<path fill="none" stroke="#9aa09a" d="M2033.3,-115C2042.9,-115 2052.94,-115 2062.93,-115"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="2063.19,-117.45 2070.19,-115 2063.19,-112.55 2063.19,-117.45"/>
</g>
<!-- pla -->
<g id="node20" class="node fnode" data-i="19"
<title>pla</title>
<path fill="#e1f5ee" stroke="#0f6e56" d="M2390.3,-133C2390.3,-133 2278.3,-133 2278.3,-133 2272.3,-133 2266.3,-127 2266.3,-121 2266.3,-121 2266.3,-109 2266.3,-109 2266.3,-103 2272.3,-97 2278.3,-97 2278.3,-97 2390.3,-97 2390.3,-97 2396.3,-97 2402.3,-103 2402.3,-109 2402.3,-109 2402.3,-121 2402.3,-121 2402.3,-127 2396.3,-133 2390.3,-133"/>
<text text-anchor="middle" x="2334.3" y="-118.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">Planilha de Contratos</text>
<text text-anchor="middle" x="2334.3" y="-106.2" font-family="Helvetica,sans-Serif" font-size="11.00" fill="#1e2621">registra pela emissão</text>
</g>
<!-- arq&#45;&gt;pla -->
<g id="edge24" class="edge">
<title>arq&#45;&gt;pla</title>
<path fill="none" stroke="#9aa09a" d="M2229.52,-115C2239.38,-115 2249.43,-115 2259.22,-115"/>
<polygon fill="#9aa09a" stroke="#9aa09a" points="2259.29,-117.45 2266.29,-115 2259.29,-112.55 2259.29,-117.45"/>
</g>
</g>
</svg>`;

/* ---- FLUXO: Recebimento / Fontes de entrada ---- */
const FLOW_RECEB=
  '<svg width="100%" viewBox="0 0 680 500" role="img"><title>Fluxo de recebimento e fontes de entrada</title>'+ARROW+
  box(0,240,24,200,52,GY,'Nota recebida','')+
  line(340,76,135,118)+line(340,76,340,118)+line(340,76,545,118)+
  box(1,40,118,190,56,BL,'E-mail de fornecedores','notas e faturas')+
  box(2,245,118,190,56,BL,'Portais e prefeituras','busca nos portais')+
  box(3,450,118,190,56,BL,'Chamado no JIRA','projeto RDNF')+
  line(135,174,300,212)+line(340,174,340,212)+line(545,174,380,212)+
  box(4,240,212,200,52,GY,'Nota localizada','')+
  line(340,264,340,300)+
  box(5,255,300,170,44,TL,'Segue para Análise','')+
  '<line x1="20" y1="374" x2="660" y2="374" stroke="#E7E5DE" stroke-width="1"/>'+
  '<text class="zlabel" x="20" y="396">PORTAIS PARA LOCALIZAR — CLIQUE PARA ABRIR</text>'+
  pbox(20,410,155,52,GR,'Nota do Milhão','São Paulo',URL_SP)+
  pbox(185,410,155,52,GR,'Portal Nacional','2ª via / consulta',URL_NAC)+
  pbox(350,410,155,52,GR,'Arquivei (QUIVE)','',URL_ARQ)+
  pbox(515,410,145,52,GR,'E-mail do Fiscal','recebimento de NF','mailto:fiscal.preventsenior@preventsenior.com.br')+
  '</svg>';

/* ---- FLUXO: Classificação da nota ---- */
const FLOW_CLASS=
  '<svg width="100%" viewBox="0 0 680 520" role="img"><title>Fluxo de classificação da nota</title>'+ARROW+
  box(0,240,24,200,52,AM,'Qual o tipo da nota?','')+
  line(340,76,127,118)+line(340,76,340,118)+line(340,76,552,118)+
  box(1,30,118,195,60,BL,'Contrato fixo','valor fixo por período')+
  box(2,242,118,196,60,BL,'Contrato variável','valor unitário / saldo')+
  box(3,455,118,195,60,BL,'Esporádica','fora de contrato')+
  line(127,178,127,222)+line(340,178,340,222)+line(552,178,552,222)+
  pbox(30,222,195,58,GR,'Sem aprovação prévia','se bate com o contrato')+
  pbox(242,222,196,58,AM,'Aprovação do gerente','confere qtd e valor')+
  pbox(455,222,195,58,BL,'Vem da unidade','pelo JIRA, autorizada')+
  line(127,280,300,326)+line(340,280,340,326)+line(552,280,380,326)+
  box(4,240,326,200,48,TL,'Segue para Análise','')+
  '<line x1="20" y1="404" x2="660" y2="404" stroke="#E7E5DE" stroke-width="1"/>'+
  '<text class="zlabel" x="20" y="426">TIPOS DE DOCUMENTO</text>'+
  box(4,20,440,150,52,GY,'NF de serviço','precisa de carimbo')+
  pbox(180,440,120,52,GY,'Fatura','')+
  pbox(310,440,160,52,GY,'Nota de contrato','')+
  box(5,480,440,180,52,GY,'Locação','sem carimbo')+
  '</svg>';

/* ---- FLUXO: Carimbo ---- */
const FLOW_CARIMBO=
  '<svg width="100%" viewBox="0 0 680 668" role="img"><title>Fluxo do carimbo da nota</title>'+ARROW+
  box(0,210,24,260,52,GY,'Análise concluída','')+
  line(340,76,340,112)+
  box(1,210,112,260,56,AM,'Preencher o carimbo','identificação, dados, retenções')+
  line(340,168,340,204)+
  box(2,210,204,260,56,AM,'Código de imposto (IVA)','define a retenção no SAP')+
  line(340,260,340,296)+
  box(3,210,296,260,56,AM,'Conferir carimbo','bate com o valor líquido?')+
  pbox(500,296,150,56,RD,'Revisar','ajustar e conferir')+
  '<line x1="470" y1="324" x2="500" y2="324" class="arr" marker-end="url(#arrow)"/>'+
  '<text class="ts" x="485" y="315" fill="#6C736D">não</text>'+
  '<text class="ts" x="352" y="374" fill="#6C736D">sim</text>'+
  line(340,352,340,388)+
  box(4,210,388,260,52,GR,'Gerar carimbo','colar na nota')+
  line(340,440,340,468)+
  box(5,210,468,260,48,TL,'Segue para lançamento','')+
  '<line x1="20" y1="544" x2="660" y2="544" stroke="#E7E5DE" stroke-width="1"/>'+
  '<text class="zlabel" x="20" y="566">O QUE O CARIMBO VERIFICA</text>'+
  pbox(20,580,155,58,GY,'Identificação','Prevent · fornecedor')+
  pbox(185,580,150,58,GY,'Dados da nota','emissão · nº · valor')+
  pbox(345,580,150,58,GY,'Retenções','ISS · IR · INSS')+
  pbox(505,580,155,58,GY,'Código IVA','Lei 116')+
  '</svg>';

/* ---- FLUXO: Análise de impostos ---- */
const FLOW_ANALISE=
  '<svg width="100%" viewBox="0 0 680 452" role="img"><title>Fluxo da análise de impostos e discriminação</title>'+ARROW+
  box(0,40,40,195,56,BL,'Prestador','CNPJ ativo e regime')+
  box(1,245,40,195,56,BL,'Tomador','unidade e local corretos')+
  box(2,450,40,190,56,BL,'Serviço','código × descrição')+
  line(137,96,250,148)+line(342,96,342,148)+line(545,96,432,148)+
  box(3,170,148,340,56,AM,'Impostos e retenção','nem todo imposto destacado é retido')+
  line(340,204,340,244)+
  box(4,190,244,300,56,AM,'Discriminação e impostos ok?','carimbo · IVAS · Lei 116/2003')+
  line(340,300,137,346)+line(340,300,340,346)+line(340,300,545,346)+
  box(5,40,346,195,66,GR,'Tudo certo','segue para o carimbo')+
  box(6,245,346,195,66,RD,'Valor / cadastro','prestador reemite a nota')+
  box(7,450,346,190,66,AM,'Descrição','carta de correção')+
  '</svg>';

/* ---- FLUXO: Abertura de chamado (JIRA) ---- */
const FLOW_JIRA=
  '<svg width="100%" viewBox="0 0 680 608" role="img"><title>Fluxo de abertura de chamado no JIRA</title>'+ARROW+
  box(0,210,24,260,52,AM,'Por que abrir o chamado?','')+
  line(340,76,165,118)+line(340,76,515,118)+
  box(1,40,118,250,60,BL,'Aprovar nota','contrato variável')+
  box(2,390,118,250,60,BL,'Chamado para contratos','sempre com nº do pedido')+
  line(165,178,165,214)+
  pbox(40,214,250,52,TL,'Unidade hospitalar aprova','')+
  line(515,178,515,214)+
  box(3,390,214,250,56,AM,'Informar nº do pedido','+ dados e motivo')+
  line(515,270,515,308)+
  pbox(390,308,250,52,BL,'Equipe de contratos resolve','')+
  line(165,266,300,402)+line(515,360,380,402)+
  box(4,210,402,260,48,TL,'Segue o fluxo','')+
  '<line x1=\'20\' y1=\'490\' x2=\'660\' y2=\'490\' stroke=\'#E7E5DE\' stroke-width=\'1\'/>'+
  '<text class=\'zlabel\' x=\'20\' y=\'512\'>MOTIVOS DO CHAMADO DE CONTRATO</text>'+
  pbox(20,526,155,52,GY,'Pedido sem saldo','')+
  pbox(185,526,150,52,GY,'Pedido sem linha','')+
  pbox(345,526,150,52,GY,'Valor divergente','')+
  pbox(505,526,155,52,GY,'Sem contrato','verificar')+
  '</svg>';

/* ---- FLUXO: Armazenamento da nota ---- */
const FLOW_ARQ=
  '<svg width="100%" viewBox="0 0 680 470" role="img"><title>Fluxo de armazenamento da nota fiscal</title>'+ARROW+
  box(0,210,24,260,52,GY,'Nota lançada + chamado','SAP e JIRA concluídos')+
  line(340,76,340,112)+
  box(1,210,112,260,56,AM,'Salvar na pasta','pasta respectiva no sistema')+
  line(340,168,340,204)+
  box(2,210,204,260,56,AM,'Nomear no padrão','4 dígitos CNPJ + fornecedor + NF nº')+
  line(340,260,340,296)+
  box(3,210,296,260,56,BL,'Contas a Pagar pega','financeiro da unidade')+
  line(340,352,340,388)+
  box(4,210,388,260,48,TL,'Segue para a Planilha','')+
  '</svg>';

/* ---- FLUXO: Planilha de Contratos ---- */
const FLOW_PLAN=
  '<svg width="100%" viewBox="0 0 680 560" role="img"><title>Fluxo de fechamento na Planilha de Contratos</title>'+ARROW+
  box(0,210,24,260,52,GY,'Nota lançada no SAP','')+
  line(340,76,340,112)+
  box(1,210,112,260,56,AM,'Registrar na planilha','na coluna do mês da emissão')+
  line(340,168,340,204)+
  box(2,210,204,260,56,AM,'Situação da nota?','')+
  line(340,260,120,300)+line(340,260,340,300)+line(340,260,560,300)+
  pbox(20,300,190,64,GR,'Emitida e OK','nº da nota no mês')+
  pbox(230,300,220,64,RD,'Divergência / Contratos','nº vermelho + link do chamado')+
  pbox(470,300,190,64,AM,'Na unidade','em branco + comentário')+
  line(115,364,300,408)+line(340,364,340,408)+line(565,364,380,408)+
  box(3,210,408,260,52,BL,'Sem emissão / outros','confere portais · observação')+
  line(340,460,340,496)+
  box(4,210,496,260,48,TL,'Mês fechado','planilha inteira preenchida')+
  '</svg>';

/* ---- FLUXO: Lançamento no SAP ---- */
const FLOW_SAP=
  '<svg width="100%" viewBox="0 0 680 520" role="img"><title>Fluxo do lançamento no SAP</title>'+ARROW+
  box(0,190,40,300,56,GY,'Tipo de documento','NF, MEI, telecom ou fatura')+
  line(340,96,340,136)+
  box(1,190,136,300,56,GY,'Tipo da nota','S6 / S5 / T1')+
  line(340,192,340,232)+
  box(2,190,232,300,56,GY,'Vencimento','clicar em PAGAMENTO')+
  line(340,288,340,328)+
  box(3,190,328,300,56,AM,'Simular','verificação final')+
  line(340,384,340,424)+
  box(4,190,424,300,56,GR,'Gravar','')+
  '</svg>';

var PROC={
  geral:{ sec:"Visão geral", name:"Fluxo fiscal completo", status:"pronto",
    lead:"O mapa mental de todo o processo fiscal, da chegada da nota ao fechamento do mês. Usar como visão geral na apresentação; cada etapa tem seu próprio processo detalhado no menu ao lado.",
    steps:[{t:"Recebimento",d:"A nota chega por e-mail, portais ou JIRA e é localizada."},{t:"Classificação",d:"Define o tipo do contrato: fixo, variável ou esporádica. Cada um segue um caminho de aprovação."},{t:"Contrato fixo",d:"Valores fixos por período. Segue verificando o pedido de compra."},{t:"Verifica pedido",d:"Confere o pedido do contrato: saldo, linha e valor batendo com a nota."},{t:"Pedido OK?",d:"Se o pedido está certo, segue para a análise. Se há problema, abre chamado para contratos."},{t:"Chamado no JIRA (contratos)",d:"Chamado para contratos informando sempre o número do pedido e o motivo: sem saldo, sem linha, valor divergente ou sem contrato."},{t:"Contratos / Jurídico ajusta",d:"A equipe de contratos ajusta o pedido; o jurídico entra em novos contratos ou aditivos."},{t:"Contratos retorna",d:"Com o pedido ajustado, contratos devolve ao fiscal, que reconfere o pedido."},{t:"Contrato variável",d:"Valores unitários. A nota é enviada à unidade para aprovação."},{t:"Envia à unidade",d:"A nota vai à unidade hospitalar responsável para aprovação."},{t:"Unidade aprovou?",d:"Se aprovar, segue para a análise. Se nao, retorna ao fornecedor."},{t:"Retorna ao fornecedor",d:"Aciona o fornecedor para entender e corrigir; depois reenvia à unidade."},{t:"Esporádica",d:"Serviço fora de contrato. A unidade envia a nota esporádica ao Fiscal pelo JIRA, já autorizada (o Fiscal não abre chamado de aprovação)."},{t:"Vem da unidade (via JIRA)",d:"A unidade abre o chamado no JIRA e envia a nota esporádica ao Fiscal; ela já chega autorizada pela unidade."},{t:"Análise da nota",d:"Confere prestador, tomador e serviço, e a retenção (nem todo imposto destacado é retido; via IVAS e Lei 116)."},{t:"Nota de serviço ou locação?",d:"Serviço precisa de carimbo; locação (bens ou imóveis) nao precisa e vai direto ao lançamento."},{t:"Carimbo",d:"Consolida a análise e sela a nota (código IVA, conferir e gerar)."},{t:"Lançamento no SAP",d:"Lança a nota no SAP: tipo do documento, S6/S5/T1, vencimento, simular e gravar."},{t:"Armazenamento na pasta",d:"Salva a nota na pasta do sistema (padrão: 4 dígitos do CNPJ do tomador + fornecedor + NF nº) para o Contas a Pagar pegar."},{t:"Planilha de Contratos",d:"Fecha o ciclo: registra a nota na coluna do mês da emissão e controla o vencimento."}], flow:FLOW_GERAL },
  recebimento:{ sec:"Fiscal", name:"Recebimento e fontes de entrada", status:"pronto",
    lead:"O primeiro passo do fluxo: por onde a nota chega e onde localizá-la antes de começar a análise.",
    steps:[
      {t:"Nota recebida",d:"As notas e faturas entram a partir de serviços realizados nos centros de custo da Prevent Senior (hospitais, núcleos e diagnósticos)."},
      {t:"E-mail de fornecedores e do Fiscal",d:"Notas e faturas enviadas pelos fornecedores e recebidas no e-mail do Fiscal (fiscal.preventsenior@preventsenior.com.br) — principal canal de recebimento das notas.",link:{u:"mailto:fiscal.preventsenior@preventsenior.com.br",label:"Escrever para o Fiscal"}},
      {t:"Portais e prefeituras",d:"Busca ativa das notas nos portais das prefeituras e sistemas fiscais — Nota do Milhão (SP) e Portal Nacional de NFS-e (2ª via/consulta). Os links ficam no fluxograma (botão Apresentar).",link:{u:URL_SP,label:"Abrir Nota do Milhão (SP)"}},
      {t:"Chamado no JIRA",d:"Notas encaminhadas via chamado no projeto RDNF (Recebimento de Notas Fiscais)."},
      {t:"Nota localizada",d:"Com a nota em mãos por qualquer um dos canais, segue para a etapa de Análise de nota fiscal."}
    ], flow:FLOW_RECEB },
  classificacao:{ sec:"Fiscal", name:"Classificação da nota", status:"pronto",
    lead:"Antes de aprovar e lançar, identifique o tipo da nota — é isso que define se precisa de aprovação e como o pedido de compra é montado.",
    steps:[
      {t:"Qual o tipo da nota?",d:"O ponto de partida: a nota pode ser de contrato (fixo ou variável) ou esporádica. O tipo determina o caminho de aprovação."},
      {t:"Contrato fixo",d:"Contrato negociado entre a área solicitante, o prestador e o Jurídico, com valores fixos mensais, semestrais ou anuais. O pedido de compra tem linhas por período até o próximo reajuste. Não precisa de aprovação quando o valor da nota é compatível com o contrato."},
      {t:"Contrato variável",d:"Contrato negociado com valores unitários. O pedido de compra tem uma linha do ano vigente, com saldo calculado pela média prevista de uso (ou pelo valor do contrato). Precisa de aprovação do gerente administrativo do centro de custo, que confere quantidade e valor cobrado."},
      {t:"Esporádica",d:"Serviço solicitado pontualmente para ajuste ou reparo, fora de contrato. A unidade envia a nota esporádica ao Fiscal pelo JIRA, já autorizada — o Fiscal não abre chamado de aprovação para ela. O orçamento é feito pelo setor de compras."},
      {t:"NF de serviço",d:"Nota fiscal de serviço — precisa de carimbo (classificação dos impostos). Exemplo abaixo (NFS-e).",img:IMG_SERV},{t:"Nota de locação",d:"É parecida com uma nota fiscal, mas se refere a uma locação de bens ou imóveis. Diferença prática para o Fiscal: a NF de serviço precisa de carimbo; a locação NÃO precisa de carimbo. Costuma vir como fatura de locação, como no exemplo abaixo.",img:IMG_LOC}
    ], flow:FLOW_CLASS },
  analise:{ sec:"Fiscal", name:"Análise de nota fiscal", status:"pronto",
    lead:"Como analisar a nota antes de lançar: o que conferir no prestador, no tomador e no serviço, e como saber o que é retido.",
    steps:[
      {t:"Prestador",d:"Conferir CNPJ ativo na Receita, razão social batendo e o regime tributário. Optante do Simples Nacional muda a retenção."},
      {t:"Tomador",d:"Confirmar que é a unidade correta — o faturamento deve ser para o local onde o serviço foi executado."},
      {t:"Serviço",d:"Verificar se o código de serviço bate com a descrição, além do município da prestação e do valor total."},
      {t:"Impostos e retenção",d:"Nem todo imposto destacado na nota é retido. Quem define é o código de serviço e o regime, aplicados via carimbo, tabela dos IVAS e Lei 116/2003."},
      {t:"Discriminação e impostos ok?",d:"Ponto de decisão: confirmar se a discriminação e os impostos estão corretos antes de seguir."},
      {t:"Tudo certo",d:"Sem divergências: segue para o carimbo e o arquivamento."},
      {t:"Valor / cadastro",d:"Erro de valor ou de cadastro não se resolve por carta: o prestador precisa reemitir a nota."},
      {t:"Descrição",d:"Erro apenas na descrição ou em outras informações: resolve por carta de correção."}
    ], flow:FLOW_ANALISE },
  carimbo:{ sec:"Fiscal", name:"Carimbo da nota", status:"pronto",
    lead:"A checagem final que consolida a análise e sela a nota antes do lançamento no SAP.",
    steps:[
      {t:"Análise concluída",d:"Antes de carimbar, fazer toda a análise da nota (prestador, tomador, serviço, impostos e retenção). Veja o processo Análise de nota fiscal."},
      {t:"Preencher o carimbo",d:"No carimbo constam: empresa Prevent (BR11 = CNPJ antigo, BR14 = CNPJ atual); CNPJ do fornecedor, se é optante do Simples e se a situação está ativa; data de emissão, número da nota e valor bruto; e as retenções: ISS retido na fonte, IR retido na fonte, INSS e a alíquota aplicável.",img:IMG_CARIMBO},
      {t:"Código de imposto (IVA)",d:"O código de controle / código de imposto (IVA) define a retenção devida no lançamento do SAP, conforme a Lei 116. Por exemplo, um código sem retenção resulta em nenhuma retenção no SAP. As regras de cada código são vistas no passo do SAP."},
      {t:"Conferir carimbo",d:"Clicar em Conferir carimbo: confirmar que ele bateu com o valor líquido da nota e está de acordo com toda a análise."},
      {t:"Gerar carimbo",d:"Estando tudo certo, clicar em Gerar carimbo e colar o carimbo na nota fiscal."},
      {t:"Segue para o lançamento",d:"Com a nota carimbada, siga para o Lançamento no SAP."}
    ], flow:FLOW_CARIMBO },
  lancamento:{ sec:"Fiscal", name:"Lançamento no SAP", status:"pronto",
    lead:"Passo a passo do lançamento da nota fiscal de serviço no SAP, após a nota estar analisada, carimbada e arquivada. Telecomunicação e locação (lançamentos diferentes) entram no futuro.",
    steps:[
      {t:"Tipo de documento",d:"Escolher conforme a nota: NF de serviço, MEI, telecomunicação ou fatura."},
      {t:"Tipo da nota",d:"Informar S6 / S5 / T1 conforme o caso."},
      {t:"Vencimento",d:"Clicar em PAGAMENTO para definir o vencimento."},
      {t:"Simular",d:"Clicar em SIMULAR para a verificação final antes de gravar."},
      {t:"Gravar",d:"Confirmar o lançamento."}
    ], flow:FLOW_SAP, gallery:SAP_TUT },
  jira:{ sec:"Fiscal", name:"Abertura de chamados (JIRA)", status:"pronto",
    lead:"O JIRA é usado em dois tipos: aprovação de nota de contrato variável, e chamado para contratos (problemas no pedido). Importante: a nota esporádica NÃO é aprovada aqui — é a unidade que envia a nota esporádica ao Fiscal pelo JIRA, já autorizada. No chamado de contratos, informar o número do pedido é obrigatório.",
    steps:[
      {t:"Quando abrir um chamado",d:"O JIRA é usado em dois tipos de situação: (1) aprovação de nota de contrato variável e (2) chamado para contratos, quando há problema no pedido."},
      {t:"Caso 1 — Aprovação da nota (contrato variável)",d:"A nota de contrato variável é enviada à unidade hospitalar para aprovação antes do lançamento. Usar o botão para abrir o formulário de Recebimento de NF.",link:{u:URL_JIRA,label:"Abrir chamado no JIRA"},img:IMG_JIRA},
      {t:"Caso 2 — Chamado para contratos",d:"Quando o problema está no pedido de um contrato. Na página inicial do JIRA, clicar em Criar e preencher as informações do fornecedor."},
      {t:"Número do pedido + motivo",d:"SEMPRE informar o número do pedido — é a informação mais importante e não pode faltar. Em seguida, indicar o motivo. Motivos possíveis: pedido sem saldo; pedido sem linha; valor divergente da nota fiscal (quando NF de contrato); ou nota sem contrato localizado — nesse caso o chamado serve para identificar se o fornecedor ainda está em processo de assinatura, se terá contrato ou se houve alguma alteração."},
      {t:"Acompanhamento",d:"A equipe de contratos analisa e resolve (ajusta saldo ou linha, corrige a divergência ou informa sobre o contrato). Resolvido, segue o fluxo normal de análise, carimbo e lançamento."},
      {t:"Nota esporádica (observação)",d:"A nota esporádica NÃO é aprovada no JIRA. É a unidade que envia a nota esporádica ao Fiscal pelo JIRA — o Fiscal não abre chamado de aprovação para ela. Ela chega já autorizada pela unidade."}
    ], flow:FLOW_JIRA },
  armazenamento:{ sec:"Fiscal", name:"Armazenamento da nota", status:"pronto",
    lead:"Depois do carimbo, do lançamento no SAP e da abertura do chamado, a nota é salva na pasta do sistema. É de lá que o financeiro responsável pela unidade, no Contas a Pagar, pega a nota para pagar.",
    steps:[
      {t:"Quando salvar",d:"Com a nota já carimbada, lançada no SAP e com o chamado aberto, salvar na pasta respectiva do sistema."},
      {t:"Caminho da pasta",d:"A estrutura de pastas segue: Notas Fiscais (I:) › NF BR11/BR14 › centro de custo (unidade/hospital) › ano › mês › Financeiro. Exemplo do caminho abaixo.",img:IMG_PASTA},
      {t:"Padrão do nome",d:"Salvar a nota com: os 4 últimos dígitos do CNPJ do tomador (Prevent Senior) + nome do fornecedor + NF + número da NF. Exemplo: 0046 - CENTRAL VIP NF 1063."},
      {t:"Contas a Pagar pega",d:"O financeiro responsável pela unidade, no time de Contas a Pagar, pega a nota nessa pasta para efetuar o pagamento."}
    ], flow:FLOW_ARQ },
  fechamento:{ sec:"Fiscal", name:"Planilha de Contratos", status:"pronto",
    lead:"O encerramento do ciclo: com a nota lançada, ela é registrada na Planilha de Contratos para controle. O mês só fecha com a planilha inteira preenchida.",
    steps:[
      {t:"O que é a planilha",d:"Planilha de controle dos contratos. Colunas: pedido, BR11/BR14, CNPJ do fornecedor, nome do fornecedor, descrição, valor mensal, fixo ou variável, final do CNPJ e o fiscal responsável pela unidade. Além disso, uma coluna para cada mês (janeiro a dezembro), onde entra o número da nota fiscal."},
      {t:"Registrar pela emissão",d:"Ao lançar a nota, coloque o número dela na coluna do mês em que a nota foi EMITIDA. Emitida em julho vai na coluna de julho; emitida em junho, na de junho. Sempre pela data de emissão."},
      {t:"Fechar o mês",d:"Fechar o mês significa a planilha inteira preenchida: todas as linhas (todos os fornecedores) com a nota daquele mês ou com a observação do caso."},
      {t:"Casos especiais",d:"Divergência ou parada com Contratos: número da nota em VERMELHO e o link do chamado num comentário da célula. Na unidade para aprovação: número em branco e apenas o comentário. Fornecedor não emitiu: conferir em todos os portais e no e-mail, verificar e pergunte; se realmente não veio, escrever sem emissão. Outros casos: registrar a observação, como contrato inativo."},
      {t:"Controle de vencimento",d:"A planilha compara emissão e vencimento e mostra quantos dias faltam para a nota vencer, com cores: verde quando falta bastante tempo e vermelho conforme se aproxima do vencimento (30 dias, 1 dia). Serve de semáforo para priorizar o que está vencendo."},
      {t:"Responsáveis",d:"Cada fiscal inclui o número das notas que lança nas colunas dos meses. As alterações mais pesadas — incluir ou excluir linhas e atualizar os pedidos — são feitas somente por Tânia Gouveia, responsável pela planilha."}
    ], flow:FLOW_PLAN }
};
var ORDER_FLUXO=["geral", "recebimento", "classificacao", "analise", "carimbo", "lancamento", "jira", "armazenamento", "fechamento"];