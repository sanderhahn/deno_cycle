import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { deps, graph } from "./deps.ts";

Deno.test(
  "deps",
  async () => {
    assertEquals(
      deps(`
      import { some } from "./some.ts";
      import * as all from "./all.ts";
      import { type some } from "./type.ts";
      export * from "./export.ts";
      export { something as other } from "./export.ts";
      import "./sideeffect.ts";
    `),
      [
        "./some.ts",
        "./all.ts",
        "./type.ts",
        "./export.ts",
        "./sideeffect.ts",
      ],
    );
  },
);

Deno.test(
  "graph",
  async () => {
    assertEquals(
      await graph("./deps_test.ts"),
      {
        "file:///home/sander/work/deno/deno_cycle/deps.ts": {
          deps: [
            "https://raw.githubusercontent.com/nestdotland/deno_swc/master/mod.ts",
            "https://raw.githubusercontent.com/nestdotland/deno_swc/master/types/options.ts",
          ],
          filename: "./deps.ts",
          url: "file:///home/sander/work/deno/deno_cycle/deps.ts",
        },
        "file:///home/sander/work/deno/deno_cycle/deps_test.ts": {
          deps: [
            "https://deno.land/std/testing/asserts.ts",
            "./deps.ts",
          ],
          filename: "./deps_test.ts",
          url: "file:///home/sander/work/deno/deno_cycle/deps_test.ts",
        },
        "https://deno.land/std/fmt/colors.ts": {
          deps: [],
          filename: "../fmt/colors.ts",
          url: "https://deno.land/std/fmt/colors.ts",
        },
        "https://deno.land/std/testing/_diff.ts": {
          deps: [],
          filename: "./_diff.ts",
          url: "https://deno.land/std/testing/_diff.ts",
        },
        "https://deno.land/std/testing/asserts.ts": {
          deps: [
            "../fmt/colors.ts",
            "./_diff.ts",
          ],
          filename: "https://deno.land/std/testing/asserts.ts",
          url: "https://deno.land/std/testing/asserts.ts",
        },
        "https://raw.githubusercontent.com/nestdotland/deno_swc/master/mod.ts":
          {
            deps: [
              "./swc_wasm/wasm.js",
              "./types/options.ts",
            ],
            filename:
              "https://raw.githubusercontent.com/nestdotland/deno_swc/master/mod.ts",
            url:
              "https://raw.githubusercontent.com/nestdotland/deno_swc/master/mod.ts",
          },
        "https://raw.githubusercontent.com/nestdotland/deno_swc/master/swc_wasm/wasm.js":
          {
            deps: [],
            filename: "./swc_wasm/wasm.js",
            url:
              "https://raw.githubusercontent.com/nestdotland/deno_swc/master/swc_wasm/wasm.js",
          },
        "https://raw.githubusercontent.com/nestdotland/deno_swc/master/types/options.ts":
          {
            deps: [],
            filename: "./types/options.ts",
            url:
              "https://raw.githubusercontent.com/nestdotland/deno_swc/master/types/options.ts",
          },
      },
    );
  },
);
