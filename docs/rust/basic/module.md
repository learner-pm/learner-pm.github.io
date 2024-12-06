# 包和模块

Rust 的包和模块是组织和管理代码的基础建块。理解它们是编写大型Rust项目的关键

## 包

包是Rust中组织代码的基本单元。它包含了`Cargo.toml`配置文件和至少一个源代码文件的目录。包可以包含多个库或二进制目标，但通常每个包有且只有一个主目标，一个二进制文件

- 包结构：每个包都有一个`Cargo.toml`文件，里面记录了包的元数据（如报名、版本、依赖等）以及依赖关系。包目录下通常包含一个`src`目录，存放源代码
- 二进制和库：一个包可以是一个库或者一个二进制程序。一个包如果是二进制包，通常会有一个`main.rs`文件；如果是库包，则会有一个`lib.rs`文件。你可以同时创建二进制和库目标 。

```plaintext
my_project/
├── Cargo.toml  # 包的配置文件
└── src/
    ├── main.rs  # 二进制目标的主文件
    └── lib.rs   # 库目标的主文件

```

- Cargo.toml 文件

```toml
[package]
name = "my_project"
version = "0.1.0"
edition = "2021"

[dependencies]

```

- src/main.rs(二进制目标)

```rust
fn main() {
    println!("Hello, world!");
}

```

- src/lib.rs

```rust
pub fn greet() {
    println!("Hello from the library!");
}

```

## 模块

`Module` 是`Rust`中用来组织代码的单位。它允许你将代码划分成多个文件，使得大项目中的代码更加结构化和可管理。模块可以是内嵌在其他模块中的，也可以是外部文件模块。

- 模块的定义：在`Rust`中，模块使用`mod`关键字来定义。模块内可以包含函数、结构体、常量、其他模块等。模块的名称会对应于源文件或目录名

```rust
mod greetings {
    pub fn hello() {
        println!("Hello!");
    }

    fn secret() {
        println!("This is a secret.");
    }
}

fn main() {
    greetings::hello(); // 可以访问
    // greetings::secret(); // 编译错误：无法访问
}

```

在上述示例中，`greetings`是一个模块，其中有两个函数：

- `hello` 是公开的（`pub`），可以在外部访问
- `secret` 是私有的（没有使用`pub`），无法从外部访问
- 模块结构和文件系统映射：Rust会自动根据文件系统的结构来查找模块。例如，如果你有一个模块`greetings`，并且你希望将其放在一个单独的文件中，可以按如下方式组织代码：

```plaintext
src/
├── main.rs
└── greetings.rs

```

然后使用它

```rust
mod greetings;  // 引入 greetings.rs 文件

fn main() {
    greetings::hello();  // 使用 greetings 模块中的函数
}
```

### 子模块

`Rust`支持模块嵌套，即你可以在一个模块中定义其他模块，这被称为子模块。子模块可以通过文件夹结构来组件

```plaintext
src/
├── main.rs
└── greetings/
    ├── mod.rs
    └── english.rs
```

- `mod.rs`中定义了一个模块，并引入了`english.rs`子模块

```rust
// src/greetings/mod.rs
pub mod english;  // 引入子模块
```

- `english.rs`文件中定义了具体的功能

```rust
// src/greetings/english.rs
pub fn hello() {
    println!("Hello!");
}

```

- `main.rs`中引入并使用子模块

```rust
mod greetings;  // 引入 greetings 模块

fn main() {
    greetings::english::hello();  // 使用子模块中的函数
}

```

### `use`关键字和路径

`use` 关键字用来引入模块中的功能。它可以简化对模块中元素的引用。

- 导入模块中的元素

```rust
use greetings::english::hello;

fn main(){
    hello();
}
```

- 路径：Rust中的路径分为绝对路径和相对路径
  - 绝对路径以`crate::`开头，表示从当前包的根开始查找
  - 相对路径则直接从当前模块开始查找

```rust
// 绝对路径
use crate::greetings::english::hello;

// 相对路径
mod greetings {
    pub mod english {
        pub fn hello() {
            println!("Hello!");
        }
    }
}

```

### 模块可见性

Rust 中的模块系统是基于可见性规则的，默认情况下，模块中的所有项（函数、结构体、变量等）都是私有的，只有加上`pub`关键字才能让它们公开给外部访问。

- 私有和公有
  - 私有：默认情况下，模块中的项是私有的，外部无法直接访问
  - 公有：通过在项前加上`pub`，可以将其公开，使得外部代码可以访问

```rust
mod example {
    pub fn public_function() {
        println!("This is a public function!");
    }

    fn private_function() {
        println!("This is a private function.");
    }
}

fn main() {
    example::public_function();  // 可以访问
    // example::private_function();  // 编译错误，无法访问私有函数
}

```

### crate和self关键字

crate：表示当前包的根模块。通常用于从包的根模块引入项

```rust
mod greetings {
    pub fn hello() {
        println!("Hello!");
    }
}

fn main() {
    crate::greetings::hello();  // 使用绝对路径访问 greetings 模块中的 hello 函数
}
```

self: 引用当前模块的别名，通常用于相对路径

```rust
mod greetings {
    pub mod english {
        pub fn hello() {
            println!("Hello from English!");
        }
    }
}

fn main() {
    use self::greetings::english::hello;  // 使用相对路径访问
    hello();
}

```

### 第三方依赖

`Rust`的包管理器`Cargo`可以通过`Cargo.toml`配置文件来管理项目依赖。第三方依赖通常通过`use`导入到项目中。

```toml
[dependencies]
serde = "1.0"  # 添加 serde 依赖
```

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u32,
}

```

通过这些特性，Rust 提供了强大的模块化和代码组织能力，使得编写和维护大型项目变得更加高效和可靠。
