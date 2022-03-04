# 储存

HTML5 新增`loalStorage`和`sessionStorage`储存。

## localStorage 和 sessionStorage

`localStorage`和`sessionStorage`均允许用户在浏览器保存数据，数据格式为键值对，且储存空间为`5mb`。

两者区别为`sessionStorage`为`会话`级别储存，当会话结束时会清空`sessionStorage`空间中的键值对。而`loalStorage`只要不手动清除则永久存在。其中`loaclStorage`是遵循`同源`策略。

### 增删查

以 localStorage 为例，小小的模拟了一下存储期限。

通用

```js
const isObject = (object) =>
  Object.prototype.toString.call(object) === "[object Object]";

const isJSON = (str) =>
  typeof str === "string" && typeof JSON.parse(str) === "object";

const isArray = (array) => Array.isArray(array);
```

#### 增

```js
const loaclSet = (key, value, expire = null) => {
  if (expire < 0) {
    console.error(new Error("时间间隔不能为负。"));
    return;
  }
  if (expire !== null) {
    localStorage.setItem(
      key,
      JSON.stringify({
        value: value,
        time: Date.now(),
        expire,
      })
    );
  } else {
    if (isObject(value) || isArray(value)) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }
};
```

#### 删

```js
const removeLocal = (keyname) => localStorage.removeItem(keyname) === undefined;
```

#### 查

```js
const getLocal = (keyname) => {
  const value = localStorage.getItem(keyname);
  if (isJSON(value)) {
    const vle = JSON.parse(value);
    if (vle.expire) {
      return Date.now() - vle.time > vle.expire
        ? this.remove(keyname)
        : vle.value;
    } else {
      return vle;
    }
  } else {
    return value;
  }
};
```

## cookie

`cookie`为浏览器储存的文本内容，其储存空间大小为`4kb`，在网页发出 http 请求时会自动检测这个文本是否有当前请求的`cookie`，有就会被浏览器添加到`Request Header`的`Cookie`属性中。介于此`cookie`一般用来储存用户信息如：登录、身份等。

`cookie`可由客户端和服务端设置

### 客户端

js 使用`document.cookie`来设置`cookie`。每个`cookie`有以下属性可设置：

- key=value 要设置的键值对
- expires=date-in-GMTTString-format/max-age=max-age-in-seconds cookie 存在有效范围时间，如果既未指定 `expires` 也未指定`max-age`，它将在会话结束时过期
- domain=domain 域名，默认为当前文档位置的主机部分
- path=path 路径，默认为当前文档位置的当前路径
- secure 只能通过安全协议作为`https`传输
- samesite=lax/strict/none 阻止浏览器将此`cookie`与跨站点请求一起发送
- HttpOnly 只能通过服务端设置

#### 增

使用`document.cookie`如下格式，通过图片可以看到`domain`为`127.0.0.1`即为当前服务器主机，`path`为`"/"`,`expires`为我所设置的值。

```js
document.cookie = "number = 0;expires = Thu,18 Dec 2021 12:00:00 GMT";
```

<img src="./img/one_01.png" width="100%">

使用`document.cookie`的方式需要每次手动设置，可以写一个简易函数来进行增加操作。

```js
const setCookie = (name, value, days = 0, _path = "/", host) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const data = name + "=" + value;
  const expires =
    days === 0 ? "expires" + "=" : "expires" + "=" + date.toGMTString();
  const domain = host ? "domain" + "=" + host : "domain" + "=";
  const path = "path" + "=" + _path;
  document.cookie = data + ";" + expires + ";" + domain + ";" + path;
};
setCookie("number", 0, 12); //根目录下所以文件可查看
setCookie("number1", 1, 0); //根目录下所以文件可查看
setCookie("one", 1, 1, "/one"); // /one目录下所有文件可查看
```

`'/index.html'` 下
<img src="./img/one_02.png" width="100%">

`'/one/one.html'`下
<img src="./img/one_03.png" width="100%">

#### 删

修改 `cookie` 只需要将其 `expires` 设置为一个过去的时间点即可。

删除时需要保证 `path` 和 `domain` 一致,原因是不同的`cookie`有各自被访问的区间值(我的理解).

```js
const deleteCookie = (name) => {
  setCookie(name, getCookie(name), -1);
};
deleteCookie("number");
```

#### 改

修改某个`cookie`值只需要重新赋值即可

和删除一样，修改也需要保证当前`cookie`的`path`和`domain`和旧的值一致,否则会重新增加一个值.

```js
const changeCookie = (name, value) => {
  setCookie(name, value);
};
changeCookie("number", 10);
```

#### 查

先获取全部在进行查询

```js
const getCookie = (name) => {
  const arr = document.cookie.split(";");
  for (let i = 0; i < arr.length; i++) {
    const kV = arr[i].trim().split("=");
    if (kV[0] == name) return kV[1];
  }
  return `不存在${name}这个key`;
};
console.log(getCookie("number")); //2
```

### 服务端

开启`HttpOnly = true`后只能通过服务得来修改`cookie`,由服务器通过`Set-Cookie`设置并且储存在`HTTTP cookies`中,可在`Response Headers`中查看.

这个状态下的`cookie`浏览器时拿不到的,有助于降低客户端脚本访问受保护 cookie 的风险,更安全.

### 跨域时的 cookie

跨域情况下`cookie`不会被添加到`Request Headers`中.原因是:

- `CORS`标准规定:默认情况下,浏览器再发生跨域请求时,不能发送任何认证信息.比如:`cookie`,除非`xhr.withCredentials`为`true`.

```js
const xmlhttp = new XMLHttpRequest();
xmlhttp.withCredentials = true;
```

所有如果要在跨域情况下携带`cookie`,需要更改`xhr.withCredentials`默认值.
