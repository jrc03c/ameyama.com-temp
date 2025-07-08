---
title: Normalizing audio with Python
tags:
  - audio
  - music
  - programming
  - python
  - wiki
permalink: /wiki/f7aef5ef/
layout: page
---

From [here](https://stackoverflow.com/a/57815168):

```python
from pydub import AudioSegment, effects

rawsound = AudioSegment.from_file("./input.m4a", "m4a")
normalizedsound = effects.normalize(rawsound)
normalizedsound.export("./output.wav", format="wav")
```

Note that the above example outputs a WAV file. To output M4A, use `format="mp4"`.
