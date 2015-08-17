'use strict'

var debug = require('debug')('store')

var d3 = require('d3')
var topojson = require('topojson')
var action = require('./action')

var store = { data: {} }
var dispatch = d3.dispatch(
  'ready',
  'geoLoading', 'geoUpdate',
  'animalLoading', 'animalUpdate',
  'timelineLoading', 'timelineUpdate'
)
d3.rebind(store, dispatch, 'on')

store.loadGeo = function () {
  store.data.geo = {}
  d3.json('/data/twCounty2010.topo.json')
    .on('progress', function () {
      dispatch.geoLoading(d3.event.loaded)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      var topo = topojson.feature(data, data.objects.layer1)
      store.data.geo = topo.features
      dispatch.geoUpdate(store.data.geo)
    })
}

store.loadAnimal = function () {
  store.data.animal = []
  d3.csv('/data/topic_animal.csv')
    .on('progress', function () {
      dispatch.animalLoading(d3.event.loaded)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      store.data.animal = data.map(function (d) {
        var date = new Date(d.CollectedDateTime)
        return {
          id: 'tesri-' + date.getTime(),
          date: date,
          lngLat: [+d.Longitude, +d.Latitude],
          latLng: [+d.Latitude, +d.Longitude]
        }
      })
      dispatch.animalUpdate(store.data.animal)
    })
}

store.loadTimeline = function () {
  d3.csv('http://cors.io/?u=https://docs.google.com/spreadsheets/d/1J3Sm3MURwI9ZErjcxdxNEkm9Cfactw0Na6KD65NcYcA/pub?output=csv')
    .on('progress', function () {
      dispatch.timelineLoading(d3.event.loading)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      dispatch.timelineUpdate(data)
    })
}

store.handle = function (act) {
  debug('handle ' + act.name)
}

store.init = function () {
  store.loadGeo()
  store.loadAnimal()
  store.loadTimeline()
  action.on('action', store.handle.bind(store))
  dispatch.ready()
}

store.get = function (name) {
  return store.data[name]
}

module.exports = store
