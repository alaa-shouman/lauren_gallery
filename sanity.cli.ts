import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID ?? process.env.VITE_SANITY_PROJECT_ID ?? 'q89j9p90',
    dataset: process.env.SANITY_DATASET ?? process.env.VITE_SANITY_DATASET ?? 'production',
  },
  studioHost: 'lauren-khafaji',
});
