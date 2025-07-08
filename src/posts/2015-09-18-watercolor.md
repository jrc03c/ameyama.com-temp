---
layout: post
title: Watercolor
comments: true
thumbnail: /res/media/watercolor_final.png
tags: post
id: 984e06c7
permalink: /blog/984e06c7/
---

I probably mentioned that I've been trying to make a little virtual study in Unity. But I've run into one small nag: I don't really like the extraordinarily low-poly, textureless feel needed to achieve acceptable speeds on my janky old iPhone 4. (Don't get me wrong; that art style is great for some projects ... it's just not good for this one.) So I've been working towards making a 2D, texture-only version. I've also wanted a more unusual art style, so I spent today creating a watercolor algorithm. In broad strokes, it uses a very slightly modified version of the _K_-means algorithm. Here it is in a little more detail:

<p>
	<ol style="list-style-type:decimal">
		<li><b>Draw the original image.</b></li>
		<li><b>Draw monochromatic ellipses</b> of varying sizes, intensities, and opacities all over the original. (This is what lends the image the blotchy look later.)</li>
		<li><b>Make some centroids</b> for the <i>K</i>-Means algorithm.</li>
		<li><b>Until satisfied:</b></li>
			<ol style="list-style-type:lower-alpha">
				<li>Blur the entire image with a Gaussian blur.</li>
				<li>Apply a very slightly modified <i>K</i>-Means algorithm using these steps:</li>
					<ol style="list-style-type:lower-roman">
						<li>Assign every pixel to a centroid based on an average of the pixel's screen-space distance from the centroid and its color distance from the centroid's average color.</li>
						<li>Move every centroid to the average location of its pixels.</li>
						<li>Set every centroid's average color to the average of its pixels.</li>
						<li>Lerp every centroid's pixel colors a small way towards its average color.</li>
					</ol>
			</ol>
		<li><b>Apply post-processing effects:</b></li>
			<ol style="list-style-type:lower-alpha">
				<li>Draw the original image almost completely transparently over the new image. This prevents from the final image from looking like someone just spilled lots of colored paints on a canvas.</li>
				<li>Add a small bit of monochromatic noise to the entire image.</li>
			</ol>
	</ol>
</p>

It's not perfect yet, but it's good enough for government work. Here's an example of the results produced by this algorithm:

_Before:_

<img class="center-block img-responsive" src="/res/media/watercolor_original.jpg">

_After:_

<img class="center-block img-responsive" src="/res/media/watercolor_final.png">
