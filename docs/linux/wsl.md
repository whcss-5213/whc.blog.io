#### 修改密码

方法一：

1. 请打开 PowerShell，并使用以下命令进入默认 WSL 分发版的根目录：`wsl -u root`

   > 如果需要在非默认分发版中更新忘记的密码，请使用命令：`wsl -d Debian -u root`，并将 `Debian` 替换为目标分发版的名称。

2. 在 PowerShell 内的根级别打开 WSL 发行版后，可使用此命令更新密码：`passwd <username>`，其中 `<username>` 是发行版中帐户的用户名，而你忘记了它的密码。

3. 系统将提示你输入新的 UNIX 密码，然后确认该密码。 在被告知密码已成功更新后，请使用以下命令在 PowerShell 内关闭 WSL：`exit`。

方法二：

打开CMD或PowerShell，输入`ubuntu config --default-user root`，修改ubuntu系统默认用户为root，再打开bash输入`passwd root`，修改用户密码。