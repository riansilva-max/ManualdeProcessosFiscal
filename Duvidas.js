var FAQ={
  faq_codverif:{ sec:"Dúvidas recorrentes", cat:"Lançamento", name:"Código de verificação (SAP)", faq:{
    problema:"O campo código de verificação no SAP estava sendo preenchido de formas diferentes por cada pessoa.",
    processo:"Preencher o campo código de verificação com os últimos números da chave de acesso. Depois, na aba Informação adicional, no campo Campos de utilização livre p/ info adicional, informar o número COMPLETO da chave de acesso (identificação: CHAVE DE ACESSO).",
    solucao:"Padrão único para toda a equipe. Exemplo: NFS-e 126238, código de verificação com os últimos números da chave, e a chave completa no campo de informação adicional."
  }, img:IMG_CODVERIF },
  faq_ref:{ sec:"Dúvidas recorrentes", cat:"Lançamento", name:"Referência já lançada (ano anterior)", faq:{
    problema:"Ao lançar uma nota cujo número já foi usado num lançamento contábil do ano anterior (mesmo número, outro ano ou fornecedor), o SAP não deixa repetir a referência.",
    processo:"Acrescente o ano ao número da nota, com traço. Exemplo: a NF 1063 vira 1063-26.",
    solucao:"Com o -26 a referência fica única e o lançamento é aceito normalmente."
  } },
  faq_comp:{ sec:"Dúvidas recorrentes", cat:"Lançamento", name:"Fechamento da compensação", faq:{
    problema:"Notas com impostos precisam entrar na competência certa. Se lançadas depois do fechamento da compensação, a contabilidade não retém os impostos corretamente (ainda mais crítico com a nova regra tributária).",
    processo:"Lançar todas as notas com impostos ANTES do fechamento da compensação. Exemplo: se a compensação fecha na terça, dia 04/08, lançar todas as notas de julho até o dia 04 com a data 31/07.",
    solucao:"Depois que a compensação fecha (após o dia 04), o lançamento segue com a data normal do sistema. Sempre priorizar lançar dentro da compensação."
  } },
  faq_encontro:{ sec:"Dúvidas recorrentes", cat:"Lançamento", name:"Encontro de contas / estacionamento", faq:{
    problema:"Notas de encontro de contas não podem ser pagas nem desbloqueadas indevidamente, pois atrapalham a conciliação da tesouraria.",
    processo:"Manter a nota BLOQUEADA. Na planilha de controle fiscal, a observação do serviço indica quando é encontro de contas. No SAP, deixar a observação, por exemplo: ENCONTRO DE CONTAS, NÃO DESBLOQUEAR.",
    solucao:"A tesouraria desbloqueia na hora de conciliar. Não deixar a nota desbloqueada nem sem a informação no SAP."
  } },
  faq_zbnf:{ sec:"Dúvidas recorrentes", cat:"JIRA / Chamados", name:"Pedidos ZBNF (pós-compras)", faq:{
    problema:"Alinhar como direcionar os chamados de criação de pedido após a correção de requisição.",
    processo:"Toda solicitação de pedido ZBNF é feita via chamado no JIRA. Após a criação e aprovação da RC (BNF), direcione o chamado para a fila ZBNF Serviços - Pós Compras e marcar com @ as responsáveis pela fila de compras (Laila e Tais) para agilizar a resposta.",
    solucao:"O pedido é criado pela equipe de compras a partir desse chamado. Em serviços esporádicos com valor divergente do pedido, manter o chamado na fila original e apenas marcar o comprador para a alteração."
  } },
  faq_unico:{ sec:"Dúvidas recorrentes", cat:"JIRA / Chamados", name:"Chamado único (vários centros de custo)", faq:{
    problema:"Abrir um chamado por nota, quando é o mesmo prestador em vários centros de custo, gera retrabalho.",
    processo:"Quando a alteração ou verificação é de um único prestador que afeta vários centros de custo (ex.: um reajuste em todos), abrir UM único chamado com a relação de todas as notas e os pedidos de cada uma.",
    solucao:"Otimiza o tempo e melhora a análise entre os setores."
  } },
  faq_contratos:{ sec:"Dúvidas recorrentes", cat:"JIRA / Chamados", name:"Abrir chamado para contratos", faq:{
    problema:"Chamados para o time de Contratos vinham com informações incompletas (faltando CNPJ e Razão Social) e sem descrição padronizada.",
    processo:"Preencher TODOS os campos obrigatórios, sem exceção o CNPJ e a Razão Social. Padronizar a descrição com: data de vencimento, descrição do problema, número da NF e o respectivo pedido. Exemplo: V: 00/00/0000 / (descrever solicitação) / PEDIDO: 0000000000 - BR14/BR11 - NF:",
    solucao:"O time de Contratos consegue visualizar e tratar os chamados com mais rapidez."
  } },
  faq_semcontrato:{ sec:"Dúvidas recorrentes", cat:"JIRA / Chamados", name:"Nota sem contrato atrelado", faq:{
    problema:"A nota fiscal não tem um contrato vinculado, ou o contrato não foi localizado nas planilhas.",
    processo:"Abrir chamado no JIRA para o time de Contratos para verificar se a nota fiscal tem contrato atrelado.",
    solucao:"Contratos informa se existe contrato, se o fornecedor ainda está em processo de assinatura, ou como proceder."
  } },
  faq_condpag:{ sec:"Dúvidas recorrentes", cat:"JIRA / Chamados", name:"Ajuste de condição de pagamento", faq:{
    problema:"O pedido está sem condição de pagamento no SAP.",
    processo:"Abrir chamado no JIRA para o time de Contratos solicitando o ajuste da condição de pagamento do pedido.",
    solucao:"Com o ajuste feito por Contratos, a nota pode seguir para o lançamento."
  } },
  faq_bloqlinha:{ sec:"Dúvidas recorrentes", cat:"JIRA / Chamados", name:"Bloqueio de linha de 2025 (contrato variável)", faq:{
    problema:"O pedido de contrato variável ainda tem uma linha de 2025 aberta, que não deve mais ser usada.",
    processo:"Abrir chamado no JIRA para o time de Contratos solicitando o bloqueio da linha de 2025 do pedido.",
    solucao:"Contratos bloqueia a linha de 2025, deixando o pedido correto para o ano vigente."
  } },
  faq_email:{ sec:"Dúvidas recorrentes", cat:"E-mails e controle", name:"Resposta ao e-mail do fornecedor", faq:{
    problema:"Alguns e-mails do fornecedor não estavam tendo um retorno transparente.",
    processo:"O grupo fiscal tem um responsável por dia para monitorar e tratar os e-mails. Cenários: (a) fornecedor informa emissão da nota, verificar se está perto do vencimento e encaminhar ao fiscal responsável; (b) cobrança de uma nota, encaminhar ao responsável pela tratativa e sinalizar no chat; (c) cobrança de várias notas, verificar quais já foram lançadas e encaminhar internamente só as pendentes, depois responder o prestador sobre todas. Quem assume um atendimento fica com ele até concluir, mesmo que no dia seguinte não seja o responsável do e-mail.",
    solucao:"Dar sempre uma resposta inicial imediata (a solicitação está em verificação interna), mesmo sem posição final, para garantir transparência e evitar cobranças recorrentes."
  } },
  faq_erros:{ sec:"Dúvidas recorrentes", cat:"E-mails e controle", name:"Planilha de erros", faq:{
    problema:"Notas subidas ou lançadas com erro precisam ser analisadas, e alguns casos ficavam em aberto.",
    processo:"Consultar a planilha de erros TODOS os dias, após o almoço. É onde o time de Controles registra as notas lançadas erradas para análise. Dica: configurar um alarme no celular para lembrar.",
    solucao:"A análise diária evita compensações desnecessárias e retrabalho. (Responsável pela planilha a definir.)"
  } }
};
var ORDER_FAQ=["faq_codverif", "faq_ref", "faq_comp", "faq_encontro", "faq_zbnf", "faq_unico", "faq_contratos", "faq_semcontrato", "faq_condpag", "faq_bloqlinha", "faq_email", "faq_erros"];