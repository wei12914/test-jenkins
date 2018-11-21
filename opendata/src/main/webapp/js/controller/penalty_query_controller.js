"use strict";
define([ 'app' ], function(app) {
	app.controller('penaltyQueryController', [ 
		'$scope', '$http', '$rootScope', 'restService', '$commonService', 
			function($scope, $http, $rootScope, restService, $commonService) {

			//分頁相關參數初始化設定
			$scope.pageSize = 20;
			$scope.length = 0;
			$scope.currentPage = 1;
			$scope.pageList = [];
			$scope.pageMax = 1;
			$scope.sortStyle = ['','fas fa-caret-up','fas fa-caret-down'];
			$scope.title = ['FacNo', 'FacName', 'CityCode', 'FacAddr', 'DocumentNo', 'PenaltyDate',
				'TransgressDate', 'TransgressLaw', 'PenaltyMoney', 'TransgressState'];
			$scope.label = [];
			
			$scope.initSort = function(){
				//排序初始化
				for(var i=0;i<$scope.title.length;i++){
					var tmp = {
						styleIndex : 0,
						style :  $scope.sortStyle[0]
					}
					$scope.label[$scope.title[i]] = tmp;
				}
			};
			
			$scope.init = function(){
				
				$scope.initSort();
				//初始選項查詢
				restService.execute('rest/penalty/init').then(function(response) {
					$scope.cityList = response;
					
					if(undefined != $rootScope.pq){
						
						$scope.factoryName = $rootScope.pq.factoryName;
						$scope.cityCode = $rootScope.pq.cityCode;
						$scope.address = $rootScope.pq.address;
						$scope.law = $rootScope.pq.law;
						$scope.offset = $rootScope.pq.offset;
						$scope.sortDirection = $rootScope.pq.sortDirection;
						$scope.sortValue = $rootScope.pq.sortValue;
						
						$scope.currentPage = $rootScope.pq.currentPage;
						$scope.label[$scope.sortValue] = $rootScope.pq.label;
						
						var data = {
								factoryName : $rootScope.pq.factoryName,
								cityCode : $rootScope.pq.cityCode,
								address : $rootScope.pq.address,
								law : $rootScope.pq.law,
								offset : $rootScope.pq.offset,
								sortDirection : $rootScope.pq.sortDirection,
								sortValue : $rootScope.pq.sortValue
						};
						
						restService.execute('rest/penalty/query', data).then(function(response) {
							$scope.dataList = response.list;
							$scope.calPage(response.size);
						}, function(error) {

						});
					}
					
				}, function(error) {

				});
			};
			$scope.init();
		
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
			 * 排序
			 */
			$scope.sort = function(value){
				if($scope.dataList.length == 0){
					return;
				}
				var item = angular.copy($scope.label[value]);
				item.styleIndex = (item.styleIndex + 1) % 3;
				if(item.styleIndex == 0){
					item.styleIndex = 1;
				}
				item.style = $scope.sortStyle[item.styleIndex];
				
				for(var i=0; i<$scope.title.length;i++){
					var tmp = $scope.label[$scope.title[i]];
					tmp.styleIndex = 0;
					tmp.style =  $scope.sortStyle[0];
				}
				$scope.label[value] = item;
				
				if(item.styleIndex == 1){
					$scope.sortDirection = 'asc';
				}
				else if(item.styleIndex == 2){
					$scope.sortDirection = 'desc';
				}
				$scope.currentPage = 1;
				$scope.sortValue = value;
				$scope.query();
			};
			
			$scope.clickQuery = function(){
				$scope.currentPage = 1;
				$scope.query();
			};
			
			/**
			 * 查詢
			 */
			$scope.query = function(){
				
				if(undefined == $scope.sortValue){
					$scope.sortDirection = 'asc';
					$scope.sortValue = 'FacNo';
					$scope.label[$scope.sortValue].style = $scope.sortStyle[1];
					$scope.label[$scope.sortValue].styleIndex = 1;
				}
				
				$scope.offset = ($scope.currentPage-1)*$scope.pageSize;
				$scope.backupQuery();
				
				var data = {
					factoryName : $scope.factoryName,
					cityCode : $scope.cityCode,
					address : $scope.address,
					law : $scope.law,
					offset : $scope.offset,
					sortDirection : $scope.sortDirection,
					sortValue : $scope.sortValue
				};
				$rootScope.pq = angular.copy(data);
				$rootScope.pq.currentPage = $scope.currentPage;
				$rootScope.pq.label = $scope.label[$scope.sortValue];
				
				restService.execute('rest/penalty/query', data).then(function(response) {
					$scope.dataList = response.list;
					$scope.calPage(response.size);
				}, function(error) {

				});
				
				$('html,body').animate({scrollTop:$('#pq').offset().top}, 150);
			};
			
			$scope.backupQuery = function(){
				if(undefined == $scope.factoryName){
					$scope.tmpFactoryName = '';
				}
				else {
					$scope.tmpFactoryName = angular.copy($scope.factoryName);
				}
				
				if(undefined == $scope.cityCode){
					$scope.tmpCityCode = '';
				}
				else {
					$scope.tmpCityCode = angular.copy($scope.cityCode);
				}
				
				if(undefined == $scope.address){
					$scope.tmpAddress = '';
				}
				else {
					$scope.tmpAddress = angular.copy($scope.address);
				}

				if(undefined == $scope.law){
					$scope.tmpLaw = '';
				}
				else {
					$scope.tmpLaw = angular.copy($scope.law);
				}
				
				if(undefined == $scope.sortDirection){
					$scope.tmpSortDirection = '';
				}
				else {
					$scope.tmpSortDirection = angular.copy($scope.sortDirection);
				}
				
				if(undefined == $scope.sortValue){
					$scope.tmpSortValue = '';
				}
				else {
					$scope.tmpSortValue = angular.copy($scope.sortValue);
				}
				
			};
			
			/**
			 * 檢視detail
			 */
			$scope.clickView = function(facNo){
				window.location='#/lv/' + facNo + '/7' ;
			};
			
			/**
			 * CSV檔下載
			 */
			$scope.clickDownload = function(){
				
				var data = {
					factoryName : $scope.tmpFactoryName,
					cityCode : $scope.tmpCityCode,
					address : $scope.tmpAddress,
					law : $scope.tmpLaw,
					sortDirection : $scope.tmpSortDirection,
					sortValue : $scope.tmpSortValue
				};
				
				$commonService.openWindowWithPost($rootScope.contextPath + 
						'rest/penalty/downloadCsv', data);
			};
			
	} ]);
});