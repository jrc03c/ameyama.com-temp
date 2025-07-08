---
title: '''Illegal constructor'' error for web components'
tags:
  - js
  - programming
  - web-dev
  - wiki
permalink: /wiki/c5bcf3a7/
layout: page
---

If you encounter an "Illegal constructor" error when working with web components, it's likely that you didn't register your component before trying to create an instance. Simply register the component first:

```
window.customElements.define("my-custom-element", MyCustomElement)
```

And then create an instance:

```
new MyCustomElement()
```
