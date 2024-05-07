# 设计模式

学习设计模式有助于写出优质代码。

## 工厂模式

工厂模式属于创建型模式，提供一种创建对象的最佳方式。

### 简单工厂

简单工厂中，在不暴露创建对象的具体细节，通过接口来创建对象。就像工厂一样，不需要了解具体生成细节，要什么产品，就请求什么产品。

如下代码，要什么动物调用`animal.getAnimal(type)`即可。`Animal`就像一个大`工厂`一样，不关心对象内部具体如何实现。

```js
class Pig {
  constructor() {}
  getType() {
    console.log('you get a pig')
  }
}
class Cat {
  constructor() {}
  getType() {
    console.log('you get a cat')
  }
}
class Animal {
  //动物工厂
  constructor() {}
  getAnimal(type) {
    if (type === 'cat') return new Cat()
    else if (type === 'pig') return Pig()
  }
}
const animal = new Animal()
const cat = animal.getAnimal('cat')
cat.getType() //you get a cat
```

### 抽象工厂

抽象工厂就像是再对`Animal`再进行了一次工厂模式。

如下先获取动植物类别，再具体化对象。

```js
class Orchid {
  constructor() {}
  getType() {
    console.log('you get an orchid')
  }
}
class Cat {
  constructor() {}
  getType() {
    console.log('you get a cat')
  }
}
class Plant {
  constructor() {}
  getPlant(type) {
    if (type === 'orchid') return new Orchid()
  }
}
class Animal {
  constructor() {}
  getAnimal(type) {
    if (type === 'cat') return new Cat()
  }
}

class Biology {
  //更高一层的工厂
  static getBiology(type) {
    if (type === 'animal') return new Animal()
    else return new Plant()
  }
}
const animal = Biology.getBiology('animal')
const cat = animal.getAnimal('cat')
cat.getType() //you get a cat
const plant = Biology.getBiology('plant')
const orchid = plant.getPlant('orchid')
orchid.getType() //you get an orchid
```

### application scenarios

::: tip 提示
未完待续
:::

## 单例模式

单例模式属于创建型模式，这个类提供一种访问其唯一对象的方式。

单例模式实现有`懒汉式`和`饿汉式`，区别为是否在类方法外创建对象。饿汉式式声明并创建对象，懒汉式在调用`getInstance()`时才会创建对象。如：`Window`对象等。

### 懒汉式

```js
class Single {
  static #instace = null
  static getInstance() {
    if (!this.#instace) {
      this.#instace = new Single()
    }
    return this.#instace
  }
  get() {
    return 'single'
  }
}
const obj1 = Single.getInstance()
const obj2 = Single.getInstance()
console.log(obj1 === obj2) //true
```

### 饿汉式

```js
class Single {
  static #instace = new Single()
  static getInstance() {
    return this.#instace
  }
  get() {
    return 'single'
  }
}
const obj1 = Single.getInstance()
const obj2 = Single.getInstance()
console.log(obj1 === obj2) //true
```

### application scenarios

::: tip 提示
未完待续
:::

## 观察者模式

观察者模式又叫发布-订阅模式，属于行为型模式

观察者模式适用于对象间存在一对多关系的情况。一个对象变化，通知其余依赖这个对象的对象。如:`MVVM`的实现，单向绑定，DOM 事件等。

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
    return this //便于链式调用
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

### application scenarios

::: tip 提示
未完待续
:::

## 策略模式

策略模式属于行为型模式，策略模式中一个类的行为可以在运行时候进行更改。

常用于：`if else`分支修改，重构代码等。

```js
const _price = (type, price) => {
  if (type === 'A') {
    return price * 0.9
  } else if (type === 'B') {
    return price * 0.8
  } else return price * 1
}
```

在进行添加其他类型型式会不可避免去修改原函数，而且通常大量得`if else`会不好修改和难于修改。

使用策略模式修改如下：只需添加不同打折的对象即可。

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

### application scenarios

::: tip 提示
未完待续
:::

## 装饰器模式

装饰器模式属于结构型模式。

装饰器模式允许向一个现有的对象添加新的功能，同时又不改变其结构。

高阶函数就是一个装饰器模式例子。

```js
class Div {
  about() {
    console.log('this is a div')
  }
}
class BorderDecorator {
  constructor(div) {
    this.div = div
  }
  about() {
    this.div.about()
    this.setBorder()
  }
  setBorder() {
    console.log('Border')
  }
}
const borderDiv = new BorderDecorator(new Div())
borderDiv.about()
//this is a div
//Border
```

### application scenarios

::: tip 提示
未完待续
:::

## 适配器模式

适配器模式解决两个接口不兼容的问题。如：音频播放器。

```js
class Mp4 {
  //mp4接口
  play() {
    console.log('it is mp4')
  }
}
class Video {
  //video接口
  play() {
    console.log('is is video')
  }
}
class Media {
  constructor(type) {
    if (type === 'mp4') this.type = new Mp4()
    else if (type === 'video') this.type = new Video()
  }
  play() {
    this.type.play()
  }
}
class AudioPlayer {
  play(type) {
    if (type === 'mp3') {
      //原生接口
      console.log('it is mp3')
    } else if (type === 'mp4' || type === 'video') {
      new Media(type).play()
    }
  }
}
const audio = new AudioPlayer()
audio.play('mp4')
//it is mp4
```

### application scenarios

::: tip 提示
未完待续
:::

## 代理模式

代理模式属于结构型模式。

在代理模式中，一个类代表另一个类的功能。

```js
class Date {
  constructor(url) {
    this.url = url
  }
  getDate() {
    console.log(`这是从${this.url}请求的数据`)
  }
}
class ProxyDate {
  #Date
  constructor(url) {
    this.url = url
  }
  getDate() {
    if (!this.#Date) {
      this.#Date = new Date(this.url) //代理请求
    }
    this.#Date.getDate()
  }
}
const proxyD = new ProxyDate('www.xxxx.com/getDate')
proxyD.getDate() //这是从www.xxxx.com/getDate请求的数据
proxyD.getDate() //不会再次真正请求
```

### application scenarios

::: tip 提示
未完待续
:::
