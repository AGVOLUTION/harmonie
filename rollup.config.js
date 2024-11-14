import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";

export default [
  // browser-friendly (minified) UMD build
  {
    input: "src/index.ts",
    output: {
      name: "harmonie",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      typescript(),
      resolve({
        browser: true,
      }),
      commonjs(),
      terser(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      name: "harmonie",
      file: pkg.module,
      format: "es",
    },
    plugins: [
      typescript(),
      resolve({
        browser: true,
      }),
      commonjs(),
      terser(),
    ],
  },
  // node js and module version
  {
    input: "src/index.ts",
    external: [
      "@turf/helpers",
      "@turf/truncate",
      "fast-xml-parser",
      "proj4",
      "shapefile",
      "@turf/meta",
      "terraformer-wkt-parser",
      "polygon-clipping",
    ],
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "auto",
        sourcemap: "inline",
      },
    ],
    plugins: [typescript()],
  },
];
