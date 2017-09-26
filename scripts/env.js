'use strict';


var pkg = require('../package.json');


var e = {};


e.pkg = pkg;
e.version = pkg.version;
e.prefix = 'sp';
e.name = 'silverplate';
e.codename = 'hulking colossus';
e.clientscript = `${e.name}-${e.version}.js`;


module.exports = e;
