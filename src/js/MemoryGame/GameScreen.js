import { Tile } from './Tile.js'

/**
 * This class is responsible for displaying the memory game screen when the game is selected
 * Its tasks are:
 * Generate the correct tile set
 * Provide game functionality
 * Provide the ability to switch screen when needed
 * @class
 */
class GameScreen {
  constructor (parentElement, x, y, exitGame) {
    if ((x * y) % 2 !== 0) {
      throw new Error('Uneven grid size in the memory game!')
    }
    this.imagePaths = []
    this.imagePaths.push('url(/img/homer.png)')
    this.imagePaths.push('url(/img/heisenberg.png)')
    this.imagePaths.push('url(/img/jake.png)')
    this.imagePaths.push('url(/img/ralph.png)')
    this.imagePaths.push('url(/img/snowball.png)')
    this.imagePaths.push('url(/img/scream.png)')
    this.imagePaths.push('url(/img/bender.png)')
    this.imagePaths.push('url(/img/alien.png)')

    this.TilesList = []
    this.x = x
    this.y = y
    this.parentElement = parentElement
    this.exitGame = exitGame
    this.currentlyFocusedElementInGrid = 0
    this.stateOfMatching = false
    this.previouslySelectedTile = null
    this.GameStatePaused = false
    this.gameIsFinished = false
    this.attemptCounter = 0
    this.timePassed = 0
    this.timer = null
    this.timerIsRunning = false
    if (this.x === 2 && this.y === 2) {
      this.numOfColumns = 2
    } else {
      this.numOfColumns = 4
    }

    this.element = document.createElement('div')
    this.element.className = 'memory-game-screen'

    this.elementGameScreen = document.createElement('div')
    this.elementGameScreen.className = 'memory-game-tileScreen'

    // Controller
    this.elementGameController = document.createElement('div')
    this.elementGameController.className = 'memory-game-controller'

    this.gameControlButtonBox = document.createElement('div')
    this.gameControlButtonBox.className = 'memory-game-controller-button-box'

    this.gameControllStatBox = document.createElement('div')
    this.gameControllStatBox.className = 'memory-game-status-box'

    this.gameStatusAttemptsMadeLabel = document.createElement('label')
    this.gameStatusAttemptsMadeLabel.innerText = 'Tries: 0'
    this.gameStatusTimeLabel = document.createElement('label')
    this.gameStatusTimeLabel.innerText = 'Time: 0 s'
    this.gameControllStatBox.appendChild(this.gameStatusAttemptsMadeLabel)
    this.gameControllStatBox.appendChild(this.gameStatusTimeLabel)

    this.controllerGoBack = document.createElement('input')
    this.controllerGoBack.type = 'button'
    this.controllerGoBack.classList.add('memory-game-controller-button-goBack')
    this.controllerGoBack.classList.add('memory-game-controller-button')
    this.gameControlButtonBox.appendChild(this.controllerGoBack)

    this.controllerRestart = document.createElement('input')
    this.controllerRestart.type = 'button'
    this.controllerRestart.classList.add('memory-game-controller-button-restart')
    this.controllerRestart.classList.add('memory-game-controller-button')
    this.gameControlButtonBox.appendChild(this.controllerRestart)
    this.elementGameController.appendChild(this.gameControlButtonBox)
    this.elementGameController.appendChild(this.gameControllStatBox)

    this.greetingLable = document.createElement('label')
    this.greetingLable.innerText = 'Welcome to the game!'
    this.greetingLable.className = 'memory-start-label'

    this.gridContainer = document.createElement('div')
    if (this.numOfColumns === 4) {
      this.gridcontainerClass = 'memory-game-grid-container-4columns'
    } else {
      this.gridcontainerClass = 'memory-game-grid-container-2columns'
    }

    this.gridContainer.className = this.gridcontainerClass
    this.elementGameScreen.appendChild(this.gridContainer)

    this.EndGameAnnouncementDiv = document.createElement('div')
    this.EndGameAnnouncementDiv.className = 'memory-game-end-div'
    this.EndGameLabel = document.createElement('label')
    this.EndGameLabel.className = 'memory-game-end-label'
    this.EndGameLabel.innerText = 'You win!'
    this.EndGameAnnouncementDiv.appendChild(this.EndGameLabel)

    this.generateSet()
    this.element.appendChild(this.elementGameScreen)
    this.element.appendChild(this.elementGameController)
    this.parentElement.appendChild(this.element)

    this.initializeEvents()
    this.TilesList[0].focus()
  }

