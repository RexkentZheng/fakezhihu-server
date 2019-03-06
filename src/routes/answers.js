const model = require('../models');
const { answers:Answer, status:Status } = model;
const { userAttributes, questionAttributes, answerAttributes, commentAttributes } = require('../config/default')
const _ = require('lodash');

const createAnswer = async (ctx, next) => {
  const { creatorId, targetId, content, excerpt } = ctx.request.body;
  await Answer.create({
    creatorId,
    targetId,
    content,
    excerpt,
    type: 2,
  }).then((res) => {
    return Status.create({
      voteUp: '[]',
      voteDown: '[]',
      favorite: '[]',
      thanks: '[]',
      targetId: res.dataValues.id,
      targetType: 2,
    }).then((res) => {
      ctx.response.body = {
        status: 201,
        msg: '创建成功'
      }
    })
  });
}

const creatorAnswer = async (ctx, next) => {
  const { creatorId } = ctx.query;
  const where = {
    creatorId,
  };
  const include = [{
    model: model.comments,
    as: 'comment',
    attributes: commentAttributes,
    required: false,
    where: {
      targetType: 2,
    },
  }, {
    model: model.status,
    as: 'status',
    where: {
      targetType: 2,
    },
  }, {
    model: model.questions,
    as: 'question',
  }, {
    model: model.users,
    as: 'author',
    attributes: userAttributes,
  }];
  await Answer.findAll({
    where, include, attributes: answerAttributes,
  }).then((res) => {
    ctx.response.body = {
      status: 200,
      list: res,
    };
  });
}

const deleteAnswers = async (ctx, next) => {
  const { answerId, userId } = ctx.request.body;
  const where = {
    id: answerId,
    creatorId: userId
  };
  try {
    const answerExist = await Answer.findOne({where});
    if (answerExist) {
      await Answer.destroy({
        where
      }).then((res) => {
        return Status.destroy({
          where: {
            targetId: answerId,
            targetType: 2,
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
        msg: '答案不存在或者没有权限',
      }
    }
  } catch (error) {
    utils.catchError(error);
  }
}

const updateAnswer = async (ctx, next) => {
  const { creatorId, answerId, content, excerpt } = ctx.request.body;
  const where = {
    creatorId,
    id: answerId,
  }
  const answerExist = await Answer.findOne({ where });
  if (!answerExist) {
    ctx.response.body = {
      status: 2001,
      msg: '答案不存在或者没有权限'
    };
  } else {
    await Answer.update({
      content,
      excerpt,
    }, {
      where
    }).then((res) => {
      ctx.response.body = {
        status: 201,
        msg: '答案修改成功'
      };
    });
  }
}

module.exports = {
  'POST /answers': createAnswer,
  'GET /answers/creator': creatorAnswer,
  'DELETE /answers': deleteAnswers,
  'PUT /answers': updateAnswer,
}