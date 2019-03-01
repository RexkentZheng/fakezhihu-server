const _ = require('lodash');

exports.setCookies = (ctx, info) => {
  if (!_.isObject(info)) {
    return false;
  }
  _.forIn(info, (value, key) => {
    ctx.cookies.set(key,  encodeURIComponent(value), {
      domain:'localhost', // 写cookie所在的域名
      path:'/',       // 写cookie所在的路径
      maxAge: 24*60*60*1000,   // cookie有效时长
      httpOnly:false,  // 是否只用于http请求中获取
      overwrite:false  // 是否允许重写
    });
  });
}

exports.destoryCookies = (ctx, info) => {
  if (!_.isObject(info)) {
    return false;
  }
  _.forIn(info, (value, key) => {
    ctx.cookies.set(key, value, {
      // domain:'localhost', // 写cookie所在的域名
      // path:'/',       // 写cookie所在的路径
      maxAge: -1,   // cookie有效时长
      // httpOnly:false,  // 是否只用于http请求中获取
      // overwrite:false  // 是否允许重写
    });
  });
}

exports.catchError = (ctx, err) => {
  console.log(err);         //  打印错误信息
  ctx.resError = err;       //  返回错位信息
}