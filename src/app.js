'use strict'

var d3 = require('d3')
var breakPoint = 500
var $content, $sidebar, $trend, $map, $timeline

var store = require('./store')

var timeline = require('./timeline')()
var map = require('./map')()

function updateLayout () {
  var bodyWidth = parseInt(d3.select('body').style('width'), 10)
  if (bodyWidth >= breakPoint) {
    $content.classed('double', true)
  } else {
    $content.classed('double', false)
  }
  map.state({
    width: $map.style('width'),
    height: $map.style('height')
  })
}

function init () {
  $content = d3.select('.app.content')
  $sidebar = d3.select('.sidebar')
  $trend = d3.select('.trend')
  $map = d3.select('.map').call(map)
  $timeline = d3.select('.timeline').call(timeline)

  updateLayout()
  store.load()
}

function debounce (func) {
  var wait = 50
  var count
  return function () {
    if (count) { clearTimeout(count) }
    count = setTimeout(func, wait)
  }
}

d3.select(window).on('load', init)
d3.select(window).on('resize', debounce(updateLayout))
