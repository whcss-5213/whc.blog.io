# mongosh

## user

```shell
use admin

show users

db.updateUser("<原根用户名>", {
  pwd: "<新密码>"
});

db.changeUserPassword("<原根用户名>", "<新密码>");

db.createUser({
    user : "bigcat",
    pwd : "bigcat",
    roles : [{role : "read", db : "db_01"}, {role : "readWrite", db : "db_02"}]
})

db.dropUser("test_user");

db.getUsers().forEach(user => {
  if (user.user !== "root") { // 排除保留用户
    db.dropUser(user.user);
    print("已删除用户：", user.user);
  }
});
```
