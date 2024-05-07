# 树

这是一棵树结构

<img src="./img/tree.png" width="100%" height="400px">

用 js 表示如下：

```js
const tree = {
  value: 0,
  left: {
    value: 1,
    left: null,
    right: {
      value: 3,
      left: null,
      right: null
    }
  },
  right: {
    value: 2,
    left: {
      value: 4,
      left: null,
      right: null
    },
    right: null
  }
}
```

## 递归遍历

通过递归来进行遍历 tree。
按照访问`value`值得位置不同，分为**前序遍历**。

```js
const data = obj => {
  if (obj === null) return
  else {
    console.log(obj.value)
    data(obj.left)
    data(obj.right)
  }
}
```

**中序遍历**。

```js
data(obj.left)
console.log(obj.value)
data(obj.right)
```

**后续遍历**。

```js
data(obj.left)
data(obj.right)
console.log(obj.value)
```

## 层次遍历

层次遍历就是一层一层得去遍历 tree。

通过`队列`来进行储存来访问节点。

```js
const data = obj => {
  const arr = [] // 队列来储存节点
  arr.push(obj)
  while (arr.length !== 0) {
    if (arr[0].left) {
      arr.push(arr[0].left) //入队
    }
    if (arr[0].right) {
      arr.push(arr[0].right)
    }
    console.log(arr[0].value)
    arr.shift() //出队
  }
}
```
