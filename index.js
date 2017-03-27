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
function WebpackDevServerOutput(options) {
    params = options;
}
WebpackDevServerOutput.prototype.apply = function(compiler) {
  compiler.plugin("emit", function(compilation, callback) {
      let outputPath = params.path || path.join(path.resolve("."), 'output');
      if (params.isDel === true) {
          if (fs.existsSync(outputPath)) {
              rimraf.sync(outputPath);
          }
           mkdirp.sync(outputPath)
      } else {
          if (!fs.existsSync(outputPath)) {
              fs.mkdirSync(outputPath);
          }
      }
      for (let filename in compilation.assets) {
          let fileArr = filename.split(path.sep);
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

