-- Seed data (no personal data, no leads). Applied by `supabase db reset` locally and by
-- `supabase db push --include-seed` on the hosted project. Idempotent.

-- blog categories
insert into public.post_categories (slug, name, description, sort_order) values
  ('conseils', 'Conseils', 'Nos conseils d’entretien pour garder vos locaux propres plus longtemps.', 1),
  ('chantiers-realises', 'Chantiers réalisés', 'Avant / après et retours d’expérience sur nos interventions à Strasbourg.', 2),
  ('vie-de-l-entreprise', 'Vie de l’entreprise', 'Les actualités de l’équipe +Propre.', 3)
on conflict (slug) do nothing;

-- the three reviews published on the current site (Google)
insert into public.reviews (id, author_name, author_context, rating, content, source, is_published, is_featured, sort_order)
values
  ('5b1f8f6e-0000-4000-8000-000000000001', 'Isabelle B.', 'Bureaux à Strasbourg', 5,
   'Très satisfaite des services : travail soigné, rapide et toujours professionnel. Je recommande sans hésiter !',
   'google', true, true, 1),
  ('5b1f8f6e-0000-4000-8000-000000000002', 'Sabrina O.', 'Commerce de centre-ville', 5,
   'Nous avons fait appel à cette entreprise pour l’entretien de nos locaux, c’est le début d’une longue collaboration. Entreprise sérieuse et investie, je recommande les yeux fermés.',
   'google', true, true, 2),
  ('5b1f8f6e-0000-4000-8000-000000000003', 'Pauline L.', 'Locaux professionnels', 5,
   'Prestation de qualité. Entreprise sérieuse.',
   'google', true, true, 3)
on conflict (id) do nothing;

-- two draft articles for the client to validate (docs/05 §4.7)
insert into public.posts (id, slug, title, excerpt, content_html, category_id, service_slugs, status, seo_title, seo_description, reading_minutes)
select
  '7c2a1d40-0000-4000-8000-000000000001',
  '3-reflexes-pour-garder-vos-locaux-propres',
  '3 réflexes pour garder vos locaux propres plus longtemps',
  'Zones prioritaires, espaces rangés, petites habitudes : trois réflexes simples pour prolonger l’effet d’un nettoyage professionnel entre deux passages.',
  '<p>Un nettoyage professionnel remet vos locaux à niveau. Ce sont ensuite les habitudes du quotidien qui font durer le résultat jusqu’au passage suivant. Voici les trois réflexes que nous recommandons à nos clients à Strasbourg.</p><h2>1. Identifier les zones prioritaires</h2><p>Accueil, sanitaires, coin café : quelques zones concentrent l’essentiel du passage et donnent la première impression. Un coup de chiffon sur les points de contact (poignées, interrupteurs, plans de travail) en fin de journée suffit à garder ces espaces nets.</p><h2>2. Garder des espaces rangés</h2><p>Un bureau dégagé se nettoie mieux et plus vite. Libérez les surfaces avant le passage de l’équipe : nous pouvons alors traiter toute la surface, pas seulement les espaces vides.</p><h2>3. Installer de petites habitudes</h2><p>Une poubelle vidée régulièrement, un tapis d’entrée efficace, des produits rangés au même endroit : ces gestes simples réduisent la poussière et les traces au quotidien.</p><p>Vous souhaitez un plan d’entretien adapté à vos locaux ? <a href="/devis">Demandez votre devis gratuit</a> : nous vous répondons sous 24h.</p>',
  c.id, '{bureaux,commerces}', 'draft',
  '3 réflexes pour garder vos locaux propres',
  'Zones prioritaires, espaces rangés, petites habitudes : nos conseils pour prolonger l’effet d’un nettoyage professionnel entre deux passages.',
  2
from public.post_categories c where c.slug = 'conseils'
on conflict (id) do nothing;

