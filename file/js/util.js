
const baseUrl = "http://localhost:8080/enterChat";

function ajax({ url, method = "GET", params = {}, data = {} } = {}) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    url = `${baseUrl}${url}`;

    xhr.onload = function () {
      let response = JSON.parse(xhr.response);
      resolve(response);
    };

    xhr.onerror = reject;

    url = new URL(url);

    for (const key in params) {
      url.searchParams.append(key, params[key]);
    }

    xhr.open(method, url.href);

    if (method.toUpperCase() !== "GET") {
      xhr.setRequestHeader("Content-Type", "application/json;charset=utf8");
    }
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.token ?? ""}`);

    xhr.send(JSON.stringify(data));
  });
}

function connectSocket() {
  let user = localStorage.user && JSON.parse(localStorage.user);
  let ws = new WebSocket(`ws://localhost:5500/${user._id}`);

  ws.onmessage = (e) => {
    let data = JSON.parse(e.data);

    switch (data.type) {
      case "addFriend":
        alert("有新的好友请求，立即去处理");
        location.href = "/page/friendHandle.html";
        break;
      case "chat":
        if (
          !location.href.endsWith("index.html") &&
          !location.href.endsWith("/")
        ) {
          alert("有新的消息，立即去处理");
          location.href = "/index.html";
          return;
        }

        let targetFriend = document.querySelector(`[data-id="${data.fromId}"]`);
        console.log(targetFriend, `[data-id="${data.toId}"]`);

        if (targetFriend.classList.contains("active")) {
          let div = document.createElement("div");
          div.classList.add("message");
          div.innerHTML = `${targetFriend.textContent}: ${data.content}`;

          document.querySelector(".messages").append(div);
        } else {
          targetFriend.classList.add("new");
        }

        break;
    }
  };

  return ws;
}

export { ajax, connectSocket };
