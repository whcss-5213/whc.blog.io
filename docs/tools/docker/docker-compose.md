# Docker-compose

> 疑似 DockerDesktop 才能使用 host.docker.internal
> Docker 宿主机默认ip 为 `172.17.0.1`

```bash
# 部署启动
docker-compose up -d --build
# 启动/停止
docker-compose start/stop
# 重启
docker-compose restart
# 删除容器和网络但不会删除卷和镜像资源。
docker-compose down
# 删除数据卷
docker volume rm 数据卷名称
# 查看应用状态
docker-compose ps
```

`services`必要元素，定义一个或多个容器的运行参数

在`services`中可以通过以下元素定义容器的运行参数

`image` 容器 镜像

`ports`端口映射

`environment`环境变量

`networks`容器使用的网络

`volumes`容器挂载的存储卷

`command`容器启动时执行的命令

`depends_on`定义启动顺序

复数形式（例如`ports`,`networks`,`volumes`,`depends_on`）参数需要传入列表

`networks`创建自定义网络

`volumes` 创建存储卷

```yaml
services:

  news:
    restart: always
    container_name: news
    # . 表示使用当前目录下的Dockerfile进行构建
    build: .
      # 指定目录 Dockerfile 
    # context: ./epidemic-server
    ports:
      - 888:888
    networks:
      - news-net
    # 容器启动顺序
    depends_on:
      - mongo
      # mongo:
      #   # service_started 容器已启动
      #   #service_healthy 容器处于健康状态
      #   #service_completed_successfully 容器执行完成且成功退出（退出状态码为0）
      #   condition: service_healthy

  mongo:
    image: mongo:latest
    # 重启策略 none 不自动重启 on-failture: 2 非正常退出状态会重启服务。可以指定异常退出重启的次数。
    # always 
    # 重启 docker 服务时，该容器会随之启动。
    # unless-stopped 
    # 在容器退出时总是重启容器，但是不考虑在Docker守护进程启动时就已经停止了的容器
    restart: always
    container_name: mongo
    environment:
      TZ: Asia/Shanghai
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: admin
      MONGO_INITDB_DATABASE: my-database
    volumes:
      - ./mongodb/db:/data/db
      - ./mongodb/log:/data/log
      - ./config/init-mongo.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - news-net
    ports:
      - 27017:27017
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongo mongo:whcss:whcss520@mongo/my-database --quiet
      interval: 10s
      timeout: 10s
      retries: 5
      start_period: 40s


```