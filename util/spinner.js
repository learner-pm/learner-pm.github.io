const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
let currentFrameIndex = 0
let spinnerInterval

const startSpinner = () => {
  spinnerInterval = setInterval(() => {
    process.stdout.write(`\r${spinnerFrames[currentFrameIndex]} Please wait...`)
    currentFrameIndex = (currentFrameIndex + 1) % spinnerFrames.length
  }, 100)
}

const stopSpinner = () => {
  clearInterval(spinnerInterval)
  process.stdout.write('\r\x1b[K') // Clear line
}

export { startSpinner, stopSpinner }
