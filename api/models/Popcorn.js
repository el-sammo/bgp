/**
* Popcorn.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
		},
    description: {
      type: 'string',
      required: true
		},
    category: {
      type: 'string',
      required: true
		},
    active: {
      type: 'boolean',
      required: true
		},
		months: {
			type: 'array',
			required: true
		},
		sizes: {
			type: 'array',
			required: true
		}
  }

};

tablize(module.exports);

