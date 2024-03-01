# 装饰器模式

装饰器模式属于结构型模式

装饰器模式允许向一个现有的对象添加新的功能，同时又不改变其结构。

```js
class Div {
  about() {
    console.log("this is a div");
  }
}
class BorderDecorator {
  constructor(div) {
    this.div = div;
  }
  about() {
    this.div.about();
    this.setBorder();
  }
  setBorder() {
    console.log("Border");
  }
}
const borderDiv = new BorderDecorator(new Div());
borderDiv.about();
//this is a div
//Border
```

## 应用场景

::: tip 提示
未完待续
:::
