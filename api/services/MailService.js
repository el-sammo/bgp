
var Promise = require('bluebird');

module.exports = {
	getOrder: function(orderId) {
console.log('MailService orderId:' +orderId);
		if(!(orderId)) {
			return {success: false, reason: 'invalid'};
		}

		var scope = {};
		scope.orderId = orderId;

		return Orders.findOne(
			{id: scope.orderId}
		).then(function(order) {
			return {order: order};
		}).catch(function(err) {
			return {success: false, reason: 'invalid'};
		});
	}
}
