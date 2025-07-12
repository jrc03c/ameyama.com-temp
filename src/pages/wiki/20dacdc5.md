---
title: Looping a video to fit over an audio file
tags:
  - audio
  - linux
  - video
  - wiki
permalink: /wiki/20dacdc5/
layout: page
---

```bash
ffmpeg  -stream_loop -1 -i 1.mp4 -c copy -v 0 -f nut - | ffmpeg -thread_queue_size 10K -i - -i 1.mp3 -c copy -map 0:v -map 1:a -shortest -y out.mp4
```

### Sources

- [https://video.stackexchange.com/a/23394](https://video.stackexchange.com/a/23394)
