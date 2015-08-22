'use strict'

var debug = require('debug')('eventMap')

var d3 = require('d3')

var componentName = 'eventMapMap'

module.exports = function (p) {
  var props = Object.assign({
    projection: d3.geo.mercator().center([121.65, 24.20]).scale(20000)
  }, p || {})

  var construct

  function draw (selection) {
    debug('draw with %o', props)

    construct = selection.selectAll('g.' + componentName)
      .data(['construct'])
    construct.enter().append('g')
      .attr('class', function (d) {
        return componentName + ' ' + d
      })
    construct.exit().remove()

    drawConstruct(props.data || [])
  }

  function drawConstruct (data) {
    var circle = construct.selectAll('circle')
      .data(data)
      .attr('r', 3)
      .attr('cx', function (d) {
        return props.projection(d.lngLat)[0]
      })
      .attr('cy', function (d) {
        return props.projection(d.lngLat)[1]
      })
      .style('fill', 'rgba(255, 64, 255, 0.77)')
      .style('stroke', '1px')
      .style('stroke', 'black')
    circle.enter().append('circle')
      .attr('r', 3)
      .attr('cx', function (d) {
        return props.projection(d.lngLat)[0]
      })
      .attr('cy', function (d) {
        return props.projection(d.lngLat)[1]
      })
      .style('fill', 'rgba(255, 64, 255, 0.77)')
      .style('stroke', '1px')
      .style('stroke', 'black')
    circle.exit().remove()
  }

  return draw
}
