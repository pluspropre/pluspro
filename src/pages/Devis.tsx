import React, { useState } from 'react';
import './Devis.css';

type Form = Record<string, string>;
type Errors = Record<string, string>;

const initialForm: Form = {
  'Type de Client': '',
  'Nom de la Société': '',
  'Statut/Fonction': '',
  'Nom et Prénom': '',
  'Adresse E-mail': '',
  'Numéro de Téléphone': '',
  'Adresse du site d’intervention': '',
  'Type de local/bâtiment': '',
  'Activité principale sur le site': '',
  'Surface totale (m²)': '',
  'Sanitaires / WC (nb)': '',
  'Cuisines / Kitchenettes (nb)': '',
  'Bureaux / Salles de réunion (nb)': '',
  'Surface vitrée (type/estimation)': '',
  'Accessibilité (ascenseur, sécurité...)': '',
  'Fréquence souhaitée': '',
  'Message complémentaire': ''
};

const stepTitles: Record<number, string> = {
  1: 'Identification du demandeur',
  2: 'Détails du site',
  3: 'Caractéristiques du nettoyage',
  4: 'Besoins et fréquence'
};

const stepFields: Record<number, string[]> = {
  1: ['Type de Client', 'Nom et Prénom', 'Adresse E-mail', 'Numéro de Téléphone'],
  2: ['Adresse du site d’intervention', 'Type de local/bâtiment'],
  3: ['Surface totale (m²)'],
  4: ['Fréquence souhaitée']
};

const FORM_ENDPOINT = 'https://formspree.io/f/mzzyzkjq';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+().\s-]{6,20}$/;

