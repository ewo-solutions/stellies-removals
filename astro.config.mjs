import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.stelliesremovals.com',
  trailingSlash: 'never',
  // 'hybrid': every page stays static/prerendered by default (same as
  // before) except the enquiry-form API route, which opts out via
  // `export const prerender = false` to run as a Vercel serverless
  // function. The rest of the site is unaffected.
  output: 'hybrid',
  adapter: vercel(),
});
