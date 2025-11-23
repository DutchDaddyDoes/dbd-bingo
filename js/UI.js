class UI {
  constructor(card) {
    this.card = card

    // Define Canvas
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.canvas.width = 590
    this.canvas.height = 700
    this.ctx = this.canvas.getContext('2d')
    // Create both background images
    this.background5x5 = new Image()
    this.background5x5.src = './img/card.jpg'

    this.background4x4 = new Image()
    this.background4x4.src = './img/card4.jpg'

    // Use the 5x5 background by default
    this.background = this.background5x5

    this.background5x5.onload = () => {
      this.redrawCard()
    }

    this.background4x4.onload = () => {
      if (this.card.cardSize === '4x4') {
        this.redrawCard()
      }
    }

    this.firstTextPlaced = false
    this.canvas.addEventListener('click', this.clickCanvas.bind(this))

    // Add resize listener for responsiveness
    window.addEventListener('resize', () => {
      this.redrawCard()
    })
  }

  setBackground() {
    // Use the appropriate background based on card size
    this.background = this.card.cardSize === '4x4' ? this.background4x4 : this.background5x5
    this.ctx.drawImage(this.background, 0, 0)
  }

  redrawCard() {
    // Adjust canvas size based on card size and screen width
    const isMobile = window.innerWidth <= 768;

    if (this.card.cardSize === '4x4') {
      this.canvas.width = isMobile ? Math.min(480, window.innerWidth - 20) : 480;
      this.canvas.height = isMobile ? this.canvas.width * (590/480) : 590;
    } else {
      this.canvas.width = isMobile ? Math.min(590, window.innerWidth - 20) : 590;
      this.canvas.height = isMobile ? this.canvas.width * (700/590) : 700;
    }

    // Clear canvas and redraw background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.setBackground()

    // Reset the first text placed tracker
    this.firstTextPlaced = false
  }

  updateKiller(killerId, killerName, random=false) {
    if ((this.card.cardSize === '5x5' && this.card.activeSlot && this.card.activeSlot !== 13) || 
      (this.card.cardSize === '4x4' && this.card.activeSlot)) {
      let icon = new Image()
      icon.src = `https://dutchdaddydoes.github.io/ACNHAPI/images/killers/${killerId}.png`
      icon.crossOrigin = 'anonymous'
      
      let column = String(this.card.activeGridPosition)[0]
      let row = String(this.card.activeGridPosition)[2]
      
      icon.onload = () => {
        const columnCenter = this.card.slotData.columns[column] + 50
        /*const textWidth = Number(this.ctx.measureText(killerName).width)
        const textHeightPosition = this.card.slotData.rows[row] + this.card.slotData.slotHeight*/
        
        this.ctx.drawImage(icon, this.card.slotData.columns[column] + 5, this.card.slotData.rows[row] + 5, 90, 90)
        
        /*this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 75, 60, 20)
        
        this.ctx.font = '14px Roboto Bold'
        this.ctx.fillStyle = '#60bec3'
        this.ctx.fillText(killerName, columnCenter - (textWidth / 2), textHeightPosition)*/

        // Fixes uneven text placement bug
        /*if (!this.firstTextPlaced) {
          this.firstTextPlaced = true
          this.ctx.fillStyle = "#fff"
          this.ctx.fillRect(this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 75, 60, 20)
        
          this.ctx.font = '14px Roboto Bold'
          this.ctx.fillStyle = '#60bec3'
          this.ctx.fillText(killerName, columnCenter - (Number(this.ctx.measureText(killerName).width) / 2), textHeightPosition)
        }*/
      }

    }

    this.card.random = random
    this.toggleRandomVerificationElement()
    
    this.card.activeGridPosition = undefined
    this.card.activeSlot = undefined
    const instructions = document.getElementById('instructions')
    instructions.innerHTML = 'Select a Spot on the Bingo Card to Fill.'
  }

  toggleRandomVerificationElement() {
    if (this.card.random) {
      if (this.card.cardSize === '5x5') {
        // 5x5 card position
        this.ctx.fillStyle = "#525252"
        this.ctx.fillRect(318, 677, 285, 25)

        this.ctx.font = 'bold 16px Roboto'
        this.ctx.fillStyle = '#800000'
        this.ctx.fillText('Certified Randomly Generated Card', 320, 695)
      } else {
        // 4x4 card position
        this.ctx.fillStyle = "#525252"
        this.ctx.fillRect(220, 565, 285, 25)

        this.ctx.font = 'bold 16px Roboto'
        this.ctx.fillStyle = '#800000'
        this.ctx.fillText('Certified Randomly Generated Card', 230, 580)
      }
    } else {
      if (this.card.cardSize === '5x5') {
        this.ctx.fillStyle = "#525252"
        this.ctx.fillRect(318, 677, 285, 25)
        this.ctx.font = 'bold 16px Roboto'
        this.ctx.fillStyle = "#800000"
        this.ctx.fillText('Handpicked Bingo Card', 370, 695)
      } else {
        this.ctx.fillStyle = "#525252"
        this.ctx.fillRect(220, 565, 285, 25)
      }
    }
  }

  setEventListeners() {
    // Get Elements
    let selectorsElements = document.querySelectorAll('.animal-type-portrait-container')
    selectorsElements.forEach((selectElement) => {
      selectElement.addEventListener('click', event => {
        let element = event.target
        while (element.className !== 'portrait-container') {
          element = element.parentNode
        }
        this.updateKiller(element.attributes[1]['nodeValue'], element.attributes[2]['nodeValue'])
      })
    })
  }

  renderPortraitSelectors() {
    const { versions: animalsObj } = this.card.killers
    
    // Create AnimalType Container
    const killersContainer = document.getElementById('killers-container')
    // Remove "Loading" Text
    killersContainer.innerHTML = ''

    for (const animalType in animalsObj) {
      // Create AnimalType Header
      const animalHeading = document.createElement('h2')
      animalHeading.innerHTML = animalsObj[animalType]['gameVersion']
      animalHeading.className = 'animal-type-header'
      killersContainer.appendChild(animalHeading)
  
      // Create Animal Type Portraits Container
      const animalContainer = document.createElement('div')
      animalContainer.className = 'animal-type-portrait-container'

      // Create Portraits
      animalsObj[animalType][animalType].map((animal) => {
        // Create Portrait Container
        const animalPortraitContainer = document.createElement('div')
        animalPortraitContainer.className = 'portrait-container'
        animalPortraitContainer.setAttribute('data-id', animal['id'])
        animalPortraitContainer.setAttribute('data-name', animal['name'])
  
        // Create Portrait
        const animalPortrait = document.createElement('img')
        animalPortrait.src = animal['icon_uri']
        animalPortrait.className = 'animal-portrait grow'
  
        // Create Name Text
        const animalName = document.createElement('p')
        animalName.className = 'animal-name'
        animalName.innerHTML = animal['name']
  
        animalPortraitContainer.appendChild(animalPortrait)
        animalPortraitContainer.appendChild(animalName)
        animalContainer.appendChild(animalPortraitContainer)
      })
  
      killersContainer.appendChild(animalContainer)
    }
  
    this.setEventListeners()
  }

  clickCanvas(e) {
    let gridPosition = this.card.slotData.detectGridPosition(e.clientX, e.clientY)
    this.card.activeGridPosition = gridPosition
    
    if (this.card.cardSize === '5x5') {
      // 5x5 mode
      this.card.activeSlot = this.card.slotData.gridToSlot[gridPosition]

      if (this.card.activeSlot && this.card.activeSlot !== 13) {
        const instructions = document.getElementById('instructions')
        instructions.innerHTML = `Select a Killer to fill ${gridPosition.replace(/\s/g, '')}.`
      } else if (this.card.activeSlot === 13) {
        const instructions = document.getElementById('instructions')
        instructions.innerHTML = `Cannot Replace Free Space!`
      }
    } else {
      // 4x4 mode
      this.card.activeSlot = this.card.slotData.grid4x4ToSlot[gridPosition]

      // Check if the slot is valid for 4x4 mode
      if (this.card.activeSlot) {
        const instructions = document.getElementById('instructions')
        instructions.innerHTML = `Select a Killer to fill ${gridPosition.replace(/\s/g, '')}.`
      } else {
          // Invalid slot for 4x4 mode
          const instructions = document.getElementById('instructions')
          instructions.innerHTML = `Invalid spot for 4x4 mode. Please select a valid spot.`
      }
    }
  }
}
