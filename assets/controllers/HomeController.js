(function() {
"use strict";

var app = angular.module('app');

///
// Controllers: Home
///

app.controller('HomeController', controller);

controller.$inject = [
	'$scope', '$http', '$routeParams', '$rootScope', '$location', 
	'$modal', '$timeout', '$window',

	'signupPrompter', 'deviceMgr', 'layoutMgmt',
	'customerMgmt', 'orderMgmt', 'popcornMgmt',
	'messenger', 
	'lodash',
];

function controller(
	$scope, $http, $routeParams, $rootScope, $location,
	$modal, $timeout, $window,
	signupPrompter, deviceMgr, layoutMgmt, 
	customerMgmt, orderMgmt, popcornMgmt
	messenger, 
	_
) {
	///
	// Variable declaration
	///

	var todayDate;
	var legMap, partMap, amountMap, wagerAbbrevMap;


	///
	// Run initialization
	///

	init();


	///
	// Initialization
	///

	function init() {
		initDate();
		initPopcorn();

		$scope.logIn = layoutMgmt.logIn;
		$scope.signUp = layoutMgmt.signUp;
		$scope.logOut = layoutMgmt.logOut;

		$scope.account = account;

		// For debugging
		$scope.debugLog = debugLog;

		$rootScope.$on('customerLoggedIn', onCustomerLoggedIn);
	}

	function initDate() {
		var dateObj = new Date();
		var year = dateObj.getFullYear();
		var month = (dateObj.getMonth() + 1);
		var date = dateObj.getDate();

		if(month < 10) {
			month = '0' + month;
		}

		if(date < 10) {
			date = '0' + date;
		}

		todayDate = year + month + date;

		// debug code
		todayDate = 20160727;
	}

	function initPopcorn() {
		popcornMgmt.getAllPopcorn().then(
			onGetPopcorn
		);
	}

	///
	// Event handlers
	///
	
	function onCustomerLoggedIn(evt, args) {
		$scope.customerId = args;
		$scope.showLogin = false;
		$scope.showLogout = true;
		$scope.showSignup = false;

		var getCustomerPromise = customerMgmt.getCustomer($scope.customerId);
		getCustomerPromise.then(function(customer) {
			$scope.customer = customer;
		});
	}

	function onGetPopcorn(allPopcornData) {
		customerMgmt.getSession().then(function(sessionData) {

			if(sessionData.customerId) {
				$rootScope.customerId = sessionData.customerId;
				$scope.customerId = $rootScope.customerId;
				$scope.showLogin = false;
				$scope.showSignup = false;
				$scope.showLogout = true;

				var getCustomerPromise = customerMgmt.getCustomer($scope.customerId);
				getCustomerPromise.then(function(customer) {
					$scope.customer = customer;
				});

			} else {
				$scope.showLogin = true;
				$scope.showSignup = true;
				$scope.showLogout = false;
			}

			$scope.allPopcornData = allPopcornData;
		});
	}

	///
	// Balance methods
	///
	
	function updateBalance() {
		var getSessionPromise = customerMgmt.getSession();
		getSessionPromise.then(function(sessionData) {
			if(sessionData.customerId) {
				var getCustomerPromise = customerMgmt.getCustomer(sessionData.customerId);
				getCustomerPromise.then(function(customer) {
					$scope.customer = customer;
				});
			}
		});
	}


	///
	// View methods
	///


	function account() {
		if(!$scope.customerId) {
			layoutMgmt.logIn();
		} else {
			$location.path('/account');
		}
	}

	function getMinToPost(postTime) {
		var d = new Date();
		var nowMills = d.getTime();
		var difference = (postTime - nowMills);
		if(difference > 0) {
			return ' ('+parseInt(difference / 60000) + ' M)';
		} else {
			return;
		}
	}

	setTimeout(function() { 
		initPopcorn();
	}, 60000);

	///
	// Debugging methods
	///
	
	function debugLog(msg) {
		var args = Array.prototype.slice.call(arguments);
		console.log.apply(console, args);
	}
}

}());
