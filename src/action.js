'use strict'

var debug = require('debug')('action')

var d3 = require('d3')

var action = {}
var dispatch = d3.dispatch('action')
d3.rebind(action, dispatch, 'on')

action.action = function (name, opts) {
  debug('action ' + name + ' with ' + opts)
  dispatch.action({
    name: name,
    opts: opts
  })
}

module.exports = action
