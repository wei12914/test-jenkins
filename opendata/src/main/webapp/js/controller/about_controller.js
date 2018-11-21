"use strict";
define([ 'app' ], function(app) {
	app.controller('aboutController', [ 
		'$scope', '$rootScope', 'restService', '$routeParams',
		function($scope, $rootScope, restService, $routeParams) {

			/**
			 * 初始化
			 */
			$scope.init = function() {
				
				$scope.c1 = false;
				$scope.c2 = false;
				$scope.c3 = false;
				$scope.tab = $routeParams.tab;
				switch ($scope.tab) {
				case '1':
					$scope.c1 = true;
					document.getElementById('heading1').scrollIntoView();
					break;
				case '2':
					$scope.c2 = true;
					document.getElementById('heading6').scrollIntoView();
					break;
				case '3':
					$scope.c3 = true;
					document.getElementById('heading4').scrollIntoView();
					break;
				default:
					break;
				}
			};
			$scope.init();
			
			/**
			 * 下載操作手冊或常見問題
			 */
			$scope.downloadFile = function(type){
				switch (type) {
				case 1:
					window.open('http://'+ location.host + '/about/系統操作手冊_列管工廠資料公開.pdf', '_blank');
					break;
				case 2:
					window.open('http://'+ location.host + '/about/系統操作手冊_排放量申報資料.pdf', '_blank');
					break;
				case 3:
					window.open('http://'+ location.host + '/about/系統操作手冊_查核處分資訊.pdf', '_blank');
					break;
				case 4:
					window.open('http://'+ location.host + '/about/系統操作手冊_民眾參與表示意見.pdf', '_blank');
					break;
				case 5:
					window.open('http://'+ location.host + '/about/常見問題.pdf', '_blank');
					break;
				default:
					break;
				}
			};
		}
	]);
});