// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://rida-hdj.github.io',
  base: '/the-technical-repo',

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
    },
  },

  vite: {
    build: {
      sourcemap: false,
    },
  },

  integrations: [
    sitemap(),
  ],
});
