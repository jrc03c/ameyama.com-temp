import { Logger } from "@jrc03c/logger"
import { WebCrawler } from "@jrc03c/web-crawler"
import express from "express"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

let crawler, server

function checkForDeadLinks(config) {
  return new Promise((resolve, reject) => {
    try {
      if (crawler) {
        try {
          crawler.stop()
        } catch (e) {}
      }

      if (server) {
        try {
          server.close()
        } catch (e) {}
      }

      config = config || {}
      const dir = config.dir || path.join(import.meta.dirname, "dist")
      const logger = config.logger || new Logger({ path: "/tmp" })

      const app = express()
      app.use("/", express.static(dir, { extensions: ["html"] }))

      server = app.listen(0, () => {
        const { port } = server.address()

        if (logger) {
          logger.logInfo(`Express server is listening on port ${port}...`)
        }

        const deadLinks = []

        crawler = new WebCrawler({
          delay: 0,
          filter: url => url.includes("localhost:" + port),
          requestTimeout: 3000,
          shouldHonorBotRules: false,
          shouldOnlyFollowSitemap: false,
        })

        crawler.on("finish", () => {
          if (logger) {
            logger.logSuccess("Crawling finished!")
          }

          try {
            crawler.stop()
          } catch (e) {}

          try {
            server.close()
          } catch (e) {}

          resolve(deadLinks)
        })

        crawler.on("error", v => {
          if (v.message.includes("404")) {
            if (!v.url.includes("data:") && !v.url.includes("mailto:")) {
              if (logger) {
                logger.logWarning(`Dead link: ${v.url}`)
              }

              deadLinks.push(v.url)
            }
          } else if (logger) {
            logger.logError(v.message)
          }
        })

        crawler.on("stop", () => {
          if (logger) {
            logger.logError("Crawling stopped.")
          }

          try {
            server.close()
          } catch (e) {}

          resolve(deadLinks)
        })

        if (logger) {
          logger.logInfo("Crawling for dead links...")
        }

        crawler.start("http://localhost:" + port)
      })
    } catch (e) {
      return reject(e)
    }
  })
}

export { checkForDeadLinks }

if (import.meta.url.includes(process.argv[1])) {
  const logger = new Logger({ path: "/tmp" })
  const config = { logger }
  const outfile = path.join(import.meta.dirname, "dead-links.txt")

  checkForDeadLinks(config).then(links => {
    if (links.length > 0) {
      fs.writeFileSync(outfile, links.join("\n"), "utf8")
      logger.logSuccess(`Saved dead links to "${outfile}"!`)
    } else {
      logger.logSuccess("No dead links! 🎉")
    }
  })
}
