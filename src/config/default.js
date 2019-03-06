const model = require('../models');
const sequelize = require('sequelize');

const config = {
  "db": {
    "database": "fakezhihu",
    "username": "origin",
    "password": "104.225.232.232-dzvpn-origin",
    "options": {
      "dialect": "mysql",
      "host": "104.225.232.232",
      "port": 3306,
      "operatorsAliases": false,
      "define": {
        "underscored": false,
        "freezeTableName": true,
        "charset": "utf8",
        "dialectOptions": {
          "collate": "utf8_general_ci"
        },
        "engine": "InnoDB"
      },
      "pool": {
        "min": 2,
        "max": 10,
        "idle": 300000
      }
    }
  },
  "server": {
    "port": 9929
  },
  "userAttributes": ['name', 'email', 'avatarUrl', 'headline'],
  "commentAttributes": ['creatorId', 'content', 'targetId', 'createdAt'],
  "articleAttributes": ['id', 'title', 'excerpt', 'content', 'cover', 'updatedAt', [sequelize.fn('COUNT', sequelize.col('comment.id')), 'commentCount']],
  "questionAttributes": ['id', 'title', 'excerpt', 'discription', 'updatedAt', 
    // [sequelize.fn("COUNT", sequelize.fn('DISTINCT', sequelize.col('answer.id'))), "answerCount"],
    // [sequelize.fn("COUNT", sequelize.fn('DISTINCT', sequelize.col('comment.id'))), "commentCount"],
  ],
  "questionNoAnswerAttributes": ['id', 'title', 'excerpt', 'discription', 'updatedAt'],
  "answerAttributes": ['id', 'content', 'excerpt', 'creatorId', 'type', 'targetId', 'updatedAt'
    // [sequelize.fn("COUNT", sequelize.col("comment.id")), "commentCount"],
  ],
  "articleInclude": [{
    model: model.users,
    attributes: this.userAttributes,
    as: 'author'
  }, {
    model: model.status,
    as: 'status',
    where: {
      targetType: 0,
    },
  }, {
    model: model.comments,
    attributes: this.commentAttributes,
    as: 'comment',
    required: false,
    include: [{
      model: model.users,
      attributes: this.userAttributes,
      as: 'author'
    }]
  }],
  "questionInclude": [{
    model: model.users,
    attributes: this.userAttributes,
    as: 'author'
  }, {
    model: model.comments,
    attributes: this.commentAttributes,
    as: 'comment',
    required: false,
    include: [{
      model: model.users,
      attributes: this.userAttributes,
      as: 'author'
    }]
  }],
};

module.exports = config;