# TypeScript

## 变量

### 布尔值

```typescript
let bool1: boolean = true
let bool2: boolean
bool2 = false
```

### 数值类型

```typescript
let num0: number = 123;
let num1: number = 0b11011;//二进制
let num2: number = 0o1567;//八进制
let num2: number = 0Xa567;//十六进制
```

### 字符串

```typescript
let str: string = 'hello';
let str2: string = `${str} world`;
```

### 数组

```typescript
//写法一
let arr1: number[] = [112, 123, 123123];//只能有数字
let arr2: string[] = ['hello', 'world'];//只能有字符串
//写法二
let arr3: Array<string> = arr2;

//联合类型
let arr4: (number | string)[] = [12, 'hello world'];
let arr5: Array<number | string> = arr4;
```

### 元组类型

```typescript
//固定长度固定类型
//必须按照前面的值的类型顺序数量 进行赋值
let tuple: [boolean, string, number] = [false, 'hello world', 123];

```

### 枚举类型

```typescript
enum Roles1 {
    Small, // 0
    Large, // 1
}

enum Roles2 {
    a,  // 0
    Small = 5, // 5
    Large,  // 6
}

enum Status {
    uploading,
    success,
    failed,
}

const a = Status.success; // 1
const b = Status[0]; // uploading

Roles1.Large;
Roles2[0];
```

### any类型

```typescript
let value: any;
value = 'hello';
value = 123;
```

### void类型

### null和undefined

### never类型

```typescript
const errFunc = (err: string): never => {
    throw new Error(err);
};
const infiniteFunc = (): never => {
    while (true) {
    }
};
```

### object类型

### 类型断言

```typescript
const getLength = (target: string | number): number => {
    if ((<string>target).length || (target as string).length == 0) {
        return (target as string).length;
    } else {
        return target.toString().length;
    }
};
```

## 接口

### 用法

```typescript
interface NameInfo {
    firstName?: string;//可选,参数可传可不传
    readonly astName: string; //只读属性
}

//指定参数类型
const getFullName = ({firstName, lastName}: NameInfo): string => {
    return `${firstName} ${lastName}`;
};

getFullName({
    firstName: 'hello',
    lastName: 'world',
});
```

```typescript
//传参数个数超过规形参个数

//方法一
getFullName({
    firstName: 'hello',
    lastName: 'world',
    age: 18,
} as NameInfo);

//方法二
interface NameInfo {
    firstName?: string;
    lastName: string;

    [r: string]: any; //超出多少都没事
}

//方法三 类型兼容性
let a = {
    firstName: 'hello',
    lastName: 'world',
    age: 18,
}
getFullName(a)
```

```typescript
//数组
interface Arrays {
    0: number;
    readonly 1: string;
}

let arr: Arrays = [12, '122'];
```

```typescript
//对象
interface NameInfo {
    firstName?: string;//可选,参数可传可不传
    readonly lastName: string; //只读属性
}

let obj: NameInfo = {
    firstName: 'hello'
    lastName: 'world'
}
```

```typescript
//函数
//类型别名
type AddFun = (num1: number, num2: number) => number;
const add: AddFun = (n1, n2) => n1 + n2;
```

```typescript
//索引类型
interface RoleDic {
    [id: number]: string;
}

const role1: RoleDic = {
    0: 'hello',
    1: 'world',
};
```

### 继承

```typescript
interface Headmaster {
    tuition: number;
}

interface Teacher extends Headmaster {
    homework: string;
}

interface Student extends Teacher {
    age: number;
}

const Tom: Student = {
    age: 18,
    homework: 'did',
    tuition: 8000,
};
```

### 混合类型

```typescript
interface Counter {
    (): void;

    count: number;
}

const getCounter = (): Counter => {
    const c = () => {
        c.count++;
    };
    c.count = 0;
    return c;
};
const counter: Counter = getCounter();
counter();
```

## 函数

```typescript
function JJJ(params: number): string {
    //规定参数类型    返回值类型
    return params + '12';
}
```