insert into public.posts (id, slug, title, excerpt, content_html, category_id, service_slugs, status, seo_title, seo_description, reading_minutes)
select
  '7c2a1d40-0000-4000-8000-000000000002',
  'avant-apres-remise-en-etat-four-encrasse',
  'Avant / après : remise en état d’un four encrassé',
  'Graisse cuite, traces brunes, vitre opaque : comment nous avons remis en état le four d’un logement avant un état des lieux de sortie.',
  '<p>Le four fait partie des points systématiquement contrôlés lors d’un état des lieux de sortie. Lors d’une intervention de fin de bail à Strasbourg, nous avons remis en état un four fortement encrassé.</p><h2>Le constat</h2><p>Graisse cuite sur les parois, projections brunes sur la sole et une vitre devenue presque opaque : un encrassement classique après plusieurs années d’utilisation.</p><h2>Notre méthode</h2><ul><li>Démontage des grilles et des plaques pour un traitement séparé.</li><li>Application d’un dégraissant adapté, avec un temps de pose suffisant.</li><li>Grattage doux des dépôts, sans rayer l’émail.</li><li>Rinçage et séchage soigneux, vitre comprise.</li></ul><h2>Le résultat</h2><p>Un four propre, prêt pour l’état des lieux. Ce type de remise en état fait partie de notre prestation de <a href="/services/fin-de-bail">nettoyage de fin de bail</a>.</p>',
  c.id, '{fin-de-bail}', 'draft',
  'Avant / après : remise en état d’un four encrassé',
  'Graisse cuite et vitre opaque : notre méthode pour remettre en état un four avant un état des lieux de sortie à Strasbourg.',
  2
from public.post_categories c where c.slug = 'chantiers-realises'
on conflict (id) do nothing;

