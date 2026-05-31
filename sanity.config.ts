import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

const viteEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env ?? {}
const projectId = process.env.SANITY_PROJECT_ID ?? viteEnv.VITE_SANITY_PROJECT_ID ?? '';
const dataset = process.env.SANITY_DATASET ?? viteEnv.VITE_SANITY_DATASET ?? '';

const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Hero").child(S.document().schemaType("hero").documentId("hero")),
      S.listItem().title("About").child(S.document().schemaType("about").documentId("about")),
      S.listItem().title("Site Settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("experience").title("Experience"),
    ]);

export default defineConfig({
  name: "default",
  title: "Earth & Texture — Lauren Khafaji",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
