# BAK Propiedades

Sitio web estático para BAK Propiedades con panel administrativo conectado a Supabase.

## Qué incluye esta versión

- CSS limpio y sin duplicados.
- Propiedad template eliminada.
- Propiedad real de Torre Almanzora cargada como contenido inicial.
- Panel admin protegido por login de Supabase Auth.
- Lectura pública de propiedades.
- Alta, edición y eliminación solo con usuario autenticado.
- Subida de imágenes JPG/PNG/WebP desde el panel.
- Reordenamiento de imágenes arrastrando dentro del formulario.
- Ficha pública con galería, características y botón de WhatsApp.
- Respaldo local en el navegador si Supabase no responde.

## Pasos para activar Supabase

1. Entrá a Supabase > SQL Editor.
2. Pegá y ejecutá el contenido de `supabase-setup.sql`.
3. Entrá a Authentication > Users.
4. Creá manualmente el usuario admin con email y contraseña.
5. En Authentication > Providers, desactivá nuevos registros públicos si no los necesitás.
6. Verificá que exista el bucket público `propiedades` en Storage.
7. Subí el proyecto a GitHub y Vercel.
8. Abrí el sitio, tocá Admin e ingresá con el usuario creado.

## Seguridad

La URL y la publishable/anon key de Supabase pueden estar en frontend. No son claves secretas. La seguridad depende de Row Level Security y de las policies incluidas en `supabase-setup.sql`.

Nunca pegues ni publiques la `service_role key` en el frontend, GitHub o chats.

## Archivos principales

- `index.html`: estructura base.
- `css/styles.css`: estilos.
- `js/main.js`: lógica principal, Supabase, admin, subida de imágenes.
- `js/data.js`: contenido fallback inicial.
- `js/supabase-client.js`: configuración del cliente público de Supabase.
- `js/components/`: componentes visuales.
- `supabase-setup.sql`: base de datos, policies y storage.
