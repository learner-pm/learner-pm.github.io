# 智能指针

智能指针是Rust中的一个非常重要的概念，它们不仅允许我们更方便的管理内存，还提供了所有权、借用、内存安全等特性。智能指针可以理解为包装类型，它们不仅仅包含数据的指针，还会附带一些管理内存或其他资源的逻辑

在Rust中，常见的智能指针包括`Box`、`Rc`、`Arc`、`RefCell`和`Mutex`等

## Box

在Rust中，`Box<T>`是一种堆分配的智能指针，它将数据存储在堆上，而不是栈上。这使得`Box`在处理较大或动态大小的数据时非常有用。`Box`还负责内存的自动管理，当`Box`离开作用域时，它所指向的堆内存会被自动释放

### 基本概念

`Box<T>`是一种所有权类型，它将数据指向堆上的内存。在Rust中，栈上的数据在函数退出时会自动销毁，但堆上的数据则需要显式地释放。`Box` 会确保在不再需要时，堆上的数据被正确的释放，避免内存泄漏

- 用途

  - 将数据存储在堆上，从而避免栈溢出
  - 动态大小类型`DST`，如`str`等不能直接储存正在栈上，必须使用`Box`来储存
  - 需要将值的所有权转移给堆的数据时使用

- 创建一个`Box`

```rust
fn main() {
    let b = Box::new(5);  // 将值 5 放入堆上
    println!("Value in Box: {}", b);  // 打印 Box 内部的值
}

```

- 所有权

```rust
fn main() {
    let b = Box::new(5);  // `b` 的所有权在这里
    let c = b;  // `b` 的所有权被转移给了 `c`
    // println!("{}", b);  // 编译错误，因为 `b` 已经不再拥有所有权
}

```

- 传递`Box<T>`

```rust
fn takes_ownership(boxed_value: Box<i32>) {
    println!("{}", boxed_value);
}

fn main() {
    let b = Box::new(10);
    takes_ownership(b);  // 将所有权转移给函数
    // println!("{}", b);  // 编译错误，`b` 的所有权已被转移
}

```

- `Box` 和 `Sized`。对于动态大小类型，它们通常需要放在`Box`中

```rust
fn main() {
    let b = Box::new("hello".to_string());  // `String` 是 DST
    println!("{}", b);
}

```

### 使用场景

1. 递归类型
   在某些场景下，如递归数据结构（如树或链表），Rust不能再栈上存储递归类型，因为其大小是递归的，无法在编译时确定。此时，可以使用`Box`来指向递归类型的值

   ```rust
   struct List {
    value: i32,
    next: Option<Box<List>>,
    }

    impl List {
        fn new(value: i32) -> Self {
            List {
                value,
                next: None,
            }
        }

        fn append(&mut self, value: i32) {
            match self.next {
                Some(ref mut next) => next.append(value),
                None => self.next = Some(Box::new(List::new(value))),
            }
        }
    }

    fn main() {
        let mut list = List::new(1);
        list.append(2);
        list.append(3);

        println!("List head: {}", list.value);  // 1
    }

   ```

## Deref

在Rust中，`Deref`是一个非常重要的特征，它用于实现自动解引用，使得类型的值可以像原始类型一样使用。在某些情况下，Rust会自动调用`Deref` trait提供的方法来解引用一个智能指针或其他类型的封装类型，允许你像操作原始数据一样操作这些类型

### 定义

Deref trait 定义了一个类型到另一个类型的引用转换。通过实现`Deref`，你可以将一个智能指针或类似的类型自动解引用成另一个类型，通常是底层类型的引用。

`Deref`的定义如下：

```rust
use std::ops::Deref;

trait Deref {
    type Target;

    fn deref(&self) -> &Self::Target;
}

```

- Target 是目标类型，表示解引用后得到的类型
- deref 方法返回对目标类型的引用

### 用途

Deref 允许我们实现类型的解引用行为，通常用于智能指针或者某些封装类型。Rust 提供了许多类型（如 Box、Rc、Arc 等）实现了 Deref，这使得这些类型的实例能够像直接使用底层类型一样工作。

1. box类型的解引用
   Box 是一个常见的智能指针，它在堆上存储数据，并提供对数据的所有权。通过 Deref trait，Box<T> 可以让你像直接使用 T 一样使用它内部的值。

   ```rust
   use std::ops::Deref;

   fn main() {
       let b = Box::new(5);

       // 自动解引用 Box 以访问内部的值
       println!("{}", *b);  // 输出: 5
   }

   ```

### 解引用

当你使用`Deref`时，有时Rust会自动解引用。这通常发生在你需要使用某个类型的值，但该类型本身不是你直接需要的类型时。

例如：假设你有一个方法接受一个类型为`T`的引用，但你传入了一个实现了`Deref`的类型，Rust会自动调用`deref`方法，解引用并将底层类型传递给方法

```rust
use std::ops::Deref;

struct MyType {
   value: i32,
}

impl MyType {
   fn print_value(&self) {
       println!("{}", self.value);
   }
}

fn main() {
   let my_box = Box::new(MyType { value: 42 });

   // 自动解引用 Box<MyType>，调用 print_value
   my_box.print_value();  // 输出: 42
}

```

