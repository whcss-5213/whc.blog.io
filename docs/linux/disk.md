# Disk

## lsblk
列出块设备信息（硬盘、分区、U盘等）

```bash
# 查看设备及权限、属主信息
lsblk -m

# 简洁列表输出，不显示表头和循环设备
lsblk -lmn

# 查看所有设备（包括空设备）
lsblk -a

# 只显示磁盘，不显示分区
lsblk -d

# 显示文件系统类型
lsblk -f
```



## du
查看**目录/文件占用空间大小**（disk usage）

```bash
# 查看当前目录总大小
du -sh

# 查看指定目录大小
du -sh /path

# 显示目录下所有一级子目录大小
du -sh *

# 以MB/GB为单位显示
du -h

# 只显示总计
du -s

# 包含隐藏文件，按大小排序
du -sh .[^.]* * | sort -h
```

常用组合：`du -h --max-depth=1` 查看一级目录大小



## df
查看**磁盘挂载与剩余空间**（disk free）

```bash
# 人类可读单位显示
df -h

# 显示文件系统类型
df -T

# 查看所有文件系统（包括虚拟文件系统）
df -a

# 只显示指定文件系统类型
df -t ext4
df -x tmpfs
```

常用：`df -h` 最常用，直接看硬盘使用率、剩余空间



## 额外常用磁盘命令
```bash
# 查看磁盘分区表
fdisk -l

# 查看挂载情况
mount

# 查看磁盘IO状态
iostat

# 扫描新磁盘/重新扫描分区
echo "- - -" > /sys/class/scsi_host/host0/scan
```

