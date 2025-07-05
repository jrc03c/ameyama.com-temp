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
    payload,
    index.map(doc => doc.raw),
  )
    .filter(result => result.score < 0.1)
    .map(result => {
      result.excerpt = [
        "",
        ...result.matches.map(match => {
          const index = result.doc.indexOf(match)
          let start = Math.max(index - excerptPadding, 0)

          while (start > 0 && !result.doc[start].match(/\s/)) {
            start--
          }

          let end = Math.min(
            index + match.length + excerptPadding,
            result.doc.length,
          )

          while (end < result.doc.length - 1 && !result.doc[end].match(/\s/)) {
            end++
          }

          const left = result.doc
            .slice(start, index)
            .replaceAll(/\s/g, " ")
            .trimStart()

          const middle =
            "<b>" +
            result.doc
              .slice(index, index + match.length)
              .replaceAll(/\s/g, " ") +
            "</b>"

          const right = result.doc
            .slice(index + match.length, end)
            .replaceAll(/\s/g, " ")
            .trimEnd()

          return left + middle + right
        }),
        "",
      ].join(" ... ")

      result.file = index.find(doc => doc.raw === result.doc).file
      result.url = result.file.replace(/index\.html$/, "")
      return result
    })
})
