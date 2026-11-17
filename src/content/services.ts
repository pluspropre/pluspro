import type { Service, ServiceSlug } from "./types";

// Service pages (/services/[slug]). Plain text only (also used in FAQPage JSON-LD and llms.txt).
// All entries are `draft: true` until the copy is validated with the client after the interview.
// Unconfirmed facts are hedged on purpose: no EN 14476 claim, no prices, no fixed linen supply,
// no promise on bin take-out or waste removal. Non-breaking spaces (U+00A0) precede : ; ? !

export const services: Service[] = [
  // ───────────────────────────── Secteurs ─────────────────────────────
  {
    slug: "cabinets-medicaux",
    group: "secteur",
    order: 1,
    draft: true,
    name: "Cabinets médicaux",
    short: "Protocoles d’hygiène adaptés aux zones de soin et d’attente.",
    h1: "Nettoyage de cabinets médicaux à Strasbourg",
    metaTitle: "Nettoyage de cabinet médical à Strasbourg | +Propre",
    metaDescription:
      "Nettoyage de cabinets médicaux, dentaires et de kiné à Strasbourg : désinfection des points de contact, passages hors consultations, 7j/7. Devis sous 24h.",
    intro:
      "+Propre assure le nettoyage et la désinfection des cabinets médicaux, dentaires, de kinésithérapie et paramédicaux à Strasbourg et dans l’Eurométropole. Nos agents interviennent avant ou après vos consultations, tôt le matin, en soirée ou le week-end, selon un protocole écrit et validé avec vous. Vous recevez un devis sous 24h, après une visite sur place si nécessaire.",
    hook: {
      title: "L’hygiène se juge dès la salle d’attente",
      text: "Vos patients remarquent une poignée collante, une corbeille qui déborde ou un lavabo terne avant même d’entrer en consultation. Le ménage, lui, ne doit jamais empiéter sur vos rendez-vous. Nous organisons nos passages autour de votre planning pour que chaque journée commence dans des locaux sains.",
    },
    painPoints: [
      "Un prestataire qui passe pendant les consultations et gêne patients comme praticiens.",
      "Des points de contact oubliés : poignées, interrupteurs, accoudoirs, terminal de paiement.",
      "Des sanitaires patients qui se dégradent dès le milieu de la journée.",
      "Aucune visibilité sur ce qui a réellement été fait lors du dernier passage.",
    ],
    method: [
      {
        title: "Visite et cartographie des zones",
        text: "Nous parcourons le cabinet avec vous pour distinguer accueil, salle d’attente, sanitaires, bureaux et salles de soin, et noter vos consignes : accès, alarme, pièces ou matériels à ne pas toucher.",
      },
      {
        title: "Un protocole écrit et validé",
        text: "Chaque zone reçoit sa liste de tâches, sa fréquence et les produits adaptés. Vous validez le protocole avant le premier passage ; il devient ensuite la référence commune entre votre équipe et la nôtre.",
      },
      {
        title: "Désinfection des points de contact",
        text: "Poignées, interrupteurs, accoudoirs, comptoir d’accueil, TPE et robinetterie sont désinfectés à chaque passage, en séparant le matériel des sanitaires de celui des autres zones.",
      },
      {
        title: "Passages hors consultations",
        text: "Nous intervenons avant l’ouverture, après le dernier patient ou le week-end, en toute discrétion et sans jamais consulter les documents présents dans les bureaux.",
      },
      {
        title: "Suivi et ajustements",
        text: "Un interlocuteur unique reste joignable pour faire évoluer le protocole : période d’épidémie saisonnière, arrivée d’un nouveau praticien, réaménagement d’une salle.",
      },
    ],
    tasks: [
      {
        area: "Accueil et salle d’attente",
        items: [
          "Désinfection des accoudoirs et dossiers de chaises",
          "Comptoir d’accueil, téléphone et terminal de paiement",
          "Poignées de porte et interrupteurs",
          "Vidage des corbeilles et remplacement des sacs",
          "Dépoussiérage des présentoirs, rebords et étagères",
          "Aspiration et lavage des sols",
        ],
      },
      {
        area: "Sanitaires",
        items: [
          "Désinfection des WC, lavabos et robinetterie",
          "Détartrage régulier des appareils sanitaires",
          "Miroirs, faïence et distributeurs",
          "Réapprovisionnement en savon et papier, selon votre organisation",
          "Lavage désinfectant du sol",
        ],
      },
      {
        area: "Salles de consultation et de soin",
        items: [
          "Plans de travail et surfaces hautes, hors matériel médical",
          "Lavabos, distributeurs de savon et de solution hydroalcoolique",
          "Poignées, interrupteurs et chaises",
          "Vidage des déchets assimilés aux ordures ménagères (hors DASRI)",
          "Lavage des sols avec un produit adapté",
        ],
      },
      {
        area: "Bureaux et espaces du personnel",
        items: [
          "Bureaux dégagés et téléphones",
          "Coin repas : évier, plan de travail, micro-ondes",
          "Vestiaires et rangements accessibles",
          "Sols des circulations et des bureaux",
        ],
      },
    ],
    frequencies: [
      {
        label: "Quotidien",
        text: "Pour un cabinet à forte fréquentation ou une maison de santé : un passage chaque jour d’ouverture, avant ou après les consultations.",
      },
      {
        label: "3×/semaine",
        text: "Un rythme équilibré pour un cabinet de quelques praticiens, avec un soin particulier porté aux sanitaires et à la salle d’attente.",
      },
      {
        label: "Hebdomadaire",
        text: "Pour un cabinet secondaire ou une activité à temps partiel, complété si besoin par un entretien courant assuré par votre équipe.",
      },
      {
        label: "Désinfection ponctuelle",
        text: "Après des travaux, un déménagement de cabinet ou une période d’épidémie, en complément de votre contrat ou de manière isolée.",
      },
    ],
    guarantees: [
      "Hors heures de consultation",
      "Points de contact désinfectés",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "Intervenez-vous pendant les heures de consultation ?",
        a: "Non, sauf si vous le demandez expressément. Nous intervenons avant l’ouverture du cabinet, après la dernière consultation ou le week-end, sur des plages qui couvrent le 7j/7. Les créneaux sont fixés ensemble à la mise en place du contrat, pour que vos patients ne croisent jamais un chariot de ménage et que vos praticiens trouvent des salles prêtes à chaque début de journée.",
      },
      {
        q: "Prenez-vous en charge les déchets d’activités de soins (DASRI) ?",
        a: "Non. Les déchets d’activités de soins à risques infectieux suivent une filière spécifique, assurée par un prestataire spécialisé choisi par le cabinet. Nos agents gèrent uniquement les déchets assimilés aux ordures ménagères : corbeilles, papiers, emballages. Ils ne manipulent pas les collecteurs DASRI, mais peuvent nettoyer la zone où ceux-ci sont entreposés, en suivant les consignes que vous leur donnez.",
      },
      {
        q: "Quels produits utilisez-vous pour nettoyer un cabinet médical ?",
        a: "Nous utilisons des détergents et des désinfectants professionnels choisis selon la surface et la zone, en respectant les temps de contact indiqués par le fabricant. Nous privilégions des produits écolabellisés lorsque c’est pertinent, par exemple pour les sols et les vitres. Si votre spécialité ou votre protocole interne impose un produit précis, nous l’intégrons au protocole de nettoyage défini avec vous.",
      },
      {
        q: "Le nettoyage du matériel médical est-il inclus ?",
        a: "Le matériel médical (instruments, fauteuils techniques, appareils de diagnostic) reste sous la responsabilité du cabinet, car son entretien suit des procédures propres à chaque spécialité. Nous nettoyons l’environnement de soin : sols, surfaces hautes, poignées, lavabos, mobilier d’attente et sanitaires. Si vous souhaitez nous confier certaines surfaces précises, elles sont inscrites noir sur blanc dans le protocole validé ensemble.",
      },
      {
        q: "Comment la confidentialité du cabinet est-elle respectée ?",
        a: "Nos agents ne consultent, ne déplacent et ne jettent aucun document posé sur les bureaux. Les dossiers patients et les pièces à exclure sont précisés dans le protocole. L’accès aux locaux (clés, badge, code d’alarme) est défini avec vous, et ce sont les mêmes agents qui reviennent d’un passage à l’autre, ce qui limite le nombre de personnes entrant dans le cabinet en votre absence.",
      },
    ],
    quotePrefill: { type: "cabinets-medicaux" },
    related: ["bureaux", "coproprietes", "centres-de-formation"],
    photo: {
      src: "/images/photos/cabinet-medical-lavage-sol.webp",
      alt: "Lavage à plat du sol blanc d’un couloir de cabinet médical",
    },
    keywords: [
      "nettoyage cabinet médical Strasbourg",
      "entretien cabinet médical",
      "ménage cabinet kiné Strasbourg",
      "ménage cabinet dentaire Strasbourg",
    ],
  },
  {
    slug: "centres-de-formation",
    group: "secteur",
    order: 2,
    draft: true,
    name: "Centres de formation",
    short:
      "Des salles prêtes chaque matin, quel que soit le rythme des sessions.",
    h1: "Nettoyage de centres de formation à Strasbourg",
    metaTitle: "Nettoyage de centre de formation à Strasbourg | +Propre",
    metaDescription:
      "Entretien de centres de formation à Strasbourg : salles remises en état entre les sessions, sanitaires, espaces pause, planning flexible 7j/7. Devis sous 24h.",
    intro:
      "+Propre entretient les centres et organismes de formation, écoles privées et salles de séminaire à Strasbourg et dans l’Eurométropole : salles de cours, sanitaires, espaces de pause et accueil. Nous calons nos passages sur votre planning de sessions, tôt le matin, en soirée ou le week-end. Vous recevez un devis sous 24h.",
    hook: {
      title: "Des salles prêtes, quel que soit l’enchaînement des sessions",
      text: "Une session se termine à 17h, une autre commence le lendemain à 8h30, parfois dans une configuration différente. Entre les deux, il faut des tables propres, des tableaux effacés, des sanitaires remis à niveau et une salle de pause débarrassée. C’est précisément ce créneau que nous prenons en charge.",
    },
    painPoints: [
      "Des stagiaires qui s’installent dans une salle où traînent encore les gobelets de la veille.",
      "Des sanitaires saturés en milieu de journée lors des sessions à fort effectif.",
      "Un planning qui change chaque semaine, alors que le prestataire passe toujours le même jour.",
      "Des tableaux blancs tachés et des tables marquées qui nuisent à l’image de vos formations.",
    ],
    method: [
      {
        title: "Lecture de votre planning",
        text: "Nous partons de votre calendrier de sessions et de l’occupation de chaque salle pour décider quand passer et où concentrer l’effort.",
      },
      {
        title: "Remise en état entre deux sessions",
        text: "Tables, chaises, tableaux, sols et corbeilles : chaque salle utilisée est remise en état, puis le mobilier est replacé selon le plan que vous nous indiquez pour le groupe suivant.",
      },
      {
        title: "Renfort sur les zones de passage",
        text: "Sanitaires, accueil et espace pause concentrent les allées et venues. Ils bénéficient d’un entretien plus soutenu, ajusté au nombre de stagiaires attendus.",
      },
      {
        title: "Ajustement semaine après semaine",
        text: "Vous signalez les changements de planning à votre interlocuteur unique, qui adapte les passages, y compris pour une session ajoutée tardivement, selon nos disponibilités.",
      },
    ],
    tasks: [
      {
        area: "Salles de formation",
        items: [
          "Tables nettoyées et désinfectées",
          "Chaises et assises dépoussiérées",
          "Tableaux blancs effacés et nettoyés",
          "Vidage des corbeilles",
          "Aspiration ou lavage des sols",
          "Mobilier replacé selon votre plan de salle",
        ],
      },
      {
        area: "Équipements partagés",
        items: [
          "Claviers, souris et écrans, avec un produit adapté à l’électronique",
          "Télécommandes et surfaces des vidéoprojecteurs",
          "Paperboards et supports de présentation",
          "Poignées de porte et interrupteurs",
        ],
      },
      {
        area: "Espace pause et cuisine",
        items: [
          "Tables, chaises et comptoirs",
          "Évier, plan de travail et micro-ondes",
          "Extérieur de la machine à café et des distributeurs",
          "Intérieur du réfrigérateur, à la fréquence convenue",
          "Vidage des poubelles et respect du tri",
        ],
      },
      {
        area: "Accueil et sanitaires",
        items: [
          "Comptoir d’accueil et zone d’attente",
          "Portes vitrées de l’entrée",
          "WC, lavabos et robinetterie désinfectés",
          "Réapprovisionnement des consommables, selon votre organisation",
          "Sols du hall et des circulations",
        ],
      },
    ],
    frequencies: [
      {
        label: "Après chaque session",
        text: "La salle est remise en état dès la fin de la session, pour un démarrage serein du groupe suivant.",
      },
      {
        label: "Quotidien",
        text: "Pour un centre occupé toute la semaine : un passage chaque soir ou chaque matin sur l’ensemble des espaces.",
      },
      {
        label: "2 à 3×/semaine",
        text: "Pour une occupation plus irrégulière, avec des passages calés sur vos jours de formation.",
      },
      {
        label: "Grand nettoyage ponctuel",
        text: "Entre deux cycles de formation ou avant la rentrée : vitres, sols en profondeur, mobilier et équipements.",
      },
    ],
    guarantees: [
      "Calé sur vos sessions",
      "Interventions 7j/7",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "Pouvez-vous intervenir entre deux sessions le même jour ?",
        a: "Oui, lorsque l’intervalle le permet. Une remise en état rapide entre une session du matin et une session de l’après-midi porte en général sur les tables, les corbeilles, les tableaux et les sanitaires. Nous définissons ensemble ce qui est faisable sur le créneau disponible et ce qui est reporté au passage du soir, pour que chaque groupe découvre une salle propre et rangée.",
      },
      {
        q: "Que se passe-t-il si notre planning de formation change ?",
        a: "Vous prévenez votre interlocuteur par téléphone ou par e-mail, et nous ajustons les passages. Un centre de formation vit au rythme de ses inscriptions : une session annulée, une salle supplémentaire ouverte ou une formation le samedi se gèrent sans revoir tout le contrat. Plus vous nous prévenez tôt, plus il est simple de mobiliser l’équipe sur le bon créneau.",
      },
      {
        q: "Nettoyez-vous les postes informatiques des salles de formation ?",
        a: "Oui. Nous nettoyons claviers, souris et surfaces extérieures des écrans avec des lingettes ou des produits compatibles avec le matériel électronique, sans jamais pulvériser de liquide directement dessus. Nous ne débranchons ni ne déplaçons les équipements. Si certains postes sont sensibles ou en cours de configuration, il suffit de nous le signaler pour qu’ils soient exclus du protocole.",
      },
      {
        q: "Intervenez-vous dans des salles de séminaire louées à la journée ?",
        a: "Oui. Lorsqu’une salle est louée à la journée, chaque nouvelle réservation doit la trouver dans un état irréprochable. Nous pouvons intervenir après chaque location ou selon un rythme fixe, et vous signaler tout dégât ou matériel manquant constaté lors du passage. Les créneaux suivent vos réservations, y compris en soirée et le week-end.",
      },
      {
        q: "Comment obtenir un devis pour l’entretien d’un centre de formation ?",
        a: "Décrivez vos locaux (nombre de salles, surface approximative, espaces de pause, sanitaires) et votre rythme de sessions via le formulaire de devis ou par téléphone. Nous revenons vers vous sous 24h et organisons si besoin une visite sur place pour affiner la proposition. Le devis précise les tâches par zone, les fréquences et les créneaux d’intervention retenus.",
      },
    ],
    quotePrefill: { type: "centres-de-formation" },
    related: ["bureaux", "commerces", "cabinets-medicaux"],
    photo: {
      src: "/images/photos/salle-de-formation-lumineuse.webp",
      alt: "Salle de réunion et de formation lumineuse, table et sièges propres et alignés",
    },
    keywords: [
      "nettoyage centre de formation Strasbourg",
      "entretien salles de formation",
    ],
  },
  {
    slug: "bureaux",
    group: "secteur",
    order: 3,
    draft: true,
    name: "Bureaux & open-spaces",
    short: "Des espaces de travail nets, entretenus sans gêner vos équipes.",
    h1: "Nettoyage de bureaux à Strasbourg",
    metaTitle: "Nettoyage de bureaux et open-spaces à Strasbourg | +Propre",
    metaDescription:
      "Nettoyage de bureaux et locaux professionnels à Strasbourg : postes de travail, salles de réunion, cuisine, sanitaires, tôt le matin ou le soir. Devis sous 24h.",
    intro:
      "+Propre assure le nettoyage de bureaux, d’open-spaces et de locaux professionnels à Strasbourg et dans l’Eurométropole, pour les entreprises, agences, cabinets et associations. Nos agents interviennent tôt le matin, en soirée ou le week-end, selon un plan de passage défini avec vous et suivi par un interlocuteur unique. Le devis, détaillé zone par zone, vous est envoyé sous 24h.",
    hook: {
      title: "Des bureaux nets, sans perturber vos équipes",
      text: "Vos collaborateurs arrivent dans un espace propre, les salles de réunion sont prêtes quand vos clients se présentent, la cuisine commune n’est plus un sujet de tension. Le tout sans aspirateur pendant une visioconférence ni prestataire à relancer : la régularité fait le travail.",
    },
    painPoints: [
      "Un ménage irrégulier, soigné une semaine, bâclé la suivante.",
      "Une cuisine commune et des sanitaires qui reviennent dans chaque conversation de couloir.",
      "Des remarques à transmettre à un prestataire qu’on ne parvient jamais à joindre.",
      "Une salle de réunion pas prête au moment où un client franchit la porte.",
    ],
    method: [
      {
        title: "Visite de vos locaux",
        text: "Nous faisons le tour de vos espaces avec vous : postes de travail, salles de réunion, cuisine, sanitaires, zones à accès restreint. Nous notons vos horaires, vos priorités et vos habitudes.",
      },
      {
        title: "Un plan de passage précis",
        text: "Chaque zone a sa liste de tâches et sa fréquence. Le plan est écrit, partagé avec vous et sert de référence à chaque intervention.",
      },
      {
        title: "Une équipe stable",
        text: "Les mêmes agents interviennent chez vous : ils connaissent vos accès, vos consignes et l’agencement de vos locaux, ce qui évite les oublis.",
      },
      {
        title: "Suivi et ajustements",
        text: "Votre interlocuteur unique reste joignable pour une remarque, un besoin ponctuel ou un changement d’horaires, et fait évoluer le plan avec votre activité.",
      },
    ],
    tasks: [
      {
        area: "Postes de travail et open-space",
        items: [
          "Dépoussiérage des bureaux dégagés",
          "Téléphones, accessoires et écrans dépoussiérés",
          "Vidage des corbeilles et respect du tri sélectif",
          "Poignées, interrupteurs et rambardes",
          "Aspiration des moquettes ou lavage des sols",
        ],
      },
      {
        area: "Salles de réunion",
        items: [
          "Tables et chaises",
          "Tableaux blancs et télécommandes",
          "Vitres intérieures et cloisons vitrées",
          "Remise en ordre du mobilier",
          "Sols",
        ],
      },
      {
        area: "Cuisine et espace pause",
        items: [
          "Plans de travail, crédence et évier",
          "Extérieur des appareils et intérieur du micro-ondes",
          "Tables et chaises",
          "Vaisselle ou lave-vaisselle, selon votre organisation",
          "Vidage des poubelles et lavage du sol",
        ],
      },
      {
        area: "Sanitaires",
        items: [
          "Désinfection des WC, urinoirs et lavabos",
          "Miroirs et robinetterie",
          "Réapprovisionnement des consommables, à définir ensemble",
          "Lavage désinfectant du sol",
        ],
      },
      {
        area: "Accueil et circulations",
        items: [
          "Banque d’accueil et zone d’attente",
          "Portes vitrées et traces de doigts",
          "Escaliers, paliers et cabine d’ascenseur",
          "Sols des couloirs",
        ],
      },
    ],
    frequencies: [
      {
        label: "Quotidien",
        text: "Pour les équipes nombreuses ou les locaux qui reçoivent du public : un passage chaque jour ouvré, le matin ou le soir.",
      },
      {
        label: "2 à 3×/semaine",
        text: "Adapté à une PME ou une agence : sanitaires et cuisine à chaque passage, postes de travail et salles de réunion en rotation.",
      },
      {
        label: "Hebdomadaire",
        text: "Pour un petit bureau ou une équipe en partie en télétravail : un entretien complet une fois par semaine.",
      },
      {
        label: "Ponctuel",
        text: "Grand nettoyage, vitres, remise en état après un déménagement ou avant un événement dans vos locaux.",
      },
    ],
    guarantees: [
      "Interlocuteur unique",
      "Tôt le matin ou en soirée",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "À quelle heure intervenez-vous dans nos bureaux ?",
        a: "Sur les créneaux qui vous gênent le moins : tôt le matin avant l’arrivée des équipes, en soirée après leur départ, ou le week-end. Nos plages d’intervention couvrent le 7j/7. L’horaire est fixé lors de la mise en place puis reste stable, ce qui permet à vos collaborateurs de savoir quand passent les agents et à nous d’organiser l’accès aux locaux.",
      },
      {
        q: "Faut-il être présent pendant le nettoyage des bureaux ?",
        a: "Ce n’est pas nécessaire. Lors de la mise en place, nous définissons ensemble le mode d’accès (clé, badge ou code), la gestion de l’alarme et les pièces à ne pas ouvrir. Les mêmes agents interviennent à chaque passage, ce qui limite le nombre de personnes ayant accès à vos locaux. Si un problème est constaté sur place, votre interlocuteur vous prévient.",
      },
      {
        q: "Le nettoyage des vitres est-il compris dans l’entretien des bureaux ?",
        a: "Les vitres intérieures et les cloisons vitrées peuvent être intégrées au plan de passage régulier, à la fréquence de votre choix. Le nettoyage des vitres extérieures dépend de leur accessibilité : fenêtres ouvrantes, rez-de-chaussée ou hauteur. Il peut être prévu en prestation ponctuelle, plusieurs fois par an. Nous l’évaluons lors de la visite et le présentons séparément dans le devis.",
      },
      {
        q: "Qui fournit les produits et les consommables ?",
        a: "Nous intervenons avec du matériel professionnel et des produits d’entretien adaptés à chaque surface, et nous privilégions des produits écolabellisés lorsque c’est pertinent. Les consommables (papier toilette, essuie-mains, savon, sacs poubelle) peuvent être achetés par vos soins ou intégrés à la prestation. Ce point est défini ensemble au moment du devis, selon vos habitudes d’achat.",
      },
      {
        q: "Pouvez-vous nettoyer nos bureaux après un déménagement ou des travaux ?",
        a: "Oui. Une installation dans de nouveaux locaux, un réaménagement ou des travaux de rafraîchissement laissent poussière, cartons et traces. Nous réalisons une remise en état ponctuelle avant l’arrivée de vos équipes, puis l’entretien régulier peut prendre le relais. Pour des travaux importants, consultez notre page dédiée au nettoyage de fin de chantier.",
      },
    ],
    quotePrefill: { type: "bureaux" },
    related: ["centres-de-formation", "commerces", "cabinets-medicaux"],
    photo: {
      src: "/images/photos/bureau-desinfection-gants.webp",
      alt: "Mains en gants bleus désinfectant un bureau avec un pulvérisateur et une lingette",
    },
    keywords: [
      "nettoyage bureaux Strasbourg",
      "entreprise nettoyage bureaux Strasbourg",
      "entretien locaux professionnels",
    ],
  },
  {
    slug: "commerces",
    group: "secteur",
    order: 4,
    draft: true,
    name: "Commerces & boutiques",
    short: "Une boutique impeccable à l’ouverture et une vitrine qui attire.",
    h1: "Nettoyage de commerces et boutiques à Strasbourg",
    metaTitle: "Nettoyage de commerces et boutiques à Strasbourg | +Propre",
    metaDescription:
      "Nettoyage de magasins et boutiques à Strasbourg : vitrines, sols selon revêtement, cabines, réserve, avant l’ouverture ou après la fermeture. Devis sous 24h.",
    intro:
      "+Propre nettoie les commerces, boutiques, showrooms et agences ouvertes au public à Strasbourg et dans l’Eurométropole : vitrines, surface de vente, cabines d’essayage, réserve et sanitaires. Nous intervenons avant l’ouverture, après la fermeture ou le dimanche, en tenant compte des contraintes d’accès du centre-ville. Vous obtenez un devis pour votre boutique sous 24h.",
    hook: {
      title: "Une vitrine qui donne envie d’entrer",
      text: "Un passant se fait une idée de votre boutique en quelques secondes, depuis le trottoir : traces de doigts sur la vitrine, sol terne à l’entrée, cabine d’essayage poussiéreuse. Nous préparons votre magasin pour qu’il soit impeccable au moment où vous levez le rideau, sans jamais croiser vos clients.",
    },
    painPoints: [
      "Une vitrine marquée de traces de mains et de pluie dès le milieu de la semaine.",
      "Un sol d’entrée qui accumule la boue et les gravillons de la rue les jours de mauvais temps.",
      "Un ménage fait par l’équipe de vente en fin de journée, au détriment du rangement et de la caisse.",
      "Des contraintes de centre-ville (zone piétonne, horaires de livraison, stationnement) qui compliquent tout.",
    ],
    method: [
      {
        title: "Repérage de la boutique",
        text: "Nous notons vos revêtements de sol, vos supports de présentation fragiles, vos horaires d’ouverture et les conditions d’accès à la rue : zone piétonne, créneaux de livraison, accès par une cour.",
      },
      {
        title: "Intervention hors ouverture",
        text: "Nos agents passent avant l’ouverture ou après la fermeture, pour que la surface de vente soit sèche, rangée et prête dès le premier client.",
      },
      {
        title: "Vitrine et entrée en priorité",
        text: "Vitrine, porte et seuil sont la première chose que voit un client : ils sont traités à chaque passage, côté intérieur et, selon l’accès, côté rue.",
      },
      {
        title: "Des sols traités selon leur revêtement",
        text: "Carrelage, parquet, béton ciré, vinyle ou moquette : chaque sol reçoit le produit et la méthode qui le préservent dans la durée.",
      },
      {
        title: "Renforts saisonniers",
        text: "Soldes, fêtes de fin d’année, marché de Noël : nous ajoutons des passages quand votre fréquentation augmente, puis revenons au rythme habituel.",
      },
    ],
    tasks: [
      {
        area: "Vitrine et entrée",
        items: [
          "Vitrine côté intérieur",
          "Vitrine côté rue, selon l’accessibilité",
          "Porte d’entrée, poignée et seuil",
          "Tapis d’entrée aspiré",
        ],
      },
      {
        area: "Surface de vente",
        items: [
          "Sols lavés selon le revêtement",
          "Dépoussiérage des présentoirs, étagères et rayonnages",
          "Comptoir, caisse et terminal de paiement",
          "Miroirs de la surface de vente",
          "Vidage des corbeilles",
        ],
      },
      {
        area: "Cabines d’essayage",
        items: [
          "Miroirs sans traces",
          "Sols et angles aspirés",
          "Banquettes, patères et tablettes",
          "Dépoussiérage des rideaux ou portes de cabine",
          "Signalement des articles oubliés en cabine",
        ],
      },
      {
        area: "Réserve et espaces du personnel",
        items: [
          "Sols de la réserve",
          "Coin repas du personnel",
          "Désinfection des sanitaires",
          "Papier et savon réapprovisionnés, selon votre organisation",
          "Sortie des poubelles si vous le souhaitez, à préciser au devis",
        ],
      },
    ],
    frequencies: [
      {
        label: "Quotidien",
        text: "Pour les boutiques très fréquentées : un passage chaque matin avant l’ouverture ou chaque soir après la fermeture.",
      },
      {
        label: "2 à 3×/semaine",
        text: "Pour un commerce de proximité : sols, comptoir et sanitaires à chaque passage, vitrine en priorité.",
      },
      {
        label: "Hebdomadaire",
        text: "Un entretien complet une fois par semaine, par exemple le jour de fermeture, complété par un balayage de votre équipe.",
      },
      {
        label: "Ponctuel",
        text: "Avant une ouverture ou une réouverture, après des travaux d’aménagement, avant les soldes ou les fêtes.",
      },
    ],
    guarantees: [
      "Prêt avant l’ouverture",
      "Vitrine soignée à chaque passage",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "Pouvez-vous nettoyer la vitrine côté rue ?",
        a: "Oui, lorsque la vitrine est accessible depuis le trottoir sans équipement de travail en hauteur. Nous la nettoyons à la fréquence convenue, en même temps que l’intérieur ou lors d’un passage dédié. Pour une vitrine en hauteur, une marquise ou une enseigne, nous évaluons la faisabilité lors de la visite et vous indiquons clairement ce qui peut être inclus dans le devis.",
      },
      {
        q: "Intervenez-vous dans les rues piétonnes du centre de Strasbourg ?",
        a: "Oui. Nous intervenons dans le centre-ville de Strasbourg, y compris en zone piétonne, en organisant nos passages selon les horaires d’accès et de livraison. Les contraintes propres à votre adresse (stationnement, accès par une cour, rideau métallique, alarme) sont notées lors de la visite, pour que chaque intervention se déroule sans imprévu et que la boutique soit prête à l’heure.",
      },
      {
        q: "Comment entretenez-vous les différents sols d’un magasin ?",
        a: "Chaque revêtement a ses exigences. Un carrelage supporte un lavage soutenu, un parquet vitrifié demande peu d’eau, un béton ciré ou une pierre naturelle craignent les produits acides, une moquette se traite par aspiration et détachage. Nous identifions vos sols lors de la visite et adaptons produits et méthode pour les garder beaux dans la durée, sans les abîmer.",
      },
      {
        q: "Pouvez-vous renforcer le nettoyage pendant les soldes ou les fêtes ?",
        a: "Oui. Les périodes de forte affluence, comme les soldes, les fêtes de fin d’année ou le marché de Noël, salissent davantage les sols, les cabines et l’entrée. Vous pouvez ajouter des passages ponctuels à votre contrat habituel. Prévenez votre interlocuteur le plus tôt possible : il planifie ces renforts avec vous, y compris le dimanche ou en soirée.",
      },
      {
        q: "Est-il possible d’intervenir avant l’ouverture de la boutique ?",
        a: "Oui. Intervenir tôt le matin permet d’ouvrir avec un sol sec, une vitrine nette et des cabines prêtes. Nous pouvons aussi passer après la fermeture ou le dimanche, sur des plages qui couvrent le 7j/7. L’heure est fixée ensemble selon votre heure d’ouverture et le temps nécessaire pour traiter votre surface de vente.",
      },
    ],
    quotePrefill: { type: "commerces" },
    related: ["bureaux", "centres-de-formation", "fin-de-chantier"],
    photo: {
      src: "/images/photos/commerce-nettoyage-table.webp",
      alt: "Nettoyage d’une table dans un commerce, chiffon microfibre en main",
    },
    keywords: [
      "nettoyage magasin Strasbourg",
      "nettoyage vitrine Strasbourg",
      "entretien boutique",
    ],
  },
  {
    slug: "coproprietes",
    group: "secteur",
    order: 5,
    draft: true,
    name: "Copropriétés",
    short: "Parties communes entretenues et suivi simple pour le syndic.",
    h1: "Entretien de copropriétés à Strasbourg",
    metaTitle: "Nettoyage de copropriété à Strasbourg | +Propre",
    metaDescription:
      "Entretien des parties communes de copropriétés à Strasbourg : halls, escaliers, ascenseurs, vitres des communs, suivi clair pour le syndic. Devis sous 24h.",
    intro:
      "+Propre assure l’entretien des parties communes de copropriétés et d’immeubles à Strasbourg et dans l’Eurométropole : halls, cages d’escalier, ascenseurs, vitres des communs et locaux annexes. Nous travaillons pour les syndics professionnels, les syndics bénévoles et les conseils syndicaux, avec un interlocuteur unique et un suivi des passages. Un devis présentable au conseil syndical vous est adressé sous 24h.",
    hook: {
      title: "Des communs entretenus, un syndic tranquille",
      text: "Les résidents jugent l’entretien en poussant la porte du hall : vitres, boîtes aux lettres, marches d’escalier, cabine d’ascenseur. Le syndic, lui, veut savoir ce qui a été fait et quand, sans courir après le prestataire. Nous répondons aux deux, avec des passages réguliers et un suivi simple à consulter.",
    },
    painPoints: [
      "Des résidents qui se plaignent au conseil syndical de l’état du hall ou de l’escalier.",
      "Un prestataire dont on ne sait jamais s’il est réellement passé cette semaine.",
      "Une porte d’entrée vitrée et des boîtes aux lettres couvertes de traces.",
      "Des réclamations qui remontent au syndic sans réponse rapide.",
    ],
    method: [
      {
        title: "Visite de l’immeuble",
        text: "Nous parcourons les parties communes avec le syndic ou un membre du conseil syndical : nombre d’étages, revêtements, ascenseur, local poubelles, caves et abords.",
      },
      {
        title: "Un cahier des charges clair",
        text: "Tâches, fréquences et jours de passage sont écrits noir sur blanc, dans un document facile à présenter en assemblée générale.",
      },
      {
        title: "Des passages réguliers et traçables",
        text: "Chaque passage est consigné, sur une feuille affichée dans l’immeuble ou dans un compte rendu transmis au syndic, selon ce que vous préférez.",
      },
      {
        title: "Signalements et réactivité",
        text: "Dégradation, fuite, éclairage en panne constatés lors du passage : nous les signalons au syndic. Les demandes ponctuelles passent par votre interlocuteur unique.",
      },
    ],
    tasks: [
      {
        area: "Hall d’entrée",
        items: [
          "Vitres et porte d’entrée",
          "Boîtes aux lettres et interphone",
          "Tapis d’entrée aspiré",
          "Sols balayés et lavés",
          "Dépoussiérage des rebords, plinthes et éclairages accessibles",
        ],
      },
      {
        area: "Escaliers et paliers",
        items: [
          "Balayage et lavage des marches",
          "Rampes et mains courantes",
          "Plinthes et contremarches",
          "Sols des paliers",
          "Fenêtres de paliers accessibles",
        ],
      },
      {
        area: "Ascenseur",
        items: [
          "Parois et miroir de la cabine",
          "Boutons et panneau de commande",
          "Sol de la cabine",
          "Portes palières et rails de porte",
        ],
      },
      {
        area: "Locaux annexes et abords",
        items: [
          "Sol du local poubelles",
          "Sortie et rentrée des conteneurs si vous le souhaitez, à préciser au devis",
          "Local vélos et poussettes",
          "Couloirs de caves",
          "Abords immédiats de l’entrée",
        ],
      },
    ],
    frequencies: [
      {
        label: "Hebdomadaire",
        text: "Pour un petit immeuble : un passage complet par semaine sur le hall, les escaliers et l’ascenseur.",
      },
      {
        label: "2×/semaine",
        text: "Pour une résidence plus fréquentée : hall et ascenseur à chaque passage, escaliers en alternance.",
      },
      {
        label: "Quotidien",
        text: "Pour les grandes résidences ou les immeubles mixtes avec commerces, où le hall se salit vite.",
      },
      {
        label: "Ponctuel",
        text: "Grand nettoyage annuel, vitres des communs en hauteur, remise en état après des travaux de peinture ou de ravalement.",
      },
    ],
    guarantees: [
      "Suivi des passages",
      "Interlocuteur unique",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "Comment le syndic sait-il que le ménage a été fait ?",
        a: "Chaque passage est consigné. Selon votre préférence, nous utilisons une feuille de passage affichée dans le hall et complétée à chaque intervention, ou un compte rendu transmis au syndic. Les anomalies constatées sur place (dégradation, fuite, éclairage en panne) sont signalées. Le syndic et le conseil syndical disposent ainsi d’un suivi simple, utile pour répondre aux résidents et préparer l’assemblée générale.",
      },
      {
        q: "Sortez-vous les poubelles de la copropriété ?",
        a: "C’est possible si vous le souhaitez, et cela se précise au devis. La sortie et la rentrée des conteneurs dépendent des jours de collecte de votre secteur et de l’emplacement du local poubelles, ce qui conditionne nos jours de passage. Nous l’étudions lors de la visite de l’immeuble pour vous proposer une organisation réaliste, compatible avec le reste de l’entretien des parties communes.",
      },
      {
        q: "Travaillez-vous avec les syndics bénévoles ?",
        a: "Oui. Que la copropriété soit gérée par un syndic professionnel, bénévole ou coopératif, nous fonctionnons de la même façon : un devis détaillé, un cahier des charges clair et un interlocuteur unique. Pour un syndic bénévole, cette simplicité compte : vous n’avez pas à relancer le prestataire, et les demandes des résidents sont centralisées auprès d’une seule personne.",
      },
      {
        q: "Quels jours et à quelle heure intervenez-vous dans l’immeuble ?",
        a: "Nous choisissons ensemble des jours et des horaires qui gênent le moins les résidents, par exemple en milieu de matinée en semaine, en dehors des heures de départ et de retour du travail. Nous pouvons aussi intervenir tôt le matin ou le week-end, 7j/7, si l’immeuble l’exige. Les jours de passage restent fixes pour que chacun sache quand les escaliers sont lavés.",
      },
      {
        q: "Le nettoyage des vitres des parties communes est-il compris ?",
        a: "Les vitres accessibles depuis le sol (porte d’entrée, sas, fenêtres de paliers) peuvent être intégrées au contrat, à une fréquence adaptée. Les vitres en hauteur, les verrières ou les fenêtres de cage d’escalier difficiles d’accès font l’objet d’un nettoyage ponctuel chiffré à part. Nous les évaluons lors de la visite pour que le devis présenté au conseil syndical soit complet.",
      },
    ],
    quotePrefill: { type: "coproprietes" },
    related: ["locations-courte-duree", "fin-de-bail", "bureaux"],
    photo: {
      src: "/images/photos/escalier-lavage.webp",
      alt: "Agent d’entretien lavant un escalier à rampe inox",
    },
    keywords: [
      "entretien parties communes Strasbourg",
      "nettoyage copropriété Strasbourg",
      "nettoyage cage d’escalier",
    ],
  },
  {
    slug: "locations-courte-duree",
    group: "secteur",
    order: 6,
    draft: true,
    name: "Locations courte durée",
    short:
      "Ménage entre deux voyageurs, check-list et photos à chaque rotation.",
    h1: "Ménage pour locations courte durée à Strasbourg",
    metaTitle: "Ménage location courte durée à Strasbourg | +Propre",
    metaDescription:
      "Ménage Airbnb et location courte durée à Strasbourg : rotation entre deux voyageurs, check-list photo, consommables, signalement des dégâts. Devis sous 24h.",
    intro:
      "+Propre réalise le ménage des locations courte durée (Airbnb, Booking, meublés de tourisme) à Strasbourg et dans l’Eurométropole, entre le départ d’un voyageur et l’arrivée du suivant. Nous intervenons sur le créneau entre check-out et check-in, y compris le week-end, avec une check-list et des photos à chaque rotation. Le devis vous parvient sous 24h, pour un ou plusieurs logements.",
    hook: {
      title: "Un logement parfait à chaque arrivée",
      text: "Votre voyageur part à 11h, le suivant arrive à 15h. En quatre heures, le logement doit redevenir celui des photos de l’annonce : lit fait, salle de bain sans un cheveu, cuisine rangée, consommables en place. Un oubli se paie en commentaire. Nous prenons ce créneau en charge pour que vous n’ayez plus à le surveiller.",
    },
    painPoints: [
      "Des rotations le dimanche, au moment où personne n’est disponible.",
      "Un commentaire décevant à cause d’un détail : cheveu dans la douche, poussière sous le lit.",
      "Un dégât ou un objet manquant découvert trop tard, après l’arrivée du voyageur suivant.",
      "Des consommables qui manquent faute de suivi du stock.",
    ],
    method: [
      {
        title: "Fiche logement",
        text: "Lors d’une première visite, nous établissons la fiche de votre logement : accès et boîte à clés, mise en place type, emplacement du linge et des consommables, photos de référence.",
      },
      {
        title: "Ménage complet entre deux séjours",
        text: "Chaque rotation suit la même check-list : cuisine, salle de bain, chambres, séjour, sols, poubelles et aération.",
      },
      {
        title: "Mise en place et consommables",
        text: "Lits faits, serviettes disposées, consommables réapprovisionnés à partir de votre stock. Pour le linge, l’organisation (votre stock, fourniture ou blanchisserie) reste à définir ensemble.",
      },
      {
        title: "Contrôle photo et signalement",
        text: "Des photos du logement prêt vous sont envoyées après chaque passage. Dégât, objet oublié ou équipement en panne vous sont signalés dès notre intervention.",
      },
    ],
    tasks: [
      {
        area: "Cuisine",
        items: [
          "Vaisselle lavée et rangée",
          "Plans de travail, plaque de cuisson et évier",
          "Intérieur du micro-ondes et du réfrigérateur",
          "Cafetière et bouilloire",
          "Poubelles vidées et sacs remplacés",
        ],
      },
      {
        area: "Salle de bain",
        items: [
          "Douche ou baignoire, parois et joints",
          "WC désinfectés",
          "Lavabo, miroir et robinetterie",
          "Cheveux retirés des sols et bondes accessibles",
          "Serviettes propres disposées",
        ],
      },
      {
        area: "Chambres et séjour",
        items: [
          "Lits faits avec du linge propre",
          "Dépoussiérage des meubles et tables de chevet",
          "Dessous des lits et des meubles accessibles",
          "Canapé et coussins remis en forme",
          "Vérification des objets oubliés",
        ],
      },
      {
        area: "Finitions",
        items: [
          "Sols aspirés et lavés",
          "Consommables réapprovisionnés à partir de votre stock",
          "Aération et chauffage réglés selon vos consignes",
          "Photos de contrôle envoyées",
        ],
      },
    ],
    frequencies: [
      {
        label: "À chaque rotation",
        text: "Un passage entre chaque départ et chaque arrivée, planifié à partir de votre calendrier de réservations.",
      },
      {
        label: "Créneau 11h–15h",
        text: "Le créneau habituel entre check-out et check-in, que nous organisons y compris le samedi et le dimanche.",
      },
      {
        label: "Grand ménage périodique",
        text: "Quelques fois par an : vitres, intérieur des placards, électroménager, détartrage en profondeur.",
      },
      {
        label: "Mise en service",
        text: "Avant la première mise en location ou après une période de fermeture du logement.",
      },
    ],
    guarantees: [
      "Check-list à chaque rotation",
      "Photos après chaque passage",
      "Interventions 7j/7",
    ],
    faq: [
      {
        q: "Fournissez-vous le linge de lit et les serviettes ?",
        a: "La gestion du linge est à définir ensemble, selon votre organisation. Si vous disposez de votre propre stock, nous installons le linge propre et regroupons le linge sale à l’endroit convenu. Les solutions de fourniture ou de blanchisserie dépendent de votre logement et de votre volume de réservations : nous en discutons lors du devis pour trouver la formule adaptée.",
      },
      {
        q: "Comment êtes-vous informés des nouvelles réservations ?",
        a: "Le plus simple est de partager avec nous votre calendrier de réservations, ou de nous envoyer un message à chaque nouvelle réservation. Nous planifions ainsi chaque rotation à l’avance. Pour une réservation de dernière minute, prévenez votre interlocuteur au plus tôt : nous faisons notre possible pour intervenir à temps, y compris le week-end, selon les disponibilités de l’équipe.",
      },
      {
        q: "Que faites-vous si un voyageur a causé des dégâts ?",
        a: "Nous ne réparons rien et ne contactons pas le voyageur, mais nous vous signalons tout ce qui sort de l’ordinaire dès notre passage : casse, tache sur un textile, équipement manquant ou en panne, photos à l’appui. Ces éléments vous aident à agir rapidement auprès de la plateforme de réservation et à prévenir le voyageur suivant si un élément ne peut pas être remplacé à temps.",
      },
      {
        q: "Combien de temps faut-il pour préparer un logement entre deux voyageurs ?",
        a: "Cela dépend de la surface, du nombre de couchages et de l’état laissé par le voyageur. Un studio se prépare plus vite qu’un appartement familial avec deux salles de bain. Nous estimons la durée lors de la première visite et la prévoyons dans le créneau entre check-out et check-in, souvent entre 11h et 15h, pour que le logement soit prêt à l’heure.",
      },
      {
        q: "Réapprovisionnez-vous les consommables du logement ?",
        a: "Oui, à partir du stock que vous laissez dans le logement : papier toilette, savon, produit vaisselle, sacs poubelle, café ou thé selon ce que propose votre annonce. Nous vous prévenons dès qu’un produit arrive en fin de stock, pour qu’il ne manque pas pendant un séjour. Si vous préférez nous confier l’achat de ces consommables, c’est un point à définir ensemble au devis.",
      },
    ],
    quotePrefill: { type: "locations-courte-duree" },
    related: ["fin-de-bail", "nettoyage-avant-vente", "coproprietes"],
    photo: {
      src: "/images/photos/location-lit-fait.webp",
      alt: "Lit refait avec du linge blanc propre dans une location meublée",
    },
    keywords: [
      "ménage Airbnb Strasbourg",
      "nettoyage location courte durée Strasbourg",
    ],
  },

  // ─────────────────────── Prestations ponctuelles ───────────────────────
  {
    slug: "fin-de-bail",
    group: "ponctuel",
    order: 7,
    draft: true,
    name: "Fin de bail",
    short: "Un logement remis en état pour l’état des lieux de sortie.",
    h1: "Nettoyage de fin de bail à Strasbourg",
    metaTitle: "Nettoyage de fin de bail à Strasbourg | +Propre",
    metaDescription:
      "Nettoyage de fin de bail à Strasbourg : four, hotte, calcaire, vitres, placards et sols remis en état avant l’état des lieux de sortie. Devis sous 24h, 7j/7.",
    intro:
      "+Propre réalise le nettoyage de fin de bail d’appartements et de maisons à Strasbourg et dans l’Eurométropole, pour les locataires qui quittent leur logement comme pour les propriétaires qui le récupèrent. Nous remettons en état cuisine, salle de bain, vitres, placards et sols avant l’état des lieux de sortie. Vous recevez un devis sous 24h, et l’intervention est calée sur la date de votre état des lieux.",
    hook: {
      title: "Un logement prêt pour l’état des lieux de sortie",
      text: "Le jour de l’état des lieux, le propriétaire ou l’agence ouvre le four, passe le doigt sur les plinthes et regarde le calcaire de la douche. Un logement rendu propre réduit le risque de retenue sur votre dépôt de garantie pour défaut d’entretien. Nous nous chargeons de la remise en état pendant que vous gérez le déménagement.",
    },
    painPoints: [
      "Un déménagement qui ne laisse ni le temps ni l’énergie de faire le ménage à fond.",
      "Un four, une hotte et une douche entartrée qui demandent des heures de travail.",
      "La crainte d’une retenue sur le dépôt de garantie pour un logement jugé sale.",
      "Une date d’état des lieux fixe, qui ne laisse aucune marge.",
    ],
    method: [
      {
        title: "Estimation sur photos ou visite",
        text: "Vous nous envoyez quelques photos ou nous visitons le logement : surface, état du four et de la salle de bain, nombre de fenêtres. Le devis est établi sur cette base.",
      },
      {
        title: "Intervention après le déménagement",
        text: "Nous intervenons dans le logement vide, une fois les cartons partis, idéalement la veille ou le matin de l’état des lieux.",
      },
      {
        title: "Remise en état pièce par pièce",
        text: "Cuisine, salle de bain, vitres, placards, portes, plinthes et sols : chaque pièce est traitée selon une check-list de fin de bail.",
      },
      {
        title: "Contrôle final",
        text: "Avant de partir, nous vérifions les points qu’examine un état des lieux : intérieur du four, joints, dessus des placards, interrupteurs, traces sur les portes.",
      },
    ],
    tasks: [
      {
        area: "Cuisine",
        items: [
          "Intérieur du four, grilles et plaque de cuisson",
          "Hotte et filtre dégraissés",
          "Intérieur du réfrigérateur et du congélateur, dégivré au préalable",
          "Façades et intérieur des placards",
          "Évier, robinetterie et crédence",
          "Plan de travail",
        ],
      },
      {
        area: "Salle de bain et WC",
        items: [
          "Détartrage de la douche, de la baignoire et des parois",
          "Joints et faïence",
          "Lavabo, robinetterie et miroir",
          "WC entièrement nettoyés, pied et abattant compris",
          "Bouches de ventilation",
        ],
      },
      {
        area: "Pièces de vie et chambres",
        items: [
          "Vitres, cadres et rebords de fenêtres",
          "Intérieur des placards et penderies",
          "Portes, poignées et interrupteurs",
          "Plinthes",
          "Radiateurs dépoussiérés",
        ],
      },
      {
        area: "Sols et annexes",
        items: [
          "Aspiration complète, angles compris",
          "Lavage adapté au revêtement",
          "Balcon ou terrasse sur demande",
          "Cave ou cellier sur demande",
        ],
      },
    ],
    frequencies: [
      {
        label: "Intervention unique",
        text: "Un passage complet dans le logement vide, avant la remise des clés.",
      },
      {
        label: "Avant état des lieux",
        text: "Planifiée la veille ou le matin même de l’état des lieux, pour un logement au plus propre au moment du constat.",
      },
      {
        label: "Avec visite préalable",
        text: "Pour un grand logement ou une situation particulière, une visite permet d’estimer précisément le temps nécessaire.",
      },
      {
        label: "Entre deux locataires",
        text: "Côté propriétaire ou agence : remise en état avant les photos de la nouvelle annonce et les visites.",
      },
    ],
    guarantees: [
      "Calé sur votre état des lieux",
      "Four, hotte et calcaire traités",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "Combien de temps dure un nettoyage de fin de bail ?",
        a: "La durée dépend de la surface, du nombre de pièces et de l’état du logement : un studio bien entretenu se traite bien plus vite qu’une maison avec un four très encrassé et une douche entartrée. Nous estimons le temps nécessaire à partir de vos photos ou d’une visite, et nous l’indiquons dans le devis pour que vous puissiez organiser sereinement la remise des clés.",
      },
      {
        q: "Un nettoyage de fin de bail garantit-il le remboursement du dépôt de garantie ?",
        a: "Personne ne peut le garantir : la restitution du dépôt de garantie dépend de l’ensemble de l’état des lieux, y compris d’éventuelles dégradations ou réparations locatives qui ne relèvent pas du ménage. En revanche, un logement rendu propre, avec un four, une salle de bain et des vitres nets, réduit le risque de retenue pour défaut d’entretien et facilite un état des lieux sans discussion.",
      },
      {
        q: "Le logement doit-il être vide pour le nettoyage de fin de bail ?",
        a: "C’est préférable. Un logement vide permet de nettoyer l’intérieur des placards, derrière les meubles, les plinthes et toute la surface des sols, précisément ce qu’examine l’état des lieux. Si certains meubles appartiennent au propriétaire et restent en place, nous les nettoyons et travaillons autour. Le réfrigérateur et le congélateur doivent être vidés, débranchés et dégivrés à l’avance.",
      },
      {
        q: "Intervenez-vous pour les propriétaires et les agences immobilières ?",
        a: "Oui. Entre deux locataires, un propriétaire ou une agence peut nous confier la remise en état du logement avant les photos de l’annonce et les visites. La récupération des clés se fait selon l’organisation convenue ensemble, et nous vous prévenons une fois le logement prêt. Ce nettoyage est aussi utile après des travaux de rafraîchissement réalisés entre deux baux.",
      },
      {
        q: "Pouvez-vous intervenir le week-end avant un état des lieux du lundi ?",
        a: "Oui, nos plages d’intervention couvrent le 7j/7. Si votre état des lieux a lieu un lundi matin, nous pouvons intervenir le samedi ou le dimanche, selon nos disponibilités au moment de la demande. Comme la date de l’état des lieux ne bouge pas, contactez-nous dès qu’elle est connue : le devis vous parvient sous 24h et le créneau est réservé dès votre accord.",
      },
    ],
    quotePrefill: { type: "fin-de-bail", frequency: "ponctuelle" },
    related: [
      "nettoyage-avant-vente",
      "locations-courte-duree",
      "fin-de-chantier",
    ],
    photo: {
      src: "/images/photos/salle-de-bain-robinet.webp",
      alt: "Mains en gants jaunes nettoyant le robinet et la vasque d’une salle de bain",
    },
    keywords: [
      "nettoyage fin de bail Strasbourg",
      "ménage état des lieux sortie",
    ],
  },
  {
    slug: "nettoyage-avant-vente",
    group: "ponctuel",
    order: 8,
    draft: true,
    name: "Nettoyage avant vente",
    short: "Un bien qui se présente au mieux pour les photos et les visites.",
    h1: "Nettoyage avant vente immobilière à Strasbourg",
    metaTitle: "Nettoyage avant vente immobilière à Strasbourg | +Propre",
    metaDescription:
      "Nettoyage avant vente à Strasbourg : appartement ou maison remis en valeur pour les photos et les visites, vitres, cuisine, salle de bain. Devis sous 24h.",
    intro:
      "+Propre prépare les appartements et maisons mis en vente à Strasbourg et dans l’Eurométropole : nettoyage complet, vitres, cuisine et salle de bain remises en valeur avant les photos de l’annonce et les premières visites. Nous intervenons pour les propriétaires vendeurs comme pour les agences immobilières, en suivant leur calendrier. Votre devis arrive sous 24h, à temps pour caler la séance photo.",
    hook: {
      title: "Un bien qui se montre sous son meilleur jour",
      text: "Les acheteurs découvrent votre bien d’abord en photo, puis en visite. Des vitres ternes, une hotte grasse ou des joints noircis suffisent à faire paraître un logement moins bien tenu qu’il ne l’est. Un nettoyage complet avant la mise en vente laisse parler la lumière, les volumes et les finitions.",
    },
    painPoints: [
      "Des photos d’annonce où l’on remarque d’abord les traces sur les vitres.",
      "Un logement encore habité, difficile à garder présentable entre deux visites.",
      "Une maison inoccupée depuis des mois, gagnée par la poussière.",
      "Un calendrier de visites fixé par l’agence, avec peu de marge pour se préparer.",
    ],
    method: [
      {
        title: "Visite avec vous ou l’agence",
        text: "Nous repérons ce qui compte pour la présentation : pièces de vie, cuisine, salle de bain, entrée et extérieurs accessibles, ainsi que l’état général du bien.",
      },
      {
        title: "Nettoyage en profondeur",
        text: "Chaque pièce est traitée des surfaces accessibles en hauteur jusqu’au sol : dépoussiérage, mobilier, sanitaires, électroménager visible, sols.",
      },
      {
        title: "Les détails qui se voient en photo",
        text: "Vitres et miroirs sans traces, robinetterie brillante, joints nettoyés, interrupteurs et poignées propres : ce que l’objectif et l’œil de l’acheteur captent en premier.",
      },
      {
        title: "Coordination avec l’agence",
        text: "Nous planifions l’intervention avant la séance photo et, si vous le souhaitez, un passage d’entretien entre deux séries de visites.",
      },
    ],
    tasks: [
      {
        area: "Pièces de vie",
        items: [
          "Vitres intérieures et extérieures accessibles, cadres et rebords",
          "Dépoussiérage des meubles, étagères et luminaires accessibles",
          "Portes, poignées et interrupteurs",
          "Plinthes et radiateurs",
          "Miroirs",
        ],
      },
      {
        area: "Cuisine",
        items: [
          "Plan de travail et crédence",
          "Façades des placards",
          "Évier et robinetterie détartrés",
          "Hotte dégraissée",
          "Four et plaque de cuisson",
          "Extérieur de l’électroménager",
        ],
      },
      {
        area: "Salle de bain et WC",
        items: [
          "Calcaire retiré sur la douche, la baignoire et les parois",
          "Joints et faïence",
          "Lavabo, miroir et robinetterie",
          "WC",
          "Sols",
        ],
      },
      {
        area: "Entrée et extérieurs accessibles",
        items: [
          "Porte d’entrée et seuil",
          "Balcon ou terrasse, nettoyés selon le revêtement",
          "Garde-corps",
          "Cave ou garage dépoussiérés, sur demande",
        ],
      },
    ],
    frequencies: [
      {
        label: "Intervention unique",
        text: "Un nettoyage complet avant la séance photo et les premières visites.",
      },
      {
        label: "Avec visite préalable",
        text: "Pour une maison ou un bien inoccupé depuis longtemps, une visite permet d’estimer précisément l’intervention.",
      },
      {
        label: "Entre les visites",
        text: "Un passage léger avant chaque série de visites, pour un bien toujours présentable, même habité.",
      },
      {
        label: "Avant la remise des clés",
        text: "Un dernier nettoyage une fois le bien vidé, avant la signature et la remise des clés à l’acquéreur.",
      },
    ],
    guarantees: [
      "Prêt pour photos et visites",
      "En lien avec votre agence",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "À quel moment faire nettoyer un bien avant de le vendre ?",
        a: "Idéalement juste avant la séance photo de l’annonce, puisque ce sont les photos qui déclenchent les demandes de visite. Si le bien est encore habité, ce nettoyage complet peut être complété par des passages légers entre les visites. Nous fixons la date avec vous ou avec votre agence immobilière pour que le logement soit prêt le jour prévu.",
      },
      {
        q: "Pouvez-vous nettoyer un logement encore habité avant sa mise en vente ?",
        a: "Oui. Dans un logement occupé, nous travaillons pièce par pièce en respectant vos affaires : surfaces dégagées, sanitaires, cuisine, vitres et sols. Nous vous conseillons de ranger et de désencombrer avant notre passage, car un intérieur dégagé se nettoie mieux et paraît plus spacieux en photo. Dans un logement vide, l’intervention couvre aussi l’intérieur des placards.",
      },
      {
        q: "Travaillez-vous directement avec les agences immobilières ?",
        a: "Oui. Une agence peut nous confier la préparation d’un bien pour le compte de son client vendeur : nous convenons ensemble de la récupération des clés, de la date de la séance photo et du créneau d’intervention, puis l’agence est prévenue une fois le logement prêt. Les propriétaires qui vendent sans agence peuvent bien sûr faire appel à nous directement.",
      },
      {
        q: "Qu’est-ce qui distingue un nettoyage avant vente d’un ménage classique ?",
        a: "Un ménage classique entretient un logement au quotidien. Le nettoyage avant vente vise la présentation : vitres et miroirs sans traces, calcaire retiré, joints nettoyés, hotte dégraissée, plinthes, interrupteurs et poignées propres. Ce sont les détails qu’un acheteur remarque en visite et qui ressortent en photo. Le contenu exact est défini selon l’état du bien, après une visite ou à partir de vos photos.",
      },
      {
        q: "Intervenez-vous dans une maison inoccupée depuis longtemps ?",
        a: "Oui. Une maison fermée pendant plusieurs mois, après une succession par exemple, accumule poussière et toiles d’araignée. Nous réalisons une remise en état complète, pièce par pièce. Le débarras des meubles et objets n’est pas compris dans le nettoyage : le logement doit être vidé au préalable, ou les éléments qui restent nous sont signalés pour que nous travaillions autour.",
      },
    ],
    quotePrefill: { type: "nettoyage-avant-vente", frequency: "ponctuelle" },
    related: ["fin-de-bail", "locations-courte-duree", "fin-de-chantier"],
    photo: {
      src: "/images/photos/logement-vitres-baie.webp",
      alt: "Agent nettoyant les baies vitrées d’un séjour lumineux avant une vente",
    },
    keywords: [
      "nettoyage avant vente maison Strasbourg",
      "ménage avant visite",
    ],
  },
  {
    slug: "fin-de-chantier",
    group: "ponctuel",
    order: 9,
    draft: true,
    name: "Fin de chantier",
    short: "Poussières et traces de travaux retirées, un lieu prêt à livrer.",
    h1: "Nettoyage de fin de chantier à Strasbourg",
    metaTitle: "Nettoyage de fin de chantier à Strasbourg | +Propre",
    metaDescription:
      "Nettoyage après travaux à Strasbourg : poussières, traces de peinture et de plâtre, vitres, menuiseries et sols, pour particuliers et pros. Devis sous 24h.",
    intro:
      "+Propre réalise le nettoyage de fin de chantier et après travaux à Strasbourg et dans l’Eurométropole, pour les particuliers, les artisans, les entreprises du bâtiment et les promoteurs. Nous retirons poussières et traces de peinture, de plâtre ou de colle sur les sols, vitres et menuiseries, pour un lieu prêt à être livré ou habité. Le devis vous est transmis sous 24h, après une visite du chantier ou sur photos.",
    hook: {
      title: "Un lieu prêt à être livré, pas seulement terminé",
      text: "Les travaux sont finis, mais la poussière de plâtre recouvre tout, des éclats de peinture marquent les vitres et un voile de ciment ternit le carrelage. Avant la réception du chantier ou l’emménagement, il faut une remise en état méthodique. C’est notre rôle : passer après les artisans pour que la qualité de leur travail se voie.",
    },
    painPoints: [
      "Une poussière fine qui revient sur toutes les surfaces après chaque coup de chiffon.",
      "Des traces de peinture, de plâtre ou d’étiquettes sur des vitres et des menuiseries neuves.",
      "Un voile de ciment sur le carrelage que le lavage habituel n’enlève pas.",
      "Une date de réception ou d’emménagement qui ne peut pas glisser.",
    ],
    method: [
      {
        title: "Visite du chantier",
        text: "Nous évaluons la surface, la nature des salissures, les revêtements à préserver et le niveau de finition attendu à la livraison.",
      },
      {
        title: "Dépoussiérage de haut en bas",
        text: "Aspiration et essuyage des surfaces en partant du haut, puis des rebords, des plinthes et des sols, pour que la poussière ne retombe pas sur ce qui vient d’être nettoyé.",
      },
      {
        title: "Retrait des traces",
        text: "Peinture, plâtre, colle et ciment sont retirés avec des produits et outils adaptés à chaque matériau, sans rayer les vitres ni marquer les surfaces neuves.",
      },
      {
        title: "Vitres, menuiseries et sols",
        text: "Vitres et cadres débarrassés des films et étiquettes, menuiseries nettoyées, sols lavés et rincés selon leur revêtement.",
      },
      {
        title: "Contrôle avant réception",
        text: "Un dernier passage sur les points sensibles, pour un lieu prêt à la livraison ou à l’emménagement.",
      },
    ],
    tasks: [
      {
        area: "Vitres et menuiseries",
        items: [
          "Retrait des films de protection et des étiquettes",
          "Traces de peinture, de plâtre et de silicone sur les vitres",
          "Cadres, rails et seuils de fenêtres",
          "Portes, poignées et huisseries",
          "Volets et coffres accessibles",
        ],
      },
      {
        area: "Sols",
        items: [
          "Aspiration de la poussière fine, angles compris",
          "Retrait des traces de plâtre, de colle et de peinture",
          "Lavage adapté au carrelage, au parquet, au vinyle ou au béton",
          "Traitement du voile de ciment selon le revêtement",
          "Plinthes",
        ],
      },
      {
        area: "Cuisine et sanitaires",
        items: [
          "Meubles de cuisine, intérieur et extérieur",
          "Électroménager encastré",
          "Faïence, joints et robinetterie",
          "Sanitaires neufs débarrassés des résidus de pose",
          "Bouches de ventilation",
        ],
      },
      {
        area: "Surfaces et finitions",
        items: [
          "Interrupteurs, prises et luminaires accessibles",
          "Radiateurs",
          "Rebords et appuis de fenêtres",
          "Escaliers et rampes",
          "Petits déchets de nettoyage regroupés, évacuation à préciser au devis",
        ],
      },
    ],
    frequencies: [
      {
        label: "Intervention unique",
        text: "Un nettoyage complet une fois les travaux terminés, avant la réception ou l’emménagement.",
      },
      {
        label: "En deux passages",
        text: "Un premier passage après les travaux les plus salissants, puis un nettoyage de finition juste avant la livraison.",
      },
      {
        label: "Avec visite préalable",
        text: "Pour un chantier important ou un local professionnel, afin d’estimer précisément la durée et les moyens nécessaires.",
      },
      {
        label: "Lot par lot",
        text: "Pour les artisans et promoteurs : interventions logement par logement, au rythme des livraisons.",
      },
    ],
    guarantees: [
      "Particuliers et professionnels",
      "Prêt pour la réception",
      "Devis sous 24h",
    ],
    faq: [
      {
        q: "Quand faut-il prévoir le nettoyage de fin de chantier ?",
        a: "Une fois que tous les corps de métier ont terminé, retouches de peinture comprises, et avant la réception des travaux ou l’emménagement. Intervenir trop tôt oblige à recommencer, car chaque passage d’artisan ramène de la poussière. Pour un chantier important, un passage intermédiaire suivi d’un nettoyage de finition donne un meilleur résultat. Nous fixons la date avec vous ou avec le maître d’œuvre.",
      },
      {
        q: "Évacuez-vous les déchets et gravats du chantier ?",
        a: "L’évacuation des gravats et des déchets de construction n’est pas comprise dans notre prestation de nettoyage : elle relève de l’entreprise de travaux ou d’une filière spécialisée. Pour les petits déchets liés au nettoyage (emballages, cartons de protection, chutes légères), leur prise en charge est à préciser au devis selon le volume. Nous en parlons lors de la visite pour éviter toute ambiguïté.",
      },
      {
        q: "Pouvez-vous enlever les traces de peinture sur les vitres sans les rayer ?",
        a: "Oui. Les traces de peinture, de plâtre ou de silicone sur le verre se retirent avec un grattoir à lame adapté, utilisé à plat sur une vitre mouillée, et des produits compatibles avec le matériau. Sur les menuiseries en PVC, aluminium ou bois, nous utilisons des méthodes plus douces pour ne pas marquer les surfaces neuves. En cas de doute, nous faisons un essai sur une zone discrète.",
      },
      {
        q: "Travaillez-vous pour les artisans et les promoteurs ?",
        a: "Oui. Nous intervenons aussi bien pour un particulier qui vient de rénover sa cuisine que pour un artisan, une entreprise générale ou un promoteur qui doit livrer des logements ou des locaux. Pour les professionnels, nous suivons le planning du chantier et pouvons intervenir lot par lot, avant chaque réception, avec un interlocuteur unique pour le suivi.",
      },
      {
        q: "Combien de temps dure un nettoyage après travaux ?",
        a: "Cela dépend de la surface, de la nature des travaux et de la quantité de poussière et de traces. La rénovation d’une salle de bain ne demande pas le même temps qu’un appartement entièrement refait ou qu’un plateau de bureaux neuf. Nous estimons la durée lors de la visite du chantier ou à partir de photos, et l’indiquons dans le devis, qui vous parvient sous 24h.",
      },
    ],
    quotePrefill: { type: "fin-de-chantier", frequency: "ponctuelle" },
    related: ["fin-de-bail", "nettoyage-avant-vente", "bureaux"],
    photo: {
      src: "/images/photos/chantier-aspirateur.webp",
      alt: "Aspirateur de chantier dans une pièce fraîchement repeinte, poussière de travaux au sol",
    },
    keywords: [
      "nettoyage fin de chantier Strasbourg",
      "nettoyage après travaux",
    ],
  },
];

export const serviceSlugs = services.map((s) => s.slug) as ServiceSlug[];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

const byOrder = (a: Service, b: Service) => a.order - b.order;

export const secteurs = services
  .filter((s) => s.group === "secteur")
  .sort(byOrder);

export const ponctuels = services
  .filter((s) => s.group === "ponctuel")
  .sort(byOrder);
