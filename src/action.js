'use strict'

var debug = require('debug')('action')

var d3 = require('d3')

var action = {}
var dispatch = d3.dispatch('run')
d3.rebind(action, dispatch, 'on')

action.run = function (name, opts) {
  debug('action %s with %o', name, opts)
  dispatch.run({
    name: name,
    opts: opts
  })
}

module.exports = action
