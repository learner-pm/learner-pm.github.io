# Rust

最近在看`Rust`，在这儿记录下学习`Rust`上遇到的问题，通过记录来加强对它的记忆。

## 类型

### 标量类型

标量类型表示单一值的类型，可分为四种

1. 整数类型
   `Rust`提供了有符号（i8, i16, i32, i64, i128）和无符号（u8, u16, u32, u64, u128）的整数类型
   - i8：8 位有符号整数，范围：-128 到 127
   - u8：8 位无符号整数，范围：0 到 255
   - i32：32 位有符号整数，范围：-2^31 到 2^31-1
   - u32：32 位无符号整数，范围：0 到 2^32-1
   - i64：64 位有符号整数，范围：-2^63 到 2^63-1
   - u64：64 位无符号整数，范围：0 到 2^64-1
   - i128 和 u128：分别为 128 位有符号和无符号整数
2. 浮点数类型
   `Rust`提供了f32和f4两种浮点数类型
   - f32 32位浮点数，精度调低
   - f64 64位浮点数，精度较高，默认类型
3. 布尔类型
   布尔类型只有两个值：`true`和`false`，用bool表示
4. 字符类型
   字符使用`char`类型来表示单一字符，字符类型是`Unicode`标量值，可以表示任何`Unicode`字符

### 符合类型

1.  元组类型
    元组是由多个不同类型的值组成的集合。元组的元素可以是不同类型，可以储存固定数量的元素

    ```rust
    let tup: (i32, f64, char) = (500, 6.4, 'y');
    let (x, y, z) = tup; // 解构元组
    println!("x = {}, y = {}, z = {}", x, y, z);
    ```

2.  数组类型
    数组是相同类型的值的集合，数组的大小是固定的。数组的类型是由元素数量共同确定的

    ```rust
    let arr: [i32; 5] = [1, 2, 3, 4, 5];
    let first_element = arr[0]; // 获取数组的第一个元素
    ```

3.  引用类型

        引用类型包括：

        - 不可变应用，使用`&`符号表示不可变引用，即引用的数据不可以被修改

        ```rust
        let s = String::from("Hello");
        let r = &s; // 不可变引用
        println!("{}", r);
        ```

        - 可变引用，使用`&mut`符合表示可变引用，即允许修改引用的数据

        ```rust
        let mut s = String::from("Hello"); // 为了去修改这个字符串，需要加上 mut 关键字进行修饰
        let r = &mut s; // 可变引用
        r.push_str(", world!");
        println!("{}", r); // 输出 "Hello, world!"
        ```

4.  单元类型
    单元类型为`()`，表示没有任何值。它通常用于函数返回类型，当函数不返回任何有意义的值时，返回`()`
    ```rust
    fn foo() -> () {
        println!("This function returns unit");
    }
    ```
5.  字符串类型
    - `String`是一个动态长度的可变字符串类型，通常用于可变和动态管理字符串的场景
    ```rust
    let mut s = String::from("Hello");
    s.push_str(", world!");
    println!("{}", s);
    ```
    - `&str`是字符串切片，表示一个不可变的、静态的字符串片段
    ```rust
    let s: &str = "Hello, world!";
    ```
6.  枚举类型
    枚举类型允许你定义一个可能的多个不同类型的值，关键字为`enum`
    ```rust
    enum Direction {
        Up,
        Down,
        Left,
        Right,
    }
    let move_dir = Direction::Up;
    ```
7.  结构体类型
    通过关键字`struct`创建自定义类型，由不同类型的字段组成

    ```rust
    struct Person {
        name: String,
        age: u32,
    }

    let person = Person { // 创建的方式
        name: String::from("Alice"),
        age: 30,
    };
    ```

## 变量

使用`let`声明变量，如下，`Rust`是强类型语言，`''`当引号用于表示字符，`""`双引号用于表示字符串

```rs
fn main(){
    let a = 10;
    let str = "xxx";
}
```

对于上面的变量a，如果我们直接去修改它，如这样`str = "11"`，是会遇到编译器报错的，原因是`Rust`中上面的声明会让变量默认是不可变的，如果要修改它需要使用关键字`mut`

```rs
let mut a = 10;
a = 100;
```

### 所有权

`所有权`是一个新的概念：每个值都有一个`所有者`，并且在同一时刻，每个值只能有一个所有者。所有者负责销毁值，当所有者离开作用域时，Rust会自动清理资源。

下面用String来举例：

1. 所有权

