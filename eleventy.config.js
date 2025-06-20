// See the docs for more info about configuring Eleventy:
// https://www.11ty.dev/docs/config/

import { EleventyHtmlBasePlugin } from "@11ty/eleventy"

export default async function (config) {
  // Set the input directory:
  config.setInputDirectory("src")

  // Declare important paths relative to the input directory:
  config.setLayoutsDirectory("layouts")
  config.setIncludesDirectory("layouts/includes")
  config.setDataDirectory("data")
  config.setOutputDirectory("dist")

  // Add plugins:
  config.addPlugin(EleventyHtmlBasePlugin)

  // Add linters:
  // NOTE: Using a standard function syntax (i.e., instead of the fat-arrow
  // syntax) will allow access to other variables related to the content being
  // rendered (e.g., `this.inputPath`, `this.page.outputPath`, etc.). I don't
  // think this is required, though.
  config.addLinter("linter-name", async function (content) {
    if (content) {
      console.log(this.inputPath)
    }
  })

  // Add filters:
  // https://www.11ty.dev/docs/filters/
  // synchronous:
  config.addFilter("filter-name", value => {
    console.log(value)
  })

  config.addFilter("to-locale-date-string", value => {
    return new Date(value).toUTCString()
  })

  // asynchronous:
  config.addAsyncFilter("filter-name", async value => {
    console.log(value)
  })

  // Add pass-through file copy:
  // NOTE: This path is relative to the root of the project, *not* the input
  // directory!
  config.addPassthroughCopy("src/static")
}
