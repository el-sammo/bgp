(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Options Management
	///

	app.factory('optionsMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {

		var service = {
			getOptionsByPopcornId: function(popcornId) {
				var url = '/options/byPopcornId/' + popcornId;
				return $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

		};

		return service;
	}

}());
