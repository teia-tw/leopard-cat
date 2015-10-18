
var debug = require('debug')('leopard-cat:uiStore')
var dispatcher = require('./dispatcher')
var d3 = require('d3')
var dispatch = d3.dispatch('loading', 'ready')
var uiStore = {
  width: 0,
  height: 0
}
d3.rebind(uiStore, dispatch, 'on')
module.exports = uiStore

dispatcher.on('action', function (action) {
  debug(action)
  if (action.type === 'load') {
    dispatch.loading(action)
    uiStore.width = parseInt(d3.select('body').style('width'), 10)
    uiStore.height = parseInt(d3.select('body').style('height'), 10)
    dispatch.ready(action)
  } else if (action.type === 'uiResize') {
    uiStore.width = parseInt(d3.select('body').style('width'), 10)
    dispatch.ready(action)
  } else if (action.type === 'uiScroll') {
    uiStore.scrollTop = d3.select('html')[0][0].scrollTop
    dispatch.ready(action)
  }
})
