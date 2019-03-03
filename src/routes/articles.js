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

const creatArticles = async (ctx, next) => {
  const { content, excerpt, title, imgUrl, userId } = ctx.request.body;
  try {
    await Article.create({
      content,
      excerpt,
      title,
      cover: imgUrl,
      creatorId: userId,
      type: 0
    }).then((res) => {
      return Status.create({
        voteUp: '[]',
        voteDown: '[]',
        favorite: '[]',
        thanks: '[]',
        targetId: res.dataValues.id
      }).then((res) => {
        ctx.response.status = 201;
        ctx.response.body = {
          msg: '创建成功'
        }
      })
    });
  } catch (error) {
    utils.catchError(error);
  }
}

const deleteArticles = async (ctx, next) => {
  const { articleId, userId } = ctx.request.body;
  const where = {
    id: articleId,
    creatorId: userId
  };
  try {
    const articleExist = await Article.findOne({where});
    if (articleExist) {
      await Article.destroy({
        where
      }).then((res) => {
        ctx.response.body = {
          status: 202,
          msg: '删除成功',
        };
      });
    } else {
      ctx.response.body = {
        status: 2001,
        msg: '文章不存在或者没有权限',
      }
    }
  } catch (error) {
    utils.catchError(error);
  }
}

const getArticle = async (ctx, next) => {
  const { articleId } = ctx.query;
  const where = {
    id: articleId
  };
  const attributes = ['title', 'content', 'cover'];
  try {
    await Article.findOne({
      where, attributes
    }).then((res) => {
      ctx.response.body = {
        status: 200,
        content: res,
      }
    })
  } catch (error) {
    utils.catchError(error);
    ctx.resError = error;
  }
}

const updateArticles = async (ctx, next) => {
  const { articleId, content, excerpt, title, imgUrl, userId } = ctx.request.body;
  const where = {
    id: articleId,
    creatorId: userId
  };
  try {
    const articleExist = await Article.findOne({where});
    if (!articleExist) {
      ctx.response.body = {
        status: 2001,
        msg: '文章不存在或者没有权限'
      };
    } else {
      await Article.update({
        content,
        excerpt,
        title,
        imgUrl
      }, {
        where
      }).then((res) => {
        ctx.response.body = {
          status: 201,
          msg: '文章修改成功'
        };
      });
    }
  } catch (error) {
    utils.catchError(error);
    ctx.resError = error;
  }
}

module.exports = {
  'GET /articles/creator': creatorArticles,
  'GET /articles': getArticle,
  'POST /articles': creatArticles,
  'DELETE /articles': deleteArticles,
  'PUT /articles': updateArticles
}