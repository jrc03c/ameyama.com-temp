---
title: Encrypting a partition with LUKS in Linux
tags:
  - decryption
  - disk
  - encryption
  - linux
  - partition
  - privacy
  - security
  - wiki
permalink: /wiki/cb28eafd/
layout: page
---

**Set up an encrypted partition**

```bash
# format the encryption using luks
sudo cryptsetup luksFormat /dev/sdXY

# open the partition
sudo cryptsetup luksOpen /dev/sdXY some_name

# create a filesystem
sudo mkfs.ext4 /dev/mapper/some_name

# close the partition
sudo cryptsetup luksClose some_name
```

**Mount the partition**

```bash
sudo cryptsetup luksOpen /dev/sdXY some_name
sudo mount /dev/mapper/some_name /some/path
```

**Unmount the partition**

```bash
sudo umount /some/path
sudo cryptsetup luksClose some_name
```

**Add extra keys**

My RaspberryPI doesn't have enough memory to open a partition that's been encrypted with LUKS2 (the default scheme used above). One solution to this problem is to add an extra key that requires less memory to use. The first step is to see which key slots have already been used:

```bash
sudo cryptsetup luksDump /dev/sdXY
```

If you've just finished setting up the partition using the steps above, then you'll probably have only used key slot #0, in which case key slot #1 should be open. To specify that we want to use slot #1, we pass the `-S` option in the following command; and to specify that we want to use a less memory-intensive scheme, we pass the `--pbkdf` option:

```bash
sudo cryptsetup luksAddKey -S 1 --pbkdf pbkdf2 /dev/sdXY
```

Finally, when we're ready to mount the partition on a machine with low memory, we use the same `luksOpen` command as above but also add the `-S` option to indicate that we intend to target key slot #1:

```bash
sudo cryptsetup luksOpen -S 1 /dev/sdXY some_name
```

(You can also use this low-memory strategy to configure the partition for the first time instead of using it to add a key after the partition has already been configured!)
