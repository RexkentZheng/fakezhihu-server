const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body');
const logger = require('koa-logger')
const routes = require('./src/server/routes');

// error handler
onerror(app)

app.use(koaBody({
  multipart: true,
  strict  : false,    //如果为true，不解析GET,HEAD,DELETE请求
  formidable: {
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/src/views', {
  map : {html:'ejs'}
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(routes());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

console.log('==============================================================');
console.log(' Fakezhihu-server');
console.log('--------------------------------------------------------------');
console.log(' Start prot : 8081 ')
console.log(` Up time: ${new Date().toString()}`);
console.log('==============================================================');

module.exports = app
