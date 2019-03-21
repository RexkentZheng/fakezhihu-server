const model = require('../models');
const { status:Status } = model;
const utils = require('../lib/utils');
const _ = require('lodash');

const updateStatus = async (ctx, next) => {
  const { statusId, colName, opreation, value } = ctx.request.body;
  try {
    const changedOne = await Status.findOne({
      where: {
        id: statusId
      }
    });
    if ((colName === 'voteUp' || colName === 'voteDown') && opreation === 'add') {
      if (colName === 'voteUp') {
        changedOne.voteUp = JSON.stringify([...JSON.parse(changedOne.voteUp), value]);
        changedOne.voteDown = JSON.stringify(_.pull(JSON.parse(changedOne.voteDown), value));
      } else {
        changedOne.voteUp = JSON.stringify(_.pull(JSON.parse(changedOne.voteUp), value));
        changedOne.voteDown = JSON.stringify([...JSON.parse(changedOne.voteDown), value]);
      }
    } else {
      changedOne[colName] = opreation === 'pull'
        ? JSON.stringify(_.pull(JSON.parse(changedOne[colName]), value))
        : JSON.stringify([...JSON.parse(changedOne[colName]), value]);
    }
    changedOne.save();
    ctx.response.body = {
      status: 201,
      content: changedOne,
    };
  } catch (error) {
    utils.catchError(error);
  }
};

module.exports = {
  'PUT /status': updateStatus,
};