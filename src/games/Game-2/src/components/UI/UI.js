export const gameContainer = document.createElement('div')
gameContainer.id = 'game-container'

export const homeButton = document.createElement('button')

// Set the button text
homeButton.textContent = '<'
homeButton.id = 'home-btn'

// Append the button to the body
document.body.appendChild(homeButton)

// Add functionality to the button (navigate to the homepage when clicked)
homeButton.addEventListener('click', function () {
  window.location.href = '/' // You can change the URL to your desired homepage
})

// Game title
export const gameTitle = document.createElement('div')
gameTitle.id = 'game-title'
gameTitle.textContent = 'YUMMY FRUITS'
gameContainer.appendChild(gameTitle)

// Basket container
export const basketContainer = document.createElement('div')
basketContainer.id = 'basket-container'
gameContainer.appendChild(basketContainer)

// Basket
export const basket = document.createElement('div')
basket.id = 'basket'
gameContainer.appendChild(basket)

// Score display
export const scoreDisplay = document.createElement('div')
scoreDisplay.id = 'score'
scoreDisplay.textContent = 'Score: 0'
gameContainer.appendChild(scoreDisplay)

// Lives display
export const livesDisplay = document.createElement('div')
livesDisplay.id = 'lives'
gameContainer.appendChild(livesDisplay)

// Start button
export const startButton = document.createElement('button')
startButton.id = 'start-btn'
startButton.textContent = 'Start Game'
gameContainer.appendChild(startButton)

// Game over popup
export const gameOverPopup = document.createElement('div')
gameOverPopup.id = 'game-over-popup'
gameOverPopup.classList.add('hidden')
const gameOverTitle = document.createElement('h1')
gameOverTitle.textContent = 'Game Over'
gameOverPopup.appendChild(gameOverTitle)
gameContainer.appendChild(gameOverPopup)

// Append the game container to the document body
document.body.appendChild(gameContainer)
