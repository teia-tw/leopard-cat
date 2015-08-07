'use strict'

var d3 = require('d3')
var topojson = require('topojson')
d3.hexbin = require('./hexbin')

var map = function () {
  var width = 800
  var height = 600
  var margin = { top: 0, right: 0, bottom: 0, left: 0 }

  function draw (selection) {
    var svg = selection.append('g')
      .attr('class', 'county-map')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    d3.json('data/twCounty2010.topo.json', function (err, data) {
      if (err) {
        console.error('Error retrieving topojson: %s', err)
        return
      }
      var topo = topojson.feature(data, data.objects['layer1'])
      var projection = d3.geo.mercator().center([121.05, 24.50]).scale(40000)
      var path = d3.geo.path().projection(projection)

      svg.selectAll('path')
        .data(topo.features)
      .enter().append('path')
        .attr('d', path)
        .attr('fill', 'green')

    })
  }

  return draw
}

var observation = function () {
  var width = 800
  var height = 600
  var margin = { top: 0, right: 0, bottom: 0, left: 0 }

  var hexbin = d3.hexbin()
    .size([width, height])
    .radius(20)
  var colorScale = d3.scale.linear()
    .range([0, 1])
    .domain([0, 15])
  var projection = d3.geo.mercator().center([121.05, 24.50]).scale(40000)

  function draw (selection) {
    var svg = selection.append('g')
      .attr('class', 'heatmap-hexagon')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    d3.csv('data/topic_animal.csv', function (err, animal) {
      if (err) {
        console.error('Error retrieving animal: %s', err)
        return
      }
      svg.selectAll('.hexagon')
        .data(hexbin(animal.map(function (d) { return projection([d.Longitude, d.Latitude]) })))
      .enter().append('path')
        .attr('class', 'hexagon')
        .attr('d', hexbin.hexagon())
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
        .style('fill', function (d) { return 'rgba(255, 0, 0, ' + colorScale(d.length) + ')' })
    })
  }

  return draw
}

d3.select('.map')
  .append('svg')
  .attr('width', 800)
  .attr('height', 600)
  .call(map())
  .call(observation())
