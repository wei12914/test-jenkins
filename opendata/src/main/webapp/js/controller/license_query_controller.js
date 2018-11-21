"use strict";
define([ 'app' ], function(app) {
	app.controller('licenseQueryController', [ 
		'$scope', '$http', '$rootScope', 'restService', '$commonService', 
			function($scope, $http, $rootScope, restService, $commonService) {

				//分頁相關參數初始化設定
				$scope.pageSize = 20;
				$scope.length = 0;
				$scope.currentPage = 1;
				$scope.pageList = [];
				$scope.pageMax = 1;
				$scope.sortStyle = ['','fas fa-caret-up','fas fa-caret-down'];
				$scope.title = ['CityCode', 'FacNo', 'FacName', 'FacAddr', 'IndParkName'];
				$scope.label = [];
				
				/**
				 * 更換縣市
				 */
				$scope.changeCity = function(cityCode){
					$scope.townList = [];
					$scope.indparkList = [];
					$scope.indParkCode = null;
					if(null == cityCode){
						$scope.indparkList = $scope.fullIndparkList;
					}
					else {
						for(var i=0 ; i<$scope.fullTownList.length ; i++){
							var tmp = $scope.fullTownList[i];
							if(tmp.group == cityCode){
								$scope.townList.push(tmp);
							}
						}
						
						for(var i=0 ; i<$scope.fullIndparkList.length ; i++){
							var tmp = $scope.fullIndparkList[i];
							if(('00' == tmp.value)||('99' == tmp.value)||('ZZ' == tmp.value)){
								$scope.indparkList.push(tmp);
							}
							else {
								if(cityCode == tmp.value.substring(0,1)){
									$scope.indparkList.push(tmp);
								}
							}
							
						}
					}
					
				};
				
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
				/**
				 * 初始化
				 */
				$scope.init = function() {
					$scope.initSort();
					//初始選項查詢
					restService.execute('rest/license/init').then(function(response) {
						$scope.cityList = response.cityList;
						$scope.fullTownList = response.townList;
						$scope.fullIndparkList = response.indparkList;
						$scope.indparkList = response.indparkList;
						
						if(undefined != $rootScope.lq){
							
							$scope.cityCode = $rootScope.lq.cityCode;
							$scope.changeCity($scope.cityCode);
							$scope.townCode = $rootScope.lq.townCode;
							$scope.indParkCode = $rootScope.lq.indParkCode;
							$scope.factoryName = $rootScope.lq.factoryName;
							$scope.licence = $rootScope.lq.licence;
							$scope.detection = $rootScope.lq.detection;
							$scope.approve = $rootScope.lq.approve;
							$scope.declaration = $rootScope.lq.declaration;
							$scope.monitoring = $rootScope.lq.monitoring;
							$scope.penalty = $rootScope.lq.penalty;
							$scope.commissioning = $rootScope.lq.commissioning;
							$scope.offset = $rootScope.lq.offset;
							$scope.sortDirection = $rootScope.lq.sortDirection;
							$scope.sortValue = $rootScope.lq.sortValue;
							$scope.currentPage = $rootScope.lq.currentPage;
							$scope.label[$scope.sortValue] = $rootScope.lq.label;
							
							var data = {
									cityCode : $rootScope.lq.cityCode,
									townCode : $rootScope.lq.townCode,
									indParkCode : $rootScope.lq.indParkCode,
									factoryName : $rootScope.lq.factoryName,
									licence : $rootScope.lq.licence,
									detection : $rootScope.lq.detection,
									approve : $rootScope.lq.approve,
									declaration : $rootScope.lq.declaration,
									monitoring : $rootScope.lq.monitoring,
									penalty : $rootScope.lq.penalty,
									commissioning : $rootScope.lq.commissioning,
									offset : $rootScope.lq.offset,
									sortDirection : $rootScope.lq.sortDirection,
									sortValue : $rootScope.lq.sortValue
								};
								
								restService.execute('rest/license/query', data).then(function(response) {
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
					if(undefined == $scope.dataList || $scope.dataList.length == 0){
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
					var data = {
						cityCode : $scope.cityCode,
						townCode : $scope.townCode,
						indParkCode : $scope.indParkCode,
						factoryName : $scope.factoryName,
						licence : $scope.licence,
						detection : $scope.detection,
						approve : $scope.approve,
						declaration : $scope.declaration,
						monitoring : $scope.monitoring,
						penalty : $scope.penalty,
						commissioning : $scope.commissioning,
						offset : $scope.offset,
						sortDirection : $scope.sortDirection,
						sortValue : $scope.sortValue
					};
					$rootScope.lq = angular.copy(data);
					$rootScope.lq.currentPage = $scope.currentPage;
					$rootScope.lq.label = $scope.label[$scope.sortValue];
					
					restService.execute('rest/license/query', data).then(function(response) {
						$scope.dataList = response.list;
						$scope.calPage(response.size);
					}, function(error) {

					});
					$('html,body').animate({scrollTop:$('#lq').offset().top}, 150);
				};
				
				$scope.clickQuery = function(){
					$scope.currentPage = 1;
					$scope.query();
				};
				
				/**
				 * 檢視detail
				 */
				$scope.clickView = function(facNo, tabIndex){
					if (tabIndex == 8) {
						window.location='#/rcq/' + facNo;
					} else {
						window.location='#/lv/' + facNo + '/' + tabIndex;
					}
				};
	} ]);
});