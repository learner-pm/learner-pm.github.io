const  { exec, spawn, execSync } = require('child_process')
const { startSpinner, stopSpinner }=  require('../util/spinner.js')
const {getValueFromJson} =  require('../util/getValueFromJson.js')

const build = version => {
  // 获取本地服务地址命令
  const command = 'minikube'
  const args = ['service', 'docs-service', '--url']
  const v = true ? 'latest' : `v${version}`

  console.log('🛠️ 开始构建 Docker 镜像')
  startSpinner()
  exec(
    `docker build --no-cache -t pengmmm/docs:${v} .`,
    (error, stdout, stderr) => {
      stopSpinner()
      if (error) {
        console.error(`❌ 构建 Docker 镜像出错: ${error.message}`)
        return
      }
      console.log('🛠️ Docker 镜像构建成功')
      console.log('🚢 开始推送 Docker 镜像')
      startSpinner()
      exec(`docker push pengmmm/docs:${v}`, (error, stdout, stderr) => {
        stopSpinner()
        if (error) {
          console.error(`❌ 推送 Docker 镜像出错: ${error.message}`)
          return
        }

        console.log('🚢 Docker 镜像推送成功')
        console.log('🚀 开始执行 k8s deployment')
        startSpinner()

        exec(
          'kubectl apply -f k8s/deployment.yaml',
          (error, stdout, stderr) => {
            stopSpinner()
            if (error) {
              console.error(`❌ 执行 deployment 出错: ${error.message}`)
              return
            }
            console.log('🚀 k8s deployment执行成功')
            console.log('🚀 开始执行 k8s service')
            startSpinner()
            exec(
              'kubectl apply -f k8s/service.yaml',
              (error, stdout, stderr) => {
                stopSpinner()
                if (error) {
                  console.error(`❌ 执行 service 出错: ${error.message}`)
                  return
                }
                console.log('🚀 k8s service 执行成功')
                startSpinner()
                const child = spawn(command, args)
                child.stdout.on('data', data => {
                  const result = data?.toString()
                  if (result?.includes('http')) {
                    stopSpinner()
                    console.log('✅ 部署完成！')
                    console.log(`🌐 Local: ${result}`)
                    process.exit(0)
                  }
                })

                child.stderr.on('data', data => {
                  console.error(`stderr: ${data}`)
                })
                // setTimeout(() => {
                //   console.log("执行结束");
                //     child.kill("SIGINT");
                // }, 5000);
              }
            )
          }
        )
      })
    }
  )
}

const start = async () => {
  const version = await getValueFromJson('package.json', 'version')
  console.log(`当前版本 v:${version}`)
  build(version)
}

// start()

const test = async () => {
  // const output = execSync('ls -l -a')
  // console.log(output.toString())
  // console.log('最后执行的结果')
  const child = spawn('ls',['-l','-a'])
  child.stdout.on('data', data => {
    console.log(`stdout: ${data}`)
  })
}

test()