如下代码，`String::from("hello")`是`Rust`来创建String类型的方法，hello是创建的字符串，在这里，s是这个字符串的所有者，当main函数执行完后，`s`会离开当前作用域，`Rust`会自动调用`String`的`drop`函数来进行销毁

```rs
fn main{
    let s = String::from("hello");
}
// 会自动调用函数来消耗字符串
```

2. 移动
   如下代码，`s`的所有权将会移动到 `s1`上，原变量`s`将无法访问

   ```rs
   fn main{
   let s = String::from("hello");
   let s1 =s;
   }
   ```

3. 借用

如上面的解释可以得出，如果直接将一个字符串的变量赋值给另一个变量，会带走它的所有权，如`let a = s;`

那如何操作这个字符串呢，这里就需要用到借用，借用分为不可变借用和可变借用：

- 不可变借用：允许多个不可以引用同时存在，但不能对值进行修改。可看成`读`
  ```rs
      let s = String::from("hello");
      let t = &s;// 通过 & 来进行借用
      println!("{}", t);
  ```
- 可变借用：允许一个可变引用存在，可以修改值，但在同一时间内不能有其他不可变引用或可变引用。可看成`写`
  ```rs
  let mut s =String::from("hello");
  let t = &mut s;
  t.push_str(", world");
  println!("{}", t);
  ```

4. 克隆
   可以通过`clone`方法得到其副本

   ```rs
   let s1 = String::from("hello");
   let s2 = s1.clone();
   ```

5. 与生命周期相关

   生命周期就是一个变量的存活范围：如下：

   ```rs
   fn main(){
       let s = "x";
       {
           let b ="x"
       }
       // 在这里 b 将会被销毁，它的生命周期就是{}这个区间
   }
   ```

   这样的话，rust就会避免悬挂引用，下面看个`c`代码，由于delete操作会把`ptr`弄成悬挂指针，导致访问错误

   ```c
   int *ptr = new int(10);
   delete ptr;
   *ptr = 20 // error
   ```

   在rust中如下代码会异常，编译器会在编译时检测到这一点，并给出错误。

   ```rs
   fn main() {
    let r; // 这里 `r` 是一个引用
    {
        let x = 10; // `x` 的作用域是内层块
        r = &x;     // `r` 引用了 `x`
    }  // `x` 超出作用域，此时它的内存已经被释放

    // 编译错误：`r` 是悬挂引用，因为 `x` 的生命周期结束了，而 `r` 还在引用它
    println!("{}", r);
   }

   // 正确使用如下
   fn main() {
    let x = 10;
    let r = &x;  // `r` 引用 `x`
    println!("{}", r);  // `r` 是有效的，因为 `x` 在 `r` 使用时是有效的
   }
   ```

### 值的复制

对于基本类型值的复制，`Rust`会直接`copy`一个新的值然后赋给变量（实现了`Copy`trait的类型都可以），这里就不涉及所有权的改变。基础变量类型的变量的值是储存在`栈`上。

```rust
let a = 1;
let b = a;
```

对于复合类型的复制，如下直接copy，不会像其他语言如js一样，`a`和`b`共同持有这个结构体对象的引用，在所有权的规则下会直接把这个对象的引用交给`b`，这时a就失去了对这个对象的控制。这类诸如`String`、，`Vec` 的类型是存储在`堆`上

```rust
struct Person {
    name: String, // 如果是&str则不会发生结构体的所有权改变
    age: i32
}

let a = Person {
    name: "xx".to_string(),
    age: 12
}

let b = a;
```

## 循环语法

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

## 模式匹配

### match

`match` 模式匹配，类型于`switch case`，格式如下：

```rust
match target {
    模式1 => 表达式1,
    模式2 => {
        语句1;
        语句2;
        表达式2
    },
    _ => 表达式3 // 默认匹配
}
```

1. 匹配基本类型

```rust
let num = 13;

match number {
    1 => println!("1"),
    13 => println!("13"),
    _ => println!('ohter')
}
```

2. 匹配枚举

```rust
enum MyEnum {
    A(i32),
    B(String),
    C,
}

let value = MyEnum::A(10);

match value {
    MyEnum::A(x) => println!("A with value: {}", x),
    MyEnum::B(s) => println!("B with string: {}", s),
    MyEnum::C => println!("C"),
}
```

3. 匹配结构体

```rust
struct Person {
    name: String,
    age: i32,
}

let person = Person {
    name: String::from("Alice"),
    age: 30,
};

match person {
    Person { name, age: 30 } => println!("{} is 30 years old.", name),
    Person { name, age } => println!("{} is {} years old.", name, age),
}
```

