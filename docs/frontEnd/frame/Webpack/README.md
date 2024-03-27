# Webpack

记录一下构建工具的学习，webpack 是一个构建工具，用来处理前端的 js 文件，可以把其他类型的文件转换为 js 文件。

## 属性

### Entry

告诉 webpack 从哪里开始处理文件。入口可以有多个，但一般只使用一个入口。常见的`Vue`、`React`等项目都是一个入口。

```javascript
module.exports = {
  entry: "./src/index.js",
};
```

### Output

告诉 webpack 构建后的文件的位置和名字等，前面的入口有多少，出口也会对应的进行输出。

```js
module.exports = {
  filename: "[name].js",
  path: __dirname + "/dist",
};
```

### loader

webpack loader 是一个转换器，按照预定的规则，可以把相应的文件转换成对应的格式，如`babel`、 `css-loader`等

需要注意的是 loader 的执行顺序，从右到左，从下到上。

```js
module.exports = {
  rules: [
    {
      test: /\.css/,
      use: [{ loader: "style-loader" }, { loader: "css-loader" }],
    },
  ],
};
```

### Plugin

插件可以为 webpack 拓展许多功能。如`html-webpack-plugin`插件可以自动生成 html 文件。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins:[
        new HtmlWebpackPlugin({
            template::"/index.html"
        })
    ]
}
```

### 热模块更新

模块热替换(HMR - hot module replacement)功能会在应用程序运行过程中，替换、添加或删除 模块，而无需重新加载整个页面

```js
module.exports = {
  devServer: {
    static: "./dist",
    hot: true,
  },
};
```

## Demo

搭建一个项目来写完我的一个小 demo。

首先在 GitHub 上创建一个仓库，拉取到本地后安装 webpack 等依赖

```npm copy
npm i -D webpack webpack-cli webpack-merge webpack-dev-server html-webpack-plugin
```

紧接着创建配置文件`webpack.common.js`、`webpack.dev.js` `webpack.prod.js`，这里拆分文件便于区分环境

webpack.common.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "farme",
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

webpack.dev.js

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
});
```

webpack.prod.js

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
});
```

接下来创建文件，目录如下

- src
- -- index.js
- -- index.html

在 html 文件中引用 index.js 文件，编写 console。

同时修改下 package.json

```json
    "dev": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
```
