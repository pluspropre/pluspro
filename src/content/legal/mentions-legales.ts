// Draft prepared for +Propre: these texts must be validated by the client before going live (not legal advice).
import type { LegalDoc, LegalParams } from './types'

const LAST_UPDATED = '2026-11-12'

/** Returns the trimmed value, or null when the admin left the field empty. */
function filled(value: string | null | undefined): string | null {
  const v = value?.trim()
  return v ? v : null
}

export function getMentionsLegales(p: LegalParams): LegalDoc {
  const legalForm = filled(p.legalForm) ?? '[À COMPLÉTER : forme juridique et capital social]'
  const director = filled(p.publicationDirector) ?? '[À COMPLÉTER : directeur de la publication]'

  return {
    title: 'Mentions légales',
    lastUpdated: LAST_UPDATED,
    intro:
      'Conformément à l’article 6 III de la loi n°\u00a02004-575 du 21\u00a0juin 2004 pour la confiance dans l’économie numérique (LCEN), vous trouverez ci-dessous les informations relatives à l’éditeur et à l’hébergeur du site www.plus-propre.fr.',
    sections: [
      {
        id: 'editeur',
        title: 'Éditeur du site',
        blocks: [
          { type: 'p', text: 'Le site www.plus-propre.fr est édité par\u00a0:' },
          {
            type: 'ul',
            items: [
              'Dénomination\u00a0: +PROPRE',
              `Forme juridique\u00a0: ${legalForm}`,
              'Siège\u00a0: 7 Rue de Koenigshoffen, 67000 Strasbourg, France',
              'SIREN\u00a0: 992\u00a0924\u00a0944 — SIRET\u00a0: 992\u00a0924\u00a0944\u00a000018',
              'Immatriculation\u00a0: SIREN 992\u00a0924\u00a0944',
              'Numéro de TVA intracommunautaire\u00a0: FR01992924944',
              'Téléphone\u00a0: 07\u00a065\u00a055\u00a011\u00a011',
              'E-mail\u00a0: contact@plus-propre.fr',
            ],
          },
        ],
      },
      {
        id: 'directeur-publication',
        title: 'Directeur de la publication',
        blocks: [
          {
            type: 'p',
            text: `Le directeur de la publication est ${director}. Il peut être contacté à l’adresse contact@plus-propre.fr ou par courrier au siège de +Propre.`,
          },
        ],
      },
      {
        id: 'hebergement',
        title: 'Hébergement',
        blocks: [
          { type: 'p', text: 'Le site est hébergé par\u00a0:' },
          {
            type: 'ul',
            items: [
              'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — [vercel.com](https://vercel.com)',
            ],
          },
          {
            type: 'p',
            text: 'La base de données et les fichiers du site sont hébergés par Supabase Inc. ([supabase.com](https://supabase.com)). Ces données sont stockées dans l’Union européenne (région Paris, eu-west-3).',
          },
        ],
      },
      {
        id: 'propriete-intellectuelle',
        title: 'Propriété intellectuelle',
        blocks: [
          {
            type: 'p',
            text: 'L’ensemble des éléments du site (textes, photographies, logo, nom +Propre, mise en page et éléments graphiques) est protégé par le droit de la propriété intellectuelle. Ces éléments appartiennent à +Propre ou sont utilisés avec l’autorisation de leurs titulaires.',
          },
          {
            type: 'p',
            text: 'Toute reproduction, représentation, modification ou diffusion, totale ou partielle, de ces éléments sans l’autorisation écrite préalable de +Propre est interdite et peut constituer une contrefaçon sanctionnée par les articles L.\u00a0335-2 et suivants du Code de la propriété intellectuelle.',
          },
        ],
      },
      {
        id: 'responsabilite',
        title: 'Responsabilité et liens externes',
        blocks: [
          {
            type: 'p',
            text: 'Les informations publiées sur ce site sont fournies à titre indicatif. +Propre s’efforce de les tenir exactes et à jour, mais ne peut garantir qu’elles sont complètes ou exemptes d’erreurs. Seuls les devis et contrats signés engagent +Propre sur le contenu et le prix d’une prestation.',
          },
          {
            type: 'p',
            text: '+Propre ne saurait être tenue responsable d’une interruption du site, d’une difficulté technique ou d’un dommage résultant de l’accès au site ou de son utilisation.',
          },
          {
            type: 'p',
            text: 'Le site peut contenir des liens vers des sites tiers (réseaux sociaux, partenaires techniques, etc.). +Propre n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou à leurs pratiques en matière de données personnelles.',
          },
          {
            type: 'p',
            text: 'Pour signaler un contenu inexact ou illicite, écrivez-nous à contact@plus-propre.fr.',
          },
        ],
      },
      {
        id: 'donnees-personnelles',
        title: 'Données personnelles',
        blocks: [
          {
            type: 'p',
            text: 'Les informations recueillies via le formulaire de demande de devis sont traitées par +Propre dans le respect du Règlement général sur la protection des données (RGPD) et de la loi «\u00a0Informatique et Libertés\u00a0». Pour savoir quelles données nous collectons, pourquoi, combien de temps nous les conservons et comment exercer vos droits, consultez notre [politique de confidentialité](/politique-de-confidentialite).',
          },
        ],
      },
      {
        id: 'credits-photos',
        title: 'Crédits photos',
        blocks: [
          { type: 'p', text: 'Photos\u00a0: +Propre et banques d’images.' },
          {
            type: 'p',
            text: 'Les photos de réalisations (notamment les comparaisons avant/après) sont des photos réelles d’interventions de +Propre. Quelques visuels d’illustration proviennent de banques d’images.',
          },
        ],
      },
    ],
  }
}
