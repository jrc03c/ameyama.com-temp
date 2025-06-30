import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

window.addEventListener("load", async () => {
  const worker = new WebWorkerHelper("search-worker-bundle.js")
  const form = document.querySelector("#search-form")
  const queryInput = form.querySelector("input[type='text']")
  const submitButton = form.querySelector("input[type='submit']")

  form.addEventListener("submit", async event => {
    event.preventDefault()
    event.stopImmediatePropagation()
    console.log(await worker.exec("search", queryInput.value))
  })

  queryInput.disabled = true
  submitButton.disabled = true
  submitButton.value = "Loading..."

  const index = await (async () => {
    const cachedIndex = localStorage.getItem("search-index")

    if (cachedIndex) {
      return cachedIndex
    }

    const response = await fetch("search-index.json")
    const raw = await response.text()

    if (response.status === 200) {
      localStorage.setItem("search-index", raw)
      return JSON.parse(raw)
    } else {
      throw new Error(`${response.status}: ${raw}`)
    }
  })()

  await worker.exec("set-index", index)

  queryInput.disabled = false
  submitButton.disabled = false
  submitButton.value = "Search"
})
