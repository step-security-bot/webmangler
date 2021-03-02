import type { TestScenario } from "@webmangler/testing";
import type { SingleValueAttributeOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import singleValueAttributeExpressionFactory from "../single-value-attributes";

type TestCase = {
  /**
   * The input string to match against.
   */
  input: string;

  /**
   * The pattern to use for matching.
   */
  pattern: string;

  /**
   * The expected matches.
   */
  expected: string[];

  /**
   * The factory options.
   */
  options: SingleValueAttributeOptions;
};

suite("CSS - Single Value Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "[data-foo=\"bar\"] { }",
          pattern: "[a-z]+",
          expected: ["bar"],
          options: {
            attributeNames: ["data-foo"],
          },
        },
        {
          input: "[class=\"foobar\"] { }",
          pattern: "[a-z]+",
          expected: ["bar"],
          options: {
            attributeNames: ["class"],
            valuePrefix: "foo",
          },
        },
        {
          input: "[class=\"foobar\"] { }",
          pattern: "[a-z]+",
          expected: ["foo"],
          options: {
            attributeNames: ["class"],
            valueSuffix: "bar",
          },
        },
        {
          input: "[class=\"praise the sun\"] { }",
          pattern: "[a-z]+",
          expected: ["the"],
          options: {
            attributeNames: ["class"],
            valuePrefix: "praise\\s*",
            valueSuffix: "\\s*sun",
          },
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const {
          input,
          pattern,
          expected,
          options,
        } = testCase;

        const expressions = singleValueAttributeExpressionFactory(options);
        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(true, `in "${input}"`);
      }
    });
  }
});
