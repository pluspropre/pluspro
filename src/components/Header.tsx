import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiPhone, FiFacebook, FiInstagram } from 'react-icons/fi';
import './Header.css';
import logo from '../assets/unnamed.jpg';

export default function Header() {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <FiPhone className="topbar-icon" />
            <span className="topbar-text">Devis gratuit :</span>
            <a href="tel:0765551111" className="topbar-phone">
              07 65 55 11 11
            </a>
          </div>
          <div className="topbar-right">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
          </div>
        </div>
      </div>

      <nav className="mainnav">
        <div className="mainnav-inner">
          <div className="brand">
            <img src={logo} alt="+Propre" className="header-logo" />
            <div className="brand-text">
              <span className="brand-sub">Nettoyage professionnel · Grand-Est</span>
            </div>
          </div>

          <ul className="menu">
            <li>
              <NavLink end to="/" className="menu-link">
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/a-propos" className="menu-link">
                À propos
              </NavLink>
            </li>
            <li>
              <NavLink to="/realisations" className="menu-link">
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/devis" className="nav-cta">
                Demander un devis
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
