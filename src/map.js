'use strict'

var d3 = require('d3')
var topojson = require('topojson')

var map = function (selection) {
  var width = 800
  var height = 600
  var margin = { top: 0, right: 0, bottom: 0, left: 0 }

  function draw (selection) {
    d3.json('data/twCounty2010.topo.json', function (err, data) {
      if (err) {
        console.error('Error retrieving topojson: %s', err)
        return
      }
      var topo = topojson.feature(data, data.objects['layer1'])
      var projection = d3.geo.mercator().center([120.979, 23.978]).scale(5000)
      var path = d3.geo.path().projection(projection)

      var svg = selection.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var county = svg.selectAll('path')
        .data(topo.features)
      .enter().append('path')
        .attr('d', path)
        .attr('fill', 'green')
    })
  }

  return draw
}

d3.select('.map')
  .call(map())
