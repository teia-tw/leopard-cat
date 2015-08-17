'use strict'

require('debug').enable('*')
var debug = require('debug')('timeline')

var d3 = require('d3')
d3.layout.timeline = require('../lib/d3-plugins/timeline')

var componentName = 'timeline'

var store = require('./store')

module.exports = function (p) {

  var props = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 30 },
    width: 0,
    height: 0
  }, p || {})

  function eventHTML (d) {
    return '<h3>' + d['日期 '] + '</h3><p>' + ' [' + d['分類（以逗號分隔：開發案, 路殺, 衝突, 友善農耕,石虎研究）'].split(/,\s*/).join('][') + '] ' + '<a href="' + d['資訊連結'] + '" target="_blank">' + d['事件'] + '</a></p><div style="font-size: 12px">' + d['資料來源（e-info或其他媒體）'] + (d['經度（路殺或目擊事件才需登）'] ? ' (' + d['經度（路殺或目擊事件才需登）'] + ',' + d['緯度（路殺或目擊事件才需登）'] + ')' : '') + '</div>'
  }

  function draw (selection) {

    store.on('timelineUpdate', function (data) {
      debug('drawTimeline')

      var div = selection.selectAll('div.' + componentName)
        .data([0])
        .style('margin-top', props.margin.top + 'px')
        .style('margin-right', props.margin.right + 'px')
        .style('margin-bottom', props.margin.bottom + 'px')
        .style('margin-left', props.margin.left + 'px')
      div.enter().append('div')
        .classed(componentName, true)
        .style('margin-top', props.margin.top + 'px')
        .style('margin-right', props.margin.right + 'px')
        .style('margin-bottom', props.margin.bottom + 'px')
        .style('margin-left', props.margin.left + 'px')
      div.exit().remove()

      var events = div.selectAll('div.events')
        .data(data)
        .html(eventHTML)
      events.enter().append('div')
        .classed('events', true)
        .html(eventHTML)
      events.exit().remove()
    })
  }

  return draw
}
