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
		'$rootScope', 'customerMgmt'
	];

	function controller(
		navMgr, pod, $scope,
		$http, $routeParams, $modal, layoutMgmt,
		$rootScope, customerMgmt
	) {

		$scope.accessAccount = false;

		var sessionPromise = customerMgmt.getSession();

		sessionPromise.then(function(sessionData) {
			if(sessionData.customerId) {
				$scope.accessAccount = true;
				$scope.customerId = sessionData.customerId;
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
