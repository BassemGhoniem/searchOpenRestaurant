'use strict';

const moment = require('moment');
const Joi = require('joi');

/* global include */
const es = include('utils/ESConnection');

/**
 * @function getSearchQuery constructs the search query of opening restaurants
 *      - if opening_hr == closing_hr then the restaurant is open 24 hours
 *      - if opening_hr < closing_hr then the restaurant is open if opening_hr < now < closing_hr
 *      - if opening_hr > closing_hr ( the restaurant opens before mid-night
 *        and closes after mid-night) then the restaurant is open in 2 cases
 *              - if opening_hr < now && closing_hr < now
 *              - if opening_hr > now && closing_hr > now
 * @returns {{query: {bool: {should: [*,*,*]}}}}
 */

function getSearchQuery() {
  const now = moment().format('hh:mm:ss A');
  return {
    query: {
      bool: {
        should: [
          {
            script: {
              script: {
                inline: 'doc.opening_hr.value == doc.closing_hr.value',
                lang: 'painless'
              }
            }
          },
          {
            bool: {
              must: [{
                script: {
                  script: {
                    inline: 'doc.opening_hr.value > doc.closing_hr.value',
                    lang: 'painless'
                  }
                }
              }, {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              closing_hr: {
                                lt: now
                              }
                            }
                          }, {
                            range: {
                              opening_hr: {
                                lte: now
                              }
                            }
                          }
                        ]
                      }
                    },
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              closing_hr: {
                                gt: now
                              }
                            }
                          }, {
                            range: {
                              opening_hr: {
                                gte: now
                              }
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }]
            }
          },
          {
            bool: {
              must: [{
                script: {
                  script: {
                    inline: 'doc.opening_hr.value < doc.closing_hr.value',
                    lang: 'painless'
                  }
                }
              },
              {
                range: {
                  closing_hr: {
                    gt: now
                  }
                }
              }, {
                range: {
                  opening_hr: {
                    lte: now
                  }
                }
              }]
            }
          }
        ]
      }
    }
  };
}
class Restaurant {

  /**
   * @constructor initialize the pagination params
   * @param query
   */
  constructor(query) {
    this.pageNum = query.page || 1;
    this.perPage = query.per_page || 10;
  }

  /**
   * @field static field represents the validation schema of the query object
   * @returns {{page: *, per_page: *}}
   */
  static get querySchema() {
    return {
      page: Joi.number().integer().positive(),
      per_page: Joi.number().integer().positive()
    };
  }

  /**
   * @method openNow queries the elastic search
   */
  openNow() {
    const query = getSearchQuery();
    return es.search({
      index: 'elmenus',
      from: (this.pageNum - 1) * this.perPage,
      size: this.perPage,
      body: query
    });
  }
}

module.exports = Restaurant;
