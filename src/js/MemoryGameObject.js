import { Application } from './ApplicationObject.js'
import { StartScreen } from './MemoryGame/StartScreen.js'
import { GameScreen } from './MemoryGame/GameScreen.js'

/**
 * This class is an extension of the Application skeleton code and implements memory game functionality
 * This class is responsible for managing the entire program of the memory game
 * @class
 */
class MemoryGameObject extends Application {
  /**
   * Constructor
   * @param {number} id - unique number indicating the application.
   * @param {HTMLElement} parentElement - Parent element to which we will append this class.
   * @param {number} getNextZIndex - Parent function that allows to get the next biggest Zindex so that this application would be
   * displayed on top.
   */
  constructor (id, parentElement, getNextZIndex) {
    super(id, parentElement, getNextZIndex)

    // Set to have 2x2 on start
    this.xSize = 2
    this.ySize = 2

    this.applicationScreen = document.createElement('div')
    this.applicationScreen.className = 'chat-application-screen'

    this.element.appendChild(this.applicationScreen)
    this.title.innerText = 'Memory Game'
    this.showStartScreen()
  }

  /**
   * Setter for X value
   * @param {number} x - x value.
   */
  setX = (x) => {
    if (typeof x === 'number') { this.xSize = x }
  }

  /**
   * Setter for Y value
   * @param {*} y - y value.
   */
  setY = (y) => {
    if (typeof y === 'number') { this.ySize = y }
  }

  /**
   * Function that starts the memory game
   * @param {number} x - grid value.
   * @param {number} y - grid value.
   */
  startGame = (x, y) => {
    this.updateGameSize(x, y)
    this.showGameScreen()
  }

  /**
   * Function that is passed down to a child, so that it may change the screen when needed.
   */
  exitGame = () => {
    this.showStartScreen()
  }

  /**
   * this is a setter but for both x and y elements at the same time.
   * @param {number} x - grid value x
   * @param {number} y - grid value y
   */
  updateGameSize (x, y) {
    this.setX(x)
    this.setY(y)
  }

  /**
   * Function that creates the Start Screen class and displays it.
   */
  showStartScreen () {
    this.startScreenObject = new StartScreen(this.applicationScreen, this.startGame)
  }

  /**
   * Function that creates the Game Screen and displays it.
   */
  showGameScreen () {
    this.gameScreenObject = new GameScreen(this.applicationScreen, this.xSize, this.ySize, this.exitGame)
  }

  /**
   *  Functionn that is called once the application is closed.
   */
  close () {
    if (this.gameScreenObject != null) {
      this.gameScreenObject.stopTimer() // Timer needs to be stopped
    }
    super.close()
  }
}

export { MemoryGameObject }
