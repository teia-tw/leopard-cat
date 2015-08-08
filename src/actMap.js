'use strict'

require('debug').enable('*')
var debug = require('debug')('actMap')

var d3 = require('d3')
var actStore = require('./actStore')

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
    var actSvg = selection.append('g')
      .attr('class', componentName + ' act')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    actStore.on('actReady', function (data) {
      actSvg.selectAll('path')
        .data(data)
      .enter().append('path')
        .attr('d', path)
        .style('fill', 'none')
        .style('stroke', 'purple')
        .style('stroke-width', '3px')
    })

    actStore.load()
  }

  return draw
}
