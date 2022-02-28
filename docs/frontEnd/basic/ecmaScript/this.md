# This

JavaScript 得`this`指向是动态得，只有当你调用得时候才确定`this`得指向，这有时候很苦恼。

## this

一句话：`this`指向调用它所处环境得上下文空间，也是指向最近调用它得对象。

在事件中，this 表示接收事件的 DOM 对象。

如下：调用`obj.fnc()`时，`fnc`函数所处得环境为`obj`对象，`this`就指向`obj`，函数执行打印`0`，执行`fnc()`时，由于`fnc = obj.fnc`操作，此时`fnc`变量指向函数本身，调用函数`this`就指向此时得环境即`window`，指向函数打印`1`。

```js
var a = 1;
const obj = {
  a: 0,
  fnc: function () {
    console.log(this.a);
  },
};
const fnc = obj.fnc;
obj.fnc(); //0
fnc(); //1
```

又一个例子。这里的`this`指向`obj.b`。

```js
const obj = {
  a: 0,
  b: {
    a: 1,
    fnc() {
      console.log(this.a); //1
    },
  },
};
obj.b.fnc();
```

## 改变 this

改变`this`指向有`new`，即构造函数，`call`，`apply`，和`bind`，以及箭头函数。

优先级：`new`操作符>`call`方法等>箭头函数>其他

### new

`new`操作会把`this`指向绑定到生成的对象。

```js
function Fnc() {
  this.a = 0;
}
const f = new Fnc();
console.log(f.a); //0
```

`new`操作做了什么？

- 生成一个新对象
- 链接原型
- 绑定 this
- 放回新对象

注意最后是返回一个对象。这个对象是默认返回的，如果你主动`return`一个对象，那么`this`指向你返回的那个对象。

```js
function Fnc() {
  this.a = 0;
  return {
    a: 1,
  };
}
const f = new Fnc();
console.log(f.a); //1
```

::: tip 提示
手动放回一个对象会导致原型指向改变。

```js
Fnc.prototype.b = 10;
console.log(f.b); //undefined
```

:::

### call 和 apply

`call`和`apply`均可修改`this`，不同的是参数传递方式。可结合 es6`rest`参数使用。

```js
const f = {
  a: 1,
  fnc: function (...res) {
    console.log(this.a + "," + res);
  },
};
const obj = {
  a: 0,
};
f.fnc.call(obj, 1, 2, 3); //0,1,2,3
f.fnc.apply(obj, [1, 2, 3]); //0,1,2,3
```

### bind

`bind`的使用方法和`call`一样，不同的是它放回一个函数，

```js
const f = {
  a: 1,
  fnc: function (...res) {
    console.log(this.a + "," + res);
  },
};
const obj = {
  a: 0,
};
const F = f.fnc.bind(obj, 1, 2, 3);
F(); //0,1,2,3
```

### 箭头函数

箭头函数的`this`会指向原本指向的环境得上一层环境。

```js
var a = 0;
const f = {
  a: 1,
  fnc: (...res) => {
    console.log(this); //window
    console.log(this.a + "," + res); //0,1,2,3
  },
};
f.fnc([1, 2, 3]);
```

对于对象，无论嵌套多深都是指向最外层对象。

```js
var a = -1;
const obj = {
  a: 0,
  b: {
    a: 1,
    fnc: () => {
      return this.a;
    },
  },
};
obj.b.fnc(); //-1
const test = obj.b.fnc;
test(); //-1
```

## 手写 call 等

`call`和`apply`一类。`bind`一类。所有写法都基于`es6`。

### call 和 apply

`call`使用`rest`进行参数收集，这里只是非严格模式下的写法模拟。通过调用对象得方法来改变函数得`this`指向。

```js
Function.prototype.myCall = function (context = window, ...res) {
  //参数传入模拟
  if (context === null) context = window;
  else if (typeof context === "number") context = new Number(context);
  else if (typeof context === "string") context = new String(context);
  else if (typeof context === "boolean") context = new Boolean(context);
  const symbol = Symbol("temporary");
  context[symbol] = this;
  const result = context[symbol](...res);
  delete context[symbol];
  return result;
};
```

使用:

```js
const demo = {
  a: 1,
  fnc(...res) {
    console.log(this); //瑕疵   {a:0,Symbol(temporary): f}
    console.log(this.a + "," + res); // 0,1,2
    return res;
  },
};
const obj = {
  a: 0,
};
var a = 100;
const p = demo.fnc.myCall(obj, 1, 2);
console.log(...p); //1 2
```

`apply`使用数组传参，就不使用`rest`收集参数。

```js
Function.prototype.myApply = function (context = window, res) {
  //代码一样
};
const p = demo.fnc.myApply(obj, [1, 2]);
```

### bind

`bind`放回一个函数，这个函数可以被调用，也可以作为构造函数使用。

```js
Function.prototype.myBind = function (context, ...res) {
  const fnc = this;
  return function F(...args) {
    if (this instanceof F) {
      return new fnc(...res, ...args);
    }
    return fnc.call(context, ...res, ...args);
  };
};
```

使用：

```js
const demo = {
  a: 1,
  fnc(...res) {
    console.log(this); //{a:0}
    console.log(this.a + "," + res); // 0,1,2,3
    return res;
  },
};
const obj = {
  a: 0,
};
var a = 100;
const p = demo.fnc.myBind(obj, 1, 2)(3);
console.log(p); //[1,2,3]
```
