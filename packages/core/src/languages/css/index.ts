import type { ExpressionFactory } from "../utils";

import { SimpleLanguagePlugin } from "../utils";
import attributeExpressionFactory from "./attributes";
import cssDeclarationPropertyExpressionFactory from "./css-properties";
import cssDeclarationValueExpressionFactory from "./css-values";
import querySelectorExpressionFactory from "./query-selectors";
import singleValueAttributeExpressionFactory from "./single-value-attributes";

const map: Map<string, ExpressionFactory> = new Map();
map.set("attributes", attributeExpressionFactory);
map.set("css-declaration-properties", cssDeclarationPropertyExpressionFactory);
map.set("css-declaration-values", cssDeclarationValueExpressionFactory);
map.set("query-selectors", querySelectorExpressionFactory);
map.set("single-value-attributes", singleValueAttributeExpressionFactory);

/**
 * The options for _WebMangler_'s built-in {@link CssLanguagePlugin}.
 *
 * @since v0.1.17
 */
export type CssLanguagePluginOptions = {
  /**
   * One or more languages that this language plugin should be used for. Can be
   * used when CSS files have a non-standard extension or to use this plugin for
   * CSS-like languages.
   *
   * NOTE: the default languages are always included and do not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.17
   */
  languages?: string[];
}

/**
 * This {@link WebManglerLanguagePlugin} provides support for mangling the
 * following in CSS:
 *
 * - Attributes
 * - CSS declaration properties
 * - CSS declaration values
 * - Query selectors
 * - Single-value attribute values
 *
 * @example
 * webmangler({
 *   plugins: [
 *     // any compatible plugins, e.g. the built-in plugins
 *   ],
 *   languages: [
 *     new CssLanguagePlugin(),
 *   ],
 * });
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default class CssLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link CssLanguagePlugin}.
   */
  private static LANGUAGES: string[] = [
    "css",
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link CssLanguagePlugin}.
   */
  private static EXPRESSION_FACTORIES: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link CssLanguagePlugin} plugin.
   *
   * @param options The {@link CssLanguagePluginOptions}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(options: CssLanguagePluginOptions={}) {
    super(
      CssLanguagePlugin.getLanguages(options.languages),
      CssLanguagePlugin.EXPRESSION_FACTORIES,
    );
  }

  /**
   * Get all the languages for a new {@link CssLanguagePlugin} instance.
   *
   * @param configuredLanguages The configured languages, if any.
   * @returns The languages for the instances.
   */
  private static getLanguages(configuredLanguages: string[]=[]): string[] {
    return CssLanguagePlugin.LANGUAGES.concat(...configuredLanguages);
  }
}
