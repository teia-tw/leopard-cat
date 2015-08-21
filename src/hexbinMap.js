'use strict'

var debug = require('debug')('hexbinMap')

var d3 = require('d3')
d3.hexbin = require('../lib/d3-plugins/hexbin')

var componentName = 'hexbinMap'

module.exports = function (p) {

  var props = Object.assign({}, p || {})

  // stateless component

  var g

  function draw (selection) {
    debug('draw with %o', props)

    g = selection.selectAll('g.' + componentName + '.' + props.className)
      .data([0])
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    g.enter().append('g')
      .classed(componentName, true)
      .classed(props.className, true)
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    g.exit().remove()

    drawHexbin(props.data)
  }

  function drawHexbin (data) {
    debug('drawHexbin with %o', data)

    var hexbin = d3.hexbin()
      .size([props.width, props.height])
      .radius(8)
    var radiusScale = d3.scale.sqrt()
      .domain([1, 16])
      .range([2, 12])

    var hexagon = g.selectAll('path.hexagon')
      .data(hexbin(data.map(function (d) { return props.projection(d.lngLat) })), function (d) { return [d.i, d.j] })
    hexagon
      .transition()
      .delay(0.5)
      .attr('d', function (d) { return hexbin.hexagon(radiusScale(d.length)) })
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .style('fill', p.color)
      .style('stroke', 'black')
      .style('stroke-width', '1px')
    hexagon.enter().append('path')
      .classed('hexagon', true)
      .attr('d', function (d) { return hexbin.hexagon(radiusScale(d.length)) })
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .style('fill', p.color)
    hexagon.exit().remove()
  }

  return draw
}
