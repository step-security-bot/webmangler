import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  embedContentInBody,
  embedContentInContext,
} from "./benchmark-helpers";

type TestCase = {
  input: string;
}

suite("HTML Benchmark Helpers", function() {
  const scenarios: TestScenarios<TestCase[]> = [
    {
      testName: "sample",
      getScenario: () => [
        {
          input: "<div class=\"hello world\"></div>",
        },
        {
          input: "<div data-foo=\"bar\"></div>",
        },
        {
          input: `
            <div>
              <p>Lorem ipsum dolor</p>
            </div>
          `,
        },
      ],
    },
  ];

  suite("::embedContentInBody", function() {
    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { input } = testCase;

          const result = embedContentInBody(input);
          expect(result).to.contain(input);
        }
      });
    }
  });

  suite("::embedContentInContext", function() {
    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { input } = testCase;

          const result = embedContentInContext(input);
          expect(result).to.contain(input);
        }
      });
    }
  });
});
