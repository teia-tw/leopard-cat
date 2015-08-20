'use strict'

var debug = require('debug')('tagsline')

var componentName = 'tagsline'

module.exports = function (p) {
  var props = Object.assign({
  }, p || {})

  function draw (selection) {
    debug('draw')

    var div = selection.selectAll('div.' + componentName)
      .data([0])
      .classed(componentName, true)
      .style('width', props.width + 'px')
    div.enter().append('div')
      .classed(componentName, true)
      .style('width', props.width + 'px')
    div.exit().remove()

    div.text('hey')
  }

  return draw
}
