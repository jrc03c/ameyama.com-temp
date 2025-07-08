---
title: Git cheat sheet
tags:
  - git
  - programming
  - wiki
permalink: /wiki/d4d21cfa/
layout: page
---

Search for a file in a repo's commit history:

```bash
git log --all --full-history -- **/theFile.*
```

Count the number of commits for a revision (e.g., a branch):

```bash
# syntax:
git rev-list --count <revision>

# example:
git rev-list --count my-branch
```

Count the number of commits across all branches:

```bash
git rev-list --count --all
```

### Sources

- [https://stackoverflow.com/a/54040342](https://stackoverflow.com/a/54040342)
- [https://stackoverflow.com/a/4061706](https://stackoverflow.com/a/4061706)
