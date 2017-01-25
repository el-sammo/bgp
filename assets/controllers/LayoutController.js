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

		$scope.accessAccount = false;
		$scope.activeCart = false;

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		$scope.showAccount = function() {
			$rootScope.$broadcast('showAccount');
		}

		$scope.showOrder = function() {
			$rootScope.$broadcast('showOrder');
		}


		$rootScope.$on('itemAdded', function(evt, customer) {
			$scope.activeCart = true;
			var sessionPromise = customerMgmt.getSession();
			sessionPromise.then(function(sessionData) {
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
			$scope.feedback = layoutMgmt.feedback;
		});

		$rootScope.$on('customerLoggedIn', function(evt, args) {
			$scope.accessAccount = true;
			$scope.customerId = args;
			$rootScope.$broadcast('orderChanged');
		});

	}

}());
