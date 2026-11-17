import { ImageResponse } from 'next/og'

export const alt = '+Propre — entreprise de nettoyage professionnel à Strasbourg'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(165deg, #EAF8F5 0%, #F1FAF4 50%, #F7F9EF 100%)',
          color: '#0B1B3F',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 64, background: 'linear-gradient(200deg, #9DB2F5, #4D5BA6)' }} />
          <div style={{ fontSize: 48, fontWeight: 800, color: '#2346C2', letterSpacing: -2 }}>+PROPRE</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>La propreté,</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3, color: '#158F87' }}>notre engagement.</div>
          <div style={{ marginTop: 28, fontSize: 32, color: '#3A4660' }}>
            Nettoyage professionnel à Strasbourg · Devis gratuit sous 24h
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 26, color: '#0B1B3F' }}>
          <div style={{ padding: '10px 22px', borderRadius: 999, background: '#3BB273' }}>07 65 55 11 11</div>
          <div style={{ padding: '10px 22px', borderRadius: 999, background: 'white' }}>plus-propre.fr</div>
        </div>
      </div>
    ),
    size,
  )
}
