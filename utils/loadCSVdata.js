'use strict';

/**
 * Loading and indexing csv data into elasticsearch server
 */
const path = require('path');
const es = require('./ESConnection');

es.indices
  .delete({ index: 'elmenus', ignore: [404] })
  .then(() => es.indices.create({ index: 'elmenus' }))
  .then(() =>
    es.indices.putMapping({
      index: 'elmenus',
      type: 'restaurants',
      body: {
        properties: {
          branches_count: {
            type: 'long'
          },
          city_id: {
            type: 'long'
          },
          closing_hr: {
            type: 'date',
            format: 'hh:mm:ss a'
          },
          created_at: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          },
          delivery_charge: {
            type: 'long'
          },
          description_ar: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256
              }
            }
          },
          description_en: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256
              }
            }
          },
          id: {
            type: 'long'
          },
          menus_count: {
            type: 'long'
          },
          name_ar: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256
              }
            }
          },
          name_en: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256
              }
            }
          },
          opening_hr: {
            type: 'date',
            format: 'hh:mm:ss a'
          },
          photos_count: {
            type: 'long'
          },
          reviews_count: {
            type: 'long'
          },
          updated_at: {
            type: 'date',
            format: 'strict_date_optional_time||epoch_millis'
          }
        }
      }
    })
  )
  .then(() => {
    const ElasticsearchCSV = require('elasticsearch-csv');
    const esCSV = new ElasticsearchCSV({
      es: { index: 'elmenus', type: 'restaurants', host: 'localhost:9200' },
      csv: { filePath: path.join(__dirname, './restaurants.csv'), headers: true }
    });
    return esCSV.import();
  })
  .then(console.dir)
  .catch(console.error);
