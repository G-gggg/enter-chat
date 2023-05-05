const multer = require("@koa/multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/upload"));
  },
  filename: function (req, file, cb) {
    if (req.url.includes("uploadChunk")) {
      let fileName = req.url.split("/").at(-1);
      cb(null, fileName);
    } else {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  },
});

const upload = multer({ storage: storage });

class Upload {
  uploadSign(ctx) {
    // console.log("ctx.request.file", ctx.request.file);
    // console.log("ctx.file", ctx.file);
    // console.log("ctx.request.body", ctx.request.body);
    ctx.body = {
      code: 200,
      msg: "上传成功",
      data: `/upload/${ctx.file.filename}`,
    };
  }

  async mergeFile(ctx) {
    let { filename, len } = ctx.request.body;

    let filePath = path.join(__dirname, "../public/upload", filename);
    let writeS = fs.createWriteStream(filePath);

    for (let i = 0; i < len; i++) {
      await merge(writeS, `${i}-${filename}`);
    }

    ctx.body = {
      code: 200,
      msg: "上传成功",
      data: `/upload/${filename}`,
    };
  }
}

function merge(wS, filePath) {
  return new Promise((resolve, reject) => {
    filePath = path.join(__dirname, "../public/upload", filePath);
    let rS = fs.createReadStream(filePath);

    rS.on("data", (chunk) => wS.write(chunk))
      .on("end", () => {
        resolve();
        fs.unlinkSync(filePath);
      })
      .on("error", reject);
  });
}

module.exports = {
  upload,
  uploadController: new Upload(),
};
