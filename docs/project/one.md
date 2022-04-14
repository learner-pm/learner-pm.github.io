# 毕设

毕设主题是 App。也包含后台管理系统，产品介绍页面。

## App

采用 uniapp 进行开发，语法和 html 接近，减少开发成本。先按照 App 进行一个页面分类。

### Home

Home 页是进入 App 的主体页面。从上向下，分类可为：

- 右侧为 User 头像，左侧主体为搜索框
  - 登录情况下点击头像可进入个人用户界面，否则进入登录界面，点击搜索框进入搜索页面
- 下面一列为主要功能集群，四个按钮，分为`跑步`，`监测`，`记录`，`视频`
  - 跑步 : 跳转 Run 页面进行跑步
  - 记录 : 历史运动数据展示
  - 监测 : 对数据进行分析
  - 视频 : 运动视频
- 今日看点，list 列表，展示一些运动类的新闻
  - title ，image，content，adn time

list 部分需要滚动条，自适应高度

### 圈子

这个用户交流页面。主体为 list 列表展示发言。提供一个可以发布的按钮。

- list 列表包含 title，content，time，image，userName，more action。
- 点击按钮进行言论发布

### Run

展示当前地图和记录用户跑步轨迹进行储存。

### User

用户页面，分为两个状态，登录和游客状态。

**游客状态**

当前状态下，用户只能使用简单功能，核心功能只能登录后才能使用。

页面上，从上而下：

- 扫码功能和消息提示功能，
- 用户头像和能使用的登录方式，协议信息等提升。
  - 手机号注册和账号密码注册等。
  - 提供三方登录
- 用户身体数据存储，当天跑步数据记录
- 收藏 list 等

**登录状态**

- 展示头像，点击可进入用户详情页面。
- 推送信息，提供扫码功能。
- 输入数据
- dispaly 信息

用户详情页面

- 缓存的设置
- 数据的可视化展示
- 修改密码
- 系统设置功能

文章和其他用户的发言，如果当前用户评论了其中一条数据，如果其他用户评论这条这个用户评论的发言，应该通知用户。

用户关注了某个其他用户的时候，被关注用户有了新的发言的时候，应该通知到这个用户。

## 后台管理页面

使用 React 技术来进行前端开发。

### 登录

密码使用`sha256`进行加密，避免明文传输。返回一个 token 来进行身份验证。

### home

登录成功后的首页主要用来展示数据。按照从上往下梳理：

- 数据统计，总访问量，app 下载量，活跃度等
- app 下载统计，按照时间流程
- app 数据（后期考虑去掉）

首页的作用是，提供数据的可视化展示。

### app

app_basic 页面主要展示 app 相关数据，和 app 本身相关。

- app 基础信息，如发布时间，版本号，等
- app 下载量，用户打分情况
- app 搜索热词
- app 迭代情况
- 用户反馈情况 （拆分为反馈和文章热词）

app_artic

- artic 文章列表，可添加视频。
- 提供搜索情况，时间等搜索

app_tlak

- app 用户发言数据统计，可发布官方情况，是否顶置等。
- 提供搜索情况，按类型，时间等搜索

### user

User 用户数据统计

- app 注册用户 list 列表展示，可对数据进行操作，封禁等
- 具体页面包含基础的用户情况，详情页面展示基础和 run 数据

### data

所有用户跑步数据和其他数据

- 判断用户健康的模板参数和已经存在的模板参数
- 对所有用户数据的健康度的判断
- 使用 app 的年龄段的分布
- run 数据的 list
- run 数据页面包含 run 数据的基础信息和轨迹情况

### set

admin，管理员页面

- Set 系统设置页面
- 当前管理员的基础信息
- 管理员列表
- 添加，删除管理员

**未完成**：用户详情下的 run 数据具体展示页面，用户反馈下的具体内容，视频文章-> 单独文章，视频作为文章的附属内容。添加文章的操作，
用户发言列表的具体展示。

## web 展示页面

采用 vue 来进行前端页面的构建

主要功能

- 展示项目
- 提供下载功能
- 展示下载数据量
- 提供联系方式

## Apis

设计 api

### pc

- home
  - loginApi：登录 api，返回 tooken
  - getAlltotal：获取平台数据集合
  - getAppUsers：获取下载趋势数据
- admin
  - getAdminList：获取 admin 集合
  - getAdminInformation：通过 id 获取单个 admin 信息
  - deleteAdmin：删除 admin
  - creatAdmin：创建 admin
- app
  - getAppInformation：获取 app 基础信息情况
  - getAppHostWords：获取 app 搜索热词
  - getAppVersion: 获取 app 的版本信息
  - feedBackList：获取反馈集合
  - feedBackInformation：获取具体反馈信息
  - getAllArtic：获取 app 所有文章
  - deleteArtic：删除某个文章
  - addArtic：新增文章
  - getArticInformation：获取某个具体文章信息
  - getAllForumList：获取所有论坛列表
  - addForum：增加一条论坛数据（非 user，仅为 admin）
  - getForumInformation：获取论坛中具体的一条数据
  - deleteForum：删除数据
- data
  - bodyList：已创建的基础数据标准
  - addRule：增加规则
  - getPeopleAge：获取用户年龄分布
  - getHealthy：获取用户健康情况
  - getRunList：获取用户的运动情况
- user
  - getUserInformation：获取某个用户具体信息
  - getUserList：获取用户 list
  - disableUser：禁用用户
  - userLiked: 用户关注情况

### app

