# Vim

## vim

![alt vim](https://www.runoob.com/wp-content/uploads/2015/10/vi-vim-cheat-sheet-sch.gif)

**配置文件**
全局配置文件 /etc/vim/vimrc
用户个性化的Vim配置位于~/.vimrc

## **命令模式（Command mode）**

- **i** 切换到输入模式，以输入字符。
  ![](../../public/vim/vim-2.png)
- **yy** 复制当前行
- **p** 粘贴
- **dd** 删除
- **x** 删除当前光标所在处的字符。
-
- **:** 切换到底线命令模式，以在最底一行输入命令。

## **输入模式（Insert mode）**

- **ESC**，退出输入模式，切换到命令模式
- **字符按键以及Shift组合**，输入字符
- **ENTER**，回车键，换行
- **BACK SPACE**，退格键，删除光标前一个字符
- **DEL**，删除键，删除光标后一个字符
- **方向键**，在文本中移动光标
- **HOME**/**END**，移动光标到行首/行尾
- **Page Up**/**Page Down**，上/下翻页
- **Insert**，切换光标为输入/替换模式，光标将变成竖线/下划线

**底线命令模式（Last line mode）**

在命令模式下按下:（英文冒号）就进入了底线命令模式。

```shell
:set number				" 显示行号
:set nonumber			" 关闭行号

:set tabstop=4 			" 设置 tab space 为4个空格
:set ts=4				" 同 tabstop
:set expandtab			" 将tab替换为指定数量的空格
:set autoindent			" 设置为自动缩进

:set background=dark		" 设置背景颜色

:set guifont=consolas:h14		" 设置字体为 consolas，字号为14

:set history=700		" 设置保存命令的行数

:set autoread		" 设置当文件变化时，自动读取新文件

:set wrap		" 启动折行
:set nowrap		" 禁止折行

" 切换文件格式，ff是 fileformat 的缩写
:set ff=unix			" 将文件切换为 unix 格式，每行以 "\n" 结尾
:set ff=dos				" 切换为 Windows 格式，每行以 "\r\n" 结尾

" 设置编码格式
:set encoding=utf-8			" 设置 vim 展示文本时的编码格式
:set fileencoding=utf-8		" 设置 vim 写入文件时的编码格式

:set filetype=html			" 设定文件类型，方便语法高亮

:set hlsearch				" 高亮显示搜索结果

:set paste					" 设置为 paste 模式，在粘贴前设置该模式，可以避免各种 auto-formating
:set nopaste				" 切换回 normal 模式

:set [keyword]? " 查询当前状态的命令
```
