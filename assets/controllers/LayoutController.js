(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Layout Controller
	///


	app.controller('LayoutController', controller);
	
	controller.$inject = [
		'navMgr', 'pod', '$scope',
		'$http', '$routeParams', '$modal', 'layoutMgmt',
		'$rootScope', 'customerMgmt', 'deviceMgr'
	];

	function controller(
		navMgr, pod, $scope,
		$http, $routeParams, $modal, layoutMgmt,
		$rootScope, customerMgmt, deviceMgr
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		$scope.showMenu = false;

		$scope.menuClicked = function(forceValue) {
			if(! _.isUndefined(forceValue)) {
				$scope.showMenu = forceValue;
				return;
			}
			$scope.showMenu = !$scope.showMenu;
		}

		$scope.accessAccount = false;
		$scope.activeCart = false;

		$scope.showAccount = function() {
			$rootScope.$broadcast('showAccount');
		}

		$scope.showCareers = function() {
			$rootScope.$broadcast('showCareers');
		}

		$scope.showContact = function() {
			$rootScope.$broadcast('showContact');
		}

		$scope.showPrivacy = function() {
			$rootScope.$broadcast('showPrivacy');
		}

		$scope.showPopcorn = function() {
			$rootScope.$broadcast('showPopcorn');
		}

		$scope.showOrder = function() {
			$rootScope.$broadcast('showOrder');
		}

		$scope.showStory = function() {
			$rootScope.$broadcast('showStory');
		}


		$rootScope.$on('itemAdded', function(evt, customer) {
			$scope.activeCart = true;
			var sessionPromise = customerMgmt.getSession();
			sessionPromise.then(function(sessionData) {
				$scope.cartItemsCount = sessionData.order.things.length;
			});
		});

		$rootScope.$on('orderChanged', function(evt, customer) {
			var sessionPromise = customerMgmt.getSession();
			sessionPromise.then(function(sessionData) {
				if(sessionData.order.things.length > 0) {
					$scope.activeCart = true;
				} else {
					$scope.activeCart = false;
				}
				$scope.cartItemsCount = sessionData.order.things.length;
			});
		});

		$rootScope.$on('cartEmptied', function(evt, customer) {
			$scope.activeCart = false;
		});

		var sessionPromise = customerMgmt.getSession();

		sessionPromise.then(function(sessionData) {
			if(sessionData.customerId) {
				$scope.accessAccount = true;
				$scope.customerId = sessionData.customerId;
			}

			if(sessionData.order && sessionData.order.things && sessionData.order.things.length > 0) {
				$scope.activeCart = true;
				$scope.cartItemsCount = sessionData.order.things.length;
			}

			$scope.logIn = layoutMgmt.logIn;
			$scope.logOut = layoutMgmt.logOut;
			$scope.signUp = layoutMgmt.signUp;
		});

		$rootScope.$on('customerLoggedIn', function(evt, args) {
			$scope.accessAccount = true;
			$scope.customerId = args;
			$rootScope.$broadcast('orderChanged');
		});

	}

}());
