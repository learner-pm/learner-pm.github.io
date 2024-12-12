# 深入类型

## 类型转换

`From`特征，该特征用于实现一种类型到另一种类型的转换。它提供了一个方法`from()`，可以将一个值从一种类型转换为另一种类型。

```rust
pub trait From<T>: Sized {
    fn from(t: T) -> Self
}
```

使用：

```rust
struct MyType(i32);

// 示例：实现从 i32 到 f64 的转换
impl From<MyType> for f64 {
    fn from(item: MyType) -> f64 {
        item as f64 // 使用 `as` 关键字进行类型转换
    }
}

fn main() {
    let x: MyType = MyType(5);
    let y: f64 = f64::from(x); // 使用 From::from() 方法进行类型转换
    println!("{}", y); // 输出: 5.0
}

```

- From转换时自动转换的、
- 它不会出现转换失败的情况。你可以放心地使用它，因为 Rust 保证 From 是无损转换。

`Into` 特征是`From`的反向实现。它允许我们通过`.into()`方法将一种类型转换为另一种类型。由于`Into`和`From`是相对应的，因此，Rust会根据From特征的实现自动推导`Into`的转换

```rust
pub trait Into<T>: Sized {
    fn into(self) -> T
}
```

```rust
fn main() {
    let x: i32 = 5;
    let y: f64 = x.into(); // 使用 `.into()` 自动转换
    println!("{}", y); // 输出: 5.0
}

```

- Into转换时通过实现From特征来自动提供的，使用`.into()`方法
- 如果From转换存在，Into转换也会自动提供

### TryFrom、TryInto

`TryFrom`和`TryInto`是Rust中的两个特征，类似于`From`和`Into`，但是它们用于可能失败的类型转换。这些转换返回`Result`，从而允许我们处理可能得错误。

`TryFrom`用于定义一种类型到另一种类型的可能失败的转换。它的`try_from()`方法返回一个`Result`，如果转换成功，返回ok，失败err

定义

```rust
pub trait TryFrom<T>: Sized {
    fn try_from(t: T) -> Result<Self, Self::Error>;
    type Error;
}

```

使用

```rust
use std::convert::TryFrom;

#[derive(Debug)]
struct MyStruct {
    value: i32,
}

impl TryFrom<i32> for MyStruct {
    type Error = &'static str;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        if value > 0 {
            Ok(MyStruct { value })
        } else {
            Err("Value must be positive")
        }
    }
}

fn main() {
    let result: Result<MyStruct, _> = MyStruct::try_from(10);
    match result {
        Ok(structure) => println!("Success: {:?}", structure),
        Err(e) => println!("Error: {}", e),
    }
}

```

`TryInto`特征

`TryInto`是`TryFrom`的反向特征，它允许你将值转换成另一种类型。如果成功，它返回ok，失败则err

```rust
use std::convert::TryInto;

fn main() {
    let x: i32 = -5;
    let result: Result<MyStruct, _> = x.try_into(); // 使用 `try_into()` 进行转换
    match result {
        Ok(s) => println!("Converted: {:?}", s),
        Err(e) => println!("Error: {}", e),
    }
}

```

### as 关键字

`Rust`提供了`as`关键字来进行类型转换。`as`通常用于执行显式类型转换，例如从较大的数值类到较小的数值类型，或者将某个类型强制转换为另一个类型。`as`转换可能会丢失精度或产生错误，因此需要特别注意

```rust
fn main() {
    let a: f64 = 10.5;
    let b: i32 = a as i32; // 使用 `as` 关键字将 f64 转换为 i32
    println!("{}", b); // 输出: 10
}

```

- 使用`as`转换时，如果转换的目标类型无法容纳源类型的所有值，可能会发生截断或溢出
- `as`也可以用于转换原始指针、引用、枚举等

## 点操作符

点操作符`.`是一个非常重要的操作符，主要用于 访问结构体、枚举、元组、对象、方法、字段等。它可以用来执行多种功能，如访问字段、调用方法、进行成员解构等。点操作符通常用于
获取一个对象或值的成员

### 点操作符的基本功能

- 访问结构体的字段：可以直接通过点操作符访问结构体的字段
- 调用对象的方法：点操作符用于调用实现了特定方法的类型（如结构题、枚举、trait对象等）的方法

```rust
struct Person {
    name: String,
    age: u32,
}
impl Person {
    fn greet(&self) {
        println!("Hello, {}", self.name);
    }
}
fn main() {
    let person = Person {
        name: String::from("Alice"),
        age: 30,
    };

    println!("Name: {}", person.name);  // 使用点操作符访问字段
    println!("Age: {}", person.age);    // 使用点操作符访问字段
    person.greet();  // 使用点操作符调用方法
}

```

### 点操作符与引用和所有权的关系

1. 引用与点操作符

Rust中，方法通常通过`&self`或`&mut self`来接受引用。点操作符在调用方法时会根据需要自动传递引用，尤其是当我们调用某个类型的方法时，Rust会自动解引用
`Box<T>`或其他智能指针类型，以便调用方法。

**自动解引用**

Rust自动为智能指针类型（如`Box<T>`，`Rc<T>`,`Arc<T>`）执行解引用操作，使得我们可以像直接使用值类型一样使用智能指针。点操作符会通过
解引用来调用方法，避免显式的解引用操作

```rust
use std::ops::Deref;

struct Person {
    name: String,
}

impl Person {
    fn greet(&self) {
        println!("Hello, {}", self.name);
    }
}

fn main() {
    let person = Box::new(Person {
        name: String::from("Alice"),
    });

    person.greet();  // 自动解引用 Box，调用 greet 方法
}

```

上述例子中，`person`时`Box<Person>`类型，点操作符会自动解引用`Box`，调用`greet`方法，等价于`(*person).greet()`

**所有权与点操作符**
