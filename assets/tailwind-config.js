window.tailwind = window.tailwind || {};
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: '#0A1A3A',
        brand: { DEFAULT: '#0070FF', dark: '#0050C8', soft: '#E6F0FF' },
        accent: { DEFAULT: '#FF6B2C', dark: '#E5561A' },
        muted: '#5B6478'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      }
    }
  }
};
