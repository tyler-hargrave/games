//Setup
let bodyAll = document.querySelector("body *");
//bodyAll.style.display = "none";

//Initialized
const rps = ["rock.png", "paper.png", "scissors.png"];
let state = {};
state.p1 = 0;
state.p2 = 0;
state.ties = 0;

//Cache
let score1 = document.querySelector("#p1-score span");
let score2 = document.querySelector("#p2-score span");
let ties = document.querySelector("#ties-score span");
let tiesOuter = document.querySelector("#ties");
let btn = document.querySelector("button");

let pic1 = document.querySelector("#p1-img img");
pic1.setAttribute("src", rps[0]);
let pic2 = document.querySelector("#p2-img img");
pic2.setAttribute("src", rps[0]);
btn.addEventListener("click", playGame);
btn.style.height = btn.offsetWidth + "px";

//Events
function playGame() {
 tiesOuter.style.backgroundColor = "mediumorchid";
 tiesOuter.style.color = "white";
 pic1.style.backgroundColor = "";
 pic2.style.backgroundColor = "";

 state.score1 = Math.floor(Math.random() * 3);
 state.score2 = Math.floor(Math.random() * 3);
 pic1.setAttribute("src", rps[state.score1]);
 pic2.setAttribute("src", rps[state.score2]);

 let winner = 0;
 if (state.score1 === state.score2) {
  state.ties++;
 } else if (state.score1 === 0 && state.score2 === 1) {
  state.p2++;
  winner = 2;
 } else if (state.score2 === 0 && state.score1 === 1) {
  state.p1++;
  winner = 1;
 } else if (state.score1 === 1 && state.score2 === 2) {
  state.p2++;
  winner = 2;
 } else if (state.score2 === 1 && state.score1 === 2) {
  state.p1++;
  winner = 1;
 } else if (state.score1 === 2 && state.score2 === 0) {
  state.p2++;
  winner = 2;
 } else if (state.score2 === 2 && state.score1 === 0) {
  state.p1++;
  winner = 1;
 }

 if (winner === 0) {
  tiesOuter.style.backgroundColor = "yellow";
  tiesOuter.style.color = "black";
 } else if (winner === 1) pic1.style.backgroundColor = "yellow";
 else if (winner === 2) pic2.style.backgroundColor = "yellow";

 score1.innerHTML = state.p1;
 score2.innerHTML = state.p2;
 ties.innerHTML = state.ties;
}

//Ready
bodyAll.style.display = "auto";
