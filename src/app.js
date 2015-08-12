'use strict'

var d3 = require('d3')
var breakPoint = 800
var $content, $sidebar, $trend, $map, $timeline

var animalStore = require('./animalStore')

var timeline = require('./timeline')
var map = require('./map')

function resetLayout () {
  var bodyWidth = parseInt(d3.select('body').style('width'), 10)
  if (bodyWidth >= breakPoint) {
    $content.classed('double', true)
  } else {
    $content.classed('double', false)
  }
}

function initialize () {
  $content = d3.select('.app.content')
  $sidebar = d3.select('.sidebar')
  $trend = d3.select('.trend')
  $map = d3.select('.map')
  $timeline = d3.select('.timeline')

  resetLayout()
}

function debounce (func) {
  var wait = 200
  var count
  return function () {
    if (count) { clearTimeout(count) }
    count = setTimeout(func, wait)
  }
}

d3.select(window).on('load', initialize)
d3.select(window).on('resize', debounce(resetLayout))
