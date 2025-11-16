import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Apropos from './pages/Apropos';
import Realisations from './pages/Realisations';
import Contact from './pages/Devis';
import Header from './components/Header';
import Footer from './components/Footer';
import Devis from './pages/Devis';

const tabs = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos de nous' },
  { to: '/realisations', label: 'Nos réalisations' },
  { to: '/contact', label: 'Contactez-nous' },
];

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="wrap-light">
      <Header/>

      <main className="main" data-page={pathname}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/a-propos" element={<Apropos />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/devis" element={<Devis />} />
        </Routes>
      </main>

      <Footer/>
    </div>
  );
}
