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
		// About
		///

		$routeProvider.when('/about', {
			controller: 'AboutController',
			templateUrl: '/templates/about.html'
		});


		///
		// Account
		///

		$routeProvider.when('/account', {
			controller: 'AccountController',
			templateUrl: '/templates/account.html'
		});

		$routeProvider.when('/account/edit/:id', {
			controller: 'AccountEditController',
			templateUrl: '/templates/accountForm.html'
		});


		///
		// Contact
		///

		$routeProvider.when('/contact', {
			controller: 'ContactController',
			templateUrl: '/templates/contact.html'
		});


		///
		// FAQ
		///

		$routeProvider.when('/faq', {
			controller: 'FaqController',
			templateUrl: '/templates/faq.html'
		});


		///
		// Import
		///

		$routeProvider.when('/import-lb-20160725-v1', {
			controller: 'ImportController',
			templateUrl: '/templates/import.html'
		});


		///
		// Home
		///

		$routeProvider.when('/', {
			controller: 'HomeController',
			templateUrl: '/templates/home.html'
		});


		///
		// Story
		///

		$routeProvider.when('/story', {
			controller: 'StoryController',
			templateUrl: '/templates/story.html'
		});


		///
		// TOS
		///

		$routeProvider.when('/tos', {
			controller: 'TosController',
			templateUrl: '/templates/tos.html'
		});


		///
		// Other
		///

		$routeProvider.otherwise({
			redirectTo: '/'
		});


		///
		// HTML5 Routing (no hash)
		///
		
		$locationProvider.html5Mode(true);
	}

}());
