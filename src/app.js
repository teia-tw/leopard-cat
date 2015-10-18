'use strict'

require('debug').enable('leopard-cat:*')
var debug = require('debug')('leopard-cat:app')
var d3 = require('d3')
var timelineStore = require('./timelineStore')
var uiStore = require('./uiStore')
var dispatcher = require('./dispatcher')
// var map = require('./map')
var timeline = require('./timeline')
// var tagsline = require('./tagsline')

var debounce = require('debounce')

// Object.assign polyfill
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target) {
      'use strict'
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object')
      }

      var to = Object(target)
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i]
        if (nextSource === undefined || nextSource === null) {
          continue
        }
        nextSource = Object(nextSource)

        var keysArray = Object.keys(Object(nextSource))
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex]
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey)
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey]
          }
        }
      }
      return to
    }
  })
}

function load () {
  debug('load')
  d3.select('#app').call(draw)
  d3.select(window).on('resize', debounce(dispatcher.action.bind(null, { type: 'uiResize' }), 200))
  d3.select(window).on('scroll', debounce(dispatcher.action.bind(null, { type: 'uiScroll' }), 80))
  dispatcher.action({
    type: 'load'
  })
}

function draw (selection) {
  // var $map = d3.select('.map')
  var $timeline = d3.select('.timeline')
  // $timeline.call(timeline({
    // width: (store.get('width') / 2) - 1,
    // height: store.get('height'),
    // focusedEvent: store.get('focusedEvent')
  // }))
  // $map.call(map({
    // width: (store.get('width') / 2) - 1,
    // date: store.get('focused') !== undefined ? store.get('focused').date : undefined,
    // fixed: store.get('mapFixed')
  // }))
// $tagsline.call(tagsline({ width: 100, height: store.get('height') || 0 }))

  function update (selection) {
    debug('ready')
    $timeline.call(timeline({
      timeline: timelineStore,
      ui: uiStore
    }))
  }
  uiStore.on('ready.app', debounce(update.bind(null, selection), 80))
  timelineStore.on('ready.app', debounce(update.bind(null, selection), 80))
}

d3.select(window).on('load', load)
