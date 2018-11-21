"use strict";
define([ 'app' ], function(app) {
	app.controller('commViewController', [ 
		'$scope', '$rootScope', 'restService', '$routeParams',
		function($scope, $rootScope, restService, $routeParams) {

			/**
			 * 初始化
			 */
			$scope.init = function() {
				
				//初始選項查詢
				restService.execute('rest/commissioning/view/'+$routeParams.sn).then(function(response) {
					if (null == response || "" === response) {
						//狀態為駁回，不可檢視，直接導回清單頁
						window.location='#/rcq';
					} else {
						$scope.data = response;
					}
				}, function(error) {

				});
			};
			$scope.init();
			
			/**
			 * 提問及建議
			 */
			$scope.askQuestion = function(){
				window.location='#/rcqa/' + $routeParams.sn;
			};
			
			/**
			 * 問題彙整
			 */
			$scope.viewQuestion = function(){
				window.location='#/rcqq/' + $routeParams.sn;
			};

			/**
			 * 下載公開文件
			 */
			$scope.downloadFile = function(){
				window.open('http://'+ location.host + location.pathname + 'rest/commissioning/downloadPublic/' + $routeParams.sn, '_blank');
			};
			
		}
	]);
});