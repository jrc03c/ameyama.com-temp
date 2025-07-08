---
title: Typescript notes
tags:
  - javascript
  - programming
  - typescript
  - web
  - wiki
permalink: /wiki/caed4e84/
layout: page
---

### Bundling

1. Transpile TS files using `tsc`:

```bash
npx tsc path/to/main.ts
```

(Note the `*.ts` extension! 👆)

2. Bundle transpiled JS files:

```bash
npx esbuild path/to/main.js --bundle [...]
```

(Note the `*.js` extension! 👆)

### Importing

Importing works the same way in TS as in modern JS:

```js
// person.ts
export class Person { ... }
```

```js
// main.ts
import { Person } from "./person"
const p = new Person(...)
```
