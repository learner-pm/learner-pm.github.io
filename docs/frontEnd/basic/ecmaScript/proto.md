# 原型链

js 是一门面向对象语言，但又不完全具有面向对象语言得特征。js 中没有`继承`这个概念，不过原型链在一定程度上模拟了继承的一些特性，同时原型链也是 js 的一个关键内容。

## 原型

对象具有一个属性`__proto__`（不规范，浏览器支持）,函数具有一个属性`prototype`，函数相当于类这个概念~~~。

### **proto**

一个例子：

```js
const b = {
  a: 0,
};
console.log(b.toString());
console.log(b.__proto__.toString());
```

对象`b`没有`toString()`方法，但你调用它时不报错，原因就是它会在当前对象的`__proto__`上查找这个方法。

变量`b`保存的是一个对象，在不进行修改的情况下`b.__proto__`是指向`Object.prototype`.

```js
console.log(b.__proto__);
console.log(b.__proto__ === Object.prototype); //true
```

一个对象在调用一个方法时会去查找当前对象有没有这个方法，没有就去它的`__proto__`上查找，查找到即调用（会调用 call 改变 this 指向当前对象），没有则继续查找，直到查找到顶部即`null`。这样的查找过程就像是链式调用一样，因此把这个过程称作原型链。

原型链顶层是`null`,同时`null`没有原型。

```js
console.log({}.__proto__.__proto__); //null
```

`__proto__`是可以人为修改的，原型也是一个对象。如下例子：把`b.__proto__`指向`c`对象，`c`对象中我们修改了`toString()`方法。这时调用`b.toString()`方法，就会按照原型链查找，当查找到`c`对象后就不会继续查找了。

```js
const b = {
  a: 0,
};
const c = {
  toString() {
    return "c";
  },
};
b.__proto__ = c;
console.log(b.toString()); //c
```

### prototype

函数具有`prtotype`属性,就像对象一样，函数的`prtotype`可以看作是函数实例的原型。如下例子，函数`demo`内部没有定义`a`方法，但仍然可以执行，原因就是在函数`demo`的`prototype`上定义了方法`a`,`A`中没有这个方法，就去`prototyp`上查找。

```js
function demo() {}
demo.prototype.a = function () {
  return "a";
};
const A = new demo();
console.log(A.a()); //a
console.log(A.__proto__ === demo.prototype); //true
```

注意如下写法会重写整个原型。函数本身也是有原型的，指向`Object`。

```js
function demo() {}
demo.prototype = {
  a() {
    return "a";
  },
};
const A = new demo();
console.log(A.__proto__); //{a:f} 其他方法均无。
```

### 原型链

对象的`__proto__`用来查找原型，函数的`prototype`用来编写显示原型。当一个对象调用方法时，会去它的`__proto__`上一层一层查找，查找到显示原型(即使用`prototype`添加的方法)的方法就调用，没有就调用隐式原型的方法（自带，写好的方法如：`toString()`）。这样的查找过程就是原型链。

## Class

ex6 新增了`Class`关键字和其相关属性，这让类以及相关操作更加的语义化。

```js
class _class {
  constructor() {} //同于Java中类的构造方法
}
```

### extends 关键字

es6 的继承本质时原型链的语法糖。子内必须调用`super`来建立链接，相当于调用`Animal.prototype.contructor.call(this)`来让子类指向它。

子类的`__proto__`指向父类。是构造函数得继承。

子类得`prototype`属性得`__proto__`属性指向父类的`prototype`属性，方法的继承。

```js
class Animal {
  constructor(type, food) {
    this.type = type;
    this.food = food;
  }
  eat() {
    return this.type + " eat " + this.food;
  }
}
class Cat extends Animal {
  constructor(food) {
    super("cat", food);
  }
}
const cat = new Cat("fish");
console.log(cat.eat()); //cat eat fish
```
