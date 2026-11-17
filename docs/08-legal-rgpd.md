# 08 — Legal & RGPD

French law requires a legal notice (LCEN art. 6 III) and GDPR information for any site collecting personal data. The
quote form collects name, email, phone, address/postal code. Texts are **prepared by us and validated by the client**;
they are not legal advice — recommend the client has them reviewed if in doubt.

Never invent identifiers. Use `[À COMPLÉTER : …]` placeholders and track them in `01` §4. Store texts in
`src/content/legal/*.ts` (or MDX) with a `lastUpdated` date displayed on the page.

## 1. Mentions légales `/mentions-legales`

Sections:
1. **Éditeur du site**: +Propre — `[À COMPLÉTER : raison sociale et forme juridique (EI, SASU, SARL…)]`,
   `[capital social si société]`, siège: 7 Rue de Koenigshoffen, 67000 Strasbourg; SIRET 992 924 944 00018;
   `[RCS / RNE / Répertoire des métiers + ville]`; TVA intracommunautaire FR01992924944; téléphone 07 65 55 11 11;
   e-mail contact@plus-propre.fr.
2. **Directeur de la publication**: `[À COMPLÉTER : nom]`.
3. **Hébergement**: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — https://vercel.com
   (verify current address on vercel.com/legal before launch). Database & storage: Supabase Inc. (data hosted in the
   EU region chosen — state it).
4. **Conception et réalisation du site**: Amir Azdoyev EI (web developer) — optional, client's choice.
5. **Propriété intellectuelle**: content, photos, logo belong to +Propre; reproduction forbidden without permission.
6. **Responsabilité / liens externes**.
7. **Données personnelles**: link to the privacy policy.
8. **Crédits photos**: "Photos : +Propre" (no stock photos).

## 2. Politique de confidentialité `/politique-de-confidentialite`

Structure (with a table of contents):
1. Responsable du traitement: identity + contact (contact@plus-propre.fr).
2. Données collectées: via the quote form (identity, contact details, company/function, address/postal code,
   description of premises and needs, message, consent timestamp); technical data (anonymous audience measurement via
   Vercel Web Analytics — no cookies, no cross-site tracking); admin accounts (email, login logs).
3. Finalités & bases légales:
   - Traiter la demande de devis et y répondre → **mesures précontractuelles** (art. 6.1.b RGPD).
   - Suivi commercial des prospects (relance raisonnable) → **intérêt légitime** (art. 6.1.f).
   - Sécurité du site, anti-spam (Turnstile) → intérêt légitime.
   - Mesure d'audience anonyme → intérêt légitime / exemption CNIL (cookie-less).
4. Destinataires: the +Propre team; subprocessors: Vercel (hébergement), Supabase (base de données, stockage), Resend
   (envoi d'e-mails), Cloudflare (Turnstile anti-spam). No sale of data.
5. Transferts hors UE: Vercel, Resend, Cloudflare are US companies → transfers covered by the EU-US Data Privacy
   Framework and/or Standard Contractual Clauses; Supabase data in EU region.
6. Durées de conservation: prospects (quote requests without a contract) **3 years from the last contact** (CNIL
   reference); client data for the contract duration + legal retention periods (accounting 10 years — handled outside
   the website); admin account data while the account is active; analytics aggregated only.
7. Droits: access, rectification, erasure, restriction, objection, portability, post-mortem directives; how to exercise
   (email, response within one month); right to lodge a complaint with the **CNIL** (www.cnil.fr).
8. Cookies et traceurs: list (see §3) and how to change choices ("Gestion des cookies" link).
9. Sécurité: HTTPS, access restricted to authorised staff, RLS, etc. (general wording).
10. Date de mise à jour.

## 3. Cookies & consent (CNIL guidelines)

Inventory of what the site sets:

| Name / tool | Purpose | Consent needed? |
|---|---|---|
| `pp_consent` (first-party) | Stores the visitor's consent choices, 6 months | No (strictly necessary) |
| Supabase auth cookies (`sb-…`) | Admin session, `/admin` only | No (strictly necessary) |
| Cloudflare Turnstile | Anti-spam on the quote form | No (security, strictly necessary) — mention it |
| Vercel Web Analytics / Speed Insights | Anonymous audience & performance measurement, **no cookies** | Generally exempt; list it transparently |
| Google Maps embed (À propos) | Show the zone map | **Yes** — "Contenus externes" |
| Instagram / video embeds (if ever added) | External content | **Yes** — "Contenus externes" |

Banner requirements (implement as own lightweight component — no third-party CMP script):
- Shown on first visit **only if** a consent-requiring category exists on the site (it does, once the map is added;
  the quote requires a banner anyway). Bottom-left card, not a wall; doesn't block reading.
- Buttons **"Tout accepter"**, **"Tout refuser"** (same visual weight), and "Personnaliser" (toggles per category).
  Closing the banner (×) = refuse.
- No consent-requiring content loaded before consent. External embeds show a placeholder with "Afficher la carte
  (Google Maps dépose des cookies)" that loads on click and records consent for that category.
- Choice stored 6 months (`pp_consent` with version + timestamp); re-asked after expiry or when the policy version changes.
- "Gestion des cookies" link in the footer reopens the preferences.
- Expose a small `useConsent()` hook + `ConsentGate` component for embeds.

## 4. Quote form compliance

- Consent checkbox, **unchecked by default**, required: "J'accepte que +Propre utilise ces informations pour traiter
  ma demande de devis et me recontacter. En savoir plus dans notre [politique de confidentialité]."
- Information notice under the submit button (short): who processes, why, retention, rights, link.
- Store `consent_at` and `consent_version` (e.g. `2026-11-v1`) with the lead.
- Collect only what's needed (minimisation): exact street address is **optional**; postal code + city required.
- Confirmation email contains no marketing.

## 5. Data lifecycle (implemented in admin)

- Admin can delete a lead (right to erasure) and export leads (CSV) for the client's CRM.
- Retention job: monthly (Supabase `pg_cron` or Vercel Cron) delete/anonymise `quote_requests` with
  `coalesce(last_contact_at, created_at) < now() - interval '3 years'` and status not `won`.
- Spam-marked leads deleted after 30 days.
- No personal data in logs or analytics events (send `type` only, never email/phone).
