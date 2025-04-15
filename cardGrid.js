import { gameArray } from './gameArray.js'

export function createCardGrid() {
  const appDiv = document.getElementById('app')

  // Create and append the background image dynamically
  const backgroundImg = document.createElement('img')
  backgroundImg.className = 'background-img'
  backgroundImg.src =
    'https://see2believeproductions.com/storage/images/arcadeframe2.png'
  backgroundImg.alt = 'arcade_screen'

  // Append the background image to the app div
  appDiv.appendChild(backgroundImg)

  // Create the card grid container
  const container = document.createElement('div')
  container.className = 'card-grid'

  // Loop through the game array and create flip cards
  gameArray.forEach((game) => {
    const flipCard = createFlipCard(game.imageSrc, game.link, game.description)
    container.appendChild(flipCard) // Append the flip card to the grid container
  })

  // Append the card grid container to the app div
  appDiv.appendChild(container)
}

export function createFlipCard(image, link, description) {
  const flipCard = document.createElement('div')
  flipCard.className = 'flip-card'

  const flipCardInner = document.createElement('div')
  flipCardInner.className = 'flip-card-inner'

  const flipCardBack = document.createElement('div')
  flipCardBack.className = 'flip-card-back'
  flipCardBack.style.backgroundImage = `url(${image})`

  const flipCardFront = document.createElement('div')
  flipCardFront.className = 'flip-card-front'

  const gameDescription = document.createElement('p')
  gameDescription.className = 'game-description'
  gameDescription.textContent = description

  const buttonFront = document.createElement('button')
  buttonFront.textContent = 'Play Now'
  buttonFront.className = 'buttonFront'

  // Redirect to the game page when "Play Now" is clicked
  buttonFront.addEventListener('click', (event) => {
    event.stopPropagation() // Prevent the flip effect
    window.location.href = `./src/games/${link}/index.html` // Navigate to the game page
  })

  flipCardInner.addEventListener('click', () => {
    flipCardInner.classList.toggle('flip-card-click') // Toggle the flip effect
  })

  flipCardFront.appendChild(gameDescription)
  flipCardFront.appendChild(buttonFront)

  flipCardInner.appendChild(flipCardBack)
  flipCardInner.appendChild(flipCardFront)

  flipCard.appendChild(flipCardInner)

  return flipCard
}
export function loadGamePage(link) {
  const appDiv = document.getElementById('app')

  // Clear the current content of the app div
  appDiv.innerHTML = ''

  // Construct the full path to the game's index.html, including the game name
  const gamePath = `./src/components/games/${encodeURI(link)}/index.html`

  console.log(`Loading game from path: ${gamePath}`)

  fetch(gamePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${gamePath}: ${response.statusText}`)
      }
      return response.text()
    })
    .then((htmlContent) => {
      // Redirect directly to the game's index.html
      window.location.href = gamePath
    })
    .catch((error) => {
      console.error(error)
      appDiv.innerHTML = `<p class="error">Failed to load the game. Please try again later.</p>`
    })
}
