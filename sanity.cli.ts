import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("Missing SANITY_PROJECT_ID or SANITY_DATASET in your environment variables.");
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
