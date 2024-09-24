# 微前端

微前端是一种将单体应用分解为多个更小的、可独立开发、测试、部署的模块的架构模式，类似后端的微服务
。在微前端中，每个模块都是单独的、不和其他模块耦合的，可由不同团队开发，可使用不同的技术栈。

核心理念:

- 独立开发：子应用之间为单独的工程项目，技术栈可独立选择
- 独立部署：子应用可单独部署，不必随着整个应用模块一起发布
- 独立运行：应用之间独立运行，由主应用进行展示调度

实现方式：

- iframe
- JavaScript tuog
- qiankun，Single-SPA

## 简易实现

简易的实现一个微前端框架，然后可以完成如下图所示的页面

<img src="./img/img_one.png" width="100%">

首先创建应用`html`

主应用

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>主应用</title>
  </head>
  <body>
    <h1>主应用</h1>

    <button id="load-app-a">加载子应用 A</button>
    <button id="load-app-b">加载子应用 B</button>
    <button id="clear">卸载子应用</button>
    <button id="clear-a">卸载子应用 A</button>
    <button id="clear-b">卸载子应用 B</button>

    <div>来自子应用的信息：<span id="app-info"></span></div>

    <!-- 子应用容器 -->
    <div id="app-container"></div>

    <script src="./app.js" type="module"></script>
    <!-- 加载业务代码 -->
  </body>
</html>
```

子应用A如下，B同理

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App A</title>
  </head>
  <body>
    <h2>子应用 A</h2>
    <p>这是子应用 A 的内容。</p>
  </body>
</html>
```

### 实现注册

我们先实现注册子应用功能，目标实现如下功能，编写`app.js`文件如下，通过这两个方法可以注册主、子应用

```js
registerMainApplication('app', 'app-container')

// 注册两个子应用 A 和 B
registerApplication({
  name: 'appA',
  url: './a.html',
  path: '/a'
})
registerApplication({
  name: 'appB',
  url: './b.html',
  path: '/b'
})
```

下面来实现这两个方法，编写`microfrontend.js`文件，内部维护两个变量来存储应用信息

主应用：

- 名称
- 容器id

子应用

- 名称
- 应用本体路径
- route路径

```js
const appRegistry = []
const mainApp = {}

// 注册主应用
export function registerMainApplication(name, containerId) {
  mainApp.name = name
  mainApp.containerId = containerId
}

// 注册子应用
/** name appUrl path cache**/
export function registerApplication(config) {
  appRegistry.push(config)
}
```

### 加载子应用

接下来完成加载子应用的方法，整个过程也很简单：点击按钮后，获取对应的子应用资源，然后将这个资源加载容器中去即可

实现如下：

```js
export async function loadApp(name) {
  const appData = getAppByName(name)

  if (!appData) {
    throw new Error(`Application ${name} is not registered`)
  }
  // 获取子应用的 HTML 并添加 CSS 作用域
  const appHTML = await fetchApplicationHTML(appData)

  // 查找容器元素并加载子应用内容
  const container = document.getElementById(mainApp.containerId)
  container.innerHTML = scopedHTML
}
```

上面就是一个load过程，其中获取子应用资源的方法如下，主要使用`fetch`来获取子应用

```js
async function fetchApplicationHTML(app) {
  const cacheEntry = cache[app.url]
  const response = await fetch(app?.url)
  if (!response.ok) {
    throw new Error(`Failed to load application from ${app?.url}`)
  }
  const html = await response.text()
  return html
}
```

编写主应用的js文件，增加`loadApp`操作，

```js
// 点击按钮加载子应用 A
document.getElementById('load-app-a').addEventListener('click', async () => {
  await loadApp('appA')
})

// 点击按钮加载子应用 B
document.getElementById('load-app-b').addEventListener('click', async () => {
  await loadApp('appB')
})
```

### 卸载应用

提供可以卸载应用的功能，这里就是设置`innerHTML`为空即可

```js
export function unloadApp(appName) {
  const app = getAppByName(appName)
  const containerId = mainApp.containerId
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = ''
  }
}
```

卸载所有应用在上面的基础上做一个循环即可

```js
export function unloadAllApps() {
  Object.keys(appRegistry).forEach(app => {
    unloadApp(app?.name)
  })
}
```

### 增加沙箱机制

沙箱机制有利于应用间的隔离，做到数据间的隔离，避免变量紊乱。

