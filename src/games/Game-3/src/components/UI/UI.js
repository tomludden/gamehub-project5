import './UI.css'

let body = document.body

export const createUI = () => {
  // Create title
  const title = document.createElement('h1')
  title.textContent = 'MatchIt!'
  body.appendChild(title)

  // Create home button
  const homeButton = document.createElement('button')
  homeButton.textContent = '<'
  homeButton.id = 'home-btn'
  homeButton.addEventListener('click', () => {
    window.location.href = '/'
  })
  body.appendChild(homeButton)

  // Create overlay and popup
  const overlay = document.createElement('div')
  overlay.className = 'overlay'
  overlay.id = 'overlay'

  const popup = document.createElement('div')
  popup.className = 'popup'
  popup.id = 'gameOverPopup'

  const popupText = document.createElement('h1')
  popupText.className = 'pixelated-text'
  popupText.textContent = 'Game Over'
  popup.appendChild(popupText)

  const playAgainButton = document.createElement('button')
  playAgainButton.textContent = 'Play Again'
  playAgainButton.id = 'play-again'
  playAgainButton.className = 'play-again-button'
  popup.appendChild(playAgainButton)

  body.appendChild(overlay)
  body.appendChild(popup)

  // Create score and attempts displays
  const scoreDisplay = document.createElement('div')
  scoreDisplay.className = 'score'
  scoreDisplay.textContent = 'Score: 0'
  body.appendChild(scoreDisplay)

  const attemptsDisplay = document.createElement('div')
  attemptsDisplay.className = 'attempts'
  attemptsDisplay.textContent = 'Attempts Left: 5'
  body.appendChild(attemptsDisplay)

  // Create card grid
  const cardGrid = document.createElement('div')
  cardGrid.className = 'card-grid'
  body.appendChild(cardGrid)
}
