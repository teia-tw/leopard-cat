'use strict'

require('debug').enable('*')
var debug = require('debug')('animalMap')

var d3 = require('d3')
d3.hexbin = require('../lib/d3-plugins/hexbin')

var store = require('./store')

var componentName = 'animalMap'

module.exports = function (p) {

  var state = {
    width: 800,
    height: 600,
    projection: d3.geo.mercator().center([121.05, 24.50]).scale(40000),
    date: (new Date('2006-01-01')).getTime()
  }

  var props = Object.assign(p || {}, {
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  })

  var hexbin = d3.hexbin()
    .size([state.width, state.height])
    .radius(16)
  var colorScale = d3.scale.linear()
    .domain([1, 18])
    .range(['rgb(253, 208, 162, 0.8)', 'rgb(230, 85, 13)'])
    .interpolate(d3.interpolateLab)

  var g

  function mount (selection) {
    g = selection.append('g')
      .attr('class', componentName + ' tesri hexbin')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    draw()
    store.on('animalUpdate', drawHexbin)
  }

  function drawHexbin (data) {
    var hexagon = g.selectAll('.hexagon')
      .data(hexbin(data.map(function (d) { return state.projection(d.lngLat) })))
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

  function draw () {
    store.get('animal', drawHexbin)
  }

  mount.state = function () {
    if (arguments.length === 0) { return state }
    state = Object.assign(state, arguments[0])
    draw()
    return mount
  }

  return mount
}