这里采用代理`Window`的方式来实现

```js
const blockedGlobals = [
  'localStorage',
  'sessionStorage',
  'document',
  'alert',
  'confirm'
]

// 沙箱类，用于隔离全局变量
class Sandbox {
  constructor(name) {
    this.name = name
    this.proxy = null
    this.active = false
    this.sandbox = {}
    this.windowProxy = this.createProxy()
  }

  createProxy() {
    const sandbox = this.sandbox
    const instance = this // 保存 Sandbox 实例

    return new Proxy(window, {
      get(target, prop) {
        if (!instance.active) {
          throw new Error(`Sandbox is inactive, cannot access ${prop}`)
        }
        if (blockedGlobals.includes(prop)) {
          throw new Error(`Access to ${prop} is blocked for security reasons`)
        }
        if (prop in sandbox) {
          return sandbox[prop]
        }
        return target[prop]
      },
      set(target, prop, value) {
        if (!instance.active) {
          throw new Error(`Sandbox is inactive, cannot set ${prop}`)
        }
        sandbox[prop] = value
        return true
      },
      has(target, prop) {
        if (!instance.active) {
          return false
        }
        return prop in sandbox || prop in target
      },
      deleteProperty(target, prop) {
        if (!instance.active) {
          throw new Error(`Sandbox is inactive, cannot delete ${prop}`)
        }
        if (prop in sandbox) {
          delete sandbox[prop]
        }
        return true
      }
    })
  }

  activate() {
    this.active = true
  }

  deactivate() {
    this.active = false
  }

  reset() {
    this.sandbox = {}
  }
}
```

增加对脚本执行的函数

```js
async function executeScriptInSandbox(html, sandboxWindow) {
  const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  for (const match of scriptMatches) {
    const scriptContent = match[1]
    if (scriptContent) {
      // 使用异步执行 Function 构造函数，防止阻塞主线程
      const scriptFunction = new Function('window', scriptContent)
      await scriptFunction(sandboxWindow) // 确保按顺序执行
    }
  }
}
```

上面是对js的隔离，还需要对`CSS`进行处理下，避免样式污染

入参`html`为子应用的文本字符串，`scopeID`即使容器名

```js
function scopeCSS(html, scopeId) {
  return html.replace(
    /(<style[^>]*>)([\s\S]*?)(<\/style>)/gi,
    (match, startTag, css, endTag) => {
      const scopedCSS = css.replace(
        /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
        (selector, selectors, after) => {
          const scopedSelector = selectors
            .split(',')
            .map(sel => `#${scopeId} ${sel.trim()}`)
            .join(',')
          return `${scopedSelector} ${after}`
        }
      )
      return `${startTag}${scopedCSS}${endTag}`
    }
  )
}
```

通过上面的转换，`CSS`变量会进行修改

```css
/* 前 */
h2 {
  color: red;
}

/* 后 */
#app-container h2 {
  color: red;
}
```

下来来进行使用上面的沙箱机制，在`loadApp`中增加创建或激活沙箱操作

```js
export async function loadApp(name) {
  const appData = getAppByName(name)

  if (!appData) {
    throw new Error(`Application ${name} is not registered`)
  }
  // 获取子应用的 HTML 并添加 CSS 作用域
  const appHTML = await fetchApplicationHTML(appData)
  const scopedHTML = scopeCSS(appHTML, mainApp.containerId)

  // 查找容器元素并加载子应用内容
  const container = document.getElementById(mainApp.containerId)
  container.innerHTML = scopedHTML

  // 创建或激活沙箱
  if (!sandboxRegistry[name]) {
    sandboxRegistry[name] = new Sandbox(name)
  }
  sandboxRegistry[name].activate()

  // 执行子应用的脚本，确保沙箱隔离
  executeScriptInSandbox(appHTML, sandboxRegistry[name].windowProxy)
}
```

在卸载中关闭沙箱

```js
export function unloadApp(appName) {
  // ...
  sandboxRegistry[appName]?.deactivate()
  // ...
}
```

### 生命周期

一般微前端框架需要支持生命周期的实现，以便于子应用可以在应用被加载的相关时间点内进行操作

生命周期函数为：挂载前，挂载后，卸载后

```js
  beforeMount() {

  },
  mount() {

  },
  unmount() {

  },
