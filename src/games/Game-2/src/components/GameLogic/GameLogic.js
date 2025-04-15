import './GameLogic.css'

import {
  gameContainer,
  gameTitle,
  basket,
  scoreDisplay,
  livesDisplay,
  startButton,
  gameOverPopup
} from '/src/games/Game-2/src/components/UI/UI.js'

let gameOverAudio = new Audio(
  '/src/games/Game-2/src/assets/audio/mariobros-gameover.mp3'
)
let fruitCollectionAudio = new Audio(
  '/src/games/Game-2/src/assets/audio/roblox-yummy.mp3'
)
let bombAudio = new Audio('/src/games/Game-2/src/assets/audio/explosion_1.mp3')
let sweetCollectionAudio = new Audio(
  '/src/games/Game-2/src/assets/audio/ringtone_7.mp3'
)
let fruitImages = [
  'https://seeklogo.com/images/B/bananas-logo-D84FBE087F-seeklogo.com.png',
  'https://png.pngtree.com/png-clipart/20230126/original/pngtree-fresh-red-apple-png-image_8930987.png',
  'https://cdn.pixabay.com/photo/2012/04/24/16/09/grapes-40274_640.png',
  'https://png.pngtree.com/png-vector/20240315/ourmid/pngtree-lime-fruit-close-up-png-image_11901535.png',
  'https://www.pngplay.com/wp-content/uploads/6/Shining-Orange-Transparent-PNG.png'
]
let sweetImages = [
  'https://images.vexels.com/content/240141/preview/candy-wrapper-sweet-0c37f6.png',
  'https://static.vecteezy.com/system/resources/thumbnails/016/408/183/small/3d-sweet-lollipop-free-png.png',
  'https://www.pngplay.com/wp-content/uploads/7/Cotton-Candy-Background-PNG-Image.png'
]

let bombImage =
  'https://www.pngkey.com/png/full/153-1536020_cartoon-explosion-png-bomb-ubhxlu-cartoon-bomb-bom.png'

let score = parseInt(localStorage.getItem('score')) || 0
let lives = parseInt(localStorage.getItem('lives')) || 3
let gameInterval
let itemInterval
let itemSpeed = parseInt(localStorage.getItem('itemSpeed')) || 1500
let activeItems = []

export const updateLives = () => {
  if (lives < 0) {
    lives = 0 // Prevent lives from going below 0
  }
  livesDisplay.textContent = '❤️'.repeat(lives) // Display the number of hearts (lives)
  saveGameState()
}

export function saveGameState() {
  localStorage.setItem('score', score) // Save score
  localStorage.setItem('lives', lives) // Save lives
  localStorage.setItem('itemSpeed', itemSpeed) // Save item speed (if needed)
}

export function startGame() {
  if (!localStorage.getItem('score') || !localStorage.getItem('lives')) {
    score = 0
    lives = 3
    itemSpeed = 1500
    scoreDisplay.textContent = `Score: ${score}`
    livesDisplay.textContent = '❤️'.repeat(lives)
  } else {
    score = parseInt(localStorage.getItem('score'))
    lives = parseInt(localStorage.getItem('lives'))
    itemSpeed = parseInt(localStorage.getItem('itemSpeed')) || 1500 // Load saved speed or default
    scoreDisplay.textContent = `Score: ${score}`
    livesDisplay.textContent = '❤️'.repeat(lives)
  }

  gameOverPopup.classList.add('hidden')
  startButton.classList.add('hidden')
  gameTitle.classList.add('game-title-background')
  fruitCollectionAudio.volume = 1
  sweetCollectionAudio.volume = 1

  // Clear previous intervals
  clearInterval(gameInterval)
  clearInterval(itemInterval)
  clearInterval(bombInterval)

  // Start new intervals for item dropping and bomb dropping
  itemInterval = setInterval(dropItem, itemSpeed)
  bombInterval = setInterval(() => {
    dropBomb()
  }, 5000)

  saveGameState()
}

