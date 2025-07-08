---
title: Site Update
layout: post
tags: post
id: 43d382d1
permalink: /blog/43d382d1/
---

> **UPDATE #2:** Well, in the end, I didn't like this new build system very much. I mean, parts of it were nice, but it ended up feeling overly complicated. Also, I just like JS-free sites so damn much. So, we're back to Jekyll again!

> **UPDATE:** So, I went ahead and implemented my last suggestion. So, now, instead of downloading one giant-ass JSON file for the whole site, you only download a ~17KB JSON file! Then, when you request a particular blog post, the relevant Markdown file is downloaded client-side. Hooray!

So, I've made a major update to this site. Where it was previously a bunch of JS-free static files, it's now a single-page web app. Why the change? Well, I've basically been wanting for a while to make the site more flexible and adaptable. Liquid templates were holding me back; I could only do so much data-wise with them. I wanted, for example, to have a page that organized the blog posts by tag. That was _technically_ possible with Liquid but agonizingly tedious to work out in practice in that system. Now, however, I can import all of the site data with JS and do whatever I want with it.

So, the new system works like this: I write my pages and posts in Markdown with front-matter (just like Jekyll / Liquid), but then I parse and compile them on the back end into a single, giant JSON file and an RSS / XML file. Then, on the front end, I fetch the JSON file and display the pages and posts in components using Vue.

I went back and forth about making this change for a long time because I really like JS-free sites. The web has become so bloated that the vast majority of sites are a pain to use. The old version of this site didn't have JS at all, and it was super fast, and I loved that about it. But I also decided eventually that it wasn't necessary to throw the baby out with the bath water and that I could still have a relatively fast site that incorporated JS. There are probably lighter frameworks than Vue out there that would've made things even faster, but Vue is the one I know best, so it made the most sense for me right now. And perhaps there's a trade-off between speed and flexibility, but in this case, I was willing to trade what I saw as a massive increase in flexibility for a negligible (or maybe even non-existent) decrease in speed. I also see this as an experiment, and I'll be keeping a close eye on it for the next few weeks and months to see if it was worth it. Obviously, as the number of posts becomes increasingly large, the whole-site JSON file will grow proportionally, and the time to download will grow proportionally. In that sense, static files would win easily in a speed contest. So, maybe it'll make sense eventually to do something else, like compiling only an index for the posts and downloading only that index on the front end initially --- until a user requests a particular page, at which time I'd download and parse the Markdown file client-side. In fact, I may start working on something like that next.

Anyway, if you're interested in looking through the source, it's [here](https://gitlab.com/jrc03c/ameyama.com). Later!
