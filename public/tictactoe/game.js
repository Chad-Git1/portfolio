// DOM elements
const cells = document.querySelectorAll('.cell');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const aiDifficultySelect = document.getElementById('ai-difficulty');
const leaderboardWins = document.getElementById('wins');
const leaderboardLosses = document.getElementById('losses');
const leaderboardTies = document.getElementById('ties');

// Game variables
let board = Array(9).fill(null);
let gameActive = false;
let currentPlayer = 'X';

const winCond = [
     /*  List of all the winning conditions.
        For example:

        [0, 1, 2]
        |---------|---------|---------|
        |    X    |    X    |    X    |
        |---------|---------|---------|
        |         |         |         |
        |---------|---------|---------|
        |         |         |         |
        |---------|---------|---------|

        Or

        [0, 4, 8]
        |---------|---------|---------|
        |    X    |         |         |
        |---------|---------|---------|
        |         |    X    |         |
        |---------|---------|---------|
        |         |         |    X    |
        |---------|---------|---------|
    */
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function toggleStartGame() {
    /**
     * Toggle the visibility of buttons
     */
    resetButton.style.display = 'block';
    startButton.style.display = 'none';
    aiDifficultySelect.style.display = 'none';
}

function toggleResetGame() {
    /**
     * To reset the game
     */
    resetButton.style.display = 'none';
    startButton.style.display = 'block';
    aiDifficultySelect.style.display = 'block';
}

function startGame() {
    /**
     * Funtion that starts the game
     */
    toggleStartGame();
    gameActive = true;
    currentPlayer = 'X';
    resetBoard();
    fetchGameState(); // Fetch from PHP
}

function resetGame() {
    /**
     * Function to reset the game
     */
    toggleResetGame();
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('spin');
    });
    gameActive = false;
    currentPlayer = 'X';
    fetchLeaderboard(); // Refresh leaderboard from PHP
}

// Event listener for cell clicks, reset button, and start button
cells.forEach(cell => cell.addEventListener('click', onClick));
resetButton.addEventListener('click', resetGame);
startButton.addEventListener('click', startGame);

function onClick(e) {
    /*
        Handles onClick events for the cells.
    */

    // Gets index of cell
    const index = e.target.dataset.index;

    // If the cell doesn't exist on the board, the game is not active or the current player is not the user (X), then return
    if (board[index] !== null || !gameActive || currentPlayer !== 'X') {
        return;
    }

    // Set a X on the board at the cell with clicked (using the cell index) and also set the text on the cell itself to 'X'
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    // Check if user has won, if so display win message, else if it's a tie display tie message, else change turn to "ai"/computer
    if (checkWin(currentPlayer)) {
        displayMsg(`You Win`, 'win');
        gameActive = false;
        spinAnimation();
    } else if (board.every(cell => cell !== null)) {
        displayMsg("Tie", 'tie');
        gameActive = false;
    } else {
        currentPlayer = 'O';
        setTimeout(processComputer, 1000);
    }
}

