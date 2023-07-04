
// importing diceNum function
import roll from './components/dice.js'

let currentPlayer = 0;
let steppedOn;   // create variable for new position
let newPos;
let messageTop = "Roll the die to begin playing.";  // intial message at game screen 
let messageBottom = "";    // craete an empty string for bottom message 
let players = localStorage.getItem("players");
players = JSON.parse(players);
let diceNum;


// Display number of every field
for (let i = document.querySelectorAll(".pos").length - 1; i > 0; i--) {
    const element = document.querySelectorAll(".pos")[i];
    element.insertAdjacentHTML("beforeend", `<p>${element.id.slice(3)}</p>`);
}

// Remember initial state the board
const initialState = document.querySelector("body").outerHTML;

// Render pieces in starting position
for (let i = 0; i < players.length; i++) {
    players[i].position = 0;
    document.getElementById("pos0").innerHTML += `<img class="piece" id="${players[i].color}-piece" src="./assets/piece-${players[i].color}.png">`
}
displayBoard(0, messageTop, messageBottom);

// The checkDice function is called when the dice is rolled. It receives the dice result as a callback and updates the current player's position based on the dice number.

 
function checkDice(callback, playingNow) {
    diceNum = callback();
    players[playingNow].position += diceNum;
    messageTop = `${players[currentPlayer].name} rolled ${diceNum}.`;
    console.log(players)
    if (checkGameOver(players[playingNow].position)) {
        messageBottom = `<p>${players[currentPlayer].name} wins.</p>`;
        displayBoard(currentPlayer, messageTop, "", true);
    } else if (changeCheck(players[currentPlayer].position)) {
        if (checkGameOver(newPos)) {
            messageBottom = `<p>${players[currentPlayer].name} wins.</p>`;
            displayBoard(currentPlayer, messageTop, "", true); // calling display board function as per new information
        } else {
            players[playingNow].position = newPos;
            messageTop = `<p>${players[currentPlayer].name} rolled ${diceNum} and stepped on a ${steppedOn}! Move to position ${newPos}.</p>`;
            playerEndCheck(currentPlayer);
            messageBottom = `<p>It's ${players[currentPlayer].name}'s turn now.</p>`;
            displayBoard(currentPlayer, messageTop, messageBottom, false);
            // calling display board function as per new information 
        }
    } else {
        if (checkGameOver(players[currentPlayer].position)) {
            messageBottom = `<p>${players[currentPlayer].name} wins.</p>`;
            displayBoard(currentPlayer, messageTop, "", true);
            // calling display board function as per new information 
        } else {
            // if dice gets number lesser than 6 we update to turn to new palyer
            if (diceNum < 6) {
                playerEndCheck(currentPlayer);
                messageBottom = `<p>It's ${players[currentPlayer].name}'s turn now.</p>`;
                displayBoard(currentPlayer, messageTop, messageBottom, false);
            } else {
                // if player get 6 on dice he get chance to play again 

                messageBottom = `<p>It's ${players[currentPlayer].name}'s turn again.</p>`;
                displayBoard(currentPlayer, messageTop, messageBottom, false);
            }
        }
    }

}

// The playerEndCheck function checks if the current player is the last player in the players array. If so, it sets the current player to the first player; otherwise, it increments the current player.
function playerEndCheck(playingNow) {
    if (playingNow >= players.length - 1) {
        console.log(playingNow)
        currentPlayer = 0;
    } else {
        console.log(playingNow)
        currentPlayer++;
    }
}

// The checkGameOver function checks if a player's position is equal to or greater than 100, indicating that the player has won the game.
function checkGameOver(pos) {
    if (pos >= 100) {
        return true;
    }
    return false;
}
// for sound

function playSnakeSound() {
  // Get a reference to the snake audio element
  const snakeAudio = document.getElementById("snake-audio");

  // Play snake sound effect
  snakeAudio.play();
}


 // The changeCheck function checks if the player has landed on a position with a special effect. It retrieves the element at the player's position, checks if it has children, and if the first child is an image. If so, it extracts the position number from the image's ID and updates the newPos variable.
function changeCheck(pos) {
    let newPosElement = document.getElementById(`pos${pos}`); //select specific position of block
    let hasChildren = document.getElementById(`pos${pos}`).hasChildNodes();
    console.log(newPosElement);
    if (hasChildren) {
        if (newPosElement.firstElementChild.nodeName.toLowerCase() == `img` && pos < 100) {
            let changeId = newPosElement.firstElementChild.id;
            steppedOn = newPosElement.firstElementChild.classList[0];
            console.log(steppedOn)
            let sliceIndex;
            for (let i = 0; i < changeId.length; i++) {
                if (changeId[i] == "-") {
                    sliceIndex = i + 1;
                }
            }
            changeId = changeId.slice(sliceIndex);
            console.log(changeId);

            if (!isNaN(changeId)) {
              newPos = parseInt(changeId);

              // Check if it's a snake position
              if (steppedOn === "snake") {
                // Play snake sound effect
                playSnakeSound();
              }
              return true;
            }
        }
    }
    return false;
}

  // The displayBoard function is used to render the game board based on the current game state. It takes parameters such as the current player, top message, bottom message, and a flag indicating if the game is over.


   // at every dice roll we call displayboard function 
function displayBoard(playingNow, message1, message2, gameOver) {
  function clickHandler() {
    checkDice(roll, currentPlayer);
  }

  while (document.querySelector("body").firstChild) {
    document
      .querySelector("body")
      .removeChild(document.querySelector("body").lastChild);
  }

  document.querySelector("body").insertAdjacentHTML("beforeend", initialState);
  // if gameover we display this message
  if (gameOver) {
    alert(`${players[playingNow].name} wins!`);
    document.getElementById(
      `pos100`
    ).innerHTML += `<img class="piece" id="piece-${players[playingNow].color}" src="./assets/piece-${players[playingNow].color}.png">`;
    document.querySelector("main").style.filter = `grayscale(80%)`;
    document.querySelector("header").style.filter = `grayscale(80%)`;
    document.getElementById("start-container").style.visibility = "hidden";
    let newGame = `<div id="new-game" class="player-card"><h2>Game over!</h2>
        <a href="./index.html">Play again</a></div>`;
    document.querySelector("body").insertAdjacentHTML("beforeend", newGame);
  } else {
    document
      .getElementById("dice")
      .addEventListener("click", clickHandler, true);
    document.getElementById("info").innerHTML = message1;

    setTimeout(function () {
      document.getElementById("info").insertAdjacentHTML("afterend", message2);
    }, 400);

    for (let i = 0; i < players.length; i++) {
      document.getElementById(
        `pos${players[i].position}`
      ).innerHTML += `<img class="piece" id="piece-${players[i].color}" src="./assets/piece-${players[i].color}.png">`;
    }

    if (document.getElementById("pos0").hasChildNodes() == false) {
      document.getElementById("start-container").style.visibility = "hidden";
    } else {
      document.getElementById("starting-point").innerHTML = "Starting point:";
    }
  }
}

console.log(players)
