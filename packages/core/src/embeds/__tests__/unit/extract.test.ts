import type { TestScenarios } from "@webmangler/testing";
import type {
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "../../types";

import { WebManglerLanguagePluginMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { extractEmbedsFromContent, getEmbeds } from "../../extract";

suite("Embeds", function() {
  const idPrefix = "wm-embed@";

  suite("::extractEmbedsFromContent", function() {
    const idPattern = `${idPrefix}[a-zA-Z0-9]+-[0-9]+`;

    interface TestCase {
      readonly input: {
        readonly file: WebManglerFile;
        readonly plugin: WebManglerLanguagePlugin;
      };
      readonly expected: {
        readonly embeds: ReadonlyArray<IdentifiableWebManglerEmbed>;
        readonly file: WebManglerFile;
      };
    }

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "example 1",
        getScenario: () => {
          const cssEmbed = ".foo { color: red; }";
          const stylesheet = `<style>${cssEmbed}</style>`;

          return {
            input: {
              file: {
                type: "html",
                content: stylesheet,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: cssEmbed,
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: ".foo { color: red; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 27,
                  getRaw(): string { return this.content; },
                  id: "a-7",
                },
              ],
              file: {
                type: "html",
                content: `<style>${idPattern}</style>`,
              },
            },
          };
        },
      },
      {
        testName: "example 2",
        getScenario: () => {
          const jsEmbed = "var x = document.getElementById(\"bar\");";
          const script = `<script>${jsEmbed}</script>`;

          return {
            input: {
              file: {
                type: "html",
                content: script,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: jsEmbed,
                    type: "js",
                    startIndex: 8,
                    endIndex: 47,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: "var x = document.getElementById\\(\"bar\"\\);",
                  type: "js",
                  startIndex: 8,
                  endIndex: 47,
                  getRaw(): string { return this.content; },
                  id: "f-8",
                },
              ],
              file: {
                type: "html",
                content: `<script>${idPattern}</script>`,
              },
            },
          };
        },
      },
      {
        testName: "example 3",
        getScenario: () => {
          const cssEmbed = ".foo { color: red; }";
          const jsEmbed = "var x = document.getElementById(\"bar\");";

          const stylesheet = `<style>${cssEmbed}</style>`;
          const script = `<script>${jsEmbed}</script>`;

          return {
            input: {
              file: {
                type: "html",
                content: `${stylesheet}${script}`,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: ".foo { color: red; }",
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: "var x = document.getElementById(\"bar\");",
                    type: "js",
                    startIndex: 43,
                    endIndex: 82,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: ".foo { color: red; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 27,
                  getRaw(): string { return this.content; },
                  id: "h-7",
                },
                {
                  content: "var x = document.getElementById\\(\"bar\"\\);",
                  type: "js",
                  startIndex: 43,
                  endIndex: 82,
                  getRaw(): string { return this.content; },
                  id: "h-43",
                },
              ],
              file: {
                type: "html",
                content: `<style>${idPattern}</style>` +
                  `<script>${idPattern}</script>`,
              },
            },
          };
        },
      },
      {
        testName: "example 4",
        getScenario: () => {
          const cssEmbed = ".foo { color: red; }";
          const jsEmbed = "var x = document.getElementById(\"bar\");";

          const stylesheet = `<style>${cssEmbed}</style>`;
          const script = `<script>${jsEmbed}</script>`;

          return {
            input: {
              file: {
                type: "html",
                content: `${stylesheet}${script}`,
              },
              plugin: new WebManglerLanguagePluginMock({
                getEmbeds: sinon.stub().returns([
                  {
                    content: jsEmbed,
                    type: "js",
                    startIndex: 43,
                    endIndex: 82,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: cssEmbed,
                    type: "css",
                    startIndex: 7,
                    endIndex: 27,
                    getRaw(): string { return this.content; },
                  },
                ]),
              }),
            },
            expected: {
              embeds: [
                {
                  content: ".foo { color: red; }",
                  type: "css",
                  startIndex: 7,
                  endIndex: 27,
                  getRaw(): string { return this.content; },
                  id: "h-7",
                },
                {
                  content: "var x = document.getElementById\\(\"bar\"\\);",
                  type: "js",
                  startIndex: 43,
                  endIndex: 82,
                  getRaw(): string { return this.content; },
                  id: "h-43",
                },
              ],
              file: {
                type: "html",
                content: `<style>${idPattern}</style>` +
                  `<script>${idPattern}</script>`,
              },
            },
          };
        },
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        const testCase = getScenario();
        const { expected, input: { file, plugin } } = testCase;

        const embeds = extractEmbedsFromContent(file, plugin);

        expect(plugin.getEmbeds).to.have.been.calledWith(file);

        expect(embeds).to.have.length(expected.embeds.length);
        for (const i in Array.from(embeds)) {
          const embed = Array.from(embeds)[i];
          const expectedEmbed = expected.embeds[i];
          const expectedContent = new RegExp(`^${expectedEmbed.content}$`);
          expect(embed.content).to.match(expectedContent);
          expect(embed.type).to.equal(expectedEmbed.type);
          expect(embed.startIndex).to.equal(expectedEmbed.startIndex);
          expect(embed.endIndex).to.equal(expectedEmbed.endIndex);
          expect(embed.getRaw()).to.match(expectedContent);
          expect(embed.id).to.equal(expectedEmbed.id);
        }

        {
          const expectedFile = expected.file;
          const expectedContent = new RegExp(`^${expectedFile.content}$`);
          expect(file.content).to.match(expectedContent);
          expect(file.type).to.equal(expectedFile.type);
        }
      });
    }
  });

  suite("::getEmbeds", function() {
    const idPattern = `${idPrefix}[a-zA-Z0-9]+-[0-9]+`;

    interface TestCase {
      readonly files: WebManglerFile[];
      readonly plugins: WebManglerLanguagePlugin[];
      readonly expected: {
        readonly embeds: WebManglerEmbed[];
        readonly files: WebManglerFile[];
      };
    }

    const scenarios: TestScenarios<Iterable<TestCase>> = [
      {
        testName: "nested embeds",
        getScenario: () => {
          const cssEmbed = ".foo { color: blue; }";
          const mediaEmbed = `@media screen {${cssEmbed}}`;
          const fileContent = `<style>${mediaEmbed}</style>`;

          return [
            {
              files: [
                {
                  type: "html",
                  content: fileContent,
                },
              ],
              plugins: [
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content === fileContent) {
                      return [
                        {
                          content: mediaEmbed,
                          type: "css",
                          startIndex: 7,
                          endIndex: 44,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
                new WebManglerLanguagePluginMock({
                  getEmbeds: sinon.stub().callsFake(({ content }) => {
                    if (content === mediaEmbed) {
                      return [
                        {
                          content: cssEmbed,
                          type: "js",
                          startIndex: 15,
                          endIndex: 36,
                          getRaw(): string { return this.content; },
                        },
                      ];
                    }

                    return [];
                  }),
                }),
              ],
              expected: {
                embeds: [
                  {
                    content: cssEmbed,
                    type: "js",
                    startIndex: 15,
                    endIndex: 36,
                    getRaw(): string { return this.content; },
                  },
                  {
                    content: `@media screen {${idPattern}}`,
                    type: "css",
                    startIndex: 7,
                    endIndex: 44,
                    getRaw(): string { return this.content; },
                  },
                ],
                files: [
                  {
                    type: "html",
                    content: `<style>${idPattern}</style>`,
                  },
                ],
              },
            },
          ];
        },
      },
      {
        testName: "edge cases",
        getScenario: () => [
          {
            files: [],
            plugins: [
              new WebManglerLanguagePluginMock(),
            ],
            expected: {
              embeds: [],
              files: [],
            },
          },
          {
            files: [
              { type: "type", content: "content" },
            ],
            plugins: [],
            expected: {
              embeds: [],
              files: [
                { type: "type", content: "content" },
              ],
            },
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { expected, files, plugins } = testCase;

          const embedsMap = getEmbeds(files, plugins);

          const embeds: IdentifiableWebManglerEmbed[] = [];
          for (const fileEmbeds of embedsMap.values()) {
            embeds.push(...fileEmbeds);
          }

          for (const file of files) {
            for (const plugin of plugins) {
              expect(plugin.getEmbeds).to.have.been.calledWith(file);
            }
          }

          expect(embeds).to.have.length(expected.embeds.length);
          for (const i in embeds) {
            const embed = embeds[i];
            const expectedEmbed = expected.embeds[i];
            const expectedContent = new RegExp(`^${expectedEmbed.content}$`);
            expect(embed.content).to.match(expectedContent);
            expect(embed.type).to.equal(expectedEmbed.type);
            expect(embed.startIndex).to.equal(expectedEmbed.startIndex);
            expect(embed.endIndex).to.equal(expectedEmbed.endIndex);
            expect(embed.getRaw()).to.match(expectedContent);
            expect(embed.id).to.be.a.string;
          }

          expect(expected.files.length).to.equal(files.length);
          for (const i in files) {
            const file = files[i];
            const expectedFile = expected.files[i];
            const expectedContent = new RegExp(`^${expectedFile.content}$`);
            expect(file.content).to.match(expectedContent);
            expect(file.type).to.equal(expectedFile.type);
          }
        }
      });
    }
  });
});
