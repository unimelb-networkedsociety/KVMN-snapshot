module.exports = function(app) {
  // Customized error handling, default error code: 500
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // Handle Validation Error
      if(err.name === 'ValidationError') {
        err.status = 422
      }
      // Handle Mongoose Item Duplication Error
      if (err.name === 'BulkWriteError' && err.code === 11000) {
        err.status = 422
      }
      ctx.status = err.status || 500
      ctx.body = { message: err.message }
    }
  })

  // Health check does not require authentication
  app.use(require('./api/health-check').routes())

  app.use(require('./api/auth').routes())
  app.use(require('./api/user').routes())
  // route middleware to verify a token
  app.use(require('./api/auth/service').isAuthenticated)
  app
    .use(require('./api/thing').routes())
    .use(require('./api/thing').allowedMethods())
}
