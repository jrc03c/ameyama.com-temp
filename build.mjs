import { execSync } from "node:child_process"
import { watch } from "@jrc03c/watch"
import express from "express"
import fs from "node:fs"
import process from "node:process"

function rebuild() {
  console.log("\n-----\n")
  console.log(`Rebuilding... (${new Date().toLocaleString()})`)

  try {
    execSync(`rm -rf dist`, { encoding: "utf8" })
    execSync(`mkdir -p dist`, { encoding: "utf8" })
    execSync(`npx @11ty/eleventy`, { encoding: "utf8" })
    console.log("\nDone! 🎉\n")
  } catch (e) {
    console.error(e)
  }
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
  server.listen(3000, () => console.log("Visit: http://localhost:3000"))
}

rebuild()
