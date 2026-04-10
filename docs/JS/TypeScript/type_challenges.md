# Type Challenges

## Easy

### MyPick 挑选指定键
```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
```

### MyReadonly 全属性只读
```ts
type MyReadonly<T> = { readonly [P in keyof T]: T[P] }
```

### TupleToObject 元组转对象
```ts
type TupleToObject<T extends readonly (string | number | symbol)[]> = {
  [P in T[number]]: P
}
```

### First 获取数组首元素
```ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
```

### Last 获取数组最后一个元素
```ts
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never
```

### Length 获取元组长度
```ts
type Length<T extends readonly any[]> = T["length"]
```

### MyExclude 排除联合类型
```ts
type MyExclude<T, U> = T extends U ? never : T
```

### MyOmit 排除对象指定键
```ts
type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] }
```

## Medium

### MyExtract 提取交集联合
```ts
type MyExtract<T, U> = T extends U ? T : never
```

### If 条件判断类型
```ts
type If<C extends boolean, T, F> = C extends true ? T : F
```

### Concat 数组拼接
```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U]
```

### Push 数组尾部添加元素
```ts
type Push<T extends any[], U> = [...T, U]
```

### Unshift 数组头部添加元素
```ts
type Unshift<T extends any[], U> = [U, ...T]
```

### Pop 删除数组最后一项
```ts
type Pop<T extends any[]> = T extends [...infer R, any] ? R : []
```

### Shift 删除数组第一项
```ts
type Shift<T extends any[]> = T extends [any, ...infer R] ? R : []
```

### MyAwaited 解析Promise（递归解套）
```ts
type MyAwaited<T> = 
  T extends Promise<infer V> ? MyAwaited<V> : T
```

### DeepReadonly 深度只读（递归经典）
```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: 
    T[K] extends Function ? T[K] : 
    T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
```

### KebabCase 驼峰转短横线（模板字符串+infer）
```ts
type KebabCase<S> = 
  S extends `${infer F}${infer R}` 
    ? R extends Uncapitalize<R> 
      ? `${Lowercase<F>}${KebabCase<R>}` 
      : `${Lowercase<F>}-${KebabCase<R>}` 
    : S
```

### Merge 合并两个对象类型（相同键覆盖右侧）
```ts
type Merge<L, R> = {
  [K in keyof L | keyof R]: K extends keyof R ? R[K] : K extends keyof L ? L[K] : never
}
```

### Difference 获取两个对象的差异键值对
```ts
type Difference<L, R> = {
  [K in Exclude<keyof L, keyof R> | Exclude<keyof R, keyof L>]: 
    K extends keyof L ? L[K] : K extends keyof R ? R[K] : never
}
```

## Hard

### Flatten 多维数组扁平化
```ts
type Flatten<T> = 
  T extends [infer H, ...infer Rest]
    ? H extends any[] ? [...Flatten<H>, ...Flatten<Rest>] : [H, ...Flatten<Rest>]
    : []
```

### Replace 字符串替换基础版
```ts
type Replace<S, From, To> = 
  S extends `${infer L}${From & string}${infer R}` 
    ? `${L}${To}${R}` : S
```

### Reverse 反转元组
```ts
type Reverse<T extends any[]> = 
  T extends [infer F, ...infer R] ? [...Reverse<R>, F] : []
```

### Permutation 联合类型全排列（TS玄学高频）
```ts
type Permutation<T, U = T> = 
  [T] extends [never] 
    ? [] 
    : U extends U ? [U, ...Permutation<Exclude<T, U>>] : never
```

### Trim 去除字符串首尾空格
```ts
type Trim<S extends string> = 
  S extends ` ${infer R}` ? Trim<R> : 
  S extends `${infer L} ` ? Trim<L> : S
```

### Currying 函数柯里化类型
```ts
type Currying<F> = 
  F extends (...args: infer A) => infer R 
    ? A extends [infer H, ...infer T] 
      ? (arg: H) => Currying<(...args: T) => R>
      : R
    : never
```