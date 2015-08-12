'use strict'

require('debug').enable('*')
var topojson = require('topojson')
var debug = require('debug')('geoStore')

var d3 = require('d3')

var store = {}
var data = {}

var dispatch = d3.dispatch('countyLoading', 'countyReady', 'highwayLoading', 'highwayReady')
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
    var topo = topojson.feature(data, data.objects.layer1)
    return topo.features
  })
}

store.loadHighway = function () {
  store.get('highway', '/data/highway.topo.json', function (data) {
    var topo = topojson.feature(data, data.objects.highway)
    return topo.features
  })
}

store.load = function () {
  store.loadCounty()
  store.loadHighway()
}

module.exports = store
