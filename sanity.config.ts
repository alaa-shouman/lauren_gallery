import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("Missing SANITY_PROJECT_ID or SANITY_DATASET in your environment variables.");
}

export default defineConfig({
  name: "default",
  title: "Lauren Gallery",
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
