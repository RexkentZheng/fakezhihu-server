const model = require('../models');
const { questions:Question, answers:Answer, comments:Comment } = model;
const utils = require('../lib/utils');
const {
  userAttributes,
  questionAttributes,
  answerAttributes,
  commentAttributes,
} = require('../config/default')

const creatorQuestions = async (ctx, next) => {
  const { creatorId } = ctx.query;
  const where = {
    creatorId
  };
  const include = [{
    model: model.users,
    as: 'author',
    attributes: userAttributes,
  }, {
    model: model.comments,
    as: 'comment',
    attributes: commentAttributes,
    required: false,
    where: {
      targetType: 1,
    },
  }, {
    model: model.answers,
    attributes: answerAttributes,
    required: false,
    as: 'answer',
  }];
  try {
    await Question.findAll({
      where,
      include,
      attributes: questionAttributes,
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

const createQuestions = async (ctx, next) => {
  const { discription, excerpt, title, userId } = ctx.request.body;
  try {
    await Question.create({
      discription,
      excerpt,
      title,
      creatorId: userId,
      type: 1
    }).then((res) => {
      ctx.response.body = {
        status: 201,
        msg: '创建成功'
      }
    });
  } catch (error) {
    console.log(error);
    utils.catchError(error);
  }
}

const getQuestion = async (ctx, next) => {        //  分开查询，易修改，看上去更清晰
  const { questionId } = ctx.query;
  const questionWhere = {
    id: questionId
  };
  const answerWhere = {
    targetId: questionId
  };
  const commentWhere = {
    targetId: questionId,
    targetType: 1,
  };
  const commentInclude = [{
    model: model.users,
    as: 'author',
    attributes: userAttributes,
  }];
  const answerInclude = [{
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
    as: 'comment',
    attributes: commentAttributes,
    where: {
      targetType: 2,
    },
    required: false,      //  可以为空值，否则会互相过滤导致没有值返回
  }];
  const include = [                    //  也可以这么查，不过代码不太好修改而已
    {
    model: model.users,
    attributes: userAttributes,
    as: 'author'
  }, {
    model: model.comments,
    attributes: commentAttributes,
    required: false,
    as: 'comment',
    where: {
      targetType: 1,
    },
  }, {
    model: model.answers,
    as: 'answer',
    required: false,
    attributes: answerAttributes,
    include: [
      {
      model: model.status,
      as: 'status',
      where: {
        targetType: 2,
      },
    },{ 
      model: model.users,
      as: 'author',
      attributes: userAttributes,
    }, {
      model: model.comments,
      attributes: commentAttributes,
      as: 'comment',
      required: false,
      where: {
        targetType: 2,
      },
    }]
  }];
  try {
    const questionContent = await Question.findOne({
      where: questionWhere,
      include: include,
      attributes: questionAttributes,
    });
    const answerList = await Answer.findAndCountAll({
      where: answerWhere,
      include: answerInclude,
      attributes: answerAttributes,
    });
    const commentList = await Comment.findAndCountAll({
      where: commentWhere,
      include: commentInclude,
      attributes: commentAttributes
    })
    // const finalData = questionContent;
    // finalData.dataValues.answer = answerList.rows;
    // finalData.dataValues.comment = commentList.rows; 
    ctx.response.body = {
      status: 200,
      content: questionContent,
    }
  } catch (error) {
    utils.catchError(error);
    ctx.resError = error;
  }
}

const updateQuestions = async (ctx, next) => {
  const { questionId, discription, excerpt, title, userId } = ctx.request.body;
  const where = {
    id: questionId,
    creatorId: userId
  };
  try {
    const questionExist = await Question.findOne({where});
    if (!questionExist) {
      ctx.response.body = {
        status: 2001,
        msg: '问题不存在或者没有权限'
      };
    } else {
      await Question.update({
        discription,
        excerpt,
        title,
      }, {
        where
      }).then((res) => {
        ctx.response.body = {
          status: 202,
          msg: '问题修改成功'
        };
      });
    }
  } catch (error) {
    utils.catchError(error);
    ctx.resError = error;
  }
}

module.exports = {
  'GET /questions/creator': creatorQuestions,
  'GET /questions': getQuestion,
  'POST /questions': createQuestions,
  'PUT /questions': updateQuestions
}