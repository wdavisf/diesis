import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://diesis.app',
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: vercel(),
});
