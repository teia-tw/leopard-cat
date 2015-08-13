'use strict'

require('debug').enable('*')
var debug = require('debug')('timeline')

var d3 = require('d3')
d3.layout.timeline = require('./d3-timeline')

var store = require('./store')

function timeline (name, p) {
  var state = {
    width: 30,
    height: undefined
  }
  var props = Object.assign(p || {}, {
    margin: { top: 0, right: 0, bottom: 0, left: 30 }
  })

  function draw (selection) {
    store.on('timelineUpdate', function (data) {
      state.height = data.length * 120

      var svg = selection.append('svg')
        .attr('width', state.width + props.margin.left + props.margin.right)
        .attr('height', state.height + props.margin.top + props.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')

      var timeAxis = svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', state.height)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)

      var timeScale = d3.scale.linear()
        .domain([-1, data.length])
        .range([0, state.height])

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
          .attr('style', 'position: absolute; left: ' + (props.margin.left + 30) + 'px; top: ' + d.x + 'px;')
      })
    })
  }

  return draw
}

d3.select('.timeline')
  .call(timeline('timeline'))
