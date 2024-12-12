# 迭代器

迭代器是Rust中一个非常强大的概念，它是用于按顺序访问集合中的元素的一种对象。迭代器提供了一种抽象，使得你可以在没有显式索引的情况下，逐个访问集合中的元素。Rust 的标准库为集合类型提供了迭代器的实现，这使得迭代器成为处理数据的一种高效、灵活和表达式简洁的方式。

## 基本概念

在Rust中，迭代器是实现了`Iterator`特征的类型。`Iterator`特征定义了迭代器的基本行为，主要包含两个核心的方法：

- `next()`：放回迭代器的下一个元素。每次调用`next()`时，迭代器放回一个`Option<T>`，如果没有更多的元素，则返回`None`，否则放回`Some(T)`
- `size_hint()`：提供一个迭代器中剩余元素的估计数量。

## 使用

一个迭代器的基本用法是通过`next()`方法逐个获取元素。如Vec和数组

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let mut iter = numbers.into_iter(); // 创建迭代器

    while let Some(number) = iter.next() {
        println!("{}", number); // 按顺序打印每个元素
    }
}

```

## 迭代器链

Rust的迭代器设计非常强大，它支持链式调用。你可以通过多次调用迭代器的方法组合来进行复杂的操作，例如过滤、映射、排序等

Rust的迭代器通常是惰性求值的，这意味着方法调用不会立即执行，而是放回一个新的迭代器，直到你最终调用`.collect()`、`.for_each()`或类型方法来触发计算

链式操作

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let result: Vec<i32> = numbers.into_iter()
                                  .filter(|&x| x % 2 == 0)  // 过滤出偶数
                                  .map(|x| x * x)           // 对偶数平方
                                  .collect();               // 收集结果到 Vec

    println!("{:?}", result); // 输出: [4, 16]
}

```

在这个例子中，使用了链式调用来过滤偶数并将其平方。`filter`和`map`都是惰性求值操作，只有在最终调用`collect()`时才会真正执行

## 常用方法

1. map：将闭包应用于每个元素，返回一个新的迭代器，元素变换后的结果

```rust
let numbers = vec![1, 2, 3];
let result: Vec<i32> = numbers.into_iter().map(|x| x * 2).collect();
println!("{:?}", result); // 输出: [2, 4, 6]

```

2. filter：根据给定的条件筛选元素，放回一个新的迭代器，包含所有符合条件的元素

```rust
let numbers = vec![1, 2, 3, 4, 5];
let even_numbers: Vec<i32> = numbers.into_iter().filter(|&x| x % 2 == 0).collect();
println!("{:?}", even_numbers); // 输出: [2, 4]

```

3. fold：将迭代器的元素结合成一个值，通常用来做累加、累乘等操作，`fold`接受一个初始值和一个闭包，在每一步迭代中将元素与累积值进行操作

```rust
let numbers = vec![1, 2, 3, 4, 5];
let sum: i32 = numbers.into_iter().fold(0, |acc, x| acc + x);
println!("{}", sum); // 输出: 15

```

4. for_each：对每个元素执行一个给定的操作，通常用于副作用

```rust
let numbers = vec![1, 2, 3];
numbers.into_iter().for_each(|x| println!("{}", x)); // 输出: 1 2 3

```

5. take：从迭代器中获取前`n`个元素，返回一个新的迭代器

```rust
let numbers = vec![1, 2, 3, 4, 5];
let first_three: Vec<i32> = numbers.into_iter().take(3).collect();
println!("{:?}", first_three); // 输出: [1, 2, 3]

```

6. skip：跳过迭代器的前`n`个元素

```rust
let numbers = vec![1, 2, 3, 4, 5];
let skip_first_two: Vec<i32> = numbers.into_iter().skip(2).collect();
println!("{:?}", skip_first_two); // 输出: [3, 4, 5]

```

7.  all 和 any：检查是否满足条件

    - all：检查是否所有元素都满足条件
    - any：检查是否任何一个元素满足条件

      ```rust
      let numbers = vec![1, 2, 3, 4, 5];
      let all_even = numbers.iter().all(|&x| x % 2 == 0);
      let any_even = numbers.iter().any(|&x| x % 2 == 0);
      println!("All even: {}", all_even); // 输出: All even: false
      println!("Any even: {}", any_even); // 输出: Any even: true

      ```

## 惰性和激活

Rust 的迭代器采用惰性求值的策略，意味着方法如 map()、filter() 等只会返回新的迭代器，它们不会立即执行操作。直到你调用诸如 collect()、for_each() 等方法时，才会激活并执行实际操作。

```rust
let numbers = vec![1, 2, 3, 4, 5];
let iter = numbers.into_iter().map(|x| x * 2); // 这里只创建了一个新的迭代器
// 此时 map 尚未执行
let result: Vec<i32> = iter.collect(); // 执行 map 操作并收集结果
println!("{:?}", result); // 输出: [2, 4, 6, 8, 10]

```

## IntoIterator 特征

在`Rust`中，`IntoIterator`特征用于将一个集合类型（如`Vec`，`String`，`HashMap`等）转换成一个可以消耗其所有元素的迭代器。这个特征定义了如何将一个值转换为迭代器，从而可以通过`into_iter()`方法来获取该集合的迭代器。

`IntoIterator`特征有两个主要的实现：

1. 对于拥有所有权的类型（`Vec<T>`、`String`等），它允许通过调用`into_iter()`将集合中的元素转移到迭代器中，消耗集合本身
2. 对于不可变的借用类型，它运行通过调用`into_iter（）`获取一个迭代器，但迭代器的元素是不可变借用

### 定义

