# 多线程

Rust的设计目标是使多线程编程即高效又安全。Rust使用其独特的所有权系统和并发原语，帮助开发者避免了数据竞争和常见的并发错误。

## 创建线程

```rust
let handle = thread::spawn(|| {
    println("hello form a  thread")
})

handle.join().unwrap()
```

上面的例子中，`thread::spawn`启动了一个新线程并运行了一个闭包。`join()`用于等待该线程执行完毕

## 在线程闭包中使用 move

`move`关键字用来将外部变量的所有权转移到闭包内部，确保闭包能够跨线程使用这些变量。这在多线程编程中尤为重要，因为不同线程之间不能共享借用，但可以共享数据的所有权

一个简单的例子

```rust
use std::thread;

fn main() {
    let x = 5;

    // 使用 `move` 将 x 的所有权转移给闭包
    let handle = thread::spawn(move || {
        println!("Value of x inside thread: {}", x);
    });

    // 等待线程完成
    handle.join().unwrap();

    // 注意：这里不能再使用 `x`，因为它的所有权已经转移到闭包中了
}

```

- x在主线程中被创建，类型为i32，值为5
- 在创建线程时，我们用 move 关键字将 x 的所有权转移到闭包中。这样，当线程启动时，闭包内部的 x 就是 x 的所有权。
- 由于 x 的所有权已经转移到线程中的闭包，所以主线程无法再访问 x。如果你尝试在 join 之后使用 x，Rust 编译器会报错，提示 x 的所有权已被转移

### 为什么要使用move？

1、线程安全：通过 move，你确保闭包中的所有变量的所有权被完全转移给新线程，从而避免了多个线程间共享引用时可能出现的数据竞争和悬 挂引用。
2、解决生命周期问题：move 允许变量的生命周期跨越线程边界。如果没有 move，闭包中的引用会被认为是对原始变量的借用（借用的生命周 期会受到原始作用域的限制），这在多线程情况下是不允许的。

另一个常见的例子：在 move 闭包中修改共享数据
使用 move 可以将可变数据的所有权转移给闭包，甚至可以允许线程间修改共享数据。通常这会与 Arc 和 Mutex 结合使用，来保证线程安全：

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    // 创建多个线程，每个线程增加计数器的值
    for _ in 0..10 {
        let counter = Arc::clone(&counter); // 克隆 Arc，增加引用计数
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap(); // 获取 Mutex 锁
            *num += 1;
        });
        handles.push(handle);
    }

    // 等待所有线程完成
    for handle in handles {
        handle.join().unwrap();
    }

    // 输出最终的结果
    println!("Result: {}", *counter.lock().unwrap());
}

```

## 线程如何结束

线程通常会在以下情况下结束

1. 线程中的闭包执行完毕：当线程运行的闭包或函数执行完毕时，线程自然结束
2. 调用`join`方法：主线程或其他线程等待目标线程结束，直到目标线程完成其任务
3. 线程提前退出：例如，在执行过程中遇到错误或调用了`panic!`，线程会提前终止

闭包执行完退出

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("This is the child thread!");
        // 当闭包执行完成后，线程结束
    });

    // 主线程等待子线程完成
    handle.join().unwrap();
    println!("Main thread ends.");
}

```

使用`join`等待线程结束：`thread::spawn`放回一个`JoinHandle`，它时一个句柄，可以用来等待线程结束。通过调用`join()`，主线程会等待子线程完成工作后继续执行

- `join()`方法会阻塞当前线程，直到目标线程执行完毕并结束
- 如果目标线程成功结束，`join()`返回`Ok`，否则放回`Err`

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("This is a thread.");
    });

    // 主线程等待子线程结束
    handle.join().unwrap(); // 阻塞，直到子线程结束

    println!("Main thread ends.");
}

```

线程提前退出：线程可能因为错误或 panic! 提前结束。当线程内部调用 panic! 时，线程会被强制中止。如果线程发生了 panic!，调用 join() 时会返回一个 Err。

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        panic!("Thread panicked!");
    });

    let result = handle.join();
    match result {
        Ok(_) => println!("Thread completed successfully."),
        Err(e) => println!("Thread failed: {:?}", e),
    }
}

```

