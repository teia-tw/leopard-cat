'use strict'

require('debug').enable('*')
var debug = require('debug')('map')

var d3 = require('d3')

var geoMap = require('./geoMap')
var animalMap = require('./animalMap')

var map = d3.select('.map')
  .append('svg')
  .attr('width', 800)
  .attr('height', 600)

map
  .append('rect')
  .attr('class', 'background')
  .attr('width', 800)
  .attr('height', 600)

map
  .call(geoMap('geo-map'))
  .call(animalMap('animal-map'))

debug('start')
