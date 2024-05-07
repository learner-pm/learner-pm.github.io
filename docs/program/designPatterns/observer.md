# 观察者模式

观察者模式又叫发布-订阅模式，属于行为型模式

观察者模式适用于对象间存在一对多关系的情况。一个对象变化，通知其余依赖这个对象的对象。

```js
class Observer {
  constructor(name) {
    this.name = name
  }
  update() {
    this.aboutMe()
  }
  aboutMe() {
    console.log(`I am ${this.name}`)
  }
}
class Publisher {
  constructor() {
    this.observers = []
  }
  add(observer) {
    this.observers.push(observer)
    return this
  }
  notify() {
    this.observers.forEach(observer => {
      observer.update()
    })
  }
  IntroduceObserver() {
    console.log('Please introduce yourself')
    this.notify()
  }
}
const zs = new Observer('zs')
const ls = new Observer('ls')
const lx = new Publisher()
lx.add(zs).add(ls)
lx.IntroduceObserver()
//Please introduce yourself
//I am zs
//I am ls
```

## 应用场景

::: tip 提示
未完待续
:::
