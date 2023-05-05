import { ajax } from "./util.js"

let submitBtn = document.querySelector('.btn');
let usernameInp = document.querySelector('#username');
let passwordInp = document.querySelector('#password');


submitBtn.onclick = async function () {
    let username = usernameInp.value.trim()
    let password = passwordInp.value.trim()

    if (!username || !password) {
        alert("输入信息不完整")
        return
    }

    let res = await ajax({
        method: "POST",
        url: "/users/login",
        data: {
            username,
            password
        }
    })

    let { code, msg, data } = res

    if (code != 200) {
        alert(msg)
        return
    }

    // 保存token
    localStorage.token = data.token
    localStorage.user = JSON.stringify(data.user)

    location.href = "/page/index.html"
}   