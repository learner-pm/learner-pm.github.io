# 输出类

## print! 和 println!

这两个都是常用的输入宏，允许开发者控制输入内容的格式，println 会自动添加换行符，而 print 不会

```rust
fn main() {
    // println! 输出内容并换行
    println!("Hello, world!");

    // print! 输出内容但不换行
    print!("Hello");
    print!(" ");
    print!("World!");
}

```

## 格式化字符串

可以通过插入{}占位符来插入变量或表达式的值

```rust
fn main() {
    let name = "Alice";
    let age = 30;

    // 使用 `{}` 来插入变量
    println!("Name: {}, Age: {}", name, age);
}

```

## 格式化选项

在 Rust 中，你可以通过在 {} 内部提供格式化选项来调整输出的样式。常见的格式化选项包括对齐、填充、数字精度控制等。

1.  对齐和填充
    可以使用 : 后面的标记来指定对齐方式和填充字符。

    - <：左对齐
    - > ：右对齐（默认）
    - ^：居中对齐
    - 0：用零填充

    ```rust
    fn main() {
        let name = "Alice";
        let number = 42;

        // 左对齐，填充字符为 '-'
        println!("{:<10} | {:>5}", name, number);

        // 右对齐，填充字符为 '0'
        println!("{:0>10}", number);

        // 居中对齐
        println!("{:^10}", name);
    }

    ```

2.  数字格式化

    - {}：默认显示格式。
    - {:b}：二进制表示。
    - {:o}：八进制表示。
    - {:x}：十六进制表示（小写字母）。
    - {:X}：十六进制表示（大写字母）。
    - {:e}：科学计数法表示（小写 e）。
    - {:E}：科学计数法表示（大写 E）。

    ```rust
    fn main() {
        let number = 255;

        // 十进制
        println!("Decimal: {}", number);

        // 二进制
        println!("Binary: {:b}", number);

        // 八进制
        println!("Octal: {:o}", number);

        // 十六进制（小写）
        println!("Hexadecimal (lowercase): {:x}", number);

        // 十六进制（大写）
        println!("Hexadecimal (uppercase): {:X}", number);
    }

    ```

## 浮点数格式化

- {:?}：调试输出，适用于结构体、元组、数组等复杂数据类型。
- {:e}：使用科学计数法格式表示浮点数（小写 e）。
- {:E}：使用科学计数法格式表示浮点数（大写 E）。
- {:._}：控制浮点数的精度，_ 用来指定小数位数。

```rust
fn main() {
    let pi = 3.1415926535;

    // 默认格式
    println!("Default format: {}", pi);

    // 科学计数法（小写 e）
    println!("Scientific notation (e): {:e}", pi);

    // 科学计数法（大写 E）
    println!("Scientific notation (E): {:E}", pi);
}

```

可以通过`.precision`来控制精度

```rust
fn main() {
    let pi = 3.1415926535;

    // 限制输出为 2 位小数
    println!("Formatted to 2 decimal places: {:.2}", pi);

    // 使用动态精度
    let precision = 4;
    println!("Formatted with dynamic precision: {:.1$}", pi, precision);
}

```

## 调试输出

调试输出通常用于打印变量的值，尤其是用于开发调试阶段。调试输出会以 `{:?}` 或 `{:#?}` 的形式使用。`{:?}` 是普通调试输出，`{:#?}` 会输出更易读的结构（例如结构体或枚举）。

```rust
fn main() {
    let vec = vec![1, 2, 3];
    println!("Debug output: {:?}", vec);
    // 格式化调试输出
    println!("Formatted debug output: {:#?}", vec);
}

```

通过实现Debug trait 可以类自定义类型支持调试输出功能

```rust
#[derive(Debug)] // 自动为结构体实现 Debug trait
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let person = Person {
        name: "Alice".to_string(),
        age: 30,
    };

    println!("Debug output: {:?}", person);
}

```

## 自定义格式化

Rust 允许你为自己的类型实现 `std::fmt::Display` 和 `std::fmt::Debug trait`，从而自定义如何格式化该类型。对于 `Display`，它定义了如何以用户友好的方式打印该类型，而 `Debug` 则用于调试时的输出。

1. 实现 Display Trait
   如果你想要自定义如何打印某个类型，通常实现 Display trait。它用于用户界面友好的格式化输出，通常比 Debug 更简洁。

   ```rust
   use std::fmt;

   struct Point {
       x: f64,
       y: f64,
   }

   // 实现 Display trait
   impl fmt::Display for Point {
       fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
           write!(f, "Point({}, {})", self.x, self.y)
       }
   }

   fn main() {
       let point = Point { x: 3.4, y: 5.6 };
       println!("Formatted point: {}", point);  // 使用 Display 输出
   }

   ```

2. 实现 Debug Trait
   Debug trait 通常用于调试输出，需要通过 #[derive(Debug)] 自动实现，或者手动实现该 trait。

   ```rust
    use std::fmt;

    struct Point {
        x: f64,
        y: f64,
    }

    // 实现 Debug trait
    impl fmt::Debug for Point {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            write!(f, "Point {{ x: {}, y: {} }}", self.x, self.y)
        }
    }

    fn main() {
        let point = Point { x: 3.4, y: 5.6 };
        println!("Debug output: {:?}", point);  // 使用 Debug 输出
    }

   ```

## format!

`format!`的使用和上面的`print!`差不多

```rust
fn main() {
    let name = "Alice";
    let age = 30;

    // 使用 `format!` 生成一个字符串，并与另一个字符串拼接
    let message = format!("Name: {}, Age: {}", name, age);
    let final_message = message + " - Welcome!";

    println!("{}", final_message);
}

```
