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
			var customerId = req.params.id;
//			var email = '3072676486@vtext.com, 3072581099@vtext.com, 3073151672@vtext.com';
			var email = '3072676486@vtext.com, 3072514153@vtext.com';
			sendMail(email, 'Order Placed!', 'placed', customerId);
		}
	},

	sendPhoneNotifyToOperator: function(req, res) {
		if(env && env === 'production') {
			var customerId = req.params.id;
//			var email = '3072676486@vtext.com, 3072581099@vtext.com, 3073151672@vtext.com';
			var email = '3072676486@vtext.com, 3072514153@vtext.com';
			sendMail(email, 'Order Placed!', 'placedPhone', customerId);
		}
	},

	sendFailToOperator: function(req, res) {
		if(env && env === 'production') {
			var email = 'sam.barrett@gmail.com';
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
			var customerId = req.params.id;
	
			promise = Customers.find(customerId);
	
			promise.then(function(customer) {
				var customer = customer[0];
				sendMail(customer.email, 'Thanks for Placing an Order!', 'order', customer);
			});
		}
	},

	sendPhoneOrderToCustomer: function(req, res) {
		if(env && env === 'production') {
			var customerId = req.params.id;
	
			promise = Customers.find(customerId);
	
			promise.then(function(customer) {
				var customer = customer[0];
				sendMail(customer.email, 'Thanks for Placing an Order!', 'orderPhone', customer);
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
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <sales@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'A new order has been placed!'
		};
	}

	if(template === 'placedPhone') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <sales@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'A new PHONE order has been placed!' // TODO: get orderId nd customerInformation
		};
	}

	if(template === 'order') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <sales@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Thanks for ordering with Becca\'s Gourmet Popcorn!, '+data.fName+'.  A Becca\'s Gourmet Popcorn team member will deliver your order very soon!',
			html: 'Thanks for ordering with <b>Becca\'s Gourmet Popcorn</b>, '+data.fName+'.  A Becca\'s Gourmet Popcorn team member will deliver your order very soon!'
		};
	}

	if(template === 'orderPhone') {
		mailOptions = {
			from: 'Becca\'s Gourmet Popcorn <sales@beccaspopcorn.com>',
			to: email,
			subject: subject,
			text: 'Thanks for ordering with Becca\'s Gourmet Popcorn!, '+data.fName+'.  A Becca\'s Gourmet Popcorn team member will call you soon to process payment for your order!',
			html: 'Thanks for ordering with <b>Becca\'s Gourmet Popcorn</b>, '+data.fName+'.  A Becca\'s Gourmet Popcorn team member will call you soon to process payment for your order!'
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

