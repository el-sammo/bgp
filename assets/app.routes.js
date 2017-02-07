(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Routes
	///

	app.config(config);
	
	config.$inject = [
		'$routeProvider', '$locationProvider'
	];
	
	function config($routeProvider, $locationProvider) {
		///
		// Tester Page
		///

		$routeProvider.when('/tester', {
			controller: 'TesterController',
			templateUrl: '/templates/tester.html'
		});


		///
		// Home
		///

		$routeProvider.when('/:id', {
			controller: 'HomeController',
			templateUrl: '/templates/home.html'
		});


		///
		// Other
		///

		$routeProvider.otherwise({
			controller: 'HomeController',
			templateUrl: '/templates/home.html'
		});


		///
		// HTML5 Routing (no hash)
		///
		
		$locationProvider.html5Mode(true);
	}

}());
