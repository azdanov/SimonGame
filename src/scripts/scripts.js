import {playSound, stopSound} from './sounds'
import game from './game'

export const $pads = document.querySelectorAll('.pad')
export const $info = document.querySelector('.info')
const $restart = document.querySelector('#restart')
const $navigation = document.querySelector('#navigation')
const $navigationDisplay = document.querySelector('#navigation + label')
const $strict = document.querySelector('#strict')

$info.addEventListener('click', function activatePads () {
  $info.removeEventListener('click', activatePads, false)
  $navigationDisplay.style.display = 'block'
  for (let i = 0; i < $pads.length; i++) {
    $pads[i].classList.add('active')
    $info.textContent = ''
    window.setTimeout(() => {
      $pads[i].onmousedown = playSound.bind(null, i)
      $pads[i].ontouchstart = playSound.bind(null, i)
      $pads[i].onmouseup = stopSound.bind(null, i)
      $pads[i].ontouchend = () => {
        stopSound(i)
        game.updatePlayerSequence(i)
      }
      $pads[i].onclick = game.updatePlayerSequence.bind(null, i)
      $restart.onclick = () => {
        window.setTimeout(game.initGame, 200)
        $navigation.checked = false
      }
      $strict.onchange = () => {
        game.strict = $strict.checked
        $navigation.checked = false
      }
      game.initGame()
    }, 1000)
  }
}, false)
