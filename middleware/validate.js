'use strict';

const Promise = require('bluebird');
const joi = Promise.promisifyAll(require('joi'));

/**
 * @exports single function that takes the model class as parameter
 *          creates closure using it for the exported functions.
 * @param Model
 * @returns {{queryIsValid: (function(*, *, *=))}}
 */
module.exports = function (Model) {
  return {

    /**
     * @function queryIsValid validate the query object
     *            against the defined schema at the Model class
     * @param req
     * @param res
     * @param next
     */
    queryIsValid(req, res, next) {
      joi.validateAsync(req.query, Model.querySchema).then((data) => {
        req.query = data;
        next();
      }).catch(next);
    }
  };
};

