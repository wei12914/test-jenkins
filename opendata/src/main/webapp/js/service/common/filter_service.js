"use strict";
define([ 'app' ], function(app) {
	
	//	數字顯示千分號
	app.filter('moneyFilter', function() {
		return function(input) {
			if (input == undefined) {
				return "";
			}
			
			input = input.toString();
			var pattern = /(-?\d+)(\d{3})/
	        while (pattern.test(input)) {
	        	input = input.replace(pattern, "$1,$2")
	        }
	        return input;
		};
	});
	
	//有無
	app.filter('whetherFilter', function() {
		return function(input) {
			if (input == undefined || input == null || input === "") {
				return "";
			}
			return input == true ? "有" : "無";
		};
	});
	
	//無資料補全形空白
	app.filter('noneDataFilter', function() {
		return function(input) {
			if (input == undefined || input == null || input === "") {
				return "　";
			}
			return input ;
		};
	});
});