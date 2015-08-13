'use strict'

var debug = require('debug')('map')

var store = require('./store')

var geoMap = require('./geoMap')()
var animalMap = require('./animalMap')()

var componentName = 'map'

module.exports = function (p) {

  var props = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }, p || {})

  var state = {
    width: 0,
    height: 0,
    projection: undefined,
    date: (new Date('2006-01-01')).getTime()
  }

  var svg, rect

  function mount (selection) {
    svg = selection.append('svg')
    rect = svg.append('rect')
    svg
      .call(geoMap)
      .call(animalMap)
    store.on('ready', function () {
      mount.state({ width: store.get('layout').mapWidth })
      draw()
    })
    store.on('resize', function () {
      mount.state({ width: store.get('layout').mapWidth })
      draw()
    })
    store.on('center', function () {
      mount.state({ projection: store.get('mapProjection') })
      draw()
    })
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
    draw()
    return mount
  }

  return mount
}
