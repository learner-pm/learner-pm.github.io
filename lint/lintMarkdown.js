const markdownlint = require('markdownlint');
const fs = require('fs');
const path = require('path');

// 指定要检查的目录
const directory = 'docs';

// 获取目录下的所有 Markdown 文件
const markdownFiles = fs.readdirSync(directory)
    .filter(file => path.extname(file) === '.md')
    .map(file => path.join(directory, file));
console.log(markdownFiles)
// markdownlint 的配置选项
const options = {
    files: markdownFiles,
    config: {
        // 这里可以配置 markdownlint 的规则
        // 例如，你可以在这里定义 markdownlint 的配置规则，或者直接引用一个外部配置文件
    }
};

// 运行 markdownlint 进行检查
markdownlint(options, function (err, result) {
    console.log(err)
    console.log(result)
    return
    if (err) {
        console.error('markdownlint error:', err);
        process.exit(1); // 如果发生错误，退出进程并返回非零状态码
    } else {
        Object.keys(result).forEach(filePath => {
            const fileResult = result[filePath];
            fileResult.warnings.forEach(warning => {
                console.log(`[${filePath}:${warning.lineNumber}] ${warning.ruleNames.join(', ')}: ${warning.ruleDescription}`);
            });
        });

        const hasErrors = Object.keys(result).some(filePath => result[filePath].warnings.length > 0);
        if (hasErrors) {
            console.log('Markdown 文件检测发现问题，请检查并修复。');
            process.exit(1); // 如果有错误，退出进程并返回非零状态码
        } else {
            console.log('Markdown 文件检测通过，没有发现问题。');
            process.exit(0); // 如果没有错误，退出进程并返回零状态码
        }
    }
});
