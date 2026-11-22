import { ponctuels, secteurs } from '@/content/services'
import { site } from '@/content/site'


export function GET() {
  const line = (s: { slug: string; name: string; short: string }) => `- [${s.name}](${site.url}/services/${s.slug}): ${s.short}`
  const body = `# ${site.name}

> ${site.description}

${site.name} (${site.legalName}, SIRET ${site.siretDisplay}) est une entreprise de nettoyage professionnel basée au ${site.address.street}, ${site.address.postalCode} ${site.address.city}. Zone d’intervention : ${site.zoneLabel}. Interventions 7j/7, devis gratuit sous 24h.

Contact : ${site.phone.display} · ${site.email}

## Secteurs (entretien régulier)
${secteurs.map(line).join('\n')}

## Prestations ponctuelles
${ponctuels.map(line).join('\n')}

## Pages utiles
- [Tous nos services](${site.url}/services)
- [Réalisations avant / après](${site.url}/realisations)
- [À propos et questions fréquentes](${site.url}/a-propos)
- [Actualités et conseils](${site.url}/actualites)
- [Demande de devis](${site.url}/devis)
`
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
