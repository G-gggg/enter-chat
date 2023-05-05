const MessageModel = require("../model/message");
const socket = require("./websocket");

class Msg {
  // 添加消息
  async add(ctx) {
    let { msg, toId } = ctx.request.body;

    let res = MessageModel.create({ // 创建消息
      content: msg,
      from: ctx.jwt.id,
      to: toId,
    });

    socket.sendMsg(ctx.jwt.id, toId, msg);

    ctx.body = {
      code: 200,
      msg: "ok",
      data: res,
    };
  }

  // 撤回自己2分钟内发的消息
  async cancel(cxt) {
    ctx.body = "cancel";
  }

  // 删除消息（隐藏）
  async hide(ctx) {
    ctx.body = "hide";
  }

  // 获取消息列表
  async getList(ctx) {
    let { id } = ctx.request.query;

    let res = await MessageModel.find({
      $or: [
        { from: id, to: ctx.jwt.id },
        { from: ctx.jwt.id, to: id },
      ],
    })
      .populate("from", ["username"])
      .populate("to", ["username"]);

    await MessageModel.updateMany(
      { from: id, to: ctx.jwt.id },
      { $set: { isRead: true } },
      { new: true }
    );

    ctx.body = {
      code: 200,
      msg: "ok",
      data: res,
    };
  }
}

module.exports = new Msg();
