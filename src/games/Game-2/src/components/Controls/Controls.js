import { gameContainer, basket } from '../UI/UI.js'

let lastPosition = 0 // Track the last basket position

// Mouse movement
window.addEventListener('mousemove', (event) => {
  const containerRect = gameContainer.getBoundingClientRect()
  const mouseX = event.clientX - containerRect.left
  // Calculate new position for the basket
  let newLeft = mouseX - basket.offsetWidth / 2
  newLeft = Math.max(
    0,
    Math.min(containerRect.width - basket.offsetWidth, newLeft)
  )
  basket.style.left = `${newLeft}px`

  // Determine the movement direction
  if (newLeft > lastPosition) {
    // Moved right
    basket.classList.remove('basket-left')
    basket.classList.add('basket-right') // Face right
  } else if (newLeft < lastPosition) {
    // Moved left
    basket.classList.remove('basket-right')
    basket.classList.add('basket-left') // Face left
  }

  lastPosition = newLeft // Update the last position
})

// Touch movement
window.addEventListener('touchmove', (event) => {
  const containerRect = gameContainer.getBoundingClientRect()
  const touchX = event.touches[0].clientX - containerRect.left
  let newLeft = touchX - basket.offsetWidth / 2
  newLeft = Math.max(
    0,
    Math.min(containerRect.width - basket.offsetWidth, newLeft)
  )
  basket.style.left = `${newLeft}px`

  // Determine the movement direction for touch
  if (newLeft > lastPosition) {
    basket.classList.remove('basket-left')
    basket.classList.add('basket-right') // Face right
  } else if (newLeft < lastPosition) {
    basket.classList.remove('basket-right')
    basket.classList.add('basket-left') // Face left
  }

  lastPosition = newLeft // Update the last position
})
