'use strict'

var debug = require('debug')('map')

var d3 = require('d3')
var store = require('./store')

var geoMap = require('./geoMap')
var animalMap = require('./animalMap')

var componentName = 'map'

module.exports = function (p) {

  var props = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    width: 800,
    height: 600,
    projection: d3.geo.mercator().center([121.05, 24.50]).scale(40000)
  }, p || {})

  var state = Object.assign({}, props)

  var svg
  var rect

  function mount (selection) {
    svg = selection.append('svg')
    rect = svg.append('rect')
    svg
      .call(geoMap(props).attach(mount))
      .call(animalMap(props).attach(mount))
    store.on('ready', function () {
      setState({ width: store.get('layout').mapWidth })
    })
    store.on('resize', function () {
      setState({ width: store.get('layout').mapWidth })
    })
    //store.on('center', function () {
      //setState({ projection: store.get('mapProjection') })
    //})
  }

  var dispatch = d3.dispatch('draw')
  d3.rebind(mount, dispatch, 'on')

  function draw (p) {
    props = Object.assign(props, p || {})
    svg
      .attr('width', state.width)
      .attr('height', state.height)
    rect
      .attr('class', 'background')
      .attr('width', state.width)
      .attr('height', state.height)
    dispatch.draw(props)
  }

  function setState () {
    state = Object.assign(state, arguments[0])
    draw()
  }

  return mount
}
