(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('popcornSchema', service);
	
	service.$inject = [ ];
	
	function service() {
		function nameTransform(popcorn) {
			if(! popcorn || ! popcorn.name || popcorn.name.length < 1) {
				return 'popcorn-name';
			}
			return (popcorn.name
				.replace(/[^a-zA-Z ]/g, '')
				.replace(/ /g, '-')
				.toLowerCase()
			);
		}

		var service = {
			defaults: {
				popcorn: {
					name: '',
					description: '',
					category: '',
					active: '',
					sizes: []
				}
			},

			populateDefaults: function(popcorn) {
				$.map(service.defaults.popcorn, function(value, key) {
					if(popcorn[key]) return;
					if(typeof value === 'object') {
						popcorn[key] = angular.copy(value);
						return;
					}
					popcorn[key] = value;
				});
				return popcorn;
			}
		};

		return service;
	}

}());
