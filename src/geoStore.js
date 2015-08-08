'use strict'

require('debug').enable('*')
var topojson = require('topojson')
var debug = require('debug')('geoStore')

var d3 = require('d3')

var store = {}
var data = {}

var dispatch = d3.dispatch('countyLoading', 'countyReady', 'highwayLoading', 'highwayReady', 'highway2Loading', 'highway2Ready', 'highway3Loading', 'highway3Ready')
d3.rebind(store, dispatch, 'on')

store.get = function (name, url, cleanup) {
  var loader = d3.json(url)
  loader.on('progress', function () {
    dispatch[name + 'Loading'](d3.event.loaded)
  })
  loader.get(function (err, res) {
    data = cleanup(res)
    dispatch[name + 'Ready'](data)
  })
}

store.loadCounty = function () {
  store.get('county', '/data/twCounty2010.topo.json', function (data) {
    var topo = topojson.feature(data, data.objects['layer1'])
    return topo.features
  })
}

store.loadHighway = function () {
  store.get('highway', '/data/highway-primary.geojson', function (data) {
    return data.features
  })
}

store.loadHighway2 = function () {
  store.get('highway2', '/data/highway-secondary.geojson', function (data) {
    return data.features
  })
}

store.loadHighway3 = function () {
  store.get('highway3', '/data/highway-tertiary.geojson', function (data) {
    return data.features
  })
}

store.load = function () {
  store.loadCounty()
  store.loadHighway()
  store.loadHighway2()
  store.loadHighway3()
}

module.exports = store
