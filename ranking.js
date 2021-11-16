"use strict";
let lastScore;

function sendRanking(score) {
  if (score >= lastScore) {
    const fd = new FormData();
    const name = prompt(
      "おめでとうございます！TOP3にランクインしました！",
      "名前を入力してください（8文字以内・省略可）"
    );
    if (!name) return;
    fd.append("name", name);
    fd.append("score", score);
    fetch("./ranking.php", {
      method: "POST",
      body: fd,
    }).catch((error) => {
      console.log(error);
    });
  }
}

function fetchRanking() {
  return fetch("./ranking.php")
    .then((response) => response.json())
    .then((data) => {
      if (Object.keys(data).length === 0) {
        lastScore = 0;
      } else {
        lastScore = data[Object.keys(data).sort().pop()].score;
      }
      return data;
    })
    .catch((error) => {
      console.log(error);
      return;
    });
}
