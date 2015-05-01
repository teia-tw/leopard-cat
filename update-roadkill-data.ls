"use strict"

require! <[http fs stream]>

dataSourceURL = "http://opendata.epa.gov.tw/ws/Data/RoadKilled/?format=csv"
outputFilename = "src/roadkill.csv"

first = true
skip = 0
dataStream = stream.Duplex!
dataStream._write = (chunk) ->
  dataStream.push chunk
dataStream._read = ->
  res <- http.get "#{dataSourceURL}&$skip=#{skip}"
  res.on "data" -> dataStream.push it
  res.on "end" ->
    first := false
    skip := skip + 1000

output = fs.createWriteStream outputFilename
dataStream.pipe output
