# 方法

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

使用上面的方法，通过点操作符（`.`）调用。

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
    println!("The area of rect1 is {} square pixels.", rect1.area())
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2))
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3))
    let square = Rectangle::square(20);
    println!("Square is {}x{}", square.width, square.height);
}
```

## self

方法入参中`self`对应的是调用它的实例，有以下三种访问方式：

1. self 直接拿到所有权
2. &self 不可变引用访问实例
3. &mut self 可变引用访问实例

## 关联函数

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