```

在子应用中实现这三个函数，在子应用的同级层级下创建对应的`js`文件，写入如下函数

```js
export default {
  beforeMount() {
    console.log('App A is about to mount')
  },
  mount() {
    console.log('App A is mounted')
  },
  unmount() {
    console.log('App A is unmounted')
  }
}
```

为了简易的实现，这里就采用这种方式来进行模拟生命周期。现在子应用实现了函数，需要在框架内获取并在对应的时候调用它们，这里采用`es`的包机制来动态获取函数

在load时调用

```js
// 加载app
export async function loadApp(name) {
  // ...

  const appModule = await import(`${appData.url.replace('.html', '.js')}`)

  // 调用子应用的 beforeMount 生命周期钩子
  if (typeof appModule.default.beforeMount === 'function') {
    appModule.default.beforeMount()
  }

  // ....

  // 调用子应用的 mount 生命周期钩子
  if (typeof appModule.default.mount === 'function') {
    appModule.default.mount()
  }
}
```

在卸载时调用

```js
export function unloadApp(appName) {
  // ...
  // 动态导入子应用的生命周期管理模块
  import(`${app.url.replace('.html', '.js')}`).then(appModule => {
    // 调用子应用的 unmount 生命周期钩子
    if (typeof appModule.default.unmount === 'function') {
      appModule.default.unmount()
    }
  })
  // ...
}
```

这样在加载或卸载时对应的子应用中的生命周期函数会被调用

### 应用通信

应用间通信是很常见的功能，这里采用发布订阅者模式来实现。

编写`EventBus`类

```js
class EventBus {
  events = {}
  on = (event, callback) => {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  emit = (event, data) => {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
}
```

对外提供start方法来给全局挂载事件通信实例，后续其他需要手动触发的功能也可以放入这里面。

```js
export const start = () => {
  window.eventBus = new EventBus()
}
```

在主应用启动通信

```js
start()
```

页面上加入展示文案

```html
<div>来自子应用的信息：<span id="app-info"></span></div>
```

主应用注册事件

```js
const eventBus = window.eventBus

eventBus.on('app:event', data => {
  const info = document.getElementById('app-info')
  info.innerHTML = data?.msg
})
```

子应用中触发上面注册的时间，下述在生命周期中进行通信

```js
const eventBus = window.eventBus
// 子应用 A
export default {
  beforeMount() {
    console.log('App A is about to mount')
  },
  mount() {
    console.log('App A is mounted')
    eventBus.emit('app:event', { msg: '子应用A mounted' })
  },
  unmount() {
    console.log('App A is unmounted')
    eventBus.emit('app:event', { msg: '子应用A unmounted' })
  }
}
```

也可以通过按钮触发

```html
<button id="a-append">子应用a通知父应用</button>
```

```js
// 点击按钮加载子应用 A
document.getElementById('a-append').addEventListener('click', async () => {
  eventBus.emit('app:event', { msg: '子应用A的信息' })
})
```

### 缓存

目前当点击加载子应用时浏览器都会去请求数据来渲染，频繁的请求会导致性能有一定的消耗，可以加入缓存机制来优化

在注册时提供一些新的字段`cache`，cache默认为true，cache为true即开启缓存，cache为false不启用缓存

具体实现只需在获取子应用的时加过滤即可，简易实现可如下，使用一个对象来缓存值，同时实现缓存到期机制

```js
const cache = {}
const cacheExpirationTime = 10 * 1000 // 10 min

// 用于从指定的 URL 获取子应用的 HTML 内容
async function fetchApplicationHTML(app) {
  const cacheEntry = cache[app.url]
  const now = Date.now()
  if (
    app.cache &&
    cacheEntry &&
    now - cacheEntry?.timestamp < cacheExpirationTime
  ) {
    return cacheEntry.html
  }
  const response = await fetch(app?.url)
  if (!response.ok) {
    throw new Error(`Failed to load application from ${app?.url}`)
  }
  const html = await response.text()
  if (app.cache) {
    cache[app?.url] = { html, timestamp: now }
  }
  return html
}
```

在注册地修改下代码,这样应用A会缓存请求，应用B每次都会请求新的数据

```js
registerApplication({
  name: 'appA',
  url: './a.html',
  path: '/a'
})
registerApplication({
  name: 'appB',
  url: './b.html',
  path: '/b',
  cache: false
})
```

这样一个简易的微前端框架就实现了，如果要加入`React`和`Vue`等的嵌入，还需要进行很多开发工作，但用来学习微前端的理念是足够了
