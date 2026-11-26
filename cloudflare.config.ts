import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "gib",
    compatibilityDate: "2026-10-30",
    compatibilityFlags: ["nodejs_compat", "global_fetch_strictly_public"],
    entrypoint: "./worker/index.ts",
    workersDev: false,
    previewUrls: false,
    observability: {
      enabled: true,
    },
    assets: {
      htmlHandling: "auto-trailing-slash",
      notFoundHandling: "single-page-application",
      runWorkerFirst: ["/api", "/api/*"],
    },
    domains: ["gib.zerdalu.com"],
    env: {
      ASSETS: bindings.assets(),
    },
    /**
     * TODO(@cloudflare): cf migrate: The Wrangler assets directory was not migrated. Configure static assets in the Vite project.
     * @see https://developers.cloudflare.com/workers/wrangler/configuration/
     */
  },
});
