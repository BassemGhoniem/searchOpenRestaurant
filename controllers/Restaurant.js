'use strict';

const restaurantController = (Restaurant) => {
  return {
    /**
     * @function openRestaurants retrieves the list of that's opening
     *            now by passing the query object from the request.
     * @param req {object} the request object
     * @param res {object} the response object
     */
    openRestaurants(req, res) {
      const restaurant = new Restaurant(req.query);
      restaurant
        .openNow()
        .then(result => res.json(result.hits))
        .catch(err => res.status(500).json(err));
    }
  };
};


module.exports = restaurantController;
