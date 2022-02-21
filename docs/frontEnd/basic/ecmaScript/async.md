# 异步

浏览器内部有 GUI 渲染引擎线程，js 引擎线程，浏览器事件线程，定时器触发线，http 异步线程 ajax，eventloop 处理线程。

## 定时器

用`setInterval`做动画可由`requestAnimationFrame`代替。

```js
setTimeout(() => {
  console.log(0);
}, 0); //虽然写得0，但最低为4ms
setInterval(() => {
  console.log(0);
}, 1000);
```

## Event Loop

js 是单线程的语言。js 任务分为同步任务和异步任务，如何处理好两者的执行是 js 执行的关键，Event Loop 就是为此而出现。

异步任务又分为宏任务和微任务。

### 宏任务

宏任务包括：

- setTimeout
- setInterval
- script
- I/O
- requestAnimationFrame

`script`整体代码也可以作为一个宏任务。

### 微任务

微任务包含：

- Promise.then
- catch
- finally
- async await

### 事件循环

简单来讲：执行代码时，遇到同步代码就执行，如果遇到异步任务就把代码添加到异步任务队列里面等待执行，当同步任务执行完时，就会去查找异步任务队列，有任务就拿出来放到执行队列里面去执行，异步任务执行时：微任务>宏任务，即先执行完微任务，在执行宏任务，依此循环。

因为`script`属于宏任务，也可以这样理解：开始执行代码，遇到微任务就放到本次事件循环队尾，宏任务放到下次事件循环开头，那么最开始的`script`代码也就是第一次执行的开头部分，后续依次循环执行。

```js
console.log(0);
setTimeout(() => {
  console.log(3);
}, 0);
Promise.resolve().then(() => {
  console.log(2);
});
console.log(1);
// 0 1 2 3
```

遇到微任务就把微任务放到微任务队列，遇到宏任务就把宏任务放到宏任务队列。注意的是，`async`声明的函数在遇到`await`关键字之前都是同步执行，关键字后的代码可看作是`then()`代码执行。

```js
async function async1() {
  console.log("A");
  await async2();
  console.log("B");
}
async function async2() {
  console.log("C");
}
console.log("D");
setTimeout(() => {
  console.log("E");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("F");
  resolve();
}).then(function () {
  console.log("G");
});
console.log("H");
// D A C F H B G E
```

对此解析：

- async1 async2 都是声明，遇到 console.log("D") 打印 `D`
- 遇到 setTimeout,把代码放到宏任务队列
- 执行 async1： 先打印 `A` 再执行 async2 打印 `C`，回到 async1，await 后面的代码放入微任务队列
- 遇到 Promise，promise 声明就执行，先打印 `F` ,执行 resolve(), promise.then()的代码放入微任务队列
- 遇到 console.log("H") 打印 `H`，至此同步代码执行完毕，开始查找异步任务。
- 查找微任务，此时微任务有 async1 的微任务 和 new Promise 的微任务，按照顺序执行，先打印 `B`，再打印 `G`
- 查找宏任务只有 setTimeout,执行，打印 `E`

## 手写 promise

定义状态

```js
const PENDING = "PENDING";
const FULFILED = "FULFILED";
const REJECTED = "REJECT";
```

定义`MyPromise`类

```js
class MyPromise {
  constructor(fun) {
    if (typeof fun !== "function") throw new Error("it need a function");
    fun(this.resolve, this.reject);
  }
  state = PENDING;
  value = undefined;
  errResion = undefined;
  callBackReject = undefined;
  callBackResolve = undefined;
  cache = undefined;
  resolve = (value) => {
    this.state = FULFILED;
    this.value = value;
    this.cache = this.callBackResolve && this.callBackResolve(value);
  };
  reject = (errResion) => {
    this.state = REJECTED;
    this.errResion = errResion;
  };
  then(callResolve, callReject) {
    if (this.state === FULFILED) {
      callResolve(this.value);
    }
    if (this.state === REJECTED) {
      callReject(this.errResion);
    }
    if (this.state === PENDING) {
      this.callBackResolve = callResolve;
      this.callBackReject = callReject;
    }
    // const _promise = new MyPromise((resolve, reject) => {
    //     return
    // });
    return new MyPromise((resolve, reject) => {
      if ((this.state = FULFILED)) {
        const x = callResolve(this.value);
        if (x instanceof MyPromise) {
          x.then(resolve);
        } else {
          resolve(x);
        }
      }
    });
  }
  test() {
    console.log(this.fun);
    console.log("11");
  }
}
```
