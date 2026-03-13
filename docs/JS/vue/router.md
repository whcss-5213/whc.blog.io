# router

## 传参

**params** 与 **query** 都可以传参，但是它们的传参方式不同。
**params** 是在路由路径中定义的参数，必须要在路由路径中定义，否则会报错。
**query** 是在路由路径中定义的参数，但是它不是必须要在路由路径中定义的。

### params

```js
// 路由配置
{
  path: '/detail/:categoryId/:id',
  name: 'detail',
  component: () => import('@/views/detail/index.vue')
}

// 跳转
this.$router.push({
  name: 'detail',
  params: {
    categoryId: 1,
    id: 1001
  }
})
```

```js
import { useRoute } from 'vue-router';

export default {
  name: 'Detail',
  created() {
    const route = useRoute();
    console.log(route.params.categoryId);
    console.log(route.params.id);
  },
};
```

### query

```js
// 路由配置
{
  path: '/detail',
  name: 'detail',
  component: () => import('@/views/detail/index.vue')
}

// 跳转
this.$router.push({
  name: 'detail',
  query: {
    categoryId: 1,
    id: 1001
  }
})
```

```js
import { useRoute } from 'vue-router';

export default {
  name: 'Detail',
  created() {
    const route = useRoute();
    console.log(route.query.categoryId);
    console.log(route.query.id);
  },
};
```
