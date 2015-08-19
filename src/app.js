'use strict'

require('debug').enable('*')

var d3 = require('d3')
var $map, $timeline

var store = require('./store')

var timeline = require('./timeline')
var map = require('./map')

function init () {
  $map = d3.select('.map')
  $timeline = d3.select('.timeline')
  store.init()
}

function draw () {
  var width = parseInt(d3.select('body').style('width'), 10)
  $timeline.call(timeline({ width: width / 2, focused: store.get('focused') !== undefined ? store.get('focused').value : 0 }))
  $map.call(map({ width: width / 2, date: store.get('focused') !== undefined ? store.get('focused').date : undefined }))
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
