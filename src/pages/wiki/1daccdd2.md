---
title: 'JS: CommonJS vs. ECMAScript Modules'
tags:
  - cjs
  - esm
  - javascript
  - programming
  - web-dev
  - wiki
permalink: /wiki/1daccdd2/
layout: page
---

### File names

The convention nowadays (I think) is to use either `.js` or `.mjs` to denote ES module format and `.cjs` to denote CommonJS format. Even though they're all technically optional (I think), it's probably best to use `.mjs` and `.cjs` all the time to avoid ambiguity.

### Import / export

#### Exporting

```js
// in a library's `index.js` file
import bar from "./bar.js"
import baz from "./baz.js"
import foo from "./foo.js"

// using named exports
export { bar, baz, foo }

// using a default export
export default {
  bar,
  baz,
  foo,
}
```

It _seems_ like the above exported objects should be identical — and they are at least in the sense that they're defined the same way. But from the perspective of an outside consumer, they are _not_ the same thing. You'd get errors if, for example, you only used named exports but then tried to import the default value:

```js
import MyCoolLibrary from "./path/to/index.js" // ERROR!
```

Similarly, if you only used the default export but then tried to import named values, you'd get errors:

```js
import { bar } from "./path/to/index.js" // ERROR!
```

In other words, files that only use named exports _must_ be imported using the `import { someName } from "./some-package.js"` syntax; and files that only use default exports _must_ be imported using the `import SomePackage from "./some-package.js"` syntax. However, it is possible to use both named and default exports within the same file, as illustrated in the `index.js` example above.

#### Importing

Here's an example that imports from the above `index.js` file:

```js
// using named imports
import { bar, baz, foo } from "./path/to/index.js"
```

```js
// using the default import
import MyCoolLibrary from "./path/to/index.js"
const { bar, baz, foo } = MyCoolLibrary
```

### Setup modifications

Some or all of the changes mentioned below (and perhaps others not mentioned!) must be made so that packages can be bundled, used in the browser, imported in Node, etc.

1. In `package.json`, add a `"type": "module"` key-value pair:

```json
{
  "type": "module"
}
```

2. For bundling, change the bundle format. For example, in esbuild, add the `--format=esm` flag:

```bash
npx esbuild src/index.js --bundle --format=esm --minify --outfile=dist/bundle.js
```

3. In the browser, add the `type="module"` attribute to the relevant `<script>` elements:

```html
<script type="module">
  import MyCoolLibrary from "./dist/bundle.js"
</script>
```

Note that it may be important for bundling and code-splitting purposes whether things are imported from the production bundle (as in the example above) or from the source code itself (e.g., `import _ from "./src/index.js"`).

4. From what I understand, Jest unfortunately only has experimental, unstable support for ES modules. For running tests in the meantime, replace Jest with [my Jest copycat tool](https://www.npmjs.com/package/@jrc03c/fake-jest) that's designed to work with ES modules:

```bash
npm uninstall --save-dev jest
npm install --save-dev @jrc03c/fake-jest
```

And run it just like Jest:

```
npx fake-jest
```

#### Bundling considerations

It may be a good idea to bundle _all_ libraries regardless of (1) browser vs. Node usage, (2) number of source files, or (3) dependence on other libraries. That's because there are lots of subtle little pitfalls related to using a library in Node vs. in the browser vs. in a bundle, etc., and bundling can make it a little easier for consumers to avoid those pitfalls. Therefore, my current recommendation is that all libraries should provide bundles for each relevant target. For example, here are some `esbuild` configurations for outputting three bundles: a Node / CommonJS / `require` version, an ESM / `import` version, and a "standalone" (IIFE) version:

```bash
# Node / CommonJS / `require`
npx esbuild src/index.js --bundle --platform=node --outfile=dist/lib.require.cjs

# ESM / `import`
npx esbuild src/index.js --bundle --format=esm --outfile=dist/lib.import.mjs

# Standalone
npx esbuild src/index.js --bundle --outfile=dist/lib.standalone.cjs
```

> **NOTE:** IIFE is the default format used by `esbuild`, and it's the format I've been using previously in all of my libraries — even though I didn't know I was using it!

Once these bundles have been created, the library becomes much easier to use in various contexts. Here are some examples:

**CommonJS in Node or other library:**

```js
const mylib = require("./dist/lib.require.cjs")
```

**ESM in Node:**

```js
import mylib from "./dist/lib.import.mjs"
```

**ESM in the browser:**

```html
<script type="module">
  import mylib from "./dist/lib.import.mjs"
</script>
```

**Standalone in Node:**

```js
require("./dist/lib.standalone.cjs")
```

**Standalone in the browser:**

```html
<script src="./dist/lib.standalone.cjs"></script>
```

#### Multiple entry points

It's apparently possible to provide multiple entry points to a library using the `"exports"` field in the library's `package.json` file, which can be useful for making the library accessible in both CJS and ESM contexts. Here's a standard setup recommended by the internet:

```json
{
  "type": "module",
  "exports": {
    "require": "./dist/lib.require.cjs",
    "import": "./dist/lib.import.mjs"
  }
}
```

However, I've been unable to get this to work after _a lot_ of trial and error. Specifically, when I try to `require` the library from elsewhere, I get errors. If anyone reading this has any ideas what might be going wrong, please let me know!
