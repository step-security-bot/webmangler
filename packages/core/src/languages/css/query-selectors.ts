import type { MangleExpression } from "../../types";
import type { QuerySelectorOptions } from "../options";

import { QUERY_SELECTOR_COMBINERS } from "../common";
import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match query selectors in CSS, e.g. `foobar`
 * in `.foobar { }`.
 *
 * @param [selectorPrefix] The query selector prefix.
 * @param [selectorSuffix] The query selector suffix.
 * @returns The {@link MangleExpression} to match query selectors in CSS.
 */
function newCssSelectorExpression(
  selectorPrefix?: string,
  selectorSuffix?: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<=
        ${selectorPrefix ? selectorPrefix :
          `(?:${QUERY_SELECTOR_COMBINERS}|\\}|^)`}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${selectorSuffix ? selectorSuffix :
          `(?:${QUERY_SELECTOR_COMBINERS}|\\{|$)`}
      )
    `,
    GROUP_MAIN,
    true,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match CSS selectors in CSS. This
 * will match:
 * - CSS selectors (e.g. `foobar` in `.foobar { }`).
 *
 * @param options The {@link QuerySelectorOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.20
 */
export default function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  return [
    newCssSelectorExpression(options.prefix, options.suffix),
  ];
}