4. 守卫条件

```rust
let number = 5;

match number {
    n if n < 5 => println!("Less than 5"),
    n if n == 5 => println!("Equal to 5"),
    n if n > 5 => println!("Greater than 5"),
    _ => println!("Other"),
}
```

5. 多重模式匹配

```rust
let number = 7;

match number {
    1 | 3 | 5 | 7 => println!("Odd number"),
    2 | 4 | 6 | 8 => println!("Even number"),
    _ => println!("Other"),
}
```

6. 解构元组

```rust
let tuple = (3, 5);

match tuple {
    (3, x) => println!("First element is 3, second element is {}", x),
    _ => println!("Other tuple"),
}
```

### if let

`if let`用于只匹配一个模式时使用，是`match`的一种简化形式。

```rust
if let pattern = value {
    // 当 value 匹配 pattern 时，执行这个代码块
} else {
    // 如果 value 不匹配 pattern，执行这个代码块（可选）
}
```

## Option 、 Result

`Option` 和 `Result` 都是枚举，用于处理错误和空值。

### Option

`Option`用于表示一个值可能存在，也可能不存在。

```rust
enum Option<T>{
    Some(T),
    None
}
```

- Some(T) 表示某个值，类型为T
- None 表示没有值

Option 主要来处理空值，对应其他语言中的`null`等的处理。这个枚举可以直接使用，`Rust`会自动引入相关导入。使用这个`Option`一般结合`match`来使用，如下：

```rust
    fn find_item(v: Vec<i32>,item: i32) -> Option<i32>{
        for &i  in &v {
            if i == item {
                return Some(i);
            }
        }
        None
    }

    let v = Vec![1,2,3,4];
    match find_item(v, 3){
        Some(value) => println!("Found: {}", value),
        None => println!("Not found")
    }

```

采用链式调用，如使用`map`，存在值可继续操作，为`None`则短路

```rust
let x: Option<i32> = Some(5) //直接使用Some

let result = x.map(|v| v*2);
match result {
    Some(v) => println!("value is {}",v),
    None => println!("no value")
}
```

结合`if let`使用，直接取出值：

```rust
let num = Some(10)

if let Some(n) = num {
    println!("value is {}", n);
}
```

### Result

`Result` 用于表示操作是否成功，如果失败，提供错误的具体信息。格式如下：

```rust
enum Result<T, E> {
    Ok(T),
    Err(E)
}
```

- `Ok(T)`：表示操作成功，并携带类型为`T`的值
- `Err(E)`：表示操作失败，并携带类型为`E`的错误信息

`Result` 常用于那些可能失败的操作，如文件 I/O操作、网络请求、解析数据等。

如下用它来处理读取文件的结果

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file(file_path: &str) -> Result<String, io::Error>{
    let mut file = File::open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

match read_file("hello.txt"){
    Ok(contents) => println!("File contents: {}", contents),
    Err(e) => println!("Error reading file: {}", e)
}
```

其他可操作的方式和`Options`差不多

## 方法

通过关键字`impl`来为某个实例实现方法

```rust
struct Rectangle{
    width: u32,
    height: u32
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self * height
    }

    // 定义一个带有额外参数的方法
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    // 定义一个关联函数（没有 self 参数）
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}
```

使用上面的方法，通过点操作符（`.`）调用

```rust
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };

    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };

    println!("The area of rect1 is {} square pixels.", rect1.area());
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));

    let square = Rectangle::square(20);
    println!("Square is {}x{}", square.width, square.height);
}
```

### self

方法入参中`self`对应的是调用它的实例，有以下三种访问方式：

1. self 直接拿到所有权
2. &self 不可变引用访问实例
3. &mut self 可变引用访问实例

### 关联函数

没有`self`参数函数被称为*关联函数*。通常用于构造实例或其他与类相关的操作

```rust
impl Rectangle {
    fn new(width: u32, height: u32) -> Rectangle {
        Rectangle { width, height }
    }
}
```

使用它

```rust
let rect = Rectangle::new(30, 50)
```

## 泛型

泛型是一种强大的特性，允许定义具有多个类型参数的函数、结构体、枚举和方法。通过泛型，可以编写出更加通用、灵活和复用的代码。

### 泛型函数

- `T` 是泛型参数的名称，通常使用大写字母表示
- `T: PartialOrd` 是一个约束，表示泛型类型`T`必须实现`PartialOrd`（可比较大小）

```rust
fn max<T: PartialOrd>(a:T ,b:T) => T {
    if a > b {
        a
    }else {
        b
    }
}
```

使用

```rust
fn main() {
    println!("Max of 1 and 2: {}", max(1, 2));
    println!("Max of 1.0 and 2.0: {}", max(1.0, 2.0));
    println!("Max of 'a' and 'b': {}", max('a', 'b'));
}
```

### 泛型结构体

```rust
struct Point<T>{
    x: T,
    y: T
}
```

使用

```rust
fn main() {
    let integer_point = Point { x: 5, y: 10 };
    let float_point = Point { x: 1.0, y: 4.0 };

    println!("Integer Point: ({}, {})", integer_point.x, integer_point.y);
    println!("Float Point: ({}, {})", float_point.x, float_point.y);
}
```

### 泛型枚举

```rust
enum GenericEnum<T> {
    Value(T),
    Empty,
}

