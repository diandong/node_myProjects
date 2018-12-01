//新建 删除 修改 查看列表...
var express = require('express')
// 引入连接user数据库模块
var User = require('../models/user')
// 创建路由容器
var router = express.Router()


// 查询用户信息
router.get('/userlist', (req, res) => {

    User.find({}, (err, doc) => {
       
    })
})

//把 router 导出
module.exports = router