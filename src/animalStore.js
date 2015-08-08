'use strict'

require('debug').enable('*')
var debug = require('debug')('animalStore')

var d3 = require('d3')

var store = {}
var data = {}

/**
 * Data sources
 */
var dataByName = {
  roadkill: {
    url: '/data/roadkill.csv',
    cleaner: function (d) {
      return {
        id: 'roadkill-' + d.SerialNo,
        date: new Date(d.ObserveDate),
        latLng: [+d.WGS84Lat, +d.WGS84Lon]
      }
    }
  },
  tesri: {
    url: '/data/topic_animal.csv',
    cleaner: function (d) {
      var date = new Date(d.CollectedDateTime)
      return {
        id: 'tesri-' + date.getTime(),
        date: date,
        latLng: [+d.Latitude, +d.Longitude]
      }
    }
  }
}

var dispatch = d3.dispatch.apply(d3,
  Object.keys(dataByName).map(function (n) { return [n + 'Loading', n + 'Ready'] })
    .reduce(function (cur, prev) { return cur.concat(prev) })
)
d3.rebind(store, dispatch, 'on')

/**
 * Internal function to get CSV data and clean it up.
 */
store.load = function (name, url, cleanup) {
  var loader = d3.csv(url)
  loader.on('progress', function () {
    dispatch[name + 'Loading'](d3.event.loaded)
  })
  loader.get(function (err, res) {
    data[name] = res.map(cleanup)
    dispatch[name + 'Ready'](data[name])
  })
}

/**
 * Internal function to get cleaned data.
 */
store.getCleaned = function (name) {
  return data[name]
}

/**
 * Shorthands for each of the data sources.
 */
Object.keys(dataByName).forEach(function (name) {
  store['load' + name[0].toUpperCase() + name.substr(1)] = store.load.bind(store, name, dataByName[name].url, dataByName[name].cleaner)
})

module.exports = store
