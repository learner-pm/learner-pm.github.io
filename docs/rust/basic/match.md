# 模式匹配

## match

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

## if let

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
