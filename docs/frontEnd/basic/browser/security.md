# 安全

## XSS

XSS 攻击通常指的是通过利用网页开发时留下的漏洞，通过巧妙的方法注入恶意指令代码到网页，使用户加载并执行攻击者恶意制造的网页程序。这些恶意网页程序通常是 JavaScript，但实际上也可以包括 Java、 VBScript、ActiveX、 Flash 或者甚至是普通的 HTML。攻击成功后，攻击者可能得到包括但不限于更高的权限（如执行一些操作）、私密网页内容、会话和 cookie 等各种内容。

XSS 攻击主要有这几类：反射型、储存型、DOM-based 型。

### 攻击

反射型攻击为引诱用户通过点击去访问一个包含恶意代码的 url，当用户点击后，代码会直接在用户主机上的浏览器上执行。

储存型攻击原理为将代码上传到服务器中，用户只要再次浏览页面就会执行该代码

DOM-based 基于 dom 来执行恶意脚本来进行攻击

### 防范

### 转义字符等

对 html 属性、字符等进行转义。

```js
function escape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quto;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/\//g, "&#x2F;");
}
```

#### CSP

CSP 全称网页安全政策，由开发者定义的安全政策声明来指定可信任来源。开启 CSP 来防止 XSS 攻击，设置如下：

```html
<meta http-equiv="Content-Security-Policy" content="" />
```

`content`包含：default-src:受信任得额 http、https 协议，受信任的域名、css 资源等。

## CSRP

CSRF（Cross-site request forgery）跨站请求伪造，也被称为 one-click attack 或者 session riding，通常缩写为 CSRF 或者 XSRF， 是一种挟制用户在当前已登录的 Web 应用程序上执行非本意的操作的攻击方法。跟跨网站脚本（XSS）相比，XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

即裹挟用户的登录状态、cookie 来发起恶意请求，攻击接口等。

一般由第三发网站发起攻击，冒充被攻击网站的身份来操作攻击。

### 攻击

`GET`方式，利用一个 http 请求来获取受害者的信息或者攻击

```html
<img src="http:/api.pmthank.com/user?push='demo'" />
```

`POST`方式，一个表单，引诱受害者点击

```html
<form action="http:/api.pmthank.com/user" method="post">
  <input name="cookie" value="demo" type="hidden" />
</form>
```

### 防范

- [服务端设置](/frontEnd/other/one.html#服务端)`Cookie`避免脚本拿到 Cookie。
- 请求携带验证信息，token
- 源域名限制
