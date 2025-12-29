import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // "Para todos los robots del mundo..."
      allow: '/',     // "...tienen permiso de entrar a todo el sitio."
      disallow: '/private/', // (Opcional) Si tuvieras carpetas privadas
    },
    sitemap: 'https://www.socialboostperu.store/sitemap.xml',
  };
}