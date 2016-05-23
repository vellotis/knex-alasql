# knex-alasql

An [AlaSQL](http://alasql.org/) client for [knex.js](http://knexjs.org)

**Works only with knex.js >=0.11.4**



## Install

```bash
npm install knex-alasql
```

## Usage

```js
var knex = require('knex');
var client = require('knex-alasql');

var knexClient = knex({

	client: client,

	// Optional properties with default values
	name: 'knex_database',
	version: '1.0',
	displayName: 'knex_database', // inherited from 'name'
	estimatedSize: 5 * 1024 * 1024 // 5MB
});
```

## TODO

- **!!! Tests !!!**
- **!!! Known issues !!!**
- **!!! ESLINT !!!**

## Acknowledgements

Thank you to @randomnerd for proposing AlaSQL as a dialect for knex as [PR](tgriesser/knex#1063). As well great thanks to @tgriesser and all the other knex.js contributors for building such a great query builder.

### Copyright and License

Copyright Kaarel Raspel, 2014

[MIT Licence](LICENSE)