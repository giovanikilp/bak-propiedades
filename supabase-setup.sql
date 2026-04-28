-- BAK Propiedades - Supabase setup seguro
-- Ejecutar en Supabase SQL Editor.
-- Luego crear un usuario admin en Authentication > Users y desactivar nuevos registros si no los necesitás.

create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  titulo text not null,
  precio numeric,
  expensas numeric,
  moneda text default 'ARS',
  tipo text default 'Propiedad',
  operacion text default 'Alquiler',
  ubicacion text,
  sup_total text default 'No especificado',
  sup_cubierta text default 'No especificado',
  ambientes int,
  dormitorios int,
  banios int,
  cochera text default 'Consultar',
  descripcion text,
  caracteristicas text[] default '{}',
  imagenes text[] default '{}',
  estado text default 'Disponible',
  destacada boolean default false,
  whatsapp text default '5493795066314',
  orden int default 999
);

alter table public.properties add column if not exists expensas numeric;
alter table public.properties add column if not exists orden int default 999;
alter table public.properties add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.properties enable row level security;

drop policy if exists "Acceso publico" on public.properties;
drop policy if exists "Admin total" on public.properties;
drop policy if exists "Lectura publica de propiedades activas" on public.properties;
drop policy if exists "Admins autenticados pueden insertar" on public.properties;
drop policy if exists "Admins autenticados pueden editar" on public.properties;
drop policy if exists "Admins autenticados pueden eliminar" on public.properties;

-- El sitio publico puede leer propiedades, pero la app filtra las Inactivas.
create policy "Lectura publica de propiedades activas"
on public.properties
for select
using (true);

-- Solo usuarios autenticados en Supabase Auth pueden modificar.
-- Recomendacion: desactivar signups y crear manualmente el usuario admin.
create policy "Admins autenticados pueden insertar"
on public.properties
for insert
to authenticated
with check (true);

create policy "Admins autenticados pueden editar"
on public.properties
for update
to authenticated
using (true)
with check (true);

create policy "Admins autenticados pueden eliminar"
on public.properties
for delete
to authenticated
using (true);

-- Storage para fotos
insert into storage.buckets (id, name, public)
values ('propiedades', 'propiedades', true)
on conflict (id) do update set public = true;

drop policy if exists "Lectura publica storage propiedades" on storage.objects;
drop policy if exists "Admins suben fotos propiedades" on storage.objects;
drop policy if exists "Admins editan fotos propiedades" on storage.objects;
drop policy if exists "Admins eliminan fotos propiedades" on storage.objects;

create policy "Lectura publica storage propiedades"
on storage.objects
for select
using (bucket_id = 'propiedades');

create policy "Admins suben fotos propiedades"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'propiedades');

create policy "Admins editan fotos propiedades"
on storage.objects
for update
to authenticated
using (bucket_id = 'propiedades')
with check (bucket_id = 'propiedades');

create policy "Admins eliminan fotos propiedades"
on storage.objects
for delete
to authenticated
using (bucket_id = 'propiedades');

-- Propiedad inicial real. Si ya existe, se actualiza.
insert into public.properties (
  id,
  titulo,
  precio,
  expensas,
  moneda,
  tipo,
  operacion,
  ubicacion,
  sup_total,
  sup_cubierta,
  ambientes,
  dormitorios,
  banios,
  cochera,
  descripcion,
  caracteristicas,
  imagenes,
  estado,
  destacada,
  whatsapp,
  orden
) values (
  '11111111-1111-4111-8111-111111111111',
  'Departamento en alquiler - Torre Almanzora 2°B',
  850000,
  85000,
  'ARS',
  'Departamento',
  'Alquiler',
  'Torre Almanzora, Av. Gdor. Pujol 2083, Corrientes Capital',
  'No especificado',
  'No especificado',
  2,
  1,
  1,
  'Sin cochera',
  'Departamento en alquiler ubicado en Torre Almanzora, sobre Av. Gdor. Pujol 2083, Unidad 2°B. La unidad cuenta con un dormitorio, espacios luminosos y una propuesta funcional para vivienda permanente. Condiciones informadas: alquiler mensual de $850.000, expensas aproximadas de $85.000, contrato por 1 año, actualización por ICL, sin depósito, honorarios equivalentes a 1 mes de alquiler. Se aceptan mascotas. Consultar disponibilidad y requisitos.',
  array['1 dormitorio','Unidad 2°B','Contrato por 1 año','Actualización por ICL','Sin depósito','Acepta mascotas','Expensas aproximadas $85.000','Honorarios 1 mes'],
  array[
    'https://i.imgur.com/htgKUHj.jpeg',
    'https://i.imgur.com/MQRajOk.jpeg',
    'https://i.imgur.com/jpwBwsU.jpeg',
    'https://i.imgur.com/VIVxPWG.jpeg',
    'https://i.imgur.com/xxi1vxZ.jpeg',
    'https://i.imgur.com/Is9ubuM.jpeg',
    'https://i.imgur.com/WDsKRID.jpeg',
    'https://i.imgur.com/MQ1zz0J.jpeg',
    'https://i.imgur.com/EDogyMN.jpeg'
  ],
  'Disponible',
  true,
  '5493795066314',
  1
)
on conflict (id) do update set
  titulo = excluded.titulo,
  precio = excluded.precio,
  expensas = excluded.expensas,
  moneda = excluded.moneda,
  tipo = excluded.tipo,
  operacion = excluded.operacion,
  ubicacion = excluded.ubicacion,
  sup_total = excluded.sup_total,
  sup_cubierta = excluded.sup_cubierta,
  ambientes = excluded.ambientes,
  dormitorios = excluded.dormitorios,
  banios = excluded.banios,
  cochera = excluded.cochera,
  descripcion = excluded.descripcion,
  caracteristicas = excluded.caracteristicas,
  imagenes = excluded.imagenes,
  estado = excluded.estado,
  destacada = excluded.destacada,
  whatsapp = excluded.whatsapp,
  orden = excluded.orden;
