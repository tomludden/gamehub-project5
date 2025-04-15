import { createGameUI } from '/src/games/Game-1/UI/UI.js'
import { initColorSelection } from '/src/games/Game-1/color-selection/colorSelection.js'
import { initButtons } from '/src/games/Game-1/buttons/buttons.js'

import {
  createBoard,
  loadGameState,
  startGame,
  resetGame,
  playerColors,
  saveGameState
} from '/src/games/Game-1/GameLogic/GameLogic.js'

document.addEventListener('DOMContentLoaded', () => {
  createGameUI()
  initColorSelection(playerColors, saveGameState)
  initButtons(startGame, resetGame)
  createBoard()
  loadGameState()
})
