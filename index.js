var Task = require('data.task')
var lambda = require('core.lambda')
var curry = lambda.curry

var retryTaskWithDelay = function (retries, delay, fn) {
  var getDelay = typeof delay === 'function'
    ? delay
    : function () { return delay }

  var doTry = function (attemptNo) {
    fn().orElse(function (e) {
      return (attemptNo < retries)
        ? setTimeout(() => doTry(attemptNo + 1), getDelay(attemptNo + 1))
        : Task.rejected(e)
    })

  return doTry(0)
}

var retryTask = function (retries, fn) {
  return retryTaskWithDelay(retries, 0, fn)
}

module.exports = {
  retry: curry(2, retryTask),
  retryWithDelay: curry(3, retryTaskWithDelay)
}
