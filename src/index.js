
// AlaSQL
// -------
import alasql from 'alasql'
import Knex from 'knex'
import Client_Postgres from 'knex/lib/dialects/postgres'
import pick from 'lodash.pick'
import assign from 'lodash.assign'
const Promise = Knex.Promise

const alasqlOptions = Object.keys(alasql.options);

export default class Client_AlaSQL extends Client_Postgres {
  constructor(config) {
    super(config)
    if (typeof config.options == 'object') {
      const options = pick(config.options, alasqlOptions)
      assign(alasql.options, options)
    }
    this.name          = config.name || 'knex_database'
    this.version       = config.version || '1.0'
    this.displayName   = config.displayName || this.name
    this.estimatedSize = config.estimatedSize || 5 * 1024 * 1024
  }

  get dialect() { return 'alasql' }
  get driverName() { return 'alasql' }

  wrapIdentifier(value) {
    return value !== '*' ? '`' + value.replace(/"/g, '""') + '`' : '*'
  }

  // Get a raw connection from the database, returning a promise with the connection object.
  acquireConnection() {
    return new Promise((resolve, reject) => {
      try {
        /*jslint browser: true*/
        var db = alasql.databases[this.name] || new alasql.Database(this.name)
        resolve(db)
      } catch (e) {
        reject(e)
      }
    })
  }

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  releaseConnection() {
    return Promise.resolve()
  }

  // Runs the query on the specified connection,
  // providing the bindings and any other necessary prep work.
  _query(connection, obj) {
    return new Promise(function(resolver, rejecter) {
      if (!connection) return rejecter(new Error('No connection provided.'))
      try {
        obj.response = connection.exec(obj.sql, obj.bindings)
        resolver(obj)
      } catch (e) {
        rejecter(e)
      }
    })
  }

  _stream(connection, sql, stream) {
    return new Promise((resolver, rejecter) => {
      stream.on('error', rejecter)
      stream.on('end', resolver)
      return this._query(connection, sql).then((obj) => {
        return this.processResponse(obj)
      }).map(function(row) {
        stream.write(row)
      }).catch(function(err) {
        stream.emit('error', err)
      }).then(function() {
        stream.end()
      })
    })
  }

  processResponse(obj/*, runner*/) {
    return obj.response
  }

}
