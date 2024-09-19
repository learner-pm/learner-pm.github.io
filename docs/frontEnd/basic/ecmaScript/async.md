# 异步

浏览器有 GUI 渲染引擎线程，js 引擎线程，浏览器事件线程，定时器触发线，http 异步线程 ajax，eventloop 处理线程。

## 定时器

用`setInterval`做动画可由`requestAnimationFrame`代替。

```js
setTimeout(() => {
  console.log(0)
}, 0) //虽然写得0，但最低为4ms
setInterval(() => {
  console.log(0)
}, 1000)
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
console.log(0)
setTimeout(() => {
  console.log(3)
}, 0)
Promise.resolve().then(() => {
  console.log(2)
})
console.log(1)
// 0 1 2 3
```

遇到微任务就把微任务放到微任务队列，遇到宏任务就把宏任务放到宏任务队列。注意的是，`async`声明的函数在遇到`await`关键字之前都是同步执行，关键字后的代码可看作是`then()`代码执行。

```js
async function async1() {
  console.log('A')
  await async2()
  console.log('B')
}
async function async2() {
  console.log('C')
}
console.log('D')
setTimeout(() => {
  console.log('E')
}, 0)

async1()

new Promise(function (resolve) {
  console.log('F')
  resolve()
}).then(function () {
  console.log('G')
})
console.log('H')
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
const pending = 0
const fulfilled = 1
const rejected = -1
```

定义类

```js
class MyPromise {}
```

首先编写`constructor`函数

在使用时，`Promise`会立即执行入参函数，所有这里需要执行执行fn，`resolve`和`reject`是内部提供给入参函数的参数，下面来实现这两个函数

```js
class MyPromise {
  constructor(fn) {
    const resolve = this.#resolve.bind(this)
    const reject = this.#reject.bind(this)

    try {
      fn(resolve, reject) // 执行传入的函数
    } catch (error) {
      reject(error) // 如果执行时出错，直接调用 reject
    }
  }
}
```

两个函数接受`Promise`使用者的参数，主要逻辑为

- 判断当前`Promise`状态，防止误触
- 修改当前`Promise`状态
- 赋值给`result`
- 调用回调函数，该回调函数为`then`和`catch`函数

对`resolve`中进行一个特殊处理，当其值为`Promise`时使用它的状态

```js
class MyPromise {
  #state = pending // 私有字段，表示 Promise 的状态
  #result // 存储 Promise 的值或错误
  #thenCallbacks = [] // 存储 fulfilled 状态下的回调函数

  #resolve(value) {
    if (this.#state !== pending) return

    if (value instanceof MyPromise) {
      // 如果 resolve 的值是一个 Promise，则等待其状态
      value.then(this.#resolve).catch(this.#reject)
      return
    }

    this.#state = fulfilled
    this.#result = value
    this.#thenCallbacks.forEach(callback => callback(value))
  }

  #reject(error) {
    if (this.#state !== pending) return
    this.#state = rejected
    this.#result = error
    this.#thenCallbacks.forEach(callback => callback(error))
  }
}
```

下面实现`then`和`catch`函数，`then`函数接收两个函数，当`Promise`状态为`fulfilled`的回调和状态为`rejected`的回调

由于支持链式调用，因此`then`函数需要返回一个新的`Promise`，首先根据当前状态判断是否立即执行回调函数

```js
 then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.#state === pending) {
        this.#thenCallbacks.push(handleCallback);
      } else {
        handleCallback();
      }
    });
  }
```

下面来实现`handleCallback`，主要是根据当前`Promise`的状态来进行判断

**fulfilled**

- 获取入参函数的值
- 看是否为`Promise`
- 将当前的值`resolve`传递给下一层的`then`

**rejected**

- 存在直接调用函数，修改当前`Promise`为`fulfilled`
- 不存在向下传递异常，直到找到`catch`的入参函数

```js
const handleCallback = () => {
  try {
    if (this.#state === fulfilled) {
      const result = onFulfilled ? onFulfilled(this.#result) : this.#result
      if (result instanceof MyPromise) {
        result.then(resolve).catch(reject) // 处理返回的 Promise
      } else {
        resolve(result) // 返回非 Promise 的值，直接 resolve
      }
    } else if (this.#state === rejected && onRejected) {
      const result = onRejected(this.#result)
      resolve(result) // 调用 reject 的回调函数并 resolve 新的结果
    } else if (this.#state === rejected) {
      reject(this.#result) // 没有传入 reject 回调则继续向下传播错误
    }
  } catch (error) {
    reject(error) // 捕获回调中的异常
  }
}
```

