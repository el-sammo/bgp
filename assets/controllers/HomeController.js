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
	'categoryMgmt', 'optionsMgmt', 'payMethodMgmt',
	'accountMgmt', 'clientConfig',
	'messenger', '$q',
	'lodash',
];

function controller(
	$scope, $http, $routeParams, $rootScope, $location,
	$modal, $timeout, $window,
	signupPrompter, deviceMgr, layoutMgmt, 
	customerMgmt, orderMgmt, popcornMgmt,
	categoryMgmt, optionsMgmt, payMethodMgmt,
	accountMgmt, clientConfig,
	messenger, $q,
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
		showPopcorn();

		$scope.activeCart = false;

		$scope.logIn = layoutMgmt.logIn;
		$scope.signUp = layoutMgmt.signUp;
		$scope.logOut = layoutMgmt.logOut;

		$scope.showCategory = showCategory;
		$scope.showFlavor = showFlavor;

		$scope.showAccount = showAccount;
		$scope.showPrivacy = showPrivacy;
		$scope.showPopcorn = showPopcorn;
		$scope.showOrder = showOrder;
		$scope.updateOrder = updateOrder;

		$scope.addFlavor = orderMgmt.add;
		$scope.removeItem = orderMgmt.remove;
		$scope.removeBevItem = orderMgmt.removeBev;

		$scope.checkout = checkout;

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
	
	$rootScope.$on('showAccount', function(evt, args) {
		showAccount();
	});

	$rootScope.$on('showPrivacy', function(evt, args) {
		showPrivacy();
	});

	$rootScope.$on('showOrder', function(evt, args) {
		showOrder();
	});

	$rootScope.$on('customerChanged', function(evt, customer) {
		$scope.customer = customer;
	});

	$rootScope.$on('activeCart', function(evt, customer) {
		$scope.activeCart = true;
	});

	$rootScope.$on('cartEmptied', function(evt, customer) {
		$scope.activeCart = false;
	});

	$rootScope.$on('loggedInCustomerCheckout', function(evt, args) {
		var order = $scope.order;
		order.customerId = args;
		$http.put('/orders/' + order.id, order).then(function(res) {
			checkout(order);
		});
	});

	$scope.addPM = payMethodMgmt.modals.add;
	$scope.removePM = payMethodMgmt.modals.remove;
	$scope.changeAddress = accountMgmt.modals.changeAddress;

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

	function checkout(order) {
		var isProhibited = true;

		if(clientConfig.showCheckout) {
			isProhibited = false;
		}

		if(isProhibited) {
			return orderMgmt.checkoutProhibited();
		}

		if(! (order && order.customerId)) {
			return layoutMgmt.logIn('checkout');
		}

		orderMgmt.checkout(order);
	};

	function updateOrder() {
		var sessionPromise = customerMgmt.getSession();
	
		sessionPromise.then(function(sessionData) {
			if(sessionData.order) {
				var order = sessionData.order;
				$scope.orderStatus = parseInt(order.orderStatus);
				$scope.order = order;
				$scope.things = order.things;
				$scope.bevThings = order.bevThings;
				$scope.updateTotals(order);
			}
		});
	};

	$scope.updateTotals = function(order) {
		var customer = {};
		if(order.customerId) {
			customerMgmt.getCustomer(order.customerId).then(function(customer) {
				customer = customer;

				var things;
				if(order.things) {
					things = order.things;
				} else {
					things = [];
				}
	
				var bevThings;
				if(order.bevThings) {
					bevThings = order.bevThings;
				} else {
					bevThings = [];
				}
	
				var subtotal = 0;
				var tax = 0;
				// TODO this should be configged on the area level
				var taxRate = .05;
				var multiplier = 100;
				var discount = 0;
				var gratuity = 0;
				var total = 0;
	
				if(things.length > 0) {
					things.forEach(function(thing) {
						var lineTotal;
			
						if(thing.quantity && thing.quantity > 1) {
							lineTotal = parseFloat(thing.price) * thing.quantity;
						} else {
							lineTotal = parseFloat(thing.price);
						}
						subtotal = (Math.round((subtotal + lineTotal) * 100)/100);
					});
				}
	
				if(bevThings.length > 0) {
					bevThings.forEach(function(bevThing) {
						var lineTotal;
			
						if(bevThing.quantity && bevThing.quantity > 1) {
							lineTotal = parseFloat(bevThing.price) * bevThing.quantity;
						} else {
							lineTotal = parseFloat(bevThing.price);
						}
						subtotal = (Math.round((subtotal + lineTotal) * 100)/100);
					});
				}
	
				if(customer.taxExempt) {
					order.taxExempt = true;
				} else {
					tax = (Math.round((subtotal * taxRate) * 100) / 100);
				}
	
				if(order.discount) {
					discount = parseFloat(order.discount);
				}
	
				if(order.gratuity) {
					gratuity = parseFloat(order.gratuity);
				}
	
				var sessionPromise = customerMgmt.getSession();
	
				sessionPromise.then(function(sessionData) {
					if(sessionData.order && sessionData.order.things) {
						if(sessionData.customerId) {
							total = (Math.round((subtotal + tax - discount + gratuity) * 100)/100);
						
							$scope.subtotal = subtotal.toFixed(2);
							$scope.tax = tax.toFixed(2);
							$scope.discount = discount.toFixed(2);
							$scope.gratuity = gratuity.toFixed(2);
							$scope.total = total.toFixed(2);
						
							order.subtotal = subtotal;
							order.tax = tax;
							order.discount = discount;
							order.total = total;
							var p = $http.put('/orders/' + order.id, order);
								
							// if orders ajax fails...
							p.error(function(err) {
								console.log('OrderController: updateOrder ajax failed');
								console.error(err);
							});
						} else {
							total = (Math.round((subtotal + tax - discount + gratuity) * 100)/100);
						
							$scope.subtotal = subtotal.toFixed(2);
							$scope.tax = tax.toFixed(2);
							$scope.discount = discount.toFixed(2);
							$scope.gratuity = gratuity.toFixed(2);
							$scope.total = total.toFixed(2);
						
							order.subtotal = subtotal;
							order.tax = tax;
							order.discount = discount;
							order.total = total;
						
							var p = $http.put('/orders/' + order.id, order);
								
							// if orders ajax fails...
							p.error(function(err) {
								console.log('OrderController: updateOrder ajax failed');
								console.error(err);
							});
						}
					}
				});
			}).catch(function(err) {
				console.log('customer ajax failed');
			});
		} else {
			var things;
			if(order.things) {
				things = order.things;
			} else {
				things = [];
			}

			var bevThings;
			if(order.bevThings) {
				bevThings = order.bevThings;
			} else {
				bevThings = [];
			}

			var subtotal = 0;
			var tax = 0;
			// TODO this should be configged on the area level
			var taxRate = .05;
			var multiplier = 100;
			var discount = 0;
			var gratuity = 0;
			var total = 0;

			if(things.length > 0) {
				things.forEach(function(thing) {
					var lineTotal;
		
					if(thing.quantity && thing.quantity > 1) {
						lineTotal = parseFloat(thing.price) * thing.quantity;
					} else {
						lineTotal = parseFloat(thing.price);
					}
					subtotal = (Math.round((subtotal + lineTotal) * 100)/100);
				});
			}

			if(bevThings.length > 0) {
				bevThings.forEach(function(bevThing) {
					var lineTotal;
		
					if(bevThing.quantity && bevThing.quantity > 1) {
						lineTotal = parseFloat(bevThing.price) * bevThing.quantity;
					} else {
						lineTotal = parseFloat(bevThing.price);
					}
					subtotal = (Math.round((subtotal + lineTotal) * 100)/100);
				});
			}

			if(customer.taxExempt) {
			} else {
				tax = (Math.round((subtotal * taxRate) * 100) / 100);
			}

			if(order.discount) {
				discount = parseFloat(order.discount);
			}

			if(order.gratuity) {
				gratuity = parseFloat(order.gratuity);
			}

			var sessionPromise = customerMgmt.getSession();

			sessionPromise.then(function(sessionData) {
				if(sessionData.order && sessionData.order.things) {
					if(sessionData.customerId) {
						total = (Math.round((subtotal + tax - discount + gratuity) * 100)/100);
					
						$scope.subtotal = subtotal.toFixed(2);
						$scope.tax = tax.toFixed(2);
						$scope.discount = discount.toFixed(2);
						$scope.gratuity = gratuity.toFixed(2);
						$scope.total = total.toFixed(2);
					
						order.subtotal = subtotal;
						order.tax = tax;
						order.discount = discount;
						order.total = total;
					
						var p = $http.put('/orders/' + order.id, order);
							
						// if orders ajax fails...
						p.error(function(err) {
							console.log('OrderController: updateOrder ajax failed');
							console.error(err);
						});
					} else {
						total = (Math.round((subtotal + tax - discount + gratuity) * 100)/100);
					
						$scope.subtotal = subtotal.toFixed(2);
						$scope.tax = tax.toFixed(2);
						$scope.discount = discount.toFixed(2);
						$scope.gratuity = gratuity.toFixed(2);
						$scope.total = total.toFixed(2);
					
						order.subtotal = subtotal;
						order.tax = tax;
						order.discount = discount;
						order.total = total;
					
						var p = $http.put('/orders/' + order.id, order);
							
						// if orders ajax fails...
						p.error(function(err) {
							console.log('OrderController: updateOrder ajax failed');
							console.error(err);
						});
					}
				}
			});
		}
	};

	$scope.updateOrder();

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

	if(deviceMgr.isBigScreen()) {
		$scope.bigScreen = true;
	} else {
		$scope.bigScreen = false;
	}

	$("#logo").click(function() {
		showPopcorn();
	});

	function hideAll() {
		$('#accountShow').hide();
		$('#privacyShow').hide();
		$('#popcornShow').hide();
		$('#orderShow').hide();
	}

	function showAccount() {
		hideAll();
		$('#accountShow').show();

		var sessionPromise = customerMgmt.getSession();

		sessionPromise.then(function(sessionData) {
			if(!sessionData.customerId) {
				showPopcorn();
				return;
			}

			var customerId = sessionData.customerId;

			customerMgmt.getCustomer(customerId).then(function(customer) {
				$scope.customer = customer;
				var taxExempt = '';
				if(customer.taxExempt) {
					var taxExempt = 'Tax Exempt';
				}
				$scope.taxExempt = taxExempt;
			});
		
			var r = $http.get('/orders/byCustomerId/' + customerId);
		
			r.error(function(err) {
				console.log('AccountController: orders ajax failed');
				console.error(err);
			});
		
			r.then(function(res) {
				var completedHistory = [];
				res.data.forEach(function(order) {
					if(order.orderStatus > 4) {

						var d = new Date(order.paymentAcceptedAt);

						var orderYear = d.getFullYear();
						var orderMonth = d.getMonth() + 1;
						var orderDate = d.getDate();

						if(orderMonth < 10) {
							orderMonth = '0'+orderMonth;
						}

						if(orderDate < 10) {
							orderDate = '0'+orderDate;
						}

						var completedDate = orderYear+'-'+orderMonth+'-'+orderDate;

						order.orderDate = completedDate;
						order.total = parseFloat(order.total).toFixed(2);
						completedHistory.push(order);
					}
				});
		
				$scope.orders = completedHistory;
			});
		});
	}

	function showPrivacy() {
		hideAll();
		$('#privacyShow').show();
	}

	function showPopcorn() {
		hideAll();
		$('#popcornShow').show();
	}

	function showOrder() {
		updateOrder();
		hideAll();
		$('#orderShow').show();

		var sessionPromise = customerMgmt.getSession();
		sessionPromise.then(function(sessionData) {
			$scope.order = sessionData.order;
			$scope.things = sessionData.order.things;
		});
	}


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
				showFlavor(categoryFlavors[0], 0);
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

	function showFlavor(flavor, showId) {
		if(!flavor) {
			popcornMgmt.getPopcornByCategory($scope.popcornCategories[0].id).then(function(categoryFlavors) {
				$scope.activeFlavor = categoryFlavors[0];
				$scope.activeFlavorId = categoryFlavors[0].id;
				$scope.activeFlavorName = categoryFlavors[0].name;
				$scope.activeFlavorDesc = categoryFlavors[0].description;
				optionsMgmt.getOptionsByPopcornId($scope.activeFlavorId).then(function(optionsData) {
					$scope.activeFlavor.sizes = optionsData;
					$scope.activeFlavorSizes = optionsData;
				});
				$scope.activeFlavorImgSrc = "/images/popcorn_images/" + categoryFlavors[0].name.toLowerCase().replace('\'', '').replace('&', 'and').replace(/ /g, '_') + ".jpg";
				showDescription(categoryFlavors[0]);
				$scope.showFlavorDescId = 'flavor0Show';
			});
		} else {
			$scope.activeFlavor = flavor;
			$scope.activeFlavorId = flavor.id;
			$scope.activeFlavorName = flavor.name;
			$scope.activeFlavorDesc = flavor.description;
			optionsMgmt.getOptionsByPopcornId($scope.activeFlavorId).then(function(optionsData) {
				$scope.activeFlavor.sizes = optionsData;
				$scope.activeFlavorSizes = optionsData;
			});
			$scope.activeFlavorImgSrc = "/images/popcorn_images/" + flavor.name.toLowerCase().replace('\'', '').replace('&', 'and').replace(/ /g, '_') + ".jpg";
			showDescription(showId);
		}
	}

	function showDescription(showId) {
		showId = showId.toString();
		switch(showId) {
			case '0':
				$scope.showFlavorDescId = 'flavor0Show';
				break;
			case '1':
				$scope.showFlavorDescId = 'flavor1Show';
				break;
			case '2':
				$scope.showFlavorDescId = 'flavor2Show';
				break;
			case '3':
				$scope.showFlavorDescId = 'flavor3Show';
				break;
			case '4':
				$scope.showFlavorDescId = 'flavor4Show';
				break;
			case '5':
				$scope.showFlavorDescId = 'flavor5Show';
				break;
			case '6':
				$scope.showFlavorDescId = 'flavor6Show';
				break;
			case '7':
				$scope.showFlavorDescId = 'flavor7Show';
				break;
			case '8':
				$scope.showFlavorDescId = 'flavor8Show';
				break;
			case '9':
				$scope.showFlavorDescId = 'flavor9Show';
				break;
			case '10':
				$scope.showFlavorDescId = 'flavor10Show';
				break;
			case '11':
				$scope.showFlavorDescId = 'flavor11Show';
				break;
			case '12':
				$scope.showFlavorDescId = 'flavor12Show';
				break;
			case '13':
				$scope.showFlavorDescId = 'flavor13Show';
				break;
			case '14':
				$scope.showFlavorDescId = 'flavor14Show';
				break;
			case '15':
				$scope.showFlavorDescId = 'flavor15Show';
				break;
			case '16':
				$scope.showFlavorDescId = 'flavor16Show';
				break;
			case '17':
				$scope.showFlavorDescId = 'flavor17Show';
				break;
			case '18':
				$scope.showFlavorDescId = 'flavor18Show';
				break;
			case '19':
				$scope.showFlavorDescId = 'flavor19Show';
				break;
			case '20':
				$scope.showFlavorDescId = 'flavor20Show';
				break;
			case '21':
				$scope.showFlavorDescId = 'flavor21Show';
				break;
			case '22':
				$scope.showFlavorDescId = 'flavor22Show';
				break;
			case '23':
				$scope.showFlavorDescId = 'flavor23Show';
				break;
			case '24':
				$scope.showFlavorDescId = 'flavor24Show';
				break;
			case '25':
				$scope.showFlavorDescId = 'flavor25Show';
				break;
			case '26':
				$scope.showFlavorDescId = 'flavor26Show';
				break;
			case '27':
				$scope.showFlavorDescId = 'flavor27Show';
				break;
			case '28':
				$scope.showFlavorDescId = 'flavor28Show';
				break;
			case '29':
				$scope.showFlavorDescId = 'flavor29Show';
				break;
			case '30':
				$scope.showFlavorDescId = 'flavor30Show';
				break;
			case '31':
				$scope.showFlavorDescId = 'flavor31Show';
				break;
			case '32':
				$scope.showFlavorDescId = 'flavor32Show';
				break;
			case '33':
				$scope.showFlavorDescId = 'flavor33Show';
				break;
			case '34':
				$scope.showFlavorDescId = 'flavor34Show';
				break;
			case '35':
				$scope.showFlavorDescId = 'flavor35Show';
				break;
			case '36':
				$scope.showFlavorDescId = 'flavor36Show';
				break;
			case '37':
				$scope.showFlavorDescId = 'flavor37Show';
				break;
			case '38':
				$scope.showFlavorDescId = 'flavor38Show';
				break;
			case '39':
				$scope.showFlavorDescId = 'flavor39Show';
				break;
			case '40':
				$scope.showFlavorDescId = 'flavor40Show';
				break;
			case '41':
				$scope.showFlavorDescId = 'flavor41Show';
				break;
			case '42':
				$scope.showFlavorDescId = 'flavor42Show';
				break;
			case '43':
				$scope.showFlavorDescId = 'flavor43Show';
				break;
			case '44':
				$scope.showFlavorDescId = 'flavor44Show';
				break;
			case '45':
				$scope.showFlavorDescId = 'flavor45Show';
				break;
			case '46':
				$scope.showFlavorDescId = 'flavor46Show';
				break;
			case '47':
				$scope.showFlavorDescId = 'flavor47Show';
				break;
			case '48':
				$scope.showFlavorDescId = 'flavor48Show';
				break;
			case '49':
				$scope.showFlavorDescId = 'flavor49Show';
				break;
			default:
				$scope.showFlavorDescId = 'flavor0Show';
		}
	}

	function account() {
		if(!$scope.customerId) {
			layoutMgmt.logIn('no next');
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
