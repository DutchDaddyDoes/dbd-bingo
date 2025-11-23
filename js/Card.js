class Card {
  constructor() {
    this.killers = new Killers(this)
    this.ui = new UI(this)
    this.slotData = new SlotData(this)

    this.activeSlot = undefined
    this.activeGridPosition = undefined

    this.random = false
    this.cardSize = '5x5' // Default to 5x5
  }

  setCardSize(size) {
    this.cardSize = size
    this.ui.redrawCard()
    // Reset any active selections
    this.activeGridPosition = undefined
    this.activeSlot = undefined
    const instructions = document.getElementById('instructions')
    instructions.innerHTML = 'Select a Spot on the Bingo Card to Fill.'
  }

  async init() {
    if (this.killers.killers) {
      // Initialize Killers List
      if (this.killers.killers.length === 0) {
        // Populate `this.killers.killers` from API
        await this.killers.getKillers()
        // Call `init()` again to sort version
        this.init()
      // After retrieving killers, sort into Version
      } else if (this.killers.killers.length === 41) {
        // Sort Killers
        this.killers.versions = await this.killers.sortKillers()
        // Render Version List
        this.ui.renderPortraitSelectors()
      }
    } else {
      // Reset `this.killers.killers` if undefined
      this.killers.killers = new Array()
      // Call `init()` again to restart process
      setTimeout(this.init(), 5000)
    }
  }

  downloadImage(element) {
    let image = this.ui.canvas.toDataURL('image/jpg')
    element.href = image
  }

  randomizeCard() {
    // For each slot on Bingo Card (1-25, except 13)
    let numbers = Array.apply(null, {length: 41}).map(Number.call, Number);
    shuffle(numbers);

    function shuffle(numbers) {
      let currentIndex = numbers.length, randomIndex;

      while(currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;

        [numbers[currentIndex],numbers[randomIndex]] = [numbers[randomIndex],numbers[currentIndex]];
      }

      return numbers;
    }
    
    if (this.cardSize === '5x5') {
      // 5x5 card with free space
      for (let slot = 1; slot <= 25; slot++) {
        this.activeSlot = slot
        this.activeGridPosition = this.slotData.slotToGrid[slot]

        if (slot !== 13) {  
          // Get random integer between 0 and 40
          const randomKillerNumber = numbers[slot-1]
          
          // Get Killer from `randomKillerNumber`
          const killer = this.killers.killers[randomKillerNumber]

          // Call updateKiller() to place Killer on card
          this.ui.updateKiller(killer.id, killer.name, true)
        }
      }
    } else {
      // 4x4 card without free space
      for (let slot = 1; slot <= 16; slot++) {
        this.activeSlot = slot
        this.activeGridPosition = this.slotData.slotTo4x4Grid[slot]

        // Get random integer between 0 and 40
        const randomKillerNumber = numbers[slot-1]
        
        // Get Killer from `randomKillerNumber`
        const killer = this.killers.killers[randomKillerNumber]

        // Call updateKiller() to place Killer on card
        this.ui.updateKiller(killer.id, killer.name, true)
      }
    }
    
    this.random = true
    this.ui.toggleRandomVerificationElement()
  }
}

const card = new Card()
card.init()