import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

const worker = new WebWorkerHelper()
let index

worker.on("set-index", async payload => {
  index = payload
})

worker.on("search", async payload => {
  console.log("searching for:", payload)
  return []
})
