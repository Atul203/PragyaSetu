/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},   // ✅ v4 correct plugin
  },
};

export default config;
