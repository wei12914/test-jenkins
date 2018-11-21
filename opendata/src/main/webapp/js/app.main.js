require.config({
	baseUrl: './',
	
	paths: {
		'jquery': 'lib/jquery/dist/jquery.min',
		'bootstrap': 'lib/bootstrap/bootstrap.min',
		'angular': 'lib/angular-1.7.2/angular.min',
		'angular-route': 'lib/angular-route-1.7.2/angular-route.min',
		'angularAMD': 'lib/angularAMD/angularAMD',
		'angular-animate': "lib/angular-animate-1.7.2/angular-animate.min",
	    'angular-aria': "lib/angular-aria-1.7.2/angular-aria.min",
		'angular-material': "lib/angular-material/angular-material.min",
//		'd3': 'lib/d3/d3.v4.min',
		'app': 'js/app'
	},
	
	shim: {
		'angular' : { exports: 'angular' },
		'jquery' : { exports: 'jquery' },
		'bootstrap' : { deps: ['jquery'] },
		'angular-route': { deps: ['angular'] },
		'angularAMD':  { deps: ['angular'] },
		'angular-animate': { deps: ['angular'] },
		'angular-aria': { deps: ['angular'] },
		'angular-material': { deps: ['angular'] }
//		'd3': { exports: 'd3' }
	},
	
	deps: ['app',
		'js/service/common/common_service',
		'js/service/common/rest_service',
		'js/service/common/modal_service',
		'js/service/common/filter_service',
		'lib/My97DatePicker/WdatePicker',
		'lib/blockUI/jquery.blockUI'
	       ]
});