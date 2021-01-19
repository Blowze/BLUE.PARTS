import $ from 'jquery'
import {
  Tooltip
} from '../../node_modules/bootstrap/dist/js/bootstrap.esm'
import Inputmask from "inputmask"
require(`@popperjs/core`)
require(`bootstrap`)
require(`datatables`)
require(`datatables.net-responsive`)
require(`./lib/dataTables.bootstrap5.min`)


$(document).ready(() => {
  // $(`[data-toggle="tooltip"]`).tooltip();
  Array.from(document.querySelectorAll(`[data-bs-toggle="tooltip"]`)).forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
  $(`#modelsTable`).DataTable({
    info: false,
    autoWidth: true,
    lengthChange: false,
    responsive: true
  })
  $(`#garagemodelTable`).DataTable({
    info: false,
    autoWidth: true,
    lengthChange: false,
    responsive: true,
    searching: false
  })
  $(`#schemaTable`).DataTable({
    info: false,
    autoWidth: true,
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
    responsive: true,
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
})