function processComputer() {
    /*
        Function that plays "ai".
    */

    // Get all the available cells and get the "ai" difficulty
    let availableCells = board.map((val, index) => val === null ? index : null).filter(val => val !== null);
    let aiDifficulty = aiDifficultySelect.value;

    if (aiDifficulty === 'smart') {
        // Smart AI, go through all the winning conditions

        // First loop checks if there's any of the winning conditions that's missing only 1 move for the "ai" to win. If there is, it does that move and wins.
        for (let condition of winCond) {
            const [a, b, c] = condition;
            if (board[a] === 'O' && board[b] === 'O' && board[c] === null) {
                board[c] = currentPlayer;
                cells[c].textContent = currentPlayer;
                if (checkWin(currentPlayer)) {
                    displayMsg(`You Lose`, 'loss');
                    gameActive = false;
                }
                currentPlayer = 'X';
                return;
            } else if (board[a] === 'O' && board[c] === 'O' && board[b] === null) {
                board[b] = currentPlayer;
                cells[b].textContent = currentPlayer;
                if (checkWin(currentPlayer)) {
                    displayMsg(`You Lose`, 'loss');
                    gameActive = false;
                }
                currentPlayer = 'X';
                return;
            } else if (board[b] === 'O' && board[c] === 'O' && board[a] === null) {
                board[a] = currentPlayer;
                cells[a].textContent = currentPlayer;
                if (checkWin(currentPlayer)) {
                    displayMsg(`You Lose`, 'loss');
                    gameActive = false;
                }
                currentPlayer = 'X';
                return;
            }
        }
        // If there's no conditions met in the first loop to win, then we go to the second loop where we'll try to prevent the user (X) from winning.
        // Second for loop goes through all the winning conditions and checks if the user (X) is one move away from a winning condition. 
        // If so, the "ai" puts it's "O" on the spot where the user could place his "X" to win the game.
        for (let condition of winCond) {
            const [a, b, c] = condition;
            if (board[a] === 'X' && board[b] === 'X' && board[c] === null) {
                board[c] = currentPlayer;
                cells[c].textContent = currentPlayer;
                currentPlayer = 'X';
                return;
            } else if (board[a] === 'X' && board[c] === 'X' && board[b] === null) {
                board[b] = currentPlayer;
                cells[b].textContent = currentPlayer;
                currentPlayer = 'X';
                return;
            } else if (board[b] === 'X' && board[c] === 'X' && board[a] === null) {
                board[a] = currentPlayer;
                cells[a].textContent = currentPlayer;
                currentPlayer = 'X';
                return;
            }
        }
    }

    // (Kept most of old code of "dumb ai")
    // If there's no conditions met in the last 2 loops, then the "ai" randomly chooses a cell.
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        displayMsg(`You Lose`, 'loss');
        gameActive = false;
    } else if (board.every(cell => cell !== null)) {
        displayMsg("Tie", 'tie');
        gameActive = false;
    }

    currentPlayer = 'X';
}

function checkWin(player) {
    // Goes through all the conditions and checks if any of them are met for which ever player is passed as a parameter.
    return winCond.some(condition => {
        const [a, b, c] = condition;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}

function spinAnimation() {
    // Adds the "spin" class to the cells that met the winning condition.
    winCond.forEach(condition => {
        const [a, b, c] = condition;
        if (board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer) {
            cells[a].classList.add('spin');
            cells[b].classList.add('spin');
            cells[c].classList.add('spin');
        }
    });
}

function displayMsg(message, result) {
    // Create a div, add the message parameter's contents to it, add the "message" class to it and append it to the body of the page.
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message');
    document.body.appendChild(messageElement);

    // Remove message element after 2 seconds.
    setTimeout(() => {
        messageElement.remove();
    }, 2000);

    // Updates leaderboard
    if (result) {
        updateLeaderboard(result);
    }
}

function fetchLeaderboard() {
    /**
     * Function to fetch leaderboard from PHP
     */
    fetch('leaderboard.php')
        .then(response => response.json())
        .then(data => {
            leaderboardWins.textContent = `Wins: ${data.wins}`;
            leaderboardLosses.textContent = `Losses: ${data.losses}`;
            leaderboardTies.textContent = `Ties: ${data.ties}`;
        })
        .catch(error => console.error("Error fetching leaderboard:", error));
}

function updateLeaderboard(result) {
    /**
     * Function to update leaderboard after a game
     */
    fetch('leaderboard.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `result=${result}`
    })
    .then(() => fetchLeaderboard())
    .catch(error => console.error("Error updating leaderboard:", error));
}

function fetchGameState() {
    /**
     * Function to fetch game state from php server
     */
    fetch('fetch_state.php')
        .then(response => response.json())
        .then(data => {
            board = data.board;
            gameActive = data.gameActive;
            currentPlayer = data.currentPlayer;
            updateBoardUI();
        })
        .catch(error => console.error("Error fetching game state:", error));
}

function updateBoardUI() {
    /**
     * Function to update board UI based on fetched game state
     */
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        if (board[index]) {
            cell.classList.add('occupied');
        } else {
            cell.classList.remove('occupied');
        }
    });
}

// On page load, fetch initial leaderboard and game state
window.onload = function() {
    fetchLeaderboard();
    fetchGameState();
};
