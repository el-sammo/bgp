(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Popcorn Management
	///

	app.factory('popcornMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {

		var service = {
			getPopcornById: function(popcornId) {
				var url = '/popcorn/byId/' + popcornId;
				return $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			getAllPopcorn: function() {
				var url = '/popcorn/allPopcorn/';
				return $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			getPopcornByCategory: function(category) {
				var url = '/popcorn/byCategory/' +category;
				return $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updatePopcorn: function(popcornData) {
				var url = '/popcorns/' + popcornData.id;
				return $http.put(url, popcornData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoPopcorn(data, true);
						return popcorn;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

		};

		function mergeIntoPopcorn(data, replace) {
			if(! popcorn) {
				popcorn = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(popcorn, function(val, key) {
					delete popcorn[key];
				});
			}

			angular.forEach(data, function(val, key) {
				popcorn[key] = val;
			});
		};

		return service;
	}

}());
