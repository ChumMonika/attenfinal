/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Use the new package instead of the old 'tailwindcss' string
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;