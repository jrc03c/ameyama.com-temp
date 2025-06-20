---
layout: default
title: My Cool Site
permalink: /just-a-backup-index-page/
---

Hello, world! Here are my blog posts:

<ul class="no-padding-left">
{% for post in collections.posts %}
  <li>
    <a href="{{ post.url }}">
      {{ post.data.title }}
    </a>
  </li>
{% endfor %}
</ul>
