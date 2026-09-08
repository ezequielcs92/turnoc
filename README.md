# Compañía Turnoc — base web integral

Primera base funcional para el archivo cultural, la vidriera profesional y la comunidad de lectura de Compañía Turnoc. Está construida con Next.js App Router, TypeScript, Supabase y Tailwind CSS.

## Qué incluye

- Sitio público sin login: inicio, compañía, proyectos, artistas, agenda, actualidad, universo del circo, comunidad y contacto.
- Landings dinámicas y relaciones entre artistas, proyectos, eventos, publicaciones y medios.
- Panel privado owner-only con dashboard, gestión de las cuatro entidades centrales, archivado recuperable, vista previa, agenda, biblioteca de medios y bandeja de formularios.
- Flujo editorial `draft -> preview -> published/scheduled`, con publicación programada resuelta por RLS y revalidación pública cada 60 segundos.
- RLS tabla por tabla, columnas públicas mínimas, fuentes de medios privadas y función `private.is_admin()` con `search_path` fijado. Una publicación explícita crea una copia pública separada en Cloudflare R2.
- Metadata dinámica, Open Graph por entidad, `sitemap.xml`, `robots.txt` y datos estructurados.
- Contenido demo explícito cuando no hay variables públicas de Supabase; el seed local no se envía al remoto.

La identidad actual usa Poppins y un sistema visual cinético. Los tokens viven al inicio de `src/app/globals.css`; logo, colores y fotografías definitivas todavía deben reemplazarse por material aprobado.

## Entorno local

Requiere Node.js 20.9+ y npm. Docker Desktop sólo es necesario para levantar Supabase localmente.

1. Instalá dependencias con `npm install`.
2. Copiá `.env.example` a `.env.local`.
3. Completá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` desde la configuración API del proyecto.
4. Ejecutá `npm run dev`.

No uses ni expongas la service-role key en el navegador. Este proyecto no la necesita.

Si las variables no están configuradas, el sitio público usa contenido ficticio claramente marcado y el panel explica qué falta. Si el remoto está configurado pero vacío, muestra estados vacíos reales.

## Publicación de medios con R2

La carga editorial siempre guarda la fuente en el bucket privado de Supabase. La acción administrativa **Publicar en R2** descarga esa fuente desde el servidor, valida MIME, tipo, tamaño y clave, sube una copia a R2 y recién entonces marca el metadato como publicado. Si la subida falla, el registro permanece sin publicar. Archivar elimina la copia pública pero conserva la fuente privada.

Configurá estas variables fuera del repositorio, sin compartir sus valores por chat ni exponer credenciales al navegador:

```text
R2_ACCOUNT_ID
R2_BUCKET_NAME
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
NEXT_PUBLIC_R2_PUBLIC_URL
```

`NEXT_PUBLIC_R2_PUBLIC_URL` no contiene un secreto: es la base desde la que se sirven los objetos publicados. Una URL administrada `r2.dev` sirve para desarrollo o preview y tiene límites variables; para producción conectá un dominio propio al bucket y usalo como URL pública. No se crea ni se presupone ningún bucket desde este código.

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

- Vercel: completar las variables públicas de Supabase y las variables R2 en el entorno correspondiente antes de habilitar publicación real de medios.
- Supabase Auth: configurar URL del sitio y redirect URLs del dominio definitivo.
- Contenido: cargar identidad, fotografías, historia, manifiesto, dossier, contactos y datos reales aprobados.