fn main() {
    let some_value = GenericEnum::Value(42);
    let no_value: GenericEnum<i32> = GenericEnum::Empty;

    match some_value {
        GenericEnum::Value(val) => println!("Value: {}", val),
        GenericEnum::Empty => println!("No value!"),
    }
}

```

### 泛型方法

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    // 泛型方法
    fn x(&self) -> &T {
        &self.x
    }
}

// 只针对特定类型实现方法
impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let integer_point = Point { x: 5, y: 10 };
    let float_point = Point { x: 3.0, y: 4.0 };

    println!("integer_point.x = {}", integer_point.x());
    println!("float_point distance from origin = {}", float_point.distance_from_origin());
}

```

### 泛型的约束

默认情况下，`Rust`的泛型参数是完全通用的，不会对类型做任何假设。但在某些场景下，我们需要对泛型施加约束。

1. 实现某个trait

```rust
fn print<T: std::fmt::Debug>(x: T){
    print("{:?}", x)
}
```

2. 多个 trait 约束

```rust
fn compare_and_print<T: PartialOrd + std::fmt::Debug>(a: T, b: T) {
    if a > b {
        println!("{:?} is greater than {:?}", a, b);
    } else {
        println!("{:?} is less than or equal to {:?}", a, b);
    }
}

```

3. `where` 语法

当约束较多时，可以使用 where 提高代码可读性：

```rust
fn compare_and_print<T>(a: T, b: T)
where
    T: PartialOrd + std::fmt::Debug,
{
    if a > b {
        println!("{:?} is greater than {:?}", a, b);
    } else {
        println!("{:?} is less than or equal to {:?}", a, b);
    }
}

```

## 特征

关键字 `trait`，特征是一种定义共享行为的方式，类似于其他语言中的接口（interface）。它定义了一组方法签名，具体实现则由结构体或枚举来完成。

定义特征，包含它的方法签名和默认实现。其中方法可以是带实现的，也可以是抽象的

```rust
pub trait TraitName {
    // 抽象方法（无默认实现）
    fn method_without_default(&self);

    // 带有默认实现的方法
    fn method_with_default(&self) {
        println!("This is the default implementation.");
    }
}
```

为类型实现特征

```rust
pub trait Greet {
    fn greet(&self);
}

struct Person {
    name: String,
}

impl Greet for Person {
    fn greet(&self) {
        println!("Hello, my name is {}!", self.name);
    }
}

fn main() {
    let person = Person {
        name: "Alice".to_string(),
    };
    person.greet(); // 输出: Hello, my name is Alice!
}
```

### 动态分发

`Rust`支持**静态分发**和**动态分发**

1. 静态分发：通过泛型`T: Trait`使用特征，编译时就确定具体的类型，性能更高
2. 动态分发：通过特征对象（`dyn Trait`）实现，允许在运行时选择方法的具体实现

特征对象

特性对象可以用`Box<dyn Trait>` 或 `&dyn Trait` 表示，适合需要储存不同类型的值但希望它们有相同行为的情况

```rust
pub trait Draw {
    fn draw(&self);
}

struct Circle;
struct Square;

impl Draw for Circle {
    fn draw(&self) {
        println!("Drawing a circle!");
    }
}

impl Draw for Square {
    fn draw(&self) {
        println!("Drawing a square!");
    }
}

fn draw_object(object: &dyn Draw) {
    object.draw();
}

fn main() {
    let circle = Circle;
    let square = Square;

    draw_object(&circle); // 输出: Drawing a circle!
    draw_object(&square); // 输出: Drawing a square!
}
```

### 特征的继承

