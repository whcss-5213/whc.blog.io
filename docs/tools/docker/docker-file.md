# DockerFile

```dockerfile
# 基础镜像 as 后面是给它起个名字。
FROM node:latest as builder
# 把容器内的当前目录设置为 /app
WORKDIR /app
COPY package.json .
RUN npm install --registry=https://registry.npmmirror.com/
COPY . .
RUN npm run build

ENV MONGO_INITDB_ROOT_USERNAME admin-user
ENV MONGO_INITDB_ROOT_PASSWORD admin-password
ENV MONGO_INITDB_DATABASE admin

ADD mongo-init.js /docker-entrypoint-initdb.d/

FROM nginx:latest
# --from=<name> 将从 from 指定的构建阶段中寻找源文件
COPY --from=builder /app/dist /usr/share/nginx/html/
```

.dockerignore 文件

```dockerfile
# 基础镜像 as 后面是给它起个名字。
FROM node:alpine as development
# 把容器内的当前目录设置为 /usr/app
WORKDIR /usr/app
# 复制 package.json
COPY package.json ./
# 安装全部依赖包
RUN npm install --registry=https://registry.npmmirror.com/
# 复制全部文件
COPY . .
# 打包
RUN npm run build

FROM node:alpine as production

WORKDIR /usr/app

COPY package.json ./
# 只安装 production 依赖包
RUN npm install --only=production

COPY . .
# 从development复制打包结果
COPY --from=development /usr/app/dist ./dist

CMD ["node", "dist/main.js"]
```

[Docker中文文档 Docker概述-DockerInfo](http://www.dockerinfo.net/document)

Dockerfile 分为四部分：基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令

1. FROM

   指定基础镜像，格式为 `FROM `或`FROM :`。

   ```dockerfile
   FROM [--platform=<platform>] <image> [AS <name>]
   FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
   FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]
   ```

2. MAINTAINER

   维护者信息

   ```dockerfile
   MAINTAINER WHCSS
   ```

3. RUN

   用于执行后面跟着的命令行命令。

   每条 `RUN` 指令将在当前镜像基础上执行指定命令，并提交为新的镜像。当命令较长时可以使用 `\` 来换行。

   所以过多无意义的层，会造成镜像膨胀过大。

   ```dockerfile
   RUN <命令行命令>
   RUN ["可执行文件", "参数1", "参数2"]
   
   RUN yum -y install wget \
       && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"\
       && tar -xvf redis.tar.gz
   ```

4. COPY

   从上下文目录中复制文件或者目录到容器里指定路径。

   **[--chown=:]**：可选参数，用户改变复制到容器内文件的拥有者和属组。

   ```dockerfile
   COPY [--chown=<user>:<group>] <源路径1>...  <目标路径>
   COPY [--chown=<user>:<group>] ["<源路径1>",...  "<目标路径>"]
   ```

5. CMD

   cmd给出的是一个容器的默认的可执行体。如果docker run没有指定任何的执行命令或者dockerfile里面也没有entrypoint，那么，就会使用cmd指定的默认的执行命令执行。

   ```dockerfile
   FROM centos
    
   CMD ["/bin/bash", "-c", "echo 'hello cmd!'"]
   ```

   ```bash
   # CMD 被替换和覆盖。
   docker run -it --rm mysql:5.7 /bin/bash
   ```

6. ENTRYPOINT

   ```bash
   # 会覆盖 Dockerfile 中的 ENTRYPOINT
   docker run -it --entrypoint /bin/bash redis
   ```

   docker run没有指定任何的执行命，dockerfile`ENTRYPOINT`和`CMD`都存在，则`CMD`将作为`ENTRYPOINT`的参数使用。


7. WORKDIR
   镜像中的工作目录