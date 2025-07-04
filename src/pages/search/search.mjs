import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

window.addEventListener("load", async () => {
  const worker = new WebWorkerHelper("search-worker-bundle.js")
  const container = document.querySelector("#search")
  const form = container.querySelector("#search-form")
  const queryInput = form.querySelector("input[type='text']")
  const submitButton = form.querySelector("input[type='submit']")
  const resultsContainer = container.querySelector("#search-results")

  form.addEventListener("submit", async event => {
    event.preventDefault()
    event.stopImmediatePropagation()

    const results = await worker.exec("search", queryInput.value)
    resultsContainer.innerHTML = ""

    const padLength = results.length.toString().length

    results.forEach((result, i) => {
      const el = document.createElement("div")
      el.classList.add("search-result")

      el.innerHTML = `
        <p>
          ${(i + 1).toString().padStart(padLength, "0")}.
          <a href="${result.url}">${result.url}</a>
        </p>

        <div>
          ${result.excerpt}
        </div>
      `

      resultsContainer.appendChild(el)
    })
  })

  queryInput.disabled = true
  submitButton.disabled = true
  submitButton.value = "Loading..."

  const index = await (async () => {
    const cachedIndex = localStorage.getItem("search-index")

    if (cachedIndex) {
      return JSON.parse(cachedIndex)
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
