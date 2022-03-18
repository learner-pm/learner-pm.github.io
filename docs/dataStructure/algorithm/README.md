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
  //结束条件
  else return fib(n - 1) + fib(n - 2); //规则就是 通项公式
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

**The problem**:给定一个输入字符串，判断是否为回文字符串

采用 for 循环遍历判断，字符串长度为偶数只需要比较长度一半即可，为奇数除开中间字符：

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

### 最长回文字串

leetcode 真题

分析：对比于判断是否回文字符串，此题是找出字符串中为回文串中长度最长得字符串。难度在于要去找到输入字符串的子串，并且找到符合的最大长度的字串。

因为需要找出最长得，所以就从大到小去判断，找到就 return，对于长度为 n 得字符串，它有(n \* (n + 1)) / 2 个子组合。紧接得问题就是找出从大到小得字符串。如：`abba`,按从大到小有：`abba`,`abb`,`bba`,`ab`,`bb`,`ba`,`a`,`b`,`b`,`a`。

第一种方式，直接暴力求解，第一层循环意为循环子字符串的长度，第二层为找出字符串长度为 i 时候的所以子字符串，最里面循环来进行比较判断当前字符串是否符合回文的要求。

```js
const longestPalindrome = (s) => {
  let left = undefined;
  let right = undefined;
  let isPal = false;
  for (let i = 0; i < s.length; i++) {
    //i: 0 1 2 ...
    for (let j = 0; j <= i; j++) {
      //j: s.length -1  s.length - 2 ...
      (left = j), (right = s.length - i + j - 1);
      let str = s.substring(left, right + 1); //js截取字符串的方法，左闭右开，right+1;
      while (left <= right) {
        if (s[left] !== s[right]) {
          isPal = false;
          break;
        }
        isPal = true;
        left++;
        right--;
      }
      if (isPal) return str;
    }
  }
};
```

这种方法，空间复杂度为`O(n*n*n)`,复杂度太高。

**优化**：可在判断是否为回文和获取子组合得时候同时进行，减少一层循环

```js
const longestPalindrome = function (s) {
  let left = undefined;
  let right = undefined;
  let isPal = false;
  let number = [0]; //维护一个判断数组
  let i = 0;
  let j = 0;
  while (i <= number.length) {
    if (i > number.length - 1) {
      //增加循环次数0; 0 1; ...
      number.push(number.length);
      i = 0;
      j++;
    }
    if (number.length - 1 >= s.length) {
      //超出输入字符最大长度就结束循环
      break;
    }
    left = i;
    right = s.length - 1 - j + i;
    let str = s.substring(left, right + 1);
    while (left <= right) {
      //判断当前字符串
      if (s[left] !== s[right]) {
        isPal = false;
        break;
      }
      isPal = true;
      left++;
      right--;
    }
    if (isPal) return str; //从大到小判断，找到就return
    i++;
  }
};
```

外层循环控制次数，内层循环来进行比较。外层循环的 i 就是子字符串的长度固定时候需要的次数，j 为当前字符串的长度补值。

不过这种方法好像也很费时间，和内存，在 leetcode 上效率好像不高。

**动态规划**：采用动态规划来求解。

如果 arr[i][j] = true 表示字符串 s{i,j}为回文串的话，如果 s[i-1]===s[j+1],那么 arr[i-1][j+1]也是一个回文字符串，依次类推。最终方程为：P{i,j} = P{i-1,j+1}^(S_i === S_j),其中 j-i 差值最大的值对应得字符串就是题解。

每一个 arr[i][j]得值保存使用，如果满足条件就置为 arr[i][j] = true,初始条件显然为 i=j 得时候，本身就是回文字符串。例如字符串`saaaa`，它得所以情况如下图所示：

<img src="./img/palindromeLongest.png" width="100%" height="400px">

初始化一个二维数组，将当个字符得情况全部置为 true。其余为 false。

```js
for (i = 0; i < sLength; i++) {
  arr[i] = [];
  for (j = 0; j < sLength; j++) {
    if (i === j) arr[i][j] = true;
    else arr[i][j] = false;
  }
}
```

双重循环进行遍历二维数组，如果 s[i] ===s[j],那么就去比较当前索引得插值，如果小于二，例如上图中得`arr[1][3]对应得字符串`aaa`，中间只有一个字符得情况下，那么当前字符肯定是一个回文字符串。

如果不是这个情况，就进行缩减比较，如果 arr[i-1][j+1]为 true，就满足情况，再去比较 length 进行替换。最后得 start 和 end 得值就是题解所求得字符串起始位置。

```js
for (let i = 0; i < sLength; i++) {
  for (let j = 0; j < sLength; j++) {
    if (s[i] === s[j]) {
      if (j - i < 2 || arr[i - 1][j + 1] == true) {
        arr[i][j] = true;
        if (length < j - i) {
          start = i;
          end = j;
          length = j - i;
        }
      }
    }
  }
}
```

如上代码待 leetcode 运行会导致测试用例通过不完全。例如在求解字符串`aaaa`得时候，它本身就是一个回文字符串，然而在判断`arr[0][3]`得时候，按照代码逻辑，s[0]和 s[3]相等，差值大于二，就去判断 arr[1][2]得布尔值，由于循环得问题，此时 arr[1][2]还未进行比较，就导致判断为 false，求解错误。

所以上面代码得循环有问题，arr[i][j]得值是依赖于 arr[i-1][j+1]得值，也就是长字符串依赖于短字符串。之前得循环导致短字符串还没有求值，就去判断长字符串，所以测试用例不通过。

```js
const longestPalindrome = function (s) {
  let start = 0;
  let end = 0;
  let length = 0;
  let sLength = s.length;
  const arr = [];
  for (i = 0; i < sLength; i++) {
    arr[i] = [];
    for (j = 0; j < sLength; j++) {
      if (i === j) arr[i][j] = true;
      else arr[i][j] = false;
    }
  } // 生成二维数组
  for (let i = 0; i < sLength; i++) {
    for (let j = 0; j < sLength; j++) {
      if (s[i] === s[j]) {
        if (i - j < 2 || arr[i - 1][j + 1] == true) {
          // i -j,j-> start
          arr[i][j] = true;
          if (length < i - j) {
            start = j;
            end = i;
            length = i - j;
          }
        }
      }
    }
  }
  return s.substring(start, end + 1);
};
console.log(longestPalindrome("daaaa"));
```

::: tip 提示
未完待续
:::
