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
	var urlFlavor = false;


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

		if($routeParams.id) {
			if($routeParams.id.indexOf('flavor') > -1) {
				// routeParams.id is a flavorName
				var rpId = $routeParams.id.toLowerCase().replace('flavor=','').replace(/\'/,'').replace(/-/g,' ');
				popcornMgmt.getAllPopcorn().then(function(popcorn) {
					var matchFound = false;
					popcorn.forEach(function(flavor) {
						var flavorName = flavor.name.replace(/\'/,'').replace(/-/g,' ').toLowerCase();
						if(flavorName === rpId) {
							matchFound = true;
							urlFlavor = flavor;
							categoryMgmt.getCategoryById(flavor.category).then(function(category) {
								showPopcorn();
								showCategory(category[0], true);
							});
						}
					});
					if(!matchFound) {
						showPopcorn();
					}
				});
				// routeParams.id is an orderId
			} else if($routeParams.id.indexOf('order') > -1) {
				var orderId = $routeParams.id.toLowerCase().replace('order=','');
				$http.get('/orders/'+orderId).then(function(order) {
					showOrder(order.data, true);
				});
				// routeParams.id is a route to home
			} else if($routeParams.id.indexOf('home') > -1) {
				showPopcorn();
				// routeParams.id is a route to cart
			} else if($routeParams.id.indexOf('cart') > -1) {
				showCart();
				// routeParams.id is a route to account
			} else if($routeParams.id.indexOf('account') > -1) {
				showAccount();
				// routeParams.id is a route to story
			} else if($routeParams.id.indexOf('story') > -1) {
				showStory();
				// routeParams.id is a route to careers
			} else if($routeParams.id.indexOf('careers') > -1) {
				showCareers();
				// routeParams.id is a route to privacy
			} else if($routeParams.id.indexOf('privacy') > -1) {
				showPrivacy();
				// routeParams.id is a route to contact
			} else if($routeParams.id.indexOf('contact') > -1) {
				showContact();
			} else {
				showPopcorn();
			}
		} else {
			showPopcorn();
		}

		$scope.logIn = layoutMgmt.logIn;
		$scope.signUp = layoutMgmt.signUp;
		$scope.logOut = layoutMgmt.logOut;

		$scope.showCategory = showCategory;
		$scope.showFlavor = showFlavor;

		$scope.showAccount = showAccount;
		$scope.showCareers = showCareers;
		$scope.showCart = showCart;
		$scope.showContact = showContact;
		$scope.showFeedback = layoutMgmt.feedback;
		$scope.showPrivacy = showPrivacy;
		$scope.showPopcorn = showPopcorn;
		$scope.showOrder = showOrder;
		$scope.showStory = showStory;
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

	$rootScope.$on('showCareers', function(evt, args) {
		showCareers();
	});

	$rootScope.$on('showCart', function(evt, args) {
		showCart();
	});

	$rootScope.$on('showContact', function(evt, args) {
		showContact();
	});

	$rootScope.$on('showPopcorn', function(evt, args) {
		showPopcorn();
	});

	$rootScope.$on('showPrivacy', function(evt, args) {
		showPrivacy();
	});

	$rootScope.$on('showStory', function(evt, args) {
		showStory();
	});

	$rootScope.$on('customerChanged', function(evt, customer) {
		$scope.customer = customer;
	});

	$rootScope.$on('activeCart', function(evt, customer) {
		$scope.activeCart = true;
	});

	$rootScope.$on('itemAdded', function(evt, customer) {
		$scope.activeCart = true;
	});

	$rootScope.$on('cartEmptied', function(evt, customer) {
		$scope.activeCart = false;
	});

	$rootScope.$on('itemRemoved', function(evt, args) {
		showCart();
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
				$scope.showLogout = true;
				$scope.showSignup = false;

				var getCustomerPromise = customerMgmt.getCustomer($scope.customerId);
				getCustomerPromise.then(function(customer) {
					$scope.customer = customer;
				});

			} else {
				$scope.showLogin = true;
				$scope.showLogout = false;
				$scope.showSignup = true;
			}
			
			if(sessionData.order && sessionData.order.things && sessionData.order.things.length > 0) {
				$scope.activeCart = true;
			} else {
				$scope.activeCart = false;
			}

			if(!urlFlavor) {
				showCategory();
				showFlavor()
			}

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
		$('#accountShowSmall').hide();
		$('#careerShow').hide();
		$('#careerShowSmall').hide();
		$('#cartShow').hide();
		$('#cartShowSmall').hide();
		$('#contactShow').hide();
		$('#contactShowSmall').hide();
		$('#privacyShow').hide();
		$('#privacyShowSmall').hide();
		$('#popcornShow').hide();
		$('#popcornShowSmall').hide();
		$('#orderShow').hide();
		$('#orderShowSmall').hide();
		$('#storyShow').hide();
		$('#storyShowSmall').hide();
	}

	function showAccount() {
		hideAll();
		$('#accountShow').show();
		$('#accountShowSmall').show();

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

						$scope.orderDate = order.orderDate;
						order.total = parseFloat(order.total).toFixed(2);
						completedHistory.push(order);
					}
				});
		
				$scope.orders = completedHistory;
			});
		});
	}

	function showCareers() {
		hideAll();
		$('#careerShow').show();
		$('#careerShowSmall').show();
	}

	function showCart() {
		updateOrder();
		hideAll();
		$('#cartShow').show();
		$('#cartShowSmall').show();

		var sessionPromise = customerMgmt.getSession();
		sessionPromise.then(function(sessionData) {
			$scope.order = sessionData.order;
			$scope.things = sessionData.order.things;
		});
	}

	function showContact() {
		hideAll();
		$('#contactShow').show();
		$('#contactShowSmall').show();
	}

	function showOrder(order, fromUrl) {
		var thisOrder;

		if(fromUrl) {
			thisOrder = order;
		} else {
			$http.get('/orders/'+order).then(function(orderData) {
				thisOrder = orderData.data;
			});
		}

		var sessionPromise = customerMgmt.getSession();
		sessionPromise.then(function(sessionData) {
			if(!sessionData.customerId || !thisOrder.customerId === sessionData.customerId) {
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

			var currOrderStatus = parseInt(thisOrder.orderStatus);

			$scope.orderStatusFormatted = statusMap[currOrderStatus];

			$scope.things = thisOrder.things;

			$scope.thisOrderStatusFormatted = statusMap[currOrderStatus];

			$scope.thisOrderDate = new Date(thisOrder.paymentAcceptedAt).toDateString().substr(4);

			$scope.paymentAcceptedAtFormatted = new Date(thisOrder.paymentAcceptedAt).toTimeString().substr(0,5);
			$scope.placedAtFormatted = new Date(thisOrder.orderPlacedAt).toTimeString().substr(0,5);
			$scope.collectedAtFormatted = new Date(thisOrder.orderCollectedAt).toTimeString().substr(0,5);
			$scope.deliveredAtFormatted = new Date(thisOrder.orderDeliveredAt).toTimeString().substr(0,5);

			$scope.thisOrderStatus = parseInt(thisOrder.orderStatus);
			$scope.paymentMethod = thisOrder.paymentMethods;
			$scope.subtotal = thisOrder.subtotal;
			$scope.tax = thisOrder.tax;
			$scope.shipping = thisOrder.shippingCost;
			$scope.discount = thisOrder.discount;
			$scope.total = '$'+parseFloat(thisOrder.total).toFixed(2);
			$scope.bevThings = thisOrder.bevThings;

			customerMgmt.getCustomer(thisOrder.customerId).then(function(customer) {
				$scope.customer = customer;
				$scope.fName = $scope.customer.fName;
				$scope.lName = $scope.customer.lName;
				$scope.phone = $scope.customer.phone;
				$scope.address = $scope.customer.addresses.primary.streetNumber+' '+$scope.customer.addresses.primary.streetName+' '+$scope.customer.addresses.primary.city;

//				$scope.src = $sce.trustAsResourceUrl(
//					'https://www.google.com/maps/embed/v1/place?' + querystring.stringify({
//						key: configMgr.config.vendors.googleMaps.key,
//						q: ([
//							$scope.customer.addresses.primary.streetNumber,
//							$scope.customer.addresses.primary.streetName,
//							$scope.customer.addresses.primary.city,
//							$scope.customer.addresses.primary.state,
//							$scope.customer.addresses.primary.zip
//						].join('+'))
//					})
//				);
			});

			hideAll();
			$('#orderShow').show();
			$('#orderShowSmall').show();
		});
	}

	function showPrivacy() {
		hideAll();
		$('#privacyShow').show();
		$('#privacyShowSmall').show();
	}

	function showPopcorn() {
		hideAll();
		$('#popcornShow').show();
		$('#popcornShowSmall').show();
	}

	function showStory() {
		hideAll();
		$('#storyShow').show();
		$('#storyShowSmall').show();
	}


	function hideCategories() {
		$scope.CandyShow = false;
		$scope.CaramelShow = false;
		$scope.CheeseShow = false;
		$scope.ChocolateShow = false;
		$scope.OriginalShow = false;
		$scope.SpecialtyShow = false;
	}

	function showCategory(category, fromUrl) {
		if(!category) {
			popcornMgmt.getPopcornByCategory($scope.popcornCategories[0].id).then(function(categoryFlavors) {
				$scope.categoryFlavors = categoryFlavors;
			});
			$scope.CandyShow = true;
		} else {
			hideCategories();
			popcornMgmt.getPopcornByCategory(category.id).then(function(categoryFlavors) {
				$scope.categoryFlavors = categoryFlavors;
				if(fromUrl) {
					if(urlFlavor.active) {
						categoryFlavors.forEach(function(catFlavor, idx) {
							if(catFlavor.name === urlFlavor.name) {
								showFlavor(urlFlavor, idx);
							}
						});
					} else {
						showFlavor(categoryFlavors[0], 0);
					}
				} else {
					showFlavor(categoryFlavors[0], 0);
				}
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
