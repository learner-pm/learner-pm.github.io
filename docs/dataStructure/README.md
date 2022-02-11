# 排序

测试用例

```js
const arr = [1, 45, -45, 1, 10, 111, 0, 121, 33, 3, 0];
```

blog
react
vue

```js
const sort = (arr = [], type = 0) => {
  if (!Array.isArray(arr)) throw "Only Array";
  let sym = undefined;
  for (let i = 1; i < arr.length; i++) {
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

```js
const quic = (arr, low, high) => {
  const mid = arr[low];
  while (low < high) {
    while (low < high && arr[high] >= mid) --high;
    arr[low] = arr[high];
    while (low < high && arr[low] <= mid) ++low;
    arr[high] = arr[low];
  }
  arr[low] = mid;
  return low;
};
const sort = (arr, low, high) => {
  if (low < high) {
    let num = quic(arr, low, high);
    sort(arr, low, num - 1);
    sort(arr, num + 1, high);
  }
};
sort(arr, 0, arr.length - 1);
console.log(arr);
```
