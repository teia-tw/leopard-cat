'use strict'

var L = require('leaflet')
L.Icon.Default.imagePath = '/assets/leaflet/dist/images/'

var d3 = require('d3')
var moment = require('moment')

var osmLayer = function () {
  return L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  })
}

var markerLayer = L.layerGroup()
L.map('map')
  .addLayer(osmLayer())
  .addLayer(markerLayer)
  .setView([24, 121], 8)

var addMarker = function (layer) {
  return function (it) {
    var time = it.CollectedDateTime.format('YYYY-MM-DD HH:mm:ss+01')
    return L.marker(
      ['Latitude', 'Longitude'].map(function (x) { return it[x] })
    ).bindPopup(time).addTo(layer)
  }
}

var addPoint = addMarker(markerLayer)

d3.csv('data/topic_animal.csv', function (err, topicAnimal) {
  if (err) {
    return console.log(err)
  }
  topicAnimal
    .filter(function (d) {
      return d.CollectedDateTime && +d['iPrecision '] > 0
    }).map(function (it) {
    it.CollectedDateTime = moment(it.CollectedDateTime)
    return it
  }).sort(function (a, b) {
    return a.CollectedDateTime.valueOf() - b.CollectedDateTime.valueOf()
  }).forEach(function (it) {
    return addPoint(it)
  })

  return d3.csv('data/roadkill.csv', function (err, roadKill) {
    if (err) {
      return console.log(err)
    }
    roadKill
      .map(function (it) {
        it.CollectedDateTime = moment(it.ObserveDate)
        it.Latitude = it.WGS84Lat
        it.Longitude = it.WGS84Lon
        return it
      }).sort(function (a, b) {
      return a.CollectedDateTime.valueOf() - b.CollectedDateTime.valueOf()
    }).forEach(function (it) {
      return addPoint(it)
    })
  })
})
