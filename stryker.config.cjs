"use strict";

const values = require("./.values.cjs");

const {
  cacheDir,
  packagesCoverageExclusions,
  packagesDir,
  packagesExpr,
  packagesList,
  reportsDir,
  srcDir,
  tempDir,
  testDirUnit,
  testsDir,
  testSuffix,
} = values;

const reportIdentifier = packagesList.length > 1 ? "_mixed" : packagesList[0];

module.exports = {
  coverageAnalysis: "perTest",
  inPlace: false,
  mutate: [
    `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
    `!**/${testsDir}/**/*.ts`,
    ...packagesCoverageExclusions.map((exclusion) => `!${exclusion}`),
  ],

  testRunner: "mocha",
  mochaOptions: {
    config: ".mocharc.cjs",
    spec: [
      [
        packagesDir,
        packagesExpr,
        "**",
        testsDir,
        testDirUnit,
        `*.${testSuffix}.ts`,
      ].join("/"),
    ],
  },

  incremental: true,
  incrementalFile: `${cacheDir}/mutation/${packagesList.join(",")}.json`,

  timeoutMS: 25000,
  timeoutFactor: 2.5,

  disableTypeChecks: `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.build.json",

  reporters: [
    "clear-text",
    "dashboard",
    "html",
    "progress",
  ],
  dashboard: {
    module: packagesList[0],
  },
  htmlReporter: {
    fileName: `${reportsDir}/mutation/${reportIdentifier}/index.html`,
  },
  thresholds: {
    high: 80,
    low: 70,
    break: 50,
  },

  tempDirName: `${tempDir}/stryker`,
  cleanTempDir: false,
};
