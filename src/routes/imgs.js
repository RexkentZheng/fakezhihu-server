const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const upload = async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  const hash = CryptoJS.MD5(file);    //  获取文件唯一的hash值d
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../../public/imgs') + `/${hash}.${file.name.split('.').pop()}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = {
    status: 201,
    url: filePath,
  };
};

module.exports = {
  'POST /imgs/upload' : upload,
}