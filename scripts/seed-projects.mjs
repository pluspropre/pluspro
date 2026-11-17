// Adds the réalisations shipped with the site (public/images/realisations) to the hosted database.
// Rows that already exist are left untouched, so edits made from the admin are never overwritten.
// Mirrors the projects insert of supabase/seed.sql. Usage: npm run seed:projects
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required (.env.local)')
  process.exit(1)
}

const img = (name) => `/images/realisations/${name}.webp`
const rows = [
  {
    id: '9e0b6a10-0000-4000-8000-000000000011',
    title: 'Vasque de sanitaires détartrée',
    description: 'Dépôts de calcaire et de rouille incrustés au fond de la vasque : détartrage complet, robinetterie lustrée.',
    service_slug: 'commerces',
    before_path: img('vasque-sanitaires-avant'),
    before_alt: 'Vasque entartrée avec des dépôts bruns avant nettoyage',
    after_path: img('vasque-sanitaires-apres'),
    after_alt: 'Vasque blanche et robinet brillant après nettoyage',
    width: 1536,
    height: 1536,
    is_featured: true,
    sort_order: 11,
  },
  {
    id: '9e0b6a10-0000-4000-8000-000000000012',
    title: 'Sanitaires remis en état',
    description: 'WC et lavabo encrassés, étagère encombrée : sanitaires désinfectés, détartrés et rangés.',
    service_slug: 'bureaux',
    before_path: img('wc-lavabo-avant'),
    before_alt: 'WC et lavabo encrassés avant nettoyage',
    after_path: img('wc-lavabo-apres'),
    after_alt: 'WC et lavabo propres après nettoyage',
    width: 924,
    height: 1232,
    is_featured: false,
    sort_order: 12,
  },
  {
    id: '9e0b6a10-0000-4000-8000-000000000013',
    title: 'Abords et parking débarrassés',
    description: 'Pneus, déchets et encombrants évacués : un parking dégagé et propre pour les usagers.',
    service_slug: 'coproprietes',
    before_path: img('parking-abords-avant'),
    before_alt: 'Parking encombré de pneus et de déchets avant intervention',
    after_path: img('parking-abords-apres'),
    after_alt: 'Parking dégagé et propre après intervention',
    width: 1440,
    height: 1080,
    is_featured: false,
    sort_order: 13,
  },
].map((r) => ({ city: 'Strasbourg', is_published: true, ...r }))

const supabase = createClient(url, key, { auth: { persistSession: false } })
const { data, error } = await supabase
  .from('projects')
  .upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
  .select('id, title')
if (error) {
  console.error(error.message)
  process.exit(1)
}
console.log(`inserted ${data.length} of ${rows.length} project(s)`, data.map((r) => r.title))
