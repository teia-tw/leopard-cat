'use strict'

require('debug').enable('*')
var debug = require('debug')('map')

var geoMap = require('./geoMap')()
var animalMap = require('./animalMap')()

var componentName = 'map'

module.exports = function (p) {
  var state = {
    width: 800,
    height: 600,
    projection: d3.geo.mercator().center([121.05, 24.50]).scale(40000),
    date: (new Date('2006-01-01')).getTime()
  }

  var svg, rect

  function mount(selection) {
    svg = selection.append('svg')
    rect = svg.append('rect')
    svg
      .call(geoMap)
      .call(animalMap)
    draw()
  }

  function draw () {
    svg
      .attr('width', state.width)
      .attr('height', state.height)
    rect
      .attr('class', 'background')
      .attr('width', state.width)
      .attr('height', state.height)
    animalMap.state(state)
    geoMap.state(state)
  }

  mount.state = function () {
    if (arguments.length === 0) { return state }
    state = Object.assign(state, arguments[0])
    debug(state)
    state.projection = d3.geo.mercator().center([121.28, 24.52]).scale(40000),
    draw()
    return mount
  }

  return mount
}
