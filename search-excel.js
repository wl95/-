// 引入 node-xlsx 模块
const xlsx = require('node-xlsx')
const fs = require('fs');
const path = require('path');

// excel文件类径
const excelFilePath = './excel/2024-10-14'
// 要生成的 html模板文件类径
const exampleFilePath = './example/search-topic.html'

function createJsonFile(filePath, fileName, exampleFilePath) {
  //解析excel, 获取到所有sheets
  let sheets = xlsx.parse(filePath);

  // 查看页面数
  // console.log(sheets.length);

  // 打印页面信息..
  let sheet = sheets[0];
  // console.log(sheet);

  // 打印页面数据
  // console.log(sheet.data);

  // 输出每行内容
  // sheet.data.forEach(row => {
  //   console.log(row);
  //     // 数组格式, 根据不同的索引取数据
  // })
  let excelJson = []
  let indexArr = []
  // ordinal 序号
  // subjects 科目
  // type 题目类型
  // title 题目
  // options 选项
  // answer 正确选项
  sheet.data.map((row, index) => {
    let excelJsonItem = { options: [] }
    if(index === 0){
      indexArr = [...row]
    } else {
      if(indexArr.indexOf('序号') > -1){
        excelJsonItem.ordinal = row[indexArr.indexOf('序号')]
      }
      if(indexArr.indexOf('科目') > -1){
        excelJsonItem.subjects = row[indexArr.indexOf('科目')]
      }
      if(indexArr.indexOf('题目类型') > -1){
        let typeDisp = {
          '单选': '1',
          '多选': '2',
          '填空题': '3',
          '简答题': '4'
        }
        excelJsonItem.questionType = typeDisp[row[indexArr.indexOf('题目类型')]]
        excelJsonItem.questionTypeDisp = row[indexArr.indexOf('题目类型')]
      }
      if(indexArr.indexOf('题目') > -1){
        excelJsonItem.title = row[indexArr.indexOf('题目')]
      }
      // if(indexArr.indexOf('选项A') > -1 || indexArr.indexOf('选项B') > -1  || indexArr.indexOf('选项C') > -1  || indexArr.indexOf('选项D') > -1  || indexArr.indexOf('选项E') > -1  || indexArr.indexOf('选项F') > -1 || indexArr.indexOf('选项G') > -1){
      if(indexArr.indexOf('选项A') > -1 && row[indexArr.indexOf('选项A')]){
        excelJsonItem.options.push(`A: ${row[indexArr.indexOf('选项A')]}`)
      }
      if(indexArr.indexOf('选项B') > -1 && row[indexArr.indexOf('选项B')]){
        excelJsonItem.options.push(`B: ${row[indexArr.indexOf('选项B')]}`)
      }
      if(indexArr.indexOf('选项C') > -1 && row[indexArr.indexOf('选项C')]){
        excelJsonItem.options.push(`C: ${row[indexArr.indexOf('选项C')]}`)
      }
      if(indexArr.indexOf('选项D') > -1 && row[indexArr.indexOf('选项D')]){
        excelJsonItem.options.push(`D: ${row[indexArr.indexOf('选项D')]}`)
      }
      if(indexArr.indexOf('选项E') > -1 && row[indexArr.indexOf('选项E')]){
        excelJsonItem.options.push(`E: ${row[indexArr.indexOf('选项E')]}`)
      }
      if(indexArr.indexOf('选项F') > -1 && row[indexArr.indexOf('选项F')]){
        excelJsonItem.options.push(`F: ${row[indexArr.indexOf('选项F')]}`)
      }
      if(indexArr.indexOf('选项G') > -1 && row[indexArr.indexOf('选项G')]){
        excelJsonItem.options.push(`G: ${row[indexArr.indexOf('选项G')]}`)
      }
      // }
      if(indexArr.indexOf('正确选项') > -1){
        excelJsonItem.answer = row[indexArr.indexOf('正确选项')].replace(/(^\s*)|(\s*$)/g, "")
      }
      excelJson.push(excelJsonItem)
    }
    // 数组格式, 根据不同的索引取数据
  })

  // function writeJsonFile () {
  //   fs.writeFile(`./json/${fileName || 'excel'}.json`, JSON.stringify(excelJson), 'utf8', function (err) {
  //     if (err) {
  //       console.log("An error occured while writing JSON Object to File.");
  //       return console.log(err);
  //     }
  //     console.log("JSON file has been saved.");
  //   });
  // }
  // 生成后的html文件夹名称
  let answer = 'answer'

  function writeJsonFile () {
    fs.readFile(exampleFilePath, 'utf-8', function (err, contents) {
      if (err) {
        console.log(err);
        return;
      }
      // 区分大小写
      const replaced = contents.replace(/let answerData = \[\]/gi, `let answerData = ${JSON.stringify(excelJson)}`);
      fs.writeFile(`./${answer}/${fileName || 'example'}.html`, replaced, 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing HTML Object to File.");
          return console.log(err);
        }
        console.log("JSON file has been saved.");
      });
    });
  }
  if (!fs.existsSync(answer)) {
    fs.mkdir(answer, (err) => {
      if(err) throw err; // 如果出现错误就抛出错误信息
      writeJsonFile()
    })
  } else {
    writeJsonFile()
  }
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay({
  excelFilePath,
  exampleFilePath
}) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(excelFilePath, function (err, files) {
    if (err) {
      console.warn(err, "读取文件夹错误！")
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(excelFilePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败');
          } else {
            var isFile = stats.isFile(); //是文件
            var isDir = stats.isDirectory(); //是文件夹
            if (isFile) {
              let name = path.parse(filename).name;
              createJsonFile(filedir, name, exampleFilePath)
            }
            if (isDir) {
              fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      });
    }
  });
}

fileDisplay({ 
  excelFilePath,
  exampleFilePath
})
