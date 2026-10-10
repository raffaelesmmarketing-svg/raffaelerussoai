-- Chi lascia la mail per sbloccare una guida del sito (raffaelerussoai.com/guida/<slug>).
-- Come `richiesta`: il sito, con la chiave pubblica, può solo inserire; nessuna lettura per anon.
-- Applicata il 10/10/2026 al progetto personal-brand-os (wvfazhoklpmcifimvooo) come migrazione «contatto_guida».
create table public.contatto_guida (
  id uuid primary key default gen_random_uuid(),
  creato_il timestamptz not null default now(),
  guida text not null check (char_length(guida) between 3 and 120),
  email text not null check (char_length(email) between 5 and 200 and email like '%_@_%'),
  origine text check (origine is null or char_length(origine) <= 500)
);

comment on table public.contatto_guida is
  'Chi ha lasciato la mail per sbloccare una guida di raffaelerussoai.com (/guida/<slug>).';

alter table public.contatto_guida enable row level security;

create policy "contatto_guida: inserimento dal sito"
  on public.contatto_guida for insert to anon with check (true);

grant insert on public.contatto_guida to anon;

create index contatto_guida_creato_il on public.contatto_guida (creato_il desc);
