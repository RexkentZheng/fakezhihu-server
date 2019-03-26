const model = require('../models');
const { articles:Article, status:Status, answers:Answer } = model;
const _ = require('lodash');
const utils = require('../lib/utils');
const {
  userAttributes,
  articleAttributes,
  commentAttributes,
  answerAttributes,
  questionAttributes,
} = require('../config/default')

const articleInclude = [{
  model: model.users,
  attributes: userAttributes,
  as: 'author'
}, {
  model: model.status,
  as: 'status',
  where: {
    targetType: 0,
  },
}, {
  model: model.comments,
  attributes: commentAttributes,
  as: 'comment',
  required: false,
  where: {
    targetType: 0,
  },
}];

const answerInclude = [{
  model: model.users,
  attributes: userAttributes,
  as: 'author'
}, {
  model: model.questions,
  attributes: questionAttributes,
  as: 'question'
}, {
  model: model.status,
  as: 'status',
  where: {
    targetType: 2,
  },
}, {
  model: model.comments,
  attributes: commentAttributes,
  as: 'comment',
  required: false,
  where: {
    targetType: 2,
  },
}]

const creatorArticles = async (ctx, next) => {
  const { creatorId } = ctx.query;
  const where = {
    creatorId
  };
  try {
    await Article.findAll({
      where,
      include: articleInclude,
      attributes: articleAttributes,
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((res) => {
      ctx.response.body = {
        status: 200,
        list: res,
      };
    });
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
        targetId: res.dataValues.id,
        targetType: 0,
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
        return Status.destroy({
          where: {
            targetId: articleId,
            targetType: 0,
          }
        }).then((response) => {
          ctx.response.body = {
            status: 202,
            msg: '删除成功',
          };
        });
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
  try {
    await Article.findOne({
      where,
      include: articleInclude,
      attributes: articleAttributes
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

const getArticleList = async (ctx, next) => {
  try {
    const order = [
      ['id', 'DESC'],
    ];
    const limit = 10;
    const articleList = await Article.findAll({
      order,
      limit,
      include: articleInclude,
      attributes: articleAttributes,
    });
    const answerList = await Answer.findAll({
      order,
      limit,
      include: answerInclude,
      attributes: answerAttributes,
    })
    ctx.response.body = {
      status: 200,
      list: _.shuffle(articleList.concat(answerList)),
    }
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const updateArticles = async (ctx, next) => {
  const { 
    articleId,
    content,
    excerpt,
    title,
    imgUrl,
    userId
  } = ctx.request.body;
  const where = {
    id: articleId,
    creatorId: userId
  };
  try {
    await Article.update({
      content,
      excerpt,
      title,
      cover: imgUrl,
    }, {
      where
    }).then((res) => {
      ctx.response.body = {
        status: 201,
        msg: res,
      };
    });
  } catch (error) {
    utils.catchError(error);
    ctx.resError = error;
  }
}

module.exports = {
  'GET /articles/creator': creatorArticles,
  'GET /articles': getArticle,
  'GET /articles/list': getArticleList,
  'POST /articles': creatArticles,
  'DELETE /articles': deleteArticles,
  'PUT /articles': updateArticles
}