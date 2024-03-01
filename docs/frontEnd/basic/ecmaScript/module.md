# 模块化

es6 的`Module`使得 JavaScript 具有自己的模块体系。和面向对象语言的封装更接近。

## 浏览器模块化

es6 的模块化会自动采用严格模式。`export`导出，`import`导入。ES2020 提案 引入 `import()`函数，支持动态加载模块。

和 node.js 的 CommonJS 的区别：

- CommonJS 模块输出值的拷贝，es6 模块是值得引用
- CommonJS 模块是运行时加载，es6 模块时编译时输出
- CommonJS 时同步加载(本地加载，性能影响不大)，es6 是异步加载
