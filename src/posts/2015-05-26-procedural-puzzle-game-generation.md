---
layout: post
title: Procedural Puzzle Game Generation
comments: true
tags: post
id: 331663f1
permalink: /blog/331663f1/
---

So, I've been working on a procedural puzzle game generation algorithm. I should stress that this algorithm produces puzzle _games_, not necessarily puzzles themselves ... though I suppose that if a game is filled with puzzles, then it is itself a kind of puzzle. Nevertheless, I wanted to share my algorithm here both as a reference for myself and as inspiration for others.

Before I show you the algorithm and some examples, let me clarify a few bits of terminology. I'll be using (probably not entirely accurately) words from graph theory, as well as the words _lock_ and _key_. The words from graph theory, such as _node_ and _edge_, will be used in their normal, technical sense, though I suppose I should note that nodes don't necessarily always represent locations; sometimes, they may represent states of the game. The words _lock_ and _key_, however, must be expanded. In this article, anything is a _lock_ if it modifies the edge of a graph to make it untraversable or extremely costly to traverse. And a _key_, then, is anything that modifies a locked edge to make it traversable or cheap to traverse. An obvious example, of course, is of a physical lock and physical key, where the physical lock modifies the passage (edge) between two rooms (nodes) to make it untraversable, and the key makes it traversable again. But let's remember that the terminology works equally well for states as it does for locations. For example, imagine that you've received an enciphered note that can only be deciphered by use of an algorithm (like ROT13). The two relevant nodes in this case are (1) the state in which you do not understand the contents of the note and (2) the state in which you do understand the contents of the note. The relevant edge between these two nodes is the reading of the note; it's the "passageway" between the two states. The encryption of the note acts as a lock on the edge, preventing reading (i.e., passage). And, of course, the function (ROT13 or whatever) acts as a key to that lock, allowing passage through the edge. Lastly, I should also like to add that locks are allowed to require multiple keys. The Doors of Durin from _The Lord of the Rings_ are a great example of this, as they require both moonlight / starlight and a password.

With those terms clarified, I should also say that what this algorithm does is create a graph and place locks and keys on the edges and nodes ... but it does not know anything about what _kind_ of locks or keys or nodes or edges these are. Therefore, it is (for now) up to the designer to implement the exact nature of those pieces.

All right. Now we're in a position to look at an overview of the algorithm. Here it is in broad strokes:

