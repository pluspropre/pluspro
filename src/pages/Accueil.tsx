import React from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css';
import homeFirst from '../assets/woman2.png'
import consImg from '../assets/conseil.jpg'
import loveHands from '../assets/love.jpg'
import lebed from '../assets/lebed.jpg'
import equipe from '../assets/equipe.jpg'

export default function Accueil() {
  return (
    <>
      <section className="acc-hero">
        <div className="acc-hero__text">
          <div className="acc-hero__badge">
            <span className="acc-hero__badge-dot" />
            Nettoyage professionnel en Grand-Est
          </div>
          <h1 className="acc-hero__title">
            La propreté, notre engagement.
            <br />
            Votre confiance, notre fierté.
          </h1>
          <p className="acc-hero__lead">
            Des prestations de propreté claires, efficaces et conçues sur mesure pour répondre aux besoins de vos bureaux,
            commerces et espaces de vie. Nous mettons l’accent sur la qualité, la transparence et la régularité,
            afin de vous offrir un environnement sain, agréable et durablement propre, jour après jour.          </p>

          <div className="acc-hero__actions">
            <Link to="/devis" className="acc-btn acc-btn--primary">
              Obtenir un devis
            </Link>
            <a className="acc-btn acc-btn--soft" href="#tips">
              Conseils pratiques
            </a>
          </div>
        </div>

        <div className="acc-hero__art">
          <div className="acc-hero__art-card">
            <img src={homeFirst} alt="Équipe de nettoyage au travail" />
            <div className="acc-hero__badge-floating">
              <span>+Propre</span>
              <strong>Nettoyage sur mesure</strong>
            </div>
            <div className="acc-hero__stats">
              <div className="acc-hero__stat">
                <span className="acc-hero__stat-label">Disponibilité</span>
                <span className="acc-hero__stat-value">24/7</span>
              </div>
              <div className="acc-hero__stat">
                <span className="acc-hero__stat-label">Réponse devis</span>
                <span className="acc-hero__stat-value">48h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="acc-section acc-section--grid">
        <div className="acc-section__intro">
          <h2>Services de nettoyage</h2>
          <p>
            Des interventions adaptées à votre activité, en régulier ou ponctuel.
          </p>
        </div>
        <div className="acc-sections">
          <div className="acc-card">
            <div className="acc-card__head">
              <span className="acc-card__tag">Professionnels</span>
              <h3>Nettoyage et entretien</h3>
            </div>
            <ul className="acc-card__list">
              <li>Bureaux et open-spaces</li>
              <li>Cabinets médicaux</li>
              <li>Commerces et boutiques</li>
              <li>Copropriétés</li>
              <li>Locations courte durée</li>
              <li>Fins de bail / chantier</li>
            </ul>
          </div>

          <div className="acc-card">
            <div className="acc-card__head">
              <span className="acc-card__tag acc-card__tag--green">Qualité</span>
              <h3>Nos engagements</h3>
            </div>
            <ul className="acc-card__list">
              <li>Plans de passage précis</li>
              <li>Produits adaptés, écolabellisés si pertinent</li>
              <li>Créneaux souples, du ponctuel au quotidien</li>
              <li>Équipe formée, déclarée et assurée</li>
            </ul>
          </div>

          <div className="acc-card">
            <div className="acc-card__head">
              <span className="acc-card__tag acc-card__tag--blue">Zones</span>
              <h3>Zones d’intervention</h3>
            </div>
            <p className="acc-card__text">
              Strasbourg et alentours, avec devis détaillé sous 48h.
            </p>
            <div className="acc-kpi">
              <div className="acc-kpi__item">
                <div className="acc-kpi__big">24/7</div>
                <span>Flexibilité</span>
              </div>
              <div className="acc-kpi__item">
                <div className="acc-kpi__big">48h</div>
                <span>Devis</span>
              </div>
              <div className="acc-kpi__item">
                <div className="acc-kpi__big">100%</div>
                <span>Satisfaction visée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="acc-section acc-why">
        <div className="acc-section__intro">
          <h2>Pourquoi +Propre&nbsp;?</h2>
          <p>
            Un partenaire fiable, joignable et structuré pour vos locaux.
          </p>
        </div>
        <div className="acc-why__grid">
          <div className="acc-why__item">
            <div className="acc-why__image">
              <img
                src={loveHands}
                alt="Suivi du nettoyage dans des bureaux"
              />
            </div>
            <h3>Suivi clair</h3>
            <p>
              Contrôles réguliers et échanges simples pour garder un niveau de qualité constant.
            </p>
          </div>
          <div className="acc-why__item">
            <div className="acc-why__image acc-why__image--green">
              <img
                src={lebed}
                alt="Nettoyage sur mesure de locaux professionnels"
              />
            </div>
            <h3>Sur mesure</h3>
            <p>
              Fréquences, horaires et périmètre définis avec vous, selon votre activité.
            </p>
          </div>
          <div className="acc-why__item">
            <div className="acc-why__image acc-why__image--blue">
              <img
                src={equipe}
                alt="Équipe de nettoyage réactive"
              />
            </div>
            <h3>Réactif</h3>
            <p>
              Devis rapide et capacité d’intervention en cas de besoin ponctuel.
            </p>
          </div>
        </div>
      </section>

      <section className="acc-section acc-process">
        <div className="acc-section__intro">
          <h2>Un processus simple</h2>
          <p>
            Trois étapes pour démarrer une collaboration propre et sereine.
          </p>
        </div>

        <div className="acc-process__track">
          <div className="acc-process__line" />
          <div className="acc-process__step">
            <div className="acc-process__label">Demande de devis</div>
            <div className="acc-process__circle">1</div>
            <p>
              Vous décrivez vos locaux et vos contraintes via notre formulaire.
            </p>
          </div>
          <div className="acc-process__step">
            <div className="acc-process__label">Analyse et proposition</div>
            <div className="acc-process__circle">2</div>
            <p>
              Nous ajustons le planning et les moyens, avec visite si besoin.
            </p>
          </div>
          <div className="acc-process__step">
            <div className="acc-process__label">Lancement de la mission</div>
            <div className="acc-process__circle">3</div>
            <p>
              Mise en place de l’équipe et suivi régulier des interventions.
            </p>
          </div>
        </div>
      </section>


      <section className="acc-section acc-tips" id="tips">
        <div className="acc-section__intro">
          <h2>Conseils pratiques</h2>
          <p>
            Quelques réflexes simples pour garder vos espaces propres plus longtemps.
          </p>
        </div>
        <div className="acc-tips__layout">
          <div className="acc-tips__content">
            <h3>Trois réflexes à adopter</h3>
            <p>
              Quelques ajustements du quotidien suffisent souvent à prolonger l’effet du nettoyage professionnel.
            </p>
            <ul>
              <li>
                <strong>Zones prioritaires&nbsp;:</strong> accueil, sanitaires, cuisine à intégrer systématiquement
                dans le plan de nettoyage.
              </li>
              <li>
                <strong>Espaces rangés&nbsp;:</strong> moins d’objets au sol et sur les plans de travail,
                nettoyage plus rapide et plus efficace.
              </li>
              <li>
                <strong>Petites habitudes&nbsp;:</strong> vider les poubelles sensibles, essuyer vite un liquide,
                garder les points d’eau dégagés.
              </li>
            </ul>
          </div>
          <div className="acc-tips__visual">
            <div className="acc-tips__visual-inner">
              <img
                src={consImg}
                alt="Conseils pour garder des bureaux propres"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="acc-section acc-cta-band">
        <div className="acc-cta-band__inner">
          <div className="acc-cta-band__text">
            <h2>Parlons de vos besoins de nettoyage</h2>
            <p>
              Décrivez-nous vos locaux en quelques clics, nous revenons vers vous avec un devis clair.
            </p>
          </div>
          <div className="acc-cta-band__actions">
            <Link to="/contact" className="acc-btn acc-btn--primary acc-btn--light">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
