export default {
  config: {
    head: {
      favicon: '/extensions/logo.png',
    },
    auth: {
      logo: '/extensions/logo.png',
    },
    menu: {
      logo: '/extensions/logo.png',
    },
    theme: {
      dark: {
        colors: {
          primary100: '#0B9C09',
          primary200: '#0B9C09',
          primary500: '#0B9C09',
          primary600: '#0A8708',
          primary700: '#096C06',

          // Optional overrides for a clean dark theme
          neutral0: '#111111',        // Background
          neutral100: '#1E1E1E',      // Card background
          neutral200: '#2B2B2B',      // Input/fields
          neutral300: '#3D3D3D',
          neutral500: '#A1A1A1',      // Muted text
          neutral800: '#F0F0F0',      // Bright text
          danger700: '#e74c3c',       // Error color
        },
      },
    },
    locales: ['en'],
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Plantozone',
        'app.components.LeftMenu.navbrand.workplace': 'Admin Dashboard',
      },
    },
  },
  bootstrap(app) {
    console.log('Plantozone Admin Panel Loaded', app);
  },
};
