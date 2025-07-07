import { fuzzyFind } from "@jrc03c/js-text-tools"
import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

const worker = new WebWorkerHelper()
const excerptPadding = 32
let index

worker.on("set-index", async payload => {
  index = payload
})

worker.on("search", async payload => {
  return fuzzyFind(
    payload.toLowerCase(),
    index.map(doc => {
      if (!doc.rawLower) {
        doc.rawLower = doc.raw.toLowerCase()
      }

      return doc.rawLower
    }),
  )
    .slice(0, 10)
    .map(result => {
      const doc = index.find(doc => doc.rawLower === result.doc)
      result.url = doc.file.replace(/index\.html$/, "")

      result.excerpt =
        "... "
        + result.matches
          .map(match => {
            const index = result.doc.indexOf(match)
            let start = Math.max(0, index - excerptPadding)

            let end = Math.min(
              doc.raw.length,
              index + match.length + excerptPadding,
            )

            while (start > 0 && !doc.raw[start].match(/\s/)) {
              start--
            }

            while (end < doc.raw.length - 1 && !doc.raw[end].match(/\s/)) {
              end++
            }

            const left =
              doc
                .raw
                .slice(start, index)
                .replaceAll(/\s/g, " ")

            const middle =
              "<b>" +
              doc.raw.slice(index, index + match.length).replaceAll(/\s/g, " ") +
              "</b>"

            const right =
              doc.raw
                .slice(index + match.length, end)
                .replaceAll(/\s/g, " ")

            return left + middle + right
          })
          .join(" ... ")
          .trim()
        + " ..."

      return result
    })
})
