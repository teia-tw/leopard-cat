'use strict'

var debug = require('debug')('leopard-cat:timeline')
var dispatcher = require('./dispatcher')
var jquery = require('jquery')

var componentName = 'timeline'

module.exports = function (s) {
  var settings = Object.assign({
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }, s || {})

  function eventHTML (d) {
    return '<h3>' + d.date + '</h3><p>' + d.title + '<a href="' + d.link + '" target="_blank">&raquo;</a></p>'
  }

  function handleOffsets (d, i) {
    if (d.offsetTop === undefined) {
      dispatcher.action({
        type: 'saveOffset',
        payload: {
          i: i,
          offsetTop: jquery(this).offset().top
        }
      })
    }
  }

  function drawTimeline (selection) {
    var events = selection.selectAll('div.event')
      .classed('focused', function (d) { return d.focused })
      .data(settings.timeline.allTimeline())
      .html(eventHTML)
      .each(handleOffsets)
    events.enter().append('div')
      .classed('event', true)
      .classed('focused', function (d) { return d.focused })
      .html(eventHTML)
      .each(handleOffsets)
    events.exit().remove()
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

    settings.containerOffset = selection[0][0].offsetTop

    drawTimeline(container)
  }

  return draw
}
