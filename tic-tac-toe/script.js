/*----- constants -----*/

/*----- app's state (variables) -----*/
let state = {};
state.starter = 1;
state.total = [0, 0, 0];
state.symbol = ["T", "R", "CAT'S GAME"];
state.background = ["red", "blue"];

/*----- cached element references -----*/
let squares = document.querySelectorAll(".square");

let subGrid = document.querySelector("#subGrid");
subGrid.style.height = subGrid.offsetWidth + "px";

let p1 = document.querySelector("#p1");
p1.style.height = p1.offsetWidth + "px";
p1.innerHTML = state.symbol[0];
p1.style.backgroundColor = state.background[0];
let p1Total = document.querySelector("#p1Total");

let p2 = document.querySelector("#p2");
p2.style.height = p2.offsetWidth + "px";
p2.innerHTML = state.symbol[1];
p2.style.backgroundColor = state.background[1];
let p2Total = document.querySelector("#p2Total");

let tiesTotal = document.querySelector("#tiesTotal");

let results = document.querySelector("#resultsText");
let playAgain = document.querySelector("#playAgain");

/*----- event listeners -----*/
subGrid.addEventListener("click", clickSquare);
playAgain.addEventListener("click", resetGame);

/*----- functions -----*/
function resetGame() {
 state.starter = (state.starter + 1) % 2;
 state.currentPlayer = 0;
 state.winner = undefined;
 state.grid = {};
 playAgain.style.display = "none";
 p1Total.innerHTML = state.total[0];
 p2Total.innerHTML = state.total[1];
 tiesTotal.innerHTML = state.total[2];

 updateGrid();
 checkWinner();
}
function clickSquare(e) {
 //Already a winner
 if (state.winner !== undefined) return;

 //Record the click
 if (state.grid[e.target.id] === undefined) {
  state.grid[e.target.id] = state.currentPlayer;
 } else {
  alert("Sorry, that square is taken.");
  return 1;
 }

 //Update Grid
 updateGrid();

 //Next Player
 state.currentPlayer = (state.currentPlayer + 1) % 2;

 //Check Winner
 console.log(state.grid);
 checkWinner();
}

function updateGrid() {
 squares.forEach((x) => {
  //No Pick
  if (state.grid[x.id] === undefined) {
   x.innerHTML = "";
   x.style.backgroundColor = "";
  }
  //Pick
  else {
   x.innerHTML = state.symbol[state.grid[x.id]];
   x.style.backgroundColor = state.background[state.grid[x.id]];
  }
 });
}
function checkWinner() {
 //Check Winner
 state.winner = undefined;
 //Rows
 for (let x = 1; x <= 3; x++) {
  if (
   state.grid[1 + 10 * x] === state.grid[2 + 10 * x] &&
   state.grid[1 + 10 * x] === state.grid[3 + 10 * x] &&
   state.grid[1 + 10 * x] !== undefined
  ) {
   state.winner = state.grid[1 + 10 * x];
  }
 }
 //Columns
 if (state.winner === undefined) {
  for (let y = 1; y <= 3; y++) {
   if (
    state.grid[10 + y] === state.grid[20 + y] &&
    state.grid[20 + y] === state.grid[30 + y] &&
    state.grid[10 + y] !== undefined
   ) {
    state.winner = state.grid[10 + y];
   }
  }
 }
 //Diagonal
 if (state.winner === undefined) {
  if (
   state.grid[11] === state.grid[22] &&
   state.grid[22] === state.grid[33] &&
   state.grid[22] !== undefined
  ) {
   state.winner = state.grid[11];
  } else if (
   state.grid[31] === state.grid[22] &&
   state.grid[22] === state.grid[13] &&
   state.grid[22] !== undefined
  ) {
   state.winner = state.grid[31];
  }
 }
 //Cat's Game
 if (state.winner === undefined) {
  let catsGame = true;
  squares.forEach((x) => {
   if (state.grid[x.id] === undefined) {
    catsGame = false;
   }
  });
  if (catsGame === true) state.winner = 2;
 }
 if (state.winner !== undefined) {
  console.log(state.winner);
  results.innerHTML = "Winner: " + state.symbol[state.winner];
  state.total[state.winner]++;
  playAgain.style.display = "";
 } else {
  results.innerHTML = "Next Player:" + state.symbol[state.currentPlayer];
 }

 //Cat's Game
}

/*-----Initial State -----*/
resetGame();
