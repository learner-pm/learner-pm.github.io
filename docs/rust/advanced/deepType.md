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

## newtype、类型别名

### newtype

`newtype`是一种常见的模式，它用于定义一个新的类型，通常通过包裹现有的类型来实现。这个新类型通常具有与原类型相同的内存布局和功能，但它在类型系统中被视为不同的类型。

`newtype`模式主要目的是提供更强的类型安全性和更明确的语义，即使着两个类型在内存上是相同的。

#### 定义

`newtype`通常涉及通过`元组结构体`或`结构体`来包裹一个现有的类型。虽然新类型与原类型在内存布局和大小上相同，但它们被视为不同的类型，从而使得`Rust`编译器能够对它们进行类型检查

```rust
struct Meters(i32);  // Meters 是 i32 的包装类型

fn main() {
    let distance = Meters(10);  // 创建一个 Meters 类型的实例
    let value = distance.0;     // 访问内部的 i32 值
    println!("Distance: {}", value);
}

```

`Meters`是一个`newtype`，它封装了一个`i32`值，虽然两者在内存上是相同的，但它们是不同的类型

#### 优势

1. 类型安全
   `newtype`模式通过创建新的类型来避免原类型的错误使用。例如，`Meters`和`Kilometers`可以是两种不同的类型，它们都可以表示一个数值，但由于它们不是相同的类型，编译器会阻止直接混合使用

   ```rust
   struct Meters(f64);
   struct Kilometers(f64);

   fn convert_to_km(m: Meters) -> Kilometers {
       Kilometers(m.0 / 1000.0)
   }

   fn main() {
       let distance_in_meters = Meters(1500.0);
       let distance_in_km = convert_to_km(distance_in_meters);
       // let invalid = distance_in_meters + distance_in_km; // 编译错误
   }

   ```

2. 文档化和语义化
   `newtype`可以使得代码的意图更加明确。`Meters` 和 `Kilometers` 这样的类型时，它比简单的 f64 类型更具语义性，能够更好地表达代码的目的。
3. 防止不合适的操作
   `newtype` 可以防止无意义的操作，比如将表示不同单位的量直接相加。通过引入 `newtype`，我们可以显式地指定两种量是不同的类型，从而防止出现错误的计算
4. 实现`trait`
   通过 `newtype`，你可以为包装的类型实现特定的 `trait`，这样它可以具有不同的行为。例如，你可以为 `Meters` 类型实现自己的 `Display trait`，使得它的输出形式更符合上下文。

```rust
use std::fmt;

struct Meters(f64);

impl fmt::Display for Meters {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} meters", self.0)
    }
}

fn main() {
    let distance = Meters(1000.0);
    println!("{}", distance);  // 输出：1000 meters
}

```

#### newtype 与类型转换

虽然`newtype`定义了不同的类型，但它们通常可以通过`From`和`Into`trait实现自动转换。这样就这样在不同类型之间轻松转换

```rust
struct Meters(f64);
struct Kilometers(f64);

impl From<Meters> for Kilometers {
    fn from(m: Meters) -> Self {
        Kilometers(m.0 / 1000.0)
    }
}

impl From<Kilometers> for Meters {
    fn from(k: Kilometers) -> Self {
        Meters(k.0 * 1000.0)
    }
}

fn main() {
    let meters = Meters(1500.0);
    let kilometers: Kilometers = meters.into(); // 使用 Into trait
    println!("{} kilometers", kilometers.0);
}

```

#### newtype 和 Traits

通过`newtype`模式，可以为包装类型实现新的`trait`，或者为现有类型实现trait。如为`Meters`实现`Add`trait

```rust
use std::ops::Add;

struct Meters(f64);

impl Add for Meters {
    type Output = Meters;

    fn add(self, other: Meters) -> Meters {
        Meters(self.0 + other.0)
    }
}

fn main() {
    let distance1 = Meters(100.0);
    let distance2 = Meters(200.0);
    let total = distance1 + distance2;
    println!("Total distance: {} meters", total.0);
}

```

#### 与原始类型的兼容性

尽管 newtype 提供了类型安全，但它与原始类型是兼容的。由于 newtype 只是封装了另一个类型，在很多情况下，你可以通过解构和访问原始值来使用它。例如，`Meters` 类型可以通过 `.0` 访问其内部的 f64 值。

### 类型别名

在`Rust`中，类型别名是用来为已有的类型提供一个新的名字。与`newtype`模式不同，类型别名并不创建一个新的类型，而是仅仅为现有类型提供一个更具描述性的别名。类型别名通过使用`type`关键字来定义

#### 语法

```rust
type MyAlias = SomeType;

```

简单的例子

```rust
type Kilometers = f64; // 为 f64 起一个别名

fn main() {
    let distance: Kilometers = 100.0;  // 使用别名 Kilometers
    println!("Distance: {} kilometers", distance);
}

```

在这个例子中，`Kilometers`是`f64`的类型别名。尽管`Kilometers`和`f64`是同一个类型，Rust编译器会把它们视为不同的类型，允许我们为它赋予不同的语义。这有助于增加代码的可读性

#### 使用场景

