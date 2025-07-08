---
title: Blog
layout: page
permalink: /blog/
---

{% assign posts_reversed = collections.post | reverse %}
{% for post in posts_reversed %}
<div style="margin-bottom: var(--spacing)">
  <div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
  <span style="opacity: 0.33">{{ post.date | to-iso }}</span>
</div>
{% endfor %}
