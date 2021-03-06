'use strict'

var debug = require('debug')('map')

var d3 = require('d3')

var store = require('./store')
var geoMap = require('./geoMap')
var hexbinMap = require('./hexbinMap')
var eventMap = require('./eventMap')

var componentName = 'map'

module.exports = function (p) {
  var props = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    width: 800,
    height: 600,
    projection: d3.geo.mercator().center([121.65, 24.20]).scale(20000)
  }, p || {})

  var svg

  function draw (selection) {
    debug('draw with %o', props)

    svg = selection.selectAll('svg.' + componentName)
      .data([0])
      .attr('width', props.width)
      .attr('height', props.height)
      .style(props.fixed ? {
        position: 'fixed',
        left: 0,
        top: 0
      } : {
        position: 'inherit'
      })
    svg.enter().append('svg')
      .classed(componentName, true)
      .attr('width', props.width)
      .attr('height', props.height)
    svg.exit().remove()

    var rect = svg.selectAll('rect')
      .data([0])
      .classed('background', true)
      .attr('width', props.width)
      .attr('height', props.height)
    rect.enter().append('rect')
      .classed('background', true)
      .attr('width', props.width)
      .attr('height', props.height)
    rect.exit().remove()

    svg
      .call(geoMap(props))
      .call(hexbinMap(Object.assign({
        className: 'animal',
        color: 'orange',
        data: store.get('animal')
      }, props)))
      .call(hexbinMap(Object.assign({
        className: 'roadkill',
        color: 'red',
        data: store.get('roadkill')
      }, props)))
      .call(eventMap(Object.assign({
        className: 'construct',
        color: 'red',
        data: store.get('construct')
      }, props)))
  }

  return draw
}