1. 简化复杂的类型签名

   ```rust
    type BoxedVec<T> = Vec<Box<T>>;  // 简化 Vec<Box<T>> 类型

    fn main() {
        let v: BoxedVec<i32> = vec![Box::new(1), Box::new(2)];
        println!("{:?}", v);
    }
   ```

2. 增强可读性和语义化
   下面例子中，`Coordinates`被用作`(f64, f64)`的类型别名，代表一个坐标对。通过使用类型别名，代码的意图变得更加明确，易于理解

   ```rust
   type Coordinates = (f64, f64); // 为坐标元组起别名

   fn distance(p1: Coordinates, p2: Coordinates) -> f64 {
       let dx = p1.0 - p2.0;
       let dy = p1.1 - p2.1;
       (dx * dx + dy * dy).sqrt()
   }

   fn main() {
       let p1 = (0.0, 0.0);
       let p2 = (3.0, 4.0);
       println!("Distance: {}", distance(p1, p2));
   }

   ```

3. 限值泛型类型参数
   有时、我们希望为某个泛型类型限值一个类型的范围，可以通过类型别名配合trait约束来实现这一点

   ```rust
   type PositiveInt = i32;

   fn add_positive_numbers(a: PositiveInt, b: PositiveInt) -> PositiveInt {
       a + b
   }

   fn main() {
       let sum = add_positive_numbers(5, 3);
       println!("Sum: {}", sum);
   }

   ```

#### 与newtype对比

newtype 模式和类型别名都可以用于封装现有类型，但它们的行为有所不同：

- newtype：创建了一个完全独立的类型。即使新类型和原类型具有相同的内存布局和大小，编译器仍然会将它们视为不同的类型。
- 类型别名：只是为已有的类型创建一个新的名字，编译器将它们视为相同的类型。

```rust
struct Meters(i32);  // newtype 定义，创建了一个新类型

type Kilometers = i32;  // 类型别名，`Kilometers` 是 `i32` 的别名

fn main() {
    let x: Meters = Meters(100);
    let y: Kilometers = 100;

    // x 和 y 不能直接相加，因为 Meters 是一个不同的类型（newtype），而 Kilometers 是 i32 的别名（类型别名）
}

```

## Sized 和不定长类型 DST

`Sized` 和不定长类型 `DST`是Rust中两个非常重要的概念，尤其是它们在类型系统中的作用和如何影响指针、内存布局以及生命周期管理

### Sized

Rust的`Sized`特征标记了一个类型的大小在编译时是否是已知的。对于大多数类型，编译器可以在编译期计算出它们的大小，这些类型被认为是`Sized`。`Rust`通过`Sized`特征来控制类型的储存方式

- 类型是Sized的：编译时已经知道这个类型的大小，可以在栈上分配
- 类型并不是Sized的：编译时无法确定大小，通常是指针类型，或者需要在堆上分配的类型

如何检查一个类型是否为`Sized`?

Rust 自动为所有 已知大小的类型（例如整数、结构体等）实现了 Sized 特征。如果一个类型没有实现 Sized，则它被认为是 DST 类型。

在 Rust 中，所有类型默认都实现了`Sized` 特征，除非明确指出其是 DST（例如切片、动态大小类型）。你可以使用 `std::mem::size_of::<T>()` 来获取类型的大小，对于 DST 类型（如 str 和 [T]），它的大小是动态的，无法在编译期计算。

```rust
use std::mem;

fn main() {
    // 整数类型是 Sized
    println!("size of i32: {}", mem::size_of::<i32>());

    // 字符串是 DST 类型
    println!("size of str: {}", mem::size_of::<str>());
}

```

### DST

`DST`全称`Dynamically Sized Types`，不定长类型。DST指那些大小在编译时不可确定的类型。它们没有固定的内存大小，通常依赖于运行时数据。例如：

- 切片（slice）：如`str`或`Vec<T>`，它们的大小是动态的，因为它们依赖于内容的长度
- trait对象：如`dyn trait`，这些类型的大小在编译时不可知，必须通过指针来访问

### DST类型与指针

DST类型通常无法直接存在于栈上，而是通过指针来间接引用。

- 切片：一个切片会有两个字段，指向数据的指针和切片的长度。它的大小是固定的，但它所指向的数据大小是动态的
- trait对象：类型地，`dyn trait`类型通常被包裹在一个指针中，通过指针和虚表来访问

### 对比

在Rust中，只有Sized类型可以被直接储存在栈上。对于DST类型，它们不能直接在栈上使用，必须通过引用或指针类型来处理

- Sized 类型：大小已知，能直接储存在栈上，如`i32`、`struct` 等
- DST类型：大小未知，必须通过引用（`&T`）或指针（`Box<T>`）来访问

sized

```rust
use std::mem;

// `T` 必须是 Sized 类型
fn is_sized<T: Sized>(value: T) {
    println!("Type is sized!");
}

fn main() {
    let a = 5; // `i32` 是 `Sized` 类型
    is_sized(a);

    // let b: str = "Hello"; // `str` 是 DST 类型，不能传递到 `is_sized`
    // is_sized(b); // 错误: `str` 类型不是 `Sized`
}

```

DST

```rust
fn main() {
    let s: Box<dyn std::fmt::Debug> = Box::new(42); // 通过 Box 存储 DST 类型
    println!("{:?}", s);
}

```
