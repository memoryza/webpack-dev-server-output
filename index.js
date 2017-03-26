/**
 * @file 将webpack-dev-server产出到内存的文件产出到指定目录
 * @desc 为什么不用webpack --watch 因为他每次启动停止对内存的占用都不释放
 * @author   Memoryza(jincai.wang@foxmail.com)
 * @dateTime 2017-03-26T10:41:53+0800
 */
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
let outputPath;
//创建多层文件夹 同步
function mkdirsSync(root, dirpath) {
    if (!fs.existsSync(path.join(root, dirpath))) {
        var pathtmp = root;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (dirname === '.' || dirname === '' || dirname === '..') {
                return false;
            }
            pathtmp = path.join(pathtmp, dirname);
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}
function WebpackDevServerOutput(options) {
    outputPath = options.path;
}
WebpackDevServerOutput.prototype.apply = function(compiler) {
  compiler.plugin("emit", function(compilation, callback) {
      outputPath = outputPath || compiler.output.path;
      if (fs.existsSync(outputPath)) {
          rimraf.sync(outputPath);
      }
      fs.mkdirSync(outputPath);
      for (let filename in compilation.assets) {
          let fileArr = filename.split(path.sep);
          // 递归创建目录
          if (fileArr.length > 1) {
              let privatePath = fileArr.slice(0, fileArr.length - 1).join(path.sep);
              mkdirsSync(outputPath, privatePath);
          }
          fs.writeFileSync(path.join(outputPath, filename), compilation.assets[filename].source());
      }
      callback();
  });
};
module.exports = WebpackDevServerOutput;
