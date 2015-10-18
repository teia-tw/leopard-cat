'use strict'

var debug = require('debug')('leopard-cat:timeline')
var dispatcher = require('./dispatcher')

var $ = require('jquery')

var componentName = 'timeline'

module.exports = function (s) {
  var settings = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    scrollSpace: 70,
  }, s || {})

  var tops = []

  function handleScroll () {
    if (tops.length === 0) return
    var i = settings.focusedEvent ? settings.focusedEvent.value : 0
    var scroll = $(window).scrollTop() + settings.scrollSpace
    while (i >= tops.length || (i >= 0 && tops[i].top > scroll)) i--
    while (i < 0 || tops[i].top <= scroll) i++
    if (undefined === settings.focusedEvent || i !== settings.focusedEvent.value) {
      dispatcher.action({
        type: 'focuseEvent',
        payload: {
          value: i,
          date: tops[i].date,
          tags: tops[i].tags
        }
      })
    }
  }

  function eventHTML (d) {
    return '<h3>' + d.date + '</h3><p>' + d.title + '<a href="' + d.link + '" target="_blank">&raquo;</a></p>'
  }

  function drawTimeline (selection) {
    var events = selection.selectAll('div.event')
      .data(settings.events)
      .classed('focused', function (d, i) { return settings.focusedEvent && i === settings.focusedEvent.value })
      .html(eventHTML)
    events.enter().append('div')
      .classed('event', true)
      .classed('focused', function (d, i) { return settings.focusedEvent && i === settings.focusedEvent.value })
      .html(eventHTML)
    events.exit().remove()

    tops = []
    events[0].forEach(function (e, i) {
      tops.push({
        date: new Date(settings.events[i].date),
        top: $(e).offset().top,
        tags: settings.events[i].tags
      })
    })
    if (events[0].length > 0) {
      var lastEvent = $(events[0][events[0].length - 1])
      var timelineHeight = lastEvent.offset().top + lastEvent.outerHeight()
      if (settings.height !== timelineHeight) {
        dispatcher.action({
          type: 'setHeight',
          payload: timelineHeight
        })
      }
    }
  }

  function draw (selection) {
    debug('draw with %o', settings)

    var container = selection.selectAll('div.' + componentName)
      .data([0])
      .style({
        'margin-top': settings.margin.top + 'px',
        'margin-right': settings.margin.right + 'px',
        'margin-bottom': settings.margin.bottom + 'px',
        'margin-left': settings.margin.left + 'px',
        'width': settings.ui.width / 2 + 'px'
      })
    container.enter().append('div')
      .classed(componentName, true)
      .style({
        'margin-top': settings.margin.top + 'px',
        'margin-right': settings.margin.right + 'px',
        'margin-bottom': settings.margin.bottom + 'px',
        'margin-left': settings.margin.left + 'px',
        'width': settings.ui.width / 2 + 'px'
      })
    container.exit().remove()

    drawTimeline(container)
  }

  return draw
}
