'use strict'

var d3 = require('d3')
require('./d3-timeline')

function timeline (selection) {
  var width = 30
  var height
  var margin = { top: 0, right: 0, bottom: 0, left: 30 }

  d3.csv('http://cors.io/?u=https://docs.google.com/spreadsheets/d/1J3Sm3MURwI9ZErjcxdxNEkm9Cfactw0Na6KD65NcYcA/pub?output=csv', function (err, data) {
    height = data.length * 120

    var svg = selection.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var timeAxis = svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', height)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)

    var timeScale = d3.scale.linear()
      .domain([-1, data.length])
      .range([0, height])
    var timeline = d3.layout.timeline()
      .scale(timeScale)
      .index(function (d, i) { return i })
      .datetime(function (d) { return new Date(d['日期 ']) })
      .content(function (d) { return '<h3>' + d['日期 '] + '</h3><p>' + ' [' + d['分類（以逗號分隔：開發案, 路殺, 衝突, 友善農耕,石虎研究）'].split(/,\s*/).join('][') + '] ' + '<a href="' + d['資訊連結'] + '" target="_blank">' + d['事件'] + '</a></p><div style="font-size: 12px">' + d['資料來源（e-info或其他媒體）'] + (d['經度（路殺或目擊事件才需登）'] ? ' (' + d['經度（路殺或目擊事件才需登）'] + ',' + d['緯度（路殺或目擊事件才需登）'] + ')' : '') + '</div>'})

    var nodes = timeline.nodes(data)
    var node = svg.selectAll('g.event')
      .data(nodes)
    .enter().append('g')
      .attr('class', 'event')
      .attr('transform', function (d) { return 'translate(0,' + (d.x + 10) + ')' })

    node.append('circle')
      .attr('r', 5)
      .attr('fill', 'black')

    node.each(function (d) {
      selection.append('div')
        .attr('class', 'content')
        .html(d.content)
        .attr('style', 'position: absolute; left: ' + (margin.left + 30) + 'px; top: ' + d.x + 'px;')
    })
  })
}

d3.select('.timeline')
  .call(timeline)
