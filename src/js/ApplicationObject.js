/**
 * This class is the skeleton code for any future application
 * @class
 */
class Application {
  /**
   * Constructor
   * @param {number} id - unique number indicating the application.
   * @param {HTMLElement} parentElement - Parent element to which we will append this class.
   * @param {number} getNextZIndex - Parent function that allows to get the next biggest Zindex so that this application would be
   * displayed on top.
   */
  constructor (id, parentElement, getNextZIndex) {
    this.id = id
    this.parentElement = parentElement
    this.getNextBiggestZIndex = getNextZIndex

    // Creating elements
    // Creating main Element
    this.element = document.createElement('div')
    this.element.draggable = false
    this.element.className = 'application'
    this.element.tabIndex = 0

    // Creating toolbar
    this.elementToolbar = document.createElement('div')
    this.elementToolbar.className = 'application-toolbar'

    // Close button
    this.button = document.createElement('button')
    this.button.textContent = 'X'
    this.button.className = 'application-toolbar-button'

    // Label
    this.title = document.createElement('label')
    this.title.innerText = 'Chat'
    this.title.className = 'application-toolbar-title'

    // Inserting elements into toolbar
    this.elementToolbar.appendChild(this.title)
    this.elementToolbar.appendChild(this.button)

    // Inserting elements into the mainElement
    this.element.appendChild(this.elementToolbar)

    // Everything related to dragging.
    let offsetX, offsetY
    const move = (e) => {
      // Before updating, we check if the box doesn't go out of the screen
      let newX = e.clientX - offsetX
      let newY = e.clientY - offsetY

      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      const maxXposition = windowWidth - this.element.offsetWidth

      const windowHeight = window.innerHeight
      const maxYposition = windowHeight - this.element.offsetHeight - document.getElementById('toolbar-menu').offsetHeight

      if (newX < 0) {
        newX = 0
      }

      if (newX > maxXposition) {
        newX = maxXposition
      }

      if (newY < 0) {
        newY = 0
      }

      if (newY > maxYposition) {
        newY = maxYposition
      }

      this.element.style.left = `${newX}px`
      this.element.style.top = `${newY}px`
    }

    this.element.addEventListener('mousedown', e => {
      offsetX = e.clientX - this.element.offsetLeft
      offsetY = e.clientY - this.element.offsetTop

      this.parentElement.addEventListener('mousemove', move)
    })

    this.parentElement.addEventListener('mouseup', () => {
      this.parentElement.removeEventListener('mousemove', move)
    })

    this.initializeEvents()
    this.parentElement.appendChild(this.element)
  }

  /**
   * Function that is used to close the application (remove the class from the parent)
   */
  close () {
    this.parentElement.removeChild(this.element)
  }

  /**
   * Function responsible for initializing event listeners.
   * Should only be called once in the constructor.
   */
  initializeEvents () {
    this.element.addEventListener('click', () => {
      this.element.style.zIndex = this.getNextBiggestZIndex()
    })

    this.button.addEventListener('click', () => {
      this.close()
    })
  }
}

export { Application }