```typescript
  let add: (x: number, y: number) => number;
//let 函数名:(参数类型) => 返回值类型
add = (n1: number, n2: number) => n1 + n2;
```

```typescript
type AddFun = (num1: number, num2: number) => number;
const add: AddFun = (n1, n2) => n1 + n2;
```

### 参数

```typescript
//可选参数
let add: (x: number, y?: number) => number;
//可选参数必须在必须参数后面 (x?,y) 报错
let addFuc = (x: number) => x + 1;
```

```typescript
//默认参数
let add = (x: number, y = 1) => x + y;
//会自动检测默认值类型,可以不规定n2 的类型
```

```typescript
//剩余参数
let add = (a: number, ...b: number[]) => b;
```

### 重载

```typescript
function han(x: string): string[];
function han(x: number): number[];
function han(x: any): any {
    if (typeof x === 'string') {
        return x.split('');
    } else {
        return x
            .toString()
            .split('')
            .map((item: any) => Number(item));
    }
}

han('hello world');
han(8568);
```

```javascript
//编译结果
function han(x) {
    if (typeof x === 'string') {
        return x.split('');
    } else {
        return x
            .toString()
            .split('')
            .map(function (item) {
                return Number(item);
            });
    }
}

han('hello world');
han(8568);
```

## 泛型

方便使用的同时,还保留类型检测

```typescript
const getArray = <T>(value: T, times: number = 5): T[] => {
    return new Array(times).fill(value);
};
getArray<number>(2, 5);
getArray<string>('abc', 5);
getArray('def', 5);//可以不写,会自动判断

const getArray = <T, B>(value1: T, value2: B, times: number = 5): [T, B][] => {
    return new Array(times).fill([value1, value2]);
};
getArray('a', 1, 5);
getArray<number, string>(2, 'b', 5);
```

```typescript
//函数
let getArray: <T>(arg: T, times: number) => T[];
getArray = (arg: any, times: number) => {
    return new Array(times).fill(arg);
};
```

```typescript
//接口
interface getArray<T> {
    (arg: T, times: number): T[];

    array: T[];
}
```

### 泛型约束

```typescript
interface Value {
    length: number;
}

const getArray = <T extends Value>(value: T, times: number = 5): T[] => {
    return new Array(times).fill(value);
};


const getProps = <T, K extends keyof T>(object: T, propName: K) =>
    object[propName];
const obj = {
    a: 'hello',
    b: 'world',
};

getProps(obj, 'a');
```

## 类

使用方式类似 ES6 的类

### 修饰符

```typescript
//public

公共的
//private
私有的, 自能在类里面访问

//protected
受保护的, 自能在类和子类中能访问.class
Parents
{
protected
    age: number;
    //只能通过子类创建实例
protected
    constructor(age
:
    number
)
    {
        this.age = age;
    }
}

class Child extends Parents {
    constructor(age: number) {
        super(age);
    }
}


//readonly 
只读
```

### 参数属性

```typescript
//在参数前面加上四个修饰符之一,会自动创建属性.
class Parents {
    constructor(public age: number) {
    }
}
```

### 静态属性

```typescript
//static
//不需要实例化即可引用
class Student {
    static age: number = 50;

    static getAge() {
        return this.age;
    }

    constructor(public name: string) {
    }
}

Student.getAge();
const Jim = new Student('Jim');
//不能通过new出来的实例访问类的静态变量或方法
Jim.getAge();// 报错
```

### 可选属性

```typescript
class Info {
    name: string;
    age?: number;//可选属性
    constructor(name: string, age?: number, sex?: string) {
        this.name = name;
        this.age = age;
    }
}

const info1 = new Info('Tom');
const info2 = new Info('Jim', 18);
```

### 存取器 set / get

```typescript
class Info {
    value: string = 'hello world';

    get information() {
        return this.value;
    }

    set information(value) {//只能有一个参数
        this.value = value;
    }
}

const info = new Info();
const a = info.information;
info.information = 'world hello';
```

### 抽象类

