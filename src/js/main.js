import $ from 'jquery'
import { Tooltip } from '../../node_modules/bootstrap/dist/js/bootstrap.esm'
require(`@popperjs/core`)
require(`bootstrap`)
require(`datatables`)
require(`datatables.net-responsive`)
require(`../js/dataTables.bootstrap5.min`)


$(document).ready(() => {
    // eslint-disable-next-line no-console
    // $(`[data-toggle="tooltip"]`).tooltip();
    Array.from(document.querySelectorAll(`[data-bs-toggle="tooltip"]`)).forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
    $(`#myTable`).DataTable({
        info: false,
        autoWidth: true,
        lengthChange: false,
        responsive: true
    })
    $(`#myTableSearch`).DataTable({
        info: false,
        autoWidth: true,
        lengthChange: false,
        responsive: true,
        searching: false
    })
})
