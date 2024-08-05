import { Application } from './ApplicationObject.js'

const webSocketURL = 'wss://courselab.lnu.se/message-app/socket'

/**
 * This class is an extension of the Application skeleton code and implements chat like functionality
 * This class is responsible for managing the entire chat application functionality
 * @class
 */
class ChatObject extends Application {
  /**
   * Constructor
   * @param {number} id - unique number indicating the application.
   * @param {HTMLElement} parentElement - Parent element to which we will append this class.
   * @param {number} getNextZIndex - Parent function that allows to get the next biggest Zindex so that this application would be
   * displayed on top.
   */
  constructor (id, parentElement, getNextZIndex) {
    super(id, parentElement, getNextZIndex)

    this.communicationData = {
      type: 'message',
      data: '',
      username: '',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    this.inChatScreen = false

    this.applicationScreen = document.createElement('div')
    this.applicationScreen.className = 'chat-application-screen'

    // Display Messages
    this.outputBox = document.createElement('div')
    this.outputBox.className = 'chat-application-screen-output-box'

    // Information label
    this.InformUserLabel = document.createElement('label')
    this.InformUserLabel.className = 'chat-application-inform-label'
    this.InformUserLabel.textContent = 'Please add a username'

    // Input box
    this.inputBoxChat = document.createElement('div')
    this.inputBoxChat.className = 'chat-application-screen-input-box'

    // Input submit message
    this.submitText = document.createElement('input')
    this.submitText.type = 'button'
    this.submitText.value = 'send'
    this.submitText.className = 'chat-application-screen-submit'

    // Input text
    this.inputText = document.createElement('input')
    this.inputText.type = 'text'
    this.inputText.className = 'chat-application-screen-message'

    // Inserting elements into input field
    this.inputBoxChat.appendChild(this.inputText)
    this.inputBoxChat.appendChild(this.submitText)

    // Inserts itself into the application element
    this.element.appendChild(this.applicationScreen)

    const LocalUsername = localStorage.getItem('chat-username')
    if (LocalUsername === null || LocalUsername.length <= 0) {
      this.showEnterNameScreen()
    } else {
      this.communicationData.username = LocalUsername
      this.showLoggedInScreen()
    }

    console.log('Attempting to connect...')
    this.websocket = new WebSocket(webSocketURL)

    this.initializeChatEvents()
  }

  /**
   * Function that is an event, called when a message is sent.
   */
  sendMessageEvent () {
    if (this.inChatScreen) {
      this.SendMessage(this.inputText.value)
    } else {
      if (this.inputText.value.length === 0) {
        this.InformUserLabel.textContent = 'username needs to atleast 1 character'
      } else {
        localStorage.setItem('chat-username', this.inputText.value)
        this.communicationData.username = localStorage.getItem('chat-username')
        this.inputText.value = ''
        this.showLoggedInScreen()
      }
    }
  }

  /**
   * Function responsible for initializing event listeners.
   * Should only be called when once in the constructor.
   */
  initializeChatEvents () {
    this.submitText.addEventListener('click', () => {
      this.sendMessageEvent()
    })

    this.applicationScreen.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (this.applicationScreen.contains(document.activeElement)) {
          this.sendMessageEvent()
        }
      }
    })

    this.websocket.onopen = () => {
      console.log('Websocket is open!')
    }

    this.websocket.onclose = () => {
      console.log('Connection is closed')
    }

    this.websocket.onmessage = (event) => {
      console.log('Server said: ' + event.data)
      const parsedData = JSON.parse(event.data)
      // Check if we need to show new messages
      if (this.inChatScreen) {
        if (parsedData.type !== 'message') {
          console.log(parsedData)
        } else {
          this.newMessageReceived(parsedData)
        }
      }
    }
  }

  /**
   * Function that sends a message to the back end server.
   * @param {string} message - The text message that needs to be sent.
   */
  SendMessage (message) {
    if (localStorage.getItem('chat-username') === null) {
      this.showEnterNameScreen()
    } else {
      this.communicationData.data = message
      this.communicationData.username = localStorage.getItem('chat-username')
      const msgJson = JSON.stringify(this.communicationData)
      this.websocket.send(msgJson)
      this.inputText.value = ''
    }
  }

  /**
   * Function that closes the websocket connection.
   */
  CloseConnection () {
    this.websocket.close()
  }

  /**
   * Function that loads the screen where the user should enter his name
   */
  showEnterNameScreen () {
    this.inChatScreen = false
    this.inputText.value = ''
    this.clearScreen()
    this.clearMessageScreen()
    this.submitText.value = 'save'
    this.InformUserLabel.innerText = 'Please add a username'
    this.outputBox.appendChild(this.InformUserLabel)
    this.applicationScreen.appendChild(this.outputBox)
    this.applicationScreen.appendChild(this.inputBoxChat)
  }

  /**
   * Function that loads the newly received image
   * @param {Document} data - Document received from the Json Query
   */
  newMessageReceived (data) {
    const messageBox = document.createElement('div')
    messageBox.className = 'chat-application-screen-messageBox'
    const authorInMessageBoxdiv = document.createElement('div')
    const messageLabelDiv = document.createElement('div')
    const messageLabel = document.createElement('label')
    messageLabel.className = 'chat-label'
    messageLabel.innerText = data.data
    const authorLabel = document.createElement('label')
    authorLabel.className = 'chat-label'
    // Check if author is self
    if (data.username === localStorage.getItem('chat-username')) {
      authorLabel.innerText = ':' + data.username
      messageBox.style.textAlign = 'right'
    } else {
      authorLabel.innerText = data.username + ':'
    }

    authorInMessageBoxdiv.appendChild(authorLabel)
    messageLabelDiv.appendChild(messageLabel)
    messageBox.appendChild(authorInMessageBoxdiv)
    messageBox.appendChild(messageLabelDiv)

    messageBox.addEventListener('click', () => {
      // Replace the message input with the clicked message
      this.inputText.value = messageLabel.innerText
    })

    if (this.outputBox.firstChild) {
      this.outputBox.insertBefore(messageBox, this.outputBox.firstChild)
    } else {
      this.outputBox.appendChild(messageBox)
    }
  }

  /**
   * Function that loads the screen when the user has entered their name.
   */
  showLoggedInScreen () {
    this.inChatScreen = true
    this.clearScreen()
    this.clearMessageScreen()

    this.submitText.value = 'send'

    // Inserting elements into the applcation screen

    this.applicationScreen.appendChild(this.outputBox)
    this.applicationScreen.appendChild(this.inputBoxChat)
  }

  /**
   * Function that set the screen to show no screen.
   */
  clearScreen () {
    while (this.applicationScreen.firstChild) {
      this.applicationScreen.removeChild(this.applicationScreen.firstChild)
    }
  }

  /**
   * Removes all of the elements from the message screen.
   */
  clearMessageScreen () {
    while (this.outputBox.firstChild) {
      this.outputBox.removeChild(this.outputBox.firstChild)
    }
  }

  /**
   * Function that is called once the application should be closed.
   */
  close () {
    this.CloseConnection()
    super.close()
  }
}

export { ChatObject }
