'use strict'

// require('debug').enable('*')

var d3 = require('d3')
var $map, $timeline, $tagsline

var store = require('./store')

var map = require('./map')
var timeline = require('./timeline')
// var tagsline = require('./tagsline')

function init () {
  $map = d3.select('.map')
  $timeline = d3.select('.timeline')
  $tagsline = d3.select('.tagsline')
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
