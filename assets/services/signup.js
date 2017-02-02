(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Signup
	///

	app.factory('signupPrompter', service);
	
	service.$inject = [
		'customerMgmt', 'layoutMgmt'
	];
	
	function service(
		customerMgmt, layoutMgmt
	) {
		var hasPrompted = false;
		var service = {
			prompt: function() {
				if(hasPrompted) return;
				hasPrompted = true;

				customerMgmt.getSession().then(function(sessionData) {
					if(sessionData.customerId) return;
					layoutMgmt.signUp();
				});
			}
		};
		return service;
	}


	app.controller('SignUpController', controller);
	
	controller.$inject = [
		'$scope', '$modalInstance', '$http',
		'$rootScope', '$window', 'clientConfig',
		'layoutMgmt', 'customerMgmt'
	];

	function controller(
		$scope, $modalInstance, $http,
		$rootScope, $window, clientConfig,
		layoutMgmt, customerMgmt
	) {

		$scope.haveAccount = function() {
			$modalInstance.dismiss('cancel');
			layoutMgmt.logIn('no next');
		};


		$scope.dyk = "Popcorn is a healthy snack, low in fat and calories!";
		$http.get('/dyk/').then(function(res) {
			$scope.dyk = res.data[Math.floor((Math.random() * res.data.length))].dykContent;
		});

		$http.get('/popcorn/activePopcorn/').then(function(res) {
			var thisRando = Math.floor((Math.random() * res.data.length));
			$scope.featured = res.data[thisRando];
			$scope.featuredImgSrc = "/images/popcorn_images/" + 
				$scope.featured.name.toLowerCase().replace('\'', '').replace('&', 'and').replace(/ /g, '_') + ".jpg";
		});

		$scope.validUsername = true;

		$scope.state = clientConfig.defaultState || 'WY';

		$scope.step = 0;
		$scope.submitted = 0;

		$scope.required = function(field, step) {
			if($scope.submitted <= step || field) return;
			return 'error';
		};

		$scope.requiredAddress = function(field, step) {
			if($scope.submitted <= step) return '';
			if(field && isValidAddress(field)) return '';
			return 'error';
		};

		$scope.usernameSearch = function() {
			if($scope.username === '') return;

			var s = $http.get('/customers/byUsername/' + $scope.username);
						
			// if customers ajax fails...
			s.error(function(err) {
console.log('layoutMgmt: sut-customersGet ajax failed');
console.error(err);
			});
		
			s.then(function(res) {
				$scope.validUsername = ! (res.data.length > 0);
			});
		};

		$scope.startAccount = function() {
			$scope.submitted = 1;
			if(! $scope.isFormComplete(0) || !$scope.validUsername) return;

			var customer = {
				email: $scope.email,
				username: $scope.username
			}

			$http.post('/starterAccounts/create', customer).then(function(data) {
				$scope.step = 1;
			}).catch(function(err) {
console.log('layoutMgmt: sut-customersGet ajax failed');
console.error(err);
			});
		};

		function splitAddress(address) {
			var addrInfo = {
				streetNumber: '',
				streetName: ''
			};
			var matches = address.match(/^([0-9]+) (.+)/);
			if(matches) {
				addrInfo.streetNumber = matches[1];
				addrInfo.streetName = matches[2];
			}
			return addrInfo;
		}

		function isValidAddress(address) {
			if(! address) return false;

			var addrInfo = splitAddress($scope.address);
			return addrInfo.streetNumber && addrInfo.streetName;
		};

		$scope.isFormComplete = function(step) {
			var reqFields = {
				0: ['email', 'username', 'password'],
				1: ['fName', 'lName', 'phone', 'address', 'city', 'state', 'zip']
			};

			if(! reqFields[step]) return true;

			var isComplete = true;
			reqFields[step].forEach(function(fieldName) {
				isComplete = isComplete && $scope[fieldName];
			});

			if($scope.step > 0) {
				isComplete = isComplete && isValidAddress($scope.address);
			}

			return isComplete;
		};

		$scope.createAccount = function() {
			$scope.submitted = 2;

			if(! $scope.isFormComplete(1)) {
				return;
			}

			var addrInfo = splitAddress($scope.address);

			var customer = {
				fName: $scope.fName,
				lName: $scope.lName,
				addresses: {
					primary: {
						streetNumber: addrInfo.streetNumber,
						streetName: addrInfo.streetName,
						apt: $scope.apt,
						city: $scope.city,
						state: $scope.state,
						zip: $scope.zip
					}
				},
				username: $scope.username,
				password: $scope.password,
				phone: $scope.phone,
				email: $scope.email,
				sawBevTour: false
			}

			customerMgmt.createCustomer(customer).then(function(customerData) {
				var customerData = customerData.data;
				$modalInstance.dismiss('done');
				$scope.submit({
					username: customer.username,
					password: customer.password,
					customerId: customerData.id
				});
				return $http.post('/mail/sendConfirmationToCustomer/' + customerData.id);
			}).then(function(response) {
			}).catch(function(err) {
				// if customers ajax fails...
console.log('LayoutMgmtController: customer-create ajax failed');
console.error(err);
				$modalInstance.dismiss('cancel');
			});
		};

		$scope.submit = function(credentials) {
			$http.post(
				'/login', credentials
			).success(function(data, status, headers, config) {
				// if login ajax succeeds...
				if(status >= 400) {
					$rootScope.$broadcast('customerLoggedIn', data.customerId);
					$modalInstance.dismiss('done');
				} else if(status == 200) {
					$rootScope.$broadcast('customerLoggedIn', data.customerId);
					$modalInstance.dismiss('done');
				} else {
					$rootScope.$broadcast('customerLoggedIn', data.customerId);
					$modalInstance.dismiss('done');
				}
			}).error(function(err) {
				// if login ajax fails...
console.log('LayoutMgmtController: logIn ajax failed');
console.error(err);
				$modalInstance.dismiss('cancel');
			});
		};

	}
}());
