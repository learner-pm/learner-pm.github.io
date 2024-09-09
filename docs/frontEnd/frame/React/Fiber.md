# Fiber

记录一下和`React Fiber`相关的内容

## 结构

在React中，每一个 React组件（无论是函数组件、类组件 ，还是DOM节点）在内存中都会对应一个Fiber节点。React将这些Fiber节点组织成一颗Fiber树，每次更新会在Fiber树上进行计算和更新。一个Fiber节点可以用一下代码简单表示：

```js
function FiberNode(type, key, stateNode) {
  this.type = type // 当前节点类型
  this.key = key // 节点的key
  this.stateNode = stateNode // 组件实例或DOM节点

  this.child = null // 指向第一个子节点的 Fiber
  this.sibling = null // 指向下一个兄弟节点的 Fiber
  this.return = null // 指向父节点的 Fiber

  // ...
}
```

## 创建Fiber树

`JSX`通过Babel等工具转换后会通过React的`createElement('div', null, 'Hello World')`进行创建节点，Fiber节点也是类型的创建，通过上面的方法来创建Fiber树，例如下

```js
const rootFiber = new FiberNode('div', null, document.getElementById('root'))

// 创建子节点和兄弟节点
const childFiber = new FiberNode('span', null, document.createElement('span'))
const siblingFiber = new FiberNode(
  'button',
  null,
  document.createElement('button')
)

// 连接 Fiber 节点
rootFiber.child = childFiber
childFiber.sibling = siblingFiber
```

对应的html结构

```html
<div>
  <span></span>
  <button></button>
</div>
```

## 双 Fiber 树机制

所谓双 Fiber 树机制即React内部会有 `current fiber`树即当前节点对应的fiber树，以及`workInProgress fiber`树即每次更新时创建的工作树

```js
// 双缓冲 Fiber 树
function createWorkInProgress(currentFiber) {
  const workInProgress = new FiberNode(
    currentFiber.type,
    currentFiber.key,
    currentFiber.stateNode
  )

  // 复制当前 Fiber 的状态
  workInProgress.memoizedProps = currentFiber.memoizedProps
  workInProgress.memoizedState = currentFiber.memoizedState

  // 双向链接，指向 current 节点
  workInProgress.alternate = currentFiber
  currentFiber.alternate = workInProgress

  return workInProgress
}
```

当我们更新 UI 时，`React` 会调用 `createWorkInProgress` 来生成新的 Fiber 节点，并使用这个新的 Fiber 树计算更新

## 任务调度和更新

Fiber 架构中的调度器负责管理所有的任务，并根据不同任务的优先级来执行更新。React使用`requestIdLeCallback` 或 `messageChannel`来调度任务，保证更新过程不会阻塞主线程

```js
// 调度器核心逻辑
function performWork(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    // 处理下一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  if (!nextUnitOfWork) {
    // 完成了整个 Fiber 树的协调
    commitRoot()
  } else {
    // 在下一次空闲时间继续工作
    requestIdleCallback(performWork)
  }
}

function performUnitOfWork(fiber) {
  // 开始工作：生成新的 Fiber 节点，计算更新
  beginWork(fiber)

  // 如果有子节点，继续处理子节点
  if (fiber.child) {
    return fiber.child
  }

  // 如果没有子节点，处理兄弟节点或返回父节点
  let nextFiber = fiber
  while (nextFiber) {
    completeWork(nextFiber) // 完成当前节点的工作

    if (nextFiber.sibling) {
      return nextFiber.sibling
    }

    nextFiber = nextFiber.return
  }

  return null
}
```

`performWork` 是 Fiber 的核心调度循环，它会在每个空闲时间内处理一个或多个工作单元（Fiber 节点），确保更新是可中断的。

## 协调与提交

Fiber 架构将更新分为两个阶段：协调 (Reconciliation) 和 提交 (Commit)。

- 协调阶段
  在协调阶段，React 会遍历 Fiber 树，标记哪些节点需要更新。这个过程是可中断的。

```js
function beginWork(fiber) {
  // 根据组件类型，生成新的 Fiber 节点
  if (fiber.type === 'div') {
    // 比较 props，判断是否需要更新
    if (fiber.pendingProps !== fiber.memoizedProps) {
      // 标记为需要更新
      fiber.effectTag = 'UPDATE'
    }
  }

  // 返回子节点继续处理
  return fiber.child
}
```

- 提交阶段
  一旦协调阶段完成，React 会进入提交阶段，将需要更新的 Fiber 节点应用到真实 DOM。这个阶段是不可中断的。

```js
function commitRoot() {
  let fiber = rootFiber

  // 遍历 Fiber 树，执行 DOM 操作
  while (fiber) {
    if (fiber.effectTag === 'UPDATE') {
      // 更新 DOM 节点
      updateDOM(fiber.stateNode, fiber.memoizedProps)
    }

    // 继续处理下一个 Fiber 节点
    fiber = getNextFiber(fiber)
  }
}

function updateDOM(dom, newProps) {
  // 直接操作 DOM，更新属性和内容
  for (const prop in newProps) {
    dom.setAttribute(prop, newProps[prop])
  }
}
```

## 任务的优先级调度

React Fiber 为任务分配了优先级。调度器根据不同的任务类型（如用户交互、动画等）分配优先级。高优先级任务会打断低优先级任务，以保证用户体验。

```js
// 简化版优先级调度
const HIGH_PRIORITY = 1
const LOW_PRIORITY = 2

let taskQueue = []

function scheduleTask(task, priority) {
  taskQueue.push({ task, priority })
  taskQueue.sort((a, b) => a.priority - b.priority) // 高优先级任务排在前面
}

function runTasks() {
  while (taskQueue.length > 0) {
    const { task } = taskQueue.shift()
    task()
  }
}
```

React Fiber 的核心实现包括 Fiber 节点结构、双缓冲 Fiber 树、任务的调度与更新机制、协调与提交过程，以及优先级调度。通过这些机制，React 可以实现可中断的渲染，并根据任务的优先级进行灵活调度，从而在复杂的 UI 更新场景中保持高性能和流畅的用户体验。

Fiber 架构的实现代码虽然复杂，但其核心思想就是将任务拆分为更细粒度的工作单元，并利用浏览器的空闲时间进行调度和执行，从而提高性能。
