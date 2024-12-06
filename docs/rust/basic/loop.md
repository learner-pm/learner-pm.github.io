# 循环语法

首先是`for`循环，格式为`for xx in xx {}`，`continue`：跳过当次循环，`break`：跳出整个循环

```rust
for i in 1..5 { // 1..5 生成1到5，不包含5的数组
    println!("{}",i)
}
```

`while`循环

```rust
let mut n = 0;
while n <= 5{
    println!("{}", n);
    n = n + 1;
}
```

`loop`循环，直接无限循环

```rust
loop {
    println!("loop")
}
```
