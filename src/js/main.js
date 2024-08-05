import { ChatObject } from './ChatObject.js'
import { MemoryGameObject } from './MemoryGameObject.js'
import { EightBallObject } from './8ballObject.js'

const chatAppButton = document.getElementById('chat-icon')
const memoryAppButton = document.getElementById('memory-icon')
const eightBallAppButton = document.getElementById('magic-8ball-icon')
const toolbarMenuDiv = document.getElementById('toolbar-menu')
const toolbar = document.getElementById('toolbar')
const screen = document.getElementById('screen')
let nextID = 0
const applications = []
let currentTopZindex = 0

/**
 * function used to get the nextZIndex.
 * Used for applications on desktop.
 * @returns {currentTopZindex} the next biggest index
 */
function getNextZIndex () {
  currentTopZindex++
  return currentTopZindex
}

chatAppButton.addEventListener('click', () => {
  applications.push(new ChatObject(nextID, screen, getNextZIndex))
  nextID++
})

memoryAppButton.addEventListener('click', () => {
  applications.push(new MemoryGameObject(nextID, screen, getNextZIndex))
  nextID++
})

eightBallAppButton.addEventListener('click', () => {
  applications.push(new EightBallObject(nextID, screen, getNextZIndex))
  nextID++
})

/**
 * Generates a random color
 * @returns {string} has a color in this format #FFFFFF
 */
function getRandomColor () {
  // Generate a random color in hexadecimal format
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

toolbarMenuDiv.addEventListener('click', () => {
  toolbarMenuDiv.style.backgroundColor = getRandomColor()
  toolbar.style.backgroundColor = getRandomColor()
})
