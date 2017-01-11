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
	customerMgmt, orderMgmt, popcornMgmt,
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

		$scope.showCategory = showCategory;

		$scope.account = account;

		// For debugging
		$scope.debugLog = debugLog;

		$rootScope.$on('customerLoggedIn', onCustomerLoggedIn);
	}

	function initDate() {
		var monthMap = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		var dateObj = new Date();
		$scope.month = monthMap[dateObj.getMonth()];
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
	
			var popcornCategories = [];
			allPopcornData.forEach(function(flavor) {
				if(popcornCategories.indexOf(flavor.category) < 0) {
					popcornCategories.push(flavor.category);
				}
				flavor.cleanName = "/images/popcorn_images/" + flavor.name.toLowerCase().replace('\'', '').replace(/ /g, '_') + ".jpg";
			});
			$scope.popcornCategories = popcornCategories;
			$scope.allPopcornFlavors = allPopcornData;
			showCategory();
console.log('$scope.popcornCategories:');
console.log($scope.popcornCategories);
console.log('$scope.allPopcornFlavors:');
console.log($scope.allPopcornFlavors);
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


	function hideCategories() {
		$scope.CandyShow = false;
		$scope.CaramelShow = false;
		$scope.CheeseShow = false;
		$scope.ChocolateShow = false;
		$scope.OriginalShow = false;
		$scope.SpecialtyShow = false;
	}

	function showCategory(category) {
		hideCategories();
		switch(category) {
			case 'Candy':
				$scope.CandyShow = true;
				break;
			case 'Caramel':
				$scope.CaramelShow = true;
				break;
			case 'Cheese':
				$scope.CheeseShow = true;
				break;
			case 'Chocolate':
				$scope.ChocolateShow = true;
				break;
			case 'Original':
				$scope.OriginalShow = true;
				break;
			case 'Specialty':
				$scope.SpecialtyShow = true;
				break;
			default:
				$scope.CandyShow = true;
		}
	}

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
