'use strict'

require('debug').enable('*')

var d3 = require('d3')
var breakPoint = 500
var $content, $trend, $map, $timeline

var store = require('./store')

var timeline = require('./timeline')
var map = require('./map')

function init () {
  var width = parseInt(d3.select('body').style('width'), 10)

  $content = d3.select('.app.content')
  $trend = d3.select('.trend')
  $map = d3.select('.map').call(map({ width: width / 2 }))
  $timeline = d3.select('.timeline').call(timeline({ width: width / 2 }))

  store.init()
}

store.on('focusedUpdate', function () {
  var width = parseInt(d3.select('body').style('width'), 10)
  $timeline.call(timeline({ width: width / 2, focused: store.data.focused }))
})

function debounce (func) {
  var wait = 10
  var count
  return function () {
    if (count) { clearTimeout(count) }
    count = setTimeout(func, wait)
  }
}

function resize () {
  var width = parseInt(d3.select('body').style('width'), 10)
  $map.call(map({ width: width / 2 }))
  $timeline.call(timeline({ width: width / 2 }))
}

d3.select(window).on('load', init)
d3.select(window).on('resize', debounce(resize))
