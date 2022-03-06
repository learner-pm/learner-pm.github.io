# 工厂模式

工厂模式属于创建型模式，提供一种创建对象的最佳方式。

## 简单工厂

简单工厂中，在不暴露创建对象的具体细节，通过接口来创建对象。就像工厂一样，不需要了解具体生成细节，要什么产品，就请求什么产品。

要什么对象调用`animal.getAnimal(type)`即可，不关心内部实现。

```js
class Pig {
  constructor() {}
  getType() {
    console.log("you get a pig");
  }
}
class Cat {
  constructor() {}
  getType() {
    console.log("you get a cat");
  }
}
class Animal {
  //动物工厂
  constructor() {}
  getAnimal(type) {
    if (type === "cat") return new Cat();
    else if (type === "pig") return Pig();
  }
}
const animal = new Animal();
const cat = animal.getAnimal("cat");
cat.getType(); //you get a cat
```

## 抽象工厂

抽象工厂就像是再对`动物`进行了一次工厂模式。

先获取动植物类别，再具体化对象。

```js
class Orchid {
  constructor() {}
  getType() {
    console.log("you get an orchid");
  }
}
class Cat {
  constructor() {}
  getType() {
    console.log("you get a cat");
  }
}
class Plant {
  constructor() {}
  getPlant(type) {
    if (type === "orchid") return new Orchid();
  }
}
class Animal {
  constructor() {}
  getAnimal(type) {
    if (type === "cat") return new Cat();
  }
}

class Biology {
  //更高一层的工厂
  static getBiology(type) {
    if (type === "animal") return new Animal();
    else return new Plant();
  }
}
const animal = Biology.getBiology("animal");
const cat = animal.getAnimal("cat");
cat.getType(); //you get a cat
const plant = Biology.getBiology("plant");
const orchid = plant.getPlant("orchid");
orchid.getType(); //you get an orchid
```

## 应用场景

::: tip 提示
未完待续
:::
