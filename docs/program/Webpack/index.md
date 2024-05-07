# Webpack

记录一下构建工具的学习，webpack 是一个构建工具，用来处理前端的 js 文件，可以把其他类型的文件转换为 js 文件。

## 属性

### Entry

告诉 webpack 从哪里开始处理文件。入口可以有多个，但一般只使用一个入口。常见的`Vue`、`React`等项目都是一个入口。

```javascript
module.exports = {
  entry: './src/index.js'
}
```

### Output

告诉 webpack 构建后的文件的位置和名字等，前面的入口有多少，出口也会对应的进行输出。

```js
module.exports = {
  filename: '[name].js',
  path: __dirname + '/dist'
}
```

### loader

webpack loader 是一个转换器，按照预定的规则，可以把相应的文件转换成对应的格式，如`babel`、 `css-loader`等

需要注意的是 loader 的执行顺序，从右到左，从下到上。

```js
module.exports = {
  rules: [
    {
      test: /\.css/,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
    }
  ]
}
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
    static: './dist',
    hot: true
  }
}
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
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'farme',
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  }
}
```

webpack.dev.js

```js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist'
  }
})
```

webpack.prod.js

```js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production'
})
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

现在可以在命令行里面输入命令`npm run dev`,项目就可以启动了。

接下来在创建几个文件:

- src
- -- mini-v
- -- -- index.js
- -- App.js

其中 mini-v 是写的框架，App.js 是组件。

在之前的 Index.js 写入：

```js
import MiniV from './mini-v'
import App from './App'

const { createRoot } = MiniV

createRoot(document.getElementById('app')).render(App)
```

现在来编写下 Mini-v 中的内容，按照目前的样子来说，主要是提供`createRoot`和 `render` 方法

```js
class MiniV {
  #root = undefined
  #children = undefined
  constructor() {}

  createRoot = root => {
    this.#root = root
    return this
  }
  render = children => {
    this.#root.appendChild(this.#app())
  }
}
const _MiniV = new MiniV()
const { useState } = _MiniV

export { useState }

export default _MiniV
```

createRoot 方法主要用来保留根节点，render 即是渲染，将子组件的内容添加到页面上

现在来写下 App.js，预想是返回一个函数，执行函数放回具体的子节点即可。

```js
const App = () => {
  const dom = document.createElement('p')
  p.innerHTML = 'Hello'
  return dom
}

export default App
```

保存后查看页面，应该多了个`Hello`字符。

实现一下`useState`，先把我们期望的例子写出来。

```js
import { useState } from './mini-v'

const App = () => {
  const [num, setNum] = useState(0)
  const click1 = () => {
    setNum(pre => pre + 1)
  }
  const div = document.createElement('div')
  const p = document.createElement('p')
  const button = document.createElement('p')
  button.innerHTML = 'num++'
  p.innerHTML = `num的值是：${num}`
  button.addEventListener('click', () => {
    click1()
  })
  div.appendChild(p)
  div.appendChild(button)
  return div
}

export default App
```

期望是点击按钮`num++`后，num 的值会自增。

接下来实现一下`useState`。

```js
useState = v => {
  this.#v = this.#v || v

  const updated = fu => {
    this.#v = typeof fu === 'function' ? fu(this.#v) : fu
    this.render()
  }
  return [currentV, updated]
}
```

简单来说是组件首次渲染的时候拿到初始值，后续渲染则采用 store 中的值，updated 方法在执行入参后再次调用 render，重新渲染组件，返回最新的值，从而达到页面的更新。

所以在修改下 render 方法

```js
render = app => {
  this.#app = app || this.#app
  this.#root.innerHTML = ''
  this.#root.appendChild(this.#app())
}
```

现在在页面上点击按钮即可看到 num 值的更新。

多个 useState

接下来实现下多个 state 的使用

先修改下例子

```js
const [str, setStr] = useState('hi')

const click1 = () => {
  setNum(pre => pre + 1)
  if (num === 5) {
    setStr('hello')
    return
  }
  console.log(num)
}

p.innerHTML = `字符串str的值会在num的值为5的时候进行改变：${str}。num的值是：${num}`
```

接下来修改 store 中的内容，增加一个 arr 来储存 state，再增加一个 key 用来做下位标识位，这个 key 主要是在函数执行时用来保证用 arr 中读取的数据的正确性。通过这里可以大致了解到 React 中的 hook 使用限制 ，也是异曲同工之妙。

```js
    #stateArr = []
    #stateKey = -1

    useState = (v) => {
        this.#stateKey++
        if (this.#stateArr[this.#stateKey] === undefined) {
            this.#stateArr.push(v)
        }
        const currentV = this.#stateArr[this.#stateKey]
        const fuKey = this.#stateKey
        const updated = (fu) => {
            this.#stateArr[fuKey] = typeof fu === 'function' ? fu(currentV) : fu
            this.#stateKey = -1
            this.render()
        }
        return [currentV, updated]
    }
```

这样的话就有两个 hook 了，点击按钮可以看到页面上的变化。

修改 dom

可以看到`App.js`里面是直接返回了一个 dom，节点都是我们手动添加的。这里进行下修改：

由于这里没使用 babel 等，实现是这样的：

```js
const map = new Map()
map.set(click1.name, click1)
const template = `<div>${num} <p>字符串str的值${str}</p> <button onclick-{click1}>num++</button> </div`
const dom = getDom(template, map)
return dom
```

template 可以看成是我们写的 jsx，getDom 就是 babel 转换，map 存储方法，这样可以给到 getDom 中去使用，这里就模拟了 react 函数组件中的闭包。

实现下 getDom，其功能是输入模板，输出节点。首先第一点是需要把模板字符串转为如下结构：

```js
const obj = {
  type: 'div',
  value: '1',
  children: [
    {
      type: 'p',
      value: '2',
      children: null
    }
  ]
}
```

再通过上面的结构来递归渲染 dom 节点，添加方法等，首先实现转换方法。

```js
const transform = htmlString => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  console.log(doc)
  function traverse(node) {
    const obj = {
      type: node.nodeName.toLowerCase(),
      children: []
    }

    if (node.nodeType === Node.TEXT_NODE) {
      obj.value = node.nodeValue.trim()
      return obj
    }

    for (const childNode of node.childNodes) {
      obj.children.push(traverse(childNode))
    }

    return obj
  }

  return traverse(doc.body.firstChild)
}
```

再反转义：

```js
const getDom = (template, map) => {
  const obj = transform(template)
  console.log(obj)
  const dom = document.createElement(obj.type)

  obj.children.forEach(e => {
    const childNode = document.createElement(e.type.replace('#', ''))
    if (e.type === 'button') {
      childNode.innerHTML = e.children[0].value
      childNode.addEventListener('click', () => {
        map.get('click1')()
      })
    } else if (e.type === 'p') {
      childNode.innerHTML = e.children[0].value
    } else {
      childNode.innerHTML = e.value
    }
    dom.appendChild(childNode)
  })
  return dom
}
```

这样就可以写模板和添加需要使用的方法使用。

一个简单的仿 React 就这样了
