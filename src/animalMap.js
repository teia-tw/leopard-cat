'use strict'

require('debug').enable('*')
var debug = require('debug')('animalStore')

var d3 = require('d3')
d3.hexbin = require('../lib/d3-plugins/hexbin')
var animalStore = require('./animalStore')
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

  var hexbin = d3.hexbin()
    .size([state.width, state.height])
    .radius(10)
  var colorScale = d3.scale.linear()
    .range([0, 1])
    .domain([0, 15])

  function drawHexbin (selection, data) {
    selection.selectAll('.hexagon')
      .data(hexbin(data.map(function (d) { return state.projection(d.lngLat) })))
    .enter().append('path')
      .attr('class', 'hexagon')
      .attr('d', hexbin.hexagon())
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .style('fill', function (d) { return 'rgba(255, 0, 0, ' + colorScale(d.length) + ')' })
  }

  function draw (selection) {
    var tesriSvg = selection.append('g')
      .attr('class', componentName + ' tesri hexbin')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    var roadKillSvg = selection.append('g')
      .attr('class', componentName + ' roadkill hexbin')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    animalStore.on('tesriReady', function (data) {
      drawHexbin(tesriSvg, data)
    })
    animalStore.loadTesri()
    animalStore.on('roadkillReady', function (data) {
      drawHexbin(roadKillSvg, data)
    })
    animalStore.loadRoadkill()
  }

  ;['width', 'height', 'projection'].forEach(function (n) {
    draw[n] = function () {
      if (arguments.length === 0) { return state[n] }
      state[n] = arguments[0]
      return draw
    }
  })

  return draw
}
