'use strict'

var debug = require('debug')('animalMap')

var d3 = require('d3')
d3.hexbin = require('../lib/d3-plugins/hexbin')

var store = require('./store')

var componentName = 'animalMap'

module.exports = function (p) {

  var props = Object.assign({}, p || {})

  // stateless component

  var g

  function draw (selection) {
    debug('draw with %o', props)

    g = selection.selectAll('g.' + componentName)
      .data([0])
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    g.enter().append('g')
      .classed(componentName, true)
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    g.exit().remove()

    //store.get('animal', drawHexbin)
    store.on('animalUpdate', drawHexbin)
  }

  function drawHexbin (data) {
    debug('drawHexbin with %o', data)

    var hexbin = d3.hexbin()
      .size([props.width, props.height])
      .radius(16)
    var colorScale = d3.scale.linear()
      .domain([1, 18])
      .range(['rgb(253, 208, 162, 0.8)', 'rgb(230, 85, 13)'])
      .interpolate(d3.interpolateLab)

    var hexagon = g.selectAll('path.hexagon')
      .data(hexbin(data.map(function (d) { return props.projection(d.lngLat) })))
      .attr('d', hexbin.hexagon())
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .style('fill', function (d) { return colorScale(d.length) })
    hexagon.enter().append('path')
      .classed('hexagon', true)
      .attr('d', hexbin.hexagon())
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .style('fill', function (d) { return colorScale(d.length) })
    hexagon.exit().remove()
  }

  return draw
}
