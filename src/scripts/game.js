import {stopSound, playError} from './sounds'
import {$pads, $info} from './scripts'

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function triggerMouseEvent (node, eventType) {
  const clickEvent = document.createEvent('MouseEvents')
  clickEvent.initEvent(eventType, true, true)
  node.dispatchEvent(clickEvent)
}

function updateCounter () {
  $info.textContent = game.level
}

const game = {
  maxLevel: 20,
  strict: false,
  level: 1,
  playerSequence: [],
  gameSequence: [],
  gameLength: 20,
  newSequence () {
    game.level = 1
    updateCounter()
    for (let i = 0; i < game.gameLength; i++) {
      game.gameSequence.push(getRandomInt(0, 4))
    }
  },
  verifySequence () {
    for (let i = 0; i < game.playerSequence.length; i++) {
      if (game.playerSequence[i] !== game.gameSequence[i]) {
        if (game.strict) {
          game.initGame()
          return
        }
        game.playerSequence = []
        playError(game.playSequence)
        return
      }
    }
    if (game.playerSequence.length === game.level) {
      window.setTimeout(game.nextLevel, 500)
    }
  },
  nextLevel () {
    game.level++
    if (game.level > game.maxLevel) {
      $info.classList.remove('count')
      $info.textContent = 'Won!'
      window.setTimeout(game.initGame, 5000)
      return
    }
    updateCounter()
    game.playerSequence = []
    game.playSequence()
  },
  updatePlayerSequence (i) {
    game.playerSequence.push(i)
    game.verifySequence()
  },
  playSequence () {
    for (let i = 0; i < $pads.length; i++) {
      stopSound(i)
    }
    let timeOut = 0
    for (let i = 0; i < game.level; i++) {
      window.setTimeout(() => {
        $pads[game.gameSequence[i]].classList.add('playing')
        triggerMouseEvent($pads[game.gameSequence[i]], 'mousedown')
      }, timeOut)
      timeOut += 600
      window.setTimeout(() => {
        triggerMouseEvent($pads[game.gameSequence[i]], 'mouseup')
        $pads[game.gameSequence[i]].classList.remove('playing')
      }, timeOut)
      timeOut += 300
    }
  },
  initGame () {
    $info.classList.add('count')
    game.gameSequence = []
    game.playerSequence = []
    game.newSequence()
    game.playSequence()
  }
}

export default game
