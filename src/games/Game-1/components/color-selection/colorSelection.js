import './colorSelection.css'

export function initColorSelection(playerColors, saveGameState) {
  const colors = [
    'blue',
    'green',
    'yellow',
    'red',
    'purple',
    'orange',
    'pink',
    'white',
    'black'
  ]

  const playersContainer = document.createElement('div')
  playersContainer.id = 'players-container'
  ;['Player 1 Color', 'Player 2 Color'].forEach((labelText, idx) => {
    const playerDiv = document.createElement('div')
    playerDiv.className = 'color-option'

    const label = document.createElement('label')
    label.textContent = labelText

    const select = document.createElement('select')
    select.id = idx === 0 ? 'player1-color' : 'player2-color' // Assign IDs to dropdowns
    colors.forEach((color) => {
      const option = document.createElement('option')
      option.value = color
      option.textContent = color
      select.appendChild(option)
    })

    select.addEventListener('change', () => {
      playerColors[idx] = select.value // Update playerColors array
      saveGameState() // Save state after color change
    })

    playerDiv.appendChild(label)
    playerDiv.appendChild(select)
    playersContainer.appendChild(playerDiv)
  })

  // Insert the playersContainer below the header
  const header = document.querySelector('h1')
  if (header) {
    header.insertAdjacentElement('afterend', playersContainer)
  }
}
