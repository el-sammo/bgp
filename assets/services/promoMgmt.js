(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('promoMgmt', service);
	
	service.$inject = [
		'$rootScope', '$http'
	];
	
	function service($rootScope, $http) {
		var service = {
			getPromo: function(subTotal, promoCode, customerId) {
				return $http.post('/promos/getPromo', {
					subTotal: subTotal, promoCode: promoCode, customerId: customerId
				});
			}
		}

		return service;
	}

}());
