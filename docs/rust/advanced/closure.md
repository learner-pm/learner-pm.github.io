# 闭包

闭包是可以捕获其环境中变量的匿名函数。与普通函数不同，闭包可以访问其定义范围内的变量（甚至是从外部传入的变量），并且可以作为值传递、赋值和调用，闭包是Rust中非常强大的功能之一，被广泛应用于函数式编程模式、并发、事件处理等场景

## 定于

Rust中的闭包通过`|`语法定义，类似于其他语言中的匿名函数

```rust
|参数1, 参数2, ...| -> 返回类型 {
    // 闭包体
}

```

闭包的语法于普通函数类似，但它没有显式的`fn`关键字，并且参数和返回类型可以根据上下文推断

```rust
fn main() {
    let add = |a, b| a + b; // 闭包，捕获了外部的 `a` 和 `b`
    let result = add(2, 3); // 调用闭包
    println!("Result: {}", result); // 输出: Result: 5
}

```

## 闭包捕获环境

闭包的一个重要特性是它们能够捕获定义它们时所在作用域中的变量（即它们的环境）。Rust提供了三种方式来捕获这些变量：

- 按值捕获（`move`）：闭包将环境变量的所有权移动到闭包内部
- 按引用捕获：闭包通过引用捕获变量（默认情况下，如果闭包只读取变量，Rust会选择引用捕获）
- 按可变引用捕获：如果闭包需要修改捕获的变量，Rust会通过可变引用捕获它们

按值捕获

```rust
fn main() {
    let x = 5;
    let closure = move || {
        println!("x: {}", x); // `x` 的所有权被转移到闭包内
    };
    closure(); // 使用闭包
    // println!("{}", x); // 编译错误，`x` 已被移动
}

```

不可变引用

```rust
fn main() {
    let x = 5;
    let closure = || {
        println!("x: {}", x); // 捕获 `x` 的引用
    };
    closure(); // 使用闭包
}

```

可变引用

```rust
fn main() {
    let mut x = 5;
    let mut closure = || {
        x += 1; // 闭包通过可变引用修改 `x`
    };
    closure();
    println!("x: {}", x); // 输出: x: 6
}

```

## 类型推断

Rust中的闭包会根据捕获的变量和参数类型自动推断其类型，通常不需要显式地标注类型。Rust会根据闭包的使用上下文来推断类型

```rust
fn apply<F>(f: F)
where
    F: Fn() {
    f(); // 调用闭包
}

fn main() {
    let closure = || println!("Hello, world!"); // 闭包
    apply(closure); // 调用闭包作为参数传递
}

```

在这里，apply 函数接受一个闭包，它的类型通过泛型 F 被推断出来，闭包的类型是 Fn()，因为它不接受参数并且没有返回值。更多可看生命周期部分内容

## 闭包和`Fn`特征

闭包在Rust中时通过`Fn`、`FnMut`和`FnOnce`特征来区分的。这些特征定义了闭包如何捕获变量，以及如何调用

- Fn：表示闭包只读取环境中的变量，不修改它们，并且可以多次调用
- FnMut：表示闭包可以修改捕获的环境变量，并且可以多次调用
- FnOnce：表示闭包只能调用一次，因为它捕获了环境中的值并且可能移动了它们

`Fn`和`FnMut`

```rust
fn apply_fn<F>(mut f: F)
where
    F: FnMut(),
{
    f(); // 调用闭包
}

fn main() {
    let mut count = 0;
    let mut closure = || {
        count += 1; // 修改环境中的变量
        println!("Count: {}", count);
    };

    apply_fn(closure); // 传递 FnMut 闭包
}

```

`FnOnce`

```rust
fn apply_once<F>(f: F)
where
    F: FnOnce(),
{
    f(); // 调用闭包
}

fn main() {
    let move_closure = move || {
        let x = 5;
        println!("x: {}", x); // 闭包拥有 `x` 的所有权
    };

    apply_once(move_closure); // 传递 FnOnce 闭包
}

```

## 闭包和函数的区别

闭包普通函数之间有一些关键的区别：

- 闭包捕获环境：闭包可以捕获它所在的环境的变量，普通函数不能
- 闭包时匿名的：闭包通常没有名字，可以被传递和存储作为值，而函数有一个固定的签名
- 闭包的调用方式灵活：闭包可以在定义的地方直接调用，也可以作为参数传递给其他函数

## 使用场景

- 迭代器：闭包常常用作迭代器中的处理函数，例如`map`等

  ```rust
  let numbers = vec![1, 2, 3, 4, 5];
  let doubled: Vec<i32> = numbers.into_iter().map(|x| x * 2).collect();
  println!("{:?}", doubled); // 输出: [2, 4, 6, 8, 10]
  ```

- 事件驱动编程：闭包可以用来处理异步事件或回调函数
- 函数式编程：闭包时函数式编程的核心，常用于高阶函数和组合函数的实现
