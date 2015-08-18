'use strict'

require('debug').enable('*')
var debug = require('debug')('timeline')

var d3 = require('d3')
d3.layout.timeline = require('../lib/d3-plugins/timeline')
var $ = require('jquery')

var componentName = 'timeline'

var store = require('./store')
var action = require('./action')

module.exports = function (p) {

  var props = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 30 },
    width: 0,
    height: 0,
    focused: 0
  }, p || {})

  var div
  var tops = []

  // hack
  $(window).off('scroll')
  $(window).on('scroll', debounce(handleScroll))

  store.on('timelineUpdate', drawTimeline)

  function debounce (func) {
    var wait = 10
    var count
    return function () {
      if (count) { debug(count); clearTimeout(count) }
      count = setTimeout(func, wait)
    }
  }

  function handleScroll () {

    if (tops.length === 0) return
    var i = props.focused
    var scroll = $(window).scrollTop()
    while (i >= tops.length || (i >= 0 && tops[i].top > scroll)) i--
    while (i < 0 || tops[i].top <= scroll) i++
    if (i !== props.focused) {
      debug('%d <=> %d', i, props.focused)
      action.run('focused', { value: i })
    }
  }

  function eventHTML (d) {
    return '<h3>' + d['日期 '] + '</h3><p>' + ' [' + d['分類（以逗號分隔：開發案, 路殺, 衝突, 友善農耕,石虎研究）'].split(/,\s*/).join('][') + '] ' + '<a href="' + d['資訊連結'] + '" target="_blank">' + d['事件'] + '</a></p><div style="font-size: 12px">' + d['資料來源（e-info或其他媒體）'] + (d['經度（路殺或目擊事件才需登）'] ? ' (' + d['經度（路殺或目擊事件才需登）'] + ',' + d['緯度（路殺或目擊事件才需登）'] + ')' : '') + '</div>'
  }

  function drawTimeline (data) {
    debug('drawTimeline')

    var events = div.selectAll('div.event')
      .data(data)
      .classed('focused', function (d, i) { return i === props.focused })
      .html(eventHTML)
    events.enter().append('div')
      .classed('event', true)
      .classed('focused', function (d, i) { return i === props.focused })
      .html(eventHTML)
    events.exit().remove()

    tops = []
    events[0].forEach(function (e, i) {
      tops.push({
        date: data[i]['日期 '],
        top: $(e).offset().top
      })
    })
  }

  function draw (selection) {
    debug('draw with %o', props)

    div = selection.selectAll('div.' + componentName)
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

    store.get('timeline', drawTimeline)
  }

  return draw
}
