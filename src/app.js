'use strict'

var d3 = require('d3')
var breakPoint = 800
var $content, $sidebar, $trend, $map, $timeline

function resetLayout () {
  var bodyWidth = parseInt(d3.select('body').style('width'), 10)
  console.log(bodyWidth)
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
  draw()
}

function draw() {
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
