# Git

## 初始化

```shell
git config --global user.name "填写自己的用户名" # 配置个人用户名
git config --global user.email "填写自己的邮箱号"  # 电子邮件地址
git config --global core.autocrlf false # 结束符CRLF和LF 之间转换
```

## git status

查看当前文件的状态

## git stash

将当前工作目录中尚未提交的所有更改（包括暂存区和未暂存的修改）临时存储到stash堆栈中

- git stash save
  ```shell
  git stash save -u "注释"
  # -u 表示还工作区中新增的文件
  # 不加u只会存储工作区中已经存在的文件的修改
  ```
- git stash list
- git stash push 同 save
- git stash pop 弹出
- git stash apply 读
- git stash drop 删

## git add

- 把指定的文件添加到暂存区中
- git add `文件路径`


- 添加所有修改、已删除的文件到暂存区中

- git add -u `文件路径`

- git add --update `文件路径`


- 添加所有修改、已删除、新增的文件到暂存区中，省略 `文件路径` 即为当前目录

- git add -A `文件路径`

- git add --all `文件路径`


- 查看所有修改、已删除但没有提交的文件，进入一个子命令系统

- git add -i `文件路径`

- git add --interactive `文件路径`

## git commit

- 把暂存区中的文件提交到本地仓库，调用文本编辑器输入该次提交的描述信息

- git commit


- 把暂存区中的文件提交到本地仓库中并添加描述信息

- git commit -m"`提交的描述信息`"


- 把所有修改、已删除的文件提交到本地仓库中

- 不包括未被版本库跟踪的文件，等同于先调用了 "git add -u"

- git commit -a -m "`提交的描述信息`"


- 修改上次提交的描述信息

- git commit --amend

- git commit --amend --no-edit

## git log

显示提交的记录。

- git log
- git log --pretty=oneline
- git log --oneline
- git log --pretty=short
- 空格 下翻页 b 上翻页 q 退出

- 打印从第一次提交到指定的提交的记录
  git log `commit ID`

- 包含回滚信息
  git reflog

## git shortlog

用于生成提交者的统计信息，它会按照提交者对提交的数量进行汇总并展示

```shell
git shortlog -s -n
```

- -n 根据每个作者的提交数量对输出进行排序，而不是按照作者的字母顺序。
- -s summary,省略 commit 的注释,只提供提交计数摘要。
- -e 显示每个作者的电子邮件地址。

## git reset

还原提交记录。

- 重置暂存区，但文件不受影响

- 相当于将用 "git add" 命令更新到暂存区的内容撤出暂存区，可以指定文件

- 没有指定 commit ID 则默认为当前 HEAD

- git reset `文件路径`

- git reset --mixed `文件路径`


- 将 HEAD 的指向改变，撤销到指定的提交记录，文件未修改

- git reset `commit ID`

- git reset --mixed `commit ID`


- 将 HEAD 的指向改变，撤销到指定的提交记录，文件未修改

- 相当于调用 "git reset --mixed" 命令后又做了一次 "git add"

- git reset --soft `commit ID`


- 将 HEAD 的指向改变，撤销到指定的提交记录，文件也修改了

- git reset --hard `commit ID`

- git reset --hard HEAD~3 回退3步

- git reset --hard HEAD^^^ 回退3步

- --soft 在本地库（历史区）移动HEAD指针

- --mixed 在本地库移动HEAD指针 重置暂存区，

- --hard 在本地库移动HEAD指针 重置暂存区和工作区。


## git  rebase

- git rebase -i
    - p, pick = use commit
    - r, reword = use commit, but edit the commit message
    - e, edit = use commit, but stop for amending
    - s, squash = use commit, but meld into previous commit
    - f, fixup = like "squash", but discard this commit's log message
    - x, exec = run command (the rest of the line) using shell
    - d, drop = remove commit

- 不要在 master（公共） 分支 rebase

- 找到两条节点的共同节点

- 把共同节点后的提交嫁接到目标分支上

- 嫁接节点的 commit 值会改变

- 移动HEAD到最新的commit处

  git - --continue

## git revert

会产生新的提交记录
````shell
git revert -e <commit ID> # 默认选项
git revert --no-edit <commit ID>
# 会把当前 commit 和要 revert 的 commit 的上一个 commit 合并成一个新的 commit
git revert  -n / --no-commit  <commit ID>
# 不会自动产生commit，把改动的代码加到工作区和暂存区，用户可以自行修改并提交commit。
````
reset命令是重置到一个记录：git reset 是将之前的提交记录全部抹去，将 HEAD 指向自己重置的提交记录.

revert命令是撤回一个记录；git revert 操作是撤回某一次提交记录，若之后又有提交，提交记录还存在.


## git merge

- git merge
- 合并分支。
- 把指定的分支合并到当前所在的分支下
- 根据两分支的共同节点和最新节点生成一个新的提交 commit
- git merge `分支名称`

## git cherry-pick

