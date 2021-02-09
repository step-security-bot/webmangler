import { expect } from "chai";

import {
  getArrayOfFormattedStrings,
  varyQuotes,
  varySpacing,
} from "./test-helpers";
import { TestScenario } from "./testing";

import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import mangleEngine from "../../engine";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlAttributeMangler from "../html-attributes";

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("HTML Attribute Mangler", function() {
  const DEFAULT_PATTERN = "data-[a-z-]+";

  suite("CSS", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          {
            input: "[data-foo] { }",
            expected: "[data-a] { }",
          },
          {
            input: ".data-foo { }",
            expected: ".data-foo { }",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: attrNamePattern,
            reserved: reservedAttrNames,
            prefix: keepAttrPrefix,
            description: failureMessage,
          } = testCase;

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });
          htmlAttributeMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("css", input)];
          const result = htmlAttributeMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("HTML", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          ...varySpacing("=", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-a=\"bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-a=\"bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div class=\"data-foo\"></div>",
            expected: "<div class=\"data-foo\"></div>",
          }),
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: attrNamePattern,
            reserved: reservedAttrNames,
            prefix: keepAttrPrefix,
            description: failureMessage,
          } = testCase;

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });
          htmlAttributeMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("html", input)];
          const result = htmlAttributeMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("JavaScript", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\"[data-foo]\");",
            expected: "document.querySelectorAll(\"[data-a]\");",
          }),
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\".foo[data-bar]\");",
            expected: "document.querySelectorAll(\".foo[data-a]\");",
          }),
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\".data-foo\");",
            expected: "document.querySelectorAll(\".data-foo\");",
          }),
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: attrNamePattern,
            reserved: reservedAttrNames,
            prefix: keepAttrPrefix,
            description: failureMessage,
          } = testCase;

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });
          htmlAttributeMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("js", input)];
          const result = htmlAttributeMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      " -", " _", " 1", " 2", " 3", " 4", " 5", " 6", " 7", " 8", " 9",
    ];

    let content = "";

    suiteSetup(function() {
      const n = HtmlAttributeMangler.CHARACTER_SET.length;
      const nArray = getArrayOfFormattedStrings(n, "<div data-%s=\"foo\">");
      content = nArray.join("");
    });

    test("without extra reserved", function() {
      const htmlAttributeMangler = new HtmlAttributeMangler({
        attrNamePattern: "data-[0-9]+",
        keepAttrPrefix: "",
      });
      htmlAttributeMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("html", content);
      const result = htmlAttributeMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });

    test("with extra reserved", function() {
      const htmlAttributeMangler = new HtmlAttributeMangler({
        attrNamePattern: "data-[0-9]+",
        reservedAttrNames: ["a"],
        keepAttrPrefix: "",
      });
      htmlAttributeMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("html", content);
      const result = htmlAttributeMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });

  test("no input files", function() {
    const htmlAttributeMangler = new HtmlAttributeMangler({
      attrNamePattern: DEFAULT_PATTERN,
    });

    const result = htmlAttributeMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
