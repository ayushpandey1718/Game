const board = document.getElementById('board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
let currentPlayer = 'X'; // Human always starts as 'X'
let gameState = Array(9).fill(null);

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Check for a winner or tie
function checkWinner() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }
    return gameState.every(cell => cell) ? 'Tie' : null;
}

// Minimax algorithm for optimal AI move
function minimax(newGameState, isMaximizing) {
    const winner = checkWinner();
    if (winner === 'X') return -10; // Human wins
    if (winner === 'O') return 10;  // AI wins
    if (winner === 'Tie') return 0; // Tie

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newGameState.length; i++) {
            if (!newGameState[i]) {
                newGameState[i] = 'O';
                let score = minimax(newGameState, false);
                newGameState[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newGameState.length; i++) {
            if (!newGameState[i]) {
                newGameState[i] = 'X';
                let score = minimax(newGameState, true);
                newGameState[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Find the best move for the AI
function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (!gameState[i]) {
            gameState[i] = 'O';
            let score = minimax(gameState, false);
            gameState[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Handle a player's move
function handleClick(e) {
    const index = e.target.dataset.index;
    if (!gameState[index] && currentPlayer === 'X') {
        gameState[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add('taken');
        const winner = checkWinner();
        if (winner) {
            message.textContent = winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`;
            board.style.pointerEvents = 'none';
        } else {
            currentPlayer = 'O'; // Switch to AI
            message.textContent = `AI is thinking...`;
            setTimeout(aiMove, 500); // Add delay for realism
        }
    }
}

// AI's move
function aiMove() {
    const bestMove = findBestMove();
    if (bestMove !== undefined) {
        gameState[bestMove] = 'O';
        const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
        cell.textContent = 'O';
        cell.classList.add('taken');
    }
    const winner = checkWinner();
    if (winner) {
        message.textContent = winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`;
        board.style.pointerEvents = 'none';
    } else {
        currentPlayer = 'X'; // Switch back to human
        message.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Restart the game
function restartGame() {
    gameState.fill(null);
    currentPlayer = 'X';
    message.textContent = `Player ${currentPlayer}'s Turn`;
    board.style.pointerEvents = 'auto';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

// Event listeners
board.addEventListener('click', handleClick);
restartButton.addEventListener('click', restartGame);

// Initialize message
message.textContent = `Player ${currentPlayer}'s Turn`;
