/* ===========================================================================
   MURAL EM TEMPO REAL — banco de dados no Supabase (plano gratuito)
   ---------------------------------------------------------------------------
   Com isto preenchido, qualquer pessoa que entrar no manual com o e-mail
   profissional publica avisos no mural (com o próprio nome) e avisa o setor
   por e-mail. Sem isto, o mural continua no modo manual (noticias.js).

   PASSO A PASSO (uma vez só, uns 10 minutos):
   1. Acesse https://supabase.com e clique em "Start your project".
      Entre com o GitHub (o mesmo do site).
   2. "New project": nome mural-fiscal, crie uma senha forte para o banco
      (guarde, mas o site não usa) e escolha a região São Paulo
      (South America). Plano Free. Espere uns 2 minutos o projeto ficar pronto.
   3. Menu da esquerda > "SQL Editor" > "New query". Cole o SQL abaixo,
      clique em "Run" e confira a mensagem "Success".
   4. Menu > "Project Settings" (engrenagem) > "API" (ou "API Keys" e "Data API").
      Copie a "Project URL" para SUPABASE_URL e a chave "publishable"
      (ou "anon public") para SUPABASE_CHAVE, aqui embaixo.
      NUNCA use a chave "secret" / "service_role" no site.
   5. Salve este arquivo, envie ao GitHub e publique o site. Pronto.

   ----- SQL (copie daqui até o fim do bloco) -----

   create table if not exists public.mural_noticias (
     id bigint generated always as identity primary key,
     criado_em timestamptz not null default now(),
     data date not null,
     cat text not null check (cat in ('pendencia','aviso','tratativa','acontecimento')),
     titulo text not null check (char_length(titulo) between 1 and 90),
     texto text not null check (char_length(texto) between 1 and 1500),
     autor text not null default '-' check (char_length(autor) <= 80),
     email text not null check (email ~* '^[^@[:space:]]+@preventsenior[.]com[.]br$')
   );
   grant select, insert, delete on public.mural_noticias to anon;
   alter table public.mural_noticias enable row level security;
   create policy "mural: ler" on public.mural_noticias for select to anon using (true);
   create policy "mural: publicar" on public.mural_noticias for insert to anon with check (true);
   create policy "mural: remover" on public.mural_noticias for delete to anon using (true);
   alter publication supabase_realtime add table public.mural_noticias;

   ----- fim do SQL -----

   ===== PARTE 2 — LOGIN COM O GOOGLE (sem senha) =====
   Feito isto, cada pessoa entra com a conta Google da Prevent Senior e o banco
   passa a conferir de verdade quem publica e quem remove.

   A. Google Cloud (credencial do login) — console.cloud.google.com, com a sua
      conta Gmail pessoal (a conta da empresa não deixa criar projeto):
      1. Crie um projeto (ex.: manual-fiscal-login).
      2. Menu > "Google Auth Platform" (ou "APIs e serviços > Tela de consentimento
         OAuth") > "Começar": nome do app "Manual Fiscal", e-mail de suporte,
         público "Externo", e-mail de contato > Criar.
      3. "Clientes" > "Criar cliente" > tipo "Aplicativo da Web":
         - Origens JavaScript autorizadas: o endereço do site no Netlify
           (ex.: https://seu-site.netlify.app)
         - URIs de redirecionamento autorizados:
           https://lhbiispxfgzhtibrusxb.supabase.co/auth/v1/callback
         > Criar. Copie o "ID do cliente" e a "Chave secreta do cliente".
      4. "Público" > "Publicar app" (sai do modo teste; só usa nome e e-mail,
         então não precisa de verificação do Google).

   B. Supabase:
      1. Authentication > Sign In / Providers > Google > ligue (Enable), cole o
         ID do cliente e a chave secreta > Save.
      2. Authentication > URL Configuration: em "Site URL" e em "Redirect URLs"
         coloque o endereço do site no Netlify (ex.: https://seu-site.netlify.app).
      3. SQL Editor > New query > cole o SQL abaixo > Run.

   ----- SQL da parte 2 -----

   drop policy if exists "mural: publicar" on public.mural_noticias;
   drop policy if exists "mural: remover" on public.mural_noticias;
   revoke insert, delete on public.mural_noticias from anon;
   grant select, insert, delete on public.mural_noticias to authenticated;
   create policy "mural: ler (logado)" on public.mural_noticias for select to authenticated using (true);
   create policy "mural: publicar (logado)" on public.mural_noticias for insert to authenticated
     with check (lower(email) = lower(auth.jwt()->>'email') and lower(auth.jwt()->>'email') like '%@preventsenior.com.br');
   create policy "mural: remover (autor ou responsável)" on public.mural_noticias for delete to authenticated
     using (lower(email) = lower(auth.jwt()->>'email') or lower(auth.jwt()->>'email') = 'rian.silva@preventsenior.com.br');

   ----- fim do SQL da parte 2 -----

   C. Aqui embaixo, troque LOGIN_GOOGLE para true, salve, envie ao GitHub e
      publique o site. (Faça o SQL da parte 2 e esta troca no mesmo dia: depois
      do SQL, só quem entra com o Google consegue publicar.)

   ===== PARTE 3 — HISTÓRICO E ATUALIZAÇÕES =====
   Cria a tabela das atualizações (cada pendência, aviso ou tratativa ganha a
   sua linha do tempo) e tira a categoria "Acontecimento" (o que já existia
   nela vira "Aviso"). SQL Editor > New query > cole o SQL abaixo > Run.
   Não precisa mexer em mais nada: o site já está pronto para isso.

   ----- SQL da parte 3 -----

   update public.mural_noticias set cat = 'aviso' where cat = 'acontecimento';
   alter table public.mural_noticias drop constraint if exists mural_noticias_cat_check;
   alter table public.mural_noticias add constraint mural_noticias_cat_check check (cat in ('pendencia','aviso','tratativa'));
   create table if not exists public.mural_atualizacoes (
     id bigint generated always as identity primary key,
     noticia_id bigint not null references public.mural_noticias(id) on delete cascade,
     criado_em timestamptz not null default now(),
     texto text not null check (char_length(texto) between 1 and 1500),
     status text check (status in ('aberto','andamento','resolvido')),
     autor text not null default '-' check (char_length(autor) <= 80),
     email text not null check (email ~* '^[^@[:space:]]+@preventsenior[.]com[.]br$')
   );
   create index if not exists mural_atualizacoes_noticia on public.mural_atualizacoes (noticia_id, criado_em);
   grant select on public.mural_atualizacoes to anon, authenticated;
   grant insert, delete on public.mural_atualizacoes to authenticated;
   alter table public.mural_atualizacoes enable row level security;
   create policy "atualizações: ler" on public.mural_atualizacoes for select to anon, authenticated using (true);
   create policy "atualizações: publicar (logado)" on public.mural_atualizacoes for insert to authenticated
     with check (lower(email) = lower(auth.jwt()->>'email') and lower(auth.jwt()->>'email') like '%@preventsenior.com.br');
   create policy "atualizações: remover (autor ou responsável)" on public.mural_atualizacoes for delete to authenticated
     using (lower(email) = lower(auth.jwt()->>'email') or lower(auth.jwt()->>'email') = 'rian.silva@preventsenior.com.br');
   alter publication supabase_realtime add table public.mural_atualizacoes;

   ----- fim do SQL da parte 3 -----

   Observações:
   - O banco só aceita avisos completos, das 3 categorias e de e-mails
     @preventsenior.com.br. Com o login do Google ligado, o banco confere que
     quem publica é dono do e-mail; cada um remove só os próprios avisos
     (o responsável remove qualquer um).
   - Se aparecer "Acesso bloqueado" ao entrar com a conta da empresa, é a TI
     do Google da Prevent Senior bloqueando apps externos: peça para liberar
     o app pelo "ID do cliente" (passo A3).
   - No plano gratuito, o Supabase pausa o projeto depois de 7 dias sem
     nenhum acesso. Com o setor usando o manual todo dia, isso não acontece;
     se pausar, entre no painel do Supabase e clique em "Restore".
   =========================================================================== */

var SUPABASE_URL   = "https://lhbiispxfgzhtibrusxb.supabase.co";
var SUPABASE_CHAVE = "sb_publishable_a7Bus-4ZV8hh35jj47sbjg_qIxdODeM";   // chave pública (publishable): pode ficar no site

var SUPABASE_TABELA = "mural_noticias";

/* Login com o Google: ligado (PARTE 2 concluída). Para desligar, troque para false. */
var LOGIN_GOOGLE = true;