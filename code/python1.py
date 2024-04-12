squares = [i **3 for i in range(10)]
print(squares)

squares_dict = {x:x**2 for x in range(10)}
print(squares_dict)

def getDoubles(x):
    return x**2

unique_squares = {x**2 for x in range(10) if(getDoubles(x) > 50) if(getDoubles(x) < 80)}
print(unique_squares)