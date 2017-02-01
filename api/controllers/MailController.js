/**
 * MailController
 *
 * @description :: Server-side logic for managing Mails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');
var Promise = require('bluebird');

var env = sails.config.environment;

// TODO: temporary debug code
env = 'production';

module.exports = {
	sendNotifyToOperator: function(req, res) {
		if(env && env === 'production') {
			var orderId = req.params.id;
			var email = 'sam.barrett@gmail.com, sales@beccaspopcorn.com';
//			var email = '3072676486@vtext.com, 3072514153@vtext.com';
			MailService.getOrder(orderId).then(function(order) {
				sendMail(email, 'Order Placed!', 'placed', order.order);
			});
		}
	},

	sendPhoneNotifyToOperator: function(req, res) {
		if(env && env === 'production') {
			var orderId = req.params.id;
			var email = 'sam.barrett@gmail.com, sales@beccaspopcorn.com';
//			var email = '3072676486@vtext.com, 3072514153@vtext.com';
			MailService.getOrder(orderId).then(function(order) {
				promise = Customers.find(order.customerId);
		
				promise.then(function(customers) {
					order.order.customer = customers[0];
					sendMail(email, 'Order Placed!', 'placedPhone', order.order);
				});
			});
		}
	},

	sendFailToOperator: function(req, res) {
		if(env && env === 'production') {
			var email = 'sam.barrett@gmail.com, sales@beccaspopcorn.com';
			var orderId = 'order_id_not_passed';
			if(req.params.id) {
				orderId = req.params.id;
			}
			sendMail(email, 'Payment Failed!', 'failed', orderId);
		}
	},

	sendUpdateToCustomer: function(req, res) {
		if(env && env === 'production') {
			var customerId = req.params.id;
	
			promise = Customers.find(customerId);
	
			promise.then(function(customer) {
				var customer = customer[0];
				var email = customer.phone + '@vtext.com';
				sendMail(email, 'On the Way!', 'update', customer);
			});
		}
	},

	sendConfirmationToCustomer: function(req, res) {
		if(! (env && env === 'production')) {
			return;
		}

		var customerId = req.params.id;

		promise = Customers.find(customerId);

		return promise.then(function(customer) {
			var customer = customer[0];
			return sendMail(
				customer.email,
				'Thanks for Creating an Account at Becca\'s Gourmet Popcorn!', 
				'signup', customer
			);
		}).then(function(sendMailResponse) {
			res.send(sendMailResponse);
		});
	},

	sendFeedbackToManagement: function(req, res) {
		if(env && env === 'production') {
			var feedbackId = req.params.id;
			var email = 'sam.barrett@gmail.com';
			sendMail(email, 'Feedback Received!', 'feedback', feedbackId);
		}
	},

	sendOrderToCustomer: function(req, res) {
		if(env && env === 'production') {
			var orderId = req.params.id;

			MailService.getOrder(orderId).then(function(order) {
	
				promise = Customers.find(order.order.customerId);
		
				promise.then(function(customers) {
					order.order.customer = customers[0];
					sendMail(order.order.customer.email, 'Thanks for Placing an Order!', 'order', order.order);
				});
			});
		}
	},

	sendPhoneOrderToCustomer: function(req, res) {
		if(env && env === 'production') {
			var orderId = req.params.id;

			MailService.getOrder(orderId).then(function(order) {
	
				promise = Customers.find(order.order.customerId);
		
				promise.then(function(customers) {
					order.order.customer = customers[0];
					sendMail(order.order.customer.email, 'Thanks for Placing an Order!', 'orderPhone', order.order);
				});
			});
		}
	},

	sendToApplicant: function(req, res) {
		if(env && env === 'production') {
			var applicantId = req.params.id;
	
			promise = Applicants.find(applicantId);
	
			promise.then(function(applicant) {
				var applicant = applicant[0];
				sendMail(applicant.email, 'Thanks for Applying!', 'apply', applicant);
			});
		}
	}
};

function sendMail(email, subject, template, data) {
console.log('sendMail() called');
	var p = Promise.defer();

	var transporter = nodemailer.createTransport(directTransport());

	var mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <sales@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: '',
			html: ''
		};

	if(template === 'apply') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <info@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Thanks for applying for the role of '+data.position+', '+data.fName+'.  A Becca\'s Gourmet Popcorn team member will contact you soon!',
			html: 'Thanks for applying for the role of <b>'+data.position+'</b>, '+data.fName+'.  A Becca\'s Gourmet Popcorn team member will contact you soon!'
		};
	}

	if(template === 'placed') {
		var items = '';

		data.things.forEach(function(thing) {
			items += thing.quantity + ' ' + thing.option + ' ' + thing.name + ' ($' + (thing.price).toFixed(2) + ' each) <b>$' + (thing.quantity * thing.price).toFixed(2)  + '</b><p/>';
		});

		var paidVia = '';

		if(data.paymentMethods === 'cash') {
			paidVia = 'This order will be paid for in cash at time of delivery';
		} else if(data.paymentMethods === 'phone') {
			paidVia = 'This order was paid for using a credit card over the phone';
		} else {
			paidVia = 'This order was paid for using a credit card online';
		}

		var msgText = 'A new order has been placed! <p/><p/>' + 
			items + 
			'<p/>Order Subtotal: <b>$' + 
			(data.subtotal).toFixed(2) + 
			'</b><p/>Tax: <b>$' + 
			(data.tax).toFixed(2) + 
			'</b><p/>Order Total: <b>$' + 
			(data.total).toFixed(2) + 
			'</b><p/><p/>' + 
			paidVia;

		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <orders@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'A new order has been placed: '+data.id,
			html: msgText
		};
	}

	if(template === 'placedPhone') {
		var items = '';

		data.things.forEach(function(thing) {
			items += thing.quantity + ' ' + thing.option + ' ' + thing.name + ' ($' + (thing.price).toFixed(2) + ' each) <b>$' + (thing.quantity * thing.price).toFixed(2)  + '</b><p/>';
		});

		var paidVia = '';

		if(data.paymentMethods === 'cash') {
			paidVia = 'This order will be paid for in cash at time of delivery';
		} else if(data.paymentMethods === 'phone') {
			paidVia = 'This order was paid for using a credit card over the phone';
		} else {
			paidVia = 'This order was paid for using a credit card online';
		}

		var msgText = 'A new PHONE order has been placed! <p/><p/>' + 
			items + 
			'<p/>Order Subtotal: <b>$' + 
			(data.subtotal).toFixed(2) + 
			'</b><p/>Tax: <b>$' + 
			(data.tax).toFixed(2) + 
			'</b><p/>Order Total: <b>$' + 
			(data.total).toFixed(2) + 
			'</b><p/><p/>' + 
			paidVia;

		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <orders@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'A new PHONE order has been placed: '+data.id,
			html: msgText
		};
	}

	if(template === 'order') {
		var items = '';

		data.things.forEach(function(thing) {
			items += thing.quantity + ' ' + thing.option + ' ' + thing.name + ' ($' + (thing.price).toFixed(2) + ' each) <b>$' + (thing.quantity * thing.price).toFixed(2)  + '</b><p/>';
		});

		var paidVia = '';

		if(data.paymentMethods === 'cash') {
			paidVia = 'This order will be paid for in cash at time of delivery';
		} else if(data.paymentMethods === 'phone') {
			paidVia = 'This order was paid for using a credit card over the phone';
		} else {
			paidVia = 'This order was paid for using a credit card online';
		}

		var msgText = 'Thanks for ordering with <b>Becca\'s Gourmet Popcorn</b>, '+data.customer.fName+'!<p/><p/>' + 
			items + 
			'<p/>Order Subtotal: <b>$' + 
			(data.subtotal).toFixed(2) + 
			'</b><p/>Tax: <b>$' + 
			(data.tax).toFixed(2) + 
			'</b><p/>Order Total: <b>$' + 
			(data.total).toFixed(2) + 
			'</b><p/><p/>' + 
			paidVia;

		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <orders@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Thanks for ordering with Becca\'s Gourmet Popcorn!, '+data.customer.fName+'!  A Becca\'s Gourmet Popcorn team member will deliver your order very soon!',
			html: msgText
		};
	}

	if(template === 'orderPhone') {
		var items = '';

		data.things.forEach(function(thing) {
			items += thing.quantity + ' ' + thing.option + ' ' + thing.name + ' ($' + (thing.price).toFixed(2) + ' each) <b>$' + (thing.quantity * thing.price).toFixed(2)  + '</b><p/>';
		});

		var paidVia = '';

		if(data.paymentMethods === 'cash') {
			paidVia = 'This order will be paid for in cash at time of delivery';
		} else if(data.paymentMethods === 'phone') {
			paidVia = 'This order was paid for using a credit card over the phone';
		} else {
			paidVia = 'This order was paid for using a credit card online';
		}

		var msgText = 'Thanks for ordering with <b>Becca\'s Gourmet Popcorn</b>, '+data.customer.fName+'!<p/><p/>' + 
			items + 
			'<p/>Order Subtotal: <b>$' + 
			(data.subtotal).toFixed(2) + 
			'</b><p/>Tax: <b>$' + 
			(data.tax).toFixed(2) + 
			'</b><p/>Order Total: <b>$' + 
			(data.total).toFixed(2) + 
			'</b><p/><p/>' + 
			paidVia;

		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <orders@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Thanks for ordering with Becca\'s Gourmet Popcorn!, '+data.customer.fName+'!  A Becca\'s Gourmet Popcorn team member will call you soon to process payment for your order!',
			html: msgText
		};
	}

	if(template === 'feedback') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <info@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Feedback has been received: '+data,
			html: 'Feedback has been received. <a href="http://beccaspopcorn.com:3001/#/feedback/'+data+'">Click here to review the feedback</a>.'
		};
	}

	if(template === 'signup') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <sales@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: (
				'Thanks for joining Becca\'s Gourmet Popcorn, '+data.fName+'.  We\'re glad you found us!'
			),
			html: (
				'Thanks for joining <b>Becca\'s Gourmet Popcorn</b>, '+data.fName+'.  We\'re glad you ' +
				'found us!'
			),
		};
	}

	if(template === 'update') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <sales@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Your order has been collected from the restaurant and is on the way!'
		};
	}

	if(template === 'failed') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <info@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Payment for the following order failed:  '+data
		};
	}

	transporter.sendMail(mailOptions, function(err, info) {
		if(err) {
			console.log('mailFail:');
			console.log(err);
			return p.reject(err);
		}

		console.log(template+' message sent');
		p.resolve(info);
	});

	return p.promise;
}

