/**
 * PopcornController
 *
 * @description :: Server-side logic for managing tournaments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var Promise = require('bluebird');

var serverError = 'An error occurred. Please try again later.';

var httpAdapter = 'http';
var extra = {};

module.exports = {
	byId: function(req, res) {
		Popcorn.find({id: req.params.id}).sort({
			name: 'asc', entryFee: 'asc'
		}).limit(30).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byCategory: function(req, res) {
		Popcorn.find({category: req.params.id}).sort({
			name: 'asc', entryFee: 'asc'
		}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	resultsByCustomerId: function(req, res) {
		if(req.params.id) {
			return getResultsByCustomerId(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid updateTCC data'}));
		}
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Popcorn.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  }
};

function tournamentRegister(req, res, self) {
	var rpiPcs = req.params.id.split('-');
	var tournamentId = rpiPcs[0];
	var customerId = rpiPcs[1];
	return Popcorns.find({id: tournamentId}).then(function(results) {
		var tournamentData = results[0];
		var MournamentMax;
		if(tournamentData.max == 99999) {
			tournamentMax = 999999999999;
		} else {
			tournamentMax = tournamentData.max;
		}

		if(tournamentData.closed) {
			return res.send(JSON.stringify({success: false, failMsg: 'Closed'}));
		}
		var customerFound = false;
		tournamentData.customers.forEach(function(customer) {
			if(customer === customerId) {
				customerFound = true;
			}
		});
		if(customerFound) {
			return res.send(JSON.stringify({success: false, failMsg: 'Already Registered'}));
		}
		var totalFee = parseFloat(parseFloat(tournamentData.entryFee) + parseFloat(tournamentData.siteFee));
		if(tournamentData.customers.length < tournamentMax) {
			return PopcornsService.getCustomerBalance(customerId).then(function(balanceData) {
				if(balanceData.balance >= totalFee) {
					return PopcornsService.updateCustomerBalance(customerId, balanceData.balance, totalFee, 'subtract').then(function(customerData) {
						if(customerData.success) {
							tournamentData.customers.push(customerId);
							return Popcorns.update({id: tournamentData.id}, {customers: tournamentData.customers}, false, false).then(function(result) {
								return PopcornsService.addCustomer(tournamentData.id, customerId, tournamentData.credits).then(function(tsData) {
									res.send(JSON.stringify(tsData));
								});
							}).catch(function(err) {
								res.json({error: 'Server error'}, 500);
								console.error(err);
								throw err;
							});
						}
						return res.send(JSON.stringify({success: false, failMsg: 'Customer Balance Error'}));
					}).catch(function(err) {
						res.json({error: 'Server error'}, 500);
						console.error(err);
						throw err;
					});	
				} else {
					return res.send(JSON.stringify({success: false, failMsg: 'Insufficient Funds '+totalFee}));
				}
			}).catch(function(err) {
				res.json({error: 'Server error'}, 500);
				console.error(err);
				throw err;
			});
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Full'}));
		}
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}
function tournamentUnregister(req, res, self) {
	var rpiPcs = req.params.id.split('-');
	var tournamentId = rpiPcs[0];
	var customerId = rpiPcs[1];
	return Popcorns.find({id: tournamentId}).then(function(results) {
		var tournamentData = results[0];
		if(tournamentData.closed) {
			return res.send(JSON.stringify({success: false, failMsg: 'Closed'}));
		}
		var customerFound = false;
		tournamentData.customers.forEach(function(customer) {
			if(customer === customerId) {
				customerFound = true;
			}
		});
		if(!customerFound) {
			return res.send(JSON.stringify({success: false, failMsg: 'Not Registered'}));
		}
		var totalFee = parseFloat(parseFloat(tournamentData.entryFee) + parseFloat(tournamentData.siteFee));
		return PopcornsService.getCustomerBalance(customerId).then(function(balanceData) {
			return PopcornsService.updateCustomerBalance(customerId, balanceData.balance, totalFee, 'add').then(function(customerData) {
				if(customerData.success) {
					var newCustomers = [];
					tournamentData.customers.forEach(function(customer) {
						if(customer !== customerId) {
							newCustomers.push(customer);
						}
					});
					return Popcorns.update({id: tournamentData.id}, {customers: newCustomers}, false, false).then(function(result) {
						return PopcornsService.removeCustomer(tournamentData.id, customerId).then(function(tsData) {
							res.send(JSON.stringify(tsData));
						});
					}).catch(function(err) {
						res.json({error: 'Server error'}, 500);
						console.error(err);
						throw err;
					});
				}
				return res.send(JSON.stringify({success: false, failMsg: 'Customer Balance Error'}));
			}).catch(function(err) {
				res.json({error: 'Server error'}, 500);
				console.error(err);
				throw err;
			});	
		}).catch(function(err) {
			res.json({error: 'Server error'}, 500);
			console.error(err);
			throw err;
		});
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}


function tournamentLeaders(req, res, self) {
// TODO check this
console.log('tournamentLeaders() called');
	var tournamentId = req.params.id;
	return Popcorns.find({id: tournamentId}).then(function(results) {
		var tournamentLeadersData = [];
		results[0].customers.sort(dynamicSort("credits"));
		results[0].customers.reverse();
		results[0].customers.forEach(function(customer) {
			tournamentLeadersData.push({customerId: customer.customerId, credits: customer.credits})
		});
		tournamentLeadersData.push(results[0].name);
		res.send(JSON.stringify(tournamentLeadersData));
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function updatePopcornCustomersCredits(req, res, self) {
console.log('updatePopcornCustomersCredits() called');
// TODO check this
	var finalRaceId = req.params.id;
	var acIds = req.body;
	var tournamentId = acIds[0];
	acIds.reverse();
	acIds.pop();
console.log('acIds:');
console.log(acIds);
	return PopcornsService.getWagers(finalRaceId).then(function(wagersData) {
		var wagers = wagersData.wagers;
		var newCustomers = [];
		acIds.forEach(function(customerId) {
			var newCustomer = {};
			newCustomer.customerId = customerId;
			newCustomer.credits = 0;
			wagers.forEach(function(wager) {
				if(wager.customerId === newCustomer.customerId) {
					newCustomer.credits = (newCustomer.credits + parseFloat(wager.result));
				}
			});
			newCustomers.push(newCustomer);
		});
		var finalCustomers = [];
		Popcorns.find({id: tournamentId}).then(function(getPopcornData) {
			getPopcornData[0].customers.forEach(function(gtTC) {
				var finalCustomer = {};
				finalCustomer.customerId = gtTC.customerId;
				finalCustomer.credits = parseFloat(gtTC.credits);
				newCustomers.forEach(function(newCustomerData) {
					if(newCustomerData.customerId === finalCustomer.customerId) {
						finalCustomer.credits = (parseFloat(finalCustomer.credits) + parseFloat(newCustomerData.credits));
					}
				});
				finalCustomers.push(finalCustomer);
			});
		});

		return Popcorns.update(
			{id: tournamentId},
			{customers: finalCustomers},
			false,
			false
		).then(function(results) {
			var tournamentData = results[0];
			res.send(JSON.stringify(tournamentData.customers));
			return {success: true, updatedPopcornData: tournamentData};
		}).catch(function(err) {
			return {error: 'Server error'};
			console.error(err);
			throw err;
		});
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function getResultsByCustomerId(req, res, self) {
	var customerId = req.params.id;
	return PopcornsService.getPopcornResultsByCustomerId(customerId).then(function(gtrResponse) {
		if(gtrResponse.success) {
			res.send(JSON.stringify(gtrResponse.resultsData));
		}
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function updatePopcornStandingsCustomerCredits(req, res, self) {
	var rpPcs = req.params.id.split('-');
	var tournamentId = rpPcs[0];
	var customerId = rpPcs[1];
	var credits = rpPcs[2];
	return PopcornsService.updateTS(tournamentId, customerId, credits).then(function(utsResponse) {
		res.send(JSON.stringify(utsResponse));
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function closeValidPopcorn(req, res, self) {
	var tournamentId = req.params.id;
	return Popcorns.update(
		{id: tournamentId},
		{closed: true},
		false,
		false
	).then(function(updateResponse) {
		res.send(JSON.stringify(updateResponse[0]));
	}).catch(function(err) {
		return {error: 'Server error'};
		console.error(err);
		throw err;
	});
}

function unCloseValidPopcorn(req, res, self) {
	var tournamentId = req.params.id;
	return Popcorns.update(
		{id: tournamentId},
		{closed: false},
		false,
		false
	).then(function(updateResponse) {
		res.send(JSON.stringify(updateResponse[0]));
	}).catch(function(err) {
		return {error: 'Server error'};
		console.error(err);
		throw err;
	});
}

function scoreValidPopcorn(req, res, self) {
	var tournamentId = req.params.id;
	return Popcorns.update(
		{id: tournamentId},
		{scored: true},
		false,
		false
	).then(function(scoreResponse) {
		var tournamentData = scoreResponse[0];
// TODO
// update tournamentstandings
		PopcornsService.getFinalStandings(
			tournamentId,
			tournamentData.name,
			tournamentData.tournyDate,
			tournamentData.credits,
			tournamentData.entryFee,
			tournamentData.siteFee,
			tournamentData.customers
		);
		res.send(JSON.stringify(tournamentData));
	}).catch(function(err) {
		return {error: 'Server error'};
		console.error(err);
		throw err;
	});
}

function createValidCustomPopcorn(req, res, self) {
	return PopcornsService.createCustomPopcorn(req.body).then(function(ictResponse) {
		if(ictResponse.success) {
			return PopcornsService.getCustomerBalance(req.body.customers[0]).then(function(balanceData) {
				var dTotal = parseFloat(req.body.entryFee + req.body.siteFee);
				if(balanceData.balance >= dTotal) {
					return PopcornsService.updateCustomerBalance(req.body.customers[0], balanceData.balance, dTotal, 'subtract').then(function(customerData) {
						if(customerData.success) {
							res.send({success: true, tournamentData: ictResponse.tournamentData});
						} else {
console.log(' ');
console.log('error updating customer balance in createValidCustomPopcorn-PopcornsService.updateCustomerBalance');
console.log(' ');
							res.send({success: false});
						}
					});
				} else {
console.log(' ');
console.log('customer balance('+balanceData.balance+') less than dTotal ('+dTotal+') - this should ***NEVER*** happen');
console.log(' ');
					res.send({success: false});
				}
			});
		} else {
			res.send({success: false});
		}
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function dynamicSort(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

