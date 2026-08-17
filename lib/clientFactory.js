var pg = require('pg');
var pmx = require('pmx');

function build(conf) {
  var pgClient = {};

  var connectionString = "postgres://" + conf.username + ":" + conf.password + "@" + conf.hostname + ":" + conf.port + "/" + conf.database;

  var pool = new pg.Pool({ connectionString: connectionString });

  pool.on('error', function (err) {
    // Errors on idle clients (e.g. connection dropped) must not crash the process.
    pmx.notify("Postgres pool error: " + err);
  });

  pgClient.query = function (queryString, cb) {
    pool.query(queryString, function (err, result) {
      if (err) {
        pmx.notify("Couldn't query postgres: " + err);
        return cb(err);
      }

      return cb(null, result);
    });
  };

  return pgClient;
}

module.exports.build = build;