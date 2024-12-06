## 类型

## 标量类型

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

## 复合类型

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
