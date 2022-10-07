# 代理模式

代理模式属于结构型模式

在代理模式中，一个类代表另一个类的功能

```js
class Date {
  constructor(url) {
    this.url = url;
  }
  getDate() {
    console.log(`这是从${this.url}请求的数据`);
  }
}
class ProxyDate {
  #Date;
  constructor(url) {
    this.url = url;
  }
  getDate() {
    if (!this.#Date) {
      this.#Date = new Date(this.url);
    }
    this.#Date.getDate();
  }
}
const proxyD = new ProxyDate("www.xxxx.com/getDate");
proxyD.getDate();
```

## 应用场景

::: tip 提示
未完待续
:::
