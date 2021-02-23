import $ from 'jquery'
import {
  Tooltip
} from '../../node_modules/bootstrap/dist/js/bootstrap.esm'
import Inputmask from 'inputmask'
require(`@popperjs/core`)
require(`bootstrap`)
require(`datatables.net`)
require(`../../node_modules/datatables.net-buttons/js/buttons.print`)
require(`datatables.net-buttons`)
require(`datatables.net-responsive`)
require(`./lib/dataTables.bootstrap5.min`)
require(`./model-search-form`)
require(`./content--result-parts`)
require(`./inner-search`)

$(document).ready(() => {

  // $(`[data-toggle=`tooltip`]`).tooltip();
  Array.from(document.querySelectorAll(`[data-bs-toggle='tooltip']`)).forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))

  $(`#modelsTable`).DataTable({
    info: false,
    hideEmptyCols: true,
    dom: `lfBrtip`,
    autoWidth: true,
    lengthChange: false,
    buttons: [
      {
        text: `ALL`,
        className: `btn btn-outline-primary btn-sm mt-2 mb-3 mb-md-0`
      },
      {
        text: `NZ`,
        className: `btn btn-outline-primary btn-sm mt-2 mb-3 mb-md-0`
      },
      {
        text: `MY`,
        className: `btn btn-outline-primary btn-sm mt-2 mb-3 mb-md-0`
      }
    ],
    responsive: true
  })

  $(`#garagemodelTable`).DataTable({
    info: false,
    autoWidth: true,
    lengthChange: false,
    responsive: true,
    searching: false
  })

  $.fn.dataTable.Api.register(`page.jumpToData()`, function (data, column) {
    const pos = this.column(column, { order: `current` }).data().indexOf(data)
    if (pos >= 0) {
      const page = Math.floor(pos / this.page.info().length)
      this.page(page).draw(false)
    }
    return this
  })

  const tableSchema = $(`#schemaTable`).DataTable({
    info: false,
    pagination: false,
    lengthChange: false,
    responsive: true,
    searching: false
  })
  $(`#orderTable`).DataTable({
    info: false,
    autoWidth: true,
    pagination: false,
    lengthChange: false,
    responsive: true,
    searching: false
  })
  $(`#partpriceTable`).DataTable({
    deferRender: true,
    responsive: {
      breakpoints: [
        {
          name: `desktop`,
          width: Infinity
        },
        {
          name: `tablet`,
          width: 1024
        },
        {
          name: `fablet`,
          width: 768
        },
        {
          name: `phone`,
          width: 400
        }
      ]
    },
    columnDefs: [
      {
        responsivePriority: 1,
        targets: 0
      },
      {
        responsivePriority: 4,
        targets: 1
      },
      {
        responsivePriority: 6,
        targets: 2
      },
      {
        responsivePriority: 5,
        targets: 3
      },
      {
        responsivePriority: 7,
        targets: 4
      },
      {
        responsivePriority: 3,
        targets: 5
      },
      {
        responsivePriority: 1,
        targets: 6
      },
    ],
    processing: true,
    paging: false,
    searching: false,
    info: false
  })

  Inputmask(`99-999-99`).mask(`.phone-mask`)
  $(`.card-delivery`).click(function () {
    $(`.card-delivery`).removeClass(`border-primary`)
    $(this).addClass(`border-primary`)
  })
  $(`.card-total__price`).click(function () {
    $(this).toggleClass(`card-total_open`)
  })
  const PADDING = 5
  const image = document.querySelector(`.unit-schema-picture > img`)
  const areas = $(`#partList`).find(`> div`).toArray()
  const coords = []
  function getElementPosition(elem) {
    const box = elem.getBoundingClientRect()
    const body = document.body
    const docElem = document.documentElement
    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
    const clientTop = docElem.clientTop || body.clientTop || 0
    const clientLeft = docElem.clientLeft || body.clientLeft || 0
    const top = box.top + scrollTop - clientTop
    const left = box.left + scrollLeft - clientLeft
    return {
      top: Math.round(top), left: Math.round(left)
    }
  }
  function coordsToObject(coordsObj) {
    const rawCoords = coordsObj.replace(/ *, */g, `,`).replace(/ +/g, `,`).split(`,`)
    return {
      minX: parseInt(rawCoords[0]),
      minY: parseInt(rawCoords[1]),
      maxX: parseInt(rawCoords[2]),
      maxY: parseInt(rawCoords[3])
    }
  }
  function scaleCoordsObject(coordsObj) {
    const xScaleFactor = image.offsetWidth / image.naturalWidth
    const yScaleFactor = image.offsetHeight / image.naturalHeight
    return {
      minX: coordsObj.minX * xScaleFactor,
      minY: coordsObj.minY * yScaleFactor,
      maxX: coordsObj.maxX * xScaleFactor,
      maxY: coordsObj.maxY * yScaleFactor
    }
  }
  function updateImageMap() {
    const imagePos = getElementPosition(image)
    areas.forEach(function (value, i) {
      const scaledCoords = scaleCoordsObject(coords[i])
      value.style.top = imagePos.top + scaledCoords.minY - PADDING / 2 + `px`
      value.style.left = imagePos.left + scaledCoords.minX - PADDING / 2 + `px`
      value.style.width = scaledCoords.maxX - scaledCoords.minX + PADDING + `px`
      value.style.height = scaledCoords.maxY - scaledCoords.minY + PADDING + `px`
    })
  }
  function initializeMap() {
    $(window).on(`resize scroll`, updateImageMap)
    setInterval(updateImageMap, 600)
    updateImageMap()
  }
  function select(element) {
    // $('.tooltipstered').tooltipster('destroy')
    const target = $(element).data(`target`).toString()
    $(`[data-target="` + target + `"]`).addClass(`hover`)
    tableSchema.page.jumpToData(target, 1)
    const row = tableSchema.row(function (i, data) {
      return data[1] === target
    })
    $(row.node()).addClass(`selected__12`)
    $(element).find(`.dropdown-menu`).addClass(`show`)
  }
  if ($(`#schemaTable`).length > 0) {
    areas.forEach(function (value, i) {
      coords[i] = coordsToObject(value.getAttribute(`data-coords`))
    })
    if (document.readyState === `complete`) {
      initializeMap()
    } else {
      $(window).on(`load`, function () {
        initializeMap()
      })
    }
    const defaultTarget = false
    $(`.unit-schema-part`).on(`mouseenter tap`, function () {
      select(this)
    }).on(`mouseleave`, function () {
      if (this === defaultTarget) {
        return
      }
      $(`[data-target="` + $(this).data(`target`) + `"]`).removeClass(`hover`)
      $(tableSchema.rows().nodes()).removeClass(`selected__12`)
      $(this).find(`.dropdown-menu`).removeClass(`show`)
    })
    const tableElement = $(`#schemaTable`)
    tableElement.find(`tbody`)
      .on(`mouseenter`, `tr`, function () {
        $(`[data-target="` + tableSchema.row(this).data()[1] + `"]`).addClass(`hover`)
      })
      .on(`mouseleave`, `tr`, function () {
        $(`[data-target="` + tableSchema.row(this).data()[1] + `"]`).removeClass(`hover`)
        $(tableSchema.rows().nodes()).removeClass(`selected__12`)
      })
  }

})

