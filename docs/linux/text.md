# Text

>  **grep**：取行（过滤、查找匹配内容）
> **sed**：改行（替换、删除、插入、修改行）
> **awk**：取列（字段分割、统计、计算、格式化输出）

## 一、grep 常用命令
```bash
grep 'xxx' file          ## 查找包含 xxx 的行
grep -i 'xxx' file       ## 忽略大小写
grep -n 'xxx' file       ## 显示行号
grep -v 'xxx' file       ## 反向匹配（不包含 xxx）
grep -E 'a|b' file       ## 正则匹配 a 或 b
grep -r 'xxx' /dir       ## 递归查找目录下文件内容
```

## grep 常用参数
```bash
grep [选项] 关键词 文件
```
- `-i`：忽略大小写
- `-n`：显示行号
- `-v`：反向匹配
- `-w`：全词匹配
- `-c`：只输出匹配行数
- `-r / -R`：递归搜索
- `-E`：启用扩展正则（egrep）
- `-l`：只输出匹配的文件名



## 二、sed 常用命令
```bash
sed 's/old/new/g' file       ## 替换（仅输出，不修改文件）
sed -i 's/old/new/g' file    ## 直接修改原文件
sed '/xxx/d' file            ## 删除包含 xxx 的行
sed -n '/xxx/p' file         ## 只打印匹配行（类似 grep）
sed '3d' file                ## 删除第 3 行
sed 's/ //g' file            ## 去除所有空格
```

## sed 常用参数
```bash
sed [选项] '指令' 文件
```
- `-n`：静默模式，只打印匹配行
- `-i`：直接修改原文件
- `-e`：执行多条指令
- `s/old/new/g`：全局替换
- `d`：删除行
- `p`：打印行



## 三、awk 常用命令
```bash
awk '{print $1,$3}' file              ## 打印第 1、3 列
awk -F ':' '{print $1}' file          ## 指定分隔符为 :
awk '/xxx/{print $0}' file            ## 匹配包含 xxx 的行
awk '$3>100{print}' file              ## 第 3 列大于 100 时打印
awk '{sum+=$3} END {print sum}' file   ## 第 3 列数值求和
awk '{a[$1]++} END {for(i in a) print i,a[i]}'  ## 第 1 列统计次数
```

## awk 常用参数与内置变量
```bash
awk [选项] '条件{动作}' 文件
```
- `-F`：指定字段分隔符（`-F ':'`、`-F '|'`、`-F ','`）
- `-v`：传入外部变量
- `$0`：整行内容
- `$1~$n`：第 n 个字段
- `NF`：当前行字段总数
- `NR`：当前行号
- `FILENAME`：当前文件名



## 四、组合实战案例
```bash
## 统计访问 IP 次数并排序
awk '{print $1}' access.log | sort | uniq -c | sort -nr

## 过滤错误日志并提取指定列
grep 'error' app.log | awk '{print $5,$7}'

## 替换并只输出匹配行
sed -n 's/old/new/gp' file
```

## 极简记忆版（核心必备）
- grep：`-i -n -v -r -E`
- sed：`-n -i` + `s///g d p`
- awk：`-F` + `$1 $2 NF NR sum`

