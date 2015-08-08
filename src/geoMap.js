'use strict'

require('debug').enable('*')
var debug = require('debug')('geoMap')

var d3 = require('d3')
var geoStore = require('./geoStore')

var componentName

module.exports = function (name, p) {
  componentName = name
  var state = {
    width: 800,
    height: 600,
    projection: d3.geo.mercator().center([121.05, 24.50]).scale(40000)
  }
  var props = Object.assign(p || {}, {
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  })

  var path = d3.geo.path().projection(state.projection)

  function draw (selection) {
    var countySvg = selection.append('g')
      .attr('class', componentName + ' county')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    geoStore.on('countyReady', function (data) {
      countySvg.selectAll('path')
        .data(data)
      .enter().append('path')
        .attr('d', path)
    })

    var highwaySvg = selection.append('g')
      .attr('class', componentName + ' highway')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    geoStore.on('highwayReady', function (data) {
      highwaySvg.selectAll('path')
        .data(data)
      .enter().append('path')
        .attr('d', path)
    })

    var highway2Svg = selection.append('g')
      .attr('class', componentName + ' highway2')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    geoStore.on('highway2Ready', function (data) {
      highway2Svg.selectAll('path')
        .data(data)
      .enter().append('path')
        .attr('d', path)
    })

    geoStore.load()
  }

  return draw
}
