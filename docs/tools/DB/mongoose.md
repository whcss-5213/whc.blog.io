# mongoose
## 连接数据库

mongoose.set() 方法可以设置以下值：

debug: 用于开启或关闭 Mongoose 的调试模式。默认为 false。
bufferCommands: 用于开启或关闭 Mongoose 缓冲命令。默认为 true。
useFindAndModify: 用于开启或关闭使用 findOneAndUpdate() 和 findOneAndRemove() 方法代替旧的 findAndModify() 方法。默认为 true。
useCreateIndex: 用于开启或关闭使用 createIndex() 方法代替旧的 ensureIndex() 方法。默认为 true。
useNewUrlParser: 用于开启或关闭使用新的 URL 解析器。默认为 false。
useUnifiedTopology: 用于开启或关闭使用 MongoDB 的新的服务器发现和监视引擎。默认为 false。
autoIndex: 用于开启或关闭自动索引。默认为 true。
maxTimeMS: 用于设置查询的最大执行时间（以毫秒为单位）。
minimize: 用于开启或关闭 Mongoose 的默认对象压缩。默认为 true。
runValidators: 用于开启或关闭在更新时运行验证程序。默认为 false。
toJSON: 用于配置 Mongoose 的默认 toJSON() 行为。默认为 { virtuals: true, transform: function(doc, ret) { delete ret.__v; } }。

## Schema

```js
const mongoose = require('../config/mongoose')

const websiteSchema = mongoose.Schema({
    name: {
        type: String,
        typeKey: "$type",
        /**
         * 别名，不会存到数据库中
         */
        alias: "wwdc",
        // 默认值
        defult: 'whc'
    },
    password: {
        type: String,
        /**
         * 查询结果默认不返回密码
         * 强制返回密码
         * find().select("+password")
         */
        select: false,
    },
}, option)
websiteSchema.statics = {}
websiteSchema.methods = {}
const websiteModel = mongoose.model('websiteSchema', websiteSchema, 'website')

module.exports = websiteModel

```

type