### DerefMut Trait

`Deref`还有一个变种叫做`DerefMut`，它允许进行可变的解引用。这对于可变智能指针非常有用，允许你修改内部数据

```rust
use std::ops::DerefMut;

fn main() {
    let mut b = Box::new(5);

    // 自动解引用并允许修改 Box 内部的数据
    *b += 1;

    println!("{}", b);  // 输出: 6
}

```

### 自定义 Deref 实现

还可以为自定义类型实现`Deref`。假如，假设你有一个结构体`MyBox`，你可以实现`Deref`来让它表现得像一个引用类型，从而允许类似于解引用的操作

```rust
use std::ops::Deref;

struct MyBox<T> {
    value: T,
}

impl<T> MyBox<T> {
    fn new(value: T) -> Self {
        MyBox { value }
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.value
    }
}

fn main() {
    let my_box = MyBox::new(5);

    // 自动解引用 MyBox<i32>
    println!("{}", *my_box);  // 输出: 5
}

```

需要注意的是，当你实现了`Deref`和`DerefMut`时，还需要考虑`Drop`trait。因为智能指针可能会在某些时候自动解引用，Rust会尝试在适当时机处理所有权

### 函数和方法中的隐式 Deref 转换

对于函数和方法，Rust提供了一个隐式`Deref`转换。如果一个类型实现了`Deref`特征，那它的引用在传给函数或方法时，会根据参数签名来决定是否进行隐式的`Deref`转换

```rust
fn main() {
    let s = String::from("hello world");
    display(&s)
}

fn display(s: &str) {
    println!("{}",s);
}
```

以上代码有下面几点：

- `String`实现了`Deref`特征，可以在需要时自动被转换为`&str`类型
- `&s`是一个`&String`类型，当它被转给`display`函数时，自动通过`Deref`转换成了`&str`
- 必须使用`&s`的方式来触发`Deref`

还可以进行连续的隐式`Deref`转换，如下

```rust
fn main() {
    let s = MyBox::new(String::from("hello world"));
    display(&s)
}

fn display(s: &str) {
    println!("{}",s);
}
```

这里使用了之前的自定义的智能指针`MyBox`，并将其通过连续的隐式转换为`&str`类型

## Drop

`Drop`是`Rust`中非常重要的一个trait，它用于控制类型的清理行为，特别是在对象的生命周期结束时，自动执行一些资源释放操作。与其他语言中的析构函数类似，`Drop` Trait 是Rust中
管理内存和资源的一个关键机制

### 定义

`Drop` trait 允许你在值被丢失时的自定义行为。当一个值的生命周期结束并且它将被销毁时，Rust会自动调用`Drop`trait的drop方法。通常情况下，这个方法用于释放资源，如关闭文件、释放内存、
断开网络等

```rust
trait Drop {
    fn drop(&mut self);
}

```

### 自动调用

`Drop`trait的`drop`方法并不会显示地在代码中调用，而是由Rust的所有权系统自动调用。当对象的所有者离开作用域时，‘
Rust会自动调用该类型的`drop`方法。这通常在变量超出作用域时发生，或者手动调用`std::mem::drop()`时

### 应用

假设我们有一个类型`MyStruct`，我们希望在它的生命周期结束时执行一些自定义的资源清理工作

```rust
struct MyStruct;

impl Drop for MyStruct {
    fn drop(&mut self) {
        println!("MyStruct has been dropped!");
    }
}

fn main() {
    let _s = MyStruct;
    // 当 _s 超出作用域时，自动调用 drop 方法
}

```

### 手动调用 drop

尽管Rust会在变量超出作用域时自动调用`drop`方法，但你也可以显式地调用`std::mem:drop()`函数来提前丢弃一个值。这会
强制Rust在当前作用域中调用`drop`，并释放该值所占的资源

```rust
use std::mem;

struct MyStruct;

impl Drop for MyStruct {
    fn drop(&mut self) {
        println!("MyStruct has been dropped!");
    }
}

fn main() {
    let s = MyStruct;

    // 手动调用 drop 方法
    mem::drop(s);  // 这会触发 drop 方法的调用

    // s 已经被丢弃，不能再使用
}

```

- 自动调用
  当一个变量超出作用域时，Rust会自动调用该变量的`drop`方法。这是自动内存管理的一部分，类似于其他语言中的
  垃圾回收机制，但Rust不使用垃圾回收，而是基于所有权和借用系统来管理资源
- 手动调用
  有时你可能希望在某个时刻显式地释放资源，这时可以使用`std:mem:drop()`来强制调用`drop`方法。需要注意的是
  `drop`被调用后，值将不再可用

### 于所有权相关

Rust的所有权系统与`Drop`密切相关。当一个值的所有权转移时，原来所有者的`drop`方法会在其生命周期结束时被调用。
Rust确保每个资源在生命周期结束时都会正确地释放，避免了内存泄漏

