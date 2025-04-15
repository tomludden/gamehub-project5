import './buttons.css'

export function initButtons(startGame, resetGame) {
  const homeBtn = document.createElement('button')
  homeBtn.id = 'home-btn'
  homeBtn.textContent = '<'
  homeBtn.addEventListener('click', () => {
    window.location.href = '/home' // Navigate to home
  })
  document.body.appendChild(homeBtn)
  const isGameActive = false
  const playBtn = document.createElement('button')
  playBtn.id = 'play-btn'
  playBtn.textContent = 'Start Game' // Initial button text
  playBtn.addEventListener('click', () => {
    if (!isGameActive) {
      startGame() // Start or resume a new game if the game is inactive
      playBtn.textContent = 'Play Again' // Update button text after the game starts
    } else {
      resetGame() // Reset the game if it is already active or completed
      playBtn.textContent = 'Start Game' // Optionally reset button text if required
    }
  })
  document.body.appendChild(playBtn)
}
