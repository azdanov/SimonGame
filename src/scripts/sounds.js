const context = new AudioContext()
const frequencies = [415.305, 311.127, 247.942, 207.652] // Green, Red, Yellow, Blue

const ramp = 0.1

const errorOscillator = context.createOscillator()
errorOscillator.type = 'triangle'
errorOscillator.frequency.value = 42
errorOscillator.start(0.0)
const errorSound = context.createGain()
errorOscillator.connect(errorSound)
errorSound.gain.value = 0
errorSound.connect(context.destination)

const oscillators = frequencies.map(function (frequency) {
  const oscillator = context.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  oscillator.start(0.0)
  return oscillator
})

const sounds = oscillators.map(function (oscillator) {
  const gain = context.createGain()
  oscillator.connect(gain)
  gain.connect(context.destination)
  gain.gain.value = 0
  return gain
})

function playSound (i) {
  sounds[i].gain.linearRampToValueAtTime(0.5, context.currentTime + ramp)
}

function stopSound (i) {
  sounds[i].gain.linearRampToValueAtTime(0, context.currentTime + ramp)
}

function playError (callback = () => {}) {
  errorSound.gain.linearRampToValueAtTime(1, context.currentTime + ramp)
  window.setTimeout(() => {
    errorSound.gain.linearRampToValueAtTime(0, context.currentTime + ramp)
    callback()
  }, 800)
}

export { playSound, stopSound, playError }
