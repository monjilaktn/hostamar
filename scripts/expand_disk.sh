#!/bin/bash
# scripts/expand_disk.sh
# Automatically expands the root partition to use all available space

echo "========================================"
echo "   Hostamar Disk Expansion Utility"
echo "========================================"

# 1. Expand Partition
echo "[+] Growing partition 1 on /dev/sda..."
if sudo growpart /dev/sda 1; then
    echo "    -> Partition expanded."
else
    echo "    -> Partition likely already expanded or busy. Continuing..."
fi

# 2. Resize Filesystem
echo "[+] Resizing filesystem..."
sudo resize2fs /dev/sda1

# 3. Show Result
echo "========================================"
echo "   New Disk Usage Status:"
echo "========================================"
df -h /
