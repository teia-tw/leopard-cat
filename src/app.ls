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
    L.marker [it[x] for x in <[Latitude Longitude]>], {time: it.CollectedDateTime.format 'YYYY-MM-DD HH:mm:ss+01'}
      .bindPopup it.CollectedDateTime
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

map
  .addControl sliderControl
  .setView [24.5, 121], 10
sliderControl.startSlider!
