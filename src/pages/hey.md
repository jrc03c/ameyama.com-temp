---
title: "Hey!"
layout: page
permalink: /hey/
---

<style>
  #count {
    background-color: #d0f4f1;
  }
</style>

<blockquote id="count">
  Loading...
</blockquote>

Thanks for dropping by to say hi! Any time you visit this page, my little Raspberry Pi will light up like this:

<video width="100%" controls>
  <source src="/res/other/rpi-hey.mp4">
</video>

Or, if this wasn't what you wanted to do, you can find other ways to contact me at the bottom of the page!

<script>
  window.onload = async function(){
    let response = await fetch("https://ameyama.com/api/hey")
    let data = await response.json()
    let countElement = document.getElementById("count")
    countElement.innerHTML = `Hit count: ${data.count} hits so far! Thanks! And hey to you, too! :)`
  }
</script>
