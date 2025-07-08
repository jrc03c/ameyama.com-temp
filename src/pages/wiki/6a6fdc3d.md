---
title: >-
  Perform principle component analysis (PCA) using singular value decomposition
  (SVD)
tags:
  - data-science
  - math
  - programming
  - wiki
permalink: /wiki/6a6fdc3d/
layout: page
---

One method for performing PCA on a matrix and getting its factor loadings and eigenvalues is to use SVD as follows:

Given matrix <katex>M</katex>:

1. Compute the correlation matrix of <katex>M</katex> (i.e., the matrix of all of its columns' correlations to each other).
2. Perform SVD on the correlation matrix.
3. Get the loadings and eigenvalues, which are <katex>U</katex> and the positive non-zero values in <katex>\Sigma</katex>.

In pseudo-code:

```js
const C = correlationMatrix(M)
const { U, S, VT } = svd(C)
const loadings = U
const eigenvalues = flatten(S).filter(v => v > 0)
```
