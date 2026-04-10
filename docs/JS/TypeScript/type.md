# Type

## namespace

```ts
// types/global.d.ts
declare namespace Api {
  namespace user {
    // 定义 Api.user.info 的类型
    interface Info {
      id: number;
      name: string;
      age?: number;
      email: string;
    }
    // 让 Api.user.info 直接指向该接口
    type info = Info;

    // 可继续扩展其他类型
    interface ListItem {
      id: number;
      name: string;
    }
    type list = ListItem[];
  }

  // 可继续扩展其他模块
  namespace order {
    interface Detail {
      orderId: string;
      amount: number;
    }
  }
}

```


