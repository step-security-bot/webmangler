import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { QuerySelectorOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import querySelectorExpressionFactory from "../query-selectors";

suite("CSS - Query Selector Expression Factory", function() {
  const scenarios: TestScenario<TestCase<QuerySelectorOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "div { }",
          pattern: "[a-z]+",
          expected: ["div"],
          options: { },
        },
        {
          input: "bar, foobar, baz { }",
          pattern: "ba(r|z)",
          expected: ["bar", "baz"],
          options: { },
        },
        {
          input: ".foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "#foobar { }",
          pattern: "[a-z]+",
          expected: [],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "#foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "#",
          },
        },
        {
          input: "header, footer { }",
          pattern: "[a-z]+",
          expected: ["head", "foot"],
          options: {
            suffix: "er",
          },
        },
        {
          input: "[foobar] { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\[",
            suffix: "\\]",
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

        const expressions = querySelectorExpressionFactory(options);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
