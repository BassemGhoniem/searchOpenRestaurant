# searchOpenRestaurant

Good example helped me to learn a lot about elasticsearch in two days.
======
This example exports one url `GET /restaurant/open?page=1&per_page=10`
`page` and `per_page` are optional params if not provided will get defaults `page=1`, `per_page=10`
the result of this request is the list of resturant opened in the current time.

`loadCSVdata.js` loads the data and indexes it in the elasticsearch server

I'll work on this example to complete the crud and some searches while diving deeper in the elasticsearch.
