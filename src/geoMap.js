'use strict'

require('debug').enable('*')
var debug = require('debug')('geoMap')

var d3 = require('d3')
var store = require('./store')

var componentName = 'geo-map'

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
    var g = selection.append('g')
      .attr('class', componentName + ' geo')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    store.on('geoUpdate', function (data) {
      g.selectAll('path')
        .data(data)
      .enter().append('path')
        .attr('d', path)
        .attr('fill', function (d) { return d.properties.COUNTYNAME === '苗栗縣' ? '#fff' : '#ccc' })
        .attr('stroke', function (d) { return d.properties.COUNTYNAME === '苗栗縣' ? '#333' : '#fff' })
    })
  }

  return draw
}
