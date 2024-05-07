# Vue

对比 React，我接触 Vue 的时间比较早，应该实在我大二左右就开始使用 Vue 进行一些开发，当然内容时一些自己感兴趣的例子。

## Vue 文件

一个常规的 Vue 文件的构成包括`<template>`、`<script>`、`<style>`这三个要素，其中`<template>`书写 html 元素，`<script>`书写逻辑，`<style>`书写样式，这样一看各模块的层级还是比较清晰。

### template

其中`<template>`除了书写常规的 html 元素外，还需要书写模板语法，以此来达到变量的填充。如下，p 就是一个变量，当它的值修改，页面上对于的值就会发生改变。类型的语法还有很多，相比于 React 的直接写 js 语法，Vue 就多了一层学习的心智负担。

```vue
<template>
  <div>{{ p }}</div>
</template>
```

### script

这个模块就是书写逻辑的地方，请求数据、变量的维持、事件响应等都在此。值得注意的是 Vue3 相比于 Vue2 多了一个`组合式`的写法，该写法下的一些思考类似于 React 的 hooks。从这里可以看出框架的发展大致是殊路同归的。

```js
// 2.x
export default {
  data() {
    return {
      author: {
        name: '1'
      }
    }
  }
}
// 3.x
import { reactive } from 'vue'
const author = reactive({
  name: '1'
})
```

### style

这个模块就是写样式的地方，可以通过设置`scoped`避免组件之前的样式污染，这点上对比 React 是有优势的。

```vue
<style scoped>
.home-add-text {
  text-align: center;
  font-size: 18px;
  padding: 20px 0px;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
}
</style>
```

## 响应式更新

Vue 最突出的一个话题就是这个响应式更新，Vue2 中采用`Object.defineProperty`来进行`getter`和`setter`的劫持，以达到对数据变化的检测和更新。Vue3 则采用 ES6 的新属性`Proxies`来创建响应式对象。
