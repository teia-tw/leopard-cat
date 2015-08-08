'use strict'

require('debug').enable('*')
var debug = require('debug')('map')

var d3 = require('d3')
var topojson = require('topojson')

var geoMap = require('./geoMap')
var animalMap = require('./animalMap')


//function cases () {
  //var width = 800
  //var height = 600
  //var margin = { top: 0, right: 0, bottom: 0, left: 0 }
  //function draw (selection) {
    //var svg = selection.append('g')
      //.attr('class', 'cases')
      //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //d3.json('data/華南路.geojson', function (err, road1) {
    //})
  //}
  //return draw
//}

d3.select('.map')
  .append('svg')
  .attr('width', 800)
  .attr('height', 600)
  .call(geoMap('geo-map'))
  .call(animalMap('animal-map'))
