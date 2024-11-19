# docker

## Docker

### 安装

```shell
sudo yum install docker-ce docker-ce-cli containerd.io
```
docker container update --restart=always 容器名称[]

cenos 8

```shell
yum install https://download.docker.com/linux/fedora/30/x86_64/stable/Packages/containerd.io-1.2.6-3.3.fc30.x86_64.rpm
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce
```

### 国内源

```json
// /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.rainbond.cc",
    "https://jockerhub.com"
  ]
}
```

```shell
# 重启docker 
systemctl daemon-reload
systemctl restart docker.service
systemctl restart docker
```

![a](../../public/docker.jpg)

### 镜像

```bash
# 查看所有镜像
docker images

# 查看镜像创建历史
docker history 镜像名称/ID

# 删除镜像
docker rmi 镜像名称/ID

# 导出镜像 会包含所有层，以及所有标签 + 版本信息
docker save 镜像名称/ID > 镜像名称.tar
 
# 导入镜像
docker load < 镜像名称.tar

# 导入镜像 只有容器层，不包含镜像层
docker import my_ubuntu_v3.tar runoob/ubuntu:v4

# 复制文件到容器中
docker cp ./1a.js c78e4a387059:/app
```

```shell
docker run -it --rm busybox		
```

### 容器

```shell
# Docker容器 或者 Docker镜像 的元数据
docker inspect 容器名称/ID

# 查询容器，不包含终止的容器
docker ps

# 查询容器，包含终止状态的容器
docker ps -a

# 终止容器
docker stop 容器名称/ID

# 删除容器
docker rm 容器名称/ID

# 清理列表中所有终止状态的容器
docker container prune

# 容器改名称
docker rename 容器名称/ID 新名称

# 导出本地某个容器
docker export 7691a814370e > ubuntu.tar

docker restart 9acbbc72ef1a

# 导入镜像 只有容器层，不包含镜像层
docker import my_ubuntu_v3.tar runoob/ubuntu:v4
```

- 启动

```shell
docker run -it -d \
--name admin 
--privileged 
-p 8080:8080 
-v ${PWD}/:/admin node:16.14.2 /bin/bash 
-c "cd /admin && npm install -g pnpm && pnpm install && pnpm run start"
```

```shell
# 启动容器，输出一个 “Hello World”，之后终止容器。
docker run ubuntu:14.04 /bin/echo 'Hello world'

# 启动一个 bash 终端，允许用户进行交互。
docker run -t -i ubuntu:14.04 /bin/bash
```

1. -d 后台运行容器。

2. -p 指定端口

   ```shell
   docker run -p [服务器端口]:[容器端口]
   ```

3. --name 容器名称

4. -v 数据卷

服务器路径:容器路径

### 容器网络

#### 默认网络

docker会自动创建三个网络，`bridge`,`host`,`none`

- bridge桥接网络

如果不指定，新创建的容器默认将连接到bridge网络。

默认情况下，使用bridge网络，宿主机可以ping通容器ip，容器中也能ping通宿主机。

容器之间只能通过 IP 地址相互访问，由于容器的ip会随着启动顺序发生变化，因此不推荐使用ip访问。

- host

慎用，可能会有安全问题。

容器与宿主机共享网络，不需要映射端口即可通过宿主机IP访问。（-p选项会被忽略）

主机模式网络可用于优化性能，在容器需要处理大量端口的情况下，它不需要网络地址转换 （NAT），并且不会为每个端口创建“用户空间代理”。

- none

禁用容器中所用网络，在启动容器时使用。

#### 自定义网络

```shell
# 创建用户自定义网络
docker network create my-net
# 将已有容器连接到此网络
docker network connect my-net db-mysql
# 断开连接
docker network disconnect my-net db-mysql
```

创建容器时指定网络。

```shell
docker run -it --rm --network my-net mysql:5.7 mysql -h db-mysql -uroot -p
```

在用户自定义网络上，容器之间可以通过容器名进行访问。

用户自定义网络使用 Docker 的嵌入式 DNS 服务器将容器名解析成 IP。

### 容器存储

#### **volume 卷**

**卷**存储在主机文件系统分配一块专有存储区域，*由 Docker*（在 Linux 上）管理，并且与主机的核心功能隔离。非 Docker
进程不能修改文件系统的这一部分。卷是在 Docker 中持久保存数据的最佳方式。

```bash
docker volume create my-data
docker volume rm my-data
```

#### **bind mount 绑定挂载**

*绑定挂载**可以将主机文件系统上目录或文件*装载到容器中*，但是主机上的非 Docker 进程可以修改它们，同时在**容器**中也可以更改
**主机**文件系统，包括创建、修改或删除文件或目录，使用不当，可能会带来安全隐患。

```bash
docker run -e MYSQL_ROOT_PASSWORD=123456 \
           -v /home/mysql/conf.d/my.cnf:/etc/mysql/conf.d/my.cnf:ro  \ # :ro只读
           -v my-data:/var/lib/mysql  \
           -d mysql:5.7 
```

#### **tmpfs** **临时挂载**

**tmpfs挂载**仅存储在主机系统的内存中，从不写入主机系统的文件系统。当容器停止时，数据将被删除。







