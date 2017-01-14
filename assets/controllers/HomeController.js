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
	'customerMgmt', 'orderMgmt', 'popcornMgmt', 'categoryMgmt',
	'messenger', 
	'lodash',
];

function controller(
	$scope, $http, $routeParams, $rootScope, $location,
	$modal, $timeout, $window,
	signupPrompter, deviceMgr, layoutMgmt, 
	customerMgmt, orderMgmt, popcornMgmt, categoryMgmt,
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
		initCategories();

		$scope.logIn = layoutMgmt.logIn;
		$scope.signUp = layoutMgmt.signUp;
		$scope.logOut = layoutMgmt.logOut;

		$scope.showCategory = showCategory;
		$scope.showFlavor = showFlavor;

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

	function initCategories() {
		categoryMgmt.getAllCategories().then(
			onGetCategories
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

	function onGetCategories(allCategoriesData) {
		$scope.popcornCategories = allCategoriesData;
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
	
			showCategory();
			showFlavor();
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
		if(!category) {
			popcornMgmt.getPopcornByCategory($scope.popcornCategories[0].id).then(function(categoryFlavors) {
				$scope.categoryFlavors = categoryFlavors;
			});
			$scope.CandyShow = true;
		} else {
			hideCategories();
			popcornMgmt.getPopcornByCategory(category.id).then(function(categoryFlavors) {
				$scope.categoryFlavors = categoryFlavors;
			});
			switch(category.name) {
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
	}

	function showFlavor(flavor) {
		if(!flavor) {
			popcornMgmt.getPopcornByCategory($scope.popcornCategories[0].id).then(function(categoryFlavors) {
				$scope.activeFlavorImgSrc = "/images/popcorn_images/" + categoryFlavors[0].name.toLowerCase().replace('\'', '').replace(/ /g, '_') + ".jpg";
				$scope.activeFlavorDesc = categoryFlavors[0].description;
				showDescription(categoryFlavors[0]);
			});
		} else {
			$scope.activeFlavorDesc = flavor.description;
			$scope.activeFlavorImgSrc = "/images/popcorn_images/" + flavor.name.toLowerCase().replace('\'', '').replace(/ /g, '_') + ".jpg";
			showDescription(flavor);
		}
	}

	showDescription(flavor) {
		$scope.flavor
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


	///
	// Debugging methods
	///
	
	function debugLog(msg) {
		var args = Array.prototype.slice.call(arguments);
		console.log.apply(console, args);
	}
}

}());
