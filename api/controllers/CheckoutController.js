/**
 * CheckoutController
 *
 * @description :: Server-side logic for managing Checkouts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Authorize = require('auth-net-types');
var _AuthorizeCIM = require('auth-net-cim');
var AuthorizeCIM = new _AuthorizeCIM(sails.config.authorizeNet);

module.exports = {
  processCashPayment: function(req, res) {
    var isAjax = req.headers.accept.match(/application\/json/);

		if(req.body && req.body.order) {
			return captureCashTransaction(req, res);
		}
  },
  processPhonePayment: function(req, res) {
    var isAjax = req.headers.accept.match(/application\/json/);

		if(req.body && req.body.order) {
			return capturePhoneTransaction(req, res);
		}
  },
  processCCPayment: function(req, res) {
    var isAjax = req.headers.accept.match(/application\/json/);

		if(req.body && req.body.order && req.body.paymentMethodId) {
			return captureCCTransaction(req, res);
		}
  },
};

function captureCashTransaction(req, res, self) {
	var order = req.body.order;
	var customerId = order.customerId;
	var discount = 0;
	var promoCode = req.body.promoCode;
	var newTotal = 0;
	var currentTotal = parseFloat(order.total);

	if(req.body && req.body.specDelInstr && !req.body.specDelInstr === 'nospecdelinstrspecified') {
		order.specDelInstr = req.body.specDelInstr;
	}

	order.orderStatus = 5;
	order.paymentMethods = 'cash';
	order.paymentInitiatedAt = new Date().getTime();
	order.paymentAcceptedAt = new Date().getTime();

	if(promoCode === 'nopromocodespecified') {
		newTotal = parseFloat(currentTotal);
		order.total = newTotal;
	
		return Orders.update(order.id, order).then(function(data) {
			return res.json({success: true, msg: 'complete', orderId: order.id});
		}).catch(function(err) {
			console.log('captureCashTransaction orders-put failed');
			console.log('err');
			return res.json({success: true, msg: 'order-put-cash', orderId: order.id});
		});
	}

	PromosService.getPromo(currentTotal, promoCode, customerId).then(function(feeDataObj) {
		var feeData = feeDataObj;
		if(feeData.success) {
			order.discount = (parseFloat(currentTotal) - parseFloat(feeData.amount));
			order.promo = promoCode;

			newTotal = parseFloat(feeData.amount);
			order.total = newTotal;
			
			return Orders.update(order.id, order).then(function(data) {
				return res.json({success: true, msg: 'complete', orderId: order.id});
			}).catch(function(err) {
				console.log('captureCashTransaction orders-put failed');
				console.log('err');
				return res.json({success: true, msg: 'order-put-cash', orderId: order.id});
			});
		}
	});
};

function capturePhoneTransaction(req, res, self) {
	var order = req.body.order;
	var customerId = order.customerId;
	var discount = 0;
	var promoCode = req.body.promoCode;
	var newTotal = 0;
	var currentTotal = parseFloat(order.total);

	if(req.body && req.body.specDelInstr && !req.body.specDelInstr === 'nospecdelinstrspecified') {
		order.specDelInstr = req.body.specDelInstr;
	}

	order.orderStatus = 5;
	order.paymentMethods = 'phone';
	order.paymentInitiatedAt = new Date().getTime();
	order.paymentAcceptedAt = new Date().getTime();

	if(promoCode === 'nopromocodespecified') {
		newTotal = parseFloat(currentTotal);
		order.total = newTotal;
	
		return Orders.update(order.id, order).then(function(data) {
			return res.json({success: true, msg: 'complete', orderId: order.id});
		}).catch(function(err) {
			console.log('captureCashTransaction orders-put failed');
			console.log('err');
			return res.json({success: true, msg: 'order-put-phone', orderId: order.id});
		});
	}

	PromosService.getPromo(currentTotal, promoCode, customerId).then(function(feeDataObj) {
		var feeData = feeDataObj;
		if(feeData.success) {
			order.discount = (parseFloat(currentTotal) - parseFloat(feeData.amount));
			order.promo = promoCode;

			newTotal = parseFloat(feeData.amount);
			order.total = newTotal;
			
			return Orders.update(order.id, order).then(function(data) {
				return res.json({success: true, msg: 'complete', orderId: order.id});
			}).catch(function(err) {
				console.log('captureCashTransaction orders-put failed');
				console.log('err');
				return res.json({success: true, msg: 'order-put-phone', orderId: order.id});
			});
		}
	});
};

function captureCCTransaction(req, res, self) {
	var order = req.body.order;
	var customerId = order.customerId;
	var discount = 0;
	var promoCode = req.body.promoCode;
	var newTotal = 0;
	var currentTotal = parseFloat(order.total);
	var paymentMethodId = req.body.paymentMethodId;

	order.orderStatus = 2;
	order.paymentMethods = paymentMethodId;
	order.paymentInitiatedAt = new Date().getTime();

	if(req.body && req.body.specDelInstr && !req.body.specDelInstr === 'nospecdelinstrspecified') {
		order.specDelInstr = req.body.specDelInstr;
	}

	// Set order status to 2 (paymentInitiated) with basic
	// order information and update db for recovery/processing
	return Orders.update(order.id, order).then(function(data) {

		// Get customer object (for customer.aNetProfileId
		// and to verify the paymentMethodId

		return Customers.find(customerId).then(function(customers) {
			var customer = customers[0];
			var customerProfileId = customer.aNetProfileId;
			var validPM = false;

			customer.paymentMethods.forEach(function(method) {
				if(method.id == paymentMethodId) {
					validPM = true;
				}
			});

			if(validPM) {
				var now = new Date();
				var milli = now.getTime();
				var secs = milli.toString();
				var orderId = secs.substr( (secs.length - 11), 8 );
		
				if(promoCode === 'nopromocodespecified') {
					var newTotal = parseFloat(currentTotal);
					order.total = newTotal;
				
					var transaction = {
						amount: newTotal,
						tax: {},
						shipping: {},
						customerProfileId: customerProfileId,
						customerPaymentProfileId: paymentMethodId,
						order: {
							invoiceNumber: orderId
						}
					};

console.log(' ');
console.log('transaction:');
console.log(transaction);
console.log(' ');

					return AuthorizeCIM.createCustomerProfileTransaction(
						// transaction types:
						// AuthCapture, AuthOnly, CaptureOnly, PriorAuthCapture
						'AuthCapture',
						 transaction,
					function(err, response) {
						if(err) {
							console.log('err:');
							console.log(err.message);
							
							order.orderStatus = 4;

							Orders.update(order.id, order).then(function(data) {
								return res.json({success: false, msg: err.message, orderId: order.id});
							}).catch(function(err) {
								console.log('captureCCTransaction orders-put failed');
								console.log('err');

								return res.json({success: false, msg: 'order-put-with-failure', orderId: order.id});
							});
						} else {
							var dirResPcs = response.directResponse.split(',');
							if(dirResPcs[3] == 'This transaction has been approved.') {
								order.paymentAcceptedAt = new Date().getTime();
								order.orderStatus = 5;
	
								Orders.update(order.id, order).then(function(data) {
									return res.json({success: true, msg: 'complete', orderId: order.id});
								}).catch(function(err) {
									console.log('captureCCTransaction orders-put with approval failed');
									console.log('err');
									return res.json({success: true, msg: 'order-put-with-approval', orderId: order.id});
								});
							} else {
								console.log('   ');
								console.log('This transaction has NOT been processed');
								console.log(dirResPcs[3]);
								console.log('   ');
	
								order.orderStatus = 3;
	
								Orders.update(order.id, order).then(function(data) {
									return res.json({success: false, msg: dirResPcs[3], orderId: order.id});
								}).catch(function(err) {
									console.log('captureCCTransaction orders-put with no processing failed');
									console.log('err');
									return res.json({success: false, msg: 'order-put-with-no-processing', orderId: order.id});
								});
							}
						}
					});
				} else {

					return PromosService.getPromo(currentTotal, promoCode, customerId).then(function(feeDataObj) {
						var feeData = feeDataObj;
						if(feeData.success) {
							discount = (parseFloat(currentTotal) - parseFloat(feeData.amount));
							order.discount = discount;
							order.promo = promoCode;
				
							newTotal = parseFloat(feeData.amount);
							order.total = newTotal;
							
							return Orders.update(order.id, order).then(function(data) {
								var transaction = {
									amount: newTotal,
									tax: {},
									shipping: {},
									customerProfileId: customerProfileId,
									customerPaymentProfileId: paymentMethodId,
									order: {
										invoiceNumber: orderId
									}
								};
			
console.log(' ');
console.log('transaction:');
console.log(transaction);
console.log(' ');
	
								return AuthorizeCIM.createCustomerProfileTransaction(
									// transaction types:
									// AuthCapture, AuthOnly, CaptureOnly, PriorAuthCapture
									'AuthCapture',
									 transaction,
								function(err, response) {
									if(err) {
										console.log('err:');
										console.log(err.message);
										
										order.orderStatus = 4;
										order.promo = '';
										order.discount = 0;
										order.total = currentTotal;
			
										Orders.update(order.id, order).then(function(data) {
											return res.json({success: false, msg: err.message, orderId: order.id});
										}).catch(function(err) {
											console.log('captureCCTransaction orders-put failed');
											console.log('err');
			
											return res.json({success: false, msg: 'order-put-with-failure', orderId: order.id});
										});
									} else {
										var dirResPcs = response.directResponse.split(',');
										if(dirResPcs[3] == 'This transaction has been approved.') {
											order.paymentAcceptedAt = new Date().getTime();
											order.orderStatus = 5;
				
											Orders.update(order.id, order).then(function(data) {
												return res.json({success: true, msg: 'complete', orderId: order.id});
											}).catch(function(err) {
												console.log('captureCCTransaction orders-put with approval failed');
												console.log('err');
												return res.json({success: true, msg: 'order-put-with-approval', orderId: order.id});
											});
										} else {
											console.log('   ');
											console.log('This transaction has NOT been processed');
											console.log(dirResPcs[3]);
											console.log('   ');
				
											order.orderStatus = 3;
				
											Orders.update(order.id, order).then(function(data) {
												return res.json({success: false, msg: dirResPcs[3], orderId: order.id});
											}).catch(function(err) {
												console.log('captureCCTransaction orders-put with no processing failed');
												console.log('err');
												return res.json({success: false, msg: 'order-put-with-no-processing', orderId: order.id});
											});
										}
									}
								});
							});
						}
					});
				}
			} else {
console.log('INvalidPM');
				// not a valid payment method
				return res.json({success: false, msg: 'invalid-payment-method', orderId: order.id});
			}
		});
	});
}


