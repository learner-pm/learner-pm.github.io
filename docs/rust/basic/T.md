# 泛型

泛型是一种强大的特性，允许定义具有多个类型参数的函数、结构体、枚举和方法。通过泛型，可以编写出更加通用、灵活和复用的代码。

## 泛型函数

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

## 泛型结构体

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

## 泛型枚举

<pre v-pre>
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
</pre>

## 泛型方法

使用`<>`加以约束

<pre v-pre>
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
</pre>

## 泛型的约束

默认情况下，`Rust`的泛型参数是完全通用的，不会对类型做任何假设。但在某些场景下，我们需要对泛型施加约束。

1. 实现某个trait

```rust
fn print<T: std::fmt::Debug>(x: T){
    print("{:?}", x);
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
