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
          const start = Math.max(index - excerptPadding, 0)

          const end = Math.min(
            index + match.length + excerptPadding,
            result.doc.length,
          )

          const left = result.doc.slice(start, index)

          const middle =
            "<b>" + result.doc.slice(index, index + match.length) + "</b>"

          const right = result.doc.slice(index + match.length, end)
          return left + middle + right
        }),
        "",
      ].join(" ... ")

      result.file = index.find(doc => doc.raw === result.doc).file
      result.url = result.file.replace(/index\.html$/, "")
      return result
    })
})