  // Generates the tiles
  generateSet () {
    const tempArray = []
    for (let i = 0; i < this.x * this.y / 2; i++) {
      tempArray.push(i)
      tempArray.push(i)
    }

    // Shuffle the Array
    for (let i = tempArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]
    }

    for (let i = 0; i < tempArray.length; i++) {
      this.TilesList.push(new Tile(this.gridContainer, tempArray[i], this.imagePaths, this.openTileInGame))
    }
  }

  /**
   * function that is responsible for removing this element from the parent class,
   * as well as closing any time intervals that are not required anymore.
   */
  close () {
    this.stopTimer() // Get rid of the time interval
    this.parentElement.removeChild(this.element)
  }

  /**
   * Function that is called when the game should be restarted.
   */
  resetGame () {
    // Empty the gridContainer
    while (this.gridContainer.firstChild) {
      this.gridContainer.removeChild(this.gridContainer.firstChild)
    }
    this.TilesList = [] // new list
    this.generateSet()
    this.TilesList[0].focus()
    this.currentlyFocusedElementInGrid = 0
    this.stateOfMatching = false
    this.previouslySelectedTile = null
    this.GameStatePaused = false
    this.stopTimer()
    this.updateAttemptsMade(0)
    this.updateTime(0)
    if (this.gameIsFinished) {
      this.gameIsFinished = false
      this.elementGameScreen.appendChild(this.gridContainer)
      this.elementGameScreen.removeChild(this.EndGameAnnouncementDiv)
    }
    clearTimeout(this.timeout)
  }

  /**
   * A function created in the parent class that will be pushed to the child, responsible for opening tiles
   * There are some parts that need to be handeled on the parent side, not just the tile itself.
   * @param {Tile} TileToOpen - Tile object that needs to be opened
   */
  openTileInGame = (TileToOpen) => {
    // If a tile is already selected
    this.startTimer()
    if (!this.GameStatePaused) {
      this.GameStatePaused = true
      // If there is already a tile previously selected
      if (this.stateOfMatching) {
        TileToOpen.openTile()
        if (TileToOpen.getId() === this.previouslySelectedTile.getId()) {
          this.previouslySelectedTile = null
          this.stateOfMatching = false
          this.GameStatePaused = false
          this.checkIfGameWasWon()
        } else {
          this.timeout = setTimeout(() => {
            TileToOpen.closeTile()
            this.previouslySelectedTile.closeTile()
            this.previouslySelectedTile = null
            this.GameStatePaused = false
          }, 500)
        }
        this.updateAttemptsMade(this.attemptCounter + 1)
        this.stateOfMatching = false
      // If the is no previous tile selected
      } else {
        this.stateOfMatching = true
        this.previouslySelectedTile = TileToOpen
        TileToOpen.openTile()
        this.GameStatePaused = false
      }
    }
  }

  /**
   * Function that is used to target the controller buttons.
   */
  focusOnController () {
    this.gameControlButtonBox.firstChild.focus()
  }

  /**
   * Function that is used to set the new time
   * @param {number} newTime - The current time that should be displaid
   */
  updateTime (newTime) {
    this.timePassed = newTime
    this.gameStatusTimeLabel.innerText = `Time: ${this.timePassed} s`
  }

  /**
   * Function that is used to set the new number of attempts made
   * @param {number} newNumber - The number of attempts made that should be displaid
   */
  updateAttemptsMade (newNumber) {
    this.attemptCounter = newNumber
    this.gameStatusAttemptsMadeLabel.innerText = `Tries: ${this.attemptCounter}`
  }

  /**
   * Function that checks if the game was won or not and then acts appropriatly
   */
  checkIfGameWasWon () {
    if (!this.GameStatePaused && this.checkIfAllTilesAreOpen()) {
      this.gameIsFinished = true
      this.finaliseGame()
      this.focusOnController()
    }
  }

  /**
   * Function that makes the timer start running.
   * This is done so that the timer start running only when the player makes his first attempt.
   */
  startTimer () {
    if (!this.timerIsRunning) {
      this.timer = setInterval(() => {
        this.updateTime(this.timePassed + 1)
      }, 1000)
      this.timerIsRunning = true
    }
  }

  /**
   * This fucntion is responsible for stopping the timer from running.
   */
  stopTimer () {
    if (this.timerIsRunning) {
      clearInterval(this.timer)
      this.timer = null
      this.timerIsRunning = false
    }
  }

  /**
   * This function is to display the victory screen.
   */
  finaliseGame () {
    this.elementGameScreen.removeChild(this.gridContainer)
    this.elementGameScreen.appendChild(this.EndGameAnnouncementDiv)
    this.stopTimer()
  }

  /**
   * This function is responsible for checking if all of the Tiles have been opened
   * @returns {boolean} - True if all tiles are open / False if not tiles are open
   */
  checkIfAllTilesAreOpen () {
    for (let i = 0; i < this.TilesList.length; i++) {
      // If we find a tile that is not open
      if (!this.TilesList[i].getIsShown()) {
        return false
      }
    }
    return true
  }

  /**
   * Function responsible  for adding event listeners to certain elements
   * Should only be executed once in the constructor.
   */
  initializeEvents () {
    this.controllerGoBack.addEventListener('click', () => {
      this.close()
      this.exitGame()
    })

    this.controllerRestart.addEventListener('click', () => {
      this.resetGame()
    })

    this.element.addEventListener('keydown', (event) => {
      if (this.element.contains(document.activeElement)) {
        // Movement in controller
        if (this.gameControlButtonBox.contains(document.activeElement)) {
          const controllerChildren = Array.from(this.gameControlButtonBox.children)
          const indexOfCurrentElement = controllerChildren.indexOf(document.activeElement)
          if (event.key === 'ArrowLeft') {
            if (indexOfCurrentElement > 0) {
              controllerChildren[indexOfCurrentElement - 1].focus()
            }
          } else if (event.key === 'ArrowRight') {
            if (indexOfCurrentElement < controllerChildren.length - 1) {
              controllerChildren[indexOfCurrentElement + 1].focus()
            }
          } else if (event.key === 'ArrowUp' && !this.gameIsFinished) {
            this.TilesList[this.currentlyFocusedElementInGrid].focus()
          }
          // Movement in Grid
        } else {
          // Left-key
          if (event.key === 'ArrowLeft') {
            if (this.currentlyFocusedElementInGrid % this.numOfColumns > 0) {
              this.currentlyFocusedElementInGrid--
              this.TilesList[this.currentlyFocusedElementInGrid].focus()
            }
          }

          // Right-key
          if (event.key === 'ArrowRight') {
            if (this.currentlyFocusedElementInGrid % this.numOfColumns < this.numOfColumns - 1) {
              this.currentlyFocusedElementInGrid++
              this.TilesList[this.currentlyFocusedElementInGrid].focus()
            }
          }

          // Up-key
          if (event.key === 'ArrowUp') {
            if (this.currentlyFocusedElementInGrid - this.numOfColumns >= 0) {
              this.currentlyFocusedElementInGrid -= this.numOfColumns
              this.TilesList[this.currentlyFocusedElementInGrid].focus()
            }
          }

          // Down-key
          if (event.key === 'ArrowDown') {
            if (this.currentlyFocusedElementInGrid + this.numOfColumns < this.TilesList.length) {
              this.currentlyFocusedElementInGrid += this.numOfColumns
              this.TilesList[this.currentlyFocusedElementInGrid].focus()
            } else {
              this.focusOnController()
            }
          }
        }
      }
    })
  }
}
export { GameScreen }
