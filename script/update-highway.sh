#!/bin/bash

BBOX="24.36, 120.63, 24.62, 120.84"

cat <<END | query-overpass | simplify-geojson -t 0.01 > data/highway.geojson
[out:json][timeout:25];
(
  way["highway"="motorway"](${BBOX});
  way["construction"="motorway"](${BBOX});
  way["highway"="trunk"](${BBOX});
  way["construction"="trunk"](${BBOX});
  way["highway"="primary"](${BBOX});
  way["construction"="primary"](${BBOX});
);
out body;
>;
out skel qt;
END

topojson -o data/highway.topo.json -- data/highway.geojson
