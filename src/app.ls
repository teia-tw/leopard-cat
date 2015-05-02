"use strict"

osmLayer = ->
  L.tileLayer 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', do
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
markerLayer = L.layerGroup!
sliderControl = L.control.sliderControl {layer: markerLayer}
map = L.map "map"
  .addLayer osmLayer!
  .addLayer markerLayer

addMarker = (layer) ->
  ->
    time = it.CollectedDateTime.format 'YYYY-MM-DD HH:mm:ss+01'
    L.marker [it[x] for x in <[Latitude Longitude]>], {time}
      .bindPopup time
      .addTo layer
addPoint = addMarker markerLayer

topicAnimal <- $.get "topic_animal.csv"
err, data <- $.csv.toObjects topicAnimal, {}
console.log err if err
[ d for d in data when d.CollectedDateTime and +d['iPrecision '] > 0 ]
  .map ->
    it.CollectedDateTime = moment it.CollectedDateTime
    it
  .sort (a, b) ->
    a.CollectedDateTime.valueOf! - b.CollectedDateTime.valueOf!
  .forEach -> addPoint it

roadKill <- $.get "roadkill.csv"
err, data <- $.csv.toObjects roadKill, {}
console.log err if err
[ d for d in data ]
  .map ->
    it.CollectedDateTime = moment it.ObserveDate
    it.Latitude = it.WGS84Lat
    it.Longitude = it.WGS84Lon
    it
  .sort (a, b) ->
    a.CollectedDateTime.valueOf! - b.CollectedDateTime.valueOf!
  .forEach -> addPoint it

map
  .addControl sliderControl
  .setView [24.5, 121], 10
sliderControl.startSlider!
