# 深入理解React

深入理解 React

## 组件的本质

在 React 中，组件是核心构建单元。组件可以是函数组件或类组件，它们的本质都是 JavaScript 函数或类，接收 props 并返回 UI（通常是 JSX 语法描述的虚拟 DOM）。深入理解组件的渲染和生命周期，可以帮助你优化性能。

关键要点：

- 函数组件 vs 类组件：了解函数组件如何通过 Hooks 管理状态和副作用，并理解类组件的生命周期。
- 无状态组件和有状态组件：无状态组件更容易优化，尽可能使用函数组件和 Hooks。
- 受控组件和非受控组件：掌控表单处理时，使用受控组件能更精确地控制表单的状态。

首先讲讲这个类组件。在`React`17.x，也就是`hooks`出现之前，只有类组件才有状态state这个`概念`，函数组件就是一个纯函数，纯函数即是`相同的输入得到相同的输出的这一类函数`，因此函数组件无法做到有状态。

要做到有状态就需要类组件。类组件被设计如下进行状态管理，state即使这个组件的状态，通过`this.setState`来修改状态，并触发组件重新渲染

```jsx
import React, { Component } from 'react'

class Counter extends Component {
  constructor(props) {
    super(props)
    // 初始化 state
    this.state = {
      count: 0
    }
  }

  // 增加计数的方法
  incrementCount = () => {
    // 更新状态
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.incrementCount}>Increase</button>
      </div>
    )
  }
}

export default Counter
```

同时React还在类组件中提供了一套生命周期的钩子，如以下：

- 挂载阶段（Mounting）：组件被创建并插入 DOM。
- 更新阶段（Updating）：组件的状态或 props 发生变化时触发更新。
- 卸载阶段（Unmounting）：组件从 DOM 中移除。

这给开发者提供了实现副作用功能的地方，比如：请求数据，销毁内存等。平常基础开发都会使用类组件来进行开发，上面的写法在量上面还是比较的多和麻烦。

接下来说下函数组件，hooks之前，函数组件就是单纯的ui组件，hooks引入过后函数组件就可以做到同类组件相同的事件了。hooks使用相当于在之前函数组件的基础上加入了一些状态函数的调用，常见的hooks如下：

- useState：定义一个状态的变量，返回使用和修改的变量。这个hook就是对应类型的state功能
- useEffect：入参1为函数，入参2为监听的变量数组，当监听的变量有改动时就会调用入参1的函数，具体使用可看官网。该hook就是对应了类组件中的生命周期了。
- useCallback：入参1为函数，入参2为监听的变量数组，返回一个函数提供调用， 当监听的变量有修改就会修改返回的函数，通过这样可以做到函数的缓存
- useMemo：类似useCallback，不过是缓存的值。

以上是一常用的hooks。通过这些hooks，函数组件可以做到和类型一样的事，同时代码更加简洁和清晰，因此现在基本都使用函数组件来进行开发。函数组件也更加锲合`F()=UI`，更能体现React的理念。

## React 的渲染机制

React 使用虚拟 DOM来优化真实 DOM 的更新。每次状态变化时，React 通过重新渲染组件生成新的虚拟 DOM，并与旧的虚拟 DOM 进行 Diff 比较，最终最小化真实 DOM 的更新。

深入理解：

- 虚拟 DOM：它是 React 使用的一种数据结构，表示 UI 的当前状态。通过 React.createElement 方法创建节点树。
- Diff 算法：React 使用的 Diff 算法通过最小化计算量找到需要更新的地方。掌握这些算法有助于理解为什么有些复杂 UI 操作可能导致性能问题。
- 渲染优化：使用 shouldComponentUpdate（类组件）或 React.memo（函数组件）来避免不必要的渲染。

虚拟DOM就是对真是的dom数做的一层抽象展示，通过js对象来模拟这棵树，当用户操作后页面需要改动时，会再次生成一个更新后的数，然后使用diff算法来找到需要更新的地方，最后对页面上的dom进行操作，以此来完成更新。这些都是框架内部的操作，React已经做好了优化，开发者能做的是在生成这课新的dom树的过程中进行优化，也就是具体代码的优化。

比如类组件的`shouldComponentUpdate`方法，入参为下一次的`Props`，`State`等数据，通过返回`True` or `False` 判断组件是否更新。在函数组件中也有优化的手段，比如

- useCallback，缓存函数
- useMemo，缓存值

除了上面的一些点，还有就是函数组件本身的优化。每一次state的变更，函数组件就会像执行函数那样重新执行该组件，组件内部的声明变量也会重新构建，上面的那些优化hook也就可以用起来了，同时子组件也会重新执行，这个时候无论子组件做了什么优化都会重新执行子组件，所有在进行代码拆分时尽可能的减少父组件的state。

## 代码分割和懒加载

对于大型应用，代码分割和懒加载是优化加载时间和提升性能的重要策略。React 提供了 React.lazy 和 Suspense，帮助你实现按需加载组件。

实现方法：

- React.lazy：将组件懒加载，避免在初始加载时加载过多的代码。
- React.Suspense：为懒加载组件提供占位符，直到组件加载完成。
