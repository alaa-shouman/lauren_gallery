import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.SANITY_PROJECT_ID ?? import.meta.env?.VITE_SANITY_PROJECT_ID ?? 'q89j9p90';
const dataset = process.env.SANITY_DATASET ?? import.meta.env?.VITE_SANITY_DATASET ?? 'production';

const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Content")
        .child(
          S.list()
            .title("Content")
            .items([
              S.listItem().title("Hero").child(S.document().schemaType("hero").documentId("hero")),
              S.listItem().title("About").child(S.document().schemaType("about").documentId("about")),
              S.listItem().title("Site Settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            ]),
        ),
      S.listItem()
        .title("Work")
        .child(
          S.list()
            .title("Work")
            .items([
              S.documentTypeListItem("experience").title("Experience"),
              S.documentTypeListItem("project").title("Projects"),
              S.documentTypeListItem("collection").title("Collections"),
            ]),
        ),
      S.listItem()
        .title("Social Proof")
        .child(
          S.list()
            .title("Social Proof")
            .items([S.documentTypeListItem("testimonial").title("Testimonials"), S.documentTypeListItem("press").title("Press")]),
        ),
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
