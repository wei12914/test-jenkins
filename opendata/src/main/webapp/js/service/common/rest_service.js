"use strict";
define(['app'], function(app) {
	var httpMethod = {
		'GET' : 'get',
        'HEAD' : 'head',
        'POST' : 'post',
        'PUT' : 'put',
        'DELETE' : 'delete',
        'JSONP' : "jsonp"
	};
	
	/**
	 * @ngdoc method
	 * 
	 * @description 依據傳入的方式呼叫後端網址，預設為 POST。
	 * 
	 * @param {string=}
     *            url 欲呼叫後端的網址。
     * @param {Object=}
     *            data 送到後端的資料。
     * @param {Object=}
     *            options 參數物件。
	 */
	var resourceService = function($http, $q, $modalService) {
		
		var responseWrapper = function(response, uiblocking, omitAlerts, targetAlerts) {
	        var result = {};
	        var data = null;
	        var alerts = null;
	        
	        // 調整資料結構
	        if (response.data != undefined && response.data != null) {
	        	if(response.status == 501){
	        		$modalService.error(response.data);
	        	}
	        	else if (response.data.hasOwnProperty('data')) {
	                data = response.data.data;
	            } 
	        	else {
	                data = response.data;
	            }
	        }
	        
	        if (uiblocking) $.unblockUI();
	        
	        result.data = data;
	        return result;
	    };
	    
	    var promiseWrapper = function(promise) {
	        var then = promise.then;
	        promise.then = function(success, fail) {
	            var successF = function(response) {
	                if (angular.isFunction(success)) {
	                    return success(response.data, response.alerts);
	                }
	            };
	            var errorF = function(response) {
	                if (angular.isFunction(fail)) {
	                    return fail(response);
	                }
	            };
	            return then.call(promise,successF,errorF);
	        };
	        
	        return promise;
	    };
		
		var resourceWrapper = {};
		
		/**
		 * resourceWrapper.execute method used to send AJAX request and
		 * wrapped request data in RequestBody.
		 */
		resourceWrapper.execute = function(url, data, options) {
			var method = "POST";
			var uiblocking = true;
            if (options) {
                uiblocking = options.uiblocking === undefined ? uiblocking : options.uiblocking;
                method = options.method === undefined ? "POST" : options.method;
            }
            
            if (uiblocking) {
            	$.blockUI({ 
        			message: '處理中，請稍候！', 
        			css: {
    	                border: 'none', 
    	                padding: '15px', 
    	                backgroundColor: '#000', 
    	                '-webkit-border-radius': '10px', 
    	                '-moz-border-radius': '10px', 
    	                opacity: .5, 
    	                color: '#fff'
        			},
        			baseZ: 9999
    			});
            }
            
			var deferred = $q.defer();
			var req = {
				url:url,
				data:data,
				method:method,
			};
			var promise = $http(req);
			
			promise.then(function(response) {
              deferred.resolve(responseWrapper(response, uiblocking));
            }, function(response) {
              deferred.reject(responseWrapper(response, uiblocking));
            });
            return promiseWrapper(deferred.promise);
		};
		
		var pageOpenAction = function(url, params, openType) {
			var openWindow = window.open(url, openType);
			openWindow.onload = function() {
				if (!params) {
					return ;
				}
				for (var key in params) {
					if (!params.hasOwnProperty(key)) {
						continue;
					}
					var keyElement = openWindow.document.getElementById(key);
					if (!keyElement) {
						continue;
					}
					keyElement.value = params[key];
				}
			};
		};
		
		/**
		 * resourceWrapper.openWindow method used to open page on another tab 
		 * and set page element values by id which are the key of given params 
		 * object field name and value.
		 */
		resourceWrapper.openWindow = function(url, params) {
			pageOpenAction(url, params, "_blank");
		};
		
		/**
		 * resourceWrapper.redirectPage method used to redirect page on same tab 
		 * and set page element values by id which are the key of given params 
		 * object field name and value.
		 */
		resourceWrapper.redirectPage = function(url, params) {
			pageOpenAction(url, params, "_self");
		};
		
		return resourceWrapper;
	};
	
	app.factory('restService', ['$http', '$q', '$modalService', resourceService]);
});