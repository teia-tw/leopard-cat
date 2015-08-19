'use strict'

var debug = require('debug')('store')

var d3 = require('d3')
var topojson = require('topojson')
var crossfilter = require('crossfilter')
var action = require('./action')

var store = {
  data: {
  },
  filters: {
    animal: crossfilter()
  },
  dimensions: {}
}

var dispatch = d3.dispatch(
  'loading',
  'ready',
  'update'
)
d3.rebind(store, dispatch, 'on')

store.loadGeo = function () {
  d3.json('/data/twCounty2010.topo.json')
    .on('progress', function () {
      dispatch.loading(d3.event.loaded)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      var topo = topojson.feature(data, data.objects.layer1)
      store.data.geo = topo.features
      dispatch.update()
    })
}

store.loadAnimal = function () {
  d3.csv('/data/topic_animal.csv')
    .on('progress', function () {
      dispatch.loading(d3.event.loaded)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      store.filters.animal.add(data.map(function (d) {
        var date = new Date(d.CollectedDateTime)
        return {
          id: 'tesri-' + date.getTime(),
          date: date,
          lngLat: [+d.Longitude, +d.Latitude],
          latLng: [+d.Latitude, +d.Longitude]
        }
      }))
      store.dimensions.animal = store.filters.animal.dimension(function (d) { return d.date })
      if (store.data.focused) {
        store.dimensions.animal.filter(function (d) {
          return d < store.data.focused.date
        })
      }
      dispatch.update()
    })
}

store.loadTimeline = function () {
  d3.csv('http://cors.io/?u=https://docs.google.com/spreadsheets/d/1J3Sm3MURwI9ZErjcxdxNEkm9Cfactw0Na6KD65NcYcA/pub?output=csv')
    .on('progress', function () {
      dispatch.loading(d3.event.loading)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      store.data.timeline = data.map(function (d) {
        return {
          date: d['日期 '],
          category: d['分類（以逗號分隔：開發案, 路殺, 衝突, 友善農耕,石虎研究）'].split(/,\s*/),
          link: d['資訊連結'],
          title: d['事件'],
          ref: d['資料來源（e-info或其他媒體）'],
          location: (d['經度（路殺或目擊事件才需登）'] ? [d['經度（路殺或目擊事件才需登）'], d['緯度（路殺或目擊事件才需登）']] : undefined)
        }
      })
      store.data.timelineFilter = crossfilter(store.data.timeline)
      store.data.timelineDate = store.data.timelineFilter.dimension(function (d) { return d.date })
      dispatch.update()
    })
}

store.handle = function (act) {
  debug('handle ' + act.name)
  if (act.name === 'focused') {
    debug(act.opts)
    store.data.focused = act.opts
    if (store.dimensions.animal) {
      store.dimensions.animal.filter(function (d) {
        return d < store.data.focused.date
      })
    }
    debug(store.dimensions.animal.top(1000))
    dispatch.update()
  }
}

store.init = function () {
  store.loadGeo()
  store.loadAnimal()
  store.loadTimeline()
  action.on('run', store.handle.bind(store))
  dispatch.ready()
}

store.get = function () {
  if (arguments[0] === 'animal') {
    if (store.dimensions.animal) {
      return store.dimensions.animal.top(Infinity)
    }
    return []
  }
  if (arguments.length > 0) {
    for (var r = store.data, i = 0; i < arguments.length; i++) {
      r = r[arguments[i]]
      if (r === undefined) {
        break
      }
    }
    return r
  } else {
    return store.data
  }
}

module.exports = store
