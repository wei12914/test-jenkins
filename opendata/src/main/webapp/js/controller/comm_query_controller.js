"use strict";
define([ 'app' ], function(app) {
	app.controller('commQueryController', [ 
		'$scope', '$rootScope', 'restService', '$modalService', '$routeParams', '$location',
			function($scope, $rootScope, restService, $modalService, $routeParams, $location) {

				//分頁相關參數初始化設定
				$scope.pageSize = 20;
				$scope.length = 0;
				$scope.currentPage = 1;
				$scope.pageList = [];
				$scope.pageMax = 1;
				$scope.sortStyle = ['','fas fa-caret-up','fas fa-caret-down'];
				$scope.title = ['facNo', 'facName', 'cityCode', 'facAddr', 'publicDate', 'aplStatus', 'auditDate'];
				$scope.label = [];
				
				/**
				 * 初始化
				 */
				$scope.init = function() {
					
					//排序初始化
					for(var i=0;i<$scope.title.length;i++){
						var tmp = {
							styleIndex : 0,
							style :  $scope.sortStyle[0]
						}
						$scope.label[$scope.title[i]] = tmp;
					}
					
					//初始選項查詢
					restService.execute('rest/common/getCityOptions').then(function(response) {
						$scope.cityList = response;
					}, function(error) {

					});
					
					//判斷是否從工廠清單過來的
					var facNo = $routeParams.facNo;
					if (null != facNo && undefined != facNo && "" !== facNo) {
						$scope.factoryName = facNo;
						$scope.query();
					}
					if (null != $rootScope.commQueryCondition && undefined != $rootScope.commQueryCondition) {
						$scope.backList();
					}
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
				
				$scope.checkCondition = function() {
					
					if ($scope.cityCode === "" || $scope.cityCode == null) {
						$modalService.error("請選擇縣市");
						return;
					}
					
					$scope.query();
				};
				
				/**
				 * 查詢
				 */
				$scope.query = function(){
					
					if(undefined == $scope.sortValue){
						$scope.sortDirection = 'desc';
						$scope.sortValue = 'publicDate';
						$scope.label[$scope.sortValue].style = $scope.sortStyle[2];
						$scope.label[$scope.sortValue].styleIndex = 2;
					}
					
					$scope.offset = ($scope.currentPage-1)*$scope.pageSize;
					var data = {
						cityCode : $scope.cityCode,
						factoryName : $scope.factoryName,
						offset : $scope.offset,
						pageSize : $scope.pageSize,
						currentPage : $scope.currentPage,
						sortDirection : $scope.sortDirection,
						sortValue : $scope.sortValue
					};
					
					$rootScope.commQueryCondition = data;
					$rootScope.commQueryCondition.label = $scope.label[$scope.sortValue];
					
					restService.execute('rest/commissioning/query', data).then(function(response) {
						$scope.dataList = response.list;
						$scope.calPage(response.size);
					}, function(error) {

					});
					
				};
				
				/**
				 * 檢視頁回到清單頁
				 */
				$scope.backList = function() {
					
					$scope.cityCode = $rootScope.commQueryCondition.cityCode;
					$scope.factoryName = $rootScope.commQueryCondition.factoryName;
					$scope.offset = $rootScope.commQueryCondition.offset;
					$scope.pageSize = $rootScope.commQueryCondition.pageSize;
					$scope.currentPage = $rootScope.commQueryCondition.currentPage;
					$scope.sortDirection = $rootScope.commQueryCondition.sortDirection;
					$scope.sortValue = $rootScope.commQueryCondition.sortValue;
					$scope.label[$scope.sortValue] = $rootScope.commQueryCondition.label;
					
					restService.execute('rest/commissioning/query', $rootScope.commQueryCondition).then(function(response) {
						$scope.dataList = response.list;
						$scope.calPage(response.size);
					}, function(error) {

					});
				}
				
				/**
				 * 計畫書檢視
				 */
				$scope.viewItem = function(sn){
					window.location='#/rcv/' + sn;
				};
				
				/**
				 * 問題彙整
				 */
				$scope.viewQuestion = function(sn){
					window.location='#/rcqq/' + sn;
				};

				/**
				 * 下載會議紀錄
				 */
				$scope.downloadFile = function(sn){
					window.open('http://'+ location.host + location.pathname + 'rest/commissioning/downloadMeeting/' + sn, '_blank');
				};
				
				/**
				 * 頁面切換watch
				 */
				var commWatcher = $rootScope.$watch(function () {return $location.path();}, function (newPath, oldPath) {
					if (newPath === oldPath) return;
			        if ((oldPath.indexOf("rcq") > 0 && newPath.indexOf("rcv") > 0) 
			        		|| (oldPath.indexOf("rcq") > 0 && newPath.indexOf("rcqq") > 0)) {
			        	//保留查詢條件
			        } else if ((oldPath.indexOf("rcv") > 0 && newPath.indexOf("rcq") > 0)
			        		|| (oldPath.indexOf("rcqq") > 0 && newPath.indexOf("rcq") > 0)) {
			        	//保留查詢條件
			        	//回到清單頁把上一個watch移除掉
			        	commWatcher();
			        } else {
			        	//清除查詢條件
			        	$rootScope.commQueryCondition = null;
			        	//跳到其它頁面把該watch清除掉
			        	commWatcher();
			        }
			    });
				
				$scope.init();
				
			} ]);
});