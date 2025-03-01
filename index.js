const express = require('express'); //引入express模块
const addr6Routes = require('./routes/addr6Routes'); //引入路由模块
const multer = require('multer'); //引入multer模块
const app = express(); //创建express应用

//设置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); //文件存储路径
  },
  filename: function (req, file, cb) {
    const userId = req.body.userId; //从请求体中获取userId
    const originalName = file.originalname; //获取原始文件名
    const newFileName = `${userId}-${originalName}`; //组合userId和原始文件名
    cb(null, newFileName); //使用新文件名
  }
});

//配置multer实例
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50 //文件大小限制为50M
  },
 }); 

//导出upload对象，以便在其他文件中使用
module.exports = {
  app,
  upload
};

//中间件错误处理
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "错误002:文件大小超出限制" });
    }
    return res.status(400).json({ error: "错误001:文件上传失败" });
  }
  next(err);
});

//使用JSON格式
app.use(express.json());
//使用路由中间件
app.use('/api/addr6', addr6Routes);

//设置服务器监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});