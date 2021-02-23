import $ from 'jquery'

$(`#select-type-of-search`).change(function () {
  const el = $(this)
  const value = el.val()
  const info = $global.searchMessages[value]
  $(`#search-form-input`)
    .attr(`name`, info.name)
    .attr(`placeholder`, info.placeholder)
  el.closest(`form`).attr(`action`, info.action)
})
