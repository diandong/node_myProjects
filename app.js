/**
 * app.js 入口模块
 * 任务:
 *      启动服务
 *      做一些服务器相关配置
 *         1 模板引擎
 *              app.engine('html', require('express-art-template'))
 *         2 body-parser 解析表单 post 请求体
 *         3 提供静态资源服务
 *              app.use('/public/', express.static(path.join(__dirname,'./public/')))
 *         4 挂载路由 
 *              app.use(router)
 *         5 监听端口启动服务
 */

var express = require('express')
var path = require('path')
var bodyparser = require('body-parser')
var session = require('express-session')

//引入路由文件 routes.js 可以省略js后缀
var sessionRouter = require('./routes/session')
var homeRouter = require('./routes/home')


var app = express()

//express 静态服务 API express.static('./node_modules/')
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/public/', express.static(path.join(__dirname, './public/')))

//配置模板引型和 body-parser 一定要在 app.use(router) 挂载路由之前
app.engine('html', require('express-art-template'))

//配置解析表单 POST 请求体插件 (一定要在 app.use(router) 之前)
//parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({
    extended: false
}))
//parse application/json
app.use(bodyparser.json())

// 在 Express 这个框架中，默认不支持 Session 和 Cookie
// 但是我们可以使用第三方中间件：express-session 来解决
// 1. npm install express-session
// 2. 配置 (一定要在 app.use(router) 之前)
// 3. 使用
//    当把这个插件配置好之后，我们就可以通过 req.session 来发访问和设置 Session 成员了
//    添加 Session 数据：req.session.foo = 'bar'
//    访问 Session 数据：req.session.foo

app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))


//把路由容器挂载到 app 服务中
app.use(sessionRouter)
app.use(homeRouter)

app.listen(3000, () => {
    console.log('服务器启动成功 3000')
})