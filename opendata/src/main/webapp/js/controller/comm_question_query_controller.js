"use strict";
define([ 'app' ], function(app) {
	app.controller('commQuestionQueryController', [ 
		'$scope', '$rootScope', 'restService', '$routeParams',
			function($scope, $rootScope, restService, $routeParams) {

				//分頁相關參數初始化設定
				$scope.pageSize = 20;
				$scope.length = 0;
				$scope.currentPage = 1;
				$scope.pageList = [];
				$scope.pageMax = 1;
				$scope.label = [];
				
				/**
				 * 初始化
				 */
				$scope.init = function() {
					$scope.query();
				};
				
				/**
				 * 計算頁數
				 */
				$scope.calPage = function(length){
					if(length == 0){
						$scope.pageMax = 1;
					}
					else {
						$scope.pageList = [];
						$scope.pageMax = Math.ceil(length / $scope.pageSize);
						
						if($scope.currentPage <= 6){//前段頁碼
							if($scope.pageMax > 10){
								for(var i=1; i<=10 ; i++){
									$scope.pageList.push(i);
								}
							}
							else{
								for(var i=1; i<=$scope.pageMax ; i++){
									$scope.pageList.push(i);
								}
							}
						}
						else if($scope.currentPage >= $scope.pageMax-4){//後段頁碼
							for(var i=$scope.pageMax-9; i<=$scope.pageMax ; i++){
								$scope.pageList.push(i);
							}
						}
						else {//中段頁碼
							for(var i=$scope.currentPage-5; i<=$scope.currentPage+4 ; i++){
								$scope.pageList.push(i);
							}
						}
					}
				};
				
				/**
				 * 點擊頁數
				 */
				$scope.pageClick = function(page){
					if ($scope.currentPage == page) return;
					$scope.currentPage = page;
					$scope.query();
				};
				
				/**
				 * 上一頁
				 */
				$scope.prev = function(){
					if($scope.currentPage == 1){
						return;
					}
					$scope.currentPage = $scope.currentPage -1;
					//查詢
					$scope.query();
				};
				
				/**
				 * 下一頁
				 */
				$scope.next = function(){
					if($scope.currentPage == $scope.pageMax){
						return;
					}
					$scope.currentPage = $scope.currentPage +1;
					//查詢
					$scope.query();
				};
				
				/**
				 * 查詢
				 */
				$scope.query = function(){
					
					if(undefined == $scope.sortValue){
						$scope.sortDirection = 'asc';
						$scope.sortValue = 'seqNo';
					}
					
					$scope.offset = ($scope.currentPage-1)*$scope.pageSize;
					var data = {
						sn : $routeParams.sn,
						offset : $scope.offset,
						pageSize : $scope.pageSize,
						currentPage : $scope.currentPage,
						sortDirection : $scope.sortDirection,
						sortValue : $scope.sortValue
					};
					
					restService.execute('rest/commQuest/query', data).then(function(response) {
						if (null == response || "" === response) {
							//狀態為駁回，不可檢視，直接導回清單頁
							window.location='#/rcq';
						} else {
							$scope.data = response.otherData;
							$scope.dataList = response.list;
							$scope.calPage(response.size);
						}
					}, function(error) {

					});
				};
				
				/**
				 * 下載問題彙整
				 */
				$scope.exportCsv = function(){
					window.open('http://'+ location.host + location.pathname + 'rest/commQuest/exportCsv/' + $routeParams.sn, '_blank');
				};
				
				$scope.init();
			}
	]);
});