# Other

## 防抖

防抖的含义就是调用一个函数后，从调用函数时的开始计时，到 n 秒后执行回调函数，如果在这时间范围内函数又被调用，则从调用时刻开始重新计时。

例子：用户在输入框输入内容后，间隔一秒发出请求。

```js
const debounce = (fnc, time) => {
  let number = undefined;
  return (...arg) => {
    clearTimeout(number);
    number = setTimeout(() => {
      fnc(arg);
    }, time);
  };
};
const request = debounce(() => {
  console.log("request");
}, 2000);
const test = () => {
  request();
};
```

## 节流

节流含义就是当用户触发一个函数时，在规定的时间内，无论再次触发多少次这个函数，只会调用一次回调函数。

例子：dom 事件的触发就含有节流的功能。

```js
const throttled = (fnc, time) => {
  let number = undefined;
  return (...arg) => {
    if (number == undefined) {
      number = setTimeout(() => {
        fnc(arg);
        clearTimeout(number);
        number = undefined;
      }, time);
    }
  };
};
const request = throttled(() => {
  console.log("request");
}, 4000);
const test = () => {
  request();
};
```

## 高阶函数和纯函数

### 高阶函数

一个函数介绍另一个函数作为参数，这个函数就是高价函数。像`Array.map`,`Array.forEach`等都是高阶函数。

在 React 中，还有高阶组件的概念，入参一个组件，放回一个组件，对入参组件修改，操作后，放回所需求的组件，很像装饰器模式。

### 纯函数

不对入参进行修改，不具有副作用操作。

::: tip 提示
未完待续
:::
