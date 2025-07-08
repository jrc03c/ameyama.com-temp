---
title: Setting Up Orca on Ubuntu 18.04.1 LTS with SunVox
layout: post
tags: post
id: '79e62722'
permalink: /blog/79e62722/
---

It's fairly straightforward to set up [ORCΛ](https://github.com/hundredrabbits/orca) on Ubuntu for use with [SunVox](http://www.warmplace.ru/soft/sunvox/), and though I haven't really gotten a chance to do anything advanced with it yet, these instructions at least got me off the ground.

Here's a video of the process. The written instructions are below.

<video width="100%" controls>
	<source src="/res/media/orca-sunvox-linux.mp4">
</video>

So, first, launch SunVox. Open the Preferences from the little menu at the top left. Select the MIDI submenu. Click on "MIDI controller 1" and choose "Midi Through Port-0" from the drop-down list. Then close the preferences.

Next, launch Orca. Press CTRL+. to open the JavaScript console. Type:

{% highlight js %}
terminal.io.midi.list()
{% endhighlight %}

This will list the available MIDI controllers. Note the index (place) in the list of the device with the same name as the SunVox controller: "Midi Through Port-0". Then type:

{% highlight js %}
terminal.io.midi.select(0)
{% endhighlight %}

I used `0` in this example because that was the index of the device with the name "Midi Through Port-0" on my machine, but your index might be different.

Next, press CTRL+. to close the JS console. Now open an Orca project file. You can use one from the "examples" folder if you don't have any of your own yet. It should start playing automatically.

Orca will control whatever instrument is currently selected in SunVox. So, to switch instruments, just click on a different module (synth, effect, etc.).

And that's it! There are probably other and better ways to set it up, but since I know virtually nothing about MIDI, this is as far as I can take you. Good luck, and let me know how it goes!
