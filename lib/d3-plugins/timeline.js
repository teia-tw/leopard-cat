module.exports = function () {
  var setting = {}

  function timeline (data) {
    if (! setting.index) {
      setting.index = setting.datetime
    }
    return data.sort(function (a, b) {
      return setting.datetime(a) - setting.datetime(b)
    }).map(function () {
      return {
        "x": setting.scale(setting.index.apply(null, arguments)),
        "content": setting.content.apply(null, arguments)
      }
    })
  }

  timeline.nodes = timeline

  ;['datetime', 'index', 'scale', 'content'].forEach(function (n) {
    setting[n] = null
    timeline[n] = function () {
      if (arguments.length === 0) {
        return setting[n]
      }
      setting[n] = arguments[0]
      return timeline
    }
  })

  setting.datetime = function (d) {
    if (typeof d.datetime === 'string') {
      return new Date(d.datetime)
    } else if (typeof d.datetime === 'object') {
      return d.datetime
    }
    return null
  }

  setting.content = function (d) {
    if (d.content) {
      return d.content
    } else {
      return d
    }
  }

  return timeline
}
