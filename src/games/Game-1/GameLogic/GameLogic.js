import './GameLogic.css'

export let currentPlayer = 1
export let playerColors = ['blue', 'red']
export let board = ['', '', '', '', '', '', '', '', '']
export let isGameActive = false // true when moves are allowed
export let gameOver = false // true when the game has ended

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

export const renderBoard = (board, playerColors = ['blue', 'red']) => {
  const squares = document.querySelectorAll('.square')
  squares.forEach((square) => {
    const idx = parseInt(square.dataset.index, 10)
    if (isNaN(idx)) {
      return
    }
    square.textContent = board[idx]
    square.className = 'square' // Reset classes

    if (board[idx] === 'X') {
      square.setAttribute('data-player', '1')
      square.style.color = playerColors[0]
    } else if (board[idx] === 'O') {
      square.setAttribute('data-player', '2')
      square.style.color = playerColors[1]
    } else {
      square.removeAttribute('data-player')
      square.style.color = ''
    }
  })
}

export const createBoard = () => {
  const boardContainer = document.getElementById('game-board')
  if (!boardContainer) {
    return
  }
  boardContainer.innerHTML = '' // Clear board container
  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.dataset.index = i
    // Only trigger move if game is active
    square.addEventListener('click', () => handleSquareClick(i))
    boardContainer.appendChild(square)
  }
}

const setBoardInteractivity = (isInteractive) => {
  const squares = document.querySelectorAll('.square')
  squares.forEach((square) => {
    square.style.pointerEvents = isInteractive ? 'auto' : 'none'
  })
}

export const saveGameState = () => {
  const player1ColorSelect = document.getElementById('player1-color')
  const player2ColorSelect = document.getElementById('player2-color')

  const gameState = {
    board,
    currentPlayer,
    isGameActive,
    gameOver,
    playerColors: {
      player1: player1ColorSelect ? player1ColorSelect.value : playerColors[0],
      player2: player2ColorSelect ? player2ColorSelect.value : playerColors[1]
    }
  }

  localStorage.setItem('gameState', JSON.stringify(gameState))
}

export const loadGameState = () => {
  const savedState = localStorage.getItem('gameState')
  if (savedState) {
    const parsedState = JSON.parse(savedState)
    board.splice(0, board.length, ...parsedState.board)
    currentPlayer = parsedState.currentPlayer
    isGameActive = false // Ensure game starts in paused state
    gameOver = parsedState.gameOver || false

    if (parsedState.playerColors) {
      playerColors[0] = parsedState.playerColors.player1
      playerColors[1] = parsedState.playerColors.player2

      // Update the Player 1 and Player 2 dropdown values to match saved colors
      const player1ColorSelect = document.getElementById('player1-color')
      const player2ColorSelect = document.getElementById('player2-color')
      if (player1ColorSelect) {
        player1ColorSelect.value = parsedState.playerColors.player1
      }
      if (player2ColorSelect) {
        player2ColorSelect.value = parsedState.playerColors.player2
      }

      // Update the custom CSS properties for player colors
      document.documentElement.style.setProperty(
        '--player1-color',
        parsedState.playerColors.player1
      )
      document.documentElement.style.setProperty(
        '--player2-color',
        parsedState.playerColors.player2
      )
    }

    // Render the board with the loaded state
    renderBoard(board, playerColors)

    // Update the play button and turn indicator
    const playBtn = document.getElementById('play-btn')
    if (playBtn) {
      playBtn.textContent = gameOver ? 'Play Again' : 'Resume Game'
    }
    updateTurnIndicator()
  } else {
    gameOver = false // If no saved game state exists, start with defaults
  }
  const player1ColorSelect = document.getElementById('player1-color')
  const player2ColorSelect = document.getElementById('player2-color')
  console.log('Loading Game State...')
  console.log('Player 1 Dropdown Exists:', !!player1ColorSelect)
  console.log('Player 2 Dropdown Exists:', !!player2ColorSelect)
}

export const updateTurnIndicator = () => {
  const indicator = document.getElementById('turn-indicator')
  if (indicator) {
    if (!isGameActive && !gameOver) {
      indicator.textContent = `Player ${currentPlayer}'s turn (paused)`
    } else {
      indicator.textContent = `Player ${currentPlayer}`
      indicator.style.color = playerColors[currentPlayer - 1]
    }
  }
}

export const handleSquareClick = (index) => {
  // Only if square is empty and game is active.
  if (board[index] || !isGameActive) return
  const movingPlayer = currentPlayer
  board[index] = movingPlayer === 1 ? 'X' : 'O'
  renderBoard(board, playerColors)
  checkWinner(movingPlayer)
  saveGameState()
}

const checkWinner = (movingPlayer) => {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      endGame(movingPlayer, combination)
      return
    }
  }
  if (!board.includes('')) {
    endGame(null) // Draw case.
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1
    updateTurnIndicator()
  }
}

export const endGame = (winner, winningCombo) => {
  // End game by marking it finished.
  isGameActive = false
  gameOver = true
  setBoardInteractivity(false)

  const squares = document.querySelectorAll('.square')
  if (winner) {
    winningCombo.forEach((index) => {
      squares[index].classList.add('winner')
    })
    // Play win audio.
    if (winner === 1) {
      const player1Audio = new Audio('./src/assets/player-1-wins.mp3')
      if (player1Audio) {
        player1Audio.currentTime = 0
        player1Audio.play()
      }
    } else if (winner === 2) {
      const player2Audio = new Audio('./src/assets/player-2-wins.mp3')
      if (player2Audio) {
        player2Audio.currentTime = 0
        player2Audio.play()
      }
    }
    // Update the turn indicator with a win message.
    const indicator = document.getElementById('turn-indicator')
    if (indicator) {
      indicator.textContent = `Player ${winner} wins!`
    }
  } else {
    // For a draw, update the turn indicator.
    const indicator = document.getElementById('turn-indicator')
    if (indicator) {
      indicator.textContent = "It's a draw!"
    }
  }
  saveGameState()
}

export const resetGame = () => {
  const squares = document.querySelectorAll('.square')
  squares.forEach((square) => {
    square.classList.remove('winner')
    square.textContent = ''
  })
  startGame()
}

export const startGame = () => {
  // If resuming from a finished game, start a NEW game.
  if (gameOver) {
    board.fill('')
    gameOver = false
  }
  isGameActive = true
  currentPlayer = 1

  // Enable board clicks.
  setBoardInteractivity(true)

  if (!board.includes('X') && !board.includes('O')) {
    renderBoard(board, playerColors)
  }

  const playBtn = document.getElementById('play-btn')
  if (playBtn) {
    playBtn.textContent = 'Play Again'
  }
  updateTurnIndicator()

  saveGameState()
}
