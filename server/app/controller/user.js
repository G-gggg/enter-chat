const UserModel = require("../model/usermodel");
const jsonwebtoken = require("jsonwebtoken");
const socket = require("./websocket");

class User {
  //   注册;
  async register(ctx) {
    let { username } = ctx.request.body;
    let isExist = await UserModel.findOne({ username });

    if (isExist) {
      return (ctx.body = {
        code: 200,
        msg: "用户名已存在",
      });
    }

    await UserModel.create(ctx.request.body);

    ctx.body = {
      code: 200,
      msg: "ok",
    };
  }

  //   登陆;
  async login(ctx) {
    let { username, password } = ctx.request.body;

    let user = await UserModel.findOne(
      { username, password, isDeleted: false },
      { password: false }
    );

    if (!user) {
      return (ctx.body = {
        code: 400,
        msg: "用户名或密码错误",
      });
    }

    return (ctx.body = {
      code: 200,
      msg: "ok",
      data: {
        token: jsonwebtoken.sign({ username, id: user._id }, "whisper"),
        user: user,
      },
    });
  }

  //   修改信息,包括用户名和密码和头像，上传头像
  async updateInfo(ctx) {
    const { username, password } = ctx.request.body;
    const { file } = ctx.request.files;
  
    try {
      const userId = ctx.state.user.userId;
  
      // 根据userId查询用户
      const user = await userModel.findOne({ _id: userId });
  
      // 更新用户信息
      if (username) user.username = username;
      if (password) user.password = password;
  
      // 上传头像
      if (file) {
        // 删除旧头像
        if (user.avatar) {
          const oldAvatarPath = path.join(__dirname, "../public", user.avatar);
          fs.unlinkSync(oldAvatarPath);
        }
  
        // 保存新头像路径
        const newAvatarPath = `/upload/${file.filename}`;
        user.avatar = newAvatarPath;
      }
  
      // 保存用户信息
      await user.save();
  
      ctx.body = {
        code: 200,
        msg: "修改成功",
        data: user,
      };
    } catch (error) {
      console.error(error);
      ctx.throw(500, "服务器内部错误");
    }
  }
  

  //   添加好友;
  async addFriend(ctx) {
    let { id } = ctx.request.body;

    let user = await UserModel.findByIdAndUpdate(
      id,
      { $push: { applyFriends: ctx.jwt.id } },
      { new: true, select: { password: false, isDeleted: false } }
    );

    // 使用 websocket 向对方发起请求
    socket.addFriend(ctx.jwt.id, id);

    ctx.body = {
      code: 200,
      msg: "ok",
      data: user,
    };
  }

  //   添加至黑名单;
  async addBlack(ctx) {
    let { id } = ctx.request.body;

    let user = await UserModel.findByIdAndUpdate(
      ctx.jwt.id,
      { $push: { blacklist: id } },
      { new: true, select: { password: false, isDeleted: false } }
    );

    ctx.body = {
      code: 200,
      msg: "ok",
      data: user,
    };
  }

  //   注销账号;
  async cancellation(ctx) {
    await UserModel.findByIdAndUpdate(ctx.jwt.id, {
      isDeleted: true,
    });

    ctx.body = {
      code: 200,
      msg: ok,
    };
  }

  //   处理好友申请;
  async handleFriend(ctx) {
    let { type, id } = ctx.request.body;

    switch (type) {
      case "0":
        await UserModel.findByIdAndUpdate(ctx.jwt.id, {
          $pull: { applyFriends: id },
        });
        break;
      case "1":
        await UserModel.findByIdAndUpdate(ctx.jwt.id, {
          $pull: { applyFriends: id },
          $push: { friends: id },
        });

        await UserModel.findByIdAndUpdate(id, {
          $push: { friends: ctx.jwt.id },
        });
        break;
    }

    ctx.body = {
      code: 200,
      msg: "ok",
    };
  }

  // 搜索用户
  async searchUser(ctx) {
    let { name } = ctx.request.query;

    let users = await UserModel.find(
      {
        $or: [{ username: { $regex: name } }, { nickname: { $regex: name } }],
      },
      ["_id", "username", "nickname", "avatar", "des"]
    );

    ctx.body = {
      code: 200,
      msg: "ok",
      data: users,
    };
  }

  // 获取当前用户的待处理好友申请
  async getApplyList(ctx) {
    // 存的id
    // 去到申请的 ID, 获取 ID 对应的用户信息

    // mongoose 数据聚合
    let data = await UserModel.findById(ctx.jwt.id).populate("applyFriends", [
      "_id",
      "username",
      "avatar",
    ]);

    ctx.body = {
      code: 200,
      msg: "ok",
      data: data.applyFriends,
    };
  }

  //  获取当前用户的好友列表;
  async getFriends(ctx) {
    let data = await UserModel.findById(ctx.jwt.id).populate("friends", [
      "_id",
      "username",
      "nickname",
      "avatar",
    ]);
    ctx.body = {
      code: 200,
      msg: "ok",
      data: data.friends,
    };
  }
}

module.exports = new User();
