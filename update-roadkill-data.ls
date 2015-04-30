"use strict"

require! <[http fs]>

datasource_url = "http://opendata.epa.gov.tw/ws/Data/RoadKilled/?format=csv"
output_filename = "src/roadkill.json"
filter = ->

output = fs.createWriteStream output_filename
res <- http.get datasource_url
res.pipe output

