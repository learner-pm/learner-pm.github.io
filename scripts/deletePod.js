import { exec } from 'child_process'

exec('kubectl get pods', (error, stdout, stderr) => {
  console.log(stdout.toString()?.split('\n'))
  console.log(stdout)
  console.log(stderr)
  if (error) {
    console.log(`exec error: ${error.message}`)
    return
  }
})
