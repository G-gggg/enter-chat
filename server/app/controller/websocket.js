// 处理 websocket 逻辑
const UserModel = require("../model/usermodel");
const user = require("./user");
const wsMap = {};

class Socket {
  //   连接;
  constructor() {}

  // 添加连接;
  addConnect(id, ws) {
    wsMap[id] = ws;
  }

  // 添加好友;
  async addFriend(from, to) {
    let fromInfo = await UserModel.findById(from);
    wsMap[to]?.send(
      JSON.stringify({
        type: "addFriend",
        fromId: from,
        username: fromInfo.username,
        avatar: user.avatar,
      })
    );
  }

  // 发送消息;
  async sendMsg(from, to, content) {
    wsMap[to]?.send(
      JSON.stringify({
        type: "chat",
        fromId: from,
        toId: to,
        content: content,
      })
    );
  }
}

module.exports = new Socket();
