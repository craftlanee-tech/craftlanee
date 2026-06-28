// Export a PostCSS config object.
// Use a simple `any` type to avoid type incompatibilities with the PostCSS package.
const config: any = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
