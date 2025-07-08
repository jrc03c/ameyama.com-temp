---
layout: post
title: Dithering
tags: post
id: c2a0c29b
permalink: /blog/c2a0c29b/
---

As I mentioned [a while back](/blog/48ecfc09/), I'm running my websites on a Raspberry Pi. At the moment, it's plugged into a wall power outlet as you'd expect. But I'd eventually like to run it on solar power. I don't know how soon that'll be; I have a lot of learning to do in that respect. But I've found a couple of resources for education and inspiration [here](https://homebrewserver.club/low-tech-website-howto.html) and [here](https://solar.lowtechmagazine.com/).

In the meantime, I've started trying to pare down the resources needed to serve the sites. The first step has been to implement image dithering to reduce image size. I first wrote my own implementation based on what I learned in [this excellent article](https://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/). It worked, but it was _super_ slow. So, instead, I opted to use [ditherjs](https://github.com/danielepiccone/ditherjs), followed by [Trimage](https://trimage.org/). All of the images on this site have now been dithered! Hooray!

Just for fun, here's a dithered image of my new favorite reading spot! After resizing, dithering, and compressing, it went from 837KB down to 32KB, a 96% reduction!

![/res/media/couch.jpg](/res/media/couch.png)
