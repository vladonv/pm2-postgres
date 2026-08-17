var pmx = require('pmx');

function findLockCount(rows, mode) {
  var row = rows.find(function (row) { return row.mode === mode; });
  return row ? row.count : 'N/A';
}

module.exports = function refreshLockCount(metrics, pgClient) {
  var queryString = "SELECT mode, count(mode) AS count FROM pg_locks GROUP BY mode ORDER BY mode;";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Lock Query Error: " + err);
    }

    // # of Access Share Locks
    metrics.accessShareLockCount.set(findLockCount(results.rows, 'AccessShareLock'));

    // # of Exclusive Locks
    metrics.exclusiveLockCount.set(findLockCount(results.rows, 'ExclusiveLock'));
  });
};