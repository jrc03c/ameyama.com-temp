---
title: Running a script on reboot using `systemd` (instead of `cron`)
tags:
  - linux
  - wiki
permalink: /wiki/da5c5e1f/
layout: page
---

0. (Optional) Study the example service definitions in `/usr/lib/systemd/system`.

1. Create a new service file in `/etc/systemd/system` with a ".service" extension. Here's an example that will run a bash script at boot time:

```
[Unit]
Description=A Simple Script

[Install]
WantedBy=multi-user.target

[Service]
ExecStart=/bin/bash /path/to/script.sh
Type=simple
User=josh
Group=josh
WorkingDirectory=/home/josh
Restart=on-failure
```

2. Start the service once.

```bash
sudo systemctl daemon-reload
sudo systemctl start <whatever>.service
```

3. If the above worked, then set it to run every time the computer restarts.

```bash
sudo systemctl enable <whatever>.service
```

> **NOTE:** According to [the docs](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html): "...shell command lines are not directly supported. If shell command lines are to be used, they need to be passed explicitly to a shell implementation of some kind. Example:"
>
> `ExecStart=sh -c 'dmesg | tac'"`
