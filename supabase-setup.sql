create table properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  titulo text not null,
  precio numeric not null,
  moneda text default 'USD',
  tipo text,
  operacion text,
  ubicacion text,
  sup_total text,
  sup_cubierta text,
  ambientes int,
  dormitorios int,
  banios int,
  cochera text,
  descripcion text,
  caracteristicas text[],
  imagenes text[],
  estado text default 'Disponible',
  destacada boolean default false,
  whatsapp text default '5493795066314'
);

alter table properties enable row level security;
create policy "Acceso publico" on properties for select using (true);
create policy "Admin total" on properties for all using (true);