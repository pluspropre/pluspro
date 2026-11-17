import type { FaqItem } from './types'

// General FAQ (À propos page + services hub) and home FAQ. Plain text only (also used in FAQPage JSON-LD).
// `contractTerms` is admin-managed (minimum contract length and notice); never output a placeholder here.

const quote: FaqItem = {
  q: 'Comment obtenir un devis ?',
  a: 'Remplissez le formulaire de la page Devis en quelques minutes ou appelez-nous au 07 65 55 11 11. Indiquez le type de locaux, la surface approximative et la fréquence souhaitée : vous recevez une proposition détaillée sous 24h. Le devis est gratuit et sans engagement. Pour un contrat régulier, nous convenons d’abord d’une visite sur place afin de chiffrer au plus juste.',
}

const visit: FaqItem = {
  q: 'Faites-vous une visite sur place ?',
  a: 'Oui. Avant toute proposition pour un contrat régulier, nous passons dans vos locaux, à Strasbourg ou dans l’Eurométropole, pour mesurer les surfaces, repérer les zones sensibles et caler les horaires d’intervention. Cette visite nous permet de chiffrer au plus juste. Vous recevez ensuite votre devis détaillé sous 24h. Pour une prestation ponctuelle simple, une description et quelques photos suffisent souvent.',
}

const products: FaqItem = {
  q: 'Quels produits utilisez-vous ?',
  a: 'Nous privilégions des produits écolabellisés lorsque c’est pertinent et choisissons chaque produit selon la surface traitée : sols, vitres, sanitaires ou mobilier. Pour les cabinets médicaux et les zones sensibles, nous utilisons des désinfectants adaptés à vos protocoles d’hygiène. Vous avez une exigence particulière, par exemple des produits sans parfum ? Signalez-la dans votre demande : nous en tenons compte dans le devis.',
}

const outOfHours: FaqItem = {
  q: 'Pouvez-vous intervenir en dehors des horaires d’ouverture ?',
  a: 'Oui : tôt le matin, en soirée ou le week-end. Nous intervenons 7j/7, au rythme de votre activité, pour ne jamais gêner vos équipes, vos patients ou vos clients. Les créneaux sont fixés ensemble lors de la visite, puis restent ajustables si vos horaires changent. Pour les accès en dehors des heures d’ouverture, nous convenons avec vous de la remise des clés ou des badges.',
}

const urgent: FaqItem = {
  q: 'J’ai un besoin urgent : pouvez-vous intervenir rapidement ?',
  a: 'Appelez-nous directement au 07 65 55 11 11 : c’est le moyen le plus rapide. Nous faisons le point avec vous sur la nature de l’intervention et vous proposons un créneau dans les meilleurs délais, selon les disponibilités de l’équipe. Comme nous intervenons 7j/7, ce créneau peut aussi être un samedi ou un dimanche. Précisez l’échéance à respecter, par exemple un état des lieux.',
}

const ADJUSTABLE = 'Fréquence, périmètre et horaires restent ajustables à mesure que vos besoins évoluent.'
const ONE_OFF =
  'Pour une prestation ponctuelle (fin de bail, fin de chantier, avant une vente), vous ne vous engagez que sur l’intervention prévue au devis.'
const FALLBACK_TERMS = 'La durée d’engagement et le préavis sont précisés dans chaque devis, selon la fréquence choisie.'

function commitment(contractTerms?: string | null): FaqItem {
  let terms = contractTerms?.trim() || FALLBACK_TERMS
  if (!/[.!?…]$/.test(terms)) terms += '.'
  return {
    q: 'Y a-t-il un engagement de durée ?',
    a: `${terms} ${ADJUSTABLE} ${ONE_OFF}`,
  }
}

/** The 6 general questions (À propos page and services hub). */
export function getGeneralFaq(contractTerms?: string | null): FaqItem[] {
  return [quote, visit, products, outOfHours, commitment(contractTerms), urgent]
}

/** The 4 home-page questions (order from the design mockup). */
export function getHomeFaq(contractTerms?: string | null): FaqItem[] {
  return [visit, outOfHours, commitment(contractTerms), products]
}
