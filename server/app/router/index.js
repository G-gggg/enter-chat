const Router = require("@koa/router");
const user = require("../controller/user");
const message = require("../controller/message");

// 定义路由
const router = new Router();

router.prefix("/enterChat"); // 定义路由前缀

// 定义用户相关路由
router
  .post("/users/register", user.register) // 注册
  .post("/users/login", user.login) // 登陆
  .patch("/users/updateInfo", user.updateInfo) // 修改信息
  .post("/users/addFriend", user.addFriend) // 添加好友
  .post("/users/addBlack", user.addBlack) // 添加至黑名单
  .delete("/users/cancellation", user.cancellation) // 注销账号
  .post("/users/handleFriend", user.handleFriend) // 处理好友申请
  .get("/users/search", user.searchUser) // 搜索用户
  .get("/users/getApplyList", user.getApplyList) // 获取处理好友申请列表
  .get("/users/friends", user.getFriends); //获取好友列表

// 消息相关的路由
router
  .get("/messages/getList", message.getList) // 获取消息列表
  .post("/messages/add", message.add) // 添加消息
  .post("/messages/cancel", message.cancel) // 撤回消息
  .post("/messages/hide", message.hide); // 删除消息（隐藏）

// async function isAdmin(ctx, next) {
//   if (!ctx.jwt.isAdmin) {
//     return (ctx.body = {
//       code: 400,
//       msg: "权限不足",
//       data: null,
//     });
//   }

//   await next();
// }

module.exports = router;
