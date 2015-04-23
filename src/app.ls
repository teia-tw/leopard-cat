"use strict"

osmLayer = ->
  L.tileLayer 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', do
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

map = L.map "map"
  .addLayer osmLayer!
  .setView [24, 120], 8
