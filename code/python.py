
s = 'xx'

print(s)

t = type('x')

print(isinstance('x',str))
print(type(type('x')))

obj = {
    'name': 'xx',
    'age': 18
}

print(obj['name'])

bs =bytes('hello','utf-8')
print(bs)

print(bs.decode('utf-8'))

arr = [1,0]

print(max(arr))

obj1= {
    'name': 'xx',
    1: 18
}

print(obj1[1])

obj2Name = 'name'

obj2= {
    obj2Name: 'xx',
    'age': 18
}

print(obj2[obj2Name])

age = int(input("请输入你家狗狗的年龄: "))
print("")
if age <= 0:
    print("你是在逗我吧!")
elif age == 1:
    print("相当于 14 岁的人。")
elif age == 2:
    print("相当于 22 岁的人。")
elif age > 2:
    human = 22 + (age -2)*5
    print("对应人类年龄: ", human)
 
### 退出提示
input("点击 enter 键退出")