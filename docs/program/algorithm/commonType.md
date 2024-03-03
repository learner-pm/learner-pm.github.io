# 排序算法

交换排序分为冒泡和快速,希尔排序是插入排序的一种优化后的排序方法。

测试数组：

```js
const arr = [1, 45, -45, 1, 10, 111, 0, 121, 33, 3, 0];
```

## 冒泡排序

核心：比较相邻元素，两两交换。

外层循环控制次数，内层循环进行交换找出最值。时间复杂度：`O（n*n）`。

```js
const sort = (arr = [], type = 0) => {
  if (!Array.isArray(arr)) throw "Only Array";
  let sym = undefined;
  for (let i = 1; i < arr.length - 1; i++) {
    //只需要比较n-1次
    for (let j = 0; j < arr.length - i; j++) {
      if (type === 0 ? arr[j] >= arr[j + 1] : arr[j] <= arr[j + 1]) {
        sym = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = sym;
      }
    }
  }
};
sort(arr);
console.log(arr);
```

## 快速排序

核心：对于数组`[1, 45, -45, 1, 10, 111, 0, 121, 33, 3, 0]`,选取某一数组元素作为基数来划分数组，如选取元素`111`作为基数。

做一次划分得到数组`[0, 45, -45, 1, 10, 1, 0, 3, 33, 111, 121]`,然后对子数组`[0, 45, -45, 1, 10, 1, 0, 3, 33]`和`[121]`在进行划分，以此类推直到每个子数组里面只有一个元素即可，这个过程采用递归的形式。

划分函数:

```js
const par = (arr, low, high) => {
  const mid = arr[low]; //以数组的第一个元素作为基数
  while (low < high) {
    while (low < high && arr[high] >= mid) --high; //筛选左侧数组的元素
    arr[low] = arr[high];
    while (low < high && arr[low] <= mid) ++low; //筛选右侧数组的元素
    arr[high] = arr[low];
  }
  arr[low] = mid;
  return low;
};
```

递归直到子数组只有一个元素为止。

```js
const sort = (arr, low, high) => {
  if (low < high) {
    //递归
    let num = par(arr, low, high);
    sort(arr, low, num - 1);
    sort(arr, num + 1, high);
  }
};
sort(arr, 0, arr.length - 1);
console.log(arr);
```

### 优化

生成一个随机基数来进行优化。

```js
let num = Math.floor(Math.random() * (high - low) + low); //随机基数位置
```

::: tip 提示
未完待续
:::
