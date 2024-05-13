const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 
const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(cors());

// 路由示例
app.get('/', (req, res) => {
    res.send('你好，世界！');
});

const users = [
    { id: 1, name: 'User 1', age: 25 },
    { id: 2, name: 'User 2', age: 30 },
    { id: 3, name: 'User 3', age: 28 }
];

// 定义 getUserInfo 接口
app.get('/getUserInfo', (req, res) => {
    res.json(users);
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
