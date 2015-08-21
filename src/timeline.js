'use strict'

var debug = require('debug')('timeline')

var d3 = require('d3')
d3.layout.timeline = require('../lib/d3-plugins/timeline')
var $ = require('jquery')

var componentName = 'timeline'

var store = require('./store')
var action = require('./action')

module.exports = function (p) {

  var props = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    width: 0,
    height: 0,
    focused: 0
  }, p || {})

  var div
  var tops = []

  // hack
  $(window).off('scroll')
  $(window).on('scroll', debounce(handleScroll))

  function debounce (func) {
    var wait = 10
    var count
    return function () {
      if (count) { clearTimeout(count) }
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
      action.run('focused', { value: i, date: tops[i].date, tags: tops[i].tags })
    }
  }

  function eventHTML (d) {
    return '<h3>' + d.date + '</h3><p>' + d.title + '<a href="' + d.link + '" target="_blank">&raquo;</a></p>'
  }

  function drawTimeline (data) {
    debug('drawTimeline with %o', data)

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
        date: new Date(data[i].date),
        top: $(e).offset().top,
        tags: data[i].tags
      })
    })
    if (events[0].length > 0) {
      var lastEvent = $(events[0][events[0].length - 1])
      var timelineHeight = lastEvent.offset().top + lastEvent.outerHeight()
      if (props.height !== timelineHeight) {
        action.run('setHeight', timelineHeight)
      }
    }
  }

  function draw (selection) {
    debug('draw with %o', props)

    div = selection.selectAll('div.' + componentName)
      .data([0])
      .style('margin-top', props.margin.top + 'px')
      .style('margin-right', props.margin.right + 'px')
      .style('margin-bottom', props.margin.bottom + 'px')
      .style('margin-left', props.margin.left + 'px')
      .style('width', props.width + 'px')
    div.enter().append('div')
      .classed(componentName, true)
      .style('margin-top', props.margin.top + 'px')
      .style('margin-right', props.margin.right + 'px')
      .style('margin-bottom', props.margin.bottom + 'px')
      .style('margin-left', props.margin.left + 'px')
      .style('width', props.width + 'px')
    div.exit().remove()

    drawTimeline(store.get('timeline') || [])
  }

  return draw
}
