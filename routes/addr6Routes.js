const express = require('express'); //引入express模块
const multer = require('multer'); //引入multer模块
const addr6Controller = require('../controllers/addr6Controller'); //引入addr6Controller模块,作为控制器

// 初始化multer用于文件上传
const upload = multer({ dest: 'uploads/' }); //指定上传目录

const router = express.Router();

//定义路由，处理post请求
router.post('/', upload.single('file'), addr6Controller.analyzeAddress);

// 添加下载路由
router.get('/download/:filename', addr6Controller.downloadFile);

//导出路由对象
module.exports = router;