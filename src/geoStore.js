'use strict'

require('debug').enable('*')
var debug = require('debug')('geoStore')

var d3 = require('d3')

var store = {}
var data = {}

var dispatch = d3.dispatch('countyLoading', 'countyReady')
d3.rebind(store, dispatch, 'on')

store.load = function (url, cleanup) {
  var loader = d3.json(url)
  loader.on('progress', function () {
    dispatch.countyLoading(d3.event.loaded)
  })
  loader.get(function (err, res) {
    data = cleanup(res)
    dispatch.countyReady(data)
  })
}

store.loadCounty = function () {
  store.load('/data/twCounty2010.topo.json', function (data) {
    return data
  })
}

module.exports = store
