// @ts-check
const { defineConfig } = require("./.app/app-config");

module.exports = defineConfig({
  title: "Amy Westlake",
  description:
    "Developer & Cross Stitcher. Welcome to my personal corner of the internet.",
  editThisNote: {
    url: "",
  },
  customProperties: {
    properties: [
      {
        name: "publishedOn",
        options: {
          date: {
            locale: "en-GB",
            format: { dateStyle: "full" },
          },
        },
      },
      {
        path: "props",
        options: {
          date: {
            locale: "en-GB",
          },
        },
      },
    ],
  },
  sidebar: {
    notes: [
      {
        pattern: "^/[^/]+$",
      },
      {
        pattern: "^/Code/",
        label: "Writing about code",
        tree: {
          replace: {
            "^/\\w+": "",
          },
        },
      },
      {
        pattern: "^/Weeknotes/",
        label: "Week notes",
        tree: {
          replace: {
            "^/\\w+": "",
          },
        },
      },
      {
        pattern: "^/Lists/",
        label: "Lists",
        tree: {
          replace: {
            "^/\\w+": "",
          },
        },
      }
    ],
  },
  tags: {
    map: {
      "dynamic-content": "dynamic content",
    },
  },
});
