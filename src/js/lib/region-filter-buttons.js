import $ from 'jquery'

$.fn.dataTable.RegionButtons = function (table, regionColumn) {
	var jq = $(table.table().container());

	table.button().add(null, {
		text: 'ALL',
		className: 'dt-region-button dt-region-button--modify dt-region-all-button toggled btn btn-outline-primary btn-sm mt-2 mb-3 mb-md-0',
		action: function (e, dt, btn) {
			if (!btn.hasClass('toggled')) {
				applySearch(dt, regionColumn, '');
				jq.find('.dt-region-button').removeClass('toggled');
				btn.addClass('toggled');
			}
		}
	});

	var regions = [];
	table.column(regionColumn).data().each(function (region) {
		if (region !== '' && regions.indexOf(region) === -1)
			regions.push(region)
	});

	regions.forEach(function (region) {
		if (!region) {
			return;
		}
		table.button().add(null, {
			text: region.toUpperCase(),
			className: 'dt-region-button dt-region-button--modify btn btn-outline-primary btn-sm mt-2 mb-3 mb-md-0',
			action: function (e, dt, btn) {
				if (btn.hasClass('toggled')) {
					dt.buttons('.dt-region-all-button').trigger();
				} else {
					applySearch(dt, regionColumn, region);
					jq.find('.dt-region-button').removeClass('toggled');
					btn.addClass('toggled');
				}
			}
		});
	});


	var inTrigger = false;

	function applySearch(dt, column, filter) {
		inTrigger = true;
		dt
			.column(column)
			.search(filter)
			.draw();
		inTrigger = false;
	}

	table.on('search.dt', function () {
		if (table.search() !== '' || inTrigger)
			return;
		inTrigger = true;
		table.buttons('.dt-region-all-button').trigger();
		inTrigger = false;
	});
};

$.fn.DataTable.RegionButtons = $.fn.dataTable.RegionButtons;
