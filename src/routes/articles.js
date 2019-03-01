const model = require('../models');
const { articles:Article, users:User, status:Status } = model;
const _ = require('lodash');
const utils = require('../lib/utils');

const creatorArticles = async (ctx, next) => {
  const { creatorId } = ctx.query;
  const where = {
    creatorId
  };
  //  此处连表查询有着比较复杂的问题，belongsTo和hasOne的区别就是一个会添加
  const include = [{
    model: model.users,
    as: 'author'
  }, {
    model: Status,
    as: 'status'
  }, {
    model: model.comments,
    as: 'comment',
    include: [{
      model: model.users,
      as: 'author'
    }]
  }];

  try {
    const list = await Article.findAll({where, include});
    ctx.response.status = 200;
    ctx.response.body = list;
  } catch (error) {
    utils.catchError(error);
  }
}



module.exports = {
  'GET /articles/creator': creatorArticles,
}