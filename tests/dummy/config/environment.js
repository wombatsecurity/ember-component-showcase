"use strict";
var getVersion = require("git-repo-version");

module.exports = function (environment) {
  let ENV = {
    modulePrefix: "dummy",
    environment,
    rootURL: "/",
    locationType: "auto",
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {},
    showcaseConfig: {
      enabled: true,
      docs: {
        enabled: true,
        paths: ["addon/**/*.js"],
        githubRepo:
          "https://github.com/wombatsecurity/ember-component-showcase",
        githubTag: "v" + getVersion({ shaLength: 0 }),
      },
    },
  };

  if (environment === "development") {
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  if (environment === "production") {
    // here you can enable a production-specific feature
  }

  return ENV;
};
