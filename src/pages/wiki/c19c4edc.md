---
title: Specifying a key for working with GitHub repos
tags:
  - linux
  - programming
  - wiki
permalink: /wiki/c19c4edc/
layout: page
---

I've encountered situations where I needed to clone a GitHub repo via SSH but using a non-default key. The easiest solution I could find is to modify the `~/.ssh/config` file and include something like this:

```
Host github.com
	IdentityFile path/to/key
```
