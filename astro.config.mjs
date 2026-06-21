// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// SSR on Cloudflare so Phase 2 (D1-backed content) can swap the content-layer
// getters from static data to live queries with no rebuild step. See PROJECT_BRIEF §6.
// https://astro.build/config
export default defineConfig({
  output: 'server',
  // platformProxy exposes local D1/R2 bindings to `astro dev` so the CMS works locally.
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  // Explicit CSRF origin check on form POSTs (default true in v6; pinned so a future
  // config change can't silently disable it).
  security: { checkOrigin: true },
  // Hide the floating dev-only toolbar at the bottom of the page (dev mode only;
  // it never appears on the built site anyway).
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // The Cloudflare local runtime writes to .wrangler/ constantly; if Vite watches
    // it the dev server reloads in an infinite loop. Ignore local state dirs.
    server: {
      watch: {
        ignored: ['**/.wrangler/**', '**/.mf/**', '**/dist/**'],
      },
    },
  }
});