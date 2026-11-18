import { services } from '@/content/services'
import { ChevronDown } from '@/components/ui/icons'
import { Button } from '@/components/ui/Button'
import { frequencyOptions } from '@/lib/validation/quote'

/** Plain GET form to /devis: works without JS and pre-fills the funnel (docs/05 §4.8). */
export function QuoteBar() {
  return (
    <form className="quote" action="/devis" method="get" aria-label="Commencer une demande de devis" data-quote-bar>
      <span className="quote-glow" aria-hidden />
      <div className="quote-lab">
        VOTRE DEVIS
        <br />
        EN 24H
      </div>
      <div className="field">
        <label htmlFor="q-type">Type de locaux</label>
        <select id="q-type" name="type" defaultValue="bureaux">
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>
      <div className="field">
        <label htmlFor="q-surf">Surface (m²)</label>
        <input id="q-surf" name="surface" inputMode="numeric" pattern="[0-9]*" placeholder="ex. 250" autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="q-freq">Fréquence</label>
        <select id="q-freq" name="frequence" defaultValue="hebdomadaire">
          {frequencyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>
      <Button type="submit" className="mag">
        Continuer ma demande
      </Button>
    </form>
  )
}
