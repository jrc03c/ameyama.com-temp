import { WebWorkerHelper } from "@jrc03c/web-worker-helper"

window.addEventListener("load", async () => {
  const worker = new WebWorkerHelper("search-worker-bundle.js")
  const container = document.querySelector("#search")
  const resultsContainer = container.querySelector("#search-results")

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

  const url = new URL(window.location.href)
  let query = url.searchParams.get("query")

  if (query) {
    query = decodeURIComponent(query)

    if (query) {
      const form = document.querySelector("#search-form")
      const input = form.querySelector("input[type='text']")
      input.value = query
    }

    const results = await worker.exec("search", query)
    resultsContainer.innerHTML = ""

    const padLength = results.length.toString().length

    results.forEach((result, i) => {
      const el = document.createElement("blockquote")
      el.classList.add("search-result")

      el.innerHTML = `
        <p>
          <b>${(i + 1).toString().padStart(padLength, "0")}.</b>
          <a href="${result.url}">${result.url}</a>
        </p>

        <div>
          ${result.excerpt}
        </div>
      `

      resultsContainer.appendChild(el)
    })
  }
})
