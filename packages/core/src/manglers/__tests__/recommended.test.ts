import type RecommendedManglersType from "../recommended";
import type { RecommendedManglersOptions } from "../recommended";

import { WebManglerPluginMock } from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as proxyquire from "proxyquire";
import * as sinonChai from "sinon-chai";

import { permuteObjects } from "./test-helpers";

chaiUse(sinonChai);

suite("Recommended Manglers", function() {
  const DEFAULT_CLASS_NAME_OPTIONS = { classNamePattern: "cls[-_][a-z-_]+" };
  const DEFAULT_CSS_VAR_OPTIONS = { cssVarNamePattern: "[a-z-]+" };
  const DEFAULT_HTML_ATTR_OPTIONS = { attrNamePattern: "data-[a-z-]+" };
  const ALL_DEFAULT_OPTIONS = [
    DEFAULT_CLASS_NAME_OPTIONS,
    DEFAULT_CSS_VAR_OPTIONS,
    DEFAULT_HTML_ATTR_OPTIONS,
  ];

  let CssClassManglerMock: WebManglerPluginMock;
  let CssVarManglerMock: WebManglerPluginMock;
  let HtmlAttrManglerMock: WebManglerPluginMock;

  let RecommendedManglers: {
    new(options?: RecommendedManglersOptions): RecommendedManglersType,
  };

  suiteSetup(function() {
    CssClassManglerMock = new WebManglerPluginMock();
    CssVarManglerMock = new WebManglerPluginMock();
    HtmlAttrManglerMock = new WebManglerPluginMock();

    const recommended = proxyquire("../recommended", {
      "./css-classes": {
        default: function() { return CssClassManglerMock; },
      },
      "./css-variables": {
        default: function() { return CssVarManglerMock; },
      },
      "./html-attributes": {
        default: function() { return HtmlAttrManglerMock; },
      },
    });
    RecommendedManglers = recommended.default;
  });

  suite("CSS class mangler", function() {
    const DISABLE_CSS_CLASS_MANGLING = { disableCssClassMangling: true };

    let ALL_NON_CSS_CLASS_OPTIONS: RecommendedManglersOptions[];

    suiteSetup(function() {
      ALL_NON_CSS_CLASS_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_CLASS_NAME_OPTIONS;
        }),
      );
    });

    setup(function() {
      CssClassManglerMock.options.resetHistory();
    });

    test("mangling when class pattern is set", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CLASS_NAME_OPTIONS);

        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(CssClassManglerMock.options).to.have.callCount(1);
        expect(result).to.deep.include(CssClassManglerMock.options());

        CssClassManglerMock.options.resetHistory();
      }
    });

    test("mangling when class pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_CLASS_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(CssClassManglerMock.options).to.have.callCount(1);
        expect(result).to.deep.include(CssClassManglerMock.options());

        CssClassManglerMock.options.resetHistory();
      }
    });

    test("mangling when the CSS class mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_CLASS_MANGLING);

        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(CssClassManglerMock.options).to.have.callCount(0);
        expect(result).not.to.deep.include(CssClassManglerMock.options());

        CssClassManglerMock.options.resetHistory();
      }
    });
  });

  suite("CSS variable mangler", function() {
    const DISABLE_CSS_VAR_MANGLING = { disableCssVarMangling: true };

    let ALL_NON_CSS_VAR_OPTIONS: RecommendedManglersOptions[];

    suiteSetup(function() {
      ALL_NON_CSS_VAR_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_CSS_VAR_OPTIONS;
        }),
      );
    });

    setup(function() {
      CssVarManglerMock.options.resetHistory();
    });

    test("mangling when CSS variable pattern is set", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CSS_VAR_OPTIONS);

        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(CssVarManglerMock.options).to.have.callCount(1);
        expect(result).to.deep.include(CssVarManglerMock.options());

        CssVarManglerMock.options.resetHistory();
      }
    });

    test("mangling when CSS variable pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_VAR_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(CssVarManglerMock.options).to.have.callCount(1);
        expect(result).to.deep.include(CssVarManglerMock.options());

        CssVarManglerMock.options.resetHistory();
      }
    });

    test("mangling when the CSS variable mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_VAR_MANGLING);

        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(CssVarManglerMock.options).to.have.callCount(0);
        expect(result).not.to.deep.include(CssVarManglerMock.options());

        CssVarManglerMock.options.resetHistory();
      }
    });
  });

  suite("HTML attribute mangler", function() {
    const DISABLE_HTML_ATTR_MANGLING = { disableHtmlAttrMangling: true };

    let ALL_NON_HTML_ATTR_OPTIONS: RecommendedManglersOptions[];

    suiteSetup(function() {
      ALL_NON_HTML_ATTR_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_HTML_ATTR_OPTIONS;
        }),
      );
    });

    setup(function() {
      HtmlAttrManglerMock.options.resetHistory();
    });

    test("mangling when HTML attributes pattern is set", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_HTML_ATTR_OPTIONS);

        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(HtmlAttrManglerMock.options).to.have.callCount(1);
        expect(result).to.deep.include(HtmlAttrManglerMock.options());

        HtmlAttrManglerMock.options.resetHistory();
      }
    });

    test("mangling when HTML attributes pattern is NOT set", function() {
      for (const options of ALL_NON_HTML_ATTR_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(HtmlAttrManglerMock.options).to.have.callCount(1);
        expect(result).to.deep.include(HtmlAttrManglerMock.options());

        HtmlAttrManglerMock.options.resetHistory();
      }
    });

    test("mangling when the HTML attribute mangler is disabled", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_HTML_ATTR_MANGLING);

        const mangler = new RecommendedManglers(options);
        const result = mangler.options();
        expect(HtmlAttrManglerMock.options).to.have.callCount(0);
        expect(result).not.to.deep.include(HtmlAttrManglerMock.options());

        HtmlAttrManglerMock.options.resetHistory();
      }
    });
  });

  test("no configuration", function() {
    expect(() => new RecommendedManglers()).not.to.throw();
  });
});
