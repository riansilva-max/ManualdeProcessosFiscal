/* ===========================================================================
   MURAL DO FISCAL — fonte das notícias/avisos da página inicial
   ---------------------------------------------------------------------------
   COMO ATUALIZAR (sem programar):
   - Cada aviso é um bloco { ... } dentro de NOTICIAS, separado por vírgula.
   - Copie um bloco existente, cole no TOPO da lista e troque os textos.
   - Campos:
       data   : "AAAA-MM-DD"  (ex.: "2026-10-08")
       cat    : "pendencia" | "aviso" | "tratativa"
       titulo : título curto
       texto  : o recado completo
       autor  : quem enviou (ex.: "Rian")
       atualizacoes (opcional, só para o histórico):
         [ { data:"AAAA-MM-DD", status:"andamento", texto:"o que mudou", autor:"Rian" } ]
         status: "aberto" | "andamento" | "resolvido" (pendências e tratativas)
   - Mantenha as aspas e a vírgula no fim de cada bloco.

   ATUALIZAÇÃO DIÁRIA SEM REDEPLOY (opcional):
   - Se você colocar este conteúdo (só o array) num arquivo noticias.json
     público no GitHub, preencha NOTICIAS_URL com o link "raw" dele.
     Ex.: "https://raw.githubusercontent.com/USUARIO/REPO/main/noticias.json"
   - Aí o site busca as notícias desse arquivo ao abrir, e você atualiza
     editando só esse arquivo no GitHub — sem precisar republicar no Netlify.
   - Deixe "" (vazio) para usar apenas a lista abaixo (atualização por deploy).
   =========================================================================== */

var NOTICIAS_URL = "";

/* ---------------------------------------------------------------------------
   AVISAR O TIME POR E-MAIL (sem serviço externo)
   - EMAILS_TIME: e-mails que recebem o aviso. Ao clicar em "Enviar por e-mail",
     o Gmail abre já preenchido (destinatários + assunto + texto) — é só enviar.
   - MURAL_LINK: endereço do manual (Netlify), incluído no corpo do e-mail.
   --------------------------------------------------------------------------- */
var EMAILS_TIME = [
  "fiscal.preventsenior@preventsenior.com.br"
];
var MURAL_LINK = "";

/* ADMIN do mural: só este e-mail vê o botão de publicar/enviar aviso.
   Quem entrar com outro e-mail (ou sem e-mail) apenas lê o mural. */
var MURAL_ADMIN = "rian.silva@preventsenior.com.br";

var NOTICIAS = [
  { data:"2026-10-08", cat:"pendencia", titulo:"E-mails com pendência — verificar",
    texto:"Favor verificar a caixa do Fiscal: há notas aguardando lançamento. Priorizar as de vencimento mais próximo.", autor:"Rian" },
  { data:"2026-10-08", cat:"aviso", titulo:"Planilha de ISS e de erros",
    texto:"Conferir a planilha de ISS e a planilha de erros e tratar as pendências do dia.", autor:"Rian" },
  { data:"2026-10-07", cat:"tratativa", titulo:"Pedido sem saldo — BRASFILTER",
    texto:"Chamado aberto para Contratos ajustar o saldo do pedido. Aguardando retorno para liberar o lançamento.", autor:"Rian" },
  { data:"2026-10-06", cat:"aviso", titulo:"Fechamento da competência concluído",
    texto:"Competência fechada. Obrigado a todos pelo esforço nos lançamentos de última hora.", autor:"Rian" }
];