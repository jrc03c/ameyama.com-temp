---
title: Run a Node script as a process that never dies
tags:
  - javascript
  - node
  - programming
  - web
  - wiki
permalink: /wiki/ffbe61a0/
layout: page
---

```bash
nohup node script.js > /dev/null 2>&1 &
```

1. `nohup` means: Do not terminate this process even when the stty is cut off.
2. `> /dev/null` means: stdout goes to /dev/null (which is a dummy device that does not record any output).
3. `2>&1` means: stderr also goes to the stdout (which is already redirected to /dev/null). You may replace &1 with a file path to keep a log of errors, e.g.: 2>/tmp/myLog
4. `&` at the end means: run this command as a background task.

### Sources

- [https://stackoverflow.com/a/11856575](https://stackoverflow.com/a/11856575)
