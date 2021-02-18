import $ from 'jquery'

$(function () {
  const MAX_QUANTITY = 50;
  const QUANTITY_STEP = 10;

  let targetItem = null;

  window.tables = [];

  function getFormattedDiscount(item) {
    const discount = item.discount;
    const lines = [];
    for (let i = discount.values.length - 1; i >= 0; i--) {
      const value = discount.values[i];
      const toValue = discount.values[i - 1];
      const to = toValue && toValue < item.quantity ? toValue : item.quantity;
      if (to < value)
        break;
      const textTo = Math.min(to - 1, item.quantity);

      let fromTo;
      if (value !== textTo + 1)
        fromTo = value + '-' + textTo;
      else
        fromTo = textTo;

      lines.push('<div> <span>buy</span> <span>' + fromTo + '</span> <span>get</span> <span>' + (100 - discount.percents[i] * 100) + '%</span> — ' + formatPrice(item.price.value * discount.percents[i], item.price.currency) + '</span></div>');
    }
    return lines.join('\r\n');
  }

  $('.data-table').each(function (i, element) {
    const el = $(element);
    const table = el
      .DataTable(
        {
          "deferRender": true,
          responsive: {
            breakpoints: [
              {
                name: 'desktop',
                width: Infinity
              },
              {
                name: 'tablet',
                width: 1024
              },
              {
                name: 'fablet',
                width: 768
              },
              {
                name: 'phone',
                width: 400
              }
            ]
          },
          "columnDefs": [
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
              responsivePriority: 8,
              targets: 3,
              visible: false,
            },
            {
              responsivePriority: 5,
              targets: 4
            },
            {
              responsivePriority: 7,
              targets: 5
            },
            {
              responsivePriority: 3,
              targets: 6
            },
            {
              responsivePriority: 1,
              targets: 7
            },
            {
              responsivePriority: 1,
              targets: 8


            }
          ],
          "processing": true,

          "order": [[6, "asc"]],

          "columns": [
            {
              "data": "partnum",
              "orderable": false,
              "render": function (data) {
                if (el.attr('id') === 'REPLACEMENT') {
                  return data;
                }
                return '<a target="_blank" href="' + window.$global.lang_prefix + '/partnum?partnum=' + encodeURIComponent(data) + '" title="' + $global.strings.partnum_description + ' ' + data + '">' + data + '</a>'
              }
            },
            {
              "data": "title",
              "orderable": false

            },
            {
              "data": "manufacturer",
              "orderable": false,
            },
            {
              "data": "store",
              "visible": false,
            },
            {
              "data": "quantity",
              "className": "center--table",
              "render": function (data, type, row) {
                let quantity = parseInt(data, 10);
                if (quantity > MAX_QUANTITY) {
                  quantity = '> ' + MAX_QUANTITY;
                } else if (quantity > QUANTITY_STEP) {
                  let base = parseInt(quantity / QUANTITY_STEP, 10);
                  if (quantity % QUANTITY_STEP === 0) {
                    base--;
                  }
                  quantity = '> ' + base * QUANTITY_STEP;
                }
                return '<div class="d-flex align-items-center">' + quantity + '<div class="fs-7 ms-2 text-muted"> (' + row.unitsOfMeasure + ')</div></div>';
              }
            },
            {
              "data": "deliveryTime",
            },
            {
              "data": "salePrice",
              "render": function (data, type, row) {
                const price = formatPrice(data);
                if (!row.discount) {
                  return price;
                }
                const html = getFormattedDiscount(row);
                if (html.trim().length === 0) {
                  return price;
                }
                return '<span data-toggle="tooltip" data-placement="top" title="' + html + '"></span><p>' + price + '</p>';
              }
            },
            {
              "data": null,
              "orderable": false,
              "className": "text-end",
              "render": function (data, type, row, meta) {
                const result = $global.basket.items[row.offerId];
                let html = `
                    <div class="d-flex justify-content-end"><a class="btn btn-outline-primary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div class="bi bi-cart-plus fs-7"></div></a></div>
                `;
                return html;
              }
            },
            {
              "data": "offerId",
              "visible": false,
              "orderable": false,
            }
          ],
          "paging": false,
          "searching": false,
          "info": false
        });

    const id = el.attr('id');

    $global.resultTables.forEach(function (value) {
      if (id !== value.id)
        return;
      table.rows.add(value.rows);
    });


    el.find('tbody').on('click', 'a.cart-table', function (e) {
      e.preventDefault();
      if (Cart.isProcess())
        return;
      $('.tooltipstered:not(.discount-tooltip)').tooltipster('destroy');

      const data = table.row($(this)
        .parents('tr'))
        .data();
      targetItem = data;

      $(this).tooltipster({
        contentAsHTML: true,
        theme: ['tooltipster-light', 'tooltipster-light-customized'],
        content: tmpl('add_to_cart-popup', {
          row: data,
          item: $global.basket.items[data.offerId],
          max: data.quantity
        }),
        animation: 'grow',
        interactive: true,
        trigger: "custom",
        triggerOpen: {
          mouseenter: true,
          touchstart: true,
          click: true,
        },
        triggerClose: {
          click: true,
          originClick: true,
          // touchleave: true
        },
        arrow: true,
        distance: 0,
        delay: 1000
      }).tooltipster('open');
      setTimeout(updateCurrentPrice, 0);
    });
    window.tables.push(table);
  });

  $('body').on('mouseenter', '.tooltip', function () {
    if (!$(this).hasClass('tooltipstered')) {
      $(this).tooltipster(
        {
          contentAsHTML: true,
          minWidth: 200,
          trigger: "custom",
          triggerOpen: {
            mouseenter: true,
            touchstart: true,
            click: true,
          },
          triggerClose: {
            mouseleave: true,
            originClick: true,
            touchleave: true
          },
          theme: ['tooltipster-noir', 'tooltipster-noir-customized']
        }).tooltipster('show');
    }
  });

  $(document.body).on('click', 'button.cart-delete', function () {
    $('.tooltipstered').tooltipster('hide');
    Cart.removeItem(targetItem.offerId);
  });

  $(document.body).on('click', 'button.cart-add', function () {
    $('.tooltipstered').tooltipster('hide');

    Cart.addItem(targetItem.offerId, $('#modal-tooltip__input').val())
  });

  function getFraction(value) {
    const discount = targetItem.discount;
    if (discount) {
      for (let i = 0; i < discount.values.length; i++) {
        if (value >= discount.values[i])
          return {i: i, percent: discount.percents[i], next: i - 1};
      }
    }
    return {i: -1, percent: 1, next: discount ? discount.percents.length - 1 : -1};
  }

  function formatPrice(price, currency) {
    if (typeof price === 'number') {
      return parseFloat(price.toFixed(2)) + ' ' + currency;
    }

    return parseFloat(price.value.toFixed(2)) + ' ' + price.currency;
  }

  function updateCurrentPrice() {
    const priceEl = $('#modal-current_price');
    const onePriceEl = $('#modal-one_price');
    const count = parseInt($('#modal-tooltip__input').val(), 10);

    const fraction = getFraction(count);
    const nextBuyEl = $('.modal-next_buy');
    if (fraction.next >= 0) {
      const next = Math.min(targetItem.discount.values[fraction.next], targetItem.quantity);
      if (next !== count) {
        $('#modal-next_buy_count').text(Math.min(targetItem.discount.values[fraction.next], targetItem.quantity));
        $('#modal-next_buy_price').text(formatPrice(targetItem.price.value * targetItem.discount.percents[fraction.next], targetItem.price.currency));
        nextBuyEl.show();
      } else {
        nextBuyEl.hide();
      }
    } else {
      nextBuyEl.hide();
    }
    const originalPrice = targetItem.discount ? targetItem.price.value : targetItem.salePrice.value;
    const onePrice = (originalPrice * fraction.percent);
    const price = onePrice * count;

    priceEl.text(formatPrice(price, targetItem.price.currency));
    onePriceEl.text(formatPrice(onePrice, targetItem.price.currency));
  }

  $(document.body).on('click', 'button.minus-add-to-cart', function () {
    const input = $('#modal-tooltip__input');
    let val = parseInt(input.val()) - 1;
    if (val < 1)
      val = 1;
    input.val(val);
    updateCurrentPrice();
  });

  $(document.body).on('click', 'button.plus-add-to-cart', function () {
    const input = $('#modal-tooltip__input');
    let val = parseInt(input.val()) + 1;
    if (val > targetItem.quantity)
      val = targetItem.quantity;
    input.val(val);
    updateCurrentPrice();
  });

  $(document.body).on('change', '#modal-tooltip__input', function () {
    const input = $(this);
    if (input.val() > targetItem.quantity)
      input.val(targetItem.quantity);
    updateCurrentPrice();
  });


  $(document).on("cart.data", function (event, data) {
    Notify(data.message);
    $global.basket = data.basket;

    tables.forEach(function (t) {
      t.rows()
        .invalidate()
    });

    const count = Object.keys($global.basket.items).length;
    const counter = $('.cart-counter');
    if (count <= 0)
      counter.hide();
    else
      counter.show().text(Object.keys($global.basket.items).length);
  });

  function updateBrandNameFilter() {
    const filters = [];
    $('[name="brand-name"]')
      .each(function () {
        if (this.checked) {
          filters.push($.fn.dataTable.util.escapeRegex($(this)
            .val()
            .toLowerCase()));
        }
      });
    tables.forEach(function (t) {
      t.column(2)
        .search('^' + filters.join("|") + '$', true, false)
        .draw();
    });
  }

  function updateSortBy() {
    $('[name="sort-by"]')
      .each(function (i, filter) {
        const filterEl = $(filter);
        if (this.checked) {
          tables.forEach(function (t) {
            t.order([filterEl
              .data("column"), filterEl
              .data("type")])
              .draw();
          });
        }
      });
  }

  function updateTypeParts(slide) {
    let allDisabled = true;
    const noDataMessage = $("#noDataMessage");

    $('[name="type-of-parts"]').each(function () {
      const element = $($(this)
        .val())
        .parent()
        .parent();
      if (this.checked) {
        allDisabled = false;
        if (!element.is(':visible')) {
          slide ? element.slideDown() : element.show();
        }
      } else {
        if (element.is(':visible')) {
          slide ? element.slideUp() : element.hide();
        }
      }
    });
    if (allDisabled) {
      if (!noDataMessage.is(':visible')) {
        slide ? noDataMessage.slideDown() : noDataMessage.show();
      }
    } else {
      if (noDataMessage.is(':visible')) {
        slide ? noDataMessage.slideUp() : noDataMessage.hide();
      }
    }
  }

  function updateFilters() {
    updateTypeParts(true);
    updateBrandNameFilter();
    updateSortBy();
  }

  updateFilters(false);

  /*setInterval(function () {
    updateTypeParts(false);
    //updateBrandNameFilter();
  }, 2000);*/

  $('[name="sort-by"]')
    .change(function () {
      updateSortBy();
    });

  $('#reset-filters')
    .click(function (e) {
      e.preventDefault();
      $(this)
        .closest('form')
        .get(0)
        .reset();
      updateFilters(true);
    });


  $('.filter-form').on('change', function () {
    updateTypeParts(true);
    updateBrandNameFilter();
  });

  updateTypeParts();
});
