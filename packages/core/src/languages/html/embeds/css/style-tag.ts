import type { WebManglerEmbed, WebManglerFile } from "../../../../types";

import { EMBED_TYPE } from "./common";

/**
 * A regular expression to find style tags in HTML.
 */
const REGEXP_STYLE_TAG = /(<style(?:\s[^>]*>|>))([^<]*)<\/style>/gm;

/**
 * Convert a {@link REGEXP_STYLE_TAG} match into a {@link WebManglerEmbed}.
 *
 * @param match A {@link RegExpExecArray}.
 * @returns The {@link WebManglerEmbed}.
 */
function styleTagMatchToEmbed(match: RegExpExecArray): WebManglerEmbed {
  const tag = match[1];
  const stylesheet = match[2];

  const startIndex = match.index + tag.length;
  const endIndex = startIndex + stylesheet.length;

  return {
    type: EMBED_TYPE,
    startIndex,
    endIndex,
    content: stylesheet,
    getRaw(): string {
      return this.content;
    },
  };
}

/**
 * Extract all style tags values in a HTML file as CSS embeds.
 *
 * @example
 * const file = { type: "html", content: "<style>.foo{ color:red; }</style>" };
 * const embeds = getStyleTagsAsEmbeds(file);
 * console.log(embeds[0]);  // ".foo{ color:red; }"
 * @param file A {@link WebManglerFile}.
 * @returns Zero or more {@link WebManglerEmbed}s.
 * @since v0.1.21
 */
export function getStyleTagsAsEmbeds(
  file: WebManglerFile,
): Iterable<WebManglerEmbed> {
  const result: WebManglerEmbed[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = REGEXP_STYLE_TAG.exec(file.content)) !== null) {
    const embed = styleTagMatchToEmbed(match);
    result.push(embed);
  }

  return result;
}
