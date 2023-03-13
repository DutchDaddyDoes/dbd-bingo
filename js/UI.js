class UI {
  constructor(card) {
    this.card = card

    // Define Canvas
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.canvas.width = 590
    this.canvas.height = 700
    this.ctx = this.canvas.getContext('2d')
    this.bg = this.setBackground()

    this.firstTextPlaced = false
  }

  setBackground() {
    let background = new Image()
    background.src = './img/card.jpg'
    background.onload = () => {
      this.ctx.drawImage(background, 0, 0)
    }
    this.canvas.addEventListener('click', this.clickCanvas.bind(this))
  }

  updateKiller(killerId, killerName, random=false) {
    if (this.card.activeSlot && this.card.activeSlot !== 13) {
      let icon = new Image()
      icon.src = `https://dutchdaddydoes.github.io/ACNHAPI/images/killers/${killerId}.png`
      icon.crossOrigin = 'anonymous'
      
      let column = String(this.card.activeGridPosition)[0]
      let row = String(this.card.activeGridPosition)[2]
      
      icon.onload = () => {
        const columnCenter = this.card.slotData.columns[column] + 50
        const textWidth = Number(this.ctx.measureText(killerName).width)
        const textHeightPosition = this.card.slotData.rows[row] + this.card.slotData.slotHeight - 10
        
        this.ctx.drawImage(icon, this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 15, 60, 60)
        
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 75, 60, 20)
        
        this.ctx.font = '14px Roboto Bold'
        this.ctx.fillStyle = '#60bec3'
        this.ctx.fillText(killerName, columnCenter - (textWidth / 2), textHeightPosition)

        // Fixes uneven text placement bug
        if (!this.firstTextPlaced) {
          this.firstTextPlaced = true
          this.ctx.fillStyle = "#fff"
          this.ctx.fillRect(this.card.slotData.columns[column] + 20, this.card.slotData.rows[row] + 75, 60, 20)
        
          this.ctx.font = '14px Roboto Bold'
          this.ctx.fillStyle = '#60bec3'
          this.ctx.fillText(killerName, columnCenter - (Number(this.ctx.measureText(killerName).width) / 2), textHeightPosition)
        }
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
      this.ctx.fillStyle = "#fff"
      this.ctx.fillRect(360, 677, 225, 25)

      this.ctx.font = '12px Roboto Bold'
      this.ctx.fillStyle = '#C0C0C0'
      this.ctx.fillText('Certified Randomly Generated Card', 370, 695)
    } else {
      this.ctx.fillStyle = "#fff"
      this.ctx.fillRect(360, 677, 225, 25)
    }
  }

  setEventListeners() {
    // Get Elements
    let selectorsElements = document.querySelectorAll('.version-portrait-container')
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
    const { version: versionObj } = this.card.killers
    
    // Create Version Container
    const killersContainer = document.getElementById('killers-container')
    // Remove "Loading" Text
    killersContainer.innerHTML = ''

    for (const killerType in versionObj) {
      // Create KillerType Header
      const killerHeading = document.createElement('h2')
      killerHeading.innerHTML = versionObj[killerType]['killerName']
      killerHeading.className = 'version-header'
      killersContainer.appendChild(killerHeading)
  
      // Create Killer Type Portraits Container
      const killerContainer = document.createElement('div')
      killerContainer.className = 'killer-type-portrait-container'

      // Create Portraits
      versionObj[killerType][killerType].map((killer) => {
        // Create Portrait Container
        const killerPortraitContainer = document.createElement('div')
        killerPortraitContainer.className = 'portrait-container'
        killerPortraitContainer.setAttribute('data-id', killer['id'])
        killerPortraitContainer.setAttribute('data-name', killer['name'])
  
        // Create Portrait
        const killerPortrait = document.createElement('img')
        killerPortrait.src = killer['icon_uri']
        killerPortrait.className = 'killer-portrait grow'
  
        // Create Name Text
        const killerName = document.createElement('p')
        killerName.className = 'killer-name'
        killerName.innerHTML = killer['name']
  
        killerPortraitContainer.appendChild(killerPortrait)
        killerPortraitContainer.appendChild(killerName)
        killerContainer.appendChild(killerPortraitContainer)
      })
  
      killersContainer.appendChild(killerContainer)
    }
  
    this.setEventListeners()
  }

  clickCanvas(e) {
    let gridPosition = this.card.slotData.detectGridPosition(e.clientX, e.clientY)
    this.card.activeGridPosition = gridPosition
    this.card.activeSlot = this.card.slotData.gridToSlot[gridPosition]
  
    if (this.card.activeSlot && this.card.activeSlot !== 13) {
      const instructions = document.getElementById('instructions')
      instructions.innerHTML = `Select a Killer to fill ${gridPosition.replace(/\s/g, '')}.`
    } else if (this.card.activeSlot === 13) {
      const instructions = document.getElementById('instructions')
      instructions.innerHTML = `Cannot Replace Free Space!`
    }
  }
}
