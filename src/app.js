'use strict'

require('debug').disable('*')

var d3 = require('d3')
var $map, $timeline

var store = require('./store')

var map = require('./map')
var timeline = require('./timeline')
// var tagsline = require('./tagsline')

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
  store.init()
}

function draw () {
  var width = parseInt(d3.select('body').style('width'), 10)
  $timeline.call(timeline({ width: ((width - 20) / 2) - 1, height: store.get('height') || 0, focusedEvent: store.get('focusedEvent') }))
  $map.call(map({ width: ((width - 20) / 2) - 1, date: store.get('focused') !== undefined ? store.get('focused').date : undefined }))
// $tagsline.call(tagsline({ width: 100, height: store.get('height') || 0 }))
}

store.on('update', draw)

function debounce (func) {
  var wait = 10
  var count
  return function () {
    if (count) { clearTimeout(count) }
    count = setTimeout(func, wait)
  }
}

d3.select(window).on('load', init)
d3.select(window).on('resize', debounce(draw))
