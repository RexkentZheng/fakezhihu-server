const index = async (ctx, next) => {
  await ctx.render('index')
}

const error = async (ctx, next) => {
  await ctx.render('error')
}

module.exports = {
  'GET /' : index,
  'GET /error': error,
}
