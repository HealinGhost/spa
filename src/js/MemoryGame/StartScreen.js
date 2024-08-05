/**
 * This class is responsible for generating the screen that is displayed before the memory game is started
 * The goal of this class is to request and receive the size of the grid to be generated for the memory game
 * @class
 */
class StartScreen {
  /**
   * Constructor
   * @param {HTMLElement} parentElement - element to which this class element should be appended to
   * @param {Function} startGame - function from the parent class that allows the code to run the game.
   */
  constructor (parentElement, startGame) {
    this.parentElement = parentElement
    this.element = document.createElement('div')
    this.element.className = 'memory-start-screen'

    this.greetingLable = document.createElement('label')
    this.greetingLable.innerText = 'Please select size'
    this.greetingLable.className = 'memory-start-label'

    this.button1 = document.createElement('input')
    this.button1.tabIndex = 0
    this.button1.type = 'button'
    this.button1.value = '2 x 2'
    this.button1.className = 'memory-start-button'
    this.button1.addEventListener('click', () => {
      this.close()
      startGame(2, 2)
    })

    this.button2 = document.createElement('input')
    this.button2.type = 'button'
    this.button2.tabIndex = 0
    this.button2.value = '2 x 4'
    this.button2.className = 'memory-start-button'
    this.button2.addEventListener('click', () => {
      this.close()
      startGame(4, 2)
    })

    this.button3 = document.createElement('input')
    this.button3.type = 'button'
    this.button3.tabIndex = 0
    this.button3.value = '4 x 4'
    this.button3.className = 'memory-start-button'
    this.button3.addEventListener('click', () => {
      this.close()
      startGame(4, 4)
    })

    this.element.appendChild(this.greetingLable)
    this.element.appendChild(this.button1)
    this.element.appendChild(this.button2)
    this.element.appendChild(this.button3)
    this.parentElement.appendChild(this.element)
    this.button1.focus()
    this.initializeEvents()
  }

  /**
   * Function that removes this class element from the parent
   */
  close () {
    this.parentElement.removeChild(this.element)
  }

  /**
   * Function that is responsible for appending all event listeners
   * Should only be executed once in the constructor.
   */
  initializeEvents () {
    this.element.addEventListener('keydown', (event) => {
      if (this.element.contains(document.activeElement)) {
        const childrenArray = Array.from(this.element.children)
        let indexOfCurrentElement = childrenArray.indexOf(document.activeElement)
        // Up-key
        if (event.key === 'ArrowUp') {
          if (indexOfCurrentElement > 1) {
            indexOfCurrentElement--
            childrenArray[indexOfCurrentElement].focus()
          }
          // Down Key
        } else if (event.key === 'ArrowDown') {
          if (indexOfCurrentElement < childrenArray.length - 1) {
            indexOfCurrentElement++
            childrenArray[indexOfCurrentElement].focus()
          }
        }
      }
    })
  }
}

export { StartScreen }
