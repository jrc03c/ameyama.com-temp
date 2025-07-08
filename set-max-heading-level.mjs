import { clamp } from "@jrc03c/js-math-tools"
import * as fsx from "@jrc03c/fs-extras"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

function setMaxHeading(config) {
  config = config || {}

  const files =
    config.files ||
    fsx.findSync(path.join(import.meta.dirname, "src"), f => f.endsWith(".md"))

  const maxHeadingLevel = config.maxHeadingLevel || 1

  files.forEach(file => {
    const raw = fs.readFileSync(file, "utf8")
    const lines = raw.split("\n")
    let isInCodeBlock = false
    let currentMaxHeadingLevel = Infinity

    for (const line of lines) {
      if (line.match(/^```/)) {
        isInCodeBlock = !isInCodeBlock
      }

      if (line.match(/^#/) && !isInCodeBlock) {
        const level = line.match(/#+/)[0].length

        if (level < currentMaxHeadingLevel) {
          currentMaxHeadingLevel = level
        }
      }
    }

    if (currentMaxHeadingLevel === Infinity) {
      return
    }

    const delta = maxHeadingLevel - currentMaxHeadingLevel

    if (delta === 0) {
      return
    }

    const newLines = lines.map(line => {
      if (line.match(/^```/)) {
        isInCodeBlock = !isInCodeBlock
      }

      if (line.match(/^#/) && !isInCodeBlock) {
        const level = line.match(/#+/)[0].length
        const newLevel = clamp(level + delta, 1, 6)

        if (newLevel < maxHeadingLevel) {
          throw new Error(line)
        }

        const newLine = line.replace(/^#+/, "#".repeat(newLevel))
        return newLine
      }

      return line
    })

    const out = newLines.join("\n")
    fs.writeFileSync(file, out, "utf8")
  })
}

if (import.meta.url.includes(process.argv[1])) {
  if (process.argv.length < 3) {
    const filename = import.meta.url.split("/").at(-1)
    console.log(`SYNTAX:  node ${filename} [number]`)
    console.log(`EXAMPLE: node ${filename} 3`)
    process.exit()
  }

  const maxHeadingLevel = parseInt(process.argv.at(-1))
  const config = { maxHeadingLevel }
  setMaxHeading(config)
}
