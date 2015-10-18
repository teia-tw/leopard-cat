'use strict'

var debug = require('debug')('leopard-cat:dispatcher')
var d3 = require('d3')

var dispatcher = {}
var dispatch = d3.dispatch('action')
d3.rebind(dispatcher, dispatch, 'on')

dispatcher.action = function (action) {
  debug(action)
  dispatch.action(action)
}

module.exports = dispatcher
