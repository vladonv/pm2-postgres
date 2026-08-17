var fs = require('fs');
var path = require('path');
var pmx = require('pmx');
var pgClientFactory = require('./lib/clientFactory.js');
var pgStats = require('./lib/stats.js');
var pgActions = require('./lib/actions.js');

// Debian/Ubuntu's postgresql-common names pidfiles "<version>-main.pid"
// (e.g. "17-main.pid", "9.6-main.pid"). Scanning the directory instead of
// hardcoding a version list keeps this working for future major versions.
function detectPostgresPidPaths() {
  var pgRunDir = '/var/run/postgresql';

  try {
    return fs.readdirSync(pgRunDir)
      .filter(function (name) { return /^\d+(\.\d+)?-main\.pid$/.test(name); })
      .sort(function (a, b) { return parseFloat(b) - parseFloat(a); })
      .map(function (name) { return path.join(pgRunDir, name); });
  } catch (e) {
    return [];
  }
}

pmx.initModule({

  pid: pmx.resolvePidPaths(detectPostgresPidPaths()),

  // Options related to the display style on Keymetrics
  widget: {

    // Logo displayed
    logo: 'http://www.inquidia.com/sites/default/files/postgresql_logo%5B1%5D.png',

    // Module colors
    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme: ['#60798c', '#326892', '#ffffff', '#807C7C'],

    // Section to show / hide
    el: {
      probes: true,
      actions: true
    },

    // Main block to show / hide
    block: {
      actions: true,
      issues: true,
      meta: true,

      // Custom metrics to put in BIG
      main_probes: ['Tables', 'Indexes','Total Tables Size','Backends Active','Exclusive Locks']
    }

  }

}, function (err, conf) {
  var pgClient = pgClientFactory.build(conf);

  // Init metrics refresh loop
  pgStats.init(pgClient);

  // Init actions
  pgActions.init(pgClient);
});
