'use strict'

var debug = require('debug')('tagsline')

var d3 = require('d3')
var store = require('./store')

var componentName = 'tagsline'

function tagAxis (p) {
  var props = Object.assign({
    'strok-width': 4,
    length: 500
  }, p || {})

  function draw (selection) {
    var axis = selection.selectAll('line')
      .data([0])
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', props.length)
      .style('stroke', 'black')
      .style('stroke-width', props['stroke-width'] + 'px')
    axis.enter().append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', props.length)
      .style('stroke', 'black')
      .style('stroke-width', props['stroke-width'] + 'px')
    axis.exit().remove()
  }

  return draw
}

module.exports = function (p) {
  var props = Object.assign({
  }, p || {})

  function draw (selection) {
    debug('draw')

    var svg = selection.selectAll('svg.' + componentName)
      .data([0])
      .classed(componentName, true)
      .style('width', props.width + 'px')
    svg.enter().append('svg')
      .classed(componentName, true)
      .style('width', props.width + 'px')
    svg.exit().remove()

    var axises = svg.selectAll('g.tag.axis')
      .data(store.get('tag'))
      .classed({ tag: true, axis: true })
      .attr('transform', function (d, i) {
        return 'translate(' + i * 10 + ',0)'
      })
      .each(function (d, i) {
        d3.select(this).call(tagAxis({ top: 0, left: i * 30 }))
      })
    axises.enter().append('g')
      .classed({ tag: true, axis: true })
      .attr('transform', function (d, i) {
        return 'translate(' + i * 10 + ',0)'
      })
      .each(function (d, i) {
        d3.select(this).call(tagAxis({ top: 0, left: i * 30 }))
      })
    axises.exit().remove()
  }

  return draw
}
