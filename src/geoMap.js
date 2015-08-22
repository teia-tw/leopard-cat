'use strict'

var debug = require('debug')('geoMap')

var d3 = require('d3')
var store = require('./store')

var componentName = 'geoMap'

module.exports = function (p) {

  var props = Object.assign({}, p || {})

  // stateless component

  var g
  var construct

  function draw (selection) {
    debug('draw with %o', props)

    g = selection.selectAll('g.' + componentName)
      .data([0])
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    g.enter().append('g')
      .classed(componentName, true)
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    g.exit().remove()

    construct = g.selectAll('g.construct')
      .data([0])
    construct.enter().append('g')
      .classed('construct', true)
    construct.exit().remove()

    drawGeo(store.get('geo') || {})
  }

  function hightCounty (d) {
    return d.properties.COUNTYNAME === '苗栗縣' || d.properties.COUNTYNAME === '南投縣'
  }

  function drawGeo (data) {
    debug('drawGeo with %o', data)

    var path = d3.geo.path().projection(props.projection)

    var geo = g.selectAll('path')
      .data(data)
      .attr('d', path)
      .attr('fill', function (d) {
        return hightCounty(d) ? '#fff' : '#ccc'
      })
      .attr('stroke', '#fff')
    geo.enter().append('path')
      .attr('d', path)
      .attr('fill', function (d) {
        return hightCounty(d) ? '#fff' : '#ccc'
      })
      .attr('stroke', '#fff')
    geo.exit().remove()
  }

  return draw
}