一个特征可以继承另一个特征，要求实现子特征的类型必须先实现父特征

```rust
// 定义基础特征display
pub trait Display {
    fn display(&self);
}
// 继承上面的基础特征display
pub trait AdvancedDisplay: Display {
    fn advanced_display(&self);
}

struct Item;

impl Display for Item {
    fn display(&self) {
        println!("Basic Display");
    }
}
// 为了实现这个特征，先在上面实现display
impl AdvancedDisplay for Item {
    fn advanced_display(&self) {
        println!("Advanced Display");
    }
}
```

### 标准库中常用的特征

1. std::fmt::Debug
   用于调试输出的特征，支持 println!("{:?}", value) 格式。

2. std::fmt::Display
   用于用户友好输出的特征，支持 println!("{}", value) 格式。

3. Clone 和 Copy
   提供深拷贝和浅拷贝的能力。

4. PartialEq 和 PartialOrd
   用于比较相等性和顺序的特征。

5. Iterator
   用于迭代器实现

## 集合

### Vec<T>

`Vec<T>` 是`Rust`中最常见的动态数组类型，允许你存储一系列的元素，元素可以是任何类型`T`。

特点：

- 存储在堆上
- 可动态增长
- 支持索引操作
- 支持添加、删除元素

创建和使用：

```rust
fn main(){
    let mut v:Vec<i32> = Vec::new();
    v.push(1); // 向 Vec 中添加元素
    v.push(2);
    v.push(3);

    println!("{:?}", v); // 打印 [1, 2, 3]

    // 通过索引访问元素
    println!("{}", v[0]); // 输出: 1

    // 遍历元素
    for i in &v {
        println!("{}", i);
    }
}
```

切片访问：

```rust
let v = vec![1, 2, 3, 4];
let slice = &v[1..3];
```

安全性：

- `Rust`会运行时保证对Vec的越界访问时非法的
- `Vec`支持按值传递，因此可以方便的转移所有权

### String

`String` 是一个可扩展的、动态分配的字符串类型。它与`&str`不同，后者是一个不可变 引用，前者是一个拥有所有权的可变字符串

创建和使用

```rust
fn main() {
    let mut s = String::new(); // 创建空字符串

    s.push_str("Hello"); // 向 String 中追加字符串
    s.push(' ');         // 追加字符
    s.push_str("World!");

    println!("{}", s); // 输出: Hello World!
}

```

从切片创建字符串

```rust
let s = String::from("Hello, Rust!");
println!("{}", s); // 输出: Hello, Rust!
```

与`&str`的转换

- `&String` 可以转换为`&str`，因为`String`包含了一个`&str`
- `&str`无法直接转换为`String`，需要使用`to_string()`或`String::from()`

### HashMap<K, V>

`HashMap`是一个经典集合类型，在`Rust`中也是如此。

特点：

- 储存正在堆上
- 键值对（`K`，`V`）是任意类型，通常用于储存数据对
- 键必须实现`Eq`和`Hash`特征，值没有这些要求

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new(); // 创建空的 HashMap

    map.insert("key1", 10);
    map.insert("key2", 20);

    // 访问值
    if let Some(value) = map.get("key1") {
        println!("The value for 'key1' is {}", value); // 输出: The value for 'key1' is 10
    }

    // 遍历键值对
    for (key, value) in &map {
        println!("{}: {}", key, value);
    }
}
```

常用方法：

- `insert(key, value)`：插入键值对
- `get(key)`：获取键对应的值
- `remove(key)`：删除键对应的值
- `contains_key(key)`：检查键是否存在
- `keys()`和`values()`：返回所有的键和值

自动处理哈希冲突：

- 哈希表通过哈希函数将键映射到一个索引位置，处理冲突的一种方法是链表法

### HashSet<T>

`HashSet`是一个无重复元素的集合，基于哈希映射实现，它的作用是储存不重复的值，类似于数学中的集合。

特点：

- 元素是无序的
- 元素必须实现`Eq`和`Hash`特征
- 不允许重复元素

使用

```rust
use std::collections::HashSet;

fn main() {
    let mut set = HashSet::new(); // 创建空的 HashSet

    set.insert(1);
    set.insert(2);
    set.insert(3);

    // 尝试插入重复元素
    set.insert(2); // 返回 false，因为 2 已经存在

    // 遍历元素
    for val in &set {
        println!("{}", val);
    }
}

