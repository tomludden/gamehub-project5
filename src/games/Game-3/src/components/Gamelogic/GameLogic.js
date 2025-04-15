import './GameLogic.css'
import { themes } from '/src/games/Game-3/Themes.js'

// Game state variables

let currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex')) || 0
let score = parseInt(localStorage.getItem('score')) || 0
let attempts = parseInt(localStorage.getItem('attempts')) || 5
let firstCard, secondCard
let matchedCards = JSON.parse(localStorage.getItem('matchedCards')) || []
let matchesMade = parseInt(localStorage.getItem('matchesMade')) || 0

export const initGame = () => {
  const cardGrid = document.querySelector('.card-grid')
  const scoreDisplay = document.querySelector('.score')
  const attemptsDisplay = document.querySelector('.attempts')

  if (!cardGrid || !scoreDisplay || !attemptsDisplay) {
    throw new Error(
      'Essential UI elements (card-grid, score, attempts) not found!'
    )
  }

  hidePopup()

  scoreDisplay.textContent = `Score: ${score}`
  attemptsDisplay.textContent = `Attempts Left: ${attempts}`

  loadTheme(currentThemeIndex)
}

export const loadTheme = (themeIndex) => {
  const cardGrid = document.querySelector('.card-grid')
  if (!cardGrid) {
    throw new Error('Card grid element not found!')
  }

  cardGrid.innerHTML = ''

  attempts = parseInt(localStorage.getItem('attempts')) || 5

  const theme = themes[themeIndex]

  const attemptsDisplay = document.querySelector('.attempts')
  if (attemptsDisplay) {
    attemptsDisplay.textContent = `Attempts Left: ${attempts}`
  }

  const savedPositions = retrieveCardPositions(theme)
  const savedMatchedCards =
    JSON.parse(localStorage.getItem('matchedCards')) || []

  savedPositions.forEach(({ cardValue, imageClass }) => {
    if (!cardValue || !imageClass) {
      throw new Error('Invalid card data detected:', { cardValue, imageClass })
    }

    const card = document.createElement('div')
    card.classList.add('card', imageClass)
    card.dataset.value = cardValue

    card.addEventListener('click', function () {
      if (this.classList.contains('flipped') || secondCard) {
        return
      }

      this.classList.add('flipped')

      if (!firstCard) {
        firstCard = this
      } else {
        secondCard = this
        checkForMatch()
      }
    })

    if (savedMatchedCards.includes(cardValue)) {
      card.classList.add('matched', 'flipped')
      card.style.pointerEvents = 'none'
    }
    cardGrid.appendChild(card)
  })
}

export const retrieveCardPositions = (theme) => {
  const savedData = JSON.parse(localStorage.getItem('savedGameData')) || {}

  if (savedData.themeName !== theme.name) {
    const newPositions = theme.cards
      .map((card, idx) => ({
        cardValue: card,
        imageClass: theme.imageClasses[idx % theme.imageClasses.length]
      }))
      .sort(() => Math.random() - 0.5)

    localStorage.setItem(
      'savedGameData',
      JSON.stringify({
        themeName: theme.name,
        cardPositions: newPositions
      })
    )

    return newPositions
  }

  return savedData.cardPositions || []
}

export const checkForMatch = () => {
  if (!firstCard || !secondCard) {
    throw new Error('Not enough cards to check for a match.')
  }

  const scoreDisplay = document.querySelector('.score')
  const attemptsDisplay = document.querySelector('.attempts')

  if (firstCard.dataset.value === secondCard.dataset.value) {
    // Cards match
    score++
    matchesMade++
    scoreDisplay.textContent = `Score: ${score}`

    matchedCards.push(firstCard.dataset.value)

    firstCard.classList.add('matched')

    secondCard.classList.add('matched')

    saveGameState()
    resetBoard()

    const totalMatches = themes[currentThemeIndex].cards.length / 2
    if (matchesMade === totalMatches) {
      nextRound()
    }
  } else {
    // Cards don't match
    if (attempts > 0) {
      attempts--
    }

    attemptsDisplay.textContent = `Attempts Left: ${Math.max(attempts, 0)}`
    saveGameState()

    setTimeout(() => {
      firstCard.classList.remove('flipped')
      secondCard.classList.remove('flipped')
      resetBoard()
    }, 500)

    if (attempts <= 0) {
      gameOver()
    }
  }
}

