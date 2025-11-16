import React from 'react';
import './Realisations.css';

import realison from '../assets/realis1.jpg';
import realistwo from '../assets/realis2.jpg';
import realisth from '../assets/realis9.jpg';
import realisfour from '../assets/realis4.jpg';
import realisfive from '../assets/realis5.jpg';
import realisesix from '../assets/realis6.jpg';
import realiseseven from '../assets/realis7.jpg';
import realiseeit from '../assets/realis8.jpg';

const gallery = [
  {
    src: realison,
    title: 'Open-space',
    caption: 'Nettoyage après travaux',
  },
  {
    src: realistwo,
    title: 'Open-space',
    caption: 'Nettoyage après travaux',
  },
  {
    src: realisth,
    title: 'Fin de chantier',
    caption: 'Nettoyage après travaux',
  },
  {
    src: realisfour,
    title: 'Salle de bain',
    caption: 'Détartrage et remise en état',
  },
  {
    src: realisfive,
    title: 'Postes de travail',
    caption: 'Dépoussiérage et désinfection',
  },
  {
    src: realisesix,
    title: 'Postes de travail',
    caption: 'Dépoussiérage et désinfection',
  },
  {
    src: realiseseven,
    title: 'Bureaux',
    caption: 'Entretien régulier',
  },
  {
    src: realiseeit,
    title: 'Accueil / Hall',
    caption: 'Mise au propre quotidienne',
  },
];

export default function Realisations() {
  return (
    <section className="page real-page" aria-labelledby="real-title">
      <div className="card real-intro">
        <header className="real-header">
          <h2 id="real-title">Nos réalisations</h2>
          <p className="muted real-lead">
            Un aperçu de différents types d’interventions&nbsp;: bureaux, commerces, espaces
            communs, fin de chantier, remise en état. Vous pourrez ensuite remplacer ces visuels
            par vos propres photos avant / après.
          </p>
        </header>

        <div className="real-tags" aria-label="Types d’interventions">
          <span className="real-tag">Bureaux</span>
          <span className="real-tag">Commerces</span>
          <span className="real-tag">Copropriétés</span>
          <span className="real-tag">Fin de chantier</span>
          <span className="real-tag">Locations courte durée</span>
        </div>
      </div>

      <div className="card real-gallery-card">
        <div className="real-gallery" aria-label="Galerie de réalisations">
          {gallery.map((item, i) => (
            <figure className="real-item" key={i}>
              <div className="real-image-wrap">
                <img
                  src={item.src}
                  loading="lazy"
                  alt={`Réalisation +Propre – ${item.title}`}
                />
                <div className="real-overlay">
                  <div className="real-overlay-inner">
                    <span className="real-overlay-title">{item.title}</span>
                    <span className="real-overlay-caption">{item.caption}</span>
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