```

常用方法：

- `insert(value)`：插入元素
- `remove(value)`：删除元素
- `contains(value)`：检查是否包含某元素
- `len()`：放回集合中元素的数量

### BTreeMap<K, V>

`BTreeMap`是另一种映射类型，和`HashMap`不同，它按键的顺序储存元素（基于红黑树实现）

特点：

- 键值对按键顺序
- 性能上，`BTreeMap`比`HashMap`适合进行范围查询

使用：

```rust
use std::collections::BTreeMap;

fn main() {
    let mut map = BTreeMap::new();

    map.insert(2, "two");
    map.insert(1, "one");
    map.insert(3, "three");

    // 遍历元素，按键排序
    for (key, value) in &map {
        println!("{}: {}", key, value);
    }
}

```

### BTreeSet<T>

`BTreeSet` 用于储存唯一元素的集合，与`HashSet`类似，但是基于 二叉树实现的，元素按顺序排列

特点：

- 元素是有序的
- 不允许有重复的元素

使用：

```rust
use std::collections::BTreeSet;

fn main() {
    let mut set = BTreeSet::new();

    set.insert(2);
    set.insert(1);
    set.insert(3);

    // 遍历元素，按顺序排序
    for val in &set {
        println!("{}", val);
    }
}

```

## 生命周期

`Rust`的生命周期是其内存管理系统的一部分，目的是确保内存安全而不需要垃圾回收器。生命周期用于描述引用的有效范围，确保在程序运行时引用指向有效的内存地址，避免出现悬空引用和数据竞争等错误

在`Rust`中，生命周期由编译器静态推断，大部分情况下开发者不需要手动显示声明声明周期，但理解它的基本概念是学习`Rust`的一个重要部分。

### 什么是生命周期

生命周期是`Rust`编译器用来跟踪每个引用（`&T`）的有效范围的方式。`Rust`编译器确保在程序运行时，任何引用都不能指向无效内存，从而避免了`悬空引用`和`内存泄漏`

- 悬空引用：指向已释放内存的引用
- 内存泄漏：指分配的内存未被正确释放

总体来说，为了确保每一个引用都是有意义的

### 生命周期的基本规则

1. 每个引用都有一个生命周期
2. 引用必须始终指向有效的数据
3. 编译器会通过生命周期推断来确引用在其生命周期内有效，不会出现悬空引用

### 生命周期的标注

`Rust`使用生命周期标注来显示的指定引用的生命周期。当一个函数接受或返回引用时，生命周期标注告诉编译器引用的生命周期是如何传递的。

生命周期标注的语法是：`'a`，`'a`是生命周期的名称。生命周期标注一般出现在函数签名中

```rust
fn example<'a>(x: &'a str) -> &'a str{
    x
}
```

- `x: &'a str` 表示x是一个生命周期为`'a`的引用，类型为`str`
- `-> &'a str` 表示返回一个生命周期为`'a`的引用，类型为`str`
- `<'a>` 为函数的生命周期生命
- `'a` 就是生命周期标注，告诉编译器`x`的返回的引用有相同的生命周期

### 为什么需要生命周期标注

生命周期标注用于告诉`Rust`编译器，哪些引用的生命周期是相同的，哪些是不同的。如下，编译器无法推断`y`和`x`的生命周期直接的关系，如果x或者y的生命周期比这个函数的生命周期还短，就会返回一个`空指针`，又或者x和y不对等就会从一个空指针处取值，都会造成异常

```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

使用生命周期标注后就可以正常运行

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

### 生命周期和结构体

结构体中也有这个概念，在一定情况下也需要进行生命周期标注，告诉`Rust`该引用的生命周期与结构体实例的生命周期之间的关系：只要为结构体中的`每一个引用标注上生命周期即可`。

```rust
struct Book<'a>{
    title: &'a str,
    author: &'a str
}
```

### 静态生命周期

在`Rust`中，静态生命周期（`'static`）是一个特殊的生命周期，它表示一个引用的有效范围跨越整个程序的生命周期，即从程序的开始到程序结束。静态生命周期的引用通常用于表示程序的常量数据或全局数据

特点：

1. 全局有效性：`'static`生命周期的引用时全局有效的，从程序开始到结束
2. 常量和静态变量： `Rust`中的常量（`const`）和静态变量（`static`）总是具有`'static`生命周期
3. 内存分配：具有`'static`生命周期的引用通常指向程序的常量池或全局数据区域，不会随函数或作用域的结束而释放

下面的字符切片`s`将会在程序的整个生命周期内都是有效的

```rust
fn main() {
    let s: &'static str = "Hello, Rust!";
    println!("{}", s);
}
```
