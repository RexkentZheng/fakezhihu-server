const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const crypto = require('crypto');

const upload = async (ctx, next) => {
  const file = ctx.request.files.file; // 获取上传文件
  const hash = CryptoJS.MD5(`${file.path}_${moment()}`);    //  获取文件唯一的hash值d
  const reader = fs.createReadStream(file.path);  // 创建可读流
  let filePath = path.join(__dirname, '../../public/images') + `/1123.${file.name.split('.').pop()}`;  // 创建文件路径
  const md5Hash = crypto.createHash('md5');
  let md5 = '';
  reader.on('data', function(d) {
    md5Hash.update(d);
  });

  reader.on('end', function() {
      md5 = md5Hash.digest('hex');
      filePath = path.join(__dirname, '../../public/images') + `/${md5}.${file.name.split('.').pop()}`;  // 创建文件路径
  });
  const upStream = fs.createWriteStream(filePath);  // 创建可写流
  reader.pipe(upStream);  // 可读流通过管道写入可写流
  ctx.body = {
    status: 201,
    url: filePath,
    md5,
    fileName: `${md5}.${file.name.split('.').pop()}`,
  };
};

module.exports = {
  'POST /imgs/upload' : upload,
}