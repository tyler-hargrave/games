/*----- CONSTANTS -----*/
const NUM_DICE = 6;
const NUM_CHECKERS = 15;

//HTML for the squares
let spaceHTML = {};
for (let player = 1; player <= 2; player++) {
 for (let i = 1; i <= NUM_CHECKERS; i++) {
  let thisHTML = "";
  for (let j = 1; j <= Math.min(i - 1, 4); j++) {
   thisHTML += '<i class="p' + player + ' fa-solid fa-circle"></i>';
  }
  if (i <= 5) thisHTML += '<i class="p' + player + ' fa-solid fa-circle"></i>';
  else thisHTML += '<i class="p' + player + ' fa-solid fa-circle-plus"></i>';
  spaceHTML["p" + player + "-" + i] = thisHTML;
 }
}

/*----- STATE -----*/
let state = {};
state.p1 = "";
state.p2 = "";
state.penalty1 = 0;
state.penalty2 = 25;
state.goal1 = 25;
state.goal2 = 0;
state.typeP2 = "computer";
state.dice1 = 1;
state.dice2 = 1;
state.dice3 = 0;
state.dice4 = 0;

/*----- CACHE-----*/
const $landing = $("#landing");
const $setup = $("#setup");
const $game = $("#game");

const $players = $("#players");
const $playerName1 = $("#playerName1");
const $movesRemaining1 = $("#movesRemaining1");
const $crown1 = $("#crown1");
const $playerName2 = $("#playerName2");
const $movesRemaining2 = $("#movesRemaining2");
const $crown2 = $("#crown2");

const $header = $("header h1");

const $inputP1 = $("#inputP1");
const $inputP2 = $("#inputP2");
const $computerP2 = $("#computerP2");
const $personP2 = $("#personP2");
const $startGame = $("#startGame");

const $dice1 = $("#dice1");
const $dice2 = $("#dice2");
const $rollDice = $("#rollDice");
const $diceInstructions = $("#diceInstructions");
$diceInstructions.hide();

/*----- EVENT LISTENERS-----*/
$inputP1.change((e) => {
 state.p1 === e.target.value;
});
$computerP2.click(toggleP2);
$personP2.click(toggleP2);
$inputP2.change((e) => {
 state.p2 === e.target.value;
});
$startGame.click(startGame);
$rollDice.click(rollDice);

