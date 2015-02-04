var helper_utils = require("punch").Utils.Helper;

var getDateValue = function(text){
	return String(text).match(/^\d+$/) ? parseInt(text, 10) : text;
};

var block_helpers = {
	long_date: function() {
		return helper_utils.checkArgs(arguments, function(text) {
			if(!text) {
				return "";
			}

			var published_date = new Date( getDateValue(text) );
			var month_names = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

			var f_date = (published_date.getDate() < 10) ? ("0" + published_date.getDate()) : published_date.getDate();
			var f_month = month_names[published_date.getMonth()];
			var f_year = published_date.getFullYear();

			return f_date + " " + f_month + " " + f_year;
		});
	},

	short_date: function() {
		return helper_utils.checkArgs(arguments, function(text) {
			if(!text) {
				return "";
			}

			var published_date = new Date( getDateValue(text) );
			var month_names = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];

			var f_date = (published_date.getDate() < 10) ? ("0" + published_date.getDate()) : published_date.getDate();
			var f_month = month_names[published_date.getMonth()];
			var f_year = published_date.getFullYear();

			return f_date + " " + f_month + " " + f_year;
		});
	},

	article_date_span: function() {
		return helper_utils.checkArgs(arguments, function(text) {
			if(!text) {
				return "";
			}

			var published_date = new Date( getDateValue(text) );
			var month_names = [
				"Jan<span>uary</span>", "Feb<span>uary</span>",
				"Mar<span>ch</span>", "Apr<span>il</span>",
				"May", "Jun<span>e</span>", "Jul<span>y</span>",
				"Aug<span>ust</span>", "Sep<span>tember</span>",
				"Oct<span>ober</span>", "Nov<span>ember</span>",
				"Dec<span>ember</span>"
			];
			var day_span = "<span class=\"day\">" + 
				published_date.getDate() + "</span>";
			var month_span = "<span class=\"month\">" + 
				month_names[published_date.getMonth()] + "</span> ";
			var year_span = "<span class=\"year\">, " +
				published_date.getFullYear() + "</span>";

			return "<span class=\"date\">" + month_span + " " +
				day_span + year_span + "</span>";
		});
	}
};

module.exports = {

	directAccess: function(){
		return { "block_helpers": block_helpers, "options": {} };
	},

	get: function(basepath, file_extension, options, callback){
		var self = this;

		return callback(null, { "block": block_helpers }, {});
	}

};