export function dropItem() {
  const slotWidth = 50 + 25 // Item width (50px) + 25px buffer
  const totalSlots = Math.floor(gameContainer.clientWidth / slotWidth) // Number of slots in the container
  const occupiedSlots = new Set() // Track occupied slots

  const numberOfItems = Math.floor(Math.random() * 2) + 1 // Drop 1-2 items at once
  for (let i = 0; i < numberOfItems; i++) {
    const item = document.createElement('div')
    const isFruit = Math.random() < 0.5 // Randomly decide if it's a fruit or sweet
    item.classList.add(isFruit ? 'fruit' : 'sweet')

    let slotIndex
    do {
      slotIndex = Math.floor(Math.random() * totalSlots)
    } while (occupiedSlots.has(slotIndex))

    occupiedSlots.add(slotIndex)

    const leftPosition = slotIndex * slotWidth

    // Set item properties
    item.style.left = `${leftPosition}px`
    item.style.top = '0px' // Items always drop from the top
    item.style.backgroundImage = `url(${
      isFruit
        ? fruitImages[Math.floor(Math.random() * fruitImages.length)]
        : sweetImages[Math.floor(Math.random() * sweetImages.length)]
    })`
    item.style.width = '50px'
    item.style.height = '50px'
    item.style.position = 'absolute'

    gameContainer.appendChild(item)

    let dropAnimation = setInterval(() => {
      const itemTop = parseInt(getComputedStyle(item).top)
      const basketRect = basket.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()

      if (
        itemTop + itemRect.height >=
          basketRect.top - gameContainer.getBoundingClientRect().top &&
        itemRect.left + itemRect.width / 2 >= basketRect.left &&
        itemRect.left + itemRect.width / 2 <= basketRect.right
      ) {
        // Item collides with the basket
        clearInterval(dropAnimation)
        removeItem(item, slotIndex)
        handleItemCollision(item, isFruit)
      } else if (itemTop < gameContainer.clientHeight - 50) {
        // Item continues dropping
        item.style.top = `${itemTop + 5}px`
      } else {
        // Item falls past the bottom
        clearInterval(dropAnimation)
        removeItem(item, slotIndex)
        handleMissedItem(item, isFruit)
      }
    }, 50)
  }
}

// Helper function to handle item collision
function handleItemCollision(item, isFruit) {
  if (isFruit) {
    // Increment score for fruit collection
    score++
    scoreDisplay.textContent = `Score: ${score}`
    fruitCollectionAudio.currentTime = 0
    fruitCollectionAudio.play()

    saveGameState()
  } else {
    // Sweet collection reduces a life
    sweetCollectionAudio.currentTime = 0
    sweetCollectionAudio.play()
    lives--
    updateLives()

    saveGameState()

    if (lives <= 0) {
      endGame()
    }
  }

  removeItem(item)
}

function handleMissedItem(item, isFruit) {
  if (isFruit) {
    // Decrement lives if a fruit is missed
    lives--
    updateLives()

    // Save the updated lives to local storage
    saveGameState()

    if (lives <= 0) {
      endGame()
    }
  }

  // Remove the missed item
  removeItem(item)
}

// Helper function to remove an item
function removeItem(item) {
  item.remove() // Remove the item from the DOM

  const index = activeItems.indexOf(item)
  if (index > -1) {
    activeItems.splice(index, 1)
    occupiedSlots.delete(index) // Free the corresponding slot
  }
}

let bombInterval

export function dropBomb() {
  const bomb = document.createElement('div')
  bomb.classList.add('bomb')
  bomb.style.left = `${Math.random() * (gameContainer.clientWidth - 50)}px`

  gameContainer.appendChild(bomb)

  let dropAnimation = setInterval(() => {
    const bombTop = parseInt(getComputedStyle(bomb).top)
    const basketRect = basket.getBoundingClientRect()
    const bombRect = bomb.getBoundingClientRect()

    // Check if bomb touches the basket
    if (
      bombTop + bombRect.height >=
        basketRect.top - gameContainer.getBoundingClientRect().top &&
      bombRect.left + bombRect.width / 2 >= basketRect.left &&
      bombRect.left + bombRect.width / 2 <= basketRect.right
    ) {
      bombAudio.play()
      clearInterval(dropAnimation)
      lives-- // Decrement lives for bomb collision
      updateLives()

      if (lives <= 0) {
        endGame() // End the game if lives reach 0
      }

      bomb.remove() // Remove the bomb after collision
    } else if (bombTop < gameContainer.clientHeight - 50) {
      bomb.style.top = `${bombTop + 8}px`
    } else {
      clearInterval(dropAnimation)
      bomb.remove()
    }
  }, 50)
}

// Function to end the game
export function endGame() {
  clearInterval(gameInterval)
  clearInterval(itemInterval)
  clearInterval(bombInterval)
  gameOverAudio.play()
  gameOverPopup.classList.remove('hidden')
  startButton.classList.remove('hidden')
  startButton.textContent = 'Play Again'

  // Reset game state in localStorage on game over
  localStorage.removeItem('score')
  localStorage.removeItem('lives')
  localStorage.removeItem('itemSpeed')

  // Clear all game items from the container
  const items = document.querySelectorAll('.fruit, .sweet, .bomb')
  items.forEach((item) => gameContainer.removeChild(item))
}

// Set the button text and functionality on page load
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('score') && localStorage.getItem('lives')) {
    startButton.textContent = 'Resume Game'
    scoreDisplay.textContent = `Score: ${score}`
    livesDisplay.textContent = '❤️'.repeat(lives)
  } else {
    startButton.textContent = 'Start Game'
    scoreDisplay.textContent = `Score: 0`
    livesDisplay.textContent = '❤️'.repeat(3)
  }

  startButton.addEventListener('click', () => {
    startGame()
  })
})