export default function Devis() {
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const isPro = form['Type de Client'] === 'Professionnel';

  const onChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError('');
    setSubmitError('');
  };

  const validateFields = (fields: string[]): Errors => {
    const nextErrors: Errors = {};
    fields.forEach(key => {
      const value = form[key]?.trim() ?? '';
      if (!value) {
        nextErrors[key] = 'Ce champ est obligatoire.';
        return;
      }
      if (key === 'Adresse E-mail') {
        if (!emailRegex.test(value)) {
          nextErrors[key] = 'Veuillez saisir une adresse e-mail valide.';
        }
      }
      if (key === 'Numéro de Téléphone') {
        if (!phoneRegex.test(value)) {
          nextErrors[key] = 'Veuillez saisir un numéro de téléphone valide.';
        }
      }
      if (key === 'Surface totale (m²)') {
        const surface = Number(value.replace(',', '.'));
        if (!Number.isFinite(surface) || surface <= 0) {
          nextErrors[key] = 'Veuillez saisir une surface supérieure à 0.';
        }
      }
    });
    return nextErrors;
  };

  const validateAll = (): Errors => {
    const allRequired = [
      'Type de Client',
      'Nom et Prénom',
      'Adresse E-mail',
      'Numéro de Téléphone',
      'Adresse du site d’intervention',
      'Type de local/bâtiment',
      'Surface totale (m²)',
      'Fréquence souhaitée'
    ];
    return validateFields(allRequired);
  };

  const goToNextStep = (currentStep: number) => {
    const currentFields = stepFields[currentStep] || [];
    const stepErrors = validateFields(currentFields);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...stepErrors }));
      setFormError('Merci de corriger les champs indiqués en rouge.');
      return;
    }
    setFormError('');
    setStep(currentStep + 1);
  };

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    setFormError('');
    setSubmitError('');
    const newErrors = validateAll();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError('Merci de vérifier les champs obligatoires avant l’envoi.');
      setStep(1);
      return;
    }
    setSending(true);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          ...form,
          source: '+Propre site web',
          step: step
        })
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError("Une erreur est survenue lors de l'envoi. Veuillez réessayer dans quelques instants.");
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setStep(1);
    setSubmitted(false);
    setSending(false);
    setErrors({});
    setFormError('');
    setSubmitError('');
  };

  if (submitted) {
    return (
      <div className="devis-success">
        <div className="devis-success-inner">
          <div className="success-icon">
            <span className="checkmark">✓</span>
          </div>
          <h3>Votre demande de devis a été envoyée</h3>
          <p>Merci pour votre confiance. Nous vous répondrons dans les plus brefs délais.</p>
          <button type="button" className="btn secondary" onClick={resetForm}>
            Envoyer un autre devis
          </button>
        </div>
      </div>
    );
  }

  const progress = (step / 4) * 100;

  const getFieldClass = (key: string) => (errors[key] ? 'col field-error' : 'col');

  return (
    <section className="page devis-page">
      <div className="card devis-intro">
        <h2>Demande de devis</h2>
        <p className="muted devis-lead">
          Expliquez-nous votre besoin en quelques étapes. Plus les informations sont précises,
          plus nous pouvons vous proposer une estimation adaptée à vos locaux et à votre activité.
        </p>
        <div className="devis-highlights">
          <span className="devis-pill">Devis détaillé sous 48h</span>
          <span className="devis-pill">Sans engagement au départ</span>
          <span className="devis-pill">Pour professionnels et particuliers</span>
        </div>
      </div>

      <form className="frm multi-step-form" onSubmit={onSubmit} noValidate>
        <div className="devis-steps">
          <div className="devis-steps-header">
            <span className="devis-steps-count">Étape {step} sur 4</span>
            <span className="devis-steps-title">{stepTitles[step]}</span>
          </div>
          <div className="devis-steps-bar">
            <div className="devis-steps-bar-inner" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === 1 && (
          <fieldset className="card active">
            <legend>I. Identification du Demandeur</legend>
            <div className="row">
              <label className={getFieldClass('Type de Client')}>
                <span className="label-text">Type de Client*</span>
                <select
                  required
                  value={form['Type de Client']}
                  onChange={e => onChange('Type de Client', e.target.value)}
                >
                  <option value="">Choisir…</option>
                  <option>Professionnel</option>
                  <option>Particulier</option>
                </select>
                {errors['Type de Client'] && (
                  <div className="field-error-message">{errors['Type de Client']}</div>
                )}
              </label>

              {isPro && (
                <>
                  <label className={getFieldClass('Nom de la Société')}>
                    <span className="label-text">Nom de la Société</span>
                    <input
                      value={form['Nom de la Société']}
                      onChange={e => onChange('Nom de la Société', e.target.value)}
                    />
                  </label>
                  <label className={getFieldClass('Statut/Fonction')}>
                    <span className="label-text">Statut/Fonction </span>
                    <input
                      value={form['Statut/Fonction']}
                      onChange={e => onChange('Statut/Fonction', e.target.value)}
                    />
                  </label>
                </>
              )}

              <label className={getFieldClass('Nom et Prénom')}>
                <span className="label-text">Nom et Prénom*</span>
                <input
                  required
                  value={form['Nom et Prénom']}
                  onChange={e => onChange('Nom et Prénom', e.target.value)}
                />
                {errors['Nom et Prénom'] && (
                  <div className="field-error-message">{errors['Nom et Prénom']}</div>
                )}
              </label>
              <label className={getFieldClass('Adresse E-mail')}>
                <span className="label-text">Adresse E-mail*</span>
                <input
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form['Adresse E-mail']}
                  onChange={e => onChange('Adresse E-mail', e.target.value)}
                />
                {errors['Adresse E-mail'] && (
                  <div className="field-error-message">{errors['Adresse E-mail']}</div>
                )}
              </label>
              <label className={getFieldClass('Numéro de Téléphone')}>
                <span className="label-text">Numéro de Téléphone*</span>
                <input
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  value={form['Numéro de Téléphone']}
                  onChange={e => onChange('Numéro de Téléphone', e.target.value)}
                />
                {errors['Numéro de Téléphone'] && (
                  <div className="field-error-message">{errors['Numéro de Телефон']}</div>
                )}
              </label>
            </div>
            {formError && (
              <div className="form-error-message">{formError}</div>
            )}
            <div className="actions">
              <button
                type="button"
                className="btn primary"
                onClick={() => goToNextStep(1)}
              >
                Suivant →
              </button>
            </div>
          </fieldset>
        )}


        {step === 2 && (
          <fieldset className="card active">
            <legend>II. Détails du Site</legend>
            <div className="row">
              <label className={getFieldClass('Adresse du site d’intervention')}>
                <span className="label-text">Adresse Postale Complète*</span>
                <input
                  required
                  placeholder="Rue, Code Postal, Ville"
                  value={form['Adresse du site d’intervention']}
                  onChange={e => onChange('Adresse du site d’intervention', e.target.value)}
                />
                {errors['Adresse du site d’intervention'] && (
                  <div className="field-error-message">
                    {errors['Adresse du site d’intervention']}
                  </div>
                )}
              </label>
              <label className={getFieldClass('Type de local/bâtiment')}>
                <span className="label-text">Type de Local/Bâtiment*</span>
                <input
                  required
                  placeholder="Bureau, Commerce, Domicile…"
                  value={form['Type de local/bâtiment']}
                  onChange={e => onChange('Type de local/bâtiment', e.target.value)}
                />
                {errors['Type de local/bâtiment'] && (
                  <div className="field-error-message">
                    {errors['Type de local/bâtiment']}
                  </div>
                )}
              </label>
              <label className={getFieldClass('Activité principale sur le site')}>
                <span className="label-text">Activité Principale</span>
                <input
                  placeholder="Ex: Agence, Restaurant…"
                  value={form['Activité principale sur le site']}
                  onChange={e => onChange('Activité principale sur le site', e.target.value)}
                />
              </label>
            </div>
            {formError && (
              <div className="form-error-message">{formError}</div>
            )}
            <div className="actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setStep(1)}
              >
                ← Précédent
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => goToNextStep(2)}
              >
                Suivant →
              </button>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="card active">
            <legend>III. Caractéristiques du Nettoyage</legend>
            <div className="row">
              <label className={getFieldClass('Surface totale (м²)')}>
                <span className="label-text">Surface Totale (m²)*</span>
                <input
                  required
                  type="number"
                  min={1}
                  value={form['Surface totale (m²)']}
                  onChange={e => onChange('Surface totale (m²)', e.target.value)}
                />
                {errors['Surface totale (m²)'] && (
                  <div className="field-error-message">
                    {errors['Surface totale (m²)']}
                  </div>
                )}
              </label>
              <label className={getFieldClass('Sanitaires / WC (nb)')}>
                <span className="label-text">Sanitaires / WC (nb)</span>
                <input
                  type="number"
                  min={0}
                  value={form['Sanitaires / WC (nb)']}
                  onChange={e => onChange('Sanitaires / WC (nb)', e.target.value)}
                />
              </label>
              <label className={getFieldClass('Cuisines / Kitchenettes (nb)')}>
                <span className="label-text">Cuisines / Kitchenettes (nb)</span>
                <input
                  type="number"
                  min={0}
                  value={form['Cuisines / Kitchenettes (nb)']}
                  onChange={e => onChange('Cuisines / Kitchenettes (nb)', e.target.value)}
                />
              </label>
              <label className={getFieldClass('Bureaux / Salles de réunion (nb)')}>
                <span className="label-text">Bureaux / Salles de réunion (nb)</span>
                <input
                  type="number"
                  min={0}
                  value={form['Bureaux / Salles de réunion (nb)']}
                  onChange={e => onChange('Bureaux / Salles de réunion (nb)', e.target.value)}
                />
              </label>
              <label className={getFieldClass('Surface vitrée (type/estimation)')}>
                <span className="label-text">Surface vitrée</span>
                <input
                  placeholder="Simple/double, vitrine…"
                  value={form['Surface vitrée (type/estimation)']}
                  onChange={e => onChange('Surface vitrée (type/estimation)', e.target.value)}
                />
              </label>
              <label className={getFieldClass('Accessibilité (ascenseur, sécurité...)')}>
                <span className="label-text">Accessibilité</span>
                <input
                  placeholder="Ascenseur, parking…"
                  value={form['Accessibilité (ascenseur, sécurité...)']}
                  onChange={e =>
                    onChange('Accessibilité (ascenseur, sécurité...)', e.target.value)
                  }
                />
              </label>
            </div>
            {formError && (
              <div className="form-error-message">{formError}</div>
            )}
            <div className="actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setStep(2)}
              >
                ← Précédent
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => goToNextStep(3)}
              >
                Suivant →
              </button>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="card active">
            <legend>IV. Besoins et Fréquence</legend>
            <div className="row">
              <label className={getFieldClass('Fréquence souhaitée')}>
                <span className="label-text">Fréquence d&apos;Intervention*</span>
                <select
                  required
                  value={form['Fréquence souhaitée']}
                  onChange={e => onChange('Fréquence souhaitée', e.target.value)}
                >
                  <option value="">Choisir…</option>
                  <option>Ponctuelle</option>
                  <option>Régulière — Quotidienne</option>
                  <option>Régulière — 3 fois/semaine</option>
                  <option>Régulière — Hebdomadaire</option>
                  <option>Régulière — Bimensuelle</option>
                  <option>Régulière — Mensuelle</option>
                </select>
                {errors['Fréquence souhaitée'] && (
                  <div className="field-error-message">
                    {errors['Fréquence souhaitée']}
                  </div>
                )}
              </label>
              <label className="col col-span-2">
                <span className="label-text">Message complémentaire</span>
                <textarea
                  rows={4}
                  value={form['Message complémentaire']}
                  onChange={e => onChange('Message complémentaire', e.target.value)}
                />
              </label>
            </div>
            {formError && (
              <div className="form-error-message">{formError}</div>
            )}
            {submitError && (
              <div className="form-error-message form-error-message-danger">
                {submitError}
              </div>
            )}
            <div className="actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setStep(3)}
              >
                ← Précédent
              </button>
              <button
                type="submit"
                className="btn primary"
                disabled={sending}
              >
                {sending ? 'Envoi en cours…' : 'Demander un devis'}
              </button>
            </div>
          </fieldset>
        )}
      </form>
    </section>
  );
}
