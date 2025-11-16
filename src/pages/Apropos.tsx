import React, { useState } from 'react';
import './Apropos.css';
import equipesecond from '../assets/equip2.jpeg';
import equipe from '../assets/equipe.jpg';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    id: 'devis',
    question: 'Comment se passe une demande de devis ?',
    answer:
      'Vous nous expliquez votre besoin via le formulaire ou par téléphone. Nous recueillons les infos clés (type de locaux, surface, fréquence souhaitée) et vous envoyons un devis détaillé, en général sous 48h.'
  },
  {
    id: 'visite',
    question: 'Faites-vous une visite sur place ?',
    answer:
      'Pour les surfaces importantes ou les situations spécifiques (chantier, médical, copropriété), une visite permet d’ajuster le temps d’intervention, les moyens et le planning.'
  },
  {
    id: 'produits',
    question: 'Quels produits utilisez-vous ?',
    answer:
      'Nous utilisons des produits professionnels adaptés aux surfaces et aux usages, avec une sélection écolabellisée lorsque c’est pertinent et compatible avec les contraintes du site.'
  },
  {
    id: 'horaires',
    question: 'Pouvez-vous intervenir en dehors des horaires d’ouverture ?',
    answer:
      'Oui. Selon vos besoins, nous pouvons intervenir tôt le matin, en soirée ou le week-end afin de limiter l’impact sur votre activité et sur le confort de vos équipes ou de vos clients.'
  },
  {
    id: 'engagement',
    question: 'Y a-t-il un engagement de durée ?',
    answer:
      'Pour les contrats réguliers, une durée minimale peut être prévue. La fréquence et le périmètre peuvent ensuite être ajustés si votre activité évolue ou si vos besoins changent.'
  },
  {
    id: 'urgent',
    question: 'Que faire en cas de besoin ponctuel urgent ?',
    answer:
      'Contactez-nous directement par téléphone ou via le formulaire en précisant le caractère urgent. Nous regardons nos disponibilités et proposons un passage ponctuel dès que possible.'
  }
];

export default function Apropos() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section
      className="page apropos-page"
      aria-labelledby="apropos-title"
    >
      {/* Hero */}
      <div className="card apropos-hero">
        <div className="apropos-hero-bg" aria-hidden="true" />

        <div className="apropos-hero-layout">
          <div className="apropos-hero-text">
            <p className="apropos-kicker">Nettoyage professionnel & résidentiel</p>
            <h2 id="apropos-title">À propos de +Propre</h2>

            <p className="apropos-lead">
              +Propre est une équipe agile dédiée au nettoyage professionnel et résidentiel.
              Notre objectif&nbsp;: des espaces propres, sains et accueillants, avec une
              organisation simple pour vous.
            </p>

            <div className="apropos-points">
              <div className="apropos-point">
                <h4>Écoute et analyse</h4>
                <p>
                  Nous partons de votre réalité&nbsp;: type de locaux, contraintes horaires, zones
                  sensibles, attentes en termes de fréquence et de résultat.
                </p>
              </div>
              <div className="apropos-point">
                <h4>Protocole et régularité</h4>
                <p>
                  Des plans de passage clairs, une équipe briefée et des contrôles réguliers pour
                  garantir un niveau constant.
                </p>
              </div>
            </div>

            <div className="apropos-stats">
              <div className="apropos-stat">
                <span className="apropos-stat-number">+120</span>
                <span className="apropos-stat-label">sites suivis chaque année</span>
              </div>
              <div className="apropos-stat">
                <span className="apropos-stat-number">24h</span>
                <span className="apropos-stat-label">délai moyen de réponse</span>
              </div>
              <div className="apropos-stat">
                <span className="apropos-stat-number">7j/7</span>
                <span className="apropos-stat-label">plages d’intervention possibles</span>
              </div>
            </div>
          </div>

          <div className="apropos-hero-visual" aria-hidden="true">
            <div className="apropos-photo-main">
              <img
                src={equipesecond}
                loading="lazy"
                alt="Équipe de nettoyage au travail"
              />
            </div>

            <div className="apropos-photo-small">
              <img
                src={equipe}
                loading="lazy"
                alt="Détail de nettoyage"
              />
            </div>

            <div className="apropos-floating-note">
              <span className="apropos-note-dot" />
              <span className="apropos-note-text">
                Interventions planifiées & contrôles réguliers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Valeurs */}
      <div className="card apropos-values">
        <div className="apropos-section-header">
          <h3>Nos priorités sur le terrain</h3>
          <p>
            Une approche structurée, mais humaine, pour que vos locaux restent propres sans que
            vous ayez à vous en préoccuper au quotidien.
          </p>
        </div>

        <div className="apropos-values-grid">
          <div className="apropos-value-card">
            <h4>Hygiène médicale</h4>
            <p>
              Procédures renforcées pour cabinets et zones sensibles, gestion des points de
              contact et respect des consignes propres à chaque structure.
            </p>
          </div>
          <div className="apropos-value-card">
            <h4>Rigueur &amp; traçabilité</h4>
            <p>
              Plans de passage, horaires définis, possibilité de retours réguliers et ajustements
              si votre organisation évolue.
            </p>
          </div>
          <div className="apropos-value-card">
            <h4>Respect des surfaces</h4>
            <p>
              Produits et méthodes adaptés à chaque matériau, avec recours aux produits
              écolabellisés lorsque c’est pertinent et efficace.
            </p>
          </div>
          <div className="apropos-value-card">
            <h4>Relation continue</h4>
            <p>
              Un interlocuteur identifié, joignable, pour centraliser vos demandes et suivre la
              qualité des prestations.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card apropos-faq">
        <div className="apropos-section-header apropos-faq-header">
          <h3>Questions fréquentes</h3>
          <p>
            Quelques réponses rapides. Pour toute situation particulière, nous restons disponibles
            pour échanger directement.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map(item => {
            const isOpen = openId === item.id;
            const answerId = `faq-answer-${item.id}`;

            return (
              <div
                key={item.id}
                className={`faq-item${isOpen ? ' faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-toggle" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={answerId}
                  className={`faq-answer${isOpen ? ' faq-answer--open' : ''}`}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
