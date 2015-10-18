
var debug = require('debug')('leopard-cat:timelineStore')
var dispatcher = require('./dispatcher')
var d3 = require('d3')
var dispatch = d3.dispatch('loading', 'ready')
var timelineStore = {
  _data: []
}
d3.rebind(timelineStore, dispatch, 'on')
module.exports = timelineStore

dispatcher.on('action.timeline', function (action) {
  debug(action)
  if (action.type === 'load') {
    d3.csv('data/timeline.csv')
      .on('progress', function () {
        dispatch.loading()
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
        dispatch.ready()
      })
  }
})

timelineStore.allTimeline = function () {
  return timelineStore._data
}
