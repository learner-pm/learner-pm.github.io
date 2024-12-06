# 特征

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

## 动态分发

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

## 特征的继承

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

## 标准库中常用的特征

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
