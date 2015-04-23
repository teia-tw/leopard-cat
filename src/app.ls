"use strict"

osmLayer = ->
  L.tileLayer 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', do
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

addMarker = (map) ->
  ->
    L.marker [it[x] for x in <[Latitude Longitude]>]
      .bindPopup it.CollectedDateTime
      .addTo map

map = L.map "map"
  .addLayer osmLayer!
  .setView [24, 120], 8

topicAnimal <- $.get "topic_animal.csv"
err, data <- $.csv.toObjects topicAnimal, {}

console.log err if err

addPoint = addMarker map
obs <- data.forEach

return unless +obs['iPrecision '] > 0

addPoint obs



