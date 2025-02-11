# Function

## arguments

调用函数传递的参数，有**length**属性，是个类数组对象

箭头函数没有 arguments：箭头函数的 arguments 会指向外层函数的 arguments（如果有的话）。
```js
function example() {
    // arguments.length 数值代表传入参数的个数
    if (arguments.length) {
    ...
    } else {
    ...
    }
}

```

```js
function example(...args) {
  // 使用 Rest 参数转化成数组
  args.forEach(arg => console.log(arg)); // 直接使用数组方法
}
```
## new.target
检测函数是否使用 new 关键字调用的

```js
function King() {
    if (!new.target) {
        throw 'King must be instantiated using "new"'
    }
    console.log('King instantiated using "new"');
}

new King(); // King instantiated using "new" 
King(); // Error: King must be instantiated using "new" 
```

## this

1. 对象里方法里的this指向该对象,方法里面函数的this指向window或调用者
2. 谁调用指向谁
3. 箭头函数指向父级作用域里的this

## call、apply和bind

> call、apply都可以调用函数,改变函数this指向.但传递参数的方式不同.

```js
function a(...arg) {
    console.log(this.name, arg.join(' '))
}
```

1. call

```js
a.call({name: 'jerry'}, '在', '逃跑')
```

2. apply

```js
a.apply({name: 'tom'}, ['在', '追击'])
```

3. bind不会立即执行，会返回一个新函数
```js
a.bind({name: 'Me'}, 'is ', 'Fuction')()
```
## 闭包

闭包就是一个函数，这个函数能够访问其他函数的作用域中的变量。

函数只有在调用时才会在内存中开辟空间,当函数执行完成后,不在被使用后,垃圾回收机制会回收内存空间.
函数内部定义的变量会被重置.

有时我们希望这些变量不被重置,可以被继续使用.这时候就需要闭包.