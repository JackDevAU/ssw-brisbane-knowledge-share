import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "knowledge",
        label: "Knowledge Sessions",
        path: "src/content/knowledge",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "presenter",
            label: "Presenter",
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            required: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            required: true,
          },
        ],
      },
    ],
  },
});