#!/usr/bin/env node
/**
 * @fileoverview
 * Run tests in the repository. Allows for configuring the type of tests to run
 * as well as which packages to run tests for.
 */

"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  TEST_TYPE_BENCHMARK,
  TEST_TYPE_TEST,
} = require("./constants");

const BENCHMARK_FLAG = "--benchmark";
const COVERAGE_FLAG = "--coverage";
const WATCH_FLAG = "--watch";

const projectRoot = path.resolve(__dirname, "..");
const packagesRoot = path.resolve(projectRoot, "packages");
const binDir = path.resolve(projectRoot, "node_modules", ".bin");
const nycBin = path.resolve(binDir, "nyc");
const mochaBin = path.resolve(binDir, "mocha");

const argv = process.argv.slice(2);

const cmd = getCliCommand(argv);
const cmdArgs = getCommandArgs(argv);
const packages = getPackagesToRun(argv);
const testType = getTestType(argv);

compilePackages(packages);
runTests(cmd, cmdArgs, packages, testType);

function runTests(spawnCmd, spawnArgs, TEST_PACKAGES, TEST_TYPE) {
  console.log("Running test...");
  spawnSync(spawnCmd, spawnArgs, {
    env: Object.assign({ }, process.env, {
      TEST_PACKAGES,
      TEST_TYPE,
    }),
    stdio: ["inherit", "inherit", "inherit"],
  });
}

function compilePackages(packagesStr) {
  log("Compiling packages...\n");

  let packagesList;
  if (packagesStr !== undefined) {
    packagesList = packagesStr.split(",");
  } else {
    packagesList = fs.readdirSync(packagesRoot);
  }

  for (const packageName of packagesList) {
    log(`  Compiling packages/${packageName}...`);
    spawnSync("npm", ["run", "compile"], {
      cwd: path.resolve(packagesRoot, packageName),
    });
    log(`  Compiled packages/${packageName}.\n`, { overwrite: true });
  }

  log("\n");
}

function getCliCommand(args) {
  if (args.includes(COVERAGE_FLAG)) {
    return nycBin;
  }

  return mochaBin;
}

function getCommandArgs(args) {
  const cliArgs = [];
  if (args.includes(COVERAGE_FLAG)) {
    cliArgs.push(mochaBin);
  }

  if (args.includes(WATCH_FLAG)) {
    cliArgs.push("--watch", "--reporter", "min");
  }

  return cliArgs;
}

function getPackagesToRun(args) {
  const packagesArgs = args.filter((arg) => !arg.startsWith("-"));
  if (packagesArgs.length === 0) {
    return;
  }

  const allPackagesExist = packagesArgs.every((packageName) => {
    const packagePath = path.resolve(projectRoot, "packages", packageName);
    return fs.existsSync(packagePath);
  });

  const packagesExpr = packagesArgs.join(",");
  if (!allPackagesExist) {
    throw new Error(`One of the packages doesn't exist: ${packagesExpr}`);
  }

  return packagesExpr;
}

function getTestType(args) {
  for (const arg of args) {
    switch (arg) {
      case BENCHMARK_FLAG:
        return TEST_TYPE_BENCHMARK;
    }
  }

  return TEST_TYPE_TEST;
}

function log(s, opts={}) {
  const emptyLine = " ".repeat(process.stdout.columns);

  if (opts.overwrite) {
    process.stdout.write("\r");
    process.stdout.write(emptyLine);
    process.stdout.write("\r");
  }

  process.stdout.write(s);
}