## 线程局部变量

在`Rust`中，线程局部变量指的是每个线程有自己独立的一份变量副本。这种变量的值对不同的线程是隔离的，每个线程都
可以修改它们子的副本而不会影响其他线程。

`Rust`提供了一种方便的方式来实现线程局部变量，通常使用`std::thread::LocalKey`类型配合`std::cell::RefCell` 或 `std::sync::OnceCell` 来存储这些局部变量。

### 使用

```rust
use std::cell::RefCell;

thread_local! {
    static MY_LOCAL: RefCell<i32> = RefCell::new(0);
}

fn main() {
    // 主线程的初始值为 0
    MY_LOCAL.with(|local| {
        println!("Main thread initial value: {}", *local.borrow());
    });

    // 在一个新线程中访问线程局部变量
    std::thread::spawn(|| {
        MY_LOCAL.with(|local| {
            println!("New thread initial value: {}", *local.borrow());
            *local.borrow_mut() = 42; // 修改当前线程中的局部变量
        });
    }).join().unwrap();

    // 主线程的值没有被修改
    MY_LOCAL.with(|local| {
        println!("Main thread after thread join: {}", *local.borrow());
    });
}

```

### thread_local! 宏的工作原理

- 线程局部存储：每个线程都会有一个独立的变量副本，并且这些副本之间互不干扰。即使多个线程访问相同的局部变量，每个线程都只能访问自己专属的副本
- 内存管理：`thread_local!`中定义的变量实在该线程第一次访问时初始化的，并且在该线程结束时自动销毁。因此，这类变量的生命周期是与线程绑定的
- RefCell：`RefCell`是一种可以在运行时进行可变借用检查的类型，允许我们在内部进行可变借用而不需要在编译时确定借用规则。在多线程环境中，它确保每个线程对局部变量的访问是安全的。

## 数据共享与所有权

`Rust`的并发模式十分注重内存安全，特别是在多线程环境下的数据共享。`Rust`的所有权系统通过保证在多线程的环境中每次只有一个线程能够拥有数据，防止了数据竞争

### 借用和所有权转移

`Rust`强制确保你不会在多个线程间拥有统一数据，避免了数据竞争。所有权可以转移，而借用则是受限制的。例如，如果你将某个值传递给一个线程，你不能再在主线程中访问这个值，因为它的所有权已经转移

```rust
let v = vec![1, 2, 3]

let handle = thread::spawn(move || {
    println!("xxx")
})

handle.join().unwrap()
// v 无法再被  使用
```

### 共享数据的访问

`Rust`允许多个线程共享数据，但要通过一些机制确保数据的安全性。这通常是通过`Arc`（原子引用计数，`std::sync::Arc`）和`Mutex`（互斥锁，`std:sync::Mutex`）实现的

- Arc：用于在多个线程之间共享数据，保证线程安全的引用计数
- Mutex：提供了对数据的独占访问，确保在任意时刻只有一个线程可以访问数据

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter); // 克隆 Arc，增加引用计数
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap(); // 锁定 Mutex，获取数据
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap()); // 输出结果
}

```

在上面的例子：

- `Arc` 是线程安全的引用计数智能指针，允许多个线程共享`counter`
- `Mutex` 保证只有一个线程可以在任意时刻访问counter中的数据

## 并发模式

`Rust` 的并发模型非常注重安全，特别是在内存安全和防止数据竞争方面。`Rust` 通过其 所有权系统 和 借用检查器 来确保即使在多线程程序中，也不会发生以下常见错误：

数据竞争：两个线程同时访问同一数据，并且至少一个线程进行写操作。不安全的内存访问：例如，访问已经被释放的内存，或者多个线程修改相同数据。

Rust 的设计确保了这些问题不会发生，或者通过类型系统和编译时检查来防止。

## 只被调用一次的函数

在`Rust`中，如果想实现函数只被调用一次，可以通过多种方式来实现

### 使用std::sync::Once

std::sync::Once 是 Rust 标准库中专门设计用来确保某个操作只执行一次的类型。它是线程安全的，适用于多线程环境。

```rust
use std::sync::Once;

