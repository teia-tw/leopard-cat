'use strict'

require('debug').enable('*')
var debug = require('debug')('actStore')

var d3 = require('d3')

var store = {}
var data = {}

var dispatch = d3.dispatch('actLoading', 'actReady')
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

store.loadAct = function () {
  store.get('act', '/data/華南路.geojson', function (data) {
    return data.features
  })
}

store.load = function () {
  store.loadAct()
}

module.exports = store