/*----- FUNCTIONS -----*/
function checkMoves() {
 state.allMoves;
}
function changePlayer() {
 console.log("changePlayer", state.currentPlayer, state.otherPlayerg4);
 $(".playerDetails").removeClass("myTurn");

 //Can't change before we start the game
 if (state.currentPlayer !== undefined) {
  state.otherPlayer = state.currentPlayer;
  state.currentPlayer = (state.currentPlayer % 2) + 1;
  $("#playerDetails" + state.currentPlayer).addClass("myTurn");
 }

 $rollDice.show();
 $rollDice.removeAttr("disabled");
 $diceInstructions.hide();

 if (state.currentPlayer === 2 && state.typeP2 === "computer") $rollDice.click();
}
function cleanSquareReturnId(i) {
 let $id = $("#space" + i);

 $id.removeClass("moveAvailable");
 $id.removeClass("targetAvailable");
 $id.off("click");
 return $id;
}
function completeMove() {
 console.log("completeMove", state);
 if (state.currentPlayer === 1 || state.typeP2 !== "computer") state.targetSquare = this.id;

 //currentSquareNum
 state.currentSquareNum = 1 * state.currentSquare.substring("space".length);

 //targetSquareNum
 state.targetSquareNum = 1 * state.targetSquare.substring("space".length);
 if (isNaN(state.targetSquare))
  state.targetSquareNum = state.targetSquare.substring("space".length);

 //takeover the square
 if (state["board" + state.otherPlayer][state.targetSquareNum] === 1) {
  console.log("takeover?");
  state["board" + state.otherPlayer][state.targetSquareNum] = 0;
  if (state["board1"][0] === undefined) state["board1"][0] = 0;
  if (state["board2"][25] === undefined) state["board2"][25] = 0;
  if (state.otherPlayer === 1) state["board1"][0] += 1;
  if (state.otherPlayer === 2) state["board2"][25] += 1;
 }
 //updateBoard
 state["board" + state.currentPlayer][state.currentSquareNum] -= 1;
 if (state["board" + state.currentPlayer][state.targetSquareNum] === undefined)
  state["board" + state.currentPlayer][state.targetSquareNum] = 0;
 state["board" + state.currentPlayer][state.targetSquareNum] += 1;
 updateScore();
 updateBoard();

 //Set ONE Dice to Zero
 if (state.targetSquareNum !== "Goal" + state.currentPlayer)
  for (let i = 1; i <= 4; i++) {
   if (
    state["dice" + i] === state.targetSquareNum - state.currentSquareNum ||
    -1 * state["dice" + i] === state.targetSquareNum - state.currentSquareNum
   ) {
    state["dice" + i] = 0;
    break;
   }
  }
 //Special Case for Goal1
 else if (state.targetSquareNum === "Goal1") {
  for (let j = 25; j <= 30; j++) {
   for (let i = 1; i <= 4; i++) {
    if (state["dice" + i] === j - state.currentSquareNum) {
     state["dice" + i] = 0;
     i = 5; //break
     j = 31; //break
    }
   }
  }
 }
 //Special Case for Goal2
 else if (state.targetSquareNum === "Goal2") {
  for (let j = 0; j >= -5; j--) {
   for (let i = 1; i <= 4; i++) {
    if (-1 * state["dice" + i] === j - state.currentSquareNum) {
     state["dice" + i] = 0;
     i = 5; //break
     j = -6; //break
    }
   }
  }
 }

 //startTurn again (i.e. with less dice)
 startTurn();
}
function landingPage() {
 //initial display
 $setup.css("display", "grid").hide();
 $game.css("display", "grid").hide();

 //fade in and then fade out to the setup
 let time = 100;
 let j = 1;
 for (let i = 1; i <= 10; i++) {
  setTimeout(() => {
   $("#landing *:nth-child(" + j + ")").fadeIn(2 * time);
   j++;
  }, i * time);
  if (i === 6) {
   setTimeout(() => {
    $landing.fadeOut(time);
   }, i * time);
  }
  if (i === 7) {
   setTimeout(() => {
    $setup.fadeIn(time);
    $header.fadeIn(time);
   }, i * time);
  }
 }

 //complete
}
function newGame() {
 //SETUP BOARD
 state.board1 = {
  1: 2,
  12: 5,
  17: 3,
  19: 5,
 };
 state.board2 = {
  24: 2,
  13: 5,
  8: 3,
  6: 5,
 };
 updateBoard();
 updateScore();
}
function findAllMoves(allowPastGoal = false) {
 result = {};
 //Penalty
 state.penaltyOn = false;
 penaltysquareID = state["penalty" + state.currentPlayer];
 penaltySquare = state["board" + state.currentPlayer][penaltysquareID];
 if (penaltySquare !== undefined && penaltySquare > 0) state.penaltyOn = true;

 //Up to Four Dice
 for (let i = 1; i <= 4; i++) {
  if (state["dice" + i] === 0) continue;
  else if (state.penaltyOn) {
   if (result[penaltysquareID] === undefined) result[penaltysquareID] = new Set();
   let x = findMoves(penaltysquareID, state["dice" + i]);
   if (x > -1) result[penaltysquareID].add(x);
  } else {
   for (let space = 1; space <= 24; space++) {
    if (state["board" + state.currentPlayer][space] !== undefined) {
     if (state["board" + state.currentPlayer][space] > 0) {
      if (result[space] === undefined) result[space] = new Set();
      let x = findMoves(space, state["dice" + i], allowPastGoal);
      if (x !== -1) result[space].add(x);
     }
    }
   }
  }
 }
 //Update CSS ONLY IF NOT COMPUTER
 let movesFound = false;
 if (state.currentPlayer === 1 || state.typeP2 !== "computer") {
  for (let j = -1; j <= 26; j++) {
   let i = j;
   if (i === -1) i = "Goal1";
   if (i === 26) i = "Goal2";

   let $id = $("#space" + i);

   $id.removeClass("moveAvailable");
   $id.removeClass("targetAvailable");
   $id.off("click", "**");
   if (result[i] === undefined || result[i].size === 0) {
    //do nothing
   } else {
    movesFound = true;
    $id.addClass("moveAvailable");
    $id.on("click", selectSquare);
   }
  }
 }

 //RECURSION IF NOTHING FOUND ONE TIME ONLY
 if (!movesFound && !allowPastGoal) return findAllMoves(true);

 return result;
}
function findAllTargets() {
 console.log("findAllTargets", state);

 //CurrentSquare
 let square;
 if (state.currentSquare === "penaltyP1") square = 0;
 else if (state.currentSquare === "penaltyP1") square = 25;
 else square = 1 * state.currentSquare.substring("space".length);

 //squares
 for (let j = -1; j <= 26; j++) {
  let i = j;
  if (i === -1) i = "Goal1";
  if (i === 26) i = "Goal2";
  $id = cleanSquareReturnId(i);
  if (state.allMoves[square].has(i)) {
   if (i !== 0 && i !== 25) {
    //can't move to penalties!
    $id.addClass("targetAvailable");
    $id.on("click", completeMove);
   }
  }
 }
}
function findMoves(space, dice, allowPastGoal = false) {
 //Player 2 goes "backwards"
 if (state.currentPlayer === 2) dice *= -1;

 //ENDGAME Player 1
 if (state.endGame1 && (state.currentPlayer === 1) & (space + dice >= 25)) {
  if (allowPastGoal || space + dice === 25) {
   return "Goal1";
  }
 }

 //ENDGAME Player 2
 if (state.endGame2 && (state.currentPlayer === 2) & (space + dice <= 0)) {
  if (allowPastGoal || space + dice === 0) {
   return "Goal2";
  }
 }

 //NORMAL Play
 if (space + dice > 0 && space + dice < 25) {
  if (
   state["board" + state.otherPlayer][space + dice] !== undefined &&
   state["board" + state.otherPlayer][space + dice] >= 2
  ) {
   //Can't move here
  } else {
   return space + dice;
  }
 }

 return -1;
}
function finishGame() {
 //Dice Instructions
 if (state.score1 === 0) $diceInstructions.html("<h2>WINNER!<br/>" + state.p1 + "</h2>");
 else $diceInstructions.html("<h2>WINNER!<br/>" + state.p2 + "</h2>");

 //Retry Button
 $diceInstructions.html($diceInstructions.html() + "<br/><button id='newGame' >New Game </button>");
 $("#newGame").click(() => location.reload());

 $dice1.html("");
 $dice2.html("");
 $rollDice.hide();
 $diceInstructions.show();
 $(".myTurn").removeClass("myTurn");
}
function rollDice() {
 let time = 100;
 $rollDice.attr("disabled", true);

 //SHOW A NICE PICTURE
 let diceHTML = [
  0,
  '<i class="p1 fa-solid fa-dice-one"></i>',
  '<i class="p1 fa-solid fa-dice-two"></i>',
  '<i class="p1 fa-solid fa-dice-three"></i>',
  '<i class="p1 fa-solid fa-dice-four"></i>',
  '<i class="p1 fa-solid fa-dice-five"></i>',
  '<i class="p1 fa-solid fa-dice-six"></i>',
 ];

 //ROLL THE DICE
 for (i = 1; i <= 20; i++) {
  let time = 50;
  if (i % 2 === 1) {
   setTimeout(() => {
    state.dice1 = Math.ceil(Math.random() * 6);
    if (state.dice1 === state.dice2) {
     state.dice3 = state.dice1;
     state.dice4 = state.dice1;
    } else {
     state.dice3 = 0;
     state.dice4 = 0;
    }
    $dice1.html(diceHTML[state.dice1]);
   }, i * time);
  } else {
   setTimeout(() => {
    state.dice2 = Math.ceil(Math.random() * 6);
    if (state.dice1 === state.dice2) {
     state.dice3 = state.dice1;
     state.dice4 = state.dice1;
    } else {
     state.dice3 = 0;
     state.dice4 = 0;
    }
    $dice2.html(diceHTML[state.dice2]);
   }, i * time);
  }
  if (i === 20) {
   setTimeout(() => {
    if (state.currentPlayer === undefined) {
     if (state.dice1 === state.dice2) {
      rollDice();
     } else if (state.dice1 > state.dice2) {
      state.currentPlayer = 1;
      state.otherPlayer = 2;
      $("#playerDetails" + state.currentPlayer).addClass("myTurn");
      startTurn();
     } else {
      state.currentPlayer = 2;
      state.otherPlayer = 1;
      $("#playerDetails" + state.currentPlayer).addClass("myTurn");
      startTurn();
     }
    } else {
     startTurn();
    }
   }, i * time);
  }
 }
}
function selectSquare(e) {
 state.currentSquare = this.id;
 findAllTargets();
}
function startGame() {
 //Players
 $inputP1.change();
 $inputP2.change();
 if (state.p1 === "") state.p1 = "Player 1";
 if (state.typeP2 === "computer") state.p2 = "Frank";
 else if (state.p2 === "") state.p2 = "Player 2";

 //Board
 newGame();

 //Gameboard
 let time = 1000;
 $setup.fadeOut(time);
 setTimeout(() => {
  $game.fadeIn(time);
 }, time);
}
function startTurn() {
 $diceInstructions.html(state["p" + state.currentPlayer] + "'s Turn");
 $rollDice.hide();
 $diceInstructions.show();

 //FIND THE AVAILABLE MOVES
 state.allMoves = findAllMoves();

 //No moves? Change player
 if (jQuery.isEmptyObject(state.allMoves)) {
  changePlayer();
  return;
 } else {
  let hasMoves = false;
  Object.entries(state.allMoves).forEach((item) => {
   [...item[1].values()].forEach((x) => {
    if (x > 0) hasMoves = true;
    if (x === "Goal1") hasMoves = true;
    if (x === "Goal2") hasMoves = true;
   });
  });
  if (hasMoves === false) {
   changePlayer();
   return;
  }
 }

 if (state.currentPlayer === 2) {
  if (state.typeP2 === "computer") {
   let keys = Object.keys(state.allMoves);
   let prop = keys[Math.floor(Math.random() * keys.length)];
   if (state.allMoves[prop] === undefined || state.allMoves[prop].size === 0) {
    startTurn();
   } else {
    let setArray = [...state.allMoves[prop].values()];
    state.currentSquare = "space" + prop;
    state.targetSquare = "space" + setArray[Math.floor(Math.random() * setArray.length)];
    setTimeout(completeMove, 1000);
   }
  }
 }
}
function toggleP2() {
 if (state.typeP2 === "computer") state.typeP2 = "person";
 else state.typeP2 = "computer";
 $inputP2.val("");
 $inputP2.change();
 updateTypeP2();
}
function updateBoard() {
 console.log("updateBoard", state);

 //CHECKERS
 for (let j = -1; j <= 26; j++) {
  let i = j;
  if (i === -1) i = "Goal2";
  if (i === 26) i = "Goal1";
  let $id = cleanSquareReturnId(i);
  $id.html("");
  //NORMAL SQUARE
  if (state.board1[i] > 0 && j != 25) {
   $id.html(spaceHTML["p1-" + state.board1[i]]);
  } else if (state.board2[i] > 0 && j != 0) {
   $id.html(spaceHTML["p2-" + state.board2[i]]);
  }
 }

 //NAME TAGS
 $playerName1.html(state.p1);
 $playerName2.html(state.p2);
}
function updateScore() {
 for (i = 1; i <= 2; i++) {
  state["score" + i] = 0;
  state["endGame" + i] = true;
  state["checkers" + i] = 0;
  let scoreMax = 25;
  let multiplier = 1;
  if (i === 2) {
   scoreMax = 0;
   multiplier = -1;
  }
  Object.entries(state["board" + i]).forEach((x) => {
   if (x[0] !== "Goal" + i) {
    state["score" + i] += multiplier * (scoreMax - x[0]) * x[1];
    state["checkers" + i] += x[1];

    if (i == 1 && x[1] > 0 && x[0] < 19) state.endGame1 = false;
    if (i == 2 && x[1] > 0 && x[0] > 6) state.endGame2 = false;
   }
  });
  state["board" + i]["Goal" + i] = NUM_CHECKERS - state["checkers" + i];
 }
 $movesRemaining1.html(state.score1);
 $movesRemaining2.html(state.score2);
 $crown1.hide();
 $crown2.hide();
 if (state.score1 <= state.score2) $crown1.show();
 if (state.score1 >= state.score2) $crown2.show();

 if (Math.min(state.score1, state.score2) === 0) finishGame();
}
function updateTypeP2() {
 $computerP2.css("color", "var(--hidden)");
 $personP2.css("color", "var(--hidden)");
 if (state.typeP2 === "computer") $computerP2.css("color", "var(--p2)");
 else $personP2.css("color", "var(--p2)");
}
function render() {
 landingPage();
 updateTypeP2();
}
render();
