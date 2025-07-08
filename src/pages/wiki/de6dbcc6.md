---
title: Improve `scrcpy` performance
tags:
  - android
  - linux
  - wiki
permalink: /wiki/de6dbcc6/
layout: page
---

I've found that these settings drastically reduce lag for me:

```
scrcpy --video-bit-rate=2M --max-fps=60 --max-size=960
```
