# 单例模式

单例模式属于创建型模式，这个类提供一种访问其唯一对象的方式。

单例模式实现由`懒汉式`和`饿汉式`。区别为是否在类方法外创建对象。饿汉式式声明并创建对象，懒汉式在调用`getInstance()`时才会创建对象。

## 懒汉式

```js
class Single {
  static #instace = null;
  static getInstance() {
    if (!this.#instace) {
      this.#instace = new Single();
    }
    return this.#instace;
  }
  get() {
    return "single";
  }
}
const obj1 = Single.getInstance();
const obj2 = Single.getInstance();
console.log(obj1 === obj2); //true
```

## 饿汉式

```js
class Single {
  static #instace = new Single();
  static getInstance() {
    return this.#instace;
  }
  get() {
    return "single";
  }
}
const obj1 = Single.getInstance();
const obj2 = Single.getInstance();
console.log(obj1 === obj2); //true
```

## 应用场景

::: tip 提示
未完待续
:::