```rust
pub trait IntoIterator {
    type Item;
    type IntoIter: Iterator<Item = Self::Item>;

    fn into_iter(self) -> Self::IntoIter
}
```

- `Item`：迭代器返回的元素类型
- `IntoIter`：实现了`Iterator`特征的迭代器类型
- `into_iter()`：将值转化为迭代器的方法

### 激活

有以下三种可以激活它的方法，将其转换为迭代器

- into_iter 会夺走所有权
- iter 是借用
- iter_mut 是可变借用

## Iterator 特征

`Iterator`特征是用于迭代集合元素的特征，定义了一个对象如何按顺序返回集合中的每个元素。任何实现了`Iterator`特征的类型都可以通过调用`.next()`方法按顺序获取集合中的元素

### 实现

```rust
struct MyIterator {
    current: i32,
    end: i32
}

impl MyIterator {
    fn new(start: i32, end: i32) -> Self {
        MyIterator { current: start, end}
    }
}

impl Iterator for MyIterator {
    type Item = i32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current < self.end {
            let result = self.current;
            self.current += 1;
            Some(result)
        } else {
            None
        }
    }
}

fn main() {
    let iter = MyIterator::new(0, 3);
    for num in iter {
        println!("{}", num);
    }
}

```

在这个例子中

- `MyIterator`是一个自定义的迭代器，它从`current`开始迭代，直到`end`
- `Iterator`特征的实现中，`next()`方法会返回当前元素并将`current`增加，直到达到`end`时返回`None`

### `Iterator`和`IntoIterator`对比

- `Iterator`是用来迭代集合的，它通过`next()`放回逐个放回元素
- `IntoIterator`是用来将集合转换为迭代器的特征，它通过`into_iter()`方法把集合转换为一个消耗其所有权的迭代器
- Iterator 是用于提供迭代能力的，而 IntoIterator 是用于提供转换能力的。
- 要实现 Iterator，需要实现 next() 方法；而要实现 IntoIterator，需要实现 into_iter() 方法

`Iterator` 就是迭代器特征，只有实现了它才能称为迭代器，才能调用 `next`。而 `IntoIterator` 强调的是某一个类型如果实现了该特征，它可以通过 `into_iter`，`iter` 等方法变成一个迭代器。

## 消费者与适配器

### 消费者适配器

只要迭代器上的某个方法`A`在其内部调用了`next`方法，那么`A`就被称为消费性适配器：因为`next`方法会消耗掉迭代器上的元素，所有方法`A`的调用也会消耗掉迭代器上的元素

一个例子是`sum`方法，它会拿走迭代器的所有权，然后通过不断调用`next`方法对里面的元素进行求和

```rust
fn main() {
    let v1 = vec![1, 2, 3];
    let v1_iter = v1.iter();
    let total: i32 = v1_iter.sum();
    assert_eq!(total, 6);

    // v1_iter 是借用了 v1，因此 v1 可以照常使用
    println!("{:?}",v1);

    // 以下代码会报错，因为 `sum` 拿到了迭代器 `v1_iter` 的所有权
    // println!("{:?}",v1_iter);
}
```

`sum` 源码

```rust
fn sum<S>(self) -> S
    where
        Self: Sized,
        S: Sum<Self::Item>,
    {
        Sum::sum(self)
    }


```

### 迭代器适配器

同消费者适配器对比，迭代器适配器是会返回一个新的迭代器

与消费者适配器不同，迭代器适配器是惰性的，意味着你需要一个消费者适配器来收尾，最终将迭代器转换成一个具体的值：

```rust
let v1: Vec<i32> = vec![1, 2, 3];

let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();

assert_eq!(v2, vec![2, 3, 4]);
```

#### collect

https://fitgirl-repacks.site/dragon-ball-sparking-zero/#comment-6604653007

`collect`方法是一个消费者适配器，使用它可以将一个迭代器中的元素收集到指定类型中。在上面代码中，我们将v2标注了`Vec<_>`类型，就是为 了告诉`collect`：请把迭代器中的元素消费掉，让后把值收集成`Vec<_>`类型，使用`_`，编译器会帮我们自动推导其类型。

定义如下：

```rust
pub fn collect<B>(self) -> B
where
    B: FromIterator<Self::Item>,

```

- self：迭代器本身
- B：返回的目标类型，它 必须实现`FromIterator<Self::Item>`，即可以从迭代器中收集元素并构造模板类型

`collect`的底层实现依赖于`FromIterator`特征。具体来说，当你调用`collect`时，它会根据目标类型来推到应该收集成什么类型，并将元素逐个添加到目标集合中。目标类型必须实现`FromIterator`，这意味着目标类型能够从一个迭代器中创建自身

`FromIterator`特征是用来指定如何从一个迭代器创建一个集合类型的。对于`Vec<T>`，它的`FromIterator`实现会把迭代器中的每个元素推入`Vec`中

```rust
impl<T> FromIterator<T> for Vec<T> {
    fn from_iter<I: IntoIterator<Item = T>>(iter: I) -> Self {
        let mut vec = Vec::new();
        for item in iter {
            vec.push(item);
        }
        vec
    }
}

```

显式指定类型：

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4];
    let squared: Vec<i32> = numbers.into_iter()
        .map(|x| x * x)
        .collect(); // 显式指定收集成 Vec<i32>

    println!("{:?}", squared); // 输出: [1, 4, 9, 16]
}

```

隐式指定类型

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4];
    let squared = numbers.into_iter()
        .map(|x| x * x)
        .collect::<Vec<i32>>(); // 使用类型注解指定目标类型

    println!("{:?}", squared); // 输出: [1, 4, 9, 16]
}

```
