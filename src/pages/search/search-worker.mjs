import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

const worker = new WebWorkerHelper()

worker.on("search", async payload => {
  console.log("searching for:", payload)
  return []
})
