// Draft prepared for +Propre: these texts must be validated by the client before going live (not legal advice).
import type { LegalDoc, LegalParams } from './types'

/** Stored with each quote request (`consent_version`); bump it whenever this policy changes materially. */
export const PRIVACY_VERSION = '2026-11-v2'

const LAST_UPDATED = '2026-11-24'

/** Returns the trimmed value, or null when the admin left the field empty. */
function filled(value: string | null | undefined): string | null {
  const v = value?.trim()
  return v ? v : null
}

export function getPolitiqueConfidentialite(p: LegalParams): LegalDoc {
  const legalForm = filled(p.legalForm)
  const controller = legalForm ? `+PROPRE (${legalForm})` : '+PROPRE'

  return {
    title: 'Politique de confidentialité',
    lastUpdated: LAST_UPDATED,
    intro:
      'Cette politique explique quelles données personnelles +Propre collecte sur le site www.plus-propre.fr, pour quelles raisons, combien de temps elles sont conservées et comment exercer vos droits. Elle s’applique conformément au Règlement général sur la protection des données (RGPD) et à la loi «\u00a0Informatique et Libertés\u00a0».',
    sections: [
      {
        id: 'responsable-du-traitement',
        title: '1. Responsable du traitement',
        blocks: [
          {
            type: 'p',
            text: `Le responsable du traitement est ${controller}, 7 Rue de Koenigshoffen, 67000 Strasbourg, France (SIREN 992\u00a0924\u00a0944).`,
          },
          {
            type: 'p',
            text: 'Pour toute question relative à vos données personnelles, écrivez-nous à contact@plus-propre.fr ou par courrier à l’adresse ci-dessus. Vous pouvez aussi nous joindre au 07\u00a065\u00a055\u00a011\u00a011.',
          },
        ],
      },
      {
        id: 'donnees-collectees',
        title: '2. Données collectées',
        blocks: [
          {
            type: 'p',
            text: 'Vous pouvez consulter le site sans créer de compte ni nous communiquer de données personnelles. Nous collectons uniquement les données suivantes\u00a0:',
          },
          {
            type: 'ul',
            items: [
              'Demande de devis\u00a0: nom et prénom, adresse e-mail, numéro de téléphone, société et fonction le cas échéant, code postal et ville, adresse des locaux (facultative), description des locaux et de vos besoins, message libre, ainsi que la date et la version de votre consentement.',
              'Données techniques\u00a0: une mesure d’audience anonyme réalisée avec Vercel Web Analytics, sans cookie et sans suivi d’un site à l’autre, ainsi que les données nécessaires à la vérification anti-spam du formulaire (Cloudflare Turnstile).',
              'Espace d’administration\u00a0: le back-office du site est utilisé uniquement par le personnel de +Propre. Pour ces comptes, nous traitons l’adresse e-mail et l’historique des connexions. Les visiteurs du site n’ont pas de compte.',
            ],
          },
          {
            type: 'p',
            text: 'Les champs obligatoires du formulaire sont signalés comme tels. Sans ces informations, nous ne pouvons pas traiter votre demande. Nous ne collectons aucune donnée sensible et vous invitons à ne pas en indiquer dans le champ libre.',
          },
        ],
      },
      {
        id: 'finalites-et-bases-legales',
        title: '3. Finalités et bases légales',
        blocks: [
          {
            type: 'p',
            text: 'Chaque traitement repose sur une base légale prévue par l’article 6 du RGPD\u00a0:',
          },
          {
            type: 'table',
            head: ['Données', 'Finalité', 'Base légale', 'Durée de conservation'],
            rows: [
              [
                'Données du formulaire de devis',
                'Étudier votre demande, vous recontacter et vous adresser un devis',
                'Mesures précontractuelles prises à votre demande (art. 6.1.b RGPD)',
                '3\u00a0ans à compter de votre demande, puis suppression automatique',
              ],
              [
                'Coordonnées des prospects',
                'Assurer un suivi commercial raisonnable de votre demande (relance sur le devis envoyé)',
                'Intérêt légitime de +Propre (art. 6.1.f RGPD)',
                '3\u00a0ans à compter de votre demande, puis suppression automatique',
              ],
              [
                'Date et version du consentement',
                'Prouver que vous avez été informé du traitement de votre demande',
                'Obligation de responsabilité (art. 5.2 et 7.1 RGPD)',
                'Même durée que la demande de devis',
              ],
              [
                'Données techniques de vérification (Turnstile)',
                'Protéger le formulaire contre le spam et les envois automatisés',
                'Intérêt légitime\u00a0: sécurité du site (art. 6.1.f RGPD)',
                'Non conservées par +Propre\u00a0; les envois identifiés comme spam sont rejetés et ne sont pas enregistrés',
              ],
              [
                'Statistiques de fréquentation',
                'Mesurer l’audience et les performances du site de façon anonyme',
                'Intérêt légitime (mesure d’audience exemptée de consentement, sans cookie)',
                'Données agrégées uniquement',
              ],
              [
                'Comptes du personnel (e-mail, connexions)',
                'Gérer l’accès sécurisé au back-office',
                'Intérêt légitime\u00a0: sécurité du site (art. 6.1.f RGPD)',
                'Tant que le compte est actif',
              ],
            ],
          },
          {
            type: 'p',
            text: 'Les coordonnées et les informations saisies dans votre demande de devis ne sont pas transmises à Google Ads. Elles ne font l’objet d’aucune décision automatisée et ne sont jamais vendues.',
          },
        ],
      },
      {
        id: 'destinataires',
        title: '4. Destinataires',
        blocks: [
          {
            type: 'p',
            text: 'Vos données sont accessibles uniquement aux membres de l’équipe +Propre chargés de traiter les demandes de devis. Elles sont également traitées, pour notre compte et selon nos instructions, par les sous-traitants techniques suivants\u00a0:',
          },
          {
            type: 'ul',
            items: [
              'Vercel Inc.\u00a0: hébergement du site et mesure d’audience anonyme\u00a0;',
              'Supabase Inc.\u00a0: base de données et stockage des fichiers, dans l’Union européenne (région Paris)\u00a0;',
              'Resend\u00a0: envoi des e-mails liés à votre demande (accusé de réception, notification à notre équipe)\u00a0;',
              'Cloudflare, Inc.\u00a0: protection anti-spam du formulaire (Turnstile).',
            ],
          },
          {
            type: 'p',
            text: 'Ces prestataires sont tenus à la confidentialité et à la sécurité de vos données. Nous ne vendons, ne louons et ne cédons aucune donnée personnelle à des tiers.',
          },
        ],
      },
      {
        id: 'transferts-hors-ue',
        title: '5. Transferts hors de l’Union européenne',
        blocks: [
          {
            type: 'p',
            text: 'La base de données du site est hébergée dans l’Union européenne (région Paris). Vercel, Resend, Cloudflare et Google sont des sociétés établies aux États-Unis\u00a0: certaines données peuvent donc être traitées hors de l’Union européenne. Ces transferts sont encadrés par le cadre de protection des données UE–États-Unis (Data Privacy Framework) lorsque le prestataire y adhère et/ou par les clauses contractuelles types adoptées par la Commission européenne.',
          },
        ],
      },
      {
        id: 'durees-de-conservation',
        title: '6. Durées de conservation',
        blocks: [
          {
            type: 'ul',
            items: [
              'Demandes de devis n’ayant pas abouti à un contrat\u00a0: 3\u00a0ans à compter de votre demande, puis suppression automatique.',
              'Envois identifiés comme spam\u00a0: rejetés automatiquement, sans enregistrement.',
              'Clients\u00a0: pendant toute la durée du contrat, puis pendant les durées imposées par la loi (par exemple 10\u00a0ans pour les pièces comptables). Ces données sont gérées en dehors du site.',
              'Comptes du personnel\u00a0: tant que le compte est actif.',
              'Statistiques de fréquentation\u00a0: données agrégées et anonymes uniquement.',
              'Choix relatifs aux cookies\u00a0: 6\u00a0mois.',
            ],
          },
        ],
      },
      {
        id: 'vos-droits',
        title: '7. Vos droits',
        blocks: [
          { type: 'p', text: 'Vous disposez des droits suivants sur vos données\u00a0:' },
          {
            type: 'ul',
            items: [
              'droit d’accès\u00a0: savoir quelles données nous détenons sur vous et en obtenir une copie\u00a0;',
              'droit de rectification\u00a0: faire corriger des données inexactes ou incomplètes\u00a0;',
              'droit à l’effacement\u00a0: demander la suppression de vos données\u00a0;',
              'droit à la limitation\u00a0: demander le gel temporaire de l’utilisation de vos données\u00a0;',
              'droit d’opposition\u00a0: vous opposer à un traitement fondé sur notre intérêt légitime, notamment aux relances commerciales\u00a0;',
              'droit à la portabilité\u00a0: recevoir les données que vous nous avez fournies dans un format structuré et couramment utilisé\u00a0;',
              'droit de définir des directives relatives au sort de vos données après votre décès.',
            ],
          },
          {
            type: 'p',
            text: 'Pour exercer ces droits, écrivez-nous à contact@plus-propre.fr ou par courrier au 7 Rue de Koenigshoffen, 67000 Strasbourg. Nous vous répondons dans un délai d’un mois à compter de la réception de votre demande. Ce délai peut être prolongé de deux mois si la demande est complexe\u00a0; nous vous en informerons alors. En cas de doute raisonnable sur votre identité, nous pourrons vous demander un justificatif.',
          },
          {
            type: 'p',
            text: 'Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission nationale de l’informatique et des libertés (CNIL)\u00a0: [www.cnil.fr](https://www.cnil.fr).',
          },
        ],
      },
      {
        id: 'cookies-et-traceurs',
        title: '8. Cookies et traceurs',
        blocks: [
          {
            type: 'p',
            text: 'Un cookie est un petit fichier déposé sur votre appareil lors de la consultation d’un site. Le site www.plus-propre.fr utilise, avec votre consentement, des traceurs de mesure publicitaire Google Ads. Voici la liste des cookies et traceurs utilisés\u00a0:',
          },
          {
            type: 'table',
            head: ['Nom / outil', 'Finalité', 'Durée', 'Consentement requis'],
            rows: [
              [
                'pp_consent (+Propre)',
                'Mémoriser vos choix en matière de cookies',
                '6\u00a0mois',
                'Non (strictement nécessaire)',
              ],
              [
                'sb-… (Supabase)',
                'Maintenir la session des membres de l’équipe dans l’espace d’administration, uniquement sur les pages /admin',
                'Durée de la session',
                'Non (strictement nécessaire)',
              ],
              [
                'Cloudflare Turnstile',
                'Vérifier que le formulaire de devis est envoyé par une personne et non par un robot',
                'Durée de la vérification',
                'Non (sécurité, strictement nécessaire)',
              ],
              [
                'Vercel Web Analytics et Speed Insights',
                'Mesurer l’audience et les performances du site de façon anonyme',
                'Aucun cookie déposé',
                'Non (mesure anonyme exemptée)',
              ],
              [
                'Google Ads (notamment _gcl_aw)',
                'Mesurer les demandes de devis attribuées à nos annonces Google Ads, sans transmettre les coordonnées du formulaire',
                'Selon la politique de Google (cookie _gcl_aw : 90 jours)',
                'Oui (catégorie Mesure publicitaire)',
              ],
              [
                'Google Maps (page À propos)',
                'Afficher la carte de notre zone d’intervention',
                'Selon la politique de Google',
                'Oui (catégorie «\u00a0Contenus externes\u00a0»)',
              ],
            ],
          },
          {
            type: 'p',
            text: 'La balise Google Ads n’est chargée qu’après votre accord pour la mesure publicitaire. Google reçoit des données techniques de navigation et les événements de conversion pour attribuer les demandes aux annonces, sans transmission des données saisies dans le formulaire. Vous pouvez consulter la politique de confidentialité de Google sur policies.google.com/privacy. Les contenus externes, comme la carte Google Maps, ne sont chargés qu’avec votre accord\u00a0: tant que vous ne l’avez pas donné, un simple encadré s’affiche à leur place. Si d’autres contenus externes (vidéos, publications Instagram) sont ajoutés au site, ils relèveront de la même catégorie et suivront la même règle.',
          },
          {
            type: 'p',
            text: 'Lors de votre première visite, un bandeau vous permet de tout accepter, de tout refuser ou de choisir par catégorie. Fermer le bandeau équivaut à un refus. Votre choix est conservé 6\u00a0mois, puis vous est redemandé, de même qu’en cas de mise à jour de cette politique. Vous pouvez le modifier à tout moment grâce au lien «\u00a0Gestion des cookies\u00a0» situé en bas de chaque page.',
          },
        ],
      },
      {
        id: 'securite',
        title: '9. Sécurité',
        blocks: [
          {
            type: 'p',
            text: 'Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données contre la perte, l’accès non autorisé ou la divulgation\u00a0: connexion chiffrée (HTTPS), accès aux données réservé aux personnes habilitées de +Propre, comptes d’administration protégés, règles de contrôle d’accès au niveau de la base de données et protection anti-spam du formulaire.',
          },
        ],
      },
      {
        id: 'mise-a-jour',
        title: '10. Mise à jour de la politique',
        blocks: [
          {
            type: 'p',
            text: 'Nous pouvons modifier cette politique pour tenir compte d’une évolution du site, de nos pratiques ou de la réglementation. La date de dernière mise à jour figure en haut de cette page. En cas de changement important, votre consentement aux cookies vous sera redemandé.',
          },
          {
            type: 'p',
            text: `Version en vigueur\u00a0: ${PRIVACY_VERSION}, mise à jour le 24\u00a0novembre 2026.`,
          },
        ],
      },
    ],
  }
}
