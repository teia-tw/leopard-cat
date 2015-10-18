
var debug = require('debug')('leopard-cat:timelineStore')
var dispatcher = require('./dispatcher')
var uiStore = require('./uiStore')
var d3 = require('d3')
var jquery = require('jquery')
var debounce = require('debounce')
var dispatch = d3.dispatch('loading', 'ready')
var timelineStore = {
  _data: [],
  _focused: undefined,
  _focusOffsetTop: undefined
}
d3.rebind(timelineStore, dispatch, 'on')
module.exports = timelineStore

dispatcher.on('action.timeline', function (action) {
  debug(action)
  if (action.type === 'load') {
    timelineStore._focusOffsetTop = jquery(window).height() / 4
    d3.csv('data/timeline.csv')
      .on('progress', function () {
        dispatch.loading(action)
      })
      .get(function (err, data) {
        if (err) {
          debug(err)
          return
        }
        timelineStore._data = data.map(function (d) {
          return {
            date: d['日期 '],
            tags: d['分類（以逗號分隔：開發案, 路殺, 衝突, 友善農耕,石虎研究）'].split(/,\s*/),
            link: d['資訊連結'],
            title: d['事件'],
            ref: d['資料來源（e-info或其他媒體）'],
            location: (d['經度（路殺或目擊事件才需登）'] ? [d['經度（路殺或目擊事件才需登）'], d['緯度（路殺或目擊事件才需登）']] : undefined)
          }
        })
        dispatch.ready(action)
      })
  } else if (action.type === 'saveOffset') {
    timelineStore._data[action.payload.i].offsetTop = action.payload.offsetTop
    // fires nothing
  } else if (action.type === 'uiResize') {
    timelineStore._data = timelineStore._data.map(function (d) {
      d.offsetTop = undefined
      return d
    })
    timelineStore._focusOffsetTop = jquery(window).height() / 4
  } else if (action.type === 'uiScroll') {
    // poor man's waitFor()
    debounce(function () {
      if (timelineStore._focused === undefined) {
        timelineStore._focused = 0
        timelineStore._data[timelineStore._focused].focused = true
        dispatch.ready(action)
      } else {
        var i = timelineStore._focused
        while (timelineStore._data[i].offsetTop < uiStore.scrollTop + timelineStore._focusOffsetTop) {
          i++
        }
        while (i > 0 && timelineStore._data[i - 1].offsetTop > uiStore.scrollTop + timelineStore._focusOffsetTop) {
          i--
        }
        if (i !== timelineStore._focused) {
          timelineStore._data[timelineStore._focused].focused = undefined
          timelineStore._focused = i
          timelineStore._data[timelineStore._focused].focused = true
          dispatch.ready(action)
        }
      }
    }, 16)()
  }
})

timelineStore.allTimeline = function () {
  return timelineStore._data
}
