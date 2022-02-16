# 小题目

收集一些小题目。

## 水仙花数

什么是水仙花数：水仙花数是指一个 3 位数，它的每个位上的数字的 3 次幂之和等于它本身。例如：1^3 + 5^3+ 3^3 = 153。

**The problem**：求出 100-1000 内的所有水仙花数。

```js
const narcissisticNumber = () => {
  let bit, ten, hundred;
  for (let i = 100; i < 1000; i++) {
    bit = i % 10;
    ten = ((i - bit) / 10) % 10; //js/运算有余
    hundred = (i - ten * 10 - bit) / 100;
    if (hundred * hundred * hundred + ten * ten * ten + bit * bit * bit === i)
      console.log(i);
  }
};
narcissisticNumber(); // 153 370 371 407
```

## 杨辉三角

经典问题，直接说重点：从第二行开始，非首列的值是当前列得`上一行`和`上一行前一列`两者值得和。

**The problem**：给出 n 的杨辉三角。

```js
const triangle = (n) => {
  const arr = [];
  let i, j;
  let str = "";
  for (i = 0; i < n; i++) {
    arr[i] = [];
    for (j = 0; j < n; j++) {
      arr[i][j] = 0;
    }
    arr[i][0] = 1; //生成基于n的二维数组
  }
  for (i = 1; i < n; i++) {
    for (j = 1; j <= i; j++) {
      arr[i][j] = arr[i - 1][j] + arr[i - 1][j - 1]; //规程填充
    }
  }
  for (i = 0; i < n; i++) {
    for (j = 0; j <= i; j++) {
      str += arr[i][j] + " ";
    }
    console.log(str); //打印
    str = "";
  }
};
triangle(10);
```

## 斐波拉契

斐波那契数列指的是这样一个数列 :1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89........

**重点**:这个数列从第 3 项开始，每一项都等于前两项之和。

**The problem**：求给定 n 下的斐波拉契数列，或给出 n 位下的值。

首先使用递归，下方法能求出 n 位下的斐波拉契的值。

```js
const fib = (n) => {
  if (n <= 2) return 1;
  else return fib(n - 1) + fib(n - 2);
};
console.log(fib(7));
```

若要打印 n 位下的斐波拉契数列，加个循环即可：

```js
for (let i = 1; i < 7; i++) {
  console.log(fib(i));
}
```

递归会占据大量内存空间，这对于算法中`空间复杂度`要求不是很好。

同时回看重点:**这个数列从第 3 项开始，每一项都等于前两项之和**。也就是说每次求第 n 项时只需要知道`n-1`和`n-2`项就行了，而递归每次都是从第一项开始计算，浪费了时间，所以可以采用循环来求解。

以下函数能打印出给定 n 下的数列：

```js
const fibF = (n) => {
  let last1 = undefined; //记录
  let last2 = undefined;
  let nowNumber = 1;
  for (let i = 0; i < n; i++) {
    if (i < 2) {
      nowNumber = last2 = last1 = 1;
    } else {
      nowNumber = last2 + last1;
      last2 = last1;
      last1 = nowNumber;
    }
    console.log(nowNumber);
  }
};
fibF(7);
```

## 回文字符串

定义：回文字符串是一个正读和反读都一样的字符串。

**重点**：正读和反读都一样。

首先采用 for 循环遍历判断，字符串长度为偶数只需要比较长度一半即可，为奇数除开中间字符：

```js
const isPalindromeString = (str) => {
  if (str.length === 1) return true;
  let num = str.length % 2 !== 0 ? str.length / 2 + 0.5 : str.length / 2; //js没有整除，需要处理一下
  for (let i = 0; i < num; i++) {
    if (str[i] !== str[str.length - 1 - i]) return false;
  }
  return true;
};
const str = "aassaa";
console.log(isPalindromeString(str));
```

也可以采用双指针来进行判断，就不需要计算中间位置：

```js
const isPalindromeString = (str) => {
  let low = 0;
  let high = str.length - 1;
  while (low <= high) {
    if (str[low] !== str[high]) return false;
    low++;
    high--;
  }
  return true;
};
const str = "vassav";
console.log(isPalindromeString(str));
```

对于类似的回文数也是一样的思路：前后同时遍历是否相同。

::: tip 提示
未完待续
:::
