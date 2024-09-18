import * as esbuild from "esbuild";

(async () => {
  await esbuild.build({
    entryPoints: ["./server/server.ts"],
    bundle: true,
    platform: "node",
    target: ["node22.0"],
    outfile: "dist/server/server.js",
    plugins: [],
  });
})();
