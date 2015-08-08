'use strict'

require('debug').enable('*')
var debug = require('debug')('geoMap')

var d3 = require('d3')
var topojson = require('topojson')
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

  function draw (selection) {
    var svg = selection.append('g')
      .attr('class', 'geo-map')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    geoStore.on('countyReady', function (data) {
      var topo = topojson.feature(data, data.objects['layer1'])
      var path = d3.geo.path().projection(state.projection)

      svg.selectAll('path')
        .data(topo.features)
      .enter().append('path')
        .attr('d', path)
        .attr('fill', 'grey')

    })
    geoStore.loadCounty()
  }

  return draw
}
