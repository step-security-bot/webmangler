/**
 * The options for _WebMangler_'s built-in HTML IDs mangler.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
interface HtmlIdManglerOptions {
  /**
   * One or more patterns for IDs that should be mangled.
   *
   * @default `"id-[a-zA-Z-_]+"`
   * @since v0.1.0
   * @version v0.1.17
   */
  idNamePattern?: string | Iterable<string>;

  /**
   * One or more patterns for CSS classes that should **never** be mangled.
   *
   * @default `[]`
   * @version v0.1.23
   */
  ignoreIdNamePattern?: string | Iterable<string>;

  /**
   * A list of strings and patterns of IDs that should not be used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @version v0.1.17
   */
  reservedIds?: Iterable<string>;

  /**
   * A prefix to use for mangled IDs.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepIdPrefix?: string;

  /**
   * A list of HTML attributes whose value to treat as an `id`.
   *
   * NOTE: the `id` and `for` attributes are always included and do not need to
   * be specified when using this option.
   *
   * @default `[]`
   * @since v0.1.15
   * @version v0.1.17
   */
  idAttributes?: Iterable<string>;

  /**
   * A list of HTML attributes whose value to treat as a URL. That is, the ID
   * fragment of URLs in these attributes will be mangled if it is an internal
   * URL.
   *
   * NOTE: the `href` attribute is always included and does not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.15
   * @version v0.1.17
   */
  urlAttributes?: Iterable<string>;
}

/**
 * The options for the set of {@link MangleExpression}s that match CSS query
 * selectors.
 *
 * @since v0.1.14
 */
type QuerySelectorOptions = {
  /**
   * The prefix required on the CSS query selector.
   *
   * NOTE: it is recommended to only ever use one of `"\\."`, `"#"`, and
   * `"\\["`.
   *
   * @default `""`
   * @since v0.1.14
   */
  prefix?: string;

  /**
   * The suffix required on the CSS query selector.
   *
   * NOTE: it is recommended to only ever use one of `""` and `"\\."`.
   *
   * @default `""`
   * @since v0.1.14
   */
  suffix?: string;
};

/**
 * The options for the set of {@link MangleExpression}s that match the values of
 * attributes as a single value.
 *
 * @since v0.1.14
 * @version v0.1.17
 */
type SingleValueAttributeOptions = {
  /**
   * The names of attributes to match.
   *
   * @since v0.1.14
   * @version v0.1.17
   */
  attributeNames: Iterable<string>;

  /**
   * An optional expression of the prefix required on values that should be
   * matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  valuePrefix?: string;

  /**
   * An optional expression of the suffix required on values that should be
   * matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  valueSuffix?: string;
};

export type {
  HtmlIdManglerOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
};
