'use strict'

require('debug').disable('*')

var d3 = require('d3')
var debounce = require('debounce')

var store = require('./store')
var action = require('./action')
var map = require('./map')
var timeline = require('./timeline')
// var tagsline = require('./tagsline')

var $map, $timeline

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

function init () {
  $map = d3.select('.map')
  $timeline = d3.select('.timeline')
  store.on('update', draw)
  d3.select(window).on('resize', debounce(handleWidth, 10))
  store.init()
}

function handleWidth () {
  action.run('setWidth', parseInt(d3.select('body').style('width'), 10))
}

function draw () {
  $timeline.call(timeline({
    width: (store.get('width') / 2) - 1,
    height: store.get('height'),
    focusedEvent: store.get('focusedEvent')
  }))
  $map.call(map({
    width: (store.get('width') / 2) - 1,
    date: store.get('focused') !== undefined ? store.get('focused').date : undefined
  }))
// $tagsline.call(tagsline({ width: 100, height: store.get('height') || 0 }))
}

d3.select(window).on('load', init)
