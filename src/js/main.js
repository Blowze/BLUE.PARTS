import $ from 'jquery'
import {
  Tooltip
} from '../../node_modules/bootstrap/dist/js/bootstrap.esm'
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

})
