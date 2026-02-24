// 参数装饰器：标记参数为必填
function Required(target: any, propertyKey: string, parameterIndex: number) {
  console.log(
    `执行 参数装饰器Required：方法${propertyKey}的第${parameterIndex}个参数`
  );
}

// 类装饰器（无改动）
function A() {
  console.log('执行 A 类装饰器');
  return function (target: any) {
    console.log('运行 A 包装');
  };
}

function B() {
  console.log('执行 B 类装饰器');
  return function (target: any) {
    target.test1 = function () {
      console.log(456);
    };
    target.prototype.test2 = function () {
      console.log(123);
    };
    console.log('运行 B 包装');
  };
}

function C() {
  console.log('执行 C 方法装饰器');
  return function (target: any, key: any, descriptor: any) {
    const originalMethod = descriptor.value;
    console.log('运行 C 包装');

    descriptor.value = function (...args: any[]) {
      console.log('包装后的方法 C');
      const result = originalMethod.apply(this, args);
      return result;
    };
    return descriptor;
  };
}

function D() {
  console.log('执行 D 方法装饰器');
  return function (target: any, key: any, descriptor: any) {
    const originalMethod = descriptor.value;
    console.log('运行 D 包装');
    descriptor.value = function (...args: any[]) {
      console.log('包装后的方法 D');
      const result = originalMethod.apply(this, args);
      return result;
    };
    return descriptor;
  };
}

@A()
@B()
class Demo {
  @C()
  @D()
  test(@Required a: number, @Required b?: number) {
    console.log('===== 方法执行 =====');
    console.log('===== 参数 a = ' + a);
  }
}

console.log('===== 类定义完成 =====');

const d = new Demo();
console.log('===== 调用函数 =====');
d.test(456);
