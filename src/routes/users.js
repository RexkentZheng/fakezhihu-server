const model = require('../models');
const { users:User } = model;
const _ = require('lodash');
const utils = require('../lib/utils');

const catchError = (ctx, err) => {
  console.log(err);
  ctx.resError = err;
}

const list = async (ctx, next) => {
  try {
    const list = await User.findAll();
    ctx.response.status = 200;
    ctx.response.body = list;
  } catch (error) {
    utils.catchError(error);
  }
}

const createUser = async (ctx, next) => {
  const { name, pwd, email, } = ctx.request.body;
  try {
    // 邮箱验证和用户名验证
    const infoList = await User.findAll({
      attributes: ['name','email'],
    });
    // 用户名验证
    const nameList = _.map(infoList, item => item.dataValues.name);
    if (_.includes(nameList, name)) {
      ctx.response.status = 203;
      ctx.response.body = {
        msg: '用户名重复，请更换用户名'
      };
      return ;
    }
    // 邮箱验证
    const uniquedEmailList = _.uniq(_.map(infoList, item => item.dataValues.email));
    if (_.includes(uniquedEmailList, email)) {
      ctx.response.status = 203;
      ctx.response.body = {
        msg: '邮箱已存在，请更换邮箱或者直接登录'
      };
      return ;
    }
    await User.create({
      name, pwd, email
    }).then((res) => {
      ctx.response.status = 201;
      ctx.response.body = res;
    })
  } catch (error) {
    catchError(ctx, error);
  }
}

let loginUser = async (ctx, next) => {
  const { name, pwd } = ctx.request.body;
  const where = {
    name,
    pwd,
  };
  const attributes = ['name', 'id', 'email'];
  try {
    await User.findOne({
      where, attributes
    }).then((res) => {
      if (res === null) {
        ctx.response.status = 206;
        ctx.response.body = {
          msg: '用户名或者密码不对，请修改后重新登录',
        };
        return ;
      } else {
        utils.setCookies(ctx, res.dataValues);
        ctx.response.status = 200;
        ctx.response.body = res;  
      }
    })
  }
  catch (error) {
    catchError(ctx, error);
  }
}

const checkLogin = async (ctx, next) => {
  try {
    if(ctx.cookies.get('id')) {
      ctx.response.status = 200;
      ctx.response.body = {
        name: decodeURIComponent(ctx.cookies.get('name')),
      };
    } else {
      ctx.response.status = 202;
    }
  }
  catch (error) {
    catchError(ctx, error);
  }
}

const logout = async (ctx, next) => {
  const cookies = {
    id: ctx.cookies.get('id'),
    name: ctx.cookies.get('name'),
  }
  try {
    utils.destoryCookies(ctx, cookies);
    ctx.response.status = 200;
  }
  catch (error) {
    catchError(ctx, error);
  }
}

module.exports = {
  'GET /users/list' : list,
  'GET /users/checkLogin': checkLogin,
  'POST /users/create': createUser,
  'POST /users/login': loginUser,
  'POST /users/logout': logout
}