//注册 登录 退出 (相关会话路由)
// 引入模块
var express = require('express')
// 引入连接user数据库模块
var User = require('../models/user')
// 引入加密模块
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html', {
        user: req.session.user
    })
})
// 登录
router.get('/login', (req, res) => {
    res.render('login.html')
})

router.post('/login', (req, res) => {
    // 1. 获取表单数据
    // 2. 查询数据库用户名密码是否正确
    // 3. 发送响应数据
    var body = req.body
    //db.collection.findOne(query, projection)
    //返回条件所匹配的一条数据,如多条则反查到第一条
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        //判断是否成功,如果错发返回状态码和错误信息
        if (err) {
            //Express 提供了一个响应方法: json()
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }

        //如果邮箱和密码匹配,则 user 是查到的用户对象,否则为 null
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        //用户存在,登陆成功,通过 Seession 记录登陆状态
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })
})

// 注册
router.get('/register', (req, res) => {
    res.render('register.html')
})

router.post('/register', (req, res) => {
    // 1. 获取表单提交的数据
    //    req.body
    // 2. 操作数据库
    //    判断改用户是否存在
    //    如果已存在，不允许注册
    //    如果不存在，注册新建用户
    // 3. 发送响应    
    var body = req.body
    //查询邮箱和昵称,返回错误和数据
    User.findOne({
        $or: [{
            email: body.email
        }, {
            nickname: body.nickname
        }]
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: '服务端错误'
            })
        }
        //成功返回的数据
        if (data) {
            //邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists.'
            })
        }
        //对密码进行 md5 重复加密
        body.password = md5(md5(body.password))

        new User(body).save((err, user) => {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internal error.'
                })
            }

            //注册成功, 使用 Session 记录用户的登陆状态 
            req.session.user = user

            //Express 提供了一个响应方法: json()
            //该方法接收一个对象作为参数,它会自动帮你把对象转为字符串再发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })

            //服务端重定向只针对同步请求才有效,异步请求无效
            //res.redirect('/')
        })
    })
})

//清除登陆状态
router.get('/logout', (req, res) => {
    req.session.user = null
    //重定向到登陆页
    res.redirect('/login')
})



//把 router 导出
module.exports = router