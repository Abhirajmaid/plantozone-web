'use strict';

const defaultCorsOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://plantozone-web-production.up.railway.app',
  'https://www.plantozone.com',
  'https://plantozone.com',
];

function resolveCorsOrigins(env) {
  const extra = env('CORS_ORIGIN');
  if (!extra || typeof extra !== 'string') {
    return defaultCorsOrigins;
  }
  const additional = extra.split(',').map((s) => s.trim()).filter(Boolean);
  return [...new Set([...defaultCorsOrigins, ...additional])];
}

module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com'],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: resolveCorsOrigins(env),
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
