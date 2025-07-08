---
title: Fix app icons in KDE
tags:
  - atomic
  - distro
  - fedora
  - immutable
  - kde
  - kinoite
  - linux
  - wiki
permalink: /wiki/a30ef0db/
layout: page
---

In KDE, app icons are often replaced with a generic [Wayland icon](https://duckduckgo.com/?t=ffab&q=wayland+icon&iax=images&ia=images). Since this is both incorrect and horrible, here's a manual way to fix it (on a per-application basis).

1. When an application window is open, right-click on the titlebar.
2. Select "More Actions" → "Configure Special Application Settings".
3. In the window that opens, click the "Add Property" button near the bottom.
4. In the pop-up, select "Desktop file name".
5. In the settings of the new property, select "Force" from the dropdown, and enter the name of the `.desktop` file that includes the correct application settings (i.e., that includes the correct icon). For example, if the relevant `.desktop` file is located at `/usr/share/appliations/my-cool-app.desktop`, then enter "my-cool-app" in the text field.
6. Click the "Apply" and "Okay" buttons at the bottom of the window. The app icon should be changed immediately.
