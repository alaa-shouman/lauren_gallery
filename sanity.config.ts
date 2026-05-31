import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = 'q89j9p90';
const dataset = 'production';

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
