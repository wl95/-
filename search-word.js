// 引入 node-xlsx 模块
const mammoth = require('mammoth')
const fs = require('fs');
const path = require('path');

// excel文件类径
const excelFilePath = './word'
// 要生成的 html模板文件类径
const exampleFilePath = './example/14269数字影像设计与制作复习资料.html'
// 生成后的html文件夹名称
let answer = 'answer'

function writeJsonFile ({
  wordJson,
  fileName
}) {
  // fs.readFile(exampleFilePath, 'utf-8', function (err) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
    fs.writeFile(`./${answer}/${fileName || 'example'}.html`, wordJson, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing HTML Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    });
  // });
}

function transformElement(element) {
  if (element.children) {
      var children = element.children.map(transformElement);
      // console.log(children, 'children')
      element = {...element, children: children};
  }
  if (element.type === "paragraph") {
      element = transformParagraph(element);
  }

  return element;
}

function transformParagraph(element) {
  if (element.alignment === "center" && !element.styleId) {
      return {...element, styleId: "Heading2"};
  } else {
      return element;
  }
}

function createJsonFile(filePath, fileName, exampleFilePath) {
  
  //解析excel, 获取到所有sheets
  var options = {
    styleMap: [
        "p[style-name='Section Title'] => h1:fresh",
        "p[style-name='Subsection Title'] => h2:fresh",
        "u => em",
        "i => strong",
        "strike => del"
    ],
    highlight: true,
    isBold: true,
    isUnderline: true,
    isItalic: true,
    isStrikethrough: true,
    isAllCaps: true,
    isSmallCaps: true,
    transformDocument: transformElement
};
  mammoth.convertToHtml({path: filePath }, options).then((result) => {
    const text = result.value;
    // console.log(text);
    writeJsonFile({ wordJson: text, fileName })
  }).catch(function(err) {
    console.error(err);
  });
  // ordinal 序号
  // subjects 科目
  // type 题目类型
  // title 题目
  // options 选项
  // answer 正确选项
  // sheet.data.map((row, index) => {
  //   let excelJsonItem = {}
  //   if(index === 0){
  //     indexArr = [...row]
  //   } else {
  //     if(indexArr.indexOf('序号') > -1){
  //       excelJsonItem.ordinal = row[indexArr.indexOf('序号')]
  //     }
  //     if(indexArr.indexOf('科目') > -1){
  //       excelJsonItem.subjects = row[indexArr.indexOf('科目')]
  //     }
  //     if(indexArr.indexOf('题目类型') > -1){
  //       excelJsonItem.type = row[indexArr.indexOf('题目类型')]
  //     }
  //     if(indexArr.indexOf('题目') > -1){
  //       excelJsonItem.title = row[indexArr.indexOf('题目')]
  //     }
  //     if(indexArr.indexOf('选项A') > -1 || indexArr.indexOf('选项B') > -1  || indexArr.indexOf('选项C') > -1  || indexArr.indexOf('选项D') > -1 ){
  //       excelJsonItem.options = [
  //         `A: ${row[indexArr.indexOf('选项A')]}`,
  //         `B: ${row[indexArr.indexOf('选项B')]}`,
  //         `C: ${row[indexArr.indexOf('选项C')]}`,
  //         `D: ${row[indexArr.indexOf('选项D')]}`,
  //       ]
  //     }
  //     if(indexArr.indexOf('正确选项') > -1){
  //       excelJsonItem.answer = row[indexArr.indexOf('正确选项')]
  //     }
  //     excelJson.push(excelJsonItem)
  //   }
  //   // 数组格式, 根据不同的索引取数据
  // })

  // function writeJsonFile () {
  //   fs.writeFile(`./json/${fileName || 'excel'}.json`, JSON.stringify(excelJson), 'utf8', function (err) {
  //     if (err) {
  //       console.log("An error occured while writing JSON Object to File.");
  //       return console.log(err);
  //     }
  //     console.log("JSON file has been saved.");
  //   });
  // }

  // function writeJsonFile () {
  //   fs.readFile(exampleFilePath, 'utf-8', function (err, contents) {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     // 区分大小写
  //     const replaced = contents.replace(/let answerData = \[\]/gi, `let answerData = ${JSON.stringify(excelJson)}`);
  //     fs.writeFile(`./${answer}/${fileName || 'example'}.html`, replaced, 'utf8', function (err) {
  //       if (err) {
  //         console.log("An error occured while writing HTML Object to File.");
  //         return console.log(err);
  //       }
  //       console.log("JSON file has been saved.");
  //     });
  //   });
  // }
  // if (!fs.existsSync(answer)) {
  //   fs.mkdir(answer, (err) => {
  //     if(err) throw err; // 如果出现错误就抛出错误信息
  //     writeJsonFile()
  //   })
  // } else {
  //   writeJsonFile()
  // }
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
