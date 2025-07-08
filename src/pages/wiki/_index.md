---
title: Wiki
layout: page
permalink: /wiki/
---

<style>
  ul,
  ul li {
    margin: 0 0 var(--spacing-xs) 0;
    padding: 0;
  }

  ul {
    margin-left: calc(1em - 2px);
  }
</style>

<ul>
{% for page in collections.wiki %}
  <li>
    <a href="{{ page.url }}">
      {{ page.data.title }}
    </a>
  </li>
{% endfor %}
</ul>
