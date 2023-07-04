// select player number container using getelementbyid
let playerNumberContainer = document.getElementById("player-number-container");
// select player customization button by using getelement by id 
let playerCustomizationBtn = document.getElementById("player-customization-btn");
let players = [];  // create an array of players

let playerNumber;  // for players count 

// Function to generate the HTML code for a player customization card
function playerCustomizationCardGenerator(index) {
    return `<div id="player${index}-card" class="content player-card">
                <div class="name">
                    <label for="player${index}-name">
                        Player ${index}, type your name:
                    </label>
                    <input class="player-name" type="text" id="player${index}-name" onChange="insertName(event, ${index})"required>
                </div>
                <div class="color">
                    <label for="player${index}-color">
                        Click to select color:
                    </label>
                    <ul id="player${index}-color">
                        <li><img class="red" src="./assets/piece-red.png" onClick="selectColor(${index}, 'red')"></li>
                        <li><img class="blue" src="./assets/piece-blue.png" onClick="selectColor(${index}, 'blue')"></li>
                        <li><img class="green" src="./assets/piece-green.png" onClick="selectColor(${index}, 'green')"></li>
                        <li><img class="yellow" src="./assets/piece-yellow.png" onClick="selectColor(${index}, 'yellow')"></li>
                    </ul>
                </div>
            </div>`
}

// Function to handle color selection for a player

function selectColor(index, color) {
    if (!players[index-1]) {
        players.push({color});
    } else {
        players[index-1].color = color
    }
    
    console.log(players)
}

// Function to handle name insertion for a player

function insertName(e, index) {
    let name = e.target.value

    if (!players[index-1]) {
        players.push({name});
    } else {
        players[index - 1].name = name
    }
    console.log("Players in name func", players);
}

 // Function to handle player customization
 // The playerCustomization function is called when the user clicks the customization button. It validates the selected player number and proceeds to generate the necessary HTML elements for player customization cards.

function playerCustomization() {
  playerNumber = document.getElementById("player-number").value;

    
    // condition for minimum 2 palyers and maximum  4 palyers
  if (playerNumber < 2 || playerNumber > 4) {
    alert("Please select a number between 1 and 4.");
  } else {
    // Hide player number container and create customization section
    playerNumberContainer.style.display = "none";
    document.querySelector("body").style.height = "100%";
    document
      .querySelector("body")
      .insertAdjacentHTML(
        "beforeend",
        `<section id="customize-players"></section>`
      );

    // Generate player customization cards
    // this for creating player cards as per user input
    for (let i = 1; i <= playerNumber; i++) {
      document
        .querySelector("#customize-players")
        .insertAdjacentHTML("beforeend", playerCustomizationCardGenerator(i));
    }

    // Show player customization cards
    for (let i = 1; i <= playerNumber; i++) {
      document.getElementById(`player${i}-card`).style.display = "block";
    }

    // Add "Next" links between player customization cards
    for (let i = 1; i < playerNumber; i++) {
      document
        .getElementById(`player${i}-card`)
        .insertAdjacentHTML(
          "beforeend",
          `<a href="#player${i + 1}-card"/>Next</a>`
        );
    }

    // Add "Start Game" button
    document.querySelector(
      "body"
    ).innerHTML += `<button id="to-game-btn" class="button">Start Game!</button>`;

    // Add event listener to "Start Game" button
    document
      .getElementById("to-game-btn")
      .addEventListener("click", () =>
        toGame(colorCheck, playerNumCheck, nameCheck)
      );
  }

  // Add event listeners to color selection images
  const uls = document.querySelectorAll("li");
  for (let i = 0; i < uls.length; i++) {
    const element = uls[i];
    element.addEventListener("click", function (e) {
      let list = e.target.parentElement.parentElement;
      for (let i = 0; i < list.children.length; i++) {
        let piece = list.children[i];
        if (piece.firstChild.classList.contains("animated")) {
          console.log(piece.firstChild.classList.contains("animated"));
          piece.firstChild.classList.remove("animated");
        }
      }
      e.target.classList.add("animated");
    });
  }
}
  // Function to check if there are duplicate colors selected
function colorCheck() {
    let colors = [];  // craete array to store colors
    for (const player of players) {
        colors.push(player.color);
        if (player.color == undefined) {
            return true;
        }
    }

    colors.sort();
    for (let i = 0; i < colors.length; i++) {
        for (let j = i+1; j < colors.length; j++) {
            if (colors[i] == colors[j]) {
                return true;
            }
        }
    }

    return false;
}

  // Function to check if there are insufficient players

function playerNumCheck() {
    if (players.length > 1) {
        return false;
    }
    return true;
}

function nameCheck() {
    for (const player of players) {
        if (player.name == "") {
            return true;
        }
    }
    return false;
}

// Add an event listener to a button element
document.getElementById("player-customization-btn").addEventListener("click", function() {
  const backgroundAudio = document.getElementById("backgroundAudio");
  backgroundAudio.play();
});


 // Function to handle the transition to the game page
 // its check all the condition and move on the game page ,if any condition doesnt match then throw an error
function toGame(color, name, nameandcolor) {
    if (color()) {
        alert("Please pick unique colors for each player.");
    } else if (name()) {
        alert("Please select name and color for all players.")
    } else if (nameandcolor()) {
        alert("Please insert a name for all players.")
    } else {
        console.log(players);
        localStorage.setItem("players", JSON.stringify(players));
        window.location.href = "./game.html";
    }
}