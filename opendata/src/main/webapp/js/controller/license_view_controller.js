"use strict";
define(['app'], function( app) {
	app.controller('licenseViewController',  [ 
		'$scope', '$rootScope', 'restService', '$routeParams', '$modalService', '$commonService',
		function($scope, $rootScope, restService, $routeParams, $modalService, $commonService) {
				
				//分頁相關參數初始化設定
				$scope.pageSize = 10;
				$scope.length = 0;
				$scope.sortStyle = ['', 'fas fa-caret-up', 'fas fa-caret-down'];
				$scope.tab1 = {
					name : 'INSTALL_OPERATE',
					title : ['MfrNo', 'MfrName', 'PerNo', 'EffDate', 'AvlDate'],
					currentPage : 1,
					pageMax : 1,
					pageList : [],
					label : []
				};
				$scope.tab2 = {
						name : 'FUEL_RIGHT',
						title : ['PerNo', 'ClassCode', 'ApprovalQty', 'UnitCode', 'EffDate', 'AvlDate'],
						currentPage : 1,
						pageMax : 1,
						pageList : [],
						label : []
				};
				$scope.tab7 = {
						name : 'PENALTY',
						title : ['DocumentNo', 'PenaltyDate', 'TransgressDate', 'TransgressLaw', 'PenaltyMoney', 'TransgressState'],
						currentPage : 1,
						pageMax : 1,
						pageList : [],
						label : []
				};
				
				$scope.tabs = [$scope.tab1, $scope.tab2, $scope.tab7];
				
				/**
				 * 主標籤定義
				 */
				$scope.INSTALL_OPERATE = 1;
				$scope.FUEL_RIGHT = 2;
				$scope.DETECTION = 3;
				$scope.APPROVE = 4;
				$scope.DECLARATION = 5;
				$scope.MONITORING = 6;
				$scope.PENALTY = 7;

				/**
				 * 排放檢測資料標籤
				 */
				$scope.DET_POLLUTANT = 1;
				$scope.DET_CONTROL = 2;
				
				$scope.detTab1 = {
					name : 'DET_POLLUTANT',
					title : ['SeqNo', 'DetectDate', 'CompCode', 'CompName', 'MethodName', 'AirWat', 'AirTmp',
						'AirSpd', 'WatQty', 'DryQty', 'CO2Comp', 'O2Comp', 'COComp', 'OxyMin', 
						'PollName', 'FixCon', 'Unit'],
					currentPage : 1,
					pageMax : 1,
					pageList : [],
					label : []
				};
				$scope.detTab2 = {
						name : 'DET_CONTROL',
						title : ['SeqNo', 'DetectDate', 'EquipNo', 'EquipName', 'Kind', 'RecCode', 'RecName',
							'DetectOutput', 'DetectMaxQty', 'PerMaxQty', 'UnitName'],
						currentPage : 1,
						pageMax : 1,
						pageList : [],
						label : []
				};
				$scope.detTabs = [$scope.detTab1, $scope.detTab2];
				
				/**
				 * 燃料使用與排放量標籤
				 */
				$scope.DEC_DISCHARGE = 1;
				$scope.DEC_FUELUSAGE = 2;
				
				$scope.decTab1 = {
					name : 'DEC_DISCHARGE',
					title : ['Period', 'VOCs', 'TSP', 'SOx', 'NOx', 'Status'],
					currentPage : 1,
					pageMax : 1,
					pageList : [],
					label : []
				};
				$scope.decTab2 = {
						name : 'DEC_FUELUSAGE',
						title : ['Period', 'PerNo', 'ClassCode', 'PerQty', 'Month1', 'Month2',
							'Month3', 'UnitCode'],
						currentPage : 1,
						pageMax : 1,
						pageList : [],
						label : []
				};
				$scope.decTabs = [$scope.decTab1, $scope.decTab2];
				
				/**
				 * 切換主標籤
				 */
				$scope.activeTab = function(index) {
					$scope.tabIndex = index;
					if($scope.INSTALL_OPERATE == index){
						$scope.subHeader = '公私場所許可證公開';
						$scope.query($scope.tab1);
					}
					else if($scope.FUEL_RIGHT == index){
						$scope.subHeader = '公私場所許可證公開';
						$scope.query($scope.tab2);
					}
					else if($scope.DETECTION == index){
						$scope.subHeader = '排放檢測資料';
						$scope.initTabDetection();
					}
					else if($scope.APPROVE == index){
						$scope.subHeader = '排放量認可資料';
						$scope.initTabApp();
					}
					else if($scope.DECLARATION == index){
						$scope.subHeader = '燃料使用量與排放量申報資料';
						$scope.initTabDeclaration();
					}
					else if($scope.MONITORING == index){
						$scope.subHeader = '連續監測資料';
						$scope.initLineChart();
					}
					else if($scope.PENALTY == index){
						$scope.subHeader = '處分公開資料';
						$scope.query($scope.tab7);
					}
				};
				
				$scope.initTabDeclaration = function(){
					$scope.initDecTabSort();
					$scope.decTabIndex = $scope.DEC_DISCHARGE;
					
					$scope.decTab1.currentPage = 1;
					$scope.decTab2.currentPage = 1;
					if(undefined == $scope.decTab1.sortValue){
						$scope.decTab1.sortDirection = 'asc';
						$scope.decTab1.sortValue = 'Period';
						$scope.decTab1.label[$scope.decTab1.sortValue].style = $scope.sortStyle[1];
						$scope.decTab1.label[$scope.decTab1.sortValue].styleIndex = 1;
					}
					$scope.decTab1.offset = $scope.decTab1.currentPage-1;
					
					if(undefined == $scope.decTab2.sortValue){
						$scope.decTab2.sortDirection = 'asc';
						$scope.decTab2.sortValue = 'Period';
						$scope.decTab2.label[$scope.decTab2.sortValue].style = $scope.sortStyle[1];
						$scope.decTab2.label[$scope.decTab2.sortValue].styleIndex = 1;
					}
					$scope.decTab2.offset = $scope.decTab2.currentPage-1;
					
					var data = {
							facNo : $routeParams.facNo,
							offset1 : $scope.decTab1.offset,
							sortDirection1 : $scope.decTab1.sortDirection,
							sortValue1 : $scope.decTab1.sortValue,
							offset2 : $scope.decTab2.offset,
							sortDirection2 : $scope.decTab2.sortDirection,
							sortValue2 : $scope.decTab2.sortValue
					};
					restService.execute('rest/emissions/initTabDeclaration', data).then(function(response) {
						$scope.decDischargeList = response.dischargeList;
						$scope.calPage($scope.decTab1, response.dischargeLength);
						$scope.decFuelUsagelist = response.fuelUsagelist;
						$scope.calPage($scope.decTab2, response.fuelUsageLength);
						
					}, function(error) {
						
					});
					
				};
				
				/**
				 * 查詢連續監測資料
				 */
				$scope.clickMonitorQuery = function(){
					if($scope.checkMonInput()){
						return;
					}
					var data = {
						facNo : $routeParams.facNo,	
						queryDate : $scope.mon.date,
						pipeNo : $scope.mon.pipeNo
					};
					restService.execute('rest/licenseView/queryLineChart', data).then(function(response) {
						$scope.mon.opcList = response.opcList;
						$scope.mon.so2List = response.so2List;
						$scope.mon.noxList = response.noxList;
						$scope.mon.coList = response.coList;
						$scope.mon.trsList = response.trsList;
						$scope.mon.hclList = response.hclList;
						$scope.mon.vocList = response.vocList;
						$scope.mon.o2List = response.o2List;
						$scope.mon.co2List = response.co2List;
						$scope.mon.flowList = response.flowList;
						$scope.mon.tempList = response.tempList;
						
						$scope.lc = $scope.mon.opcList.length
									+ $scope.mon.so2List.length
									+ $scope.mon.noxList.length
									+ $scope.mon.coList.length
									+ $scope.mon.trsList.length
									+ $scope.mon.hclList.length
									+ $scope.mon.vocList.length
									+ $scope.mon.o2List.length
									+ $scope.mon.co2List.length
									+ $scope.mon.flowList.length
									+ $scope.mon.tempList.length;
						$scope.drawLineChart();
					}, function(error) {
						
					});
				};
				
				/**
				 * 條件檢核
				 */
				$scope.checkMonInput = function(){
					var msg = '';
					if($commonService.isEmpty($scope.mon.date)){
						msg += '請選擇監測日期\r\n';
					}
					if($commonService.isEmpty($scope.mon.pipeNo)){
						msg += '請選擇管道編號\r\n';
					}
					if('' != msg){
						$modalService.error(msg);
						return true;
					}
					else {
						return false;
					}
				};
				
				/**
				 * 初始化連續監測資料
				 */
				$scope.initLineChart = function(){
					restService.execute('rest/licenseView/initLineChart', $routeParams.facNo).then(function(response) {
						$scope.mon = {};
						$scope.mon.pipeNoList = response.pipeNoList;
						$scope.mon.dateList = response.dateList;
						$scope.mon.titleList = response.titleList;
					}, function(error) {
						
					});
				};
				
				$scope.drawLineChart = function(){
					$scope.colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];
					
					d3.selectAll("#lcopc svg").remove();
					d3.selectAll("#lcso2 svg").remove();
					d3.selectAll("#lcnox svg").remove();
					d3.selectAll("#lcco svg").remove();
					d3.selectAll("#lctrs svg").remove();
					d3.selectAll("#lchcl svg").remove();
					d3.selectAll("#lcvoc svg").remove();
					d3.selectAll("#lco2 svg").remove();
					d3.selectAll("#lcco2 svg").remove();
					d3.selectAll("#lcflow svg").remove();
					d3.selectAll("#lctemp svg").remove();
					
					var i = 0;
					for(var j = 0;j < $scope.mon.titleList.length; j++){
						var tmp = $scope.mon.titleList[j];
						var target = tmp.target;
						$scope.draw('lc'+target , $scope.mon[target+'List'], tmp.title, $scope.colors[i]);
						i = (i + 1) % 5;
					}
				};
				
				$scope.draw = function(divId, list, title, color){
					var dataset = [];
					var min = 999999999;
					var max = 0;
					for(var i = 0; i < list.length ; i++){
						var tmp = list[i];
						var hour = tmp.hour;
						var value = tmp.monValue;
						if(value < min){
							min = value;
						}
						if(value > max){
							max = value;
						}
						dataset.push([hour, value]);
					}
					
					var width = 335;
					var height = 250;
					var padding = { top: 50, right: 10, bottom: 50, left: 50 };

					var min = d3.min(dataset, function(d) {
					  return d[1];
					})
					var max = d3.max(dataset, function(d) {
					  return d[1];
					})

					var xScale = d3.scaleLinear()
					                .domain([0, 22])
					                .range([0, width - padding.left - padding.right]);

					var yScale = d3.scaleLinear()
					                .domain([min, max])
					                .range([height - padding.top - padding.bottom, 0]);

					var svg = d3.select('#' + divId)
					            .append('svg')
					            .attr('width', width + 'px')
					            .attr('height', height + 'px');

					var xAxis = d3.axisBottom().scale(xScale);
					var yAxis = d3.axisLeft().scale(yScale).tickSize(-width);
							
					svg.append('g').attr('class', 'axis')
					  .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
					  .call(xAxis);

					svg.append('g').attr('class', 'axis')
						.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
						.call(yAxis);

					var linePath = d3.line()
					          			.x(function(d){ return xScale(d[0]) })
					          			.y(function(d){ return yScale(d[1]) });

					svg.append('g')
						.append('path')
						.attr('class', 'line-path')
						.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
						.attr('d', linePath(dataset))
					  .attr('fill', 'none')
						.attr('stroke-width', 3)
						.attr('stroke', color);

					svg.append('g')
					  .selectAll('circle')
					  .data(dataset)
					  .enter()
					  .append('circle')
					  .attr('r', 5)
					  .attr('transform', function(d){
					    return 'translate(' + (xScale(d[0]) + padding.left) + ',' + (yScale(d[1]) + padding.top) + ')'
					  })
					  .attr('fill', color);
					  
					  //標題
					  svg.append("g") .append("text") .text(title) .attr("class","title") .attr("x",padding.left) .attr("y",40); 
				};
				
				/**
				 * 日曆事件
				 */
				$scope.datePickerEvent = function(id){
					document.getElementById(id).click();
				};
				
				$scope.activeDetectTab = function(index){
					$scope.detTabIndex = index;
				};
				
				$scope.activeDeclarationTab = function(index){
					$scope.decTabIndex = index;
				};
				
				$scope.checkDetInput = function(){
					var msg = '';
					if($commonService.isEmpty($scope.det.startDate)){
						msg += '請輸入檢測日期起日\r\n';
					}
					if($commonService.isEmpty($scope.det.endDate)){
						msg += '請輸入檢測日期迄日\r\n';
					}
					if($commonService.isEmpty($scope.det.detectPosition)){
						msg += '請輸入檢測位置\r\n';
					}
					if($commonService.isEmpty($scope.det.detectType)){
						msg += '請輸入檢測類別\r\n';
					}
					if($commonService.isEmpty($scope.det.pipeNo)){
						msg += '請輸入管道編號\r\n';
					}
					if('' != msg){
						$modalService.error(msg);
						return true;
					}
					else {
						return false;
					}
				};
				
				$scope.check5Year = function(startDate, endDate){
					var sY = parseInt(startDate.substring(0, 3)) + 1916;
					var eY = parseInt(endDate.substring(0, 3)) + 1911;
					var sM = parseInt(startDate.substring(4, 6)) -1;
					var eM = parseInt(endDate.substring(4, 6)) -1;
					var sD = startDate.substring(7, 9);
					var eD = endDate.substring(7, 9);
					
					var s = new Date(sY, sM, sD);
					var e = new Date(eY, eM, eD);
					if(s.getTime() > e.getTime()){
						return false;
					}
					return true;
				};
				
				$scope.checkRangeYear = function(startDate, endDate){
					var sY = parseInt(startDate.substring(0, 3)) + 1911;
					var eY = parseInt(endDate.substring(0, 3)) + 1911;
					var sM = parseInt(startDate.substring(4, 6)) -1;
					var eM = parseInt(endDate.substring(4, 6)) -1;
					var sD = startDate.substring(7, 9);
					var eD = endDate.substring(7, 9);
					
					var s = new Date(sY, sM, sD);
					var e = new Date(eY, eM, eD);
					if(s.getTime() <= e.getTime()){
						return false;
					}
					return true;
				};
				
				/**
				 * 排放檢測資料查詢
				 */
				$scope.clickDetQuery = function(){
					
					if($scope.checkDetInput()){
						return;
					}
					if($scope.check5Year($scope.det.startDate, $scope.det.endDate)){
						$modalService.error('查詢區間必須在5年內');
						return;
					}
					if($scope.checkRangeYear($scope.det.startDate, $scope.det.endDate)){
						$modalService.error('檢測日期:起日不可大於迄日');
						return;
					}
					
					$scope.detTab1.currentPage = 1;
					$scope.detTab2.currentPage = 1;
					if(undefined == $scope.detTab1.sortValue){
						$scope.detTab1.sortDirection = 'asc';
						$scope.detTab1.sortValue = 'PollName';
						$scope.detTab1.label[$scope.detTab1.sortValue].style = $scope.sortStyle[1];
						$scope.detTab1.label[$scope.detTab1.sortValue].styleIndex = 1;
					}
					$scope.detTab1.offset = $scope.detTab1.currentPage-1;
					
					if(undefined == $scope.detTab2.sortValue){
						$scope.detTab2.sortDirection = 'asc';
						$scope.detTab2.sortValue = 'EquipNo';
						$scope.detTab2.label[$scope.detTab2.sortValue].style = $scope.sortStyle[1];
						$scope.detTab2.label[$scope.detTab2.sortValue].styleIndex = 1;
					}
					$scope.detTab2.offset = $scope.detTab2.currentPage-1;
					
					var data = {
							facNo : $routeParams.facNo,
							startDate : $scope.det.startDate,
							endDate : $scope.det.endDate,
							detectPosition : $scope.det.detectPosition, 
							detectType : $scope.det.detectType, 
							pipeNo : $scope.det.pipeNo, 
							seqNo : $scope.det.seqNo, 
							offset1 : $scope.detTab1.offset,
							sortDirection1 : $scope.detTab1.sortDirection,
							sortValue1 : $scope.detTab1.sortValue,
							offset2 : $scope.detTab2.offset,
							sortDirection2 : $scope.detTab2.sortDirection,
							sortValue2 : $scope.detTab2.sortValue
					};
					restService.execute('rest/licenseView/queryDet', data).then(function(response) {
						$scope.detPollutantList = response.detPollutantList;
						$scope.calPage($scope.detTab1, response.detPollutantListLength);
						$scope.detControlEquipList = response.detControlEquipList;
						$scope.calPage($scope.detTab2, response.detControlEquipListLength);
					}, function(error) {
						
					});
					
				};
				
				$scope.detQuery = function(tab){
					
					if(tab.name == 'DET_POLLUTANT'){
						if(undefined == tab.sortValue){
							tab.sortDirection = 'asc';
							tab.sortValue = 'PollName';
							tab.label[tab.sortValue].style = $scope.sortStyle[1];
							tab.label[tab.sortValue].styleIndex = 1;
						}
						tab.offset = tab.currentPage-1;
						var data = {
								facNo : $routeParams.facNo,
								startDate : $scope.det.startDate,
								endDate : $scope.det.endDate,
								detectPosition : $scope.det.detectPosition, 
								detectType : $scope.det.detectType, 
								pipeNo : $scope.det.pipeNo, 
								offset : tab.offset,
								sortDirection : tab.sortDirection,
								sortValue : tab.sortValue
						};
						restService.execute('rest/licenseView/queryDetPollutant', data).then(function(response) {
							$scope.detPollutantList = response.detPollutantList;
							$scope.calPage($scope.detTab1, response.detPollutantListLength);
						}, function(error) {
							
						});
					}
					else if(tab.name == 'DET_CONTROL'){
						if(undefined == tab.sortValue){
							tab.sortDirection = 'asc';
							tab.sortValue = 'EquipNo';
							tab.label[tab.sortValue].style = $scope.sortStyle[1];
							tab.label[tab.sortValue].styleIndex = 1;
						}
						tab.offset = tab.currentPage-1;
						var data = {
								facNo : $routeParams.facNo,
								startDate : $scope.det.startDate,
								endDate : $scope.det.endDate,
								detectPosition : $scope.det.detectPosition, 
								detectType : $scope.det.detectType, 
								pipeNo : $scope.det.pipeNo, 
								seqNo : $scope.det.seqNo, 
								offset : tab.offset,
								sortDirection : tab.sortDirection,
								sortValue : tab.sortValue
						};
						restService.execute('rest/licenseView/queryDetControlEquip', data).then(function(response) {
							$scope.detControlEquipList = response.detControlEquipList;
							$scope.calPage($scope.detTab2, response.detControlEquipListLength);
						}, function(error) {
							
						});
					}
					
					$('html,body').animate({scrollTop:$('#lvtab').offset().top}, 150);
				};
				
				$scope.decQuery = function(tab){
					
					if(tab.name == 'DEC_DISCHARGE'){
						if(undefined == tab.sortValue){
							tab.sortDirection = 'asc';
							tab.sortValue = 'Period';
							tab.label[tab.sortValue].style = $scope.sortStyle[1];
							tab.label[tab.sortValue].styleIndex = 1;
						}
						tab.offset = tab.currentPage-1;
						var data = {
								facNo : $routeParams.facNo,
								offset : tab.offset,
								sortDirection : tab.sortDirection,
								sortValue : tab.sortValue
						};
						restService.execute('rest/emissions/queryDischarge', data).then(function(response) {
							$scope.decDischargeList = response.dischargeList;
							$scope.calPage($scope.decTab1, response.dischargeLength);
						}, function(error) {
							
						});
					}
					else if(tab.name == 'DEC_FUELUSAGE'){
						if(undefined == tab.sortValue){
							tab.sortDirection = 'asc';
							tab.sortValue = 'Period';
							tab.label[tab.sortValue].style = $scope.sortStyle[1];
							tab.label[tab.sortValue].styleIndex = 1;
						}
						tab.offset = tab.currentPage-1;
						var data = {
								facNo : $routeParams.facNo,
								offset : tab.offset,
								sortDirection : tab.sortDirection,
								sortValue : tab.sortValue
						};
						restService.execute('rest/emissions/queryFuelUsage', data).then(function(response) {
							$scope.decFuelUsagelist = response.fuelUsagelist;
							$scope.calPage($scope.decTab2, response.fuelUsageLength);
						}, function(error) {
							
						});
					}
					
					$('html,body').animate({scrollTop:$('#lvtab').offset().top}, 150);
				};
				
				/**
				 * 初始化排序圖示
				 */
				$scope.initTabSort = function(){
					for(var i=0; i<$scope.tabs.length;i++){
						var tab = $scope.tabs[i];
						for(var j=0;j<tab.title.length;j++){
							var tmp = {
									styleIndex : 0,
									style :  $scope.sortStyle[0]
							};
							tab.label[tab.title[j]] = tmp;
						}
					}
				};
				
				$scope.initTabApp = function(){
					restService.execute('rest/licenseView/queryAprFile', $routeParams.facNo).then(function(response) {
						
						$scope.app = {};
						$scope.app.aplNo = response.aplNo;
						$scope.app.season = response.season;
						$scope.app.fileName = response.fileName;
						
					}, function(error) {

					});
				};
				
				/**
				 * 下載排放量認可資料
				 */
				$scope.downloadAppFile = function(aplNo){
					
					window.open('http://'+ location.host + location.pathname + 
							'rest/licenseView/downloadAppFile/' + $routeParams.facNo + '/' + aplNo, '_blank');
				};
				
				$scope.changePosition = function(position){
					$scope.detect.pipeNoList = [];
					if(null == position){
						$scope.detect.pipeNoList = $scope.detect.fullPipeNoList;
					}
					else {
						for(var i=0 ; i<$scope.detect.fullPipeNoList.length ; i++){
							var tmp = $scope.detect.fullPipeNoList[i];
							if(position < 4){
								if('P' == tmp.value.substring(0,1)){
									$scope.detect.pipeNoList.push(tmp);
								}
							}
							else {
								if('A' == tmp.value.substring(0,1)){
									$scope.detect.pipeNoList.push(tmp);
								}
							}
						}
					}
				};
				
				$scope.initTabDetection = function(){
					
					$scope.detTabIndex = $scope.DET_POLLUTANT;
					$scope.initDetTabSort();
					restService.execute('rest/licenseView/initTabDetection', $routeParams.facNo).then(function(response) {
						
						$scope.det = {};
						$scope.detect = {};
						$scope.detect.positionList = response.detectPositionList;
						$scope.detect.typeList = response.detectTypeList;
						$scope.detect.fullPipeNoList = response.pipeNoList;
						$scope.detect.pipeNoList = response.pipeNoList;
						$scope.det.detectPosition = '3';
						$scope.det.detectType = '3';
						var find1 = false;
						for(var i=0 ; i<response.detectPositionList.length ; i++){
							var tmp = response.detectPositionList[i];
							if('3' == tmp.value){
								find1 = true;
								$scope.det.detectPosition = '3';
								break;
							}
						}
						if(! find1){
							$scope.det.detectPosition = response.detectPositionList[0].value;
						}
						
						var find2 = false;
						for(var i=0 ; i<response.detectTypeList.length ; i++){
							var tmp = response.detectTypeList[i];
							if('3' == tmp.value){
								find2 = true;
								$scope.det.detectType = '3';
								break;
							}
						}
						if(! find2){
							$scope.det.detectType = response.detectTypeList[0].value;
						}
					}, function(error) {

					});
				};
				
				$scope.initDetTabSort = function(){
					for(var i=0; i<$scope.detTabs.length;i++){
						var tab = $scope.detTabs[i];
						for(var j=0;j<tab.title.length;j++){
							var tmp = {
									styleIndex : 0,
									style :  $scope.sortStyle[0]
							};
							tab.label[tab.title[j]] = tmp;
						}
					}
				};
				
				$scope.initDecTabSort = function(){
					for(var i=0; i<$scope.decTabs.length;i++){
						var tab = $scope.decTabs[i];
						for(var j=0;j<tab.title.length;j++){
							var tmp = {
									styleIndex : 0,
									style :  $scope.sortStyle[0]
							};
							tab.label[tab.title[j]] = tmp;
						}
					}
				};
				
				/**
				 * 繪出地圖
				 */
				$scope.initMap = function(pipeLimitList){
					var pOMap = document.getElementById("TGMap");
					var pMap = new TGOS.TGOnlineMap(pOMap, TGOS.TGCoordSys.EPSG3826); //宣告TGOnlineMap地圖物件並設定坐標系統
					var markerImg = new TGOS.TGImage("https://api.tgos.tw/TGOS_API/images/marker.png", new TGOS.TGSize(38, 33), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(10, 33));
					
					var pData = new TGOS.TGData({map: pMap});  //建立幾何圖層物件
					var style =  {
							fillColor: "none"
						};
					
					pData.setStyle(style);
					pData.setMap(pMap);  //設定呈現幾何圖層物件的地圖物件
					$scope.markerPoint = new TGOS.TGPoint($scope.eastTm, $scope.northTm);
					$scope.pTGMarker = new TGOS.TGMarker(pMap, $scope.markerPoint, "大門位置", markerImg);
					
					$scope.markerPointList = [];
					$scope.pTGMarkerList = [];
					for(var i=0; i<pipeLimitList.length ; i++){
						var tmp = pipeLimitList[i];
						$scope.markerPointList[i] = new TGOS.TGPoint(tmp.eastTm, tmp.northTm);
						$scope.pTGMarkerList[i] = new TGOS.TGMarker(pMap, $scope.markerPointList[i], tmp.pipeNo, markerImg);
					}

					//加入Marker(地圖物件,Marker坐標,Marker標題,Marker圖案)
					pMap.setCenter(new TGOS.TGPoint($scope.eastTm,$scope.northTm));
					pMap.setZoom(8);
					
				};
				
				/**
				 * 下載所有CSV檔
				 */
				$scope.downloadCsv = function() {
					var cityCode = $routeParams.facNo.substring(0, 1);
					window.open('http://'+ location.host + '/zip/' + cityCode + '/' + $routeParams.facNo + '.zip', '_blank');
				};
				
				/**
				 * 初始化
				 */
				$scope.init = function() {
					
					//初始查詢
					restService.execute('rest/licenseView/init', $routeParams.facNo).then(function(response) {
						
						$scope.facNo = response.facNo;
						$scope.facName = response.facName;
						$scope.facAddr = response.facAddr;
						$scope.openFilePath = response.openFilePath;
						$scope.zipCode = response.zipCode;
						$scope.indParkName = response.indParkName;
						$scope.eastTm = response.eastTm;
						$scope.northTm = response.northTm;
						$scope.supervisorList = response.supervisorList;
						$scope.pipeLimitList = response.pipeLimitList;
						
						$scope.licence = response.licence;
						$scope.detection = response.detection;
						$scope.approve = response.approve;
						$scope.declaration = response.declaration;
						$scope.monitoring = response.monitoring;
						$scope.penalty = response.penalty;
						
						$scope.initMap(response.pipeLimitList);
						$scope.initTabSort();
						
						$scope.tabIndex = $routeParams.tabIndex;
						$scope.activeTab($routeParams.tabIndex);
						
					}, function(error) {

					});
				};
				$scope.init();
				
				/**
				 * 計算頁數
				 */
				$scope.calPage = function(tab, length){
					if(length == 0){
						tab.pageMax = 1;
					}
					else {
						tab.pageMax = Math.ceil(length / $scope.pageSize);
						tab.pageList = [];
						if(tab.currentPage <= 6){//前段頁碼
							if(tab.pageMax > 10){
								for(var i=1; i<=10 ; i++){
									tab.pageList.push(i);
								}
							}
							else{
								for(var i=1; i<=tab.pageMax ; i++){
									tab.pageList.push(i);
								}
							}
						}
						else if(tab.currentPage >= tab.pageMax-4){//後段頁碼
							for(var i=tab.pageMax-9; i<=tab.pageMax ; i++){
								tab.pageList.push(i);
							}
						}
						else {//中段頁碼
							for(var i=tab.currentPage-5; i<=tab.currentPage+4 ; i++){
								tab.pageList.push(i);
							}
						}
					}
				};
				
				/**
				 * 點擊頁數
				 */
				$scope.pageClick = function(tab, page){
					tab.currentPage = page;
					$scope.query(tab);
				};
				
				/**
				 * 上一頁
				 */
				$scope.prev = function(tab){
					if(tab.currentPage == 1){
						return;
					}
					tab.currentPage = tab.currentPage -1;
					//查詢
					$scope.query(tab);
				};
				
				/**
				 * 下一頁
				 */
				$scope.next = function(tab){
					if(tab.currentPage == tab.pageMax){
						return;
					}
					tab.currentPage = tab.currentPage +1;
					//查詢
					$scope.query(tab);
				};
				
				/**
				 * 點擊頁數
				 */
				$scope.pageClickDet = function(tab, page){
					tab.currentPage = page;
					$scope.detQuery(tab);
				};
				
				/**
				 * 上一頁
				 */
				$scope.prevDet = function(tab){
					if(tab.currentPage == 1){
						return;
					}
					tab.currentPage = tab.currentPage -1;
					//查詢
					$scope.detQuery(tab);
				};
				
				/**
				 * 下一頁
				 */
				$scope.nextDet = function(tab){
					if(tab.currentPage == tab.pageMax){
						return;
					}
					tab.currentPage = tab.currentPage +1;
					//查詢
					$scope.detQuery(tab);
				};
				
				/**
				 * 點擊頁數
				 */
				$scope.pageClickDec = function(tab, page){
					tab.currentPage = page;
					$scope.decQuery(tab);
				};
				
				/**
				 * 上一頁
				 */
				$scope.prevDec = function(tab){
					if(tab.currentPage == 1){
						return;
					}
					tab.currentPage = tab.currentPage -1;
					//查詢
					$scope.decQuery(tab);
				};
				
				/**
				 * 下一頁
				 */
				$scope.nextDec = function(tab){
					if(tab.currentPage == tab.pageMax){
						return;
					}
					tab.currentPage = tab.currentPage +1;
					//查詢
					$scope.decQuery(tab);
				};
				
				/**
				 * 排序
				 */
				$scope.sort = function(tab, value){
					
					if(tab.name == 'INSTALL_OPERATE'){
						if(($scope.installOperateList == undefined)||($scope.installOperateList.length == 0)){
							return;
						}
					}
					else if(tab.name == 'FUEL_RIGHT'){
						if(($scope.fuelRightList == undefined)||($scope.fuelRightList.length == 0)){
							return;
						}
					}
					else if(tab.name == 'PENALTY'){
						if(($scope.penaltyList == undefined)||($scope.penaltyList.length == 0)){
							return;
						}
					}
					
					var item = angular.copy(tab.label[value]);
					item.styleIndex = (item.styleIndex + 1) % 3;
					if(item.styleIndex == 0){
						item.styleIndex = 1;
					}
					item.style = $scope.sortStyle[item.styleIndex];
					
					for(var i=0; i<tab.title.length;i++){
						var tmp = tab.label[tab.title[i]];
						tmp.styleIndex = 0;
						tmp.style =  $scope.sortStyle[0];
					}
					tab.label[value] = item;
					
					if(item.styleIndex == 1){
						tab.sortDirection = 'asc';
					}
					else if(item.styleIndex == 2){
						tab.sortDirection = 'desc';
					}
					tab.currentPage = 1;
					tab.sortValue = value;
					$scope.query(tab);
				};
				
				/**
				 * 排序 排放資料檢測
				 */
				$scope.detSort = function(tab, value){
					if(tab.name == 'DET_POLLUTANT'){
						if($scope.detPollutantList.length == 0){
							return;
						}
					}
					else if(tab.name == 'DET_CONTROL'){
						if($scope.detControlEquipList.length == 0){
							return;
						}
					}
					
					var item = angular.copy(tab.label[value]);
					item.styleIndex = (item.styleIndex + 1) % 3;
					if(item.styleIndex == 0){
						item.styleIndex = 1;
					}
					item.style = $scope.sortStyle[item.styleIndex];
					
					for(var i=0; i<tab.title.length;i++){
						var tmp = tab.label[tab.title[i]];
						tmp.styleIndex = 0;
						tmp.style =  $scope.sortStyle[0];
					}
					tab.label[value] = item;
					
					if(item.styleIndex == 1){
						tab.sortDirection = 'asc';
					}
					else if(item.styleIndex == 2){
						tab.sortDirection = 'desc';
					}
					tab.sortValue = value;
					tab.currentPage = 1;
					$scope.detQuery(tab);
				};
				
				$scope.decSort = function(tab, value){
					if(tab.name == 'DEC_DISCHARGE'){
						if($scope.decDischargeList.length == 0){
							return;
						}
					}
					else if(tab.name == 'DEC_FUELUSAGE'){
						if($scope.decFuelUsagelist.length == 0){
							return;
						}
					}
					
					var item = angular.copy(tab.label[value]);
					item.styleIndex = (item.styleIndex + 1) % 3;
					if(item.styleIndex == 0){
						item.styleIndex = 1;
					}
					item.style = $scope.sortStyle[item.styleIndex];
					
					for(var i=0; i<tab.title.length;i++){
						var tmp = tab.label[tab.title[i]];
						tmp.styleIndex = 0;
						tmp.style =  $scope.sortStyle[0];
					}
					tab.label[value] = item;
					
					if(item.styleIndex == 1){
						tab.sortDirection = 'asc';
					}
					else if(item.styleIndex == 2){
						tab.sortDirection = 'desc';
					}
					tab.sortValue = value;
					tab.currentPage = 1;
					$scope.decQuery(tab);
				};
				
				/**
				 * 依照TAB查詢資料
				 */
				$scope.query = function(tab){
					
					if(tab.name == 'INSTALL_OPERATE'){
						if(undefined == tab.sortValue){
							tab.sortDirection = 'asc';
							tab.sortValue = 'MfrNo';
							tab.label[tab.sortValue].style = $scope.sortStyle[1];
							tab.label[tab.sortValue].styleIndex = 1;
						}
						tab.offset = tab.currentPage-1;
						var data = {
							facNo : $scope.facNo,
							offset : tab.offset,
							sortDirection : tab.sortDirection,
							sortValue : tab.sortValue
						};
						restService.execute('rest/licenseView/queryInstallOperate', data).then(function(response) {
							$scope.installOperateList = response.installOperateList;
							$scope.calPage($scope.tab1, response.installOperateLength);
						}, function(error) {

						});
					}
					else if(tab.name == 'FUEL_RIGHT'){
						if(undefined == tab.sortValue){
							tab.sortDirection = 'asc';
							tab.sortValue = 'PerNo';
							tab.label[tab.sortValue].style = $scope.sortStyle[1];
							tab.label[tab.sortValue].styleIndex = 1;
						}
						tab.offset = tab.currentPage-1;
						var data = {
							facNo : $scope.facNo,
							offset : tab.offset,
							sortDirection : tab.sortDirection,
							sortValue : tab.sortValue
						};
						restService.execute('rest/licenseView/queryFuelRight', data).then(function(response) {
							$scope.fuelRightList = response.fuelRightList;
							$scope.calPage($scope.tab2, response.fuelRightListLength);
						}, function(error) {

						});
					}
					else if(tab.name == 'PENALTY'){
						if(undefined == tab.sortValue){
							tab.sortDirection = 'desc';
							tab.sortValue = 'PenaltyDate';
							tab.label[tab.sortValue].style = $scope.sortStyle[1];
							tab.label[tab.sortValue].styleIndex = 1;
						}
						tab.offset = tab.currentPage-1;
						var data = {
							facNo : $scope.facNo,
							offset : tab.offset,
							sortDirection : tab.sortDirection,
							sortValue : tab.sortValue
						};
						restService.execute('rest/penalty/queryPenalty', data).then(function(response) {
							$scope.penaltyList = response.penaltyList;
							$scope.calPage($scope.tab7, response.penaltyListLength);
						}, function(error) {

						});
					}
					
					$('html,body').animate({scrollTop:$('#lvtab').offset().top}, 150);
				};
				
				/**
				 * 燃料成份控制器
				 */
				function fuelCompController($scope, $modalService, restService, param) {

					$scope.sortStyle = ['','fas fa-caret-up','fas fa-caret-down'];
					$scope.title = ['PerNo', 'ClassCode', 'ApprovalQty', 'UnitCode'
						, 'EffDate', 'AvlDate', 'Name', 'CompMax', 'CompMin', 'Remark'];
					$scope.label = [];
					
					$scope.query = function(){
						var data = {
							facNo : param.facNo, 
							perNo : param.perNo,
							sortDirection : $scope.sortDirection,
							sortValue : $scope.sortValue
						};
						restService.execute('rest/licenseView/queryFuelComp', data).then(function(response) {
							$scope.fuelCompList = response;
						}, function(error) {
							
						});
					};
					
					$scope.init = function() {
						
						//排序初始化
						for(var i=0;i<$scope.title.length;i++){
							var tmp = {
								styleIndex : 0,
								style :  $scope.sortStyle[0]
							}
							$scope.label[$scope.title[i]] = tmp;
						}
						
						$scope.sortValue = 'Name';
						$scope.sortDirection = 'asc';
						$scope.label[$scope.sortValue].style = $scope.sortStyle[1];
						$scope.label[$scope.sortValue].styleIndex = 1;
						
						$scope.query();
					};
					$scope.init();
					
					//關閉modal
		    		$scope.close = function() {
		    			$modalService.close();
		    		};
		    	
		    		/**
					 * 排序
					 */
					$scope.sort = function(value){
						if($scope.fuelCompList.length == 0){
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
						$scope.sortValue = value;
						$scope.query();
					};
					
		    	};
				
		    	/**
		    	 * 檢視燃料成份
		    	 */
				$scope.showFuelComp = function(perNo){
					$modalService.open(fuelCompController, 'views/license/fuel_comp_pop.html', 
							{
								facNo : $scope.facNo,
								perNo : perNo
							}, 
							function() {
							}, 
							function() {
							}
					);
				};
				
				
				function pipeMapController($scope, $modalService, restService, param) {
					
					
					$scope.init = function(mapDom) {
						
						$scope.eastTm = param.eastTm;
						$scope.northTm = param.northTm;
						$scope.pipeLimitList = param.pipeLimitList;
						
						var pOMap = mapDom;
						var pMap = new TGOS.TGOnlineMap(pOMap, TGOS.TGCoordSys.EPSG3826); //宣告TGOnlineMap地圖物件並設定坐標系統
						var markerImg = new TGOS.TGImage("https://api.tgos.tw/TGOS_API/images/marker.png", new TGOS.TGSize(38, 33), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(10, 33));
						
						var pData = new TGOS.TGData({map: pMap});  //建立幾何圖層物件
						var style =  {
								fillColor: "none"
							};
						
						pData.setStyle(style);
						pData.setMap(pMap);  //設定呈現幾何圖層物件的地圖物件
						$scope.markerPoint = new TGOS.TGPoint($scope.eastTm, $scope.northTm);
						$scope.pTGMarker = new TGOS.TGMarker(pMap, $scope.markerPoint, "大門位置", markerImg);
						
						$scope.markerPointList = [];
						$scope.pTGMarkerList = [];
						for(var i=0; i<$scope.pipeLimitList.length ; i++){
							var tmp = $scope.pipeLimitList[i];
							$scope.markerPointList[i] = new TGOS.TGPoint(tmp.eastTm, tmp.northTm);
							$scope.pTGMarkerList[i] = new TGOS.TGMarker(pMap, $scope.markerPointList[i], "排放管道", markerImg);
						}

						//加入Marker(地圖物件,Marker坐標,Marker標題,Marker圖案)
						pMap.setCenter(new TGOS.TGPoint($scope.eastTm,$scope.northTm));
						pMap.setZoom(8);
						
					};
//					$scope.init();
					//關閉modal
		    		$scope.close = function() {
		    			$modalService.close();
		    		};
					
		    	};
		    	
				/**
				 * 手機版檢視地圖
				 */
				$scope.showMap = function(){
					$modalService.openMap({
						onComplete : function (scope, elem) {
							var mapDom = angular.element(elem).find('#TGMapPhone');
							scope.init(mapDom[0]);
						  }
					}, pipeMapController, 'views/license/pipe_map_pop.html', 
							{
								eastTm : $scope.eastTm,
								northTm : $scope.northTm,
								pipeLimitList : $scope.pipeLimitList
							}, 
							function() {
							}, 
							function() {
							}
					);
				};
				
				/**
				 * 技師資料控制器
				 */
				function technicianController($scope, $modalService, restService, param) {
					$scope.init = function() {
						var data = {
								facNo : param.facNo, 
								aplNo : param.aplNo,
								mfrNo : param.mfrNo,
								perNo : param.perNo
							};
						restService.execute('rest/licenseView/queryTechnician', data).then(function(response) {
							$scope.mfrNo = response.mfrNo;
							$scope.mfrCode = response.mfrCode;
							$scope.mfrName = response.mfrName;
							$scope.perNo = response.perNo;
							$scope.effDate = response.effDate;
							$scope.avlDate = response.avlDate;
							$scope.techName = response.techName;
							$scope.licenceNo = response.licenceNo;
							$scope.companyName = response.companyName;
						}, function(error) {
							
						});
					};
					$scope.init();
					
					//關閉modal
		    		$scope.close = function() {
		    			$modalService.close();
		    		};
		    	};
		    	
				/**
				 * 檢視燃料
				 */
				$scope.showTechnician = function(item){
					$modalService.open(technicianController, 'views/license/per_technician_pop.html', 
							{
								facNo : $scope.facNo,
								perNo : item.perNo,
								aplNo : item.aplNo,
								mfrNo : item.mfrNo
							}, 
							function() {
							}, 
							function() {
							}
					);
				};
				
				/**
				 * 許可證資料控制器
				 */
				function licenceController($scope, $modalService, restService, param) {
					
					$scope.EQUIP_PIPE = 1;
					$scope.POLLUTANT = 2;
					$scope.CONTROL_EQUIP = 3;
					$scope.PIPELIMIT = 4;
					$scope.lcsTabIndex = $scope.EQUIP_PIPE;
					
					$scope.sortStyle = ['', 'fas fa-caret-up', 'fas fa-caret-down'];
					$scope.lcsTab1 = {
						name : 'EQUIP_PIPE',
						title : ['MfrNo', 'MfrName', 'EquipNo', 'EquipName', 'Monitor', 'MonItem'],
						label : []
					};
					$scope.lcsTab2 = {
						name : 'POLLUTANT',
						title : ['EquipNo', 'EquipName', 'ColKind', 'EquipCol', 'PipeNo', 'PollName', 'YearDischarge'],
						label : []
					};
					$scope.lcsTab3 = {
						name : 'CONTROL_EQUIP',
						title : ['EquipNo', 'EquipCode', 'EquipName', 'GasHanMin', 'GasHanMax', 'GasEffeRatio'],
						label : []
					};
					$scope.lcsTab4 = {
						name : 'PIPELIMIT',
						title : ['PipeNo', 'PipeHeight', 'PipeLength', 'PipeWidth', 'PipeNorthTm2', 'PipeEastTm2'],
						label : []
					};
					
					$scope.lcsTabs = [$scope.lcsTab1, $scope.lcsTab2, $scope.lcsTab3, $scope.lcsTab4];
					
					/**
					 * 點擊頁籤
					 */
					$scope.activeLicenseTab = function(index){
						$scope.lcsTabIndex = index;
						if($scope.EQUIP_PIPE == index){
							$scope.lcsQuery($scope.lcsTab1);
						}
						else if($scope.POLLUTANT == index){
							$scope.lcsQuery($scope.lcsTab2);
						}
						else if($scope.CONTROL_EQUIP == index){
							$scope.lcsQuery($scope.lcsTab3);
						}
						else if($scope.PIPELIMIT == index){
							$scope.lcsQuery($scope.lcsTab4);
						}
					};
					
					/**
					 * 排序
					 */
					$scope.lcsSort = function(tab, value){
						if(tab.name == 'EQUIP_PIPE'){
							if($scope.equipPipeList.length == 0){
								return;
							}
						}
						else if(tab.name == 'POLLUTANT'){
							if($scope.pollutantList.length == 0){
								return;
							}
						}
						else if(tab.name == 'CONTROL_EQUIP'){
							if($scope.controlEquipList.length == 0){
								return;
							}
						}
						else if(tab.name == 'PIPELIMIT'){
							if($scope.pipeLimitList.length == 0){
								return;
							}
						}
						
						var item = angular.copy(tab.label[value]);
						item.styleIndex = (item.styleIndex + 1) % 3;
						if(item.styleIndex == 0){
							item.styleIndex = 1;
						}
						item.style = $scope.sortStyle[item.styleIndex];
						
						for(var i=0; i<tab.title.length;i++){
							var tmp = tab.label[tab.title[i]];
							tmp.styleIndex = 0;
							tmp.style =  $scope.sortStyle[0];
						}
						tab.label[value] = item;
						
						if(item.styleIndex == 1){
							tab.sortDirection = 'asc';
						}
						else if(item.styleIndex == 2){
							tab.sortDirection = 'desc';
						}
						tab.sortValue = value;
						$scope.lcsQuery(tab);
					};
					
					$scope.initLcsTabSort = function(){
						
						for(var i=0; i<$scope.lcsTabs.length;i++){
							var tab = $scope.lcsTabs[i];
							for(var j=0;j<tab.title.length;j++){
								var tmp = {
										styleIndex : 0,
										style :  $scope.sortStyle[0]
								};
								tab.label[tab.title[j]] = tmp;
							}
						}
					};
					
					$scope.lcsQuery = function(tab){
						
						if(tab.name == 'EQUIP_PIPE'){
							if(undefined == tab.sortValue){
								tab.sortDirection = 'asc';
								tab.sortValue = 'EquipNo';
								tab.label[tab.sortValue].style = $scope.sortStyle[1];
								tab.label[tab.sortValue].styleIndex = 1;
							}
							var data = {
									facNo : param.facNo, 
									aplNo : param.aplNo,
									mfrNo : param.mfrNo,
									perNo : param.perNo,
									sortDirection : tab.sortDirection,
									sortValue : tab.sortValue
							};
							restService.execute('rest/licenseView/queryEquipPipe', data).then(function(response) {
								$scope.equipPipeList = response;
							}, function(error) {
								
							});
						}
						else if(tab.name == 'POLLUTANT'){
							if(undefined == tab.sortValue){
								tab.sortDirection = 'asc';
								tab.sortValue = 'EquipNo';
								tab.label[tab.sortValue].style = $scope.sortStyle[1];
								tab.label[tab.sortValue].styleIndex = 1;
							}
							var data = {
									facNo : param.facNo, 
									aplNo : param.aplNo,
									mfrNo : param.mfrNo,
									perNo : param.perNo,
									sortDirection : tab.sortDirection,
									sortValue : tab.sortValue
							};
							restService.execute('rest/licenseView/queryPollutant', data).then(function(response) {
								$scope.pollutantList = response;
							}, function(error) {
								
							});
						}
						else if(tab.name == 'CONTROL_EQUIP'){
							if(undefined == tab.sortValue){
								tab.sortDirection = 'asc';
								tab.sortValue = 'EquipNo';
								tab.label[tab.sortValue].style = $scope.sortStyle[1];
								tab.label[tab.sortValue].styleIndex = 1;
							}
							var data = {
									facNo : param.facNo, 
									aplNo : param.aplNo,
									mfrNo : param.mfrNo,
									perNo : param.perNo,
									sortDirection : tab.sortDirection,
									sortValue : tab.sortValue
							};
							restService.execute('rest/licenseView/queryControlEquip', data).then(function(response) {
								$scope.controlEquipList = response;
							}, function(error) {
								
							});
						}
						else if(tab.name == 'PIPELIMIT'){
							if(undefined == tab.sortValue){
								tab.sortDirection = 'asc';
								tab.sortValue = 'PipeNo';
								tab.label[tab.sortValue].style = $scope.sortStyle[1];
								tab.label[tab.sortValue].styleIndex = 1;
							}
							var data = {
									facNo : param.facNo, 
									aplNo : param.aplNo,
									mfrNo : param.mfrNo,
									perNo : param.perNo,
									sortDirection : tab.sortDirection,
									sortValue : tab.sortValue
							};
							restService.execute('rest/licenseView/queryPipeLimit', data).then(function(response) {
								$scope.pipeLimitList = response;
							}, function(error) {
								
							});
						}
					};
					
					$scope.init = function() {
						$scope.perNo = param.perNo;
						$scope.mfrNo = param.mfrNo;
						$scope.mfrName = param.mfrName;
						$scope.facNo = param.facNo;
						$scope.facName = param.facName;
						
						$scope.initLcsTabSort();
						
						$scope.lcsQuery($scope.lcsTab1);
					};
					$scope.init();
					
					//關閉modal
		    		$scope.close = function() {
		    			$modalService.close();
		    		};
		    	
		    	};
		    	
				/**
				 * 檢視許可證資料
				 */
				$scope.showLicence = function(item){
					$modalService.open(licenceController, 'views/license/license_info_pop.html',
							{
								facNo : $scope.facNo,
								perNo : item.perNo,
								aplNo : item.aplNo,
								mfrNo : item.mfrNo,
								mfrName : item.mfrName,
								facName : $scope.facName
							}, 
							function() {
							}, 
							function() {
							}
					);
				};
				
			} ]);
});