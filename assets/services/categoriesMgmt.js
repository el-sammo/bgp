(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Category Management
	///

	app.factory('categoryMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {

		var service = {
			getCategoryById: function(categoryId) {
				var url = '/categories/byId/' + categoryId;
				return $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			getAllCategories: function() {
				var url = '/categories/allCategories/';
				return $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updateCategory: function(categoryData) {
				var url = '/categories/' + categoryData.id;
				return $http.put(url, categoryData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoCategory(data, true);
						return category;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

		};

		function mergeIntoCategory(data, replace) {
			if(! category) {
				category = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(category, function(val, key) {
					delete category[key];
				});
			}

			angular.forEach(data, function(val, key) {
				category[key] = val;
			});
		};

		return service;
	}

}());
