"use strict";
define([ 'app' ], function(app) {
	app.controller('emissionsQueryController', [ 
		'$scope', '$http', '$rootScope', 'restService', '$commonService', 
		'$modalService', 
			function($scope, $http, $rootScope, restService, $commonService, $modalService) {

				//分頁相關參數初始化設定
				$scope.pageSize = 20;
				$scope.length = 0;
				$scope.currentPage = 1;
				$scope.pageList = [];
				$scope.pageMax = 1;
				$scope.sortStyle = ['','fas fa-caret-up','fas fa-caret-down'];
				$scope.title = ['CityCode', 'FacNo', 'FacName', 'Period', 'VOCs', 'TSP', 'SOx', 'NOx', 'Status'];
				$scope.label = [];
				
				/**
				 * 初始化
				 */
				$scope.init = function() {
					
					$scope.startSeasonYear = [];
					$scope.startSeason = [];
					
					var now = new Date();
					var nowYear = now.getFullYear() - 1911;
					for (var i = 0; i<20; i++) {
						
						var tempValue = nowYear-i;
						var tempStr = tempValue+"年";
						
						var yearX =  {label : tempStr , value : tempValue};
						$scope.startSeasonYear.push(yearX);
					}
					
					var season1 =  {label : "第1季" , value : 1};
					var season2 =  {label : "第2季" , value : 2};
					var season3 =  {label : "第3季" , value : 3};
					var season4 =  {label : "第4季" , value : 4};
					
					$scope.startSeason.push(season1);
					$scope.startSeason.push(season2);
					$scope.startSeason.push(season3);
					$scope.startSeason.push(season4);
					
					$scope.emissionsForm = {};
					$scope.emissionsForm.startSeasonYear = $scope.startSeasonYear[0].value;
					$scope.emissionsForm.startSeason = $scope.startSeason[0].value;
					$scope.emissionsForm.endSeasonYear = $scope.startSeasonYear[0].value;
					$scope.emissionsForm.endSeason = $scope.startSeason[0].value;
					
					//排序初始化
					for(var i=0;i<$scope.title.length;i++){
						var tmp = {
							styleIndex : 0,
							style :  $scope.sortStyle[0]
						}
						$scope.label[$scope.title[i]] = tmp;
					}
					
					//初始選項查詢
					restService.execute('rest/emissions/init').then(function(response) {
						$scope.cityList = response.cityList;
						
						if(undefined != $rootScope.eq){

							$scope.cityCode = $rootScope.eq.cityCode;
							$scope.factoryName = $rootScope.eq.factoryName;
							$scope.emissionsForm.startSeasonYear = $rootScope.eq.startSeasonYear;
							$scope.emissionsForm.startSeason = $rootScope.eq.startSeason;
							$scope.emissionsForm.endSeasonYear = $rootScope.eq.endSeasonYear;
							$scope.emissionsForm.endSeason = $rootScope.eq.endSeason;
							$scope.offset = $rootScope.eq.offset;
							$scope.sortDirection = $rootScope.eq.sortDirection;
							$scope.sortValue = $rootScope.eq.sortValue;
							
							$scope.currentPage = $rootScope.eq.currentPage;
							$scope.label[$scope.sortValue] = $rootScope.eq.label;
							
							var data = {
									cityCode : $rootScope.eq.cityCode,
									factoryName : $rootScope.eq.factoryName,
									startSeasonYear : $rootScope.eq.startSeasonYear,
									startSeason : $rootScope.eq.startSeason,
									endSeasonYear : $rootScope.eq.endSeasonYear,
									endSeason : $rootScope.eq.endSeason,
									offset : $rootScope.eq.offset,
									sortDirection : $rootScope.eq.sortDirection,
									sortValue : $rootScope.eq.sortValue
							};
							
							restService.execute('rest/emissions/query', data).then(function(response) {
								$scope.dataList = response.list;
								$scope.calPage(response.size);
								
								if (response.size > 0) {
									isQuerySuccsee = true;
									$scope.queryForm = data;
								}
								
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
				
				var isQuerySuccsee = false;
				$scope.queryForm = null;
				
				/**
				 * 查詢
				 */
				$scope.query = function(isFisrstQuery){

					var startSeasonYear = $scope.emissionsForm.startSeasonYear;
					var startSeason = $scope.emissionsForm.startSeason;
					var endSeasonYear = $scope.emissionsForm.endSeasonYear;
					var endSeason = $scope.emissionsForm.endSeason;
					
					var isRequired = false;
					var requiredMsg = "";
					
					if (
							(null == startSeasonYear)||(undefined == startSeasonYear) || startSeasonYear.length <=0 
							|| (null == startSeason)||(undefined == startSeason) || startSeason.length <=0
							|| (null == endSeasonYear)||(undefined == endSeasonYear) || endSeasonYear.length <=0
							|| (null == endSeason)||(undefined == endSeason) || endSeason.length <=0
							
					) {
						requiredMsg += "申報季別為必填欄位";
						isRequired = true;
					} else if (endSeasonYear - startSeasonYear > 7) {
						requiredMsg += "申報季別可查詢的最大區間為7年";
						isRequired = true;
					} else {
						var tempStart = parseInt(startSeasonYear + "0" + startSeason);
						var tempEnd = parseInt(endSeasonYear + "0" + endSeason);
						if (tempStart > tempEnd) {
							requiredMsg += "申報季別起訖需合理，後者大於等於前者";
							isRequired = true;
						}
					}
					
					if (isRequired) {
						$modalService.error(requiredMsg);
						return;
					}

					$('html,body').animate({scrollTop:$('#lq').offset().top}, 150);
					
					if(undefined == $scope.sortValue){
						$scope.sortDirection = 'asc';
						$scope.sortValue = 'FacNo';
						$scope.label[$scope.sortValue].style = $scope.sortStyle[1];
						$scope.label[$scope.sortValue].styleIndex = 1;
					}
					
					$scope.offset = ($scope.currentPage-1)*$scope.pageSize;
					
					if (isFisrstQuery) {
						$scope.offset = 0;
						
						var item = angular.copy($scope.label['FacNo']);
						item.styleIndex = 1;
						item.style = $scope.sortStyle[item.styleIndex];
						
						for(var i=0; i<$scope.title.length;i++){
							var tmp = $scope.label[$scope.title[i]];
							tmp.styleIndex = 0;
							tmp.style =  $scope.sortStyle[0];
						}
						$scope.label['FacNo'] = item;
						
						$scope.sortDirection = 'asc';
						$scope.currentPage = 1;
						$scope.sortValue = 'FacNo';
						
						isQuerySuccsee = false;
						$scope.queryForm = null;
					}
					
					var data = {
							cityCode : $scope.cityCode,
							factoryName : $scope.factoryName,
							startSeasonYear : $scope.emissionsForm.startSeasonYear,
							startSeason : $scope.emissionsForm.startSeason,
							endSeasonYear : $scope.emissionsForm.endSeasonYear,
							endSeason : $scope.emissionsForm.endSeason,
							offset : $scope.offset,
							sortDirection : $scope.sortDirection,
							sortValue : $scope.sortValue
					};
					$rootScope.eq = angular.copy(data);
					$rootScope.eq.currentPage = $scope.currentPage;
					$rootScope.eq.label = $scope.label[$scope.sortValue];
					
					restService.execute('rest/emissions/query', data).then(function(response) {
						$scope.dataList = response.list;
						$scope.calPage(response.size);
						
						if (response.size > 0) {
							isQuerySuccsee = true;
							$scope.queryForm = data;
						}
						
					}, function(error) {
						
					});
					
				};
				
				$scope.clickView = function(facNo){
					window.location='#/lv/' + facNo + '/5' ;
				};
				
				/**
				 * 下載
				 */
				$scope.download = function(){
					if (isQuerySuccsee == false) {
						return;
					}
					
					if ($scope.queryForm == null) {
						return;
					}
					
					var url = 'rest/emissions/download';
					var newWindow = window.open(url, 'download');
					if (!newWindow) 
						return false;
					var html = "";
					html += "<html><head></head><body><form id='formid' accept-charset='utf-8' method='post' action='" + url + "'>";
					
					var key = null;
					var value = null;
					
					key = 'cityCode';
					value = $scope.queryForm.cityCode;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'factoryName';
					value = $scope.queryForm.factoryName;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'startSeasonYear';
					value = $scope.queryForm.startSeasonYear;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'startSeason';
					value = $scope.queryForm.startSeason;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'endSeasonYear';
					value = $scope.queryForm.endSeasonYear;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'endSeason';
					value = $scope.queryForm.endSeason;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'offset';
					value = $scope.queryForm.offset;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'sortDirection';
					value = $scope.queryForm.sortDirection;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					key = 'sortValue';
					value = $scope.queryForm.sortValue;
					if (value) {
						html += "<input type='hidden' type='text' name='" + key + "' value='" + value + "'/>";
					}
					
					html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
					newWindow.document.write(html);
					return newWindow;
					
				};
				
				

				
			} ]);
});