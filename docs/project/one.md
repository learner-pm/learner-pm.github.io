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

## 后台管理页面

采用 React 进行前后端分离开发。

### 登录

登录密码使用`sha256`进行加密，避免明文传输。

### 主体功能划分

- Home 页，使用统计表格进行数据展示，
- App app 各项数据数据
  - 信息 迭代情况，下载量，星级打分，用户反馈，搜索热词
  - 新闻文章 list 列表，添加新闻
  - 圈子 发布趋势，按日统计 list 列表
- User 用户数据统计，->用户详情 （收藏量，关注列表）
- Data

  - 修改入参的 form，-> 标准 list， 整体用户数据分析。图表展示年龄分布。 活跃度列表，
  - 跑步数据分析 -> 展示 map

- Set 系统设置页面

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
- user
  - loginApi：登录
  - registerApi：注册
  - getUserInformation：获取用户信息
  - updatedUserInformationApi:更改用户信息
  - changePasswordApi:修改密码
  - getRunInformation：获取用户跑步记录
  - searchCode：二维码
  - getHistory：获取历史数据

## 数据库

### 表

管理员表，储存 pc 端管理员的信息情况

- admin
  - userName
  - password
  - token
  - lastLoginTime
  - adminId
  - imgUrl
  - release

app 表主要包含 app 的信息情况，以及平台提供的服务和信息。文章，搜索，等。会和 user 模块进行交互

- app
  - version
  - appName
- app_hosts
  - uuid
  - content
  - link
  - numbers
- app_artic
  - uuid
  - content
  - creatTime
  - adminName
  - lastUpdateTime
- app_artuc_infroamtion
  - uuid
  - articId
  - likes
- app_toady_artic
  - uuid
  - content

run 表，记录跑步进行情况，保存所有跑步记录

- run
  - uuid
  - userId
  - data

speech 表

- speech

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
  - ohers
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
  - runId
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

::: tip 提示
未完待续
:::
