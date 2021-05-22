import type { MangleExpression } from "../../types";
import type { CssDeclarationPropertyOptions } from "../options";

import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "../utils/mangle-expressions";
import { QUOTED_ATTRIBUTE_PATTERN, QUOTES_ARRAY } from "./common";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match the property of CSS declarations in
 * HTML, e.g. `font` in `<div style="font: serif"><div>"`.
 *
 * @param propertyPrefix The prefix required on properties.
 * @param propertySuffix The suffix required on properties.
 * @returns The {@link MangleExpression}s to match properties in style attr.
 */
function newStyleDeclarationPropertyExpressions(
  propertyPrefix: string,
  propertySuffix: string,
): MangleExpression[] {
  return QUOTES_ARRAY.map((quote) => new NestedGroupMangleExpression(
    `
      (?<=
        \\<\\s*[a-zA-Z0-9]+\\s+
        (?:
          [^>\\s=]+
          (?:\\s*=\\s*${quote}[^${quote}]*${quote})?
          \\s+
        )*
        ${QUOTED_ATTRIBUTE_PATTERN("style", quote)}
      )
      (?<${GROUP_MAIN}>
        (?:[^${quote}]+)?
        ${propertyPrefix}
        %s
        ${propertySuffix}
        \\s*:
        (?:[^${quote}]+)?
      )
      (?=
        \\s*${quote}
        [^>]*
        >
      )
    `,
    `
      (?<=
        (^|;|\\*\\/)\\s*
        ${propertyPrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${propertySuffix}
        \\s*:
      )
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get {@link MangleExpression}s to match the property of CSS declarations in
 * unquoted HTML attributes, e.g. `font` in `<div style=font:serif><div>"`.
 *
 * @param propertyPrefix The prefix required on properties.
 * @param propertySuffix The suffix required on properties.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newUnquotedStyleDeclarationPropertyExpressions(
  propertyPrefix: string,
  propertySuffix: string,
): MangleExpression[] {
  return QUOTES_ARRAY.map((quote) => new SingleGroupMangleExpression(
    `
      (?<=
        \\<\\s*[a-zA-Z0-9]+\\s+
        (?:
          [^>\\s=]+
          (?:\\s*=\\s*${quote}[^${quote}]*${quote})?
          \\s+
        )*
        style\\s*=\\s*${propertyPrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=${propertySuffix}:)
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in HTML. This will match:
 * - Properties in style attributes (e.g. `foo` in `<img style="foo: bar">`).
 *
 * @param options The {@link CssDeclarationPropertyOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.19
 */
export default function cssDeclarationPropertyExpressionFactory(
  options: CssDeclarationPropertyOptions,
): Iterable<MangleExpression> {
  const propertyPrefix = options.prefix ? options.prefix : "";
  const propertySuffix = options.suffix ? options.suffix : "";

  return [
    ...newStyleDeclarationPropertyExpressions(propertyPrefix, propertySuffix),
    ...newUnquotedStyleDeclarationPropertyExpressions(
      propertyPrefix,
      propertySuffix,
    ),
  ];
}
