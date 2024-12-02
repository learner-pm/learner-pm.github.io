# 所有权

所有权算是`Rust`的一个核心概念，简单说一个值只能有一个所有者。

## 唯一所有者

先看一段`JS`代码，就是打印一些变量

```js
const a = 2
const b = a

const target = {
  a,
  b
}

const targetTwo = target

console.log(a, b, target, targetTwo) // 2,2,{a:2,b:2},{a:2,b:2}
```

使用`Rust`来实现相同的代码如下：

```rust

#[derive(Debug)]
struct Target {
    a: i32,
    b: i32,
}

let a = 2;
let b = a;
let target = Target { a, b };
let targetTwo = target;
println!(
    "a={},b={},target={:?},targetTwo={:?}",
    a, b, target, targetTwo
)
```
