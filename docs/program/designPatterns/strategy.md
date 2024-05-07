# 策略模式

策略模式属于行为型模式，主要是解决在多种算法相似的情况下的，使用 if else 带来的复杂和维护。

```js
class ActivityA {
  getMoney(price) {
    return price * 0.9
  }
}
class ActivityB {
  getMoney(price) {
    return price * 0.8
  }
}
class Context {
  #activityType
  constructor(type) {
    this.#activityType = type
  }
  getMoneyByType(money) {
    console.log(`this price is ${this.#activityType.getMoney(money)}`)
  }
}
let context = new Context(new ActivityA())
context.getMoneyByType(100) //this price is 90
context = new Context(new ActivityB())
context.getMoneyByType(100) //this price is 80
```

## application scenarios

::: tip 提示
未完待续
:::
