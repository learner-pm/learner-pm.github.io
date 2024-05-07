# React

`React`是我首次参与工作接触得框架，初次学习颇有感触，记录一些经验所谈。

## 函数组件和类组件

关于这两个组件，工作上我基本使用函数组件来进行开发。在`hooks`出现之前大家应该是主要使用类组件开发，而函数组件就是一个无状态组件得使用。

类组件虽然使用上不多，由于之前在校时都是接触得`Vue`相关内容，对于生命周期等大致也了解，上手得话也不至于这么陌生。比较两个函数组件和类组件，我个人还时倾向于函数组件得，没有类组件这么繁琐以及一些生命周期得使用，比较简单明了，或者说是更纯粹。

## hooks

`hooks`是用于函数组件的`工具`，赋予了函数组件等同于类组件得功能的力量。

### useState

`hooks`中最重要地一个 hook，`useState`用来维持一个状态，入参格式是 js 允许地基本类型或者联合类型，返回一个数组，包含原始值和修改这个值的函数。

```jsx
const [a,setA] = useState(0)
//xxx

<p>{a}</p>
<button onClikc={()=>setA(pre=>pre++)}>A++</button>

```

如上这个例子，使用`useState`声明了一个`state`，`a`是这个 state 的变量名，`setA`是一个修改这个 state 的方法，当点击 buttons 按钮时就会让 a 的值加一。

每一个 state 的更新都会触发一次值比较（采用的`Object.is()`），如果值发生了改变才会刷新页面，这个刷新页面会重新执行这个函数将变化的值重新赋给 jsx 中对应的位置上，如果有多次 state 改变则会采用批量更新的策略，即取值变化的最终值进行更新。关于批量更新：

- Rect18 之前的版本只会对浏览器事件的处理中采用批量更新
- React18 & 使用 `ReactDOM.createRoot`的情况下会在所有事件下进行自动批量更新

关于`setState`更新时异步还是同步的问题，在 React18 之前后可以这么看：hook 和合成事件是异步的，原生方法和 setTimeout 是同步的，而在 React18 之后都是异步的更新。

### useCallback

该 hook 用来缓存一个方法，用法如下，`useCallback`接收两个参数，首位为一函数，后置位为一个依赖性数组，每当函数更新时会去检查数组中的依赖值是否发生变化，如果有改变就会重新声明这个函数，没有则保留当前函数的指针。

可以看出这个 hook 的作用时用来做缓存，避免性能开销。需要注意的是，如果被缓存的函数中存有`state`变量，需要将其设置为依赖数组中的一员，否则函数内拿不到最新的值。

```jsx
const [a, setA] = useState(1)
const fn = useCallbak(() => {
  console.log(a)
}, [a])
```

### useMemo

该 hook 用来缓存一个`结果`，用法同`useCallback`，如下

```jsx
const [a, setA] = useState(0)
const cacheNumber = useMemo(() => {
  // xxx
  return a * 100
}, [a])
```

之前工作中遇到了一个相关的问题，在 ant design 中使用`useMemo`包裹`Table`组件的 data 数据时，作为 action 的模块中的点击函数获取的 page 不正确,大致代码如下

当时排查了很久，自己也是新手，一时间没有找到原因，暂时解决方案是把`useCallbak`和`useMemo`都去除来修复问题。后面自己单独排查，发现是点击函数调用了一个获取数据的方法，该方法又是`useCallback`进行了缓存，由于`tableColumns`使用了 useMemo 进行缓存没有添加`fetchData`这个依赖项，导致翻页后操作页面时的方法内的 state 不是最新的，由此引发了问题。

```jsx
const fetchData=useCallback(()=>{
    // xxx
},[page,size])
const columns = [
    // xxx
    {
        //xxx
        render:()=>{
            const delete=()=>{
                //xxx
                fetchData()
            }
            return <a onClick={delete}>xx</a>
        }
    }
]
// 缺少依赖
const tableColumns = useMemo(()==>colums,[])
```
