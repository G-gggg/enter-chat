const koa = require("koa");
const http = require("http");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const static = require("koa-static");
const jwt = require("koa-jwt");
const jsonwebtoken = require("jsonwebtoken");
const { WebSocketServer } = require("ws");
const path = require("path");
const router = require("./app/router");
const socket = require("./app/controller/websocket");

//连接数据库
require("./app/util/dbConnect");
//创建app
const app = new koa();
//可用端口
let port = 8080;

//配置跨域
app.use(cors());

//静态资源访问
app.use(static(path.join(__dirname, "../file")));

// jwt 验证
// app.use(
//   jwt({ secret: "whisper" }).unless({
//     path: ["/api/users/login", "/api/users/register"],
//   })
// );

//获取jwt数据
app.use(async (ctx, next) => {
  let token = ctx.get("Authorization").split(" ")[1];
  if (token) {
    let decode = jsonwebtoken.verify(token, "whisper");
    ctx.jwt = decode;
  }

  await next();
});

//解析请求体数据
app.use(bodyParser());

//执行使用路由
app.use(router.routes());

//创建服务器
const server = http.createServer(app.callback());
const wsServer = new WebSocketServer({
  server,
});

wsServer.on("connection", (ws, req) => {
  let id = req.url.slice(1);
  socket.addConnect(id, ws);
});

//监听服务器启动连接
server.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
