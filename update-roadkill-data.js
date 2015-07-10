(function(){
  "use strict";
  var http, fs, stream, dataSourceURL, outputFilename, skip, getData, dataStream, output;
  http = require('http');
  fs = require('fs');
  stream = require('stream');
  dataSourceURL = "http://opendata.epa.gov.tw/ws/Data/RoadKilled/?format=csv";
  outputFilename = "src/roadkill.csv";
  skip = 0;
  getData = function(){
    console.log(skip);
    return http.get(dataSourceURL + "&$skip=" + skip, function(res){
      var body;
      body = "";
      res.on("data", function(it){
        return body += it;
      });
      return res.on("end", function(){
        var r;
        if (!body) {
          return dataStream.push(null);
        }
        r = body.split(/[\n\r]/).filter(function(it){
          return /Prionailurus/.exec(it);
        }).join("\n");
        skip = skip + 1000;
        if (r) {
          return dataStream.push(r + "\n");
        } else {
          return getData();
        }
      });
    });
  };
  dataStream = stream.Duplex();
  dataStream._write = function(chunk){
    return dataStream.push(chunk);
  };
  dataStream._read = function(){
    return getData();
  };
  dataStream.push("SerialNo,ObserveDate,County,Township,Location,WGS84Lon,WGS84Lat,Family,ScienceName,CommonName\n");
  output = fs.createWriteStream(outputFilename);
  dataStream.pipe(output);
}).call(this);
