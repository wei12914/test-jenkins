"use strict";
define(['app'], function(app) {
	app.factory('$commonService', [
        '$rootScope',
        'restService',
        function(
            $rootScope,
            restService
        ) {
            var $service = {
            	isEmpty : isEmpty,
            	isNotEmpty : isNotEmpty,
            	openWindowWithPost : openWindowWithPost
            };

            return $service;
            
            /**
             * for Object, Date, String, Number, Array
             * if not contain tell to YB
             * 
             */
            function isEmpty(parm){
            	var value = angular.copy(parm);
            	if((angular.isUndefined(value))||(null == value)){
            		return true;
            	}
            	if(angular.isString(value)){
            		if(('' == value)||('' == value.trim())){
            			return true;
            		}
            	}
            	else if(angular.isNumber(value)){
            		if('' == value){
            			return true;
            		}
            	}
            	else if(angular.isArray(value)){
            		if(value.length<1){
            			return true;
            		}
            	}
            	else if(angular.isDate(value)){
            		//未實作
            	}
            	else if(angular.isObject(value)){
            		var x;
            		for(x in value){
            			return false;
            		}
            		return true;
            	}
            	return false;
            };
            
            /**
             * return true when parm has value
             */
            function isNotEmpty(parm){
            	return !isEmpty(parm);
            };
            
            function openWindowWithPost(url, data) {
                var newWindow = window.open(url, 'download');
                if (!newWindow) 
                	return false;
                var html = "";
                html += "<html><head></head><body><form id='formid' accept-charset='utf-8' method='post' action='" + url + "'>";
                Object.keys(data).forEach(function(property) {
                	  html += "<input type='hidden' type='text' name='" + property + "' value='" + data[property] + "'/>";
                });
                
                html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
                newWindow.document.write(html);
                return newWindow;
            };
        }
    ]);

});