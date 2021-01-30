import type { ManglerExpression } from "../types";

import SimpleLanguagePlugin from "../utils/simple-language-plugin.class";

import cssClassesMatchers from "./css-classes";
import cssVariablesMatchers from "./css-variables";
import htmlAttributeMatchers from "./html-attributes";
import htmlIdMatchers from "./html-ids";

const languages: string[] = ["css"];
const expressions: Map<string, ManglerExpression[]> = new Map();

expressions.set("css-class-mangler", cssClassesMatchers);
expressions.set("css-variable-mangler", cssVariablesMatchers);
expressions.set("html-attribute-mangler", htmlAttributeMatchers);
expressions.set("html-id-mangler", htmlIdMatchers);

/**
 * This {@link WebManglerLanguagePlugin} provides CSS support for the built-in
 * {@link WebManglerPlugin}s.
 *
 * @example
 * webmangler({
 *   plugins: [], // any built-in plugin(s)
 *   languages: [new CssLanguageSupport()],
 * });
 *
 * @since v0.1.0
 */
export default class CssLanguageSupport extends SimpleLanguagePlugin {
  /**
   * Instantiate a new {@link CssLanguageSupport} plugin.
   */
  constructor() {
    super(languages, expressions);
  }
}
