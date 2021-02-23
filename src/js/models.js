import $ from 'jquery'

$(function () {
  function renderGarageModel(data, type, full) {
    if (!data) {
      return ``
    }
    return `<a class="to-order" href="` + window.$global.lang_prefix + `/garagemodel?` + $.param({
      manufacturer: full.manufacturer,
      modelId: full.id
    }) + `">` + data + `</a>`
  }

  var table = $(`#table-models`).DataTable({
    lengthChange: false,
    hideEmptyCols: true,
    dom: `lfBrtip`,
    buttons: [],
    ajax: {
      url: $global.lang_prefix + `/getmodels`,
      dataSrc: ``,
      data: {
        make: $global.manufacturer,
        year: $global.year,
        model: $global.model
      }
    },
    columns: [
      { data: `modelCode` },
      {
        data: `frameNo`,
        render: renderGarageModel
      },
      { data: `issueYear` },
      {
        data: `engineType`,
        render: renderGarageModel
      },
      { data: `engineNumRange` },
      { data: `transmissionType` },
      { data: `bodyType` },
      { data: `doorsNumber` },
      { data: `generation` },
      { data: `grade` },
      { data: `country` }
    ],
    initComplete() {
      $.fn.DataTable.RegionButtons(table, 10)
    }
  })
})