- [String](https://mongoosejs.com/docs/schematypes.html#strings)
- [Number](https://mongoosejs.com/docs/schematypes.html#numbers)
- [Date](https://mongoosejs.com/docs/schematypes.html#dates)
- [Buffer](https://mongoosejs.com/docs/schematypes.html#buffers)
- [Boolean](https://mongoosejs.com/docs/schematypes.html#booleans)
- [Mixed](https://mongoosejs.com/docs/schematypes.html#mixed)
- [ObjectId](https://mongoosejs.com/docs/schematypes.html#objectids)
- [Array](https://mongoosejs.com/docs/schematypes.html#arrays)
- [Decimal128](https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-Decimal128)
- [Map](https://mongoosejs.com/docs/schematypes.html#maps)
- [Schema](https://mongoosejs.com/docs/schematypes.html#schemas)

#### prop options

- autoIndex

- bufferCommands

- capped

- collection

- id

- _id

- minimize

- read

- shardKey

- strict

- strictQuery

- toJSON

- toObject

- typeKey

- validateBeforeSave

- versionKey

- collation

- skipVersioning

##### timestamps

会在你的 schema 自动添加 createdAt 和 updatedAt 字段， 其类型为 Date。

  ```typescript
  type timestamps = boolean | {
    createdAt?: boolean | string;
    updatedAt?: boolean | string;
    currentTime?: () => (NativeDate | number);
}
  ```

- useNestedStrict

#### Method

```javascript
const CatSchema = mongosse.Schema({name: String});

CatSchema.methods.speak = function () {
    console.log(this.name, ":", "喵喵喵");
};
```

#### statics

```js
CatSchema.statics.xxx = function () {
    this.find()
    this.findById()
    this.findByIdAndDelete()
    this.findByIdAndRemove()
    this.findByIdAndUpdate()
    this.findOne()
    this.findOneAndDelete()
    this.findOneAndRemove()
    this.findOneAndUpdate()
    this.updateMany()
    this.updateOne()
    this.deleteMany()
    this.deleteOne()
    this.replaceOne()
};
```

#### 索引 index

MongoDB 的 索引分为：

- 字段级别
- schema级别
- 复合索引

```javascript
const animalSchema = new Schema({
    name: String,
    type: String,
    tags: {type: [String], index: true} // 字段级别
});

animalSchema.index({name: 1, type: -1}); // schema级别 
```

索引对于性能有一定的影响，可以通过下面的手段关闭。

```javascript
mongoose.connect('mongodb://user:pass@localhost:port/database', {autoIndex: false});
// or
mongoose.createConnection('mongodb://user:pass@localhost:port/database', {autoIndex: false});
// or
animalSchema.set('autoIndex', false);
// or
new Schema({..}, {autoIndex: false});
```

## Model

### 操作符

https://www.mongodb.com/docs/manual/reference/operator/query/

| 工具函数     | 过滤操作符   | 含义                   |
|----------|---------|----------------------|
| eq()     | $eq     | 与指定值相等               |
| ne()     | $ne     | 与指定值不相等              |
| gt()     | $gt     | 大于指定值                |
| gte()    | $gte    | 大于等于指定值              |
| lt()     | $lt     | 小于指定值                |
| lte()    | $lte    | 小于等于指定值              |
| in()     | $in     | 与查询数组中指定的值中的任何一个匹配   |
| nin()    | $nin    | 与查询数组中指定的值中的任何一个都不匹配 |
| and()    | $and    | 满足数组中指定的所有条件         |
| nor()    | $nor    | 不满足数组中指定的所有条件        |
| or()     | $or     | 满足数组中指定的条件的其中一个      |
| not()    | $not    | 反转查询，返回不满足指定条件的文档    |
| regex()  | $regex  | 可以被指定正则匹配`           |
| exists() | $exists | 匹配存在指定字段的文档          |
| type()   | $type   | 返回字段属于指定类型的文档        |
| size()   | $size   | 数组字段的长度与指定值一致        |
| all()    | $all    | 数组中包含所有的指定值          |

```js
const data = await WebsiteModel.findById(_id);
data.state = state;
data.newsLinks.forEach((link) => (link.state = state));
// 返回修改过的值
await data.save();

const data = await WebsiteModel.updateOne(
    {newsLinks: {$elemMatch: {_id}}},
    {$set: {'newsLinks.$.state': state}}
);

const websiteInfo = await WebsiteModel.aggregate([
    {
        $project: {
            _id: 1,
            name: 1,
            defaultListSelector: 1,
            list: '$pageSelector',
        },
    },
]);
```

*/***

** - `MongooseError`: general Mongoose error*

** - `CastError`: Mongoose could not convert a value to the type defined in the schema path. May be in a
`ValidationError` class' `errors` property.*

** - `DivergentArrayError`: You attempted to `save()` an array that was modified after you loaded it with a `$elemMatch`
or similar projection*

** - `MissingSchemaError`: You tried to access a model with [
`mongoose.model()`](https://mongoosejs.com/docs/api/mongoose.html#Mongoose.model()) that was not defined*

** - `DocumentNotFoundError`: The document you tried to [
`save()`](https://mongoosejs.com/docs/api/document.html#Document.prototype.save()) was not found*

** - `ValidatorError`: error from an individual schema path's validator*

** - `ValidationError`: error returned from [
`validate()`](https://mongoosejs.com/docs/api/document.html#Document.prototype.validate()) or [
`validateSync()`](https://mongoosejs.com/docs/api/document.html#Document.prototype.validateSync()). Contains zero or
more `ValidatorError` instances in `.errors` property.*

** - `MissingSchemaError`: You called `mongoose.Document()` without a schema*

** - `ObjectExpectedError`: Thrown when you set a nested path to a non-object value
with [strict mode set](https://mongoosejs.com/docs/guide.html#strict).*

** - `ObjectParameterError`: Thrown when you pass a non-object value to a function which expects an object as a
paramter*

** - `OverwriteModelError`: Thrown when you call [
`mongoose.model()`](https://mongoosejs.com/docs/api/mongoose.html#Mongoose.model()) to re-define a model that was
already defined.*

** - `ParallelSaveError`: Thrown when you call [
`save()`](https://mongoosejs.com/docs/api/model.html#Model.prototype.save()) on a document when the same document
instance is already saving.*

** - `StrictModeError`: Thrown when you set a path that isn't the schema
and [strict mode](https://mongoosejs.com/docs/guide.html#strict) is set to `throw`.*

** - `VersionError`: Thrown when the [document is out of sync](https://mongoosejs.com/docs/guide.html#versionKey)*

**/*

```js
{
    upsert:true
}
没找到插入新数据
```

acknowledged: true,

modifiedCount: 0,

upsertedId: null,

upsertedCount: 0,

matchedCount: 1





### 添加字段



1. 修改 schema 

```ts
async addNewFieldsToExistingDocs() {
    // 方法 1：使用 Schema 默认值（推荐）
    await this.userModel.updateMany(
      {}, // 匹配所有文档
      {} // 空更新，依赖 Schema 中的 default 自动填充
    );

    // 方法 2：显式设置字段值（覆盖 Schema 默认值）
    await this.userModel.updateMany(
      {},
      { 
        $set: { 
          email: 'default@example.com', // 强制设置为指定值
          age: 20 // 覆盖 Schema 中的默认值 18
        } 
      }
    );
  }



async updateSpecificDocs() {
  await this.userModel.updateMany(
    { email: { $exists: false } }, // 条件：email 字段不存在
    { $set: { email: 'unknown@example.com' } } // 新增 email 字段并设置值
  );
}



async updateAndGetResult() {
  const result = await this.userModel.updateMany({}, { $set: { isVerified: false } });
  console.log(`更新文档数量：${result.modifiedCount}`); // 输出更新的文档数
}




async updateInBatches() {
  const batchSize = 1000; // 每批更新 1000 条
  let offset = 0;
  let updated = 0;

  do {
    const result = await this.userModel.updateMany(
      { _id: { $gt: offset } }, // 假设 _id 自增，根据实际条件调整
      { $set: { newField: 'value' } },
      { limit: batchSize }
    );
    updated += result.modifiedCount;
    offset = result.upsertedCount > 0 ? result.upsertedId : offset + batchSize;
  } while (updated < result.total);
}
```

