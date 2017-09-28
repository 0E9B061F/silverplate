'use strict';


var pkg = require('../package.json');


var e = {};


e.pkg = pkg;
e.name = pkg.name;
e.version = pkg.version;
e.prefix = 'sp';
e.codename = 'hulking colossus';
e.clientscript = `${e.name}-${e.version}.js`;


module.exports = e;
