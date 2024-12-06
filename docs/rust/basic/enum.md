# 枚举

在`Rust`中，也是使用`enum`关键字来定义枚举。

## 定义使用枚举

每个枚举可以包含多个变体（variant），每个变体可以有不同的类型，甚至没有任何数据。

1. 无数据

   ```rust
   // 定义一个简单的枚举，表示一个交通信号灯
   enum TrafficLight {
       Red,
       Yellow,
       Green,
   }

   fn main() {
       // 使用枚举值
       let light = TrafficLight::Red;

       match light {
           TrafficLight::Red => println!("Stop"),
           TrafficLight::Yellow => println!("Get ready"),
           TrafficLight::Green => println!("Go"),
       }
   }

   ```

2. 枚举变体携带数据

   ```rust
   enum PokerCard {
    Clubs(u8),
    Spades(u8),
    Diamonds(u8),
    Hearts(u8),
   }

   fn main() {
     let c1 = PokerCard::Spades(5);
     let c2 = PokerCard::Diamonds(13);
   }
   ```

3. 和结构体结合

   可以在枚举的变体中使用结构体，或者在结构体中包含枚举变体。这种组合能让你根据不同的需求组织复杂的数据类型。

   ```rust
   // 定义一个结构体表示圆形
    struct Circle {
        radius: f64,
    }

    // 定义一个结构体表示矩形
    struct Rectangle {
        width: f64,
        height: f64,
    }

    // 定义一个枚举，其中每个变体都包含一个结构体
    enum Shape {
        Circle(Circle),     // 圆形变体包含一个 Circle 结构体
        Rectangle(Rectangle), // 矩形变体包含一个 Rectangle 结构体
    }

    fn main() {
        // 创建一个圆形和一个矩形
        let circle = Shape::Circle(Circle { radius: 5.0 });
        let rectangle = Shape::Rectangle(Rectangle { width: 4.0, height: 6.0 });
    }

   ```
