# Object

## 静态方法

- 遍历/转换：keys / values / entries / fromEntries
- 拷贝/合并：assign
- 相等判断：is
- 原型操作：create / getPrototypeOf / setPrototypeOf
- 属性精细控制：defineProperty / getOwnPropertyDescriptor…
- 防修改：freeze / seal / preventExtensions
- 判断自身属性：hasOwn

### 1. Object.keys(obj)

- 作用：返回**自身可枚举**属性名数组
- 不包含：原型链、不可枚举、Symbol

```js
const obj = { a: 1, b: 2 };
Object.keys(obj); // ['a','b']
```

---

### 2. Object.values(obj)

- 作用：返回**自身可枚举**属性值数组

```js
Object.values(obj); // [1,2]
```

---

### 3. Object.entries(obj)

- 作用：返回 `[[key,value], ...]` 数组

```js
Object.entries(obj); // [['a',1], ['b',2]]
```

---

### 4. Object.fromEntries(arr)

- 作用：把 `[[k,v]]` 转回对象（entries 逆操作）

```js
Object.fromEntries([
  ['a', 1],
  ['b', 2],
]); // {a:1,b:2}
```

---

### 5. Object.assign(target, ...sources)

- 作用：**浅拷贝、合并对象**
- 后面覆盖前面

```js
const target = {};
Object.assign(target, { a: 1 }, { b: 2 }); // {a:1,b:2}
```

---

### 6. Object.is(a, b)

- 作用：**同值相等**
- 与 === 区别：
  - `Object.is(NaN,NaN) → true`
  - `Object.is(+0,-0) → false`

```js
Object.is(NaN, NaN); // true
```

---

### 7. Object.create(proto, descriptors?)

- 作用：以指定**原型**创建对象

```js
const obj = Object.create(null); // 无原型的纯净对象
```

- 继承

```js
// obj.__proto__ 指向 anotherObj
// obj.__proto__ === anotherObj true
const obj = Object.create(anotherObj); // 继承 anotherObj
```

- 定义属性

```js
const obj = Object.create(null, {
  name: {
    value: 'zs',
    writable: false,
    enumerable: true,
  },
});
```

---

### 8. Object.getPrototypeOf(obj)

- 作用：获取对象的**原型**

```js
Object.getPrototypeOf(obj);
```

---

### 9. Object.setPrototypeOf(obj, proto)

- 作用：设置原型
- 性能差，**不推荐频繁使用**

```js
Object.setPrototypeOf(obj, anotherObj);
```

---

### 10. Object.defineProperty(obj, key, desc)

- 作用：精细定义/修改一个属性

```js
Object.defineProperty(obj, 'c', {
  value: 3,
  writable: true,
  enumerable: true,
  configurable: false,
});
Object.defineProperty(obj, 'd', {
  enumerable: true,
  configurable: false,
  get() {
    return this._value || 3; // 初始值设为 3
  },
  set(newValue) {
    this._value = newValue; // 把值存到 _value 私有变量
  },
});
```

---

### 11. Object.defineProperties(obj, descs)

- 作用：一次定义多个属性

```js
Object.defineProperties(obj, {
  a: { value: 1 },
  b: { value: 2 },
});
```

---

### 12. Object.getOwnPropertyDescriptor(obj, key)

- 作用：获取某个属性的**描述符**

```js
Object.getOwnPropertyDescriptor(obj, 'a');
```

---

### 13. Object.getOwnPropertyNames(obj)

- 作用：返回**自身所有属性名**（包括不可枚举）
- 不包含：Symbol

```js
Object.getOwnPropertyNames(obj);
```

---

### 14. Object.getOwnPropertySymbols(obj)

- 作用：返回自身的 **Symbol 属性**

```js
const s = Symbol();
obj[s] = 1;
Object.getOwnPropertySymbols(obj); // [s]
```

---

### 15. Object.preventExtensions(obj)

- 作用：禁止**添加新属性**
- 可修改、可删除

```js
Object.preventExtensions(obj);
```

---

### 16. Object.seal(obj)

- 密封：
  - 不能**添加**
  - 不能**删除**
  - 能**修改**已有值

```js
Object.seal(obj);
```

---

### 17. Object.freeze(obj)

- 冻结：**完全不可变**（浅冻结）
  - 不能增、删、改

```js
Object.freeze(obj);
```

---

### 18. Object.isExtensible(obj)

- 是否可添加新属性

```js
Object.isExtensible(obj);
```

### 19. Object.isSealed(obj)

- 是否被密封

```js
Object.isSealed(obj);
```

### 20. Object.isFrozen(obj)

- 是否被冻结

```js
Object.isFrozen(obj);
```

---

### 21. Object.hasOwn(obj, key)

- 作用：判断**是否是自身属性**（替代 obj.hasOwnProperty）
- 更安全，不受原型污染影响

```js
Object.hasOwn(obj, 'a'); // true
```

## 创建对象

### 工厂模式

```js
function createPerson(name, age, job) {
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    console.log(this.name);
  };
  return o;
}

let person1 = createPerson('Nicholas', 29, 'Software Engineer');
let person2 = createPerson('Greg', 27, 'Doctor');
```

### 构造函数模式

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function () {
    console.log(this.name);
  };
}

