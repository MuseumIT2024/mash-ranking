"use strict";
const body = document.querySelector("body");
const background = document.querySelector(".background");
const countDisplay = document.querySelector(".countDisplay");
const result = document.querySelector(".result");

let count = 0;

// パソコンかスマートフォンか判定
const eventType = window.ontouchstart !== null ? "click" : "touchstart";
// クリックをカウント
const addCount = function (e) {
  count++;
  countDisplay.textContent = count;
  let x = e.pageX;
  let y = e.pageY;
  const mash = document.createElement("div");
  mash.style.top = y + "px";
  mash.style.left = x + "px";
  document.body.appendChild(mash);
  mash.className = "mash";
  mash.addEventListener("animationend", () => {
    mash.parentNode.removeChild(mash);
  });
};
// 背景を縮めるアニメーション
const shrinkAnim = function () {
  countDisplay.classList.remove("blink");
  body.removeEventListener(eventType, shrinkAnim);
  body.addEventListener(eventType, addCount);

  background
    .animate(
      {
        width: ["350px", "0px"],
        height: ["350px", "0px"],
        opacity: [1, 0.5, 1],
        offset: [0, 0.9],
      },
      { duration: 3000, fill: "forwards" }
    )
    .finished // ゲーム終了後の処理
    .then(() => {
      body.removeEventListener(eventType, addCount);
      result.textContent = "Click to return";
      result.classList.add("blink");
      result.addEventListener("click", () => {
        location.reload();
      });
      sendRanking(count);
    });
};
body.addEventListener(eventType, shrinkAnim);

// ランキング表示
const ranking = document.querySelector("#ranking");
fetchRanking().then((data) => {
  Object.keys(data).forEach((key) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = `${data[key].rank}`;
    tr.appendChild(td);
    const td2 = document.createElement("td");
    td2.textContent = `${data[key].name}`;
    tr.appendChild(td2);
    const td3 = document.createElement("td");
    td3.textContent = `${data[key].score}`;
    tr.appendChild(td3);
    ranking.appendChild(tr);
  });
});
