# Compañía Turnoc — base web integral

Primera base funcional para el archivo cultural, la vidriera profesional y la comunidad de lectura de Compañía Turnoc. Está construida con Next.js App Router, TypeScript, Supabase y Tailwind CSS.

## Qué incluye

- Sitio público sin login: inicio, compañía, proyectos, artistas, agenda, actualidad, universo del circo, comunidad y contacto.
- Landings dinámicas y relaciones entre artistas, proyectos, eventos, publicaciones y medios.
- Panel privado owner-only con dashboard, gestión de las cuatro entidades centrales, archivado recuperable, vista previa, agenda, biblioteca de medios y bandeja de formularios.
- Flujo editorial `draft -> preview -> published/scheduled`, con publicación programada resuelta por RLS y revalidación pública cada 60 segundos.
- RLS tabla por tabla, columnas públicas mínimas, buckets de medios protegidos y función `private.is_admin()` con `search_path` fijado. Un archivo publicable sólo se puede leer cuando su metadato está publicado.
- Metadata dinámica, Open Graph por entidad, `sitemap.xml`, `robots.txt` y datos estructurados.
- Contenido demo explícito cuando no hay variables públicas de Supabase; el seed local no se envía al remoto.

La identidad actual es deliberadamente provisional. Los tokens visuales viven al inicio de `src/app/globals.css`; logo, tipografías, colores y fotografías deben reemplazarse por material aprobado.

## Entorno local

Requiere Node.js 20.9+ y npm. Docker Desktop sólo es necesario para levantar Supabase localmente.

1. Instalá dependencias con `npm install`.
2. Copiá `.env.example` a `.env.local`.
3. Completá únicamente `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` desde la configuración API del proyecto.
4. Ejecutá `npm run dev`.

No uses ni expongas la service-role key en el navegador. Este proyecto no la necesita.

Si las variables no están configuradas, el sitio público usa contenido ficticio claramente marcado y el panel explica qué falta. Si el remoto está configurado pero vacío, muestra estados vacíos reales.

## Migraciones y tipos

El remoto enlazado recibió las migraciones iniciales luego de un `db push --dry-run`. Para próximos cambios:

```powershell
npx supabase db push --linked --dry-run --skip-vault
npx supabase db push --linked --skip-vault
npx supabase gen types --linked --schema public | Out-File -LiteralPath '.\src\types\database.types.ts' -Encoding utf8
```

No uses `supabase db reset --linked`: destruye el esquema remoto.

Para validar todo localmente con Docker Desktop iniciado:

```powershell
npx supabase start --exclude imgproxy,logflare,vector,supavisor
npx supabase db reset --local
npx supabase test db
```

## Asociar el primer administrador

No se crea ningún usuario ni credencial ficticia. El procedimiento requiere una cuenta Auth real creada por la persona responsable:

1. Crear/invitar el usuario desde Supabase Auth usando su email real.
2. Copiar su UUID desde el panel de Auth.
3. En el SQL Editor del mismo proyecto, ejecutar este SQL reemplazando ambos marcadores:

```sql
insert into public.app_users (user_id, display_name, role, active)
values ('<UUID_REAL_DE_AUTH>', '<NOMBRE_VISIBLE_APROBADO>', 'admin', true)
on conflict (user_id) do update
set display_name = excluded.display_name,
    role = 'admin',
    active = true;
```

La tabla no permite autoasignación pública. La autorización se comprueba nuevamente dentro de cada Server Action; el proxy sólo realiza la redirección temprana de sesión.

Las altas públicas están desactivadas en la configuración de Auth. El proyecto exige contraseñas de al menos 12 caracteres con mayúsculas, minúsculas y números; el dominio definitivo todavía debe reemplazar las URLs locales permitidas.

## Validación

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

Los tests SQL están en `supabase/tests/database/rls.test.sql` y requieren el stack local.

## Repositorio

El código está versionado en [ezequielcs92/turnoc](https://github.com/ezequielcs92/turnoc), con `main` como rama principal. El repositorio no contiene variables locales, credenciales ni estado temporal de Supabase.

## Etapas futuras (no ejecutadas)

- Vercel: importar el repositorio, cargar las tres variables públicas y verificar que el deployment quede `READY`.
- Supabase Auth: configurar URL del sitio y redirect URLs del dominio definitivo.
- Contenido: cargar identidad, fotografías, historia, manifiesto, dossier, contactos y datos reales aprobados.
