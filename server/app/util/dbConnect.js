const mongoose = require("mongoose");

const path = "mongodb://rh16_1:rh16_1_admin@103.52.154.61:27017/rh16_1";

//连接数据库
mongoose.connect(path);

mongoose.connection.on("open", async () => {
  console.log("数据库连接成功");
});

mongoose.connection.on("error", async () => {
  console.log("数据库连接失败");
  //进程结束
  process.exit();
});
