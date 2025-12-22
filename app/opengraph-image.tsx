import { ImageResponse } from 'next/og';

// Configuración de la imagen
export const runtime = 'edge';
export const alt = 'SocialBoost Perú - Compra Seguidores, Likes y Vistas para Todas las Redes';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // CAMBIO AQUÍ: En vez de 'center', usamos 'flex-start' y padding para subirlo
          justifyContent: 'flex-start',
          paddingTop: 70, // Esto sube todo el bloque de contenido
          backgroundColor: '#020617', // Slate-950
          // Un fondo sutil degradado morado oscuro
          backgroundImage: 'radial-gradient(circle at 50% 100%, #581c87 0%, #020617 50%)', 
          fontFamily: 'sans-serif',
          position: 'relative', // Necesario para el footer absoluto
        }}
      >
        {/* Decoración de Fondo (Líneas sutiles) */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.2,
          }}
        />

        {/* Badge Superior */}
        <div
          style={{
            display: 'flex',
            padding: '8px 24px',
            borderRadius: '50px',
            border: '1px solid rgba(168, 85, 247, 0.5)', // Borde Morado
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            color: '#e9d5ff', // Purple-200
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '0.1em',
            marginBottom: 30,
            textTransform: 'uppercase',
          }}
        >
          La Plataforma #1 en Perú
        </div>

        {/* Título Principal con Gradiente */}
        <div
          style={{
            display: 'flex',
            fontSize: 90,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            lineHeight: 1,
            color: 'white',
            marginBottom: 20,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ 
            backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)', // Pink -> Purple -> Cyan
            backgroundClip: 'text',
            color: 'transparent',
            paddingBottom: 10,
          }}>
            SocialBoost.pe
          </span>
        </div>

        {/* Subtítulo descriptivo */}
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8', // Slate-400
            textAlign: 'center',
            maxWidth: '900px',
            fontWeight: 500,
          }}
        >
          Seguidores • Likes • Vistas • Comentarios
        </div>

        {/* Redes Sociales */}
        <div
          style={{
            display: 'flex',
            marginTop: 45, // Un poco más de espacio aquí
            gap: '25px',
            fontSize: 22,
            color: 'white',
            fontWeight: 'bold',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#00f2ea' }} />
             TikTok
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#e1306c' }} />
             Instagram
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#1877f2' }} />
             Facebook
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF0000' }} />
             YouTube
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#53FC18' }} />
             Kick
          </div>
        </div>

        {/* Footer: Métodos de Pago (Permanece fijo abajo) */}
        <div
           style={{
             position: 'absolute',
             bottom: 35, // Un poco más pegado al borde inferior
             display: 'flex',
             alignItems: 'center',
             gap: 15,
             fontSize: 20,
             color: '#cbd5e1',
           }}
        >
          <span>Aceptamos:</span>
          <span style={{ backgroundColor: '#752384', color: 'white', padding: '4px 12px', borderRadius: 8, fontWeight: 'bold' }}>Yape</span>
          <span style={{ backgroundColor: '#00c6bc', color: 'white', padding: '4px 12px', borderRadius: 8, fontWeight: 'bold' }}>Plin</span>
          <span style={{ border: '1px solid white', padding: '4px 12px', borderRadius: 8 }}>Tarjetas</span>
        </div>

      </div>
    ),
    {
      ...size,
    }
  );
}