```rust
struct MyStruct;

impl Drop for MyStruct {
    fn drop(&mut self) {
        println!("MyStruct has been dropped!");
    }
}

fn main() {
    let s1 = MyStruct;
    let s2 = s1;  // 所有权转移

    // s1 在这里不可用，无法访问它
    // println!("{:?}", s1); // 这将导致编译错误

    // s2 离开作用域时，`drop` 方法会被调用
}

```

### drop和copy

有些类型时Copy类型（如基本数值类型`i32`，`f64`等），它们会在赋值时进行按位复制。对于这些类型，Rust不会自动调用`drop`方法，
因为这些类型的值没有明确的`所有权`，它们可以被复制而无需担心资源管理问题

```rust
#[derive(Copy, Clone)]
struct CopyType;

fn main() {
    let x = CopyType;
    let y = x; // 按位复制

    // x 和 y 都是有效的，`drop` 不会被调用
}

```

## Rc

`RC`即是`Reference Counted`，是Rust中标准库中提供的一个智能指针类型，用于在多个所有者之间共享数据。`Rc`允许你
拥有一个数据的多个所有者，但不像`box`一样只有一个所有者能拥有该数据。Rc 使用引用计数的方式来追踪数据有多少个所有者，当没有任何所有者时，数据会被自动释放。

应用场景

- 共享数据：当你需要多个部分共享同一份数据时（例如，在树状结构中，每个节点可能指向多个子节点）。
- 不可变数据共享：Rc 只适用于数据不可变的场景。如果你需要可变数据共享，可以考虑使用 Rc<RefCell<T>>。

### 使用

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(5); // 创建一个 Rc 智能指针，指向值 5
    let b = Rc::clone(&a); // 增加 Rc 的引用计数，b 也指向相同的值

    println!("a: {}", a); // 输出 a: 5
    println!("b: {}", b); // 输出 b: 5

    // `a` 和 `b` 都指向相同的值，当它们离开作用域时，值会被销毁
}

```

在这个例子中：

- `a`是一个`Rc`指针，它持有对值`5`的所有权
- `b`通过调用 Rc::clone(&a) 增加了引用计数，b 和 a 都指向相同的数据。

`Rc::clone` 不是按值复制数据，而是简单地增加引用计数。

### 引用计数

Rc 内部维护了一个计数器，这个计数器跟踪当前有多少个 Rc 指针指向同一个数据。当引用计数为 0 时，数据就会被销毁。

```Rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(5); // 创建一个 Rc 智能指针，指向值 5
    println!("Rc count after creation: {}", Rc::strong_count(&a)); // 1

    let b = Rc::clone(&a); // 增加 Rc 的引用计数
    println!("Rc count after clone: {}", Rc::strong_count(&a)); // 2

    {
        let c = Rc::clone(&a); // 再增加一个引用计数
        println!("Rc count after another clone: {}", Rc::strong_count(&a)); // 3
    } // c 离开作用域，引用计数减少

    println!("Rc count after c goes out of scope: {}", Rc::strong_count(&a)); // 2
}

```

### 内存管理

Rc 使用 引用计数 来管理内存。当最后一个 Rc 指针被销毁时，它所指向的堆内存会被自动释放。这种方式使得多处共享数据变得可能，而无需手动管理内存。

引用计数工作原理：

- 每次调用 Rc::clone(&x) 时，x 的引用计数增加。
- 当 Rc 离开作用域时，计数减少。
- 当引用计数为 0 时，Rc 所管理的内存会被释放。

### 与线程

Rc 不是线程安全的。它是专门为单线程环境设计的智能指针。如果你需要在多线程环境中共享数据，你应该使用 Arc（原子引用计数）。Arc（Atomic Reference Counted）是 Rc 的并发版本，它在内部使用原子操作来确保线程安全。

### 不可变数据共享

Rc 默认是不可变的，也就是说，它本身提供对数据的不可变借用。如果你需要可变数据共享，可以使用 Rc<RefCell<T>>。RefCell 提供了 内部可变性，允许通过可变引用修改数据。

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let a = Rc::new(RefCell::new(5)); // 创建一个 RefCell 包裹的 Rc 智能指针

    // 修改数据
    *a.borrow_mut() = 10;

    println!("a: {}", a.borrow()); // 输出 a: 10
}

```

### 与Drop

Rc 使用引用计数来管理内存。当引用计数为 0 时，Rc 会自动释放堆上分配的数据。当一个 Rc 智能指针被丢弃时，Rust 会自动调用 Drop 方法释放其管理的内存

```rust
use std::rc::Rc;

struct MyStruct;

impl Drop for MyStruct {
    fn drop(&mut self) {
        println!("MyStruct dropped!");
    }
}

fn main() {
    let my_data = Rc::new(MyStruct); // 创建一个 Rc 智能指针，指向 MyStruct

    {
        let _clone = Rc::clone(&my_data); // 引用计数增加
    } // _clone 离开作用域，引用计数减少

    // 当 my_data 离开作用域时，drop 被调用
}

```
