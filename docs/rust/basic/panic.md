# panic!

在`Rust`中，*panic*是指程序在运行过程中发生了一个错误，导致程序终止执行。它是一种机制，被用于处理程序无法继续执行的情况。也就是程序错误的`宏`

## 什么是`panic`

`panic`是`Rust`标准库中的一个宏，用于触发程序的崩溃。在调用`panic!`时，程序会打印出错误信息，并开始 unwinding ，以清理资源并终止程序

1. `panic!` 的触发

`Rust`中的`panic!`可以通过以下方式触发：

- 数组越界访问
- 解引用`None`
- 解引用空指针
- 手动调用`panic!`

2. `panic!`的工作原理

在`Rust`中，`panic!`发生时，程序有两种选择模式：

- Unwinding：栈展开的过程意味着`Rust`会清理程序中的资源（如释放内存），并沿着栈向上返回，直到退出当前的作用域
- Abort：直接终止程序，不进行栈展开，主要用于性能敏感的场景，因为它不需要进行清理工作

默认情况下，`Rust`使用 `Unwinding`模式来处理`panic`。也可以设置为`Abort`来强制程序终止

## 实例

```rust
fn main(){
    let vec = vec![1,2,3]
    let val = vec[10];//数组越界触发panic!
}
```

```rust
fn main(){
    let x = 10;
    if x > 5 {// 手动触发
        panic!("x cannot be greater than 5: got {}", x);
    }
}
```

## Result 和 Option

在`Rust`中，一般推荐使用`Result`和`Option`来处理错误，而不是直接调用`panic!`。因为`Result`和`Option`不会直接导致程序崩溃。

- 使用`Option`

  ```rust
  fn main(){
      let x = Some(10);
      let y = x.unwrap_or(0); // 只会返回None，不会触发panic
  }
  ```

- 使用`Result`

  如下使用`Result`来处理错误

  ```rust
  use std::fs::File;
  use std::io::ErrorKind;

  fn main() {
      let f = File::open("hello.txt");

      let f = match f {
          Ok(file) => file,
          Err(error) => match error.kind() {
              ErrorKind::NotFound => match File::create("hello.txt") {
                  Ok(fc) => fc,
                  Err(e) => panic!("Problem creating the file: {:?}", e),
              },
              other_error => panic!("Problem opening the file: {:?}", other_error),
          },
      };
  }
  ```

  如果不想处理错误，直接拿到值。可以使用`unwrap`、`expect`

  ```rust
  use std::fs::File;
  fn main() {
    let f = File::open("hello.txt").unwrap();// 不存在直接panic
    let f1 = File::open("hello.txt").expect("Failed to open hello.txt");//会带上自定义的内容
  }
  ```

## `?`操作符

`?`操作符是一个非常重要的操作符，用于*错误传播*。它可以简化错误处理过程，将错误传递给调用者，而不需要显示地使用`match`
或`unwrap`等方法。.

- 对于`Result<T, E>`类型：如果结果是`Err`，则会立即返回该`Err`值，停止当前函数的执行，并将错误传播给调用者。如果是 Ok，则会解构出值，继续执行。
- 对于`Option<T>`类型：如果结果是None，则会返回`None`，停止当前函数的执行。如果是`Some`，则解构出值，继续执行

实例1

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err("Cannot divide by zero".to_string());  // 手动返回错误
    }
    Ok(a / b)
}

fn calculate() -> Result<i32, String> {
    let result = divide(10, 2)?;  // 使用 `?` 传播错误
    Ok(result * 2)
}

fn main() {
    match calculate() {
        Ok(value) => println!("Result: {}", value),
        Err(e) => println!("Error: {}", e),
    }
}
```

- divide 函数返回一个 Result
- 在 calculate 中 ，调用 divide 并使用 `?`来传播错误
  - 如果 divide 返回 Err，该函数会立即返回该错误，不会继续执行后续代码
  - 如果 divide 返回 Ok，则继续执行代码

### 工作原理

该操作符要求*函数的返回类型*必须是`Result`或`Option`，并且该函数的返回类型必须与 `?`操作符使用的类型匹配

- 如果返回类型是 Result，则 ? 会传播 Err 错误。
- 如果返回类型是 Option，则 ? 会传播 None。

- 传播错误：当 ? 遇到 Err 或 None 时，它会立刻返回错误（或 None），并且调用者需要处理该错误。
- 解包值：如果 Result 是 Ok 或 Option 是 Some，则会自动解包其中的值，继续执行后续代码。

### 例子

实例2

```rust
fn find_item(id: i32) -> Option<String> {
    if id == 1 {
        Some("Item found".to_string())
    } else {
        None
    }
}

fn get_item_description() -> Option<String> {
    let description = find_item(1)?;  // 使用 `?` 传播 None
    Some(description + " - Description")
}

fn main() {
    match get_item_description() {
        Some(desc) => println!("{}", desc),
        None => println!("Item not found"),
    }
}

```

- find_item 函数返回一个 Option
- 在 get_item_description 中，调用了 find_name 并使用 `?` 传播错误 `None`
  - 如果返回None，则get_item_description 返回None
  - 返回Some，则继续执行
