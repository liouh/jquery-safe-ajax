/**
 *  jQuery.safeAjax
 *
 *  $.ajax wrapper that HTML escapes data before passing it to the success function.
 *
 *  Options and usage are identical to $.ajax (https://api.jquery.com/jQuery.ajax/).
 */

$.safeAjax = function(options) {

	// HTML escape code from mustache.js
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};
	function escapeHtml(string) {
		return String(string).replace(/[&<>"'\/]/g, function (s) {
			return entityMap[s];
		});
	}

	// recursively HTML escape data
	function htmlEscapeData(data) {
		if(typeof data === 'string') {
			return escapeHtml(data);
		}
		else if(typeof data === 'object') {
			for(var i in data) {
				var val = data[i];
				data[i] = htmlEscapeData(val);
			}
			return data;
		}
		return data;
	}
	
	// override AJAX success callback
	var success = options.success;
	options.success = function(data, textStatus, jqXHR) {
		data = htmlEscapeData(data);
		if(success) {
			success(data, textStatus, jqXHR);
		}
	};
	return $.ajax(options);
};
