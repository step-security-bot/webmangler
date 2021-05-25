import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { CssDeclarationPropertyOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("CSS - CSS Property Expression Factory", function() {
  const scenarios: TestScenario<TestCase<CssDeclarationPropertyOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "div { color: red; }",
          pattern: "[a-z]+",
          expected: ["color"],
          options: { },
        },
        {
          input: "div { color: red; font: serif; }",
          pattern: "[a-z]+",
          expected: ["color", "font"],
          options: { },
        },
        {
          input: "div { color: red; font-size: 12px; }",
          pattern: "[a-z]+",
          expected: ["size"],
          options: {
            prefix: "font-",
          },
        },
        {
          input: "div { padding-left: 3px; margin-left: 14px; }",
          pattern: "[a-z]+",
          expected: ["padding", "margin"],
          options: {
            suffix: "-left",
          },
        },
      ],
    },
    {
      name: "with comments",
      cases: [
        {
          input: "div { /* set the color */ color: red; }",
          pattern: "[a-z]+",
          expected: ["color"],
          options: { },
        },
        {
          input: "div { color: red; /* set the font */ font: serif; }",
          pattern: "[a-z]+",
          expected: ["color", "font"],
          options: { },
        },
        {
          input: "div { color /* set the color */: red; }",
          pattern: "[a-z]+",
          expected: ["color"],
          options: { },
        },
        {
          input: "div { font: /* set the font */ serif; }",
          pattern: "[a-z]+",
          expected: ["font"],
          options: { },
        },
      ],
    },
    {
      name: "edge cases",
      cases: [
        {
          input: "div { content: \"color: red;\"; }",
          pattern: "[a-z]+",
          expected: ["content"],
          options: { },
        },
        {
          input: "div { content: \"; color: red;\"; }",
          pattern: "[a-z]+",
          expected: ["content"],
          options: { },
        },
        {
          input: "div { content: 'color: red;'; }",
          pattern: "[a-z]+",
          expected: ["content"],
          options: { },
        },
        {
          input: "div { content: '; color: red;'; }",
          pattern: "[a-z]+",
          expected: ["content"],
          options: { },
        },
        {
          input: "div { color: red; /* font: serif; */ }",
          pattern: "[a-z]+",
          expected: ["color"],
          options: { },
        },
        {
          input: "div { color: red /*; font: serif; */ }",
          pattern: "[a-z]+",
          expected: ["color"],
          options: { },
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

        const expressions = cssDeclarationPropertyExpressionFactory(options);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
