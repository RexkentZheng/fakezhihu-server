const model = require('../models');
const { test:Test } = model;

const catchError = (ctx, err) => {
  console.log(err);
  ctx.resError = err;
}

const test = async (ctx, next) => {
  try {
    const testList = await Test.findAll();
    ctx.response.status = 200;
    ctx.response.body = testList;
  } catch (error) {
    catchError(ctx, error);
  }
}

module.exports = {
  'GET /test' : test,
}