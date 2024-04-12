# Python

这部分记录下学习 Python 的过程

首先就是下载 Python，这个直接去官网即可，同时在 vsCode 上安装相应的插件。

第一个文件：

```py
print("hello world")
```

## 语法

由于在学习`Python`之前已有了其他语言的经验。比如:`Java`、`C` 、`JavaScript`等，因此学习起来比较简单。但也有一些差异，记录如下：

### 变量

Python 的变量不需要声明，直接书写变量，值可以是任意类型

```Python
num = 1
st = '1'
ar = [0,1,2,3,4,5,6,7,8,9]
```

### 推导式

相比于其他语言，这是一个新颖的的东西。由 A 推导出 B。具体分为列表、字典、集合。

```md
**列表**
[表达式 for 变量 in 列表 if 条件]

**字典**
{ key_expr: value_expr for value in collection if condition }

**集合**
{ expression for item in Sequence if conditional }
```

可以看出中间都是一个循环，用来生成 A，左边就是 B，右边就是限制条件，就是条件等。写几个例子

```python
# 列表
squares = [i **3 for i in range(10)]
print(squares)
# 字典
squares_dict = {x:x**2 for x in range(10)}
print(squares_dict)

def getDoubles(x):
    return x**2
# 集合
unique_squares = {x**2 for x in range(10) if(getDoubles(x) > 50) if(getDoubles(x) < 80)}
print(unique_squares)
```

###
