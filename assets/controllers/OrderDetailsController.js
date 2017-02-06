(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controller: Order
	///

	app.config(config);

	config.$inject = [
		'httpInterceptorProvider'
	];

	function config(httpInterceptorProvider) {
		httpInterceptorProvider.register(/^\/order/);
	}


	app.controller('OrderDetailsController', controller);
	
	controller.$inject = [
		'$window', '$scope', '$http', '$routeParams', '$modal', '$timeout',
		'$rootScope', '$q', '$sce', 'orderMgmt', 'signupPrompter',
		'querystring', 'configMgr', 'customerMgmt'
	];

	function controller(
		$window, $scope, $http, $routeParams, $modal, $timeout,
		$rootScope, $q, $sce, orderMgmt, signupPrompter,
		querystring, configMgr, customerMgmt
	) {

		function refreshData() {
			// assure that the page is still the same
			// must use pathname on https sites
			if(!location.pathname.match('order')) {
				return;
			}
			var sessionPromise = customerMgmt.getSession();

			sessionPromise.then(function(sessionData) {
				/*
				if(!sessionData.customerId) {
					$window.location.href = '/';
					return;
				}
				*/

				var r = $http.get('/orders/' + $routeParams.id);
			
				r.error(function(err) {
					console.log('OrderDetailsController: orders ajax failed');
					console.error(err);
				});
			
				r.then(function(res) {
					$scope.order = res.data;

					if(!$scope.order.customerId == sessionData.customerId) {
						$window.location.href = '/';
						return;
					}

					var statusMap = [
						'',
						'',
						'',
						'',
						'',
						'Payment Accepted',
						'Preparation Started',
						'Preparation Completed',
						'En Route to Destination',
						'Delivered to Destination'
					];

					var currOrderStatus = parseInt($scope.order.orderStatus);

					$scope.orderStatusFormatted = statusMap[currOrderStatus];

					$scope.orderDate = new Date($scope.order.paymentAcceptedAt).toDateString().substr(4);

					$scope.paymentAcceptedAtFormatted = new Date($scope.order.paymentAcceptedAt).toTimeString().substr(0,5);
					$scope.placedAtFormatted = new Date($scope.order.orderPlacedAt).toTimeString().substr(0,5);
					$scope.collectedAtFormatted = new Date($scope.order.orderCollectedAt).toTimeString().substr(0,5);
					$scope.deliveredAtFormatted = new Date($scope.order.orderDeliveredAt).toTimeString().substr(0,5);

					$scope.orderStatus = parseInt($scope.order.orderStatus);
					$scope.paymentMethod = $scope.order.paymentMethods;
					$scope.subtotal = parseFloat($scope.order.subtotal).toFixed(2);
					$scope.tax = parseFloat($scope.order.tax).toFixed(2);
					$scope.shipping = parseFloat($scope.order.shippingCost).toFixed(2);
					$scope.discount = parseFloat($scope.order.discount).toFixed(2);
					$scope.total = '$'+parseFloat($scope.order.total).toFixed(2);
					$scope.bevThings = $scope.order.bevThings;

					customerMgmt.getCustomer($scope.order.customerId).then(function(customer) {
						$scope.customer = customer;
						$scope.fName = $scope.customer.fName;
						$scope.lName = $scope.customer.lName;
						$scope.phone = $scope.customer.phone;
						$scope.address = $scope.customer.addresses.primary.streetNumber+' '+$scope.customer.addresses.primary.streetName+' '+$scope.customer.addresses.primary.city;

//						$scope.src = $sce.trustAsResourceUrl(
//							'https://www.google.com/maps/embed/v1/place?' + querystring.stringify({
//								key: configMgr.config.vendors.googleMaps.key,
//								q: ([
//									$scope.customer.addresses.primary.streetNumber,
//									$scope.customer.addresses.primary.streetName,
//									$scope.customer.addresses.primary.city,
//									$scope.customer.addresses.primary.state,
//									$scope.customer.addresses.primary.zip
//								].join('+'))
//							})
//						);
					});
				});
			});

			$timeout(function() {
				refreshData();
			}, 30000);
		}
		refreshData();

	}

}());
