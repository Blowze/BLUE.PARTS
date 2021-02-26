import $ from 'jquery'

let inProcess = 0;

function sendCartRequest(method, data, callback) {
  if (!data)
    data = {};
  inProcess++;
  $.ajax({
    type: "POST",
    url: window.$global.lang_prefix + "/@basket" + (method || ''),
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      inProcess--;
      if (data)
        $(document).trigger("cart.data", data);
      if (callback)
        callback(null, data);
    },
    failure: function (err) {
      inProcess--;
      if (callback)
        callback(err, null);
    }
  });
}

function Cart() {
}

Cart.addItem = function (id, count, callback) {
  sendCartRequest('/add', {
    id: id,
    count: count
  }, callback);
};


Cart.removeItem = function (id, callback) {
  sendCartRequest('/remove', {
    id: id
  }, callback);
};

Cart.getItems = function (callback) {
  sendCartRequest(null, null, callback);
};

Cart.isProcess = function () {
  return inProcess > 0;
};

export default Cart
