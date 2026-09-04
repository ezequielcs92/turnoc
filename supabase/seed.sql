-- Local-only, visibly fictional content. Remote pushes do not include this seed.
insert into public.artists (
  id, slug, name, excerpt, bio, disciplines, experience, training, status, publish_at
) values (
  '10000000-0000-0000-0000-000000000001',
  'andrea-perfil-conceptual',
  'Andrea — perfil conceptual',
  'Ficha demostrativa de una artista aérea. Sustituir por información aprobada.',
  'Contenido de demostración: artista aérea enfocada en la investigación del cuerpo, la altura y el movimiento.',
  array['Tela', 'Lira', 'Trapecio'],
  array['Experiencia a confirmar con la artista'],
  array['Formación a confirmar con la artista'],
  'published',
  now()
);

insert into public.projects (
  id, slug, title, excerpt, synopsis, state, year_start, booking_enabled, status, publish_at
) values (
  '20000000-0000-0000-0000-000000000001',
  'cartografia-del-aire-demo',
  'Cartografía del aire — demo',
  'Una pieza provisional para probar la relación entre obra, elenco y agenda.',
  'Contenido de demostración. La sinopsis definitiva será escrita y aprobada por Compañía Turnoc.',
  'current',
  2026,
  true,
  'published',
  now()
);

insert into public.project_artists (project_id, artist_id, role_name)
values (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Artista aérea — crédito demo'
);

insert into public.events (
  id, slug, title, kind, excerpt, venue, city, starts_at, external_url, project_id, status, publish_at
) values (
  '30000000-0000-0000-0000-000000000001',
  'laboratorio-abierto-demo',
  'Laboratorio abierto — fecha demo',
  'workshop',
  'Fecha provisional para validar la agenda. No constituye una función real.',
  'Espacio a confirmar',
  'Ciudad a confirmar',
  '2026-11-14 18:00:00-03',
  null,
  '20000000-0000-0000-0000-000000000001',
  'published',
  now()
);

insert into public.posts (
  id, slug, title, kind, excerpt, body, tags, project_id, status, publish_at
) values
(
  '40000000-0000-0000-0000-000000000001',
  'cuaderno-de-altura-demo',
  'Cuaderno de altura — demo',
  'backstage',
  'Una entrada editorial ficticia para probar el archivo vivo del sitio.',
  'Contenido de demostración. Acá podrá convivir la investigación, el proceso creativo y la memoria de cada obra.',
  array['proceso', 'archivo'],
  '20000000-0000-0000-0000-000000000001',
  'published',
  now()
),
(
  '40000000-0000-0000-0000-000000000002',
  'convocatoria-laboratorio-demo',
  'Convocatoria a laboratorio — demo',
  'call',
  'Convocatoria ficticia destinada a comprobar el circuito de lectura y moderación.',
  'Este contenido no representa una convocatoria vigente.',
  array['convocatoria', 'comunidad'],
  null,
  'published',
  now()
);

insert into public.home_features (
  slot, eyebrow, title, summary, entity_type, entity_id, href, sort_order, status, publish_at
) values
('hero', 'Circo contemporáneo · contenido demo', 'El riesgo también puede ser una forma de memoria.', 'Una portada provisional para probar ritmo, contraste y movimiento antes de incorporar la identidad real.', 'project', '20000000-0000-0000-0000-000000000001', '/proyectos/cartografia-del-aire-demo', 0, 'published', now()),
('call', 'Comunidad', 'Proponer, leer, encontrarnos', 'Las propuestas pasan por moderación antes de cualquier publicación.', 'post', '40000000-0000-0000-0000-000000000002', '/comunidad', 1, 'published', now());

insert into public.site_settings (key, value, is_public)
values
  ('identity.placeholder', '{"active": true, "note": "Reemplazar colores, tipografías, logo y fotos con material aprobado."}'::jsonb, true),
  ('contact.public', '{"email": null, "phone": null}'::jsonb, true);
