# Docker

## 安装

```shell
# 重启docker
systemctl daemon-reload
systemctl restart docker.service
systemctl restart docker
```

![a](/docker.jpg)

## 镜像

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

## 容器

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

## 容器网络

### Docker 自带网络驱动
1. **bridge（桥接网络）**
   - 默认网络类型，创建容器不指定就是它
   - 容器有独立 IP、端口映射（`-p`），互相可通
   - 适合：单机多容器互相通信

2. **host（主机网络）**
   - 容器**共享宿主机网络栈**，没有独立 IP
   - 端口直接用宿主机端口，性能最好
   - 适合：需要高性能、不想做端口映射的场景

3. **none（无网络）**
   - 完全禁用网络，只有本地回环 `lo`
   - 适合：安全要求极高、完全隔离的容器

4. **overlay（覆盖网络）**
   - 用于 **Docker Swarm 集群**，跨多台主机通信
   - 不同节点上的容器像在同一个局域网

5. **macvlan / ipvlan**
   - 给容器分配**物理局域网内的真实 MAC/IP**，像一台独立物理机
   - 适合：需要容器直接暴露在局域网、网关可直接访问

6. **container（容器共享网络）**
   - 容器和**另一个容器共享网络 Namespace**，IP、端口完全一样
   - 常用于：sidecar 模式（比如日志、监控容器共用主容器网络）

---

### 最常用的简写总结
- 单机普通用：`bridge`（默认）
- 要高性能、直接用宿主机网：`host`
- 完全断网：`none`
- 多主机集群：`overlay`
- 要容器像物理机：`macvlan`


### 自定义网络

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

**卷**存储在主机文件系统分配一块专有存储区域，_由 Docker_（在 Linux 上）管理，并且与主机的核心功能隔离。非 Docker
进程不能修改文件系统的这一部分。卷是在 Docker 中持久保存数据的最佳方式。

```bash
docker volume create my-data
docker volume rm my-data
```

### **bind mount 绑定挂载**

*绑定挂载\*\*可以将主机文件系统上目录或文件*装载到容器中\*，但是主机上的非 Docker 进程可以修改它们，同时在**容器**中也可以更改
**主机**文件系统，包括创建、修改或删除文件或目录，使用不当，可能会带来安全隐患。

```bash
docker run -e MYSQL_ROOT_PASSWORD=123456 \
           -v /home/mysql/conf.d/my.cnf:/etc/mysql/conf.d/my.cnf:ro  \ # :ro只读
           -v my-data:/var/lib/mysql  \
           -d mysql:5.7
```

### **tmpfs** **临时挂载**

**tmpfs 挂载**仅存储在主机系统的内存中，从不写入主机系统的文件系统。当容器停止时，数据将被删除。
