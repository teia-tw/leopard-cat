"use strict"

require! <[http fs stream]>

dataSourceURL = "http://opendata.epa.gov.tw/ws/Data/RoadKilled/?format=csv"
outputFilename = "src/roadkill.csv"

skip = 0
getData = ->
  console.log skip
  res <- http.get "#{dataSourceURL}&$skip=#{skip}"
  body = ""
  res.on "data" -> body += it
  res.on "end" ->
    return dataStream.push null unless body
    r = body.split /[\n\r]/ .filter (-> it == /Prionailurus/) .join "\n"
    skip := skip + 1000
    if r
      dataStream.push r + "\n"
    else
      getData!

dataStream = stream.Duplex!
dataStream._write = (chunk) ->
  dataStream.push chunk
dataStream._read = -> getData!

dataStream.push "SerialNo,ObserveDate,County,Township,Location,WGS84Lon,WGS84Lat,Family,ScienceName,CommonName\n"

output = fs.createWriteStream outputFilename
dataStream.pipe output
