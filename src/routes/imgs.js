const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const upload = async (ctx, next) => {
  const file = ctx.request.files.file; // 获取上传文件
  const hash = CryptoJS.MD5(file);    //  获取文件唯一的hash值d
  const reader = fs.createReadStream(file.path);  // 创建可读流
  let filePath = path.join(__dirname, '../../public/imgs') + `/${hash}.${file.name.split('.').pop()}`;  // 创建文件路径
  const upStream = fs.createWriteStream(filePath);  // 创建可写流
  reader.pipe(upStream);  // 可读流通过管道写入可写流
  return ctx.body = {
    status: 201,
    url: filePath,
  };
};

module.exports = {
  'POST /imgs/upload' : upload,
}