-- Réalisations: real +Propre job photos shipped with the site (public/images/realisations).
-- Paths starting with "/" are served from the site itself; photos added from the admin go to the "media" bucket.
insert into public.projects (id, title, description, service_slug, city, before_path, before_alt, after_path, after_alt, width, height, is_featured, is_published, sort_order)
values
  ('9e0b6a10-0000-4000-8000-000000000001', 'Four encrassé remis à neuf',
   'Graisse cuite et vitre opaque : dégraissage complet avant un état des lieux de sortie.',
   'fin-de-bail', 'Strasbourg',
   '/images/realisations/four-avant.webp', 'Intérieur de four encrassé avant nettoyage',
   '/images/realisations/four-apres.webp', 'Intérieur de four propre après nettoyage', 1280, 591, true, true, 1),
  ('9e0b6a10-0000-4000-8000-000000000002', 'Baignoire détartrée',
   'Traces de calcaire et dépôts retirés pour un logement prêt à accueillir les prochains voyageurs.',
   'locations-courte-duree', 'Strasbourg',
   '/images/realisations/baignoire-avant.webp', 'Baignoire entartrée avant nettoyage',
   '/images/realisations/baignoire-apres.webp', 'Baignoire blanche et propre après nettoyage', 591, 1280, true, true, 2),
  ('9e0b6a10-0000-4000-8000-000000000003', 'Fenêtre et menuiserie après travaux',
   'Poussières et traces de chantier sur le vitrage et le cadre : une fenêtre prête à être livrée.',
   'fin-de-chantier', 'Strasbourg',
   '/images/realisations/fenetre-avant.webp', 'Fenêtre poussiéreuse avant nettoyage de fin de chantier',
   '/images/realisations/fenetre-apres.webp', 'Fenêtre et cadre propres après nettoyage', 591, 1280, true, true, 3),
  ('9e0b6a10-0000-4000-8000-000000000004', 'Plan de travail de cuisine dégraissé',
   'Plan de travail, crédence et électroménager nettoyés avant la remise des clés.',
   'fin-de-bail', 'Strasbourg',
   '/images/realisations/cuisine-avant.webp', 'Plan de travail de cuisine sale avant nettoyage',
   '/images/realisations/cuisine-apres.webp', 'Plan de travail de cuisine propre après nettoyage', 590, 1280, false, true, 4),
  ('9e0b6a10-0000-4000-8000-000000000005', 'Lavabo et robinetterie détartrés',
   'Calcaire et traces de savon retirés, robinetterie lustrée.',
   'locations-courte-duree', 'Strasbourg',
   '/images/realisations/lavabo-avant.webp', 'Lavabo entartré avant nettoyage',
   '/images/realisations/lavabo-apres.webp', 'Lavabo blanc et robinet brillant après nettoyage', 590, 1280, false, true, 5),
  ('9e0b6a10-0000-4000-8000-000000000006', 'Salle de bain remise en état',
   'Vasque, paroi de douche et joints nettoyés en profondeur.',
   'fin-de-bail', 'Strasbourg',
   '/images/realisations/salle-de-bain-avant.webp', 'Salle de bain avec dépôts avant nettoyage',
   '/images/realisations/salle-de-bain-apres.webp', 'Salle de bain propre après nettoyage', 591, 1280, false, true, 6),
  ('9e0b6a10-0000-4000-8000-000000000007', 'Tiroir à couverts vidé et nettoyé',
   'Les détails comptent lors d’un état des lieux : rangements vidés, dépoussiérés et nettoyés.',
   'fin-de-bail', 'Strasbourg',
   '/images/realisations/tiroir-avant.webp', 'Tiroir à couverts encombré avant nettoyage',
   '/images/realisations/tiroir-apres.webp', 'Tiroir à couverts propre après nettoyage', 591, 1280, false, true, 7),
  ('9e0b6a10-0000-4000-8000-000000000008', 'Salle de formation prête pour la session',
   'Tables et sols nettoyés, chaises relevées : une salle prête pour le lendemain matin.',
   'centres-de-formation', 'Strasbourg', null, null,
   '/images/realisations/salle-de-formation.webp', 'Salle de formation nettoyée, chaises posées sur les tables', 960, 1280, false, true, 8),
  ('9e0b6a10-0000-4000-8000-000000000009', 'Salle de réunion entretenue',
   'Table, sièges et sols entretenus pour accueillir les réunions du matin.',
   'bureaux', 'Strasbourg', null, null,
   '/images/realisations/salle-de-reunion.webp', 'Salle de réunion avec table ronde après nettoyage', 591, 1280, false, true, 9),
  ('9e0b6a10-0000-4000-8000-000000000010', 'Kitchenette de bureau nettoyée',
   'Plan de travail, évier et façades nettoyés dans l’espace pause.',
   'bureaux', 'Strasbourg', null, null,
   '/images/realisations/kitchenette-bureau.webp', 'Kitchenette de bureau propre', 591, 1280, false, true, 10),
  ('9e0b6a10-0000-4000-8000-000000000011', 'Vasque de sanitaires détartrée',
   'Dépôts de calcaire et de rouille incrustés au fond de la vasque : détartrage complet, robinetterie lustrée.',
   'commerces', 'Strasbourg',
   '/images/realisations/vasque-sanitaires-avant.webp', 'Vasque entartrée avec des dépôts bruns avant nettoyage',
   '/images/realisations/vasque-sanitaires-apres.webp', 'Vasque blanche et robinet brillant après nettoyage', 1536, 1536, true, true, 11),
  ('9e0b6a10-0000-4000-8000-000000000012', 'Sanitaires remis en état',
   'WC et lavabo encrassés, étagère encombrée : sanitaires désinfectés, détartrés et rangés.',
   'bureaux', 'Strasbourg',
   '/images/realisations/wc-lavabo-avant.webp', 'WC et lavabo encrassés avant nettoyage',
   '/images/realisations/wc-lavabo-apres.webp', 'WC et lavabo propres après nettoyage', 924, 1232, false, true, 12),
  ('9e0b6a10-0000-4000-8000-000000000013', 'Abords et parking débarrassés',
   'Pneus, déchets et encombrants évacués : un parking dégagé et propre pour les usagers.',
   'coproprietes', 'Strasbourg',
   '/images/realisations/parking-abords-avant.webp', 'Parking encombré de pneus et de déchets avant intervention',
   '/images/realisations/parking-abords-apres.webp', 'Parking dégagé et propre après intervention', 1440, 1080, false, true, 13)
on conflict (id) do nothing;
