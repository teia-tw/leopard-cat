'use strict'

var debug = require('debug')('leopard-cat:store')

var d3 = require('d3')
var dispatcher = require('./dispatcher')
var debounce = require('debounce')
var $ = require('jquery')
var topojson = require('topojson')
var crossfilter = require('crossfilter')

var store = {
  data: {
  },
  filters: {
    animal: crossfilter(),
    roadkill: crossfilter(),
    construct: crossfilter()
  },
  dimensions: {}
}

var dispatch = d3.dispatch(
  'loading',
  'ready',
  'update'
)
d3.rebind(store, dispatch, 'on')

store.updateScroll = function () {
  store.data.scrollTop = $(window).scrollTop()
  debug(store.data.scrollTop)
  dispatch.update()
}

store.loadLayout = function () {
  store.data.height = 0
  store.data.width = parseInt(d3.select('body').style('width'), 10)
  store.data.mapFixed = false
}

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
  d3.csv('data/tapir.csv')
    .on('progress', function () {
      dispatch.loading(d3.event.loaded)
    })
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
          latLng: [+d.WGS84Lat, +d.WGS84Lon]
        }
      }))
      store.dimensions.roadkill = store.filters.roadkill.dimension(function (d) {
        return d.date
      })
      if (store.data.focusedEvent) {
        store.dimensions.roadkill.filter(function (d) {
          return d <= store.data.focusedEvent.date
        })
      }
      dispatch.update()
    })
}

store.loadConstruct = function () {
  d3.json('data/construct.geojson')
    .get(function (err, data) {
      if (err) {
        debug(err)
        return
      }
      store.filters.construct.add(data.features.map(function (d) {
        return {
          name: d.properties.name,
          date: new Date(d.properties.date),
          lngLat: d.geometry.coordinates,
          latLng: [d.geometry.coordinates[1], d.geometry.coordinates[0]]
        }
      }))
      store.dimensions.construct = store.filters.construct.dimension(function (d) {
        return d.date
      })
      if (store.data.focusedEvent) {
        store.dimensions.construct.filter(function (d) {
          return d <= store.data.focusedEvent.date
        })
      }
      dispatch.update()
    })
}

store.loadTimeline = function () {
  d3.csv('data/timeline.csv')
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
  if (act.name === 'focuseEvent') {
    debug(act.opts)
    store.data.focusedEvent = act.opts
    if (store.dimensions.animal) {
      store.dimensions.animal.filter(function (d) {
        return d <= store.data.focusedEvent.date
      })
    }
    if (store.dimensions.roadkill) {
      store.dimensions.roadkill.filter(function (d) {
        return d <= store.data.focusedEvent.date
      })
    }
    if (store.dimensions.construct) {
      store.dimensions.construct.filter(function (d) {
        return d <= store.data.focusedEvent.date
      })
    }
    dispatch.update()
  } else if (act.name === 'setHeight') {
    store.data.height = act.opts
    dispatch.update()
  } else if (act.name === 'setWidth') {
    store.data.width = act.opts
    dispatch.update()
  } else if (act.name === 'focusTag') {
    store.data.focusTags = act.opts
    dispatch.update()
  }
}

store.init = function () {
  store.loadLayout()
  store.loadGeo()
  store.loadAnimal()
  store.loadConstruct()
  store.loadRoadkill()
  store.loadTimeline()
  dispatcher.on('update', store.handle.bind(store))
  $(window).on('scroll', debounce(store.updateScroll.bind(store), 10))
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
  if (arguments[0] === 'construct') {
    if (store.dimensions.construct) {
      return store.dimensions.construct.top(Infinity)
    }
    return []
  }
  if (arguments[0] === 'tag') {
    return [
      {
        name: '路殺',
        color: 'red'
      },
      // {
        // name: '獸鋏',
        // color: 'rgb(228, 26, 28)'
      // },
      // {
        // name: '衝突',
        // color: 'rgb(214, 39, 40)'
      // },
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
      // {
        // name: '石虎研究',
        // color: 'rgb(116, 196, 118)'
      // },
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
