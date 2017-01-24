(function() {
	'use strict';

	var app = angular.module('app');

	app.controller('CheckoutController', controller);
	
	controller.$inject = [
		'$scope', '$modalInstance', '$http', '$rootScope', '$location',
		'$timeout', '$window', 'args', 'messenger',
		'layoutMgmt', 'clientConfig', 'payMethodMgmt',
		'deviceMgr', 'bigScreenWidth', 'promoMgmt',
		'orderMgmt', 'customerMgmt'
	];

	function controller(
		$scope, $modalInstance, $http, $rootScope, $location,
		$timeout, $window, args, messenger,
		layoutMgmt, clientConfig, payMethodMgmt,
		deviceMgr, bigScreenWidth, promoMgmt,
		orderMgmt, customerMgmt
	) {

	//	if(!$scope.order || !$scope.order.customerId) {
	//		$modalInstance.dismiss('cancel');
	//	}

		$scope.currentlyAvailable = true;
		$scope.addBev = orderMgmt.addBev;
		$scope.clientConfig = clientConfig;
		$scope.validCode = true;
		$scope.effect;
		$scope.payMethod = {};

		// this exists to not process further if checkout is prohibited
		if(!args.order) {
			$modalInstance.dismiss('cancel');
			return;
		} else {

			$http.get('/orders/' +args.order.id).then(function(res) {
				$scope.order = res.data;

				$scope.currentTotal = parseFloat($scope.order.total);

				customerMgmt.getCustomer($scope.order.customerId).then(function(customer) {
					var foundCustomer = angular.copy(customer);
					var paymentMethods = foundCustomer.paymentMethods || [];

					paymentMethods.forEach(function(payMethod) {
						payMethod.lastFour = redactCC(payMethod.lastFour);
					});

					paymentMethods.push({id: 'cash', lastFour: 'Cash'});
					paymentMethods.push({id: 'newCard', lastFour: 'New Credit Card'});

					$scope.checkoutPaymentMethods = paymentMethods;

					$scope.customer = foundCustomer;
// TODO: when we start offering bevs, uncomment the
			// following line and delete the next line
//			$scope.sawBevTour = $scope.order.sawBevTour;
					$scope.sawBevTour = true;

// TODO: Add bevs at some point, generate a bevs api
// and uncomment the following block of code
//			var bevs = [];
//			$http.get('/bevs/').then(function(res) {
//				res.data.forEach(function(res) {
//					var thisBev = res;
//
//					$http.get('/bevOptions/byBevId/' + thisBev.id).then(function(res) {
//						thisBev.options = res.data;
//					}).catch(function(err) {
//						console.log('CheckoutController bevOptions ajax fail');
//						console.log(err);
//					});
//					bevs.push(thisBev);
//				});
//				$scope.bevs = bevs;
//			}).catch(function(err) {
//				console.log('CheckoutController bevs ajax fail');
//				console.log(err);
//			});

				}).catch(function(err) {
					console.log('CheckoutController: getCustomer ajax failed');
					console.error(err);
					$modalInstance.dismiss('cancel');
				});
			});
		}

		function redactCC(lastFour) {
			return 'XXXX-XXXX-XXXX-' + lastFour;
		}

		$scope.addPM = function() {
			var paymentData = {
				cardNumber: $scope.payMethod.cardNumber.toString(),
				expirationDate: $scope.payMethod.year + '-' + $scope.payMethod.month,
				cvv2: $scope.payMethod.cvv2
			};

			payMethodMgmt.addPM(paymentData).then(function(customer) {
				var payMethod = _.last(customer.paymentMethods);
				var pos = $scope.checkoutPaymentMethods.length - 2;
				$scope.checkoutPaymentMethods.splice(pos, 0, {
					id: payMethod.id,
					lastFour: redactCC(payMethod.lastFour)
				});
				$scope.selMethod = payMethod.id;
			}).catch(function(err) {
				if(err.duplicateCustomerProfile && err.duplicateCustomerProfileId > 0) {
					$scope.customer.aNetProfileId = err.duplicateCustomerProfileId;
					customerMgmt.updateCustomer($scope.customer).then($scope.addPM);
				}
				if(err.duplicatePaymentProfile) {
					if($($window).width() > bigScreenWidth) {
						console.log('showBig');
						$window.location.href = '/app/';
					} else {
						console.log('showSmall');
						$window.location.href = '/app/cart/';
					}
				}
			});
		};


		$scope.updateTotal = function() {
			var total = (parseFloat($scope.order.subtotal) + parseFloat($scope.order.tax)).toFixed(2);
			var promoDiscount = parseFloat(0.00);
			var currentTotal;

			if($scope.promo) {
				var promoCode = $scope.promo;
				promoMgmt.getPromo($scope.order.subtotal, promoCode, $scope.customer.id).then(function(feeDataObj) {
					var feeData = feeDataObj.data;
					if(feeData.success) {
						$scope.validCode = true;
						$scope.promoAmount = feeData.amount;

						$scope.codeEffect = 'Your order has been reduced by $' + (parseFloat(feeData.amount)).toFixed(2) + '!';

						currentTotal = (parseFloat(total) - parseFloat(feeData.amount)).toFixed(2);
						$scope.currentTotal = currentTotal;
					} else {
						$scope.validCode = false;
						$scope.reason = feeData.reason;

						currentTotal = (parseFloat(total) - parseFloat(promoDiscount)).toFixed(2);
						$scope.currentTotal = currentTotal;
					}
				});
			} else {
				$scope.codeEffect = ' ';
				$scope.reason = ' ';
				currentTotal = (parseFloat(total) - parseFloat(promoDiscount)).toFixed(2);
				$scope.currentTotal = currentTotal;
			}
		}

//		$scope.updateTotal();

		$scope.bevClose = function() {
			$scope.sawBevTour = true;
		};

		$scope.bevShow = function() {
			$scope.sawBevTour = false;
		};

		$scope.checkout = function() {
console.log('$scope.checkout() called');
			$scope.processing = true;
			$scope.paymentFailed = false;
			$scope.order.specDelInstr = $scope.specDelInstr;
			$scope.order.paymentInitiatedAt = new Date().getTime();

			var thisPromoCode = 'nopromocodespecified';
			var thisSpecDelInstr = 'nospecdelinstrspecified';
			
			if($scope.promo) {
				thisPromoCode = $scope.promo;
			}

			if($scope.specDelInstr) {
				thisSpecDelInstr = $scope.specDelInstr;
			}

			if($scope.selMethod == 'cash') {
				console.log('cash transaction');
				$http.post('/checkout/processCashPayment', {
					order: $scope.order,
					promoCode: thisPromoCode,
					specDelInstr: thisSpecDelInstr
				}).then(function(res) {
					$scope.processing = false;
					if(res.data.success) {
						if(res.data.msg === 'order-put-cash') {
							if(order) {
								order.orderStatus = 5;
								order.paymentAcceptedAt = new Date().getTime();
								console.log('backup order update for order: '+res.data.orderId);
								console.log(order);
								$http.put('/orders/' + order.id, order);
							} else {
								console.log('backup order update failed');
							}
						}
						$rootScope.$broadcast('orderChanged');
						// notify operator
						$http.post('/mail/sendNotifyToOperator/'+$scope.order.customerId);
						// notify customer
						$http.post('/mail/sendOrderToCustomer/'+$scope.order.customerId);
						$modalInstance.dismiss('done');
						if(deviceMgr.isBigScreen()) {
							$window.location.href = '/app/order/' + $scope.order.id;
							messenger.show('Your order has been received.', 'Success!');
						} else {
							$window.location.href = '/app/orderSmall/' + $scope.order.id;
						}
					} else {
						$scope.paymentFailed = true;
						var failMsg = 'Application error.';
						$scope.failMsg = failMsg;
					}
				});
			} else {
				console.log('cc transaction');
				return;
				$http.post('/checkout/processCCPayment', {
					order: $scope.order,
					paymentMethodId: $scope.selMethod,
					promoCode: thisPromoCode,
					specDelInstr: thisSpecDelInstr
				}).then(function(res) {
					$scope.processing = false;
					if(res.data.success) {
						if(res.data.msg === 'order-put-with-approval') {
							if(order) {
								order.orderStatus = 5;
								order.paymentAcceptedAt = new Date().getTime();
								console.log('backup order update for order: '+res.data.orderId);
								console.log(order);
								$http.put('/orders/' + order.id, order);
							} else {
								console.log('backup order update failed');
							}
						}
						$rootScope.$broadcast('orderChanged');
						// notify operator
						$http.post('/mail/sendNotifyToOperator/'+$scope.order.customerId);
						// notify customer
						$http.post('/mail/sendOrderToCustomer/'+$scope.order.customerId);
						$modalInstance.dismiss('done');

						var redirectTo = '/orderSmall/' + $scope.order.id;
						if(deviceMgr.isBigScreen()) {
							redirectTo = '/order/' + $scope.order.id;
						}

						$location.path(redirectTo);
						messenger.show('Your order has been received.', 'Success!');
					} else {
						console.log('   ');
						console.log('   ');
						console.log('   ');
						console.log('paymentFailure:');
						console.log('   ');
						console.log(res.data.msg+' for order '+res.data.orderId);
						console.log('   ');
						console.log('   ');
						console.log('   ');
						$scope.paymentFailed = true;
						var failMsg = 'Payment error.';
						if(res.data.msg === 'order-put-with-failure') {
							failMsg = 'Payment failed.';
						}
						if(res.data.msg === 'order-put-with-no-processing') {
							failMsg = 'Payment processing error.';
						}
						$scope.failMsg = failMsg;
					}
				});
			}
		}
	}

}());
