
var debug = require('debug')('leopard-cat:animalStore')
var dispatcher = require('./dispatcher')
var d3 = require('d3')
var crossfilter = require('crossfilter')
var async = require('async')
var dispatch = d3.dispatch('loading', 'ready')
var store = {
  _data: [],
  _cf: crossfilter()
}
d3.rebind(store, dispatch, 'on')
module.exports = store

dispatcher.on('action', function (action) {
  if (action.type === 'load') {
    dispatch.loading(d3.event.loaded)
    d3.csv('data/tapir.csv')
      .get(function (err, data) {
        if (err) {
          debug(err)
          return
        }
        store.filters.animal.add(data.map(function (d) {
          var date = new Date(d['採集日'])
          return {
            id: d['永久識別碼'],
            date: date,
            latLng: [+d['緯度'], +d['經度']],
            lngLat: [+d['經度'], +d['緯度']]
          }
        }))
        store.dimensions.animal = store.filters.animal.dimension(function (d) { return d.date })
        if (store.data.focusedEvent) {
          store.dimensions.animal.filter(function (d) {
            return d <= store.data.focusedEvent.date
          })
        }
        dispatch.update()
      })
    d3.json('data/lin-2014.geojson')
      .get(function (err, data) {
        if (err) {
          debug(err)
          return
        }
        store.filters.animal.add(data.features.map(function (d, i) {
          return {
            id: 'lin2014-' + i,
            date: new Date(d.properties.date),
            latLng: [d.geometry.coordinates[1], d.geometry.coordinates[0]],
            lngLat: d.geometry.coordinates
          }
        }))
        store.dimensions.animal = store.filters.animal.dimension(function (d) { return d.date })
        if (store.data.focusedEvent) {
          store.dimensions.animal.filter(function (d) {
            return d <= store.data.focusedEvent.date
          })
        }
        dispatch.update()
      })
  }
})

store.allAnimal = function () {
  return store._data
}
