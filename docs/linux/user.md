---
title: Linux-用户
---
1. **添加用户**
   - `useradd`：用于创建一个新用户。例如，`sudo useradd newuser` 会创建一个名为 newuser 的新用户。
   - `adduser`：这是 `useradd` 命令的一个更友好的前端，提供了交互式界面来设置用户密码和其他信息。例如，`sudo adduser newuser`。

2. **删除用户**
   - `userdel`：用于删除一个用户。例如，`sudo userdel newuser` 会删除名为 newuser 的用户。如果希望同时删除用户的家目录和邮件池，可以使用 `-r` 选项：`sudo userdel -r newuser`。

3. **修改用户信息**
   - `usermod`：用于修改用户信息，如用户名、用户组、家目录等。例如，`sudo usermod -l newusername oldusername` 会将 oldusername 改名为 newusername。
   - `passwd`：用于更改用户密码。例如，`sudo passwd newuser` 会提示你为 newuser 用户设置新密码。
s
4. **查看用户信息**
   - `id`：显示用户的 UID（用户ID）、GID（组ID）以及用户所属的所有组。例如，`id newuser` 会显示 newuser 用户的相关信息。
   - `who`：显示当前登录系统的所有用户。
   - `w`：显示当前登录用户的详细信息，包括他们正在执行的命令、登录时间、CPU 和内存使用情况等。
   - `finger`：如果已安装，可以提供关于用户的更详细信息，如全名、办公地点、电话号码等。

5. **用户组管理**
   - `groupadd`：添加一个新组。例如，`sudo groupadd newgroup` 会创建一个名为 newgroup 的新组。
   - `groupdel`：删除一个组。例如，`sudo groupdel newgroup` 会删除名为 newgroup 的组。
   - `usermod -aG`：将用户添加到一个或多个附加组。例如，`sudo usermod -aG newgroup newuser` 会将 newuser 用户添加到 newgroup 组中。
   - `gpasswd`：用于管理组密码和组成员。例如，`sudo gpasswd newgroup` 可以设置 newgroup 组的密码或添加/删除组成员。

6. **切换用户**
   - `su`：用于切换当前用户。例如，`su newuser` 会切换到 newuser 用户（需要输入该用户的密码）。使用 `su -` 可以切换到 root 用户并加载 root 用户的环境变量。
   - `sudo`：允许普通用户以超级用户（通常是 root）的权限执行命令。例如，`sudo somecommand` 会以 root 权限执行 somecommand 命令。
