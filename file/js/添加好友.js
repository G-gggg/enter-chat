import { ajax, connectSocket } from "./util.js";
const ws = connectSocket();

const searchInp = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const listEl = document.querySelector(".list");

searchBtn.onclick = async function () {
  let name = searchInp.value.trim();
  let res = await searchUser(name);

  let { code, msg, data } = res;

  let html = "";

  data.forEach((user) => {
    html += `<div class="item">
    ${user.nickname ?? user.username}
    <button data-id=${user._id} >添加为好友</button></div>`;
  });

  listEl.innerHTML = html;
};

listEl.onclick = async function (e) {
  let target = e.target;

  if (!target.matches("button")) return;

  let id = target.dataset.id;

  let res = await addFriend(id);

  let { code, msg } = res;

  if (code != 200) {
    alert(msg);
    return;
  }

  target.textContent = "已发送";
  target.disabled = true;
};

function addFriend(id) {
  return ajax({
    method: "POST",
    url: "/users/addFriend",
    data: {
      id,
    },
  });
}

function searchUser(name) {
  return ajax({
    method: "GET",
    url: "/users/search",
    params: {
      name,
    },
  });
}
