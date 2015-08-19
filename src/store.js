'use strict'

var debug = require('debug')('store')

var d3 = require('d3')
var topojson = require('topojson')
var crossfilter = require('crossfilter')
var action = require('./action')

var store = { data: {} }
var dispatch = d3.dispatch(
  'ready',
  'focusedUpdate',
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
      store.data.animalFilter = crossfilter(store.data.animal)
      store.data.animalDate = store.data.animalFilter.dimension(function (d) {
        return d.date
      })
      dispatch.animalUpdate(store.data.animalDate)
    })
}

store.loadTimeline = function () {
  store.data.timeline = []
  d3.csv('http://cors.io/?u=https://docs.google.com/spreadsheets/d/1J3Sm3MURwI9ZErjcxdxNEkm9Cfactw0Na6KD65NcYcA/pub?output=csv')
    .on('progress', function () {
      dispatch.timelineLoading(d3.event.loading)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      store.data.timeline = data
      dispatch.timelineUpdate(data)
    })
}

store.handle = function (act) {
  debug('handle ' + act.name)
  if (act.name === 'focused') {
    debug(act.opts)
    store.data.focused = act.opts
    dispatch.focusedUpdate(store.data.focused)
  }
}

store.init = function () {
  store.loadGeo()
  store.loadAnimal()
  store.loadTimeline()
  action.on('run', store.handle.bind(store))
  dispatch.ready()
}

store.get = function (name, func) {
  if (store.data[name]) {
    return func(store.data[name])
  }
}

module.exports = store