- 把已经提交的记录合并到当前分支。
- git cherry-pick  `commit ID`
- pick 两个节点 1和3
- git cherry-pick  `commit ID1` `commit ID3`
- pick （节点1，节点3] 不包含节点1
- git cherry-pick  `commit ID1`  .. `commit ID3`
- pick [节点1，节点3] 包含节点1
- git cherry-pick  `commit ID1`  ^.. `commit ID3`

## git tag

操作标签的命令。

- 打印所有的标签

- git tag


- 添加轻量标签，指向提交对象的引用，可以指定之前的提交记录

- git tag `标签名称` `commit ID`


- 添加带有描述信息的附注标签，可以指定之前的提交记录

- git tag -a `标签名称` -m `标签描述信息` `commit ID`


- 切换到指定的标签

- git checkout `标签名称`


- 查看标签的信息

- git show `标签名称`


- 删除指定的标签

- git tag -d `标签名称`

## git mv

- 重命名文件或者文件夹。
- 重命名指定的文件或者文件夹
- git mv `源文件/文件夹` `目标文件/文件夹`

## git rm

- 删除文件或者文件夹。

- 移除跟踪指定的文件，并从本地仓库的文件夹中删除

- git rm `文件路径`


- 移除跟踪指定的文件夹，并从本地仓库的文件夹中删除

- git rm -r `文件夹路径`


- 移除跟踪指定的文件，在本地仓库的文件夹中保留该文件

- git rm --cached

## git remote

- 操作远程库。

- 列出已经存在的远程仓库

- git remote


- 列出远程仓库的详细信息，在别名后面列出URL地址

- git remote -v

- git remote --verbose


- 添加远程仓库

- git remote add `远程仓库的别名` `远程仓库的URL地址`


- 修改远程仓库的别名

- git remote rename `原远程仓库的别名` `新的别名`


- 删除指定名称的远程仓库

- git remote remove `远程仓库的别名`


- 修改远程仓库的 URL 地址

- git remote set-url `远程仓库的别名` `新的远程仓库URL地址`

## git pull

从远程仓库获取最新版本并合并到本地。

- 首先会执行 git fetch，然后执行 git merge，把获取的分支的 HEAD 合并到当前分支。

- 从远程仓库获取最新版本。
- git pull

## git push

把本地仓库的提交推送到远程仓库。

- 把本地仓库的分支推送到远程仓库的指定分支

- git push `远程仓库的别名` `本地分支名`:`远程分支名`


- 将指定的标签提交到远程仓库

- git push `远程仓库的别名` `标签名称`


- 将本地所有的标签全部提交到远程仓库

- git push `远程仓库的别名` –tags


- 删除指定的远程仓库的分支

- git push `远程仓库的别名` :`远程分支名`

- git push `远程仓库的别名` --delete `远程分支名`

## git clone

- 只拉取最近的一个 revision
  git clone --depth=1

- 拉取指定分支
  git clone -b dev

- 只克隆一个裸仓库
  git clone --bare \**.git

## git branch

- 操作 Git 的分支命令。

- 列出本地的所有分支，当前所在分支以 "*" 标出

- git branch

- 列出本地的所有分支并显示最后一次提交，当前所在分支以 "*" 标出

- git branch -v


- 创建新分支，新的分支基于上一次提交建立

- git branch `分支名`


- 修改分支名称

- 如果不指定原分支名称则为当前所在分支

- git branch -m `原分支名称` `新的分支名称`


- 强制修改分支名称

- git branch -M `原分支名称` `新的分支名称`


- 删除指定的本地分支

- git branch -d `分支名称`


- 强制删除指定的本地分支

- git branch -D `分支名称`

## git checkout

- 检出命令，用于创建、切换分支等。

- 切换到已存在的指定分支

- git checkout `分支名称`


- 创建并切换到指定的分支，保留所有的提交记录

- 等同于 "git branch" 和 "git checkout" 两个命令合并

- git checkout -b `分支名称`


- 创建并切换到指定的分支，删除所有的提交记录

- git checkout --orphan `分支名称`


- 替换掉本地的改动，新增的文件和已经添加到暂存区的内容不受影响

- git checkout `文件路径`

## git fetch

- 从远程仓库获取最新的版本到本地的 tmp 分支上。

- 将远程仓库所有分支的最新版本全部取回到本地

- git fetch `远程仓库的别名`


- 将远程仓库指定分支的最新版本取回到本地

- git fetch `远程主机名` `分支名`

## git diff

- 比较版本之间的差异。

- 比较当前文件和暂存区中文件的差异，显示没有暂存起来的更改

- git diff


- 比较暂存区中的文件和上次提交时的差异

- git diff --cached

- git diff --staged


- 比较当前文件和上次提交时的差异

- git diff HEAD


- 查看从指定的版本之后改动的内容

- git diff `commit ID`


- 比较两个分支之间的差异

- git diff `分支名称` `分支名称`