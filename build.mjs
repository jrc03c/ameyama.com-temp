import { execSync } from "node:child_process"
import { Logger } from "@jrc03c/logger"
import { watch } from "@jrc03c/watch"
import { WebCrawler } from "@jrc03c/web-crawler"
import express from "express"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

let isRebuilding = false
let lastRebuildStartTime
let crawler
const logFile = path.join(import.meta.dirname, "build-logs.json")

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "", "utf8")
}

const logger = new Logger({ path: logFile })
const PORT = 3000

async function rebuild() {
  isRebuilding = true
  lastRebuildStartTime = new Date()
  logger.logInfo(`Rebuilding... (${new Date().toLocaleString()})`)

  try {
    execSync(`rm -rf dist`, { encoding: "utf8" })
    execSync(`mkdir -p dist`, { encoding: "utf8" })
    execSync(`npx @11ty/eleventy`, { encoding: "utf8" })
    logger.logSuccess("Done! 🎉")

    if (process.argv.includes("--watch") || process.argv.includes("-w")) {
      if (crawler) {
        try {
          crawler.stop()
        } catch (e) {}
      }

      const deadLinks = []

      crawler = new WebCrawler({
        delay: 0,
        filter: url => url.includes("localhost:" + PORT),
        requestTimeout: 3000,
        shouldHonorBotRules: false,
        shouldOnlyFollowSitemap: false,
      })

      logger.logInfo("Crawling for dead links...")

      crawler.on("finish", () => {
        if (deadLinks.length > 0) {
          logger.logError(`These links are dead:\n${deadLinks.join("\n")}`)
        }
      })

      crawler.on("error", v => {
        if (v.message.includes("404") && !v.url.includes("mailto:")) {
          deadLinks.push(v.url)
        }
      })

      crawler.on("stop", () => {
        logger.logWarning("Crawling stopped.")
      })

      crawler.start("http://localhost:" + PORT)
    }
  } catch (e) {
    console.error(e)
  }

  isRebuilding = false
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
