"use strict";
define(['app'], function(app) {
	app.factory('$modalService', [
        '$mdDialog',
        function(
            $mdDialog
        ) {
            var $service = {
            	open : openDialog,
            	close: closeDialog,
            	openMap : openMapDialog,
            	error : openErrorDialog,
            	success : openSuccessDialog
            };
        	
            return $service;

            function errorMessageCtrl($scope, $mdDialog, items) {
        		$scope.message = items.message;
        		$scope.close = function() {
        			$mdDialog.cancel();
        		};
        	};
        	
        	function successMessageCtrl($scope, $mdDialog, items) {
        		$scope.message = items.message;
        		$scope.close = function() {
        			$mdDialog.cancel();
        		};
        	};
            
            function openDialog(controller, viewUrl, param, onSuccess, onCancel) {
            	var options = {
	 		      controller: controller,
	   		      templateUrl: viewUrl,
	   		      locals : {
	   		    	param:param
	   		      },
	   		      bindToController:true,
	   		      parent: angular.element(document.body),
	   		      clickOutsideToClose:false,
	   		      fullscreen: true
	   		    };
            	
            	$mdDialog.show(options).then(onSuccess, onCancel);
            };
            
            function openMapDialog(opts, controller, viewUrl, param, onSuccess, onCancel) {
            	var options = {
  	 		      controller: controller,
  	   		      templateUrl: viewUrl,
  	   		      locals : {
  	   		    	param:param
  	   		      },
  	   		      bindToController:true,
  	   		      parent: angular.element(document.body),
  	   		      clickOutsideToClose:false,
  	   		      fullscreen: true
  	   		    };
            	
            	var option = angular.extend(options, (opts || {}));
              	
              	$mdDialog.show(option).then(onSuccess, onCancel);
            };
            
            
            /**
			 * 開啟錯誤畫面
			 */
            function openErrorDialog(message) {
            	var options = {
            			templateUrl: 'views/common/error_pop.html',
					    controller: errorMessageCtrl,
					    resolve: {
					    	items: function () {
					            return {
					            	message : message
					            };
					        }
					    },
		   		      	parent: angular.element(document.body),
		   		      	clickOutsideToClose: true
  	   		    };
            	
            	$mdDialog.show(options);
			};
            
			/**
			 * 開啟錯誤畫面
			 */
            function openSuccessDialog(message) {
            	var options = {
            			templateUrl: 'views/common/success_pop.html',
					    controller: successMessageCtrl,
					    resolve: {
					    	items: function () {
					            return {
					            	message : message
					            };
					        }
					    },
		   		      	parent: angular.element(document.body),
		   		      	clickOutsideToClose: true
  	   		    };
            	
            	$mdDialog.show(options);
			};
			
            function closeDialog(param) {
            	$mdDialog.hide(param);
            };
        }
    ]);

});