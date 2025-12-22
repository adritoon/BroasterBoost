import { ImageResponse } from 'next/og';

// Configuración de la imagen
export const runtime = 'edge';
export const alt = 'SocialBoost Perú - Compra Seguidores, Likes y Vistas con Yape';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// --- ÍCONOS SVG (Redes Sociales - Versión Grande 48px) ---
const TikTokIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="#00f2ea"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v10.13c0 1.63-.42 3.26-1.32 4.65-1.32 1.93-3.5 3.12-5.82 3.12-3.96 0-7.17-3.21-7.17-7.17 0-3.96 3.21-7.17 7.17-7.17.37 0 .74.03 1.1.08v4.07c-.19-.02-.39-.04-.59-.04-1.73 0-3.13 1.4-3.13 3.13s1.4 3.13 3.13 3.13c1.71 0 3.1-1.38 3.12-3.09V5.82c0-1.57-.02-3.14-.02-4.71.56-.38 1.1-.81 1.56-1.32.58-.62.99-1.37 1.21-2.18.24-.88.36-1.8.36-2.72H12.525z"/></svg>
);
const InstagramIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="#E1306C"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/></svg>
);
const FacebookIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="#1877F2"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
);
const YoutubeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const KickIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="#53FC18"><path d="M21.562 2H2.438C1.094 2 0 3.094 0 4.438v15.124C0 20.906 1.094 22 2.438 22h19.124C22.906 22 24 20.906 24 19.562V4.438C24 3.094 22.906 2 21.562 2zM10.125 8.625v7.75H7.75v-7.75h2.375zm7.375 7.75h-2.375l-3.5-3.875v3.875H9.25v-8.75h2.375v3l3.375-3.875H17.5l-3.875 4.5L17.5 16.375z"/></svg>
);

// --- LOGOS DE PAGO (Versión Grande 50px) ---
const YapeLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 14px', height: 50, backgroundColor: '#752384', borderRadius: 12 }}>
    <span style={{ color: 'white', fontWeight: 900, fontSize: 24, fontFamily: 'sans-serif', marginTop: -2 }}>Yape</span>
  </div>
);
const PlinLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 14px', height: 50, backgroundColor: '#00c6bc', borderRadius: 12 }}>
    <span style={{ color: 'white', fontWeight: 900, fontSize: 24, fontFamily: 'sans-serif' }}>Plin</span>
  </div>
);

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
          justifyContent: 'flex-start',
          paddingTop: 70,
          backgroundColor: '#020617',
          backgroundImage: 'radial-gradient(circle at 50% 100%, #581c87 0%, #020617 50%)', 
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decoración de Fondo */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px', opacity: 0.2,
          }}
        />

        {/* Badge Superior */}
        <div
          style={{
            display: 'flex', padding: '8px 24px', borderRadius: '50px',
            border: '1px solid rgba(168, 85, 247, 0.5)', backgroundColor: 'rgba(168, 85, 247, 0.15)',
            color: '#e9d5ff', fontSize: 18, fontWeight: 600, letterSpacing: '0.1em',
            marginBottom: 30, textTransform: 'uppercase',
          }}
        >
          La Plataforma #1 en Perú
        </div>

        {/* Título Principal */}
        <div
          style={{
            display: 'flex', fontSize: 90, fontWeight: 900, letterSpacing: '-0.03em',
            textAlign: 'center', lineHeight: 1, color: 'white', marginBottom: 20,
            flexDirection: 'column', alignItems: 'center',
          }}
        >
          <span style={{ 
            backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)',
            backgroundClip: 'text', color: 'transparent', paddingBottom: 10,
          }}>
            SocialBoost.pe
          </span>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 36, color: '#94a3b8', textAlign: 'center',
            maxWidth: '900px', fontWeight: 500,
          }}
        >
          Seguidores • Likes • Vistas • Comentarios
        </div>

        {/* Redes Sociales (Iconos Grandes) */}
        <div
          style={{
            display: 'flex', marginTop: 45, gap: '30px',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <TikTokIcon />
          <InstagramIcon />
          <FacebookIcon />
          <YoutubeIcon />
          <KickIcon />
        </div>

        {/* --- FOOTER: PAGOS GIGANTES --- */}
        <div
           style={{
             position: 'absolute', bottom: 35,
             display: 'flex', alignItems: 'center', gap: 20,
             fontSize: 20, color: '#cbd5e1',
           }}
        >
          <span style={{fontWeight: 600, letterSpacing: '0.05em', marginRight: 10, fontSize: 16 }}>ACEPTAMOS:</span>
          <YapeLogo />
          <PlinLogo />
          {/* Tarjetas Gigantes */}
          <div style={{ display: 'flex', alignItems: 'center', gap:8, border: '2px solid rgba(255,255,255,0.3)', padding: '0 16px', height: 50, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' }}>
             <div style={{width: 24, height: 24, borderRadius: '50%', backgroundColor: '#eb001b'}} /> 
             <div style={{width: 24, height: 24, borderRadius: '50%', backgroundColor: '#f79e1b', marginLeft: -12}} /> 
             <span style={{ color: 'white', fontWeight: 700, fontSize: 18, marginLeft: 8 }}>VISA</span>
          </div>
        </div>

      </div>
    ),
    { ...size }
  );
}