import { fg, fx } from "@jrc03c/bash-colors"
import * as fsx from "@jrc03c/fs-extras"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

function modifyHeadings(config) {
  config = config || {}

  const files =
    config.files ||
    fsx.findSync(path.join(import.meta.dirname, "src"), f => f.endsWith(".md"))

  const delta = config.delta || 0

  if (delta === 0) {
    return
  }

  files.forEach(file => {
    const raw = fs.readFileSync(file, "utf8")
    const lines = raw.split("\n")
    let isInCodeBlock = false

    const newLines = lines.map(line => {
      if (line.match(/^```/)) {
        isInCodeBlock = !isInCodeBlock
      }

      if (line.match(/^#/) && !isInCodeBlock) {
        const count = line.match(/#+/)[0].length
        const newCount = Math.min(count + delta, 6)
        const newLine = line.replace(/^#+/, "#".repeat(newCount))
        return newLine
      }

      return line
    })

    const out = newLines.join("\n")
    fs.writeFileSync(file, out, "utf8")
  })
}

if (import.meta.url.includes(process.argv[1])) {
  const delta = (() => {
    const longIndex = process.argv.findIndex(v => v.includes("--delta"))
    const shortIndex = process.argv.findIndex(v => v === "-d")

    if (longIndex > -1) {
      const longValue = process.argv[longIndex]

      if (longValue.includes("=")) {
        return parseInt(longValue.split("=").at(-1))
      } else {
        return parseInt(process.argv[longIndex + 1])
      }
    }

    if (shortIndex > -1) {
      return parseInt(process.argv[shortIndex + 1])
    }

    console.log(
      `${fx.bright(
        fg.cyan("SYNTAX:"),
      )}      node [options] modify-headings.mjs`,
    )

    console.log(
      `${fx.dim("DESCRIPTION:")} increases or decreases the levels of headings`,
    )

    console.log(`${fx.dim("EXAMPLE:")}     node --delta=1 modify-headings.mjs`)
    console.log(`${fx.dim("EXAMPLE:")}     node -d -3 modify-headings.mjs`)
    process.exit()
  })()

  const config = { delta }
  modifyHeadings(config)
}
