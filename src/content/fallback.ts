import type { Project } from '@/lib/data/projects'
import type { Review } from '@/lib/data/reviews'

/**
 * Used only when Supabase is not configured (local preview without backend, CI builds).
 * Mirrors supabase/seed.sql so the site renders meaningfully; production always reads the database.
 */
export const fallbackReviews: Review[] = [
  {
    id: 'f1',
    author_name: 'Isabelle B.',
    author_context: 'Bureaux à Strasbourg',
    rating: 5,
    content: 'Très satisfaite des services : travail soigné, rapide et toujours professionnel. Je recommande sans hésiter !',
    source: 'google',
    source_url: null,
    review_date: null,
    service_slugs: [],
    is_featured: true,
  },
  {
    id: 'f2',
    author_name: 'Sabrina O.',
    author_context: 'Commerce de centre-ville',
    rating: 5,
    content:
      'Nous avons fait appel à cette entreprise pour l’entretien de nos locaux, c’est le début d’une longue collaboration. Entreprise sérieuse et investie, je recommande les yeux fermés.',
    source: 'google',
    source_url: null,
    review_date: null,
    service_slugs: [],
    is_featured: true,
  },
  {
    id: 'f3',
    author_name: 'Pauline L.',
    author_context: 'Locaux professionnels',
    rating: 5,
    content: 'Prestation de qualité. Entreprise sérieuse.',
    source: 'google',
    source_url: null,
    review_date: null,
    service_slugs: [],
    is_featured: true,
  },
]

const p = (
  id: string,
  title: string,
  description: string,
  service: string,
  file: string | null,
  after: string,
  w: number,
  h: number,
  featured = false,
): Project => ({
  id,
  title,
  description,
  service_slug: service,
  city: 'Strasbourg',
  before_path: file ? `/images/realisations/${file}-avant.webp` : null,
  before_alt: file ? `${title} — avant nettoyage` : null,
  after_path: `/images/realisations/${after}.webp`,
  after_alt: `${title} — après nettoyage`,
  width: w,
  height: h,
  performed_on: null,
  is_featured: featured,
})

export const fallbackProjects: Project[] = [
  p('p1', 'Four encrassé remis à neuf', 'Graisse cuite et vitre opaque : dégraissage complet avant un état des lieux de sortie.', 'fin-de-bail', 'four', 'four-apres', 1280, 591, true),
  p('p2', 'Baignoire détartrée', 'Traces de calcaire et dépôts retirés pour un logement prêt à accueillir les prochains voyageurs.', 'locations-courte-duree', 'baignoire', 'baignoire-apres', 591, 1280, true),
  p('p3', 'Fenêtre et menuiserie après travaux', 'Poussières et traces de chantier sur le vitrage et le cadre : une fenêtre prête à être livrée.', 'fin-de-chantier', 'fenetre', 'fenetre-apres', 591, 1280, true),
  p('p4', 'Plan de travail de cuisine dégraissé', 'Plan de travail, crédence et électroménager nettoyés avant la remise des clés.', 'fin-de-bail', 'cuisine', 'cuisine-apres', 590, 1280),
  p('p5', 'Lavabo et robinetterie détartrés', 'Calcaire et traces de savon retirés, robinetterie lustrée.', 'locations-courte-duree', 'lavabo', 'lavabo-apres', 590, 1280),
  p('p6', 'Salle de bain remise en état', 'Vasque, paroi de douche et joints nettoyés en profondeur.', 'fin-de-bail', 'salle-de-bain', 'salle-de-bain-apres', 591, 1280),
  p('p7', 'Tiroir à couverts vidé et nettoyé', 'Les détails comptent lors d’un état des lieux : rangements vidés, dépoussiérés et nettoyés.', 'fin-de-bail', 'tiroir', 'tiroir-apres', 591, 1280),
  p('p8', 'Salle de formation prête pour la session', 'Tables et sols nettoyés, chaises relevées : une salle prête pour le lendemain matin.', 'centres-de-formation', null, 'salle-de-formation', 960, 1280),
  p('p9', 'Salle de réunion entretenue', 'Table, sièges et sols entretenus pour accueillir les réunions du matin.', 'bureaux', null, 'salle-de-reunion', 591, 1280),
  p('p10', 'Kitchenette de bureau nettoyée', 'Plan de travail, évier et façades nettoyés dans l’espace pause.', 'bureaux', null, 'kitchenette-bureau', 591, 1280),
  p('p11', 'Vasque de sanitaires détartrée', 'Dépôts de calcaire et de rouille incrustés au fond de la vasque : détartrage complet, robinetterie lustrée.', 'commerces', 'vasque-sanitaires', 'vasque-sanitaires-apres', 1536, 1536, true),
  p('p12', 'Sanitaires remis en état', 'WC et lavabo encrassés, étagère encombrée : sanitaires désinfectés, détartrés et rangés.', 'bureaux', 'wc-lavabo', 'wc-lavabo-apres', 924, 1232),
  p('p13', 'Abords et parking débarrassés', 'Pneus, déchets et encombrants évacués : un parking dégagé et propre pour les usagers.', 'coproprietes', 'parking-abords', 'parking-abords-apres', 1440, 1080),
]
