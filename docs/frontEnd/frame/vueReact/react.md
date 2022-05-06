# react

## onClick

```jsx
const columns = [
    {
        title: "文章名",
        dataIndex: "name",
        key: "name",
        render: (text) => <a onClick={setLink("articInformation")}>{text}</a>,
    },
];
```

实际运行会警告`Warning: Cannot update a component (`AppResoures`) while rendering a different component (`Cell`).`

原因是`setLink`是使用 useState 生成的一个函数，onClikc 在绑定后含有`（）`,会导致该函数立刻执行，引发视图改变，从而引起这个警告，改成如下写法即可。

```jsx
<a
    onClick={() => {
        setLink("articInformation");
    }}
>
    {text}
</a>
```

## 性能方面

### React.mome(Component,Fun)

使用`React.mome`方法来对组件做性能优化，对于`props`不会发生改变得组件而言，使用`mome`高阶组件进行包裹后，react 通过对 props 进行比较来跳过当前组件得刷新达到渲染方面得性能提升，不过这个比较是浅比较。

```jsx
const HomeTime = React.memo((props) => {
    //code
    return <>{props.time}</>;
});
```

### useMemo(Fun,[a,b])

对于需要做大量计算得函数，而这个函数得返回值会被渲染过程或者其他函数中使用时导致渲染函数组件时频繁得执行这个函数，从而导致计算性能过高，对于类似需求，可用`useMemo`进行数据得缓存从而避免每次渲染做重复计算操作来提升性能。

```jsx
let base = 1;

const getAllNumbers = () => {
    let result = 0;
    const start = base;
    //code
    return result;
};

const getAllNumbersMome = useMemo(getAllNumbers, [base]);
```

### useCallback(Fun,[a,b])

由于`react`每次渲染组件会导致每次得函数也不一样，如果存在子组件引用了当前组件得方法，从而导致方法得不一样引起了组件得渲染等情况，可使用`useCallback`来进行避免。

```jsx
const [name,setName] = useState('')
const getUserName = ()=>{
  console.log(name)
}
const getUserNameMemoized = useCallback(getUserName,[name])
//子组件使用
<UserInformation userInformation={userInforMation} getUserName={getUserNameMemoized}/>
```

### useEffect(Fun,[a,b])