let person1 = new Person('Nicholas', 29, 'Software Engineer');
let person2 = new Person('Greg', 27, 'Doctor');
person1.sayName(); // Nicholas
person2.sayName(); // Greg
```

### 原型模式

```js
function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
  console.log(this.name);
};

let person1 = new Person();
let person2 = new Person();
person1.sayName(); // Nicholas
person2.sayName(); // Nicholas

// 原型对象方法
console.log(Person.prototype.isPrototypeOf(person1)); // true
console.log(Object.getPrototypeOf(person1) === Person.prototype); // true
console.log(person1.hasOwnProperty('name')); // false
console.log('name' in person1); // true

// 原型链
console.log(person1.toString()); // [object Object]
console.log(person1 instanceof Person); // true
console.log(person1 instanceof Object); // true
```

### 组合模式（推荐）

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ['Shelby', 'Court'];
}

Person.prototype = {
  constructor: Person,
  sayName: function () {
    console.log(this.name);
  },
};

let person1 = new Person('Nicholas', 29, 'Software Engineer');
let person2 = new Person('Greg', 27, 'Doctor');

person1.friends.push('Van');
console.log(person1.friends); // ["Shelby", "Court", "Van"]
console.log(person2.friends); // ["Shelby", "Court"]
console.log(person1.friends === person2.friends); // false
console.log(person1.sayName === person2.sayName); // true
```

### 对象迭代

```js
const obj = {
  name: 'John',
  age: 30,
  city: 'New York',
};

// 1. for...in 循环（遍历可枚举属性）
for (let key in obj) {
  console.log(key + ': ' + obj[key]);
}

// 2. Object.keys()（返回可枚举属性数组）
Object.keys(obj).forEach(key => {
  console.log(key + ': ' + obj[key]);
});

// 3. Object.values()（返回可枚举属性值数组）
Object.values(obj).forEach(value => {
  console.log(value);
});

// 4. Object.entries()（返回键值对数组）
Object.entries(obj).forEach(([key, value]) => {
  console.log(key + ': ' + value);
});

// 5. Object.getOwnPropertyNames()（返回所有属性，包括不可枚举）
Object.getOwnPropertyNames(obj).forEach(key => {
  console.log(key);
});

// 6. Object.getOwnPropertySymbols()（返回符号属性）
const sym = Symbol('sym');
obj[sym] = 'symbol value';
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(sym)]

// 7. Reflect.ownKeys()（返回所有属性，包括符号）
console.log(Reflect.ownKeys(obj)); // ["name", "age", "city", Symbol(sym)]
```

## 继承

### 原型链继承

```js
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function () {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

// 继承 SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
  return this.subproperty;
};

let instance = new SubType();
console.log(instance.getSuperValue()); // true
console.log(instance.getSubValue()); // false
console.log(instance instanceof Object); // true
console.log(instance instanceof SuperType); // true
console.log(instance instanceof SubType); // true
```

### 借用构造函数继承

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green'];
}

function SubType() {
  // 继承 SuperType
  SuperType.call(this);
}

let instance1 = new SubType();
instance1.colors.push('black');
console.log(instance1.colors); // ["red", "blue", "green", "black"]

let instance2 = new SubType();
console.log(instance2.colors); // ["red", "blue", "green"]
```

### 组合继承（推荐）

```js
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name);
  this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  console.log(this.age);
};

let instance1 = new SubType('Nicholas', 29);
instance1.colors.push('black');
console.log(instance1.colors); // ["red", "blue", "green", "black"]
instance1.sayName(); // Nicholas
instance1.sayAge(); // 29

let instance2 = new SubType('Greg', 27);
console.log(instance2.colors); // ["red", "blue", "green"]
instance2.sayName(); // Greg
instance2.sayAge(); // 27
```

### 原型式继承

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};

let anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');

let yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Barbie');

console.log(person.friends); // ["Shelby", "Court", "Van", "Rob", "Barbie"]
```

### 寄生式继承

```js
function createAnother(original) {
  let clone = object(original); // 通过调用函数创建一个新对象
  clone.sayHi = function () {
    // 以某种方式增强这个对象
    console.log('hi');
  };
  return clone; // 返回这个对象
}

let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};

let anotherPerson = createAnother(person);
anotherPerson.sayHi(); // hi
```

### 寄生组合式继承（最佳实践）

```js
function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype); // 创建对象
  prototype.constructor = subType; // 增强对象
  subType.prototype = prototype; // 指定对象
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
  console.log(this.age);
};

let instance = new SubType('Nicholas', 29);
instance.sayName(); // Nicholas
instance.sayAge(); // 29
```

## 类

>

### ES6 类基础

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayName() {
    console.log(this.name);
  }

  static create(name, age) {
    return new Person(name, age);
  }
}

let person = new Person('Nicholas', 29);
person.sayName(); // Nicholas

// 静态方法
let person2 = Person.create('Greg', 27);
person2.sayName(); // Greg
```

### 类继承

> 类继承本质是寄生组合式继承的语法糖

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }

  speak() {
    super.speak(); // 调用父类方法
    console.log(`${this.name} barks.`);
  }

  getBreed() {
    return this.breed;
  }
}

let dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // Rex makes a noise. Rex barks.
console.log(dog.getBreed()); // German Shepherd
```
