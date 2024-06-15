const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
let board = Array(9).fill(null);
let gameActive = true;
let currentPlayer = 'X';

const winCond = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function onClick(e) {
    const index = e.target.dataset.index;

    if (board[index] !== null || !gameActive || currentPlayer !== 'X') {
        return;
    }

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        displayMsg(`You Win`);
        gameActive = false;
        spinAnimation();
    } else if (board.every(cell => cell !== null)) {
        displayMsg("Tie");
        gameActive = false;
    } else {
        currentPlayer = 'O'; 
        setTimeout(processComputer, 1000); 
    }
}


function processComputer() {
    let availableCells = board.map((val, index) => val === null ? index : null).filter(val => val !== null);
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    
    board[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        displayMsg(`You Lose`);
        gameActive = false;
    } else if (board.every(cell => cell !== null)) {
        displayMsg("Tie");
        gameActive = false;
    }

    currentPlayer = 'X'; 
}

function checkWin(player) {
    return winCond.some(condition => {
        const [a, b, c] = condition;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}

function spinAnimation() {
    winCond.forEach(condition => {
        const [a, b, c] = condition;
        if (board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer) {
            cells[a].classList.add('spin');
            cells[b].classList.add('spin');
            cells[c].classList.add('spin');
        }
    });
}

function displayMsg(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message');
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}

function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('spin');
    });
    gameActive = true;
    currentPlayer = 'X';
}

cells.forEach(cell => cell.addEventListener('click', onClick));
resetButton.addEventListener('click', resetGame);