<ol>
	<li>Create a start node.</li>
	<li>Add a lot of extra nodes and edges to the start and to each other.</li>
	<li>Add a node far from the start to the list of goal nodes.</li>
	<li>For <i>n</i> iterations (i.e., until having reached the desired complexity), do the following:</li>

    <ol style="list-style-type: lower-alpha;">
    	<li>Select the first goal node in the list of goal nodes and set it as the current goal.</li>
    	<li>Make sure that the current goal node can only be reached from the start by a single edge; remove any extra edges if necessary.</li>
    	<li>Place a lock on the single edge connecting the current goal node to the rest of the graph. This lock can require any number of keys.</li>
    	<li>Place the keys for the lock on other nodes far from the start node and <i>not</i> anywhere behind the locked edge.</li>
    	<li>Add each of the nodes containing these new keys to the list of goal nodes (if they're not already in it).</li>
    	<li>Remove the current goal node from the list of goal nodes.</li>
    </ol>

</ol>

This process produces a playable game. It looks a bit easy, a bit boring, if you imagine that all of the locks and keys are physical locks and keys ... but of course, you shouldn't do that. Remember that each lock can be entirely different in nature: some locks might be physical locks requiring a physical key, but they might also be an enciphered note or a raised drawbridge or a monster or computer login screen or anything else that prevents the player from moving forward without a key.

Here's the final version, in static mode. See if you can mentally play through it! The circles and lines are obviously nodes and edges. The start node is white, and the final goal node is black. The colored squares on the edges are the locks, and the colored triangles are keys. Paired keys and locks have the same color.

<p class="centered">
	<img src="/res/media/graph_static.png">
</p>

Now, as a bonus, here are some extra thoughts.

First, the algorithm currently only uses functional keys. But in order to add extra difficulty to a game, it might be fun to have the algorithm generate non-functional keys (i.e., red herrings). Remember, of course, that keys might look like anything: a dictionary to translate between languages, a slip of paper bearing a password in the form of a child's birthdate, a switch hidden behind some books on a bookshelf, etc. Therefore it will make the game all the more difficult (but probably more realistic as well) to include a wealth of extra details and dead ends. J.K. Rowling is an author who, in my opinion, does this masterfully. In fact, the concept of [Chekhov's gun](http://en.wikipedia.org/wiki/Chekhov%27s_gun) might even be the opposite of what we want in a good puzzle game. But I'm still on the fence about this one.

Second, I really like the possibility (and the algorithm above actually makes this an actuality) that you can carry around multiple keys at a time before finding their corresponding lock. The _Myst_ games were matchless in that respect. After finding a key, it might take the player hours or days to find the lock into which it fitted! And I loved that. It greatly increased the sense of mystery.

Third, one way in which the algorithm needs improvement is this: locked areas can only be reached through one edge. Obviously, that's enforced by step 4b listed above, so it's not as though this was an unexpected consequence. But I guess I'm saying that it might be more realistic for areas to be accessible by different routes. _Riven_ employed the multiple routes thing magnificently; the islands became radically more confusing when you could travel to them two or three different ways, which sometimes even allowed you to bypass a lock that had prevented you from reaching the island by a different route.

Fourth, the algorithm doesn't seem to handle some puzzle types. For example, _Hiversaires_ used resource management to make movement difficult late in the game. Each "key" opened any "lock," but had to be left in the lock to keep it open. So, if you had one key, you could open one locked door, but then if there was a subsequent locked door, then you were out of luck until either you found a way to move about the world to bypass the lock or else you found another key. I'm fairly certain that my algorithm could not produce such a game mechanic, primarily because of the way I've implemented the relationship between locks and keys. More specifically, a key (or set of keys) basically just dissolves a lock; they nullify each other. But in order to employ a _Hiversaires_-like mechanic, it would be necessary for keys to work on multiple locks and to remain in the locks ... which would require different kinds of pathfinding thinking when worrying about how players would traverse the graph. To look under the hood of my algorithm a bit, I'll note that my algorithm selects the nodes for placement of the keys based on whether they are reachable (i.e., that a path can be found) from the start node. More specifically still, it performs an A* search to find a path that does not take keys into account. So, to incorporate the resource management puzzles, it might be necessary to factor keys into the A* algorithm.

Fifth, I said it before, but I'll just remind you: this algorithm doesn't actually create puzzles; it only creates the graph. Therefore, you, the designer, must create and implement the various types of nodes, edges, locks, and keys. But I do have some thoughts about the sorts of relationships between these pieces that can be realistically expected by the player. Let's talk about nodes for a moment. If we imagine for a moment that all nodes are locations, then we can make certain assumptions that lend credibility to our world. For example, imagine that we have two nodes, A (start) and B (goal), that are connected by a locked edge. We can ask certain questions to help reveal the nature of the relationship between A and B. For example, could A be an open field and B be a house? (In other words, could you potentially be locked _out of_ the house?) Yes, I think that such a scenario is easily believable. Could A be a house and B be an open field? (In other words, could you potentially be locked _inside of_ the house?) Yes, I think that this is also believable. Could A be a room and B be a box? (In other words, could you potentially be locked _out of_ a box?) Yes, I think that this is believable. Could A be a box and B be a room? (In other words, could you potentially be locked _inside of_ a box?) Hm ... this one is a bit harder. I guess it depends on the kind of box. If you're a genie stuck in a lamp, then yes, it's possible. But if you're a human, then you probably can't be locked in a jewelry box. But unless we want our story to feel like _Alice in Wonderland_, we'd probably have to stop at this scale; it's hard to imagine smaller boxes within the box. So, as an initial conclusion, scale seems to matter for realism. Before we leave physical nodes, let's point out one other thing: while a node may _logically_ be a child of another node (and therefore graphically separate from it), it may _spatially_ exist within its parent node. Again, take the example of the room and the box. Graphically / logically, the nodes appear to exist in different locations ... but in the physical world, the one actually exists inside of the other. Therefore, we can sometimes (but not always, since sometimes rooms can connect to other rooms rather than simply to boxes) be limited in the kinds of child nodes that are available for any node.

Sixth, the more I think about it, the less sure I am that what I've created is actually a "puzzle" game generator. After all, I mentioned near the beginning that a lock could be anything that makes an edge impassable --- _including monsters_. But if monsters are included, then it almost seems as though any sort of adventure game could be created ... even games that have no "puzzle" elements at all! I'm too dull to see whether what I'm working on is game form in general, or puzzle form in general, or some combination of the two, or something even more basic, more general (like [knot theory](http://en.wikipedia.org/wiki/Knot_theory)). And also, although I stressed at the beginning that nodes weren't just locations but could also represent states, it's still really hard to think in terms of states; it's so much easier to imagine each node to be a place. So, I don't know what that means.

Whew! So, what thoughts do you have?
