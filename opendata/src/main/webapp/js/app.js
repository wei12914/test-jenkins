define([
	'angularAMD', 'angular-route', 'angular-animate', 'angular-aria', 'angular-material', 'bootstrap'
], function(angularAMD) {
	
	var app = angular.module('app', [ 'ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial'
	
	]);
	
	app.controller('IndexController', ['$scope', '$rootScope', '$http', 
		function($scope, $rootScope, $http) {
		$scope.menuExpand = false;
		$scope.expandMen = function(){
			$scope.menuExpand = !$scope.menuExpand;
		};
		
		$scope.closeMen = function(target){
			$rootScope[target] = undefined; 
			$scope.menuExpand = false;
		};
		
		$scope.penaltyDropdown = false;
		$scope.clickPenalty = function(){
			$scope.penaltyDropdown = !$scope.penaltyDropdown;
		};
		
		$rootScope.maintainDate = "107年11月21日";
		
//		$http({
//			method: 'GET',
//			url: $rootScope.contextPath + 'rest/common/getMaintainDate'
//		}).then(function(response) {
//			$rootScope.maintainDate = response.data.maintainDate;
//		});
		
//		$http({
//			method: 'POST',
//			url: $rootScope.contextPath + 'rest/count/get'
//		}).then(function(response) {
//			$rootScope.bCount = response.data;
//		});
	}]);

	app.directive('datePicker', function () {
 	    return {
 	        restrict: 'A',
 	        require: 'ngModel',
 	        link: function (scope, element, attr, ngModel) {

 	            element.val(ngModel.$viewValue);

 	            function onpicking(dp) {
 	                var date = dp.cal.getNewDateStr();
 	                scope.$apply(function () {
 	                    ngModel.$setViewValue(date);
 	                });
 	            }
 	            function oncleared(){
 	            	scope.$apply(function () {
 	                    ngModel.$setViewValue("");
 	                });
 	            }
 	            
 	            element.bind('click', function () {
 	                WdatePicker({
 	                    onpicking: onpicking,
 	                    oncleared: oncleared,
 	                    dateFmt: (attr.datefmt || 'yyy/MM/dd')
 	                })
 	            });
 	        }
 	    };
 	});
	
	app.config(function($routeProvider, $locationProvider) {
		$locationProvider.hashPrefix('');
		$routeProvider
		.when("/", {
			redirectTo : "/ab/1"
		})
		.when("/ab/:tab",  angularAMD.route({
			templateUrl : 'views/about.html',
			controllerUrl : 'js/controller/about_controller'
		}))
		.when("/lq",  angularAMD.route({//公私場所許可證資料公開查詢
			templateUrl : 'views/license/license_query.html',
			controllerUrl : 'js/controller/license_query_controller'
		}))
		.when("/lv/:facNo/:tabIndex",  angularAMD.route({
			templateUrl : 'views/license/license_view.html',
			controllerUrl : 'js/controller/license_view_controller'
		}))
		.when("/emq",  angularAMD.route({
			templateUrl : 'views/emissions/emissions_query.html',
			controllerUrl : 'js/controller/emissions_query_controller'
		}))
		.when("/rcq",  angularAMD.route({
			templateUrl : 'views/commissioning/comm_query.html',
			controllerUrl : 'js/controller/comm_query_controller'
		}))
		.when("/rcq/:facNo",  angularAMD.route({
			templateUrl : 'views/commissioning/comm_query.html',
			controllerUrl : 'js/controller/comm_query_controller'
		}))
		.when("/rcv/:sn",  angularAMD.route({
			templateUrl : 'views/commissioning/comm_view.html',
			controllerUrl : 'js/controller/comm_view_controller'
		}))
		.when("/rcqa/:sn",  angularAMD.route({
			templateUrl : 'views/commissioning/comm_question_ask.html',
			controllerUrl : 'js/controller/comm_question_ask_controller'
		}))
		.when("/rcqq/:sn",  angularAMD.route({
			templateUrl : 'views/commissioning/comm_question_query.html',
			controllerUrl : 'js/controller/comm_question_query_controller'
		}))
		.when("/pq",  angularAMD.route({
			templateUrl : 'views/penalty/penalty_query.html',
			controllerUrl : 'js/controller/penalty_query_controller'
		}));
	});

	app.run(['$rootScope', '$http', '$location', function($rootScope, $http, $location){
		
		$rootScope.contextPath = location.origin + location.pathname;
		
		$rootScope.$on('$locationChangeSuccess', function() {
			var path = $location.path();
			$rootScope.actPath = path;
	    });        

//		$http({
//			method: 'POST',
//			url: $rootScope.contextPath + 'rest/count/count'
//		});
		
	}]);
	return angularAMD.bootstrap(app);
});
