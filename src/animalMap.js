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
  var hexbin
  var colorScale

  function mount (selection) {
    hexbin = d3.hexbin()
      .size([props.width, props.height])
      .radius(16)
    colorScale = d3.scale.linear()
      .domain([1, 18])
      .range(['rgb(253, 208, 162, 0.8)', 'rgb(230, 85, 13)'])
      .interpolate(d3.interpolateLab)
    g = selection.append('g')
      .attr('class', componentName + ' tesri hexbin')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    store.on('animalUpdate', drawHexbin)
  }

  var dispatch = d3.dispatch('draw')
  d3.rebind(mount, dispatch, 'on')

  mount.attach = function (upper) {
    upper.on('draw', draw)
    return mount
  }

  function draw (p) {
    props = Object.assign(props, p || {})
    hexbin.size([props.width, props.height])
    g.attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    store.get('animal', drawHexbin)
    dispatch.draw(props)
  }

  function drawHexbin (data) {
    var hexagon = g.selectAll('.hexagon')
      .data(hexbin(data.map(function (d) { return props.projection(d.lngLat) })))
      .attr('d', hexbin.hexagon())
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .style('fill', function (d) { return colorScale(d.length) })
    hexagon.enter().append('path')
      .attr('class', 'hexagon')
      .attr('d', hexbin.hexagon())
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .style('fill', function (d) { return colorScale(d.length) })
    hexagon.exit().remove()
  }

  return mount
}
