/**
 * @file 将webpack-dev-server产出到内存的文件产出到指定目录
 * @desc 为什么不用webpack --watch 因为他每次启动停止对内存的占用都不释放
 * @author   Memoryza(jincai.wang@foxmail.com)
 * @dateTime 2017-03-26T10:41:53+0800
 */
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
let params = {};
let sourceMap = {}; // 存放编译过的文件，以便于部分删除（why?webpack 每次只对更新相关的文件产出，如果暴力删除文件夹，没有变更的文件则被删除了)
let isFirstBuild = true; // 是否是第一次编译
function getFilename(name) {
    let nameArr = name.split(path.sep);
    if (nameArr.length === 1) {
        nameArr = name.split('/');
    }
    let nameTail = name.split('.');
    let prefix = nameTail[nameTail.length - 1];
    let filename = '';
    if (nameArr.length > 1) {
        filename = prefix + '_' + nameArr[nameArr.length - 1].split('.')[0];
    } else {
        filename = prefix + '_' + nameArr[0].split('.')[0];
    }
    return filename;
}
function WebpackDevServerOutput(options) {
    params = options;
}
WebpackDevServerOutput.prototype.apply = function(compiler) {
  compiler.plugin("emit", function(compilation, callback) {
      let outputPath = params.path || path.join(path.resolve("."), 'output');
      if (params.isDel === true) {
          if (fs.existsSync(outputPath)) {
              // 删除历史文件
              if (isFirstBuild) {
                  isFirstBuild = false;
                  rimraf.sync(outputPath);
              } else {
                  for (let filename in compilation.assets) {
                      let cacheFile = sourceMap[getFilename(filename)];
                      if (cacheFile) {
                          cacheFile = cacheFile.replace('/', path.sep);
                          let delFile = path.join(outputPath, cacheFile);
                          fs.unlink(delFile);
                      }
                  }
              }
          }
           mkdirp.sync(outputPath)
      } else {
          if (!fs.existsSync(outputPath)) {
              fs.mkdirSync(outputPath);
          }
      }
      for (let filename in compilation.assets) {
          // 如果要清理历史文件，则分析
          if (params.isDel) {
              sourceMap[getFilename(filename)] = filename;
          }
          let fileArr = filename.split(path.sep);
          //windows sep \\ but webpack can set /
          if (fileArr.length === 1) {
              fileArr = filename.split('/');
          }
          if (fileArr.length > 1) {
              let privatePath = fileArr.slice(0, fileArr.length - 1).join(path.sep);
              mkdirp.sync(path.join(outputPath, privatePath));
          }
          fs.writeFileSync(path.join(outputPath, filename), compilation.assets[filename].source());
      }
      callback();
  });
};
module.exports = WebpackDevServerOutput;
