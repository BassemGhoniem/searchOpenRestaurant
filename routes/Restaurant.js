'use strict';

const routes = (Restaurant) => {
  const express = require('express');
  const restaurantRouter = express.Router();
  /* global include */
  const restaurantController = include('controllers/Restaurant')(Restaurant);
  const validate = include('middleware/validate')(Restaurant);

  // validate the query object before going to the controller.
  restaurantRouter
    .get('/open',
      validate.queryIsValid,
      restaurantController.openRestaurants);

  return restaurantRouter;
};

module.exports = routes;
