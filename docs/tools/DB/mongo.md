# mongo

## docker

```shell
port=27017
dbpath=/data/mongo_data
logpath=/data/mongo_log

docker run -it -d \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-v /root/mongodb/data:/data/db \
-p 27017:27017 \
--network mongo-network \  
--name mongo \
--restart always mongo:latest \
-v root/mongodb/conf:/etc/mongo
--config /etc/mongo/mongo.conf

docker run -d \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-v /root/mongodb/data:/data/db -p 27017:27017 \
--name mongo \
--restart always mongo

docker run -itd \
--name mongo \
-p 27017:27017 \ 
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-v /root/mongodb/db:/data/db \
--restart always \
mongo:latest


docker run -itd \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-v /root/mongodb/data1/db:/data/db \
--restart always \
--name mongo \
mongo:latest

docker exec -it mongo /bin/base
docker exec -it mongo sh
// 5.0以后
docker exec -it mongo /bin/mongosh -u user -p password
v
# 备份
mongodump -h 127.0.0.1:27017 -u root -p admin --authenticationDatabase admin -d ssss -o /db

``` 

## 连接数据库

## mongod

https://www.jianshu.com/p/35135e913f8d

https://developer.aliyun.com/article/673956

### mongodb

#### 创建数据库

use 数据库名称 创建/打开数据库

show dbs 查看所有数据库

#### 删除数据库

use 数据库名称
db.dropDatabase()

#### 创建集合

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
use runoob
db.dropDatabase() 删除数据库
```

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

- **$inc**  : 引用增加

    - db.table.updateMany({}, {$inc:{"score": 1}})   # 在原基础上给所有score +1

- **$set** :  修改数据 (key不存在就添加)

    - db.table.update({"score": 65}, {$set: {"score": 80}})

- **$unset**: 强制删除Field

    - db.table.update({}, {$unset:{"age": 15}})    # 删除所有 age 字段

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

##### 条件查询

- **$gt**： (>) 大于
- **$lt**：  (<) 小于
- **$gte**：(>=)  大于等于
- **$lte**： (<= ) 小于等于
- **$ne**： ( != )  不等于
- **$eq**： ( = )    等于

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

docker run -d \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-v /root/mongodb/data:/data/db \
-p 27017:27017 \
--name mongo \
--restart always mongo:latest \
-v root/mongodb/conf:/etc/mongo --config /etc/mongo/mongo.conf



















