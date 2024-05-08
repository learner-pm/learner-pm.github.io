const  fs =  require('fs')

const getValueFromJson = (filePath, fieldName) => {
  return new Promise((resolve, reject) => {
    // 读取 JSON 文件
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('读取文件时出错:' + err)
        return
      }

      try {
        // 将 JSON 数据解析为对象
        const jsonData = JSON.parse(data)

        // 提取指定字段的值
        const value = jsonData[fieldName]

        if (value !== undefined) {
          resolve(value)
        } else {
          reject(`字段 '${fieldName}' 不存在`)
        }
      } catch (parseError) {
        reject('解析 JSON 时出错:' + parseError)
      }
    })
  })
}

module.exports= {
  getValueFromJson
}
