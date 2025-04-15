import './src/components/GameLogic/GameLogic.js'
import './src/components/Controls/Controls.js'
export function loadGame2(container) {
  const gameContent = document.createElement('div')
  gameContent.className = 'game-content'
  gameContent.textContent = 'Welcome to Game 2!'
  container.appendChild(gameContent)

  // Add game-specific code here
}
