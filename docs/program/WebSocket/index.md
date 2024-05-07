# WebSocket

`WebSocket`是一项双向通信服务。传统的通信方式只能客户端向服务端单向通信，而 WebSocket 可以实现服务端到客户端的通信，即双向通信。常见的网页聊天、游戏等都有用到相关技术。

## 客户端实现

实现前端的连接创建。项目采用`Vite`搭建，使用 Vue 进行开发。

创建项目

```bash
npm create vite@latest
```

接下来进入`App.vue`，编写相关代码。

script 模块如下，三个响应式变量，用于控制输入值，回显值，以及 WebSocket 的索引。

```Vue
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

const message = ref('')
const reactiveMessage = reactive<any[]>([])
const ws =reactive<{
  isConnected:boolean,
  socket:null | WebSocket
}>({
  isConnected:false,
  socket:null
})

const initWebSocket = ()=>{
  ws.socket = new WebSocket('ws://localhost:3000')

  ws.socket.onopen = ()=>{
    ws.isConnected = true
  }
  ws.socket.onclose = ()=>{
    console.error("ws://localhost:3000 is closed")
    ws.isConnected = false
  }
  ws.socket.onmessage = (e)=>{
    if(typeof e?.data === 'string'){
      reactiveMessage.push(JSON.parse(e.data))
      return
    }
    const reader = new FileReader()
    reader.onload = function (){
      const text = reader.result
      reactiveMessage.push(text)
    }
    reader.readAsText(e?.data)

  }
}

const sendMessage = ()=>{
  if(ws.socket && ws.isConnected){
    ws.socket.send(JSON.stringify(message.value))
    message.value = ''
  }
}

onMounted(initWebSocket)

</script>
```

template 模块如下，简单的一个输入、发送、回显功能。

<template>
   <div>
      <h1>webSocket</h1>
      <input type="text" v-model="message" placeholder="add">
      <br/>
      <button @click="sendMessage">add</button>
      <div v-for="(message,index) in reactiveMessage" :key="index">
          {{ message }}
      </div>
   </div>
</template>

## 服务端实现

初始化一个 Node.js 项目

```bash
npm init -y
```

安装 ws 库

```bash
npm install ws
```

编写代码

```js
// 引入WebSocket库
const WebSocket = require('ws')

// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 3000 })

// 监听连接事件
wss.on('connection', function connection(ws) {
  console.log('Client connected')

  // 监听消息事件
  ws.on('message', function incoming(message) {
    console.log('Received:', message)

    // 广播消息给所有客户端
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })

  // 监听断开事件
  ws.on('close', function close() {
    console.log('Client disconnected')
  })
})
```

运行 server.js 文件即可。

现在在页面上输入字符后点击按钮即可观测到相关数据。
