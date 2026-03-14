// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/**/*.js',
    './docs/**/*.ts',
    './docs/**/*.vue',
    './docs/**/*.md',
    './docs/component/**/*.vue',
    './docs/.vitepress/component/**/*.vue',
  ],
  options: {
    safelist: ['html', 'body'],
  },
};
