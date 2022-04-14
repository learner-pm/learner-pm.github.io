# react

## onClick

```js
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

原因是`setLink`是使用 useState 生成的一个函数，onClikc 在绑定后含有`（）`,会导致该函数立刻执行，从而引起这个警告，改成如下写法即可。

```js
<a
  onClick={() => {
    setLink("articInformation");
  }}
>
  {text}
</a>
```