static INIT: Once = Once::new();

fn init_once() {
    println!("This function is called only once.");
}

fn main() {
    // 确保 init_once 只被调用一次
    INIT.call_once(|| {
        init_once();
    });

    // 无论调用多少次，都不会重复调用 init_once
    INIT.call_once(|| {
        init_once();
    });
}

```

- Once::new()创建了一个Once实例，用于控制初始化函数的执行
- call_once 方法确保提供的闭包只会在第一次调用时执行。如果Call_once已经被调用过，则后续调用会直接跳过该闭包的执行
- 该方法时线程安全的，可以在多线程环境中使用，确保只会有一个线程执行该闭包

### 使用Lazy

once_call::Lazy 是一个提供延迟初始化的类型，它也能够确保某个函数或值只会初始化一次，Lazy会在首次访问时初始化，并且在之后的访问中返回相同的值

```rust
use std::cell::RefCell;
use std::sync::Mutex;

static INIT: LazyLock<Mutex<bool>> = LazyLock::new(|| {
    println!("this function is called only once");
    Mutex::new(true)
});


fn main() {
    // 第一次访问 INIT 时会调用闭包进行初始化
    let _lock = INIT.lock().unwrap();

    // 第二次访问不会再次调用闭包
    let _lock = INIT.lock().unwrap();
}

```

### 使用静态变量配合Mutex或RwLock

```rust
use std::sync::{Arc, Mutex};
use std::thread;

static ONCE_CALLED: Mutex<bool> = Mutex::new(false);

fn init_once() {
    println!("This function is called only once.");
}

fn main() {
    let handle1 = thread::spawn(|| {
        let mut called = ONCE_CALLED.lock().unwrap();
        if !*called {
            init_once();
            *called = true;
        }
    });

    let handle2 = thread::spawn(|| {
        let mut called = ONCE_CALLED.lock().unwrap();
        if !*called {
            init_once();
            *called = true;
        }
    });

    handle1.join().unwrap();
    handle2.join().unwrap();
}

```

- 使用Mutex<bool>来跟踪函数是否已经被调用。Mutex确保在多线程环境下可以安全地对bool值进行读写
- 通过锁定ONCE_CALLED来检查是否已经调用过`init_once()`。如果没有调用过，就执行一次函数，并将标志设置为true
- 使用Mutex确保即使在多线程环境中，多个线程之间也不会发生竟态条件

### 使用AtomicBool

如果你希望函数调用的标志时原子性的，可以使用`std::sync::atomic::AtomicBool`来代替`Mutex`，这样避免了加锁的开销

```rust
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::thread;

static ONCE_CALLED: AtomicBool = AtomicBool::new(false);

fn init_once() {
    println!("This function is called only once.");
}

fn main() {
    let handle1 = thread::spawn(|| {
        if ONCE_CALLED.compare_and_swap(false, true, Ordering::SeqCst) == false {
            init_once();
        }
    });

    let handle2 = thread::spawn(|| {
        if ONCE_CALLED.compare_and_swap(false, true, Ordering::SeqCst) == false {
            init_once();
        }
    });

    handle1.join().unwrap();
    handle2.join().unwrap();
}

