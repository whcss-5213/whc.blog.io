# Images

## mongodb
### 启动镜像
```shell
# 创建镜像
docker run -itd \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-v /root/mongodb/data1/db:/data/db \
--restart always \
--name mongo \
mongo:latest

# 进入容器  
docker exec -it mongo bash
docker exec -it mongo /bin/mongosh -u user -p password

# 备份数据库
mongodump -h 127.0.0.1:27017 -u root -p admin --authenticationDatabase admin -d dbname -o /db
#恢复所有数据库
mongorestore -h 127.0.0.1:27017 --dir /data/mongodb_backup
#恢复制定数据库
mongorestore -h 127.0.0.1:27017 -d news --dir /data/db/news -u root  -p admin --authenticationDatabase admin


```
### 配置文件
> /etc/mongod.conf.orig
```yaml
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: /var/lib/mongodb
#  engine:
#  wiredTiger:

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1


# how the process runs
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

#security:

#operationProfiling:

#replication:

#sharding:

## Enterprise-Only Options:

#auditLog:
```

## browserless

```shell
docker run -it -d 
           --name browser 
           -p 3000:3000 
           -e "CONNECTION_TIMEOUT=60000" 
           browserless/chrome
```