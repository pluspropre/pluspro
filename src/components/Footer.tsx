import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { BsGeoAlt } from 'react-icons/bs';
import './Footer.css';
import logo from '../assets/unnamed.jpg';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-block footer-block--brand">
          <div className="footer-brand">
            <img src={logo} alt="+Propre" className="footer-logo" />
            <div className="footer-brand-text">
              <span className="footer-brand-sub">Nettoyage professionnel · Grand-Est</span>
            </div>
          </div>
          <p className="footer-tagline">
            Entretien de bureaux, commerces et espaces de vie avec un suivi simple et clair.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">Devis sous 48h</span>
            <span className="footer-badge">Équipe formée & assurée</span>
          </div>
        </div>

        <div className="footer-block">
          <h4>Contact</h4>
          <ul className="footer-list footer-list--contact">
            <li>
              <span className="footer-icon-pill">
                <FiMail />
              </span>
              <a href="mailto:contact@plus-propre.fr">contact@plus-propre.fr</a>
            </li>
            <li>
              <span className="footer-icon-pill">
                <FiPhone />
              </span>
              <a href="tel:0765551111">07 65 55 11 11</a>
            </li>
            <li>
              <span className="footer-icon-pill">
                <BsGeoAlt />
              </span>
              <span>Grand-Est</span>
            </li>
          </ul>
        </div>

        <div className="footer-block footer-block--social">
          <h4>Réseaux</h4>
          <div className="footer-social">
            <a href="https://www.facebook.com/people/Pluspropre/61576653958810/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fpropre-nettoyage%2Fabout%2F%3FviewAsMember%3Dtrue" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiLinkedin />
            </a>
            <a href="https://www.instagram.com/plus_propre.fr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} +Propre</span>
      </div>
    </footer>
  );
}