```

- AtomicBool 时一个支持原子操作的布尔值类型，它允许我们在多个线程之间共享并修改这个值
- compare_and_swap(false, true, Ordering::SeqCst)的作用是：如果当前值是false，将其设置为true，并返回旧值。这样就可以确保只有第一次遇到false的线程会调用init_once()，其他线程都不会再执行该函数

总结：

- Once 是保证线程安全地只调用一次的最常见方式，它在多线程环境中非常有用。
- Lazy 提供了延迟初始化的功能，适合懒加载的场景，且只有第一次访问时才会初始化。
- Mutex 或 RwLock 可以手动管理对标志的访问，适用于需要显式控制锁的场景。
- AtomicBool 提供了轻量级的原子性检查，适用于无需加锁的场景。

## 消息传递

在Rust中，线程间的消息传递是一种常见的并发编程方式，通常用于在多个线程之间共享数据或协调操作。Rust提供了多种机制
来进行线程间的消息传递，其中最常用的是通道（Channel）

### std::sync::mpsc::channel

标准库提供了一个名为`std::sync::mpsc`的模块，其中`channel`函数用来创建一个通道。`mpsc`是“multiple producer, single consumer”
（多个生产者，单个消费者）的缩写，意味着多个发送者可以向同一个接收者发送消息

例子：

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // 创建一个通道
    let (tx, rx) = mpsc::channel();

    // 启动一个线程发送消息
    thread::spawn(move || {
        let msg = String::from("Hello from the thread!");
        tx.send(msg).unwrap();  // 发送消息
    });

    // 主线程接收消息并打印
    let received = rx.recv().unwrap();  // 阻塞直到接收到消息
    println!("Received: {}", received);
}

```

- `mpsc::channel()`创建了一个通道，它返回一个元组`（tx, rx）`，其中`tx`是发送者（transmitter），`rx`是接收者
  （receiver）
- tx.send(msg)发送消息到通道
- rx.recv()用于接收消息，recv()会阻塞当前线程，直到接收到来自发送者的消息

### 多个发送者和单个接收者

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    // 克隆发送者以便多个线程使用
    let tx1 = tx.clone();
    let tx2 = tx.clone();

    // 启动第一个线程发送消息
    thread::spawn(move || {
        let msg = String::from("Message from thread 1");
        tx1.send(msg).unwrap();
    });

    // 启动第二个线程发送消息
    thread::spawn(move || {
        let msg = String::from("Message from thread 2");
        tx2.send(msg).unwrap();
    });

    // 接收消息
    for received in rx {
        println!("Received: {}", received);
    }
}

```

- tx.clone：为了让多个线程共享发送通道，必须克隆发送者tx。每个发送者都会拥有通道的一部分，并且它们共享同一个
  接收者
- rx通过`for received in rx`来接收所有发送的消息。该语法会自动处理迭代，直到所有发送者都关闭通道

### 传递原理

- 发送者（tx）负责将消息放入通道。
- 接收者（rx）负责从通道中取出消息。当接收者没有消息可读时，它会被阻塞，直到收到来自发送者的消息。
- 如果所有发送者都已经发送完消息并且通道被关闭，recv() 方法会返回 Err，表示通道已关闭。

### try_recv

send将消息发送到通道。如果发送失败，send会返回一个错误。try_recv是一个非阻塞的版本，尝试从通道中接收消息
。如果没有消息可接收，它会立即返回Err，而不会阻塞线程，适用于需要非阻塞操作的场景

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    // 启动一个线程，发送消息
    thread::spawn(move || {
        thread::sleep(Duration::from_secs(1));  // 模拟延迟
        tx.send(String::from("Hello after 1 second")).unwrap();
    });

    // 主线程使用 try_recv 非阻塞接收消息
    loop {
        match rx.try_recv() {
            Ok(msg) => {
                println!("Received: {}", msg);
                break;
            }
            Err(_) => {
                println!("No message yet...");
                thread::sleep(Duration::from_millis(500));  // 等待一段时间后再次尝试
            }
        }
    }
}

```

- try_recv() 尝试从通道接收消息，如果没有消息，它会返回一个Err，并且不阻塞当前线程。
- 主线程通过循环不断尝试接收消息，直到接收到消息为止

### 通道多种用法

- 传递基本数据类型：通道可以传递任何类型的数据，只要它们实现了Send和Sync。例如，可以传递 String、Vec<T>、Box<T> 等。
- 传递复杂数据：如果需要传递复杂的数据结构，可以通过智能指针（例如 Arc<Mutex<T>>）来共享可变数据。

