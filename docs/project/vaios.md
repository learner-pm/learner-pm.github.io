# Vaios

采用模板语法进行实现`mvvm`中得模板和数据得绑定。

## 处理模板

```html
<div id="app">
  <p>one <span>001</span></p>
  这是mes的值：{mes}
  <p>two</p>
</div>
```

对于插值表达式：{}，采用正则表达式进行判断和收集：

```js
const isVar = /\{((?:.|\n)+?)\}/;
```

使用`eval()`来进行字符串得执行
