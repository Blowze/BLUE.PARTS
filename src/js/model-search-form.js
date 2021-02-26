import $ from 'jquery'
require(`selectize`)

$(function () {
  const manufacturerEl = $(`#model-search-manufacturer`)
  if (!manufacturerEl.length) {
    return
  }

  const manufacturer = manufacturerEl.selectize({
    sortField: `text`
  })[0].selectize
  manufacturer.clear()

  const years = $(`#model-search-years`).selectize({
    sortField: {
      field: `text`,
      direction: `desc`
    }
  })[0].selectize

  const models = $(`#model-search-models`).selectize({
    sortField: `text`
  })[0].selectize

  const searchModel = $(`#search-model`)

  manufacturer.on(`change`, function (value) {
    searchModel.prop(`disabled`, true)
    years.clearOptions()
    years.disable()
    if ($global.years.hasOwnProperty(value)) {
      years.load(function (cb) {
        cb($global.years[value].map(function (value) {
          return { value, text: value }
        }))
        years.enable()
        years.focus()
      })
    }
  })

  years.on(`change`, function (value) {
    searchModel.prop(`disabled`, true)
    models.clearOptions()
    models.disable()

    if (value !== ``) {
      $.ajax({
        type: `POST`,
        url: `/getmodels`,
        data: { manufacturer: manufacturer.getValue(), year: value },
        success(data) {
          if ($.isArray(data)) {
            models.load(function (cb) {
              cb(data.map(function (val) {
                return { value: val.title, text: val.title }
              }))
              models.enable()
              models.focus()
            })
          }
        },
        error(e) {
          console.warn(`Can't load models:`, e)
          models.prop(`disabled`, true)
        }
      })
    }
  })

  models.on(`change`, function (value) {
    if (value !== ``) {
      searchModel.prop(`disabled`, false).focus()
    } else {
      searchModel.prop(`disabled`, true)
    }
  })
})