```typescript
//abstract
// 抽象类无法创建实例,只能继承
abstract class People {
    constructor(public name: string) {
    }

    abstract printName(): void;
}

class Man extends People {
    printName(): string { //无法自动继承抽象类里的抽象方法
        return this.name;
    }

    constructor(name: string) {
        super(name);
    }
}

const man = new Man('Tom');
```

### 类和接口

```typescript
interface Ppp {
    type: string;
}

class L implements Ppp {
    type: string;

    constructor(public a: string) {
        this.type = a;
    }
}
```

```typescript
class A {
    protected name: string;
}

// tslint:disable-next-line:no-empty-interface
interface B extends A {
}

class C extends A implements B {
    name: string;
}
```

### 泛型和类

```typescript
//工厂函数
const creat = <T>(c: new () => T): T => {
    return new c();
};

class Info {
    age: number;

    constructor() {
        this.age = 18;
    }
}

creat<Info>(Info);
```

## 枚举

### 数字枚举

```typescript
enum Status {
    uploading,
    success,
    failed,
}

const a = Status.success; // 1
//反向映射
const b = Status[0]; // uploading

const Id = () => 50;

enum People {
    man = Id(),
    woman = 0, //必须重新赋值
    child,
}

```

### 字符串枚举

```typescript
enum Javascript {
    zero = 'hello',
    one = 'world',
    two = zero,
}

Javascript.zero //hellow
Javascript.two //hellow
```

### 异构枚举

```typescript
enum Javascript {
    zero = 'hello',
    one = 0,
    two = 'world',
}
```

### 枚举类型

满足以下条件之一的枚举 可以作为类型使用

1. 枚举值没有赋值.

   ```typescript
   enum E = { A }
   ```

2. 枚举值为字符串

   ```typescript
   enum E = { A = 'a' }
   ```

3. 枚举值为数字

   ```typescript
   enum E = { A = 1/-2 }
   ```

使用方法

```typescript
enum Status {
    off,
    on,
}

interface Light {
    type: Status;
}

const light: Light = {
    type: Status.off,
};
const light1: Light = {
    type: Status.on,
};

enum Animals {
    Dog = 1,
    Cat = 2,
}

interface Dog {
    type: Animals.Dog;
}

const dog: Dog = {
    type: Animals.Dog,
};
const dog1: Dog = {
    type: 555,
};
```

### const enum

枚举类型编制成js代码时 会编译成一个对象

```typescript
enum Status {
    success = 200,
    failed = 400,
}

let a = Status.success;
```

```javascript
var Status;
(function (Status) {
    Status[Status["success"] = 200] = "success";
    Status[Status["failed"] = 400] = "failed";
})(Status || (Status = {}));
var a = Status.success;
// Status {200: "success", 400: "failed", success: 200, failed: 400}
```

const enum

```typescript
const enum Status {
    success = 200,
    failed = 400,
}

let a = Status.success;
```

```typescript
//编译结果
var a = 200 /* success */;
```

## 类型推断和兼容性

typescript 会自动判断变量类型

```typescript
let a = 1;
a = 'hello' // 报错
```

## 高级类型

### 声明和并

ts接口和命名空间可以多次声明,ts最后会把他们合并

## 装饰器

## 类型操作

### keyof

keyof: 取interface的键后保存为联合类型

```typescript
interface userInfo {
    name: string
    age: number
}

type keyofValue = keyof userInfo
// keyofValue = "name" | "age"
```

### in

取联合类型的值，主要用于数组和对象的构

```typescript
type name = 'firstname' | 'lastname'
type TName = {
    [key in name]: string
}
// TName = { firstname: string, lastname: string }
```

### Pick<Type, Keys>

通过从 `Type` 中选取一组属性 `Keys`（字符串字面或字符串字面的并集）来构造一个类型。

```typescript
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>;

type TodoPreview = {
    title: string;
    completed: boolean;
}

type MyPick<T, K extends keyof T> = {
    [key in K]: T[key];
};
```

### Parameters\<Type>

从函数类型 `Type` 的参数中使用的类型构造元组类型
