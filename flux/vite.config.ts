// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // On Vercel's build machine, Nitro auto-detects the "vercel-static" preset instead of
  // "vercel", which breaks the SSR build (rolldownOptions.input resolves to an html file).
  // Pin the preset explicitly so this app always builds as Vercel Functions, matching how
  // it's actually deployed.
  nitro: {
    preset: "vercel",
  },
  vite: {
    // Served from webclass.navigationtrading.com/flux via a Vercel rewrite,
    // not from this app's own domain root — every asset URL needs this prefix.
    base: "/flux/",
  },
});