export const resetBoard = () => {
  firstCard = null
  secondCard = null
}

export const saveGameState = () => {
  localStorage.setItem('score', score)
  localStorage.setItem('attempts', attempts)
  localStorage.setItem('matchedCards', JSON.stringify(matchedCards))
}

export const nextRound = () => {
  // Clear matched cards for the new round
  matchedCards = []
  localStorage.removeItem('matchedCards') // Remove matched cards from localStorage

  attempts = 5 // Reset attempts for the new round
  matchesMade = 0
  currentThemeIndex++

  localStorage.setItem('currentThemeIndex', currentThemeIndex)
  localStorage.setItem('attempts', attempts)
  localStorage.setItem('score', score)

  if (currentThemeIndex >= themes.length) {
    const gameCompletedAudio = new Audio('./src/assets/homer-woohoo.mp3')
    gameCompletedAudio.play()
    showPopup('Woohoo!!! You completed all rounds!')
  }

  const attemptsDisplay = document.querySelector('.attempts')
  if (attemptsDisplay) {
    attemptsDisplay.textContent = `Attempts Left: ${attempts}`
  }

  loadTheme(currentThemeIndex) // Load the next theme
}

export const resetGame = () => {
  currentThemeIndex = 0
  score = 0
  attempts = 5 // Reset attempts
  matchesMade = 0
  matchedCards = []

  // Clear saved data from localStorage
  localStorage.removeItem('currentThemeIndex')
  localStorage.removeItem('score')
  localStorage.removeItem('attempts')
  localStorage.removeItem('matchedCards')

  saveGameState()

  const cardGrid = document.querySelector('.card-grid')
  if (cardGrid) {
    cardGrid.innerHTML = ''
  }

  hidePopup()
  loadTheme(currentThemeIndex)

  const scoreDisplay = document.querySelector('.score')
  const attemptsDisplay = document.querySelector('.attempts')
  if (scoreDisplay && attemptsDisplay) {
    scoreDisplay.textContent = `Score: ${score}`
    attemptsDisplay.textContent = `Attempts Left: ${attempts}`
  } else {
    throw new Error('Score or attempts display not found!')
  }
}

export const gameOver = () => {
  const gameOverAudio = new Audio('./src/assets/kr-exa-game-over-sound.mp3')
  gameOverAudio.play()

  showPopup('Game Over')
  const playAgainButton = document.querySelector('#play-again')
  if (playAgainButton) {
    playAgainButton.removeEventListener('click', resetGame)
    playAgainButton.addEventListener('click', resetGame)
  } else {
    throw new Error('Play Again button not found!')
  }
}

export const hidePopup = () => {
  const overlay = document.querySelector('.overlay')
  const popup = document.querySelector('.popup')

  if (!overlay || !popup) {
    throw new Error('Overlay or popup element not found!')
  }

  overlay.style.display = 'none'
  popup.style.display = 'none'
}

export const showPopup = (message) => {
  const overlay = document.querySelector('.overlay')
  const popup = document.querySelector('.popup')

  if (!overlay || !popup) {
    throw new Error('Overlay or popup element not found!')
  }

  const popupText = popup.querySelector('.pixelated-text')
  popupText.textContent = message

  // Check if the message is "Game Completed"
  if (message === 'Woohoo!!! You completed all rounds!') {
    popupText.style.fontSize = '18px' // Set text size to 18px
    popupText.style.textAlign = 'center' // Center the text if needed
    popup.style.display = 'flex' // Ensure popup is centered with flexbox

    // Attach functionality to "Play Again" button
    const playAgainButton = document.querySelector('#play-again')
    if (playAgainButton) {
      playAgainButton.removeEventListener('click', resetGame)
      playAgainButton.addEventListener('click', () => {
        resetGame() // Reset the game to round 0
      })
    } else {
      throw new Error('Play Again button not found!')
    }
  }

  overlay.style.display = 'flex' // Flexbox layout to center the popup
  popup.style.display = 'block'
}
