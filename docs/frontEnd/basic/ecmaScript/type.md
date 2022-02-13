# 类型

JavaScript 内部内置七种类型，大方面可划分为基本类型和对象类型(Object)。

基本类型分为：`number` ,`string`,`symbol`,`null`,`undefined`,`boolen`。

对象类型:`object`,js 内置对象如`array`,`regExp`，`number`等，它们都可以看成是`object`得子类。

## 判断类型

常用判断类型得方法

### typeof

`typeof` 能正确显示出基本类型的类型，返回对应类型的字符串,其中`null`比较特性，`typeof null`会放回字符串 `object`，这算是一个 bug，和最初 js 的设计有关。

```js
console.log(typeof 0); //number
console.log(typeof "0"); //string;
console.log(typeof false); //boolean;
console.log(typeof Symbol("0")); //symbol;
console.log(typeof undefined); //undefined;
console.log(typeof null); //object;
```

当右操作符为对象类型时，无论其变量是什么，`typeof`都会显示为。

```js
console.log(typeof []); //object;
console.log(typeof {}); //object;
```

综上：`typeof`能判断除了`null`的基本类型，对于对象和`null`无法精确区分。

### instanceof

`instanceof`用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。正常情况下也就是左侧是不是右侧的实例。因为内部使用`prototype`来进行检测，如果修改了`prototype`，则会返回`false`

```js
const a = {};
console.log(a instanceof Object); //true
const b = [];
console.log(b instanceof Array); //true
```

::: tip 提示

```js
console.log(b instanceof Object); //true
console.log(Array.prototype); //[[Prototype]]: Object
```

因为 array.prototype 继承自 object.prototype
:::

根据其原理可手写一个`instanceof`如下：

```js
const myInstanceof = (object, constructor) => {
  const prototype = constructor.prototype;
  object = object._proto_;
  while (true) {
    if (object === null) return false;
    if (object === prototype) return true;
    object = object._proto_;
  }
};
```

### 判断对象

对于对象类型的判断目前最好的办法是：`Object.prototype.toString.call()`,同时也能判断基本类型。
es6 新增数组判断`Array.isArray()`

```js
console.log(Array.isArray([])); //true
console.log(Object.prototype.toString.call(1)); //[object Number]
console.log(Object.prototype.toString.call([])); //[object Array]
console.log(Object.prototype.toString.call({})); //[object Object]
console.log(Object.prototype.toString.call(/^1/)); //[object RegExp]
```

## number

JavaScript 的数字类型是浮点类型。并且浮点类型基于 IEEE 754 标准实现（64 位）。符号位占 1 位，指数位占 11 位，有效数字位占 52 位。取值范围`[-2^53-1, 2^53-1]`

`console.log(0.1 + 0.2 === 0.3);//false`,原因是再进行`+`法时会吧两者转换为二进制来进行运算，截断后得二进制再转换为十进制小数位有余导致判断为`false`。可通过指定小数后有效位数解决。

NaN 属性用于指示某个值不是数字。并且 NaN 不等于自身。可使用`isNaN()`来判断一个值是否是`NaN`。

ES2020 引入了一种新的数据类型`bigInt`,解决精度和大数据运算。

# 变量

js 声明变量得方式不同于 java，c 等强类型语言。

## 声明变量

使用`const`,`let`,`var`进行变量赋值。优先级`cosnt`>`let`>`var`。

基本类型储存在`栈`空间上，对象类型储存在`堆`中

当给`const`声明得变量赋值基本类型时，一般把这个变量作为常量对待。当赋值为一个对象时，变量得值是一个`指针`，这个指针指向对象所处得`堆`位置，指针不能修改，可修改对象内部属性。

```js
const PI = "3.14";
const obj = {
  a: 0,
};
obj.a = 1;
console.log(obj); //{a: 1}
```

`let`在未声明前无法赋值，存在暂时性死区，会形成块级作用域。同时在浏览器环境中，`let`声明得变量不会挂载到全局。`let`和`const`均不允许重复声明。

```js
console.log(a); //Uncaught ReferenceError: Cannot access 'a' before initialization
let a = 0;
```

字面量使用`toString()`等方法得时候会转变为其对应包装对象,然后来执行对应方法。
对象转换基本类型会调用`valueOf()`，`toString()`。这两个方法可重写。

## 作用域

在 js 中作用域分为 全局作用域，函数作用域，块级作用域。

`let`可解决以下经典问题。

```js
//let
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
} //0 1 2 3 4 5 6 7 8 9

//闭包
for (var i = 0; i < 10; i++) {
  ((i) => {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  })(i);
} //0 1 2 3 4 5 6 7 8 9
```

## 浅拷贝

对于`基本类型`，赋值操作会重新开辟空间，并且进行值得复制。

```js
let a = 10;
let b = a;
a = 1;
console.log(a); //1
console.log(b); //10
```

对于`引用类型`,变量储存得是对象的`指针`，因此赋值操作传递的是`指针`地址，修改一个变量，影响所有指向这个对象的变量。

```js
const obj = {
  a: 1,
};
const b = obj;
console.log(b === obj); //true，不是值相等，是地址相等
b.a = 0;
console.log(obj.a); //0
```

浅拷贝可用方法`Object.assign();`,展开运算符`...`。数组的`Array.from()`。

### Object.assign()

```js
const obj = {
  a: 0,
};
const b = Object.assign({}, obj);
console.log(obj === b); //fasle
```

### 展开运算符

```js
const obj = {
  a: 0,
};
const c = { ...obj };
console.log(obj === c); //fasle
```

### Array.from()

```js
let a = [1, 0, 1, 2];
let b = Array.from(a);
b[0] = 100;
console.log(b); //[100, 0, 1, 2]
console.log(a === b); //false
```

不过浅拷贝只能解决一层对象复制问题。在值是`引用类型`时无法深层次拷贝，依旧存在引用问题。不能解决循环引用的对象。

```js
const obj = {
  a: 0,
  b: {
    c: 0,
  },
};
const b = Object.assign({}, obj);
obj.b.c = 100;
console.log(b.b.c); //100
```

## 深拷贝

使用`JSON`来实现深拷贝。

```js
const obj = {
  a: 0,
  b: {
    c: 1,
  },
};
const obj1 = JSON.parse(JSON.stringify(obj));
obj.b.c = 1000;
console.log(obj1.b.c); //1
```

使用`JSON.stringify()`把对象转化为字符串,再使用`JSON.parse()`把字符串转换为对象，会重新开辟空间并赋值，完成深拷贝。不过该方法会有以下局限性：

- 忽略`undefined`
- 忽略`symbol`
- 函数无法拷贝
- 不能解决循环引用的对象

```js
const obj = {
  a: undefined,
  b: () => {
    console.log(0);
  },
  c: Symbol("0"),
  d: 0,
};
const obj1 = JSON.parse(JSON.stringify(obj));
console.log(obj1); //{d: 0}
```

为此可以自定义一个简易深拷贝函数，如下：

```js
const deepCopy = (v, obj = {}) => {
  for (let [key, value] of Object.entries(v)) {
    if (Object.prototype.toString.call(value) === "[object Object]") {
      obj[key] = {};
      deepCopy(value, obj[key]);
    } else {
      obj[key] = value;
    }
  }
  return obj;
};
const obj = {
  a: undefined,
  b: () => {
    console.log(0);
  },
  c: Symbol("0"),
  d: 0,
  e: {
    a: 0,
  },
};
const obj1 = deepCopy(obj);
obj.e.a = 100;
obj1.b(); //0
console.log(obj.e.a); // 0
```
