'use strict'

var debug = require('debug')('geoMap')

var d3 = require('d3')
var store = require('./store')

var componentName = 'geoMap'

module.exports = function (p) {

  var props = Object.assign({}, p || {})

  // stateless component

  var g
  var path

  function mount (selection) {
    g = selection.append('g')
      .attr('class', componentName)
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    path = d3.geo.path().projection(props.projection)
    store.on('geoUpdate', drawGeo)
  }

  var dispatch = d3.dispatch('draw')
  d3.rebind(mount, dispatch, 'on')

  mount.attach = function (upper) {
    upper.on('draw', draw)
    return mount
  }

  function draw (p) {
    props = Object.assign(props, p || {})
    g.attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    path = d3.geo.path().projection(props.projection)
    store.get('geo', drawGeo)
    dispatch.draw(props)
  }

  function drawGeo (data) {
    var geo = g.selectAll('path')
      .data(data)
      .attr('d', path)
      .attr('fill', function (d) {
        return d.properties.COUNTYNAME === '苗栗縣' ? '#fff' : '#ccc'
      })
      .attr('stroke', function (d) {
        return d.properties.COUNTYNAME === '苗栗縣' ? '#333' : '#fff'
      })
    geo.enter().append('path')
      .attr('d', path)
      .attr('fill', function (d) {
        return d.properties.COUNTYNAME === '苗栗縣' ? '#fff' : '#ccc'
      })
      .attr('stroke', function (d) {
        return d.properties.COUNTYNAME === '苗栗縣' ? '#333' : '#fff'
      })
    geo.exit().remove()
  }

  return mount
}
