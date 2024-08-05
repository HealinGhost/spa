import { Application } from './ApplicationObject.js'

/**
 * This class is an extension of the Application skeleton code and implements the magic 8ball
 * functionality.
 * This class is responsible for managing the entire magic 8ball application functionality
 * @class
 */
class EightBallObject extends Application {
  /**
   * Constructor
   * @param {number} id - Unique number indicating the application.
   * @param {HTMLElement} parentElement - Element to which this class should be appended to
   * @param {number} getNextZIndex - Function that is used to get the next Z index to be displayed on top of other applications
   */
  constructor (id, parentElement, getNextZIndex) {
    super(id, parentElement, getNextZIndex)

    this.isPaused = false
    this.answers = []
    this.answers.push('yes')
    this.answers.push('no')
    this.answers.push('maybe?')
    this.answers.push('not likely')
    this.answers.push('most likely')
    this.answers.push("I don't think so")
    this.answers.push('try asking again')

    this.title.innerText = 'Magic 8 Ball'
    this.parentElement = parentElement

    this.applicationScreen = document.createElement('div')
    this.applicationScreen.className = 'eightball-application-screen'

    this.displayBox = document.createElement('div')
    this.displayBox.className = 'eightball-display-box'

    this.displayBall = document.createElement('div')
    this.displayBall.className = 'eightball-display-OutsideBall'

    this.displayBallOutput = document.createElement('div')
    this.displayBallOutput.className = 'eightball-display-InsideBall'

    this.outputLable = document.createElement('label')
    this.outputLable.className = 'eightball-output-label'
    this.outputLable.innerText = '8'

    this.inputBox = document.createElement('div')
    this.inputBox.className = 'eightball-input-box'

    // Input submit message
    this.inputSubmitText = document.createElement('input')
    this.inputSubmitText.type = 'button'
    this.inputSubmitText.value = 'Ask'
    this.inputSubmitText.className = 'eightball-input-submit'

    this.inputChat = document.createElement('input')
    this.inputChat.type = 'text'
    this.inputChat.className = 'eightball-input-text'

    this.applicationScreen.appendChild(this.displayBox)
    this.displayBallOutput.appendChild(this.outputLable)
    this.displayBall.appendChild(this.displayBallOutput)
    this.displayBox.appendChild(this.displayBall)

    this.applicationScreen.appendChild(this.inputBox)
    this.inputBox.appendChild(this.inputChat)
    this.inputBox.appendChild(this.inputSubmitText)

    this.element.appendChild(this.applicationScreen)

    this.initializeEightballEvents()
  }

  /**
   * Function that initializes all of the event listeners.
   * Should only be called once in the constructor.
   */
  initializeEightballEvents () {
    this.inputSubmitText.addEventListener('click', () => {
      this.askQuestionEvent()
    })

    this.applicationScreen.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (this.applicationScreen.contains(document.activeElement)) {
          this.askQuestionEvent()
        }
      }
    })
  }

  /**
   * Refactored function that is an event, that is responsible to handle question event.
   */
  askQuestionEvent () {
    if (this.inputChat.value.length > 0 && !this.isPaused) {
      this.isPaused = true
      this.inputChat.focus()
      this.inputChat.value = ''
      if (this.outputLable.classList.contains('fade-in')) {
        this.outputLable.classList.remove('fade-in')
      }
      this.outputLable.classList.add('fade-out')
      setTimeout(() => {
        const answerPosition = Math.floor(Math.random() * 6)
        this.outputLable.innerText = this.answers[answerPosition]
        this.outputLable.classList.remove('fade-out')
        this.outputLable.classList.add('fade-in')
        this.isPaused = false
      }, 1000)
    }
  }

  /**
   * Function that is called from the parent to close the current application.
   */
  close () {
    super.close()
  }
}

export { EightBallObject }
