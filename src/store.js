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
    animal: crossfilter(),
    roadkill: crossfilter()
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
  d3.json('data/twCounty2010.topo.json')
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
  d3.csv('data/topic_animal.csv')
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
      if (store.data.focused) {
        store.dimensions.animal.filter(function (d) {
          return d < store.data.focused.date
        })
      }
      dispatch.update()
    })
}

store.loadRoadkill = function () {
  d3.csv('data/roadkill.csv')
    .on('progress', function () {
      dispatch.loading(d3.event.loaded)
    })
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      store.filters.roadkill.add(data.map(function (d) {
        return {
          id: 'roadkilltw-' + d.SerialNo,
          date: new Date(d.ObserveDate),
          lngLat: [+d.WGS84Lon, +d.WGS84Lat],
          latlng: [+d.WGS84Lat, +d.WGS84Lon]
        }
      }))
      store.dimensions.roadkill = store.filters.roadkill.dimension(function (d) {
        return d.date
      })
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
          tags: d['分類（以逗號分隔：開發案, 路殺, 衝突, 友善農耕,石虎研究）'].split(/,\s*/),
          link: d['資訊連結'],
          title: d['事件'],
          ref: d['資料來源（e-info或其他媒體）'],
          location: (d['經度（路殺或目擊事件才需登）'] ? [d['經度（路殺或目擊事件才需登）'], d['緯度（路殺或目擊事件才需登）']] : undefined)
        }
      })
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
  } else if (act.name === 'setHeight') {
    store.data.height = act.opts
    dispatch.update()
  }
}

store.init = function () {
  store.loadGeo()
  store.loadAnimal()
  store.loadRoadkill()
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
  if (arguments[0] === 'roadkill') {
    if (store.dimensions.roadkill) {
      return store.dimensions.roadkill.top(Infinity)
    }
    return []
  }
  if (arguments[0] === 'tag') {
    return [
      {
        name: '路殺',
        color: 'red'
      },
      //{
        //name: '獸鋏',
        //color: 'rgb(228, 26, 28)'
      //},
      //{
        //name: '衝突',
        //color: 'rgb(214, 39, 40)'
      //},
      {
        name: '苗50線',
        color: 'rgb(255, 127, 0)'
      },
      {
        name: '三義外環道',
        color: 'rgb(255, 217, 47)'
      },
      {
        name: '後龍殯葬園區',
        color: 'rgb(229, 196, 148)'
      },
      //{
        //name: '石虎研究',
        //color: 'rgb(116, 196, 118)'
      //},
      {
        name: '友善農耕',
        color: 'rgb(44, 160, 44)'
      }
    ]
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
