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

   ===== PARTE 4 — ACESSO RESTRITO À EQUIPE =====
   Cria a lista de quem pode entrar (tabela acesso_manual) e faz o banco só
   mostrar e aceitar dados do mural para quem está nela. Rode DEPOIS da parte 3
   e ANTES de publicar o site novo. SQL Editor > New query > cole > Run.

   ----- SQL da parte 4 -----

   create table if not exists public.acesso_manual (
     email text primary key check (email = lower(email) and email ~ '^[^@[:space:]]+@[^@[:space:]]+$'),
     nome text not null default '',
     admin boolean not null default false,
     criado_em timestamptz not null default now()
   );
   alter table public.acesso_manual enable row level security;
   revoke all on public.acesso_manual from anon;
   grant select on public.acesso_manual to authenticated;
   drop policy if exists "acesso: ver o próprio" on public.acesso_manual;
   create policy "acesso: ver o próprio" on public.acesso_manual for select to authenticated
     using (email = lower(auth.jwt()->>'email'));

   create or replace function public.acesso_ok() returns boolean language sql stable security definer set search_path = public as $$
     select exists (select 1 from public.acesso_manual where email = lower(coalesce(auth.jwt()->>'email','')));
   $$;
   create or replace function public.acesso_admin() returns boolean language sql stable security definer set search_path = public as $$
     select exists (select 1 from public.acesso_manual where email = lower(coalesce(auth.jwt()->>'email','')) and admin);
   $$;
   revoke all on function public.acesso_ok() from public;
   revoke all on function public.acesso_admin() from public;
   grant execute on function public.acesso_ok() to authenticated;
   grant execute on function public.acesso_admin() to authenticated;

   insert into public.acesso_manual (email, nome, admin) values
     ('rian.silva@preventsenior.com.br', 'Rian Silva', true),
     ('aline.santos@preventsenior.com.br', 'Aline Sabino dos Santos Oliveira', false),
     ('bianca.figueiredo@sanctamaggiore.com.br', 'Bianca da Silva Figueiredo', false),
     ('bianca.sousa@preventsenior.com.br', 'Bianca Caroline Vieira de Sousa', false),
     ('bruno.pereira@preventsenior.com.br', 'Bruno De Souza Pereira', false),
     ('karina.fujii@preventsenior.com.br', 'Karina Yuka Sugiura Fujii', false),
     ('milena.silva@preventsenior.com.br', 'Milena Alves da Silva', false),
     ('nathalia.pinto@preventsenior.com.br', 'Nathalia Santos Pinto', false),
     ('nikolas.rodrigues@preventsenior.com.br', 'Nikolas Mesquita Rodrigues', false),
     ('tania.teixeira@preventsenior.com.br', 'Tania Gouveia Teixeira', false),
     ('tatiane.santana@preventsenior.com.br', 'Tatiane Moreno Santana', false)
   on conflict (email) do update set nome = excluded.nome, admin = excluded.admin;

   alter table public.mural_noticias drop constraint if exists mural_noticias_email_check;
   alter table public.mural_noticias add constraint mural_noticias_email_check check (email ~ '^[^@[:space:]]+@[^@[:space:]]+$');
   alter table public.mural_atualizacoes drop constraint if exists mural_atualizacoes_email_check;
   alter table public.mural_atualizacoes add constraint mural_atualizacoes_email_check check (email ~ '^[^@[:space:]]+@[^@[:space:]]+$');

   drop policy if exists "mural: ler" on public.mural_noticias;
   drop policy if exists "mural: publicar" on public.mural_noticias;
   drop policy if exists "mural: remover" on public.mural_noticias;
   drop policy if exists "mural: ler (logado)" on public.mural_noticias;
   drop policy if exists "mural: publicar (logado)" on public.mural_noticias;
   drop policy if exists "mural: remover (autor ou responsável)" on public.mural_noticias;
   revoke all on public.mural_noticias from anon;
   create policy "mural: ler (equipe)" on public.mural_noticias for select to authenticated using (public.acesso_ok());
   create policy "mural: publicar (equipe)" on public.mural_noticias for insert to authenticated
     with check (public.acesso_ok() and lower(email) = lower(auth.jwt()->>'email'));
   create policy "mural: remover (autor ou responsável)" on public.mural_noticias for delete to authenticated
     using (public.acesso_ok() and (lower(email) = lower(auth.jwt()->>'email') or public.acesso_admin()));

   drop policy if exists "atualizações: ler" on public.mural_atualizacoes;
   drop policy if exists "atualizações: publicar (logado)" on public.mural_atualizacoes;
   drop policy if exists "atualizações: remover (autor ou responsável)" on public.mural_atualizacoes;
   revoke all on public.mural_atualizacoes from anon;
   create policy "atualizações: ler (equipe)" on public.mural_atualizacoes for select to authenticated using (public.acesso_ok());
   create policy "atualizações: publicar (equipe)" on public.mural_atualizacoes for insert to authenticated
     with check (public.acesso_ok() and lower(email) = lower(auth.jwt()->>'email'));
   create policy "atualizações: remover (autor ou responsável)" on public.mural_atualizacoes for delete to authenticated
     using (public.acesso_ok() and (lower(email) = lower(auth.jwt()->>'email') or public.acesso_admin()));

   ----- fim do SQL da parte 4 -----

   Incluir ou tirar alguém depois (SQL Editor > New query > Run):
     incluir: insert into public.acesso_manual (email, nome) values ('nome.sobrenome@preventsenior.com.br', 'Nome Completo');
     tirar:   delete from public.acesso_manual where email = 'nome.sobrenome@preventsenior.com.br';
   (ou pelo Table Editor > acesso_manual, que funciona como uma planilha)

   Observações:
   - O banco só aceita avisos completos e das 3 categorias. Com o login do
     Google ligado, o banco confere que quem publica é dono do e-mail; cada um
     remove só os próprios avisos (o responsável remove qualquer um). Depois da
     parte 4, só quem está na lista acesso_manual lê ou publica.
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

/* ID do cliente do Google (Google Cloud > Google Auth Platform > Clientes).
   Preenchido, o botão de login é o do próprio Google e a tela de escolha de conta
   mostra o endereço do manual (e não o do Supabase). É público: pode ficar no site.
   Termina em .apps.googleusercontent.com. Vazio = login pelo Supabase, como antes.
   NUNCA coloque aqui a "chave secreta" (GOCSPX-...). */
var GOOGLE_CLIENT_ID = "";