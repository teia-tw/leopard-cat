'use strict'

require('debug').enable('*')

var d3 = require('d3')
var breakPoint = 500
var $content, $trend, $map, $timeline

var store = require('./store')
var action = require('./action')

var timeline = require('./timeline')
var map = require('./map')

function init () {
  $content = d3.select('.app.content')
  $trend = d3.select('.trend')
  $map = d3.select('.map').call(map())
  $timeline = d3.select('.timeline').call(timeline())

  store.init()
}

function debounce (func) {
  var wait = 20
  var count
  return function () {
    if (count) { clearTimeout(count) }
    count = setTimeout(func, wait)
  }
}

d3.select(window).on('load', init)
d3.select(window).on('resize', debounce(action.action.bind(action, 'resize')))
