"use strict";
define([ 'app' ], function(app) {
	app.controller('commQuestionAskController', [ 
		'$scope', '$rootScope', 'restService', '$routeParams', '$modalService',
		function($scope, $rootScope, restService, $routeParams, $modalService) {

			/**
			 * 初始化
			 */
			$scope.init = function() {
				
				//初始選項查詢
				restService.execute('rest/commQuest/init/'+$routeParams.sn).then(function(response) {
					if (null == response || "" === response) {
						//狀態為駁回，不可檢視，直接導回清單頁
						window.location='#/rcq';
					} else {
						$scope.facNo = response.facNo;
						$scope.facName = response.facName;
						$scope.publicDate = response.publicDate;
						$scope.cityList = response.cityList;
					}
				}, function(error) {

				});
				
				$scope.data = {
					sn: $routeParams.sn,
					question: '',
					name: '',
					cityCode: null,
					townCode: null,
					detailAddr: '',
					email: '',
					phoneNumber: ''
				};
				
				$scope.townList = [];
			};
			$scope.init();
			
			/**
			 * 縣市選項變動
			 */
			$scope.changeCity = function(){
				
				restService.execute('rest/common/getTownOptions/'+$scope.data.cityCode).then(function(response) {
					$scope.townList = response;
					$scope.data.townCode = null;
				}, function(error) {

				});
			};
			
			/**
			 * 存檔
			 */
			$scope.save = function(form){
				
				var errors = "";
				if (form.question.$invalid) {
					errors += "請輸入問題或建議\r\n";
				}
				if (form.name.$invalid) {
					errors += "請輸入姓名\r\n";
				}
				if (form.cityCode.$invalid) {
					errors += "請選擇縣市\r\n";
				}
				if (form.townCode.$invalid) {
					errors += "請選擇鄉鎮\r\n";
				}
				if (form.detailAddr.$invalid) {
					errors += "請輸入詳細地址\r\n";
				}
//				if (form.email.$invalid) {
//					errors += "電子信箱格式錯誤\r\n";
//				}
				if (form.phoneNumber.$invalid) {
					errors += "請輸入聯絡電話\r\n";
				}
				
				if (errors !== "") {
					$modalService.error(errors);
				} else {
					restService.execute('rest/commQuest/add', $scope.data).then(function(response) {
						alert("提交成功");
						//導頁到哪？
						window.location='#/rcqq/' + $routeParams.sn;
					}, function(error) {

					});
				}
			};
		}
	]);
});