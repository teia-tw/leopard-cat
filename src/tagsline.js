'use strict'

var debug = require('debug')('tagsline')

var d3 = require('d3')
var store = require('./store')

var componentName = 'tagsline'

function tagAxis (p) {
  var props = Object.assign({
    'stroke-width': 2,
    length: 0
  }, p || {})

  function draw (selection) {
    debug('draw with %o', props)

    var axis = selection.selectAll('rect')
      .data([0])
      .attr('width', 4)
      .attr('height', props.length)
      .style('fill', props.tag.color)
    axis.enter().append('rect')
      .attr('width', 4)
      .attr('height', props.length)
      .style('fill', props.tag.color)
    axis.exit().remove()
  }

  return draw
}

module.exports = function (p) {
  var props = Object.assign({
  }, p || {})

  function draw (selection) {
    debug('draw with %o', props)

    var svg = selection.selectAll('svg.' + componentName)
      .data([0])
      .classed(componentName, true)
      .style('width', props.width + 'px')
      .style('height', props.height + 'px')
    svg.enter().append('svg')
      .classed(componentName, true)
      .style('width', props.width + 'px')
      .style('height', props.height + 'px')
    svg.exit().remove()

    var lineScale = d3.scale.linear()
      .domain([0, store.get('tag').length - 1])
      .range([20, props.width - 20])

    var axises = svg.selectAll('g.tag.axis')
      .data(store.get('tag'))
      .classed({ tag: true, axis: true })
      .attr('transform', function (d, i) {
        return 'translate(' + lineScale(i) + ',0)'
      })
      .each(function (d, i) {
        d3.select(this).call(tagAxis({
          length: props.height,
          tag: d
        }))
      })
    axises.enter().append('g')
      .classed({ tag: true, axis: true })
      .attr('transform', function (d, i) {
        return 'translate(' + lineScale(i) + ',0)'
      })
      .each(function (d, i) {
        d3.select(this).call(tagAxis({
          length: props.height,
          tag: d
        }))
      })
    axises.exit().remove()
  }

  return draw
}
