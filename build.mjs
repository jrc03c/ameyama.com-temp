import { collapseWhitespace } from "@jrc03c/js-text-tools"
import { execSync } from "node:child_process"
import { Logger } from "@jrc03c/logger"
import { watch } from "@jrc03c/watch"
import * as fsx from "@jrc03c/fs-extras"
import express from "express"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const logger = new Logger({ path: "/tmp" })
const PORT = 3000

async function buildSearchIndex(options) {
  options = options || {}
  const dir = options.dir || path.join(import.meta.dirname, "dist")
  const include = options.include || [/\.html$/]
  const exclude = options.exclude || []

  const outfile =
    options.outfile ||
    path.join(import.meta.dirname, "dist", "search", "search-index.json")

  const files = fsx.findSync(
    dir,
    f =>
      include.some(pattern => f.match(pattern)) &&
      !exclude.some(pattern => f.match(pattern)),
  )

  const out = files.map(f => {
    return {
      file: f.replace(dir, ""),
      raw: collapseWhitespace(removeHTML(fs.readFileSync(f, "utf8"))),
    }
  })

  fs.writeFileSync(outfile, JSON.stringify(out), "utf8")
  return out
}

async function buildSitemap(options) {
  options = options || {}
  const baseUrl = options.baseUrl || "https://ameyama.com"
  const dir = options.dir || path.join(import.meta.dirname, "dist")
  const include = options.include || [/\.html$/]
  const exclude = options.exclude || []

  const outfile =
    options.outfile || path.join(import.meta.dirname, "dist", "sitemap.txt")

  const files = fsx.findSync(
    dir,
    f =>
      include.some(pattern => f.match(pattern)) &&
      !exclude.some(pattern => f.match(pattern)),
  )

  const out = files
    .map(f => f.replace(dir, baseUrl).replace(/index\.html$/, ""))
    .toSorted((a, b) => (a < b ? -1 : 1))

  fs.writeFileSync(outfile, out.join("\n"), "utf8")
  return out
}

async function rebuild() {
  logger.logInfo(`Rebuilding... (${new Date().toLocaleString()})`)

  try {
    execSync(`rm -rf dist`, { encoding: "utf8" })
    execSync(`mkdir -p dist`, { encoding: "utf8" })
    execSync(`npx @11ty/eleventy`, { encoding: "utf8" })

    execSync(
      `
        npx esbuild \
        src/pages/search/search.mjs \
        --bundle \
        --outfile=dist/search/search-bundle.js
      `,
      { encoding: "utf8" },
    )

    execSync(
      `
        npx esbuild \
        src/pages/search/search-worker.mjs \
        --bundle \
        --outfile=dist/search/search-worker-bundle.js
      `,
      { encoding: "utf8" },
    )

    await buildSearchIndex()
    await buildSitemap()
    logger.logSuccess("Done! 🎉")
  } catch (e) {
    console.error(e)
  }
}

function removeHTML(x) {
  return x.replaceAll(/<.*?>/gs, "").trim()
}

if (process.argv.indexOf("-w") > -1 || process.argv.indexOf("--watch") > -1) {
  watch({
    target: ".",
    include: ["eleventy.config.js", "src"],
    created: rebuild,
    modified: rebuild,
    deleted: rebuild,
  })

  const server = express()
  server.use("/", express.static("dist", { extensions: ["html"] }))

  server.listen(PORT, () => {
    logger.logInfo("Visit: http://localhost:" + PORT)
  })
}

rebuild()
