import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

function cleanWhitespace(x) {
  for (const v of ["\n", "\r", "\t"]) {
    x = x.replaceAll(v, " ")
  }

  while (x.includes("  ")) {
    x = x.replaceAll("  ", " ")
  }

  return x.trim()
}

function removeHTML(x) {
  return x.replaceAll(/<.*?>/gs, " ")
}

const worker = new WebWorkerHelper()
let index

worker.on("set-index", async payload => {
  index = payload
})

worker.on("search", async payload => {
  payload = payload.toLowerCase()

  return index.filter(doc => {
    if (!doc.cleaned) {
      doc.cleaned = cleanWhitespace(removeHTML(doc.raw)).toLowerCase()
    }

    return doc.cleaned.includes(payload)
  })
})