- home
  - getUserInformation:首页用户信息，预加载，只显示头像
  - search :通过用户的输入来检索信息
  - getAppHostWords：获取搜索热词
  - getTodayArtic:获取当天热文章
  - getAllArtic:获取所有的文章
  - getArticByid:获取当个文章信息
- forum
  - getAllForums：获取所有的用户发言列表
  - userLikeForum：用户点赞某个发言
  - userCommentForum：用户评论某个发言
  - userCollectForum：用户收藏某个发言
  - creatForum：用户发言
  - getLikesById:获取当前用户关注的 user
  - getCommentsById:获取当前发言被评论的列表
- run
  - endRun:结束跑步发送数据
  - getUserRunsList：获取用户历史跑步数据
  - getRunsByUserId:通过 userid 来获取用户下的所有 run 数据
- user
  - loginApi：登录
  - registerApi：注册
  - getUserInformation：获取用户信息
  - updatedUserInformationApi:更改用户信息
  - changePasswordApi:修改密码
  - getRunInformation：获取用户跑步记录
  - searchCode：二维码
  - getHistory：获取历史数据
  - userBody:用户身体数据情况
  - userLikes：用户关注列表

## 数据库

### 表

管理员表，储存 pc 端管理员的信息情况

- admin true

  - uuid
  - userName
  - password

- admin_information

  - adminId
  - token
  - lastLoginTime
  - imgUrl
  - release

pp 表主要包含 app 的信息情况，以及平台提供的服务和信息。文章，搜索，等。会和 user 模块进行交互

- app true
  - version
  - appName
- app_version
  - uuid
  - version
  - content
  - creatTime
- app_hosts true
  - uuid
  - content
  - link
  - numbers
- app_artic true
  - uuid
  - content
  - creatTime
  - adminName
  - lastUpdateTime
- app_artuc_infroamtion true
  - uuid
  - articId
  - likes
- app_toady_artic true
  - uuid
  - content
- app_body_data true
  - uuid
  - creatTime
  - auther
  - data

run 表，记录跑步进行情况，保存所有跑步记录

- run true
  - uuid
  - userId
  - data //经纬度数据
  - dataCenter
  - creatTime
  - endTime
  - minSpeed
  - maxSpeed
  - speed
  - numners
  - result

speech 表

- speech true
  - uuid
  - creatTime
  - lookPeples
  - content
  - icos
  - likes
  - commects
  - collects

user 表，包含用户账号密码，第三方登录等情况，

- user
  - uuid
  - userName
  - password
  - oherLogins
- qq

  - uuid
  - userId
  - qqId

- wx
  - uuid
  - userId
  - wxId

likedUsers

- user_liedad
  - uud
  - userId

user_body 用户身体数据

- user_body
  - uuid
  - data

user_liked 用户关注列表

- user_liked
  - uuid
  - userId
  - likedUserId
  - creatTime

user_information 基础的信息情况，

- user_information
  - imgUrl
  - lastLoginTime
  - lastLoginIp
  - creatUserTime
  - liksUsers

user_speech 用户的发言情况，和 run、app 模块交互

- user_speech
  - uuid
  - userId
  - speechId

user_history 用户的历史情况，看过什么文章等等时间

- user_history

  - uuid
  - userId
  - time
  - content

user_runs 用户的运动情况

- user_runs

  - uuid
  - userId
  - runId // array

user_comment 用户的评论 list

- user_comment

  - uuid
  - userid
  - articId

user_collect 收藏

- user_collect
  - uuid
  - articId
  - userId

## 地图轨迹

### pc 上用户展示用户的跑步轨迹。

使用高德 api 进行开发，

```js
const polyline = new AMap.Polyline({
  //绘制轨迹
  map: map,
  path: lineArr, //经纬度列表
  showDir: true,
  strokeColor: "#28F",
  strokeWeight: 6,
});
map.setFitView(); //缩放视野级别

setInterval(() => {
  // 使用定时器进行绘制
  lineArr.push(path[lineArr.length]); //更改经纬度数组
  var polyline = new AMap.Polyline({
    //重新绘制
    map: map,
    path: lineArr,
    showDir: true,
    strokeColor: "#28F",
    strokeWeight: 6,
  });
  map.setFitView();
}, 1000);
```

### app 绘制和实时记录

实时获取地理位置：

```js
setInterval(() => {
  uni.getLocation({
    type: "wgs84",
    success: function (res) {
      console.log("当前位置的经度：" + res.longitude);
      console.log("当前位置的纬度：" + res.latitude);
    },
  });
}, 1000);
```

实时绘制，map 组件的一个属性：`polyline`，经纬度数组。和 pc 端同理，定时改变改属性并且进行渲染即可。

## app 端图表

app 端采用 renderjs 来进行图表构建，主要用于展示跑步数据，频率，身体数据等的可视化展示。

app 网络请求 promise 化封装，api 封装。

第三方登录，注册开发者，手机号登录（腾讯云开发）

## 储存

pc 端储存在 localstorage token
app 储存在手机，进入 app 的时候需要进行本地数据读取。

```js
uni.setStorage({
  key: "storage_key",
  data: "hello",
  success: function () {
    console.log("success");
  },
});
```

相机扫描（考虑中）

```js
uni.scanCode({
  success: function (res) {
    console.log("条码类型：" + res.scanType);
    console.log("条码内容：" + res.result);
  },
});
```

## springBoot

mysql,sqagger-ui,

### controller

### service

### dao

::: tip 提示
未完待续
:::
