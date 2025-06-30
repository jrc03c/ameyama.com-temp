import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

window.addEventListener("load", () => {
  const worker = new WebWorkerHelper("search-worker-bundle.js")
  const form = document.querySelector("#search-form")
  const input = form.querySelector("#search-form-text-input")

  form.addEventListener("submit", async event => {
    event.preventDefault()
    event.stopImmediatePropagation()
    console.log(await worker.exec("search", input.value))
  })
})
