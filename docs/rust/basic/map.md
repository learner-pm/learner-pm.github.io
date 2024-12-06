# 集合

## Vec\<T\>

`Vec\<T\>` 是`Rust`中最常见的动态数组类型，允许你存储一系列的元素，元素可以是任何类型`T`。

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

## String

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

## HashMap<K, V>

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

## HashSet<T>

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

## BTreeMap<K, V>

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

## BTreeSet<T>

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
