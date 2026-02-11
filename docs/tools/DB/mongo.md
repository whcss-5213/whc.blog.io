# mongodb

## 创建数据库

```shell
use 数据库名称

```

## 删除数据库

```shell
use 数据库名称
db.dropDatabase()
```

## 创建集合

```sql
db.createCollection(name, options)
```

#### 增

insert

```
db.集合名.insert({数据})
db.集合名.insert([{数据},{数据},[数据]])
db.集合名.insertOne({数据}) 插入一个
db.集合名.insertMany([{数据},{数据},{数据}]) 插入多个
```

#### 删

```
db.collection.drop() 删除集合
db.collection.remove({}) 清空集合
```

```
db.collection.remove({条件})
db.collection.remove({条件},{justOne:true}) 只删除一条
```

#### 改

update

```
db.collection.updateOne({}, {$set:{}}) 符合条件的第一条
db.collection.updateMany({}, {$set:{}})  更新所有符合条件
不加 $set 会直接替换查找到的内容
```

- **$inc** : 引用增加
  - db.table.updateMany({}, {$inc:{"score": 1}}) # 在原基础上给所有 score +1

- **$set** : 修改数据 (key 不存在就添加)
  - db.table.update({"score": 65}, {$set: {"score": 80}})

- **$unset**: 强制删除 Field
  - db.table.update({}, {$unset:{"age": 15}}) # 删除所有 age 字段

#### 查

find

```
db.collection.find(query, projection)
```

- **query** ：可选，使用查询操作符指定查询条件

- **projection** ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。
  - ```
    {"_id":0,title:1} 0 不返回 1 返回
    ```

  ```

  ```

##### 条件查询

- **$gt**： (>) 大于
- **$lt**： (<) 小于
- **$gte**：(>=) 大于等于
- **$lte**： (<= ) 小于等于
- **$ne**： ( != ) 不等于
- **$eq**： ( = ) 等于

```
db.collection.find({age:{$gte:50}})
db.collection.find({age:{$gt:50,$lt:}})
```

```
$gt -------- greater than  >

$lt -------- less than  <

$gte --------- gt equal  >=

$lte --------- lt equal  <=

$ne ----------- not equal  !=

$eq  --------  equal  =
```

- **$and**

  ```
  db.collection.find( {k1:v1},{k2:v2} )
  ```

- **$or**

  ```
  db.collection.find($Or:[ {k1:v1},{k2:v2}] )
  ```

- **$in**

  ```
  db.collection.find($in:[ {k1:v1},{k2:v2}] )
  ```

#### 排序

## 副本集

```bash
# 创建密钥文件
openssl rand -base64 756 > /path/to/mongo.keyfile
# 修改密钥文件权限
# 安全的权限设置是 400（仅所有者可读）或 600（所有者可读可写）
chmod 400 /path/to/mongo.keyfile
```

```yaml
# 配置文件
security:
  authorization: enabled
  keyFile: /path/to/mongo.keyfile
replication:
  replSetName: 'rs0'
```

```bash
# 启动副本集
mongod --config /path/to/mongo.conf --replSet rs0
# 连接副本集
mongo --host <host> --port <port> --username <username> --password <password> --authenticationDatabase admin
# 初始化副本集
rs.initiate()

# 查看副本集状态
rs.status()

# 添加副本集节点
rs.add("<host>:<port>")
# 查看副本集成员
rs.status()
# 删除副本集成员
rs.remove("<host>:<port>")
# 重新配置副本集
rs.reconfig()
```

```bash
# docker 启动副本集
docker run -d --name mongo
-p 27017:27017 \
-v /data/db:/data/db \
-v /path/to/mongo.keyfile:/data/config/mongo.keyfile \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=root \
-e MONGO_INITDB_DATABASE=admin  \
mongo:latest \
mongod --replSet rs0 --keyFile /data/keyfile --bind_ip_all
```

```bash
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "192.168.1.100:27017" },
    { _id: 1, host: "192.168.1.101:27017" }
  ]
})
```

## mongod

https://www.jianshu.com/p/35135e913f8d

https://developer.aliyun.com/article/673956
