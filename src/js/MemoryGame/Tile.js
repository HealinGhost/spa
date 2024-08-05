/**
 * This class is responsible for the functionality of a single tile in the memory game.
 * @class
 */
class Tile {
  /**
   * Constructor
   * @param {HTMLElement} parentElement - element to which this class should be appended.
   * @param {number} id - unique number that indentifies its image.
   * @param {Array} imagePaths - Array containing string paths to the memory card images.
   * @param {Function} openTileInGame - function in the parent class that opens this current tile
   * This is done so that certain actions are done in the parent class.
   */
  constructor (parentElement, id, imagePaths, openTileInGame) {
    this.questionMarkURL = 'url(../../img/question.png)'
    this.imagePaths = imagePaths
    this.openTileInGame = openTileInGame
    this.classNameShow = 'memory-game-tile-show'
    this.classNameHide = 'memory-game-tile-hidden'
    this.parentElement = parentElement
    this.id = id
    this.IsShown = false
    this.element = document.createElement('div')
    this.element.tabIndex = 0
    this.imageDiv = document.createElement('div')
    this.imageDiv.className = 'memory-game-tile-image'
    this.imageDiv.style.backgroundImage = this.questionMarkURL
    this.element.classList.add(this.classNameHide)
    this.element.classList.add('memory-game-tile')
    this.element.appendChild(this.imageDiv)
    this.parentElement.appendChild(this.element)

    this.initializeEvents()
  }

  /**
   * Setter function for id
   * @param {number} id - the id of the class
   */
  setId (id) {
    this.id = id
  }

  /**
   * Getter function for the id
   * @returns {number} - the id of the class
   */
  getId () {
    return this.id
  }

  /**
   * Setter function for the boolean value isShown
   * @param {boolean} show - value that indicates if the current tile is shown or hidden.
   */
  setIsShown (show) {
    this.show = show
  }

  /**
   * Getter function for the boolean value isShown
   * @returns {boolean} - value that indicates if the current tile is shown or hidden.
   */
  getIsShown () {
    return this.IsShown
  }

  /**
   * Function that sets focus to this class.
   */
  focus () {
    this.element.focus()
  }

  /**
   * Function that is called from the parent class to open this tile.
   */
  openTile () {
    this.IsShown = true
    this.element.classList.remove(this.classNameHide)
    this.element.classList.add(this.classNameShow)
    this.imageDiv.style.backgroundImage = this.imagePaths[this.id]
  }

  /**
   * Function that is called from the parent class to close this tile.
   */
  closeTile () {
    this.IsShown = false
    this.element.classList.add(this.classNameHide)
    this.element.classList.remove(this.classNameShow)
    this.imageDiv.style.backgroundImage = this.questionMarkURL
  }

  /**
   * Function that is responsible for adding event listeners to the elements.
   * Should only be called once in the constructor.
   */
  initializeEvents () {
    this.element.addEventListener('click', () => {
      if (!this.IsShown) {
        this.openTileInGame(this)
      }
    })

    this.element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (!this.IsShown) {
          this.openTileInGame(this)
        }
      }
    })
  }
}
export { Tile }