最后是实现`catch`函数，由于then中已有对于这个的处理，为了可以链式调用，内部直接调用`then`方法即可

```js
  catch(onRejected) {
    return this.then(null, onRejected); // 直接使用 then 方法的第二个参数来处理错误
  }
```

完整代码

```js
 then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleCallback = () => {
        try {
          if (this.#state === fulfilled) {
            const result = onFulfilled
              ? onFulfilled(this.#result)
              : this.#result;
            if (result instanceof MyPromise) {
              result.then(resolve).catch(reject); // 处理返回的 Promise
            } else {
              resolve(result); // 返回非 Promise 的值，直接 resolve
            }
          } else if (this.#state === rejected && onRejected) {
            const result = onRejected(this.#result);
            resolve(result); // 调用 reject 的回调函数并 resolve 新的结果
          } else if (this.#state === rejected) {
            reject(this.#result); // 没有传入 reject 回调则继续向下传播错误
          }
        } catch (error) {
          reject(error); // 捕获回调中的异常
        }
      };

      if (this.#state === pending) {
        this.#thenCallbacks.push(handleCallback);
      } else {
        handleCallback();
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected); // 直接使用 then 方法的第二个参数来处理错误
  }
```

这样就实现了一个简单的`Promise`，完整代码

```js
const pending = 0
const fulfilled = 1
const rejected = -1

class MyPromise {
  #state = pending // 私有字段，表示 Promise 的状态
  #result // 存储 Promise 的值或错误
  #thenCallbacks = [] // 存储 fulfilled 状态下的回调函数
  #catchCallbacks = [] // 存储 rejected 状态下的回调函数

  constructor(fn) {
    const resolve = this.#resolve.bind(this)
    const reject = this.#reject.bind(this)

    try {
      fn(resolve, reject) // 执行传入的函数
    } catch (error) {
      reject(error) // 如果执行时出错，直接调用 reject
    }
  }

  #resolve(value) {
    if (this.#state !== pending) return

    if (value instanceof MyPromise) {
      // 如果 resolve 的值是一个 Promise，则等待其状态
      value.then(this.#resolve).catch(this.#reject)
      return
    }

    this.#state = fulfilled
    this.#result = value
    this.#thenCallbacks.forEach(callback => callback(value))
  }

  #reject(error) {
    if (this.#state !== pending) return
    this.#state = rejected
    this.#result = error
    this.#thenCallbacks.forEach(callback => callback(error)) // 执行所有 catch 回调
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleCallback = () => {
        try {
          if (this.#state === fulfilled) {
            const result = onFulfilled
              ? onFulfilled(this.#result)
              : this.#result
            if (result instanceof MyPromise) {
              result.then(resolve).catch(reject) // 处理返回的 Promise
            } else {
              resolve(result) // 返回非 Promise 的值，直接 resolve
            }
          } else if (this.#state === rejected && onRejected) {
            const result = onRejected(this.#result)
            resolve(result) // 调用 reject 的回调函数并 resolve 新的结果
          } else if (this.#state === rejected) {
            reject(this.#result) // 没有传入 reject 回调则继续向下传播错误
          }
        } catch (error) {
          reject(error) // 捕获回调中的异常
        }
      }

      if (this.#state === pending) {
        this.#thenCallbacks.push(handleCallback)
      } else {
        handleCallback()
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected) // 直接使用 then 方法的第二个参数来处理错误
  }
}
```

测试如下代码，结果符合js原生的`Promise`，满足预期

```js
// 测试代码
const pro = new MyPromise((resolve, reject) => {
  console.log('执行了')
  setTimeout(() => {
    resolve('初始 Promise')
  }, 2000)
})

// 返回一个新的 Promise
pro
  .then(res => {
    console.log('第一个 then:', res)
    return new MyPromise((resolve, reject) => {
      const random = Math.random()
      setTimeout(() => {
        if (random > 0.5) {
          resolve('新的 Promise 完成')
        } else {
          reject('随机数小于 0.5')
        }
      }, 1000)
    })
  })
  .then(res => {
    console.log('第二个 then:', res)
  })
  .catch(err => {
    console.log('捕获错误:', err)
  })
```
