---
layout: post
title: "Procedural Puzzle Follow-Up #1"
comments: true
tags: post
id: 1f965765
permalink: /blog/1f965765/
---

So, I've been doing some thinking about my [procedural puzzle game generation algorithm](/blog/331663f1/), and I've come to a few more conclusions. When I've come to a sufficiently large number of conclusions, I'll probably re-write that article, or make it a page, or both.

Here's the first thought: I don't know why I put "make a start node" as the first step, since what really matters is just that the _graph itself_ be generated first. _Then_, if you like, you can select the start and goal nodes. The reason that this realization is important is that it'll free me to up generate the world much more organically and less prefabricatedly (maybe), and then worry about the locks and keys.

Here's the process I'm going to try to follow for generating the world, then. (NOTE: I haven't done any research on this, so these steps are just off the top of my head and will probably fail to work completely.)

1. Make an ocean (i.e., a flat plane of water).
2. Make islands in the ocean (i.e., flat planes of land).
3. Make heightmaps for the islands from noise functions.
4. Select random locations within the bounds of each island (and that are above sea level) as potential locations for villages.
5. Select random locations within the bounds of each village as potential locations for buildings.
6. Select random locations within the bounds of each building as potential locations for rooms.
7. Put together several rooms in the location of each building, and perform "sanity checks" (to be specified later) on the building.
8. Select random locations within the bounds of each room as potential locations for boxes.
9. Place boxes.
10. Generate non-natural connections between hierarchical items. Natural connections will include normal spatial relations (like the fact that a building is sitting on the ground and is therefore to some degree accessible from the ground). Non-natural connections will include things like bridges, stairs, tunnels, skyways, tram lines, boats, etc.

With all these steps done, we'll _probably_ be in a position to run the rest of the algorithm and actually lock down these "edges" (connections) and place keys around the world. I'm going to try it out!
