import { ajax } from "./util.js"

let usernameInp = document.querySelector('#username');
let passwordInp = document.querySelector('#password');
let rPasswordInp = document.querySelector('#rPassword');
let submitBtn = document.querySelector('#buttom');

submitBtn.onclick = async function () {
  let username = usernameInp.value.trim();
  let password = passwordInp.value.trim();
  let rPassword = rPasswordInp.value.trim();

  if (!username || !password || !rPassword) {
    alert("输入信息不完整");
    return;
  }

  if (password != rPassword) {
    alert("两次输入的密码不一致");
    return;
  }

  let res = await ajax({
    method: "POST",
    url: "/users/register",
    data: {
      username,
      password,
    },
  });

  let {
    code,
    msg,
    data
  } = res;

  if (code != 200) {
    alert(msg);
    return;
  }

// 跳转到登录页面
  location.href = "/page/login.